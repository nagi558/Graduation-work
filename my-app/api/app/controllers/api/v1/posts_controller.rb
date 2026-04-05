class Api::V1::PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [:show, :update, :destroy]

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

  def show
    render json: @post.as_json(
      only: [:id, :title, :body, :created_at, :updated_at],
      include: { category: {only: [:id, :name] } }
    ), status: :ok
  end

  # 投稿更新
  def update
    if @post.update(post_params)
      render json: @post.as_json(
        only: [:id, :title, :body, :created_at, :updated_at],
        include: { category: { only: [:id, :name] } }
      ), status: :ok
    else
      render json: { errors: @post.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # 投稿削除
  def destroy
    @post.destroy
    render json: { message: '投稿を削除しました' }, status: :ok
  end

  private

  def set_post
    @post = current_user.posts.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :body, :category_id)
  end
end