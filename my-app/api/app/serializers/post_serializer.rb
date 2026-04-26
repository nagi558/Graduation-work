class PostSerializers < ActiveModel::Serializer
  attributes :id, :title, :body, :created_at, :updated_at

  belongs_to :category
end