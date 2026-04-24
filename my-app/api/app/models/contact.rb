class Contact < ApplicationRecord
  validates :email,
             presence: true,
             format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :body,
             presence: true,
             length: { minimum: 10, maximum: 2000}
end