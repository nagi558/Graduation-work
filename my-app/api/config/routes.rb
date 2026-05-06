Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts, only: %i[index show create update destroy]
      resources :categories, only: %i[index show create update destroy] do
        resources :posts, only: [:index], controller: 'category_posts'
      end
      resources :contacts, only: [:create]

      resource :pair, only: %i[show destroy] do
        post :invite
        get  'join/:token', to: 'pairs#verify_token', as: :verify_token
        post 'join/:token', to: 'pairs#join',         as: :join
      end

      namespace :partner do
        resources :posts, only: %i[index show]
      end

      namespace :auth do
        post 'google', to: 'google#create'
      end

      resource :user, only: [:show] do
        patch :update_guide
      end
    end
  end

  get 'up' => 'rails/health#show', as: :rails_health_check

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    passwords: 'auth/passwords'
  }

  # Defines the root path route ("/")
  # root "posts#index"
end
