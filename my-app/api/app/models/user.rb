class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :categories, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_one :pair_membership, dependent: :destroy
  has_one :pair, through: :pair_membership

  after_create :create_default_categories

  def self.find_or_create_by_google(google_uid:, email:, name:)
    user = find_by(google_uid: google_uid)
    return user if user

    user = find_by(email: email)
    if user
      user.update!(google_uid: google_uid)
      return user
    end

    create!(
      google_uid: google_uid,
      email:      email,
      name:       name,
      uid:        email,
      provider:   'email',
      password:   Devise.friendly_token[0, 20]
    )
  end

  def paired?
    pair.present?
  end

  def partner
    return nil unless paired?
    pair.users.where.not(id: id).first
  end

  private

  def create_default_categories
    ["お金", "仕事", "生活"].each do |name|
      categories.find_or_create_by!(name: name)
    end
  end
end