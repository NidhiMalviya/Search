class Article < ApplicationRecord
  has_one_attached :image
  before_create :set_article_image
  def self.search(search)
    if search
      Article.where("title LIKE '%#{search}%' OR description LIKE '%#{search}%'")
    else
      Article.all
    end
  end

  def set_article_image
    binding.pry
    #self.article_image = Base64.encode64('Tempfile:/tmp/RackMultipart20210222-21997-11dpfle.jpg')
    file = File.open('Tempfile:/tmp/RackMultipart20210222-21997-11dpfle.jpg')
    file_data = file.read
    file_data = file.readlines.map(&:chomp)
  end
end
