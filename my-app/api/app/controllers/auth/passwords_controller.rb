class Auth::PasswordsController < DeviseTokenAuth::PasswordsController
  private

  def render_create_error_missing_email
    render json: { message: 'メールアドレスを入力してください' }, status: :unprocessable_entity
  end

  def render_not_found_error
    render json: { message: 'メールアドレスは登録されていません' }, status: :not_found
  end
end