class PostPermission < ApplicationRecord
  belongs_to :post
  belongs_to :pair
end