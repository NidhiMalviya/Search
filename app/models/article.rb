class Article < ApplicationRecord
  #validates :title, presence: { message: "must be given please" }

  def self.search(search)
    if search
      Article.where("title LIKE '%#{search}%' OR description LIKE '%#{search}%'")
    else
      Article.all
    end
  end

  def self.extract_file_path(dispatch_object)
    Base64.encode64(
      File.open(
        (dispatch_object&.tempfile&.to_path || "#{Rails.root}/user.png")
      ).read
    )
  end
end
