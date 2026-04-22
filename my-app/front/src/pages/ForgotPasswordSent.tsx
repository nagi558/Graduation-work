import { useNavigate } from 'react-router-dom'

export const ForgotPasswordSent = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col items-center pt-8 bg-[#E8EEF1]'>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 text-center">
        <div className="text-5xl mb-6">✉️</div>
        <h1 className="text-[28px] font-bold text-[#444444] mb-4 font-sans">
          メールを送信しました
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          パスワード再設定用のリンクをお送りしました。
        </p>
        <p className="text-sm text-gray-500 mb-8">
          メールが届かない場合は、迷惑メールフォルダをご確認ください。<br />
          リンクの有効期限は6時間です。
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#4f8196] hover:bg-[#80949e] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200"
        >
          ログイン画面へ戻る
        </button>
      </div>
    </div>
  )
}