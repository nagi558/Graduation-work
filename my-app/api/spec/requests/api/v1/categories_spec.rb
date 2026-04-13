require 'rails_helper'

RSpec.describe 'Api::V1::Categories', type: :request do
  let(:user) { create(:user) }
  let!(:category) { create(:category, user: user) }
  let(:headers) { auth_headers(user) }

  def json
    JSON.parse(response.body)
  end

  describe 'GET /api/v1/categories' do
    context '認証済みの場合' do
      it '200を返しリストを返す' do
        get '/api/v1/categories', headers: headers
        expect(response).to have_http_status(:ok)
        expect(json).to be_an(Array)
        expect(json.size).to eq(4)
        expect(json.first['name']).to eq(category.name)
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        get '/api/v1/categories'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/v1/categories' do
    context '認証済みの場合' do
      it '201を返しDBに保存される' do
        expect {
          post '/api/v1/categories',
            params: { category: { name: 'テストカテゴリ' } },
            headers: headers
        }.to change(Category, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json['name']).to eq('テストカテゴリ')
      end

      context '無効なパラメータの場合' do
        it '422を返す' do
          post '/api/v1/categories',
            params: { category: { name: '' } },
            headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        post '/api/v1/categories',
          params: { category: { name: 'テストカテゴリ' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH /api/v1/categories/:id' do
    context '認証済みの場合' do
      it '200を返しDBが更新される' do
        patch "/api/v1/categories/#{category.id}",
          params: { category: { name: '更新カテゴリ' } },
          headers: headers
        expect(response).to have_http_status(:ok)
        expect(category.reload.name).to eq('更新カテゴリ')
      end

      context '無効なパラメータの場合' do
        it '422を返す' do
          patch "/api/v1/categories/#{category.id}",
            params: { category: { name: '' } },
            headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        patch "/api/v1/categories/#{category.id}",
          params: { category: { name: '更新カテゴリ' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context '他のユーザーのカテゴリの場合' do
      it '404を返す' do
        other_user = create(:user)
        other_category = create(:category, user: other_user)
        patch "/api/v1/categories/#{other_category.id}",
          params: { category: { name: '更新カテゴリ' } },
          headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE /api/v1/categories/:id' do
    context '認証済みの場合' do
      it '200を返しDBから削除される' do
        expect {
          delete "/api/v1/categories/#{category.id}",
            headers: headers
        }.to change(Category, :count).by(-1)
        expect(response).to have_http_status(:ok)
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        delete "/api/v1/categories/#{category.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context '他のユーザーのカテゴリの場合' do
      it '404を返す' do
        other_user = create(:user)
        other_category = create(:category, user: other_user)
        delete "/api/v1/categories/#{other_category.id}",
          headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end