require 'googleauth/id_tokens'

module Api
  module V1
    module Auth
      class GoogleController < ApplicationController
        skip_before_action :authenticate_user!, raise: false

        def create
          payload = verify_google_id_token(params[:id_token])

          if payload.nil?
            return render json: { message: 'Googleトークンの検証に失敗しました' }, status: :unauthorized
          end

          user = User.find_or_create_by_google(
            google_uid: payload['sub'],
            email:      payload['email'],
            name:       payload['name']
          )

          if user.persisted?
            token = user.create_new_auth_token
            response.headers.merge!(token)
            render json: {
              data: {
                id:    user.id,
                email: user.email,
                name:  user.name
              }
            }, status: :ok
          else
            render json: { message: 'ユーザーの作成に失敗しました', errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def verify_google_id_token(id_token)
          validator = Google::Auth::IDTokens
          payload = validator.verify_oidc(
            id_token,
            aud: ENV['GOOGLE_CLIENT_ID']
          )
          payload
        rescue Google::Auth::IDTokens::VerificationError => e
          Rails.logger.error "Google IDトークン検証エラー: #{e.message}"
          nil
        end
      end
    end
  end
end