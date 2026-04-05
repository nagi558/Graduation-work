import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-4">
      <button
        onClick={() => navigate('/posts')}
        className="text-sm text-gray-400 hover:text-[#4f8196] font-medium"
      >
        伝えたいこと
      </button>
      <button
        onClick={() => navigate('/categories')}
        className="text-sm text-gray-400 hover:text-[#4f8196] font-medium"
      >
        カテゴリ一覧
      </button>
      <button
        onClick={() => navigate("/mypage")}
        className="text-sm text-gray-400 hover:text-[#4f8196] font-medium"
      >
        マイページ
      </button>
    </div>
  )
}