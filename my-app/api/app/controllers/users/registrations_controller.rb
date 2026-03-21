class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]

  private

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
  end

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: '登録が完了しました',
        user: {
          id: resource.id,
          nickname: resource.nickname,
          email: resource.email
        }
      }, status: :created
    else
      render json: {
        message: '登録ができませんでした',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
end