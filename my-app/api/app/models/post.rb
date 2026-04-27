class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category

  validates :title, presence: true
  validates :body, presence: true

  scope :search_title, ->(title) {
    return all if title.blank?
    sanitized = ActiveRecord::Base.sanitize_sql_like(title)
    where('title LIKE ?', "%#{sanitized}%")
  }

  scope :search_body, ->(body) {
    return all if body.blank?
    sanitized = ActiveRecord::Base.sanitize_sql_like(body)
    where('body LIKE ?', "%#{sanitized}%")
  }
end
