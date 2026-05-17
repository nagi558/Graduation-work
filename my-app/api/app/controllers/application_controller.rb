class ApplicationController < ActionController::API
  include ActionController::Cookies
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :set_auth_headers_from_cookie

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
    devise_parameter_sanitizer.permit(:account_update, keys: [:nickname])
  end

  private

  def set_auth_headers_from_cookie
    return if cookies[:auth_tokens].blank?

    token_data = parse_auth_cookie
    return if token_data.nil?

    assign_auth_headers(token_data)
  end

  def parse_auth_cookie
    JSON.parse(cookies[:auth_tokens])
  rescue JSON::ParserError
    nil
  end

  def assign_auth_headers(token_data)
    request.headers['access-token'] = token_data['access-token']
    request.headers['client'] = token_data['client']
    request.headers['uid'] = token_data['uid']
  end

  def write_auth_cookie(token)
  cookies[:auth_tokens] = {
    value:     token.to_json,
    httponly:  true,
    secure:    Rails.env.production?,
    same_site: :lax,
    expires:   2.weeks.from_now
  }
end

def delete_auth_cookie
  cookies.delete(:auth_tokens)
end
end
