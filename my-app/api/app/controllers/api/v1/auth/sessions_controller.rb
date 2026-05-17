module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController
        def create
          super do |user|
            token = user.create_new_auth_token
            write_auth_cookie(token)
          end
        end

        def destroy
          super
          delete_auth_cookie
        end

        private

        def write_auth_cookie(token)
          cookies[:auth_tokens] = {
            value: token.to_json,
            httponly: true,
            secure: Rails.env.production?,
            same_site: :lax,
            expires: 2.weeks.from_now
          }
        end

        def delete_auth_cookie
          cookies.delete(:auth_tokens)
        end
      end
    end
  end
end
