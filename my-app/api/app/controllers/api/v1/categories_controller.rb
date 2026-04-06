class Api::V1::CategoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_category, only: [:show, :update, :destroy]

  # 一覧取得
  def index
    categories = current_user.categories.order(created_at: :desc)
    render json: categories.as_json(
      only: [:id, :name, :created_at, :updated_at]
    ), status: :ok
  end

  # カテゴリ作成
  def create
    category = current_user.categories.build(category_params)
    if category.save
      render json: category.as_json(
        only: [:id, :name, :created_at, :updated_at]
      ), status: :created
    else
      render json:{ errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: @category.as_json(
      only: [:id, :name, :created_at, :updated_at]
    ), status: :ok
  end

  def update
    if @category.update(category_params)
      render json: @category.as_json(
        only: [:id, :name, :created_at, :updated_at]
      ), status: :ok
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  #カテゴリ削除
  def destroy
    @category.destroy
    render json: { message: 'カテゴリを削除しました' }, status: :ok
  end

  private

  def set_category
    @category = current_user.categories.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:name)
  end
end