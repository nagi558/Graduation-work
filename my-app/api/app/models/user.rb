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

    attach_google_uid_to_existing(email, google_uid) || create_google_user(google_uid, email, name)
  end

  def paired?
    pair.present? && pair.pair_memberships.count == 2
  end

  def pending?
    pair.present? && pair.pair_memberships.one?
  end

  def partner
    return nil unless paired?

    pair.users.where.not(id: id).first
  end

  private_class_method def self.attach_google_uid_to_existing(email, google_uid)
    user = find_by(email: email)
    return nil unless user

    user.update!(google_uid: google_uid)
    user
  end

  private_class_method def self.create_google_user(google_uid, email, name)
    create!(
      google_uid: google_uid,
      email: email,
      name: name,
      uid: email,
      provider: 'email',
      password: Devise.friendly_token[0, 20]
    )
  end

  def create_default_categories
    %w[お金 仕事 生活].each do |name|
      categories.find_or_create_by!(name: name)
    end
  end
end
