Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      resources :posts, only: [:index, :show, :create, :update, :destroy]
      resources :categories, only: [:index, :show, :create, :update, :destroy] do
        resources :posts, only: [:index], controller: 'category_posts'
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end

  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    passwords: 'auth/passwords'
  }

  # Defines the root path route ("/")
  # root "posts#index"
end