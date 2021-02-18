Rails.application.routes.draw do
  #resources :articles
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "articles#index"
  resources :articles do
    collection do
      get :search
    end
  end
end
