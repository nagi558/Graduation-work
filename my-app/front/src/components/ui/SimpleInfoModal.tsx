import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

type Props = {
  onClose: () => void
}

export const SimpleInfoModal = ({ onClose }: Props) => {
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40"
      role="dialog"
      aria-modal='true'
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-center">
        <h2 className="text-lg font-bold mb-4">
          思いついた今が、残しどきです
        </h2>

        <div className="text-sm whitespace-pre-line leading-relaxed mb-6">
          日々の出来事や気持ちは、
時間が経つと少しずつ薄れていきます。

今のあなたの想いを、
未来の子どもに残してみませんか？
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/posts/new')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            書いてみる
          </button>

          <button
            onClick={onClose}
            className="text-gray-500 px-4 py-2"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}