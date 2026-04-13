module AuthHelper
  def auth_headers(user)
    post '/auth/sign_in', params: { email: user.email, password: user.password }
    {
      'access-token' => response.headers['access-token'],
      'client' => response.headers['client'],
      'uid' => response.headers['uid']
    }
  end
end