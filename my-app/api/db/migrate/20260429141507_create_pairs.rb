class CreatePairs < ActiveRecord::Migration[7.2]
  def change
    create_table :pairs do |t|
      t.string :invitation_token
      t.datetime :invitation_token_expires_at
      t.timestamps
    end

    add_index :pairs, :invitation_token, unique: true
  end
end
