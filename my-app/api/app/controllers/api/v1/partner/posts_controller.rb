class Api::V1::Partner::PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :require_pair!

  def index
    posts = current_user.partner.posts
      .includes(:category, :post_permission)
      .joins(:post_permission)
      .where(post_permissions: { can_view: true })
      .order(created_at: :desc)

    render json: posts.map { |post| post_json(post) }, status: :ok
  end

  def show
    post = current_user.partner.posts
      .joins(:post_permission)
      .where(post_permissions: { can_view: true })
      .find(params[:id])

    render json: post_json(post), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ['閲覧権限がありません'] }, status: :forbidden
  end

  private

  def require_pair!
    unless current_user.paired?
      render json: { errors: ['パートナーと接続されていません'] }, status: :forbidden
    end
  end

  def post_json(post)
    {
      id: post.id,
      title: post.title,
      body: post.body,
      category: { id: post.category.id, name: post.category.name },
      created_at: post.created_at
    }
  end
end