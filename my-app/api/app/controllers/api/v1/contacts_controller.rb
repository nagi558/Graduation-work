module Api
  module V1
    class ContactsController < ApplicationController
      def create
        @contact = Contact.new(contact_params)

        if @contact.save
          send_contact_mails
          render json: { message: 'お問い合わせを受け付けました' }, status: :created
        else
          render json: { errors: @contact.errors.full_messages }, status: :unprocessable_content
        end
      end

      private

      def send_contact_mails
        ContactMailer.confirmation_to_user(@contact).deliver_now
        ContactMailer.notification_to_admin(@contact).deliver_now
      rescue StandardError => e
        Rails.logger.error "メール送信に失敗しました: #{e.message}"
      end

      def contact_params
        params.require(:contact).permit(:email, :body)
      end
    end
  end
end
