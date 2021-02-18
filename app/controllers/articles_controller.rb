class ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :update, :destroy]

  # GET /articles
  def index
    offset = (params[:page_number].presence || 1) * 25
    @articles = Article.all.order(updated_at: :desc).limit(offset)

    render json: @articles
  end

  # GET /articles/1
  def show
    render json: @article
  end

  # POST /articles
  def create
    @article = Article.new(article_params)

    if @article.save
      render json: @article, status: :created, location: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /articles/1
  def update
    if @article.update(article_params)
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # DELETE /articles/1
  def destroy
    @article.destroy
  end


  def search
    @articles = Article.search(params[:search])
    sad_face = "😟"
    logger.info("\nArticle to search is:>  #{params[:search].presence || sad_face}\n".green)
    hit = @articles.present? ? "😁"  : sad_face
    logger.info("HIT: #{hit}")
    logger.info()
    render json: @articles
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def article_params
      params.require(:article).permit(:title, :description, :search)
    end
end
