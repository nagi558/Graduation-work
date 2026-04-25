require 'rails_helper'

RSpec.describe 'Api::V1::Contacts', type: :request do
  def json
    JSON.parse(response.body)
  end

  describe 'POST /api/v1/contacts' do
    context '有効なパラメータの場合' do
      it '201を返しDBに保存される' do
        expect {
          post '/api/v1/contacts',
            params: { contact: { email: 'test@example.com', body: 'テスト用のお問い合わせ内容です。' } }
        }.to change(Contact, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json['message']).to eq('お問い合わせを受け付けました')
      end

      it 'メールが2通送信される' do
        expect {
          post '/api/v1/contacts',
            params: { contact: { email: 'test@example.com', body: 'テスト用のお問い合わせ内容です。' } }
        }.to change { ActionMailer::Base.deliveries.count }.by(2)
      end
    end

    context '無効なパラメータの場合' do
      context 'メールアドレスが空の場合' do
        it '422を返す' do
          post '/api/v1/contacts',
            params: { contact: { email: '', body: 'テスト用のお問い合わせ内容です。' } }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json['errors']).to be_present
        end
      end

      context 'メールアドレスの形式が不正の場合' do
        it '422を返す' do
          post '/api/v1/contacts',
            params: { contact: { email: 'invalid-email', body: 'テスト用のお問い合わせ内容です。' } }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json['errors']).to be_present
        end
      end

      context '本文が空の場合' do
        it '422を返す' do
          post '/api/v1/contacts',
            params: { contact: { email: 'test@example.com', body: '' } }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json['errors']).to be_present
        end
      end

      context '本文が10文字未満の場合' do
        it '422を返す' do
          post '/api/v1/contacts',
            params: { contact: { email: 'test@example.com', body: '短い' } }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json['errors']).to be_present
        end
      end

      context '本文が2000文字を超える場合' do
        it '422を返す' do
          post '/api/v1/contacts',
            params: { contact: { email: 'test@example.com', body: 'a' * 2001 } }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(json['errors']).to be_present
        end
      end
    end
  end
end