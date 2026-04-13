class Api::V1::CategoryPostsController < ApplicationController
  before_action :authenticate_user!

  def index
    category = current_user.categories.find(params[:category_id])
    posts = category.posts.order(created_at: :desc)
    render json: posts.as_json(
      only: [:id, :title, :body, :created_at, :updated_at],
      include: { category: { only: [:id, :name] } }
    ), status: :ok
  end
end