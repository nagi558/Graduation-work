class AddHasSeenGuideToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :has_seen_guide, :boolean, default: false, null: false
    User.update_all(has_seen_guide: true)
  end
end
