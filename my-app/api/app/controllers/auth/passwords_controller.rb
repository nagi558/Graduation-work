class Auth::PasswordsController < DeviseTokenAuth::PasswordsController
  def create
    super
  end

  private

  def resource_params
    params.permit(:email, :redirect_url)
  end

  def render_create_error_missing_email
    render json: { message: 'メールアドレスを入力してください' }, status: :unprocessable_entity
  end

  def render_not_found_error
    render json: { message: 'このメールアドレスは登録されていません' }, status: :not_found
  end
end