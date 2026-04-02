class Api::V1::CategoriesController < ApplicationController
  before_action :authenticate_user!

  # 一覧取得
  def index
    categories = current_user.categories.order(created_at: :desc)
    render json: categories, status: :ok
  end

  # 作成
  def create
    category = current_user.categories.build(category_params)
    if category.save
      render json: category, status: :created
    else
      render json:{ errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  #削除
  def destroy
    category = current_user.categories.find(params[:id])
    category.destroy
    render json: { message: 'カテゴリを削除しました' }, status: :ok
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end
end