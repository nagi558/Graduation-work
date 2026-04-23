import { useNavigate } from "react-router-dom"

export const PublicFooter = () => {
  const navigate = useNavigate

  return (
    <footer className='w-full py-4 flex justify-center gap-6'>
      <button
        onClick={() => navigate('/terms')}
        className="text-xs text-gray-400 hover:text-[#4f8196]"
      >
        利用規約
      </button>
      <button
        onClick={() => navigate('/privacy-policy')}
        className="text-xs text-gray-400 hover:text-[#4f8196]"
      >
        プライバシーポリシー
      </button>
      <button
        onClick={() => navigate('/contact')}
        className="text-xs text-gray-400 hover:text-[#4f8196]"
      >
        お問い合わせ
      </button>
    </footer>
  )
}