FactoryBot.define do
  factory :user do
    nickname { Faker::Name.name}
    sequence(:email) { |n| "test#{n}@example.com" }
    password { 'password123' }
    password_confirmation { password }

    trait :with_google do
      google_uid { SecureRandom.uuid }
    end
  end
end