import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { MyPostList } from "@/components/posts/MyPostList"
import { PartnerPostList } from "@/components/posts/PartnerPostList"
import { Toast } from "@/components/ui/Toast"
import { useLocation } from "react-router-dom"

export const PostList = () => {
  const [activeTab, setActiveTab] = useState<"mine" | "partner">("mine")
  const { isPaired } = useAuth()
  const [showToast, setShowToast] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.created) {
      setShowToast(true)
    }
  }, [location.state])

  return (
    <div className="min-h-full bg-[#E8EEF1] pb-24">
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
            伝えたいこと
          </h1>

          {isPaired && (
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("mine")}
                className={`px-6 py-2 text-sm font-bold transition duration-200 ${
                  activeTab === "mine"
                    ? "border-b-2 border-[#4f8196] text-[#4f8196]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                自分の投稿
              </button>
              <button
                onClick={() => setActiveTab("partner")}
                className={`px-6 py-2 text-sm font-bold transition duration-200 ${
                  activeTab === "partner"
                    ? "border-b-2 border-[#4f8196] text-[#4f8196]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                パートナーの投稿
              </button>
            </div>
          )}

          {activeTab === "mine" && <MyPostList isPaired={isPaired} />}
          {activeTab === "partner" && <PartnerPostList />}
        </div>
      </div>

      {showToast && (
        <Toast
          message="記録を残しました。未来へのメッセージになります"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}
