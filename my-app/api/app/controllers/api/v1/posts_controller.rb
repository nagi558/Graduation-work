class Api::V1::PostsController < ApplicationController
  before_action :authenticate_user!

  # 一覧取得
  def index
    posts = current_user.posts.includes(:category).order(created_at: :desc)
    render json: posts.as_json(
      only: [:id, :title, :body, :created_at, :updated_at],
      include: {
        category: {
          only: [:id, :name]
        }
      }
    ), status: :ok
  end

  # 投稿作成
  def create
    post = current_user.posts.build(post_params)
    if post.save
      render json: post.as_json(
        only: [:id, :title, :body, :created_at, :updated_at],
        include: {
          category: {
            only: [:id, :name]
          }
        }
      ), status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :body, :category_id)
  end
end