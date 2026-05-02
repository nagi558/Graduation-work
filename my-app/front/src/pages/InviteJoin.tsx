import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { pairApi } from "@/lib/pairApi"
import { Spinner } from "@/components/Spinner"

export const InviteJoin = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await pairApi.verifyToken(token!)
        setPartnerName(res.data.partner_name)
      } catch {
        setError('招待URLが無効または期限切れです')
      } finally {
        setIsVerifying(false)
      }
    }
    verify()
  }, [token])

  const handleJoin = async () => {
    setIsJoining(true)
    try {
      await pairApi.join(token!)
      navigate('/posts')
    } catch (e: any) {
      setError(e.response?.data?.errors?.[0] || '参加に失敗しました')
      setIsJoining(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EEF1]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-sm w-full text-center space-y-6">
        {error ? (
          <>
            <div className="text-red-500 text-sm">{error}</div>
            <button
              onClick={() => navigate('/posts')}
              className="text-sm text-[#4f8196] underline"
            >
              トップへ戻る
            </button>
          </>
        ) : (
          <>
            <h1 className="text-sm text-[#4f8196] underline">パートナー招待</h1>
            <div className="text-gray-600 text-sm">
              <span className="font-bold text-[#444444]">{partnerName}</span> さんからの招待です
            </div>
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 px-7 py-3 rounded-lg shadow transition duration-200"
            >
              {isJoining ? <Spinner size="sm" /> : '参加する'}
            </button>
            <button
              onClick={() => navigate('/posts')}
              className="text-sm text-gray-400 underline"
            >
              キャンセル
            </button>
          </>
        )}
      </div>
    </div>
  )
}