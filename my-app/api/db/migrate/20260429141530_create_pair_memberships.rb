class CreatePairMemberships < ActiveRecord::Migration[7.2]
  def change
    create_table :pair_memberships do |t|
      t.references :pair, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true, index: false
      t.timestamps
    end

    add_index :pair_memberships, [:pair_id, :user_id], unique: true
    add_index :pair_memberships, :user_id, unique: true
  end
end
