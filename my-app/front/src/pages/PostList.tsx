import { useEffect, useState } from 'react'
import { pairAPI } from '@/lib/pairApi'
import { MyPostList } from '@/components/posts/MyPostList'
import { PartnerPostList } from '@/components/posts/PartnerPostList'

export const PostList = () => {
  const [activeTab, setActiveTab] = useState<'mine' | 'partner'>('mine')
  const [isPaired, setIsPaired] = useState(false)

  useEffect(() => {
    const fetchPairStatus = async () => {
      try {
        const res = await pairAPI.getStatus()
        setIsPaired(res.data.paired)
      } catch {}
    }
    fetchPairStatus()
  }, [])

  return (
    <div className="bg-[#E8EEF1] pb-20">
      <div className="max-w-4xl mx-auto pt-1 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
            伝えたいこと
          </h1>

          {isPaired && (
            <div className='flex border-b border-gray-200 mb-6'>
              <button
                onClick={() => setActiveTab('partner')}
                className={`px-6 py-2 text-sm font-bold transition duration-200 ${
                  activeTab === 'partner'
                    ? 'border-b-2 border-[#4f8196] text-[#4f8196]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                パートナーの投稿
              </button>
            </div>
          )}

          {activeTab === 'mine' && <MyPostList isPaired={isPaired} />}
          {activeTab === 'partner' && <PartnerPostList />}

        </div>
      </div>
    </div>
  )
}