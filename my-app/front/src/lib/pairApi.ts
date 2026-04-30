import axiosInstance from "./axios"
import type { PairStatus } from "@/types"

export const pairAPI = {
  getStatus: () =>
    axiosInstance.get<PairStatus>('/api/v1/pair'),

  invite: () =>
    axiosInstance.post<{ invitation_url: string }>(`/api/v1/pair/invite`),

  verifyToken: (token: string) =>
    axiosInstance.get<{ partner_name: string }>(`/api/v1/pair/join/${token}`),

  join: (token: string) =>
    axiosInstance.post<PairStatus>(`/api/v1/pair/join/${token}`),

  destroy: () =>
    axiosInstance.delete('/api/v1/pair'),

  getPartnerPosts: () =>
    axiosInstance.get('/api/v1/partner/posts'),
}