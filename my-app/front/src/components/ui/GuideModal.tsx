import { useState, useEffect } from 'react'

type Props = {
  onClose: () => void
}

export const GuideModel = ({ onClose }: Props) => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const contents = [
    {
      title: '未来の子どもに、今の想いを残そう',
      body: `このアプリは、日々の出来事や気持ちを
未来の子どもに向けて残していくための場所です。

今感じたことを、そのまま残してみましょう。`
    },
    {
      title: 'まずは1つ書いてみましょう',
      body: `タイトルと本文を入力するだけで記録できます。

カテゴリをつけておくと、
あとから見返すときに探しやすくなります。`
    },
    {
      title: 'パートナーと一緒に残せます',
      body: `つながることで、お互いの記録を共有できます。

家族の想いを一緒に積み重ねていきましょう。`
    }
  ]

  const isLast = step === contents.length - 1

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'
      role='dialog'
      aria-modal='true'
    >
      <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-center'>
        <h2 className='text-xl font-bold mb-4'>
          {contents[step].title}
        </h2>

        <div className='text-sm whitespace-pre-line leading-relaxed mb-6'>
          {contents[step].body}
        </div>

        <div className='flex justify-between items-center'>
          <button
            onClick={onClose}
            className='text-gray-500 text-sm px-3 py-2'
          >
            スキップ
          </button>

          {!isLast ? (
            <button
              onClick={() => setStep(step + 1)}
              className='bg-blue-600 text-white px-5 py-2 rounded-lg'
            >
              次へ
            </button>
          ) : (
            <button
              onClick={onClose}
              className='bg-blue-600 text-white px-5 py-2 rounded-lg'
            >
              はじめる
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
