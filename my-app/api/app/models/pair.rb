class Pair < ApplicationRecord
  has_many :pair_memberships, dependent: :destroy
  has_many :users, through: :pair_memberships
  has_many :post_permissions, dependent: :destroy

  def generate_invitation_token!
    update!(
      invitation_token: SecureRandom.urlsafe_base64(32),
      invitation_token_expires_at: 24.hours.from_now
    )
  end

  def invitation_token_valid?
    invitation_token.present? &&
    invitation_token_expires_at.present? &&
    invitation_token_expires_at > Time.current
  end
end