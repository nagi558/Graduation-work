import { useNavigate } from 'react-router-dom'
import { PairStatusCard } from '@/components/ui/PairStatus'

export const MyPage = () => {
  const navigate = useNavigate()

  return (
    <div className="h-full bg-[#E8EEF1] flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-3">
            <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
              マイページ
            </h1>
          </div>

          <div className="flex flex-col gap-4">

            <PairStatusCard />

            <button
              onClick={() => navigate('/privacy-policy')}
              className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-start"
            >
              プライバシーポリシー
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-start"
            >
              利用規約
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-start"
            >
              お問い合わせ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}