require 'rails_helper'

RSpec.describe 'Api::V1::Posts', type: :request do
  let(:user) { create(:user) }
  let(:category) { create(:category, user: user) }
  let!(:post_record) { create(:post, user: user, category: category) } # ← let!に変更
  let(:headers) { auth_headers(user) } # ← 共通化

  def json
    JSON.parse(response.body)
  end

  describe 'GET /api/v1/posts' do
    context '認証済みの場合' do
      it '200を返しリストを返す' do
        get '/api/v1/posts', headers: headers
        expect(response).to have_http_status(:ok)
        expect(json).to be_an(Array)
        expect(json.first).to have_key('title')
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        get '/api/v1/posts'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/v1/posts' do
    context '認証済みの場合' do
      it '201を返しDBに保存される' do
        expect {
          post '/api/v1/posts',
            params: { post: { title: 'テスト', body: 'テスト本文', category_id: category.id } },
            headers: headers
        }.to change(Post, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json['title']).to eq('テスト')
      end

      context '無効なパラメータの場合' do
        it '422を返す' do
          post '/api/v1/posts',
            params: { post: { title: '', body: '', category_id: nil } },
            headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        post '/api/v1/posts',
          params: { post: { title: 'テスト', body: 'テスト本文', category_id: category.id } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH /api/v1/posts/:id' do
    context '認証済みの場合' do
      it '200を返しDBが更新される' do
        patch "/api/v1/posts/#{post_record.id}",
          params: { post: { title: '更新タイトル' } },
          headers: headers
        expect(response).to have_http_status(:ok)
        expect(post_record.reload.title).to eq('更新タイトル') # ← DB反映チェック
      end

      context '無効なパラメータの場合' do
        it '422を返す' do
          patch "/api/v1/posts/#{post_record.id}",
            params: { post: { title: '' } },
            headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        patch "/api/v1/posts/#{post_record.id}",
          params: { post: { title: '更新タイトル' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context '他のユーザーの投稿の場合' do
      it '404を返す' do
        other_user = create(:user)
        other_post = create(:post, user: other_user, category: create(:category, user: other_user))
        patch "/api/v1/posts/#{other_post.id}",
          params: { post: { title: '更新タイトル' } },
          headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE /api/v1/posts/:id' do
    context '認証済みの場合' do
      it '200を返しDBから削除される' do
        expect {
          delete "/api/v1/posts/#{post_record.id}",
            headers: headers
        }.to change(Post, :count).by(-1)
        expect(response).to have_http_status(:ok)
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        delete "/api/v1/posts/#{post_record.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context '他のユーザーの投稿の場合' do
      it '404を返す' do
        other_user = create(:user)
        other_post = create(:post, user: other_user, category: create(:category, user: other_user))
        delete "/api/v1/posts/#{other_post.id}",
          headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end