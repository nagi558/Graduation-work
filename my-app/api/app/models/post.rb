class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_one :post_permission, dependent: :destroy

  validates :title, presence: true
  validates :body, presence: true

  scope :search_title, lambda { |title|
    return all if title.blank?

    sanitized = ActiveRecord::Base.sanitize_sql_like(title)
    where('title LIKE ?', "%#{sanitized}%")
  }

  scope :search_body, lambda { |body|
    return all if body.blank?

    sanitized = ActiveRecord::Base.sanitize_sql_like(body)
    where('body LIKE ?', "%#{sanitized}%")
  }
end
