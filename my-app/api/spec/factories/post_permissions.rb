FactoryBot.define do
  factory :post_permission do
    post
    pair
    can_view { false }

    trait :visible do
      can_view { true }
    end
  end
end