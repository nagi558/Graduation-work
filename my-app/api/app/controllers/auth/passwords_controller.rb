class Auth::PasswordsController < DeviseTokenAuth::PasswordsController
  def create
    super
  end

  def update
    super
  end

  private

  def resource_params
    if action_name == 'create'
      params.permit(:email, :redirect_url)
    else
      params.permit(:password, :password_confirmation, :reset_password_token)
    end
  end

  def render_create_error_missing_email
    render json: { message: 'メールアドレスを入力してください' }, status: :unprocessable_entity
  end

  def render_not_found_error
    render json: { message: 'このメールアドレスは登録されていません' }, status: :not_found
  end
end