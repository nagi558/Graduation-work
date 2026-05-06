class ContactMailer < ApplicationMailer
  def confirmation_to_user(contact)
    @contact = contact
    mail(
      to: contact.email,
      subject: I18n.t('mailer.contact.confirmation_to_user.subject')
    )
  end

  def notification_to_admin(contact)
    @contact = contact
    mail(
      to: ENV.fetch('ADMIN_EMAIL'),
      subject: I18n.t('mailer.contact.notification_to_admin.subject')
    )
  end
end
