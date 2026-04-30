import { useEffect, useState } from "react"
import { pairAPI } from "@/lib/pairApi"
import type { PairStatus } from '@/types'
import { Spinner } from "../Spinner"

export const PairStatusCard = () => {
  const [status, setStatus] = useState<PairStatus | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await pairAPI.getStatus()
        setStatus(res.data)
      } catch {
        setError('状態の取得に失敗しました')
      } finally {
        setIsFetching(false)
      }
    }
    fetchStatus()
  }, [])

  const handleInvite = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await pairAPI.invite()
      setInviteUrl(res.data.invitation_url)
    } catch {
      setError('招待URLの発行に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!inviteUrl) return
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDisconnect = async () => {
    if (!confirm('パートナー接続を解除しますか？')) return
    try {
      await pairAPI.destroy()
      setStatus({ paired: false })
      setInviteUrl(null)
    } catch {
      setError('解除に失敗しました')
    }
  }

  if (isFetching) return <Spinner size="sm" />

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-[#444444] mb-4">パートナー連携</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {status?.paired ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-wm text-gray-600">
              <span className="font-bold text-[#444444]">{status.partner_name}</span>
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-sm text-red-400 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition duration-200"
          >
            接続解除
            </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span className="text-sm text-gray-400">未接続</span>
          </div>

          {inviteUrl ? (
            <div className="space-y-2">
              <div className="text-xs text gray-500">パートナーにこのURLを送ってください（24時間有効）</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                />
                <button
                  onClick={handleCopy}
                  className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] px-3 py-2 rounded-lg transition duration-200"
                >
                  {copied ? 'コピー済み' : 'コピー'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInvite}
              disabled={isLoading}
              className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 px-4 py-2 rounded-lg transition duration-200"
            >
              {isLoading ? <Spinner size="sm" /> : '招待URLを発行する'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}