import { useNavigate } from "react-router-dom"
import { Button } from '@/components/ui/button'

export const Top = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/AdobeStock_662070016.jpeg')]">
      <div className="flex items-start pt-40 pl-25">
        <div className="flex flex-col gap-4">
          <div className="leading-[4rem] text-left">
            <div>
              <b className="text-5xl">経験をストック</b>
              <span className="text-3xl">して、</span>
              <br />
              <b className="text-5xl">未来の我が子</b>
              <span className="text-3xl">へ</span>
              <b className="text-5xl">伝える。</b>
            </div>
          </div>
        
          <div className="leading-[4rem] text-left">
            <Button onClick={() => navigate('/register')}
              className="bg-[#4f8196] hover:bg-[#80949e] text-white text-lg font-bold px-10 py-6 shadow-2xl rounded-xl"
            >
              新規登録
            </Button>
            <br />
            <Button onClick={() => navigate('/login')}
              className="bg-white text-[#597380] hover:text-[#1d3947] text-lg font-bold px-10 py-6 shadow-2xl rounded-xl"
            >
              ログイン
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}