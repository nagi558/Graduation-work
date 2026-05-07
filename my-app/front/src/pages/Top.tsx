import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const Top = () => {
  const navigate = useNavigate()

  return (
    <div>
      {/* スマホ用：画像を上部に表示 */}
      <div
        className="
          md:hidden
          w-full h-56
          bg-cover bg-center
          bg-[url('/AdobeStock_662070016.jpeg')]
        "
      />

      {/* スマホ用：テキスト・ボタンエリア */}
      <div className="md:hidden flex flex-col items-start gap-6 px-8 py-10">
        <div className="leading-relaxed text-left">
          <b className="text-3xl">経験をストック</b>
          <span className="text-xl">して、</span>
          <br />
          <b className="text-3xl">未来の我が子</b>
          <span className="text-xl">へ</span>
          <b className="text-3xl">伝える。</b>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={() => navigate("/register")}
            className="bg-[#4f8196] hover:bg-[#80949e] text-white text-lg font-bold px-10 py-6 shadow-2xl rounded-xl w-full"
          >
            新規登録
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="bg-white text-[#597380] hover:text-[#1d3947] text-lg font-bold px-10 py-6 shadow-2xl rounded-xl w-full border border-gray-200"
          >
            ログイン
          </Button>
        </div>
      </div>

      {/* PC用：現状維持 */}
      <div className="hidden md:block min-h-screen bg-cover bg-center bg-[url('/AdobeStock_662070016.jpeg')]">
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
              <Button
                onClick={() => navigate("/register")}
                className="bg-[#4f8196] hover:bg-[#80949e] text-white text-lg font-bold px-10 py-6 shadow-2xl rounded-xl"
              >
                新規登録
              </Button>
              <br />
              <Button
                onClick={() => navigate("/login")}
                className="bg-white text-[#597380] hover:text-[#1d3947] text-lg font-bold px-10 py-6 shadow-2xl rounded-xl"
              >
                ログイン
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
