class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :categories, dependent: :destroy
  has_many :posts, dependent: :destroy

  after_create :create_default_categories

  private

  def create_default_categories
    ["お金", "仕事", "生活"].each do |name|
      categories.find_or_create_by!(name: name)
    end
  end
end