class CreatePostPermissions < ActiveRecord::Migration[7.2]
  def change
    create_table :post_permissions do |t|
      t.references :post, null: false, foreign_key: true
      t.references :pair, null: false, foreign_key: true
      t.boolean :can_view, null: false, default: false
      t.timestamps
    end

    add_index :post_permissions, [:post_id, :pair_id], unique: true
  end
end
