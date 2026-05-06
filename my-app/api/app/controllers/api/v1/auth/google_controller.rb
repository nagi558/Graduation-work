module Api
  module V1
    module Auth
      class GoogleController < ApplicationController
        skip_before_action :authenticate_user!, raise: false

        def create
          payload = verify_google_id_token(params[:id_token])
          return render json: { message: 'Googleトークンの検証に失敗しました' }, status: :unauthorized if payload.nil?

          user = User.find_or_create_by_google(
            google_uid: payload['sub'],
            email: payload['email'],
            name: payload['name']
          )

          user.persisted? ? render_success(user) : render_failure(user)
        end

        private

        def render_success(user)
          token = user.create_new_auth_token
          response.headers.merge!(token)
          render json: { data: { id: user.id, email: user.email, name: user.name } }, status: :ok
        end

        def render_failure(user)
          render json: { message: 'ユーザーの作成に失敗しました', errors: user.errors.full_messages },
                 status: :unprocessable_content
        end

        def verify_google_id_token(id_token)
          Google::Auth::IDTokens.verify_oidc(id_token, aud: ENV.fetch('GOOGLE_CLIENT_ID', nil))
        rescue Google::Auth::IDTokens::VerificationError => e
          Rails.logger.error "Google IDトークン検証エラー: #{e.message}"
          nil
        end
      end
    end
  end
end
