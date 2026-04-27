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
    let(:user_posts_count) { Post.where(user: user).count }

    context '認証済みの場合' do
      it '全件返す' do
        get '/api/v1/posts', headers: headers
        expect(response).to have_http_status(:ok)
        expect(json.length).to eq(user_posts_count)
      end

      context 'タイトル検索' do
        let!(:matched_post) { create(:post, user: user, category: category, title: '一致するタイトル') }
        let!(:unmatched_post) { create(:post, user: user, category: category, title: '関係ないタイトル') }

        it '部分一致する投稿のみ返す' do
          get '/api/v1/posts', params: { title: '一致' }, headers: headers
          expect(response).to have_http_status(:ok)
          titles = json.map { |p| p['title'] }
          expect(titles).to include('一致するタイトル')
          expect(titles).not_to include('関係ないタイトル')
        end

        it '検索結果が0件の場合は空配列を返す' do
          get '/api/v1/posts', params: { title: '存在しないタイトル' }, headers: headers
          expect(response).to have_http_status(:ok)
          expect(json).to eq([])
        end
      end

      context '本文検索' do
        let!(:matched_post) { create(:post, user: user, category: category, body: '一致する本文') }
        let!(:unmatched_post) { create(:post, user: user, category: category, body: '関係ない本文') }

        it '部分一致する投稿のみ返す' do
          get '/api/v1/posts', params: { body: '一致' }, headers: headers
          expect(response).to have_http_status(:ok)
          bodies = json.map { |p| p['body'] }
          expect(bodies).to include('一致する本文')
          expect(bodies).not_to include('関係ない本文')
        end

        it '検索結果が0件の場合は空配列を返す' do
          get '/api/v1/posts', params: { body: '存在しない本文' }, headers: headers
          expect(response).to have_http_status(:ok)
          expect(json).to eq([])
        end
      end

      context 'タイトルと本文の両方を検索' do
        let!(:both_matched) { create(:post, user: user, category: category, title: '一致タイトル', body: '一致本文') }
        let!(:title_only)   { create(:post, user: user, category: category, title: '一致タイトル', body: '関係ない本文') }
        let!(:body_only)    { create(:post, user: user, category: category, title: '関係ないタイトル', body: '一致本文') }

        it 'タイトルと本文の両方に一致する投稿のみ返す (AND検索)' do
          get '/api/v1/posts', params: { title: '一致タイトル', body: '一致本文' }, headers: headers
          expect(response).to have_http_status(:ok)
          returned_ids = json.map { |p| p['id'] }
          expect(returned_ids).to eq([both_matched.id])
        end
      end

      context 'SQLインジェクション対策' do
        it '%を含む検索でも例外が起きず全件返す' do
          expect {
            get '/api/v1/posts', params: { title: '%' }, headers: headers
          }.not_to raise_error
          expect(response).to have_http_status(:ok)
          expect(json).to eq([])
        end

        it '_を含む検索でも例外が起きず全件返す' do
          expect {
            get '/api/v1/posts', params: { title: '_' }, headers: headers
          }.not_to raise_error
          expect(response).to have_http_status(:ok)
          expect(json).to eq([])
        end
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        get '/api/v1/posts'
        expect(response).to have_http_status(:unauthorized)
        expect(json['errors']).to be_present
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