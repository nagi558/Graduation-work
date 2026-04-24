class ContactMailer < Application
  def confirmation_to_user(contact)
    @contact = contact
    mail(
      to: contact.email,
      subject: '【紡ぐレター】お問い合わせを受け付けました'
    )
  end

  def notification_to_admin(contact)
    @contact = contact
    mail(
      to: ENV.fetch('ADMIN_EMAIL'),
      subject: '【紡ぐレター】新しいお問い合わせが届きました'
    )
  end
end