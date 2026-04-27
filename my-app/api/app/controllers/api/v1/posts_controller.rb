class Api::V1::PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    posts = current_user.posts
      .includes(:category)
      .order(created_at: :desc)
      .search_title(params[:title])
      .search_body(params[:body])

    render json: posts, status: :ok
  end

  def create
    post = current_user.posts.build(post_params)
    if post.save
      render json: post, status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: @post, status: :ok
  end

  def update
    if @post.update(post_params)
      render json: @post, status: :ok
    else
      render json: { errors: @post.errors.full_messages}, status: :unprocessable_entity
    end
  end

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