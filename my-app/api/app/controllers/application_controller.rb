class ApplicationController < ActionController::API
  before_action :authenticate_user!

  private
  
  def authenticate_user!
    super
  end
end
