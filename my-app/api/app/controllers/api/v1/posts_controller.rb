class Api::V1::PostsController < ApplicationController
  before_action :authenticate_user!

  # 一覧取得
  def index
    posts = current_user.posts.includes(:category).order(created_at: :desc)
    render json: posts.as_json(include: :category), status: :ok
  end
end