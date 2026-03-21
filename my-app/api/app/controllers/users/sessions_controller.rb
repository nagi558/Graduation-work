class Users::SessionsController < Devise::SessionsController
  respond_to :json

  skip_before_action :verify_signed_out_user, only: [:destroy]

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: 'ログインしました',
      user: {
        id: resource.id,
        nickname: resource.nickname,
        email: resource.email
      }
    }, status: :ok
  end

  def respond_to_on_destroy(*args)
    render json: {
      message: 'ログアウトしました'
    }, status: :ok
  end
end