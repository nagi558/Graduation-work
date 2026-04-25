FactoryBot.define do
  factory :contact do
    sequence(:email) { |n| "contact#{n}@example.com" }
    body { 'テスト用のお問い合わせ内容です。' }
  end
end