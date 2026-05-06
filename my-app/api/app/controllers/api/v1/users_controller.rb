module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!

      def show
        render json: {
          id: current_user.id,
          has_seen_guide: current_user.has_seen_guide
        }
      end

      def update_guide
        current_user.update!(has_seen_guide: true)
        render json: { success: true }
      end
    end
  end
end
