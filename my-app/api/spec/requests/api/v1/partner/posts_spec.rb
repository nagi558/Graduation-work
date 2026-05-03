require 'rails_helper'

RSpec.describe 'Api::V1::Partner::Posts', type: :request do
  let(:user)             { create(:user) }
  let(:partner)          { create(:user) }
  let(:other_user)       { create(:user) }
  let(:partner_category) { create(:category, user: partner) }
  let(:headers)          { auth_headers(user) }
  let!(:pair)            { create(:pair, :with_members, owner: user, member: partner) }

  def json
    JSON.parse(response.body)
  end

  describe 'GET /api/v1/partner/posts' do
    let!(:visible_post) do
      post = create(:post, user: partner, category: partner_category)
      create(:post_permission, post: post, pair: pair, can_view: true)
      post
    end
    let!(:hidden_post) do
      post = create(:post, user: partner, category: partner_category)
      create(:post_permission, post: post, pair: pair, can_view: false)
      post
    end

    context '認証済みかつPair接続済みの場合' do
      it '200を返す' do
        get '/api/v1/partner/posts', headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'can_view=trueの投稿のみ返す' do
        get '/api/v1/partner/posts', headers: headers
        ids = json.map { |p| p['id'] }
        expect(ids).to include(visible_post.id)
        expect(ids).not_to include(hidden_post.id)
      end

      it '自分自身の投稿は含まれない' do
        my_category = create(:category, user: user)
        my_post = create(:post, user: user, category: my_category)
        create(:post_permission, post: my_post, pair: pair, can_view: true)

        get '/api/v1/partner/posts', headers: headers
        ids = json.map { |p| p['id'] }
        expect(ids).not_to include(my_post.id)
      end

      it '別のPairの投稿は含まれない' do
        other_pair = create(:pair, :with_members, owner: other_user, member: create(:user))
        other_category = create(:category, user: other_user)
        other_post = create(:post, user: other_user, category: other_category)
        create(:post_permission, post: other_post, pair: other_pair, can_view: true)

        get '/api/v1/partner/posts', headers: headers
        ids = json.map { |p| p['id'] }
        expect(ids).not_to include(other_post.id)
      end
    end

    context 'Pair未接続の場合' do
      let(:unpaired_user)    { create(:user) }
      let(:unpaired_headers) { auth_headers(unpaired_user) }

      it '403を返す' do
        get '/api/v1/partner/posts', headers: unpaired_headers
        expect(response).to have_http_status(:forbidden)
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        get '/api/v1/partner/posts'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/partner/posts/:id' do
    let!(:visible_post) do
      post = create(:post, user: partner, category: partner_category)
      create(:post_permission, post: post, pair: pair, can_view: true)
      post
    end
    let!(:hidden_post) do
      post = create(:post, user: partner, category: partner_category)
      create(:post_permission, post: post, pair: pair, can_view: false)
      post
    end

    context '認証済みかつPair接続済みの場合' do
      it 'can_view=trueの投稿は200を返す' do
        get "/api/v1/partner/posts/#{visible_post.id}", headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'can_view=falseの投稿は403を返す' do
        get "/api/v1/partner/posts/#{hidden_post.id}", headers: headers
        expect(response).to have_http_status(:forbidden)
      end

      it '自分の投稿を叩いた場合は403を返す' do
        my_category = create(:category, user: user)
        my_post = create(:post, user: user, category: my_category)
        create(:post_permission, post: my_post, pair: pair, can_view: true)

        get "/api/v1/partner/posts/#{my_post.id}", headers: headers
        expect(response).to have_http_status(:forbidden)
      end

      it '別Pairの投稿を叩いた場合は403を返す' do
        other_pair = create(:pair, :with_members, owner: other_user, member: create(:user))
        other_category = create(:category, user: other_user)
        other_post = create(:post, user: other_user, category: other_category)
        create(:post_permission, post: other_post, pair: other_pair, can_view: true)

        get "/api/v1/partner/posts/#{other_post.id}", headers: headers
        expect(response).to have_http_status(:forbidden)
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        get "/api/v1/partner/posts/#{visible_post.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end