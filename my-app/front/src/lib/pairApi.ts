import axiosInstance from "./axios"
import type { PairStatus } from "@/types"
import type { AxiosRequestConfig } from "axios"

export const pairApi = {
  getStatus: (options?: AxiosRequestConfig) =>
    axiosInstance.get<PairStatus>('/api/v1/pair', options),

  invite: (options?: AxiosRequestConfig) =>
    axiosInstance.post<{ invitation_url: string }>('/api/v1/pair/invite', undefined, options),

  verifyToken: (token: string, options?: AxiosRequestConfig) =>
    axiosInstance.get<{ partner_name: string }>(`/api/v1/pair/join/${token}`, options),

  join: (token: string, options?: AxiosRequestConfig) =>
    axiosInstance.post<PairStatus>(`/api/v1/pair/join/${token}`, undefined, options),

  destroy: (options?: AxiosRequestConfig) =>
    axiosInstance.delete('/api/v1/pair', options),

  getPartnerPosts: (options?: AxiosRequestConfig) =>
    axiosInstance.get('/api/v1/partner/posts', options),
}