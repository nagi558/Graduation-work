require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Google', type: :request do
  describe 'POST /api/v1/auth/google' do
    let(:google_uid)    { '123456789012345678901' }
    let(:email)         { 'test@gmail.com' }
    let(:name)          { 'テストユーザー' }
    let(:id_token)      { 'valid_token' }
    let(:valid_payload) do
      {
        'sub'   => google_uid,
        'email' => email,
        'name'  => name
      }
    end

    context '有効なIDトークンの場合' do
      before do
        allow(Google::Auth::IDTokens).to receive(:verify_oidc)
          .with(id_token, aud: ENV['GOOGLE_CLIENT_ID'])
          .and_return(valid_payload)
      end

      context '新規ユーザーの場合' do
        it '200を返す' do
          post '/api/v1/auth/google', params: { id_token: id_token }
          expect(response).to have_http_status(:ok)
        end

        it 'ユーザーが作成される' do
          expect {
            post '/api/v1/auth/google', params: { id_token: id_token }
          }.to change(User, :count).by(1)
        end

        it 'レスポンスヘッダーに必要なトークンが全て含まれる' do
          post '/api/v1/auth/google', params: { id_token: id_token }
          expect(response.headers['access-token']).to be_present
          expect(response.headers['client']).to be_present
          expect(response.headers['uid']).to be_present
        end

        it 'レスポンスボディのdataキーが正しい構造を持つ' do
          post '/api/v1/auth/google', params: { id_token: id_token }
          json = JSON.parse(response.body)
          expect(json['data'].keys).to match_array(%w[id email name])
        end

        it 'レスポンスボディにユーザー情報が正しく含まれる' do
          post '/api/v1/auth/google', params: { id_token: id_token }
          json = JSON.parse(response.body)
          expect(json['data']['email']).to eq(email)
          expect(json['data']['name']).to eq(name)
          expect(json['data']['id']).to be_present
        end
      end

      context '既存ユーザーの場合' do
        let!(:existing_user) { create(:user, :with_google, google_uid: google_uid, email: email) }

        it '200を返す' do
          post '/api/v1/auth/google', params: { id_token: id_token }
          expect(response).to have_http_status(:ok)
        end

        it '新しいユーザーを作成しない' do
          expect {
            post '/api/v1/auth/google', params: { id_token: id_token }
          }.not_to change(User, :count)
        end
      end
    end

    context '無効なIDトークンの場合' do
      before do
        allow(Google::Auth::IDTokens).to receive(:verify_oidc)
          .with('invalid_token', aud: ENV['GOOGLE_CLIENT_ID'])
          .and_raise(Google::Auth::IDTokens::VerificationError.new('invalid token'))
      end

      it '401を返す' do
        post '/api/v1/auth/google', params: { id_token: 'invalid_token' }
        expect(response).to have_http_status(:unauthorized)
      end

      it 'エラーメッセージを返す' do
        post '/api/v1/auth/google', params: { id_token: 'invalid_token' }
        json = JSON.parse(response.body)
        expect(json['message']).to eq('Googleトークンの検証に失敗しました')
      end

      it 'ユーザーが作成されない' do
        expect {
          post '/api/v1/auth/google', params: { id_token: 'invalid_token' }
        }.not_to change(User, :count)
      end

      it 'エラーログが出力される' do
        expect(Rails.logger).to receive(:error).with(/Google IDトークン検証エラー/)
        post '/api/v1/auth/google', params: { id_token: 'invalid_token' }
      end
    end
  end
end