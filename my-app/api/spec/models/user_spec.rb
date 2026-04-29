require 'rails_helper'

RSpec.describe User, type: :model do
  describe '.find_or_create_by_google' do
    let(:google_uid) { '123456789012345678901' }
    let(:email)      { 'test@gmail.com' }
    let(:name)       { 'テストユーザー' }

    context '該当するgoogle_uidのユーザーが存在する場合' do
      let!(:existing_user) { create(:user, :with_google, google_uid: google_uid, email: email) }

      it '既存のユーザーを返す' do
        user = User.find_or_create_by_google(
          google_uid: google_uid,
          email: email,
          name: name
        )
        expect(user).to eq(existing_user)
      end

      it '新しいユーザーを作成しない' do
        expect {
          User.find_or_create_by_google(
            google_uid: google_uid,
            email: email,
            name: name
          )
        }.not_to change(User, :count)
      end
    end

    context 'メール登録済みのユーザーがGoogleでログインする場合' do
      let!(:existing_user) { create(:user, email: email) }

      it '既存のユーザーにgoogle_uidを紐付ける' do
        user = User.find_or_create_by_google(
          google_uid: google_uid,
          email: email,
          name: name
        )
        expect(user).to eq(existing_user)
        expect(user.google_uid).to eq(google_uid)
      end

      it '新しいユーザーを作成しない' do
        expect {
          User.find_or_create_by_google(
            google_uid: google_uid,
            email: email,
            name: name
          )
        }.not_to change(User, :count)
      end

      it 'update!が失敗した場合は例外が発生する' do
        allow(existing_user).to receive(:update!).and_raise(ActiveRecord::RecordInvalid)
        allow(User).to receive(:find_by).with(google_uid: google_uid).and_return(nil)
        allow(User).to receive(:find_by).with(email: email).and_return(existing_user)

        expect {
          User.find_or_create_by_google(
            google_uid: google_uid,
            email: email,
            name: name
          )
        }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context '新規ユーザーの場合' do
      it '新しいユーザーを作成する' do
        expect {
          User.find_or_create_by_google(
            google_uid: google_uid,
            email: email,
            name: name
          )
        }.to change(User, :count).by(1)
      end

      it '正しい属性でユーザーを作成する' do
        user = User.find_or_create_by_google(
          google_uid: google_uid,
          email: email,
          name: name
        )
        expect(user.google_uid).to eq(google_uid)
        expect(user.email).to eq(email)
      end
    end

    # カテゴリ作成はUserモデルのコールバックの責務として別で検証
    describe 'after_createコールバック' do
      it 'デフォルトカテゴリが作成される' do
        user = create(:user)
        expect(user.categories.pluck(:name)).to match_array(['お金', '仕事', '生活'])
      end
    end
  end
end