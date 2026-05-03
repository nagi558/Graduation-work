class Api::V1::PairsController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: pair_json, status: :ok
  end

  def invite
    if current_user.paired?
      return render json: { errors: ['すでにパートナーと接続済みです'] }, status: :unprocessable_entity
    end

    pair = Pair.create!
    pair.pair_memberships.create!(user: current_user)
    pair.generate_invitation_token!

    render json: {
      invitation_url: "#{ENV['FRONTED_URL']}/invite/##{pair.invitation_token}"
    }, status: :created
  end

  def verify_token
    pair = find_valid_pair(params[:token])
    return render json: { errors: ['招待URLが無効または期限切れです'] }, status: :not_found unless pair

    if pair.users.include?(current_user)
      return render json: { errors: ['自分自身の招待URLには参加できません'] }, status: :unprocessable_entity
    end

    partner = pair.users.first
    render json: { partner_name: partner&.name }, status: :ok
  end

  def join
    if current_user.paired? || current_user.pending?
      return render json: { errors: ['すでにパートナーと接続済みです'] }, status: :unprocessable_entity
    end

    pair = find_valid_pair(params[:token])
    return render json: { errors: ['招待URLが無効または期限切れです'] }, status: :not_found unless pair

    if pair.users.include?(current_user)
      return render json: { errors: ['自分自身の招待URLには参加できません'] }, status: :unprocessable_entity
    end

    pair.pair_memberships.create!(user: current_user)
    pair.update!(invitation_token: nil, invitation_token_expires_at: nil)

    current_user.reload
    render json: pair_json, status: :ok
  end

  def destroy
    unless current_user.paired? || current_user.pending?
      return render json: { errors: ['接続中のパートナーがいません'] }, status: :not_found
    end

    current_user.pair.destroy
    render json: { message: 'パートナー接続を解除しました' }, status: :ok
  end

  private

  def find_valid_pair(token)
    pair = Pair.find_by(invitation_token: token)
    return nil unless pair&.invitation_token_valid?
    pair
  end

  def pair_json
    if current_user.paired?
      {
        paired: true,
        pending: false,
        partner_name: current_user.partner&.name,
        invitation_url: nil
      }
    elsif current_user.pending?
      {
        paired: false,
        pending: true,
        partner_name: nil,
        invitation_url: "#{ENV['FRONTEND_URL']}/invite/#{current_user.pair.invitation_token}"
      }
    else
      {
        paired: false,
        pending: false,
        partner_name: nil,
        invitation_url: nil
      }
    end
  end
end