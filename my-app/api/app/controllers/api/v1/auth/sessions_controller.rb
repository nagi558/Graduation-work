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
      end
    end
  end
end
