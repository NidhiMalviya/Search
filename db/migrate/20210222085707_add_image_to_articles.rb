class AddImageToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :article_image, :text
  end
end
