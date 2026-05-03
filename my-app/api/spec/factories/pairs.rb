FactoryBot.define do
  factory :pair do
    trait :with_members do
      transient do
        owner { association :user }
        member { association :user }
      end

      after(:create) do |pair, evaluator|
        create(:pair_membership, pair: pair, user: evaluator.owner)
        create(:pair_membership, pair: pair, user: evaluator.member)
      end
    end

    trait :with_invitation_token do
      invitation_token { SecureRandom.urlsafe_base64(32) }
      invitation_token_expires_at { 48.hours.from_now }  # 24 → 48 に変更
    end

    trait :with_expired_token do
      invitation_token { SecureRandom.urlsafe_base64(32) }
      invitation_token_expires_at { 25.hours.ago }  # 余裕を持たせる
    end
  end
end