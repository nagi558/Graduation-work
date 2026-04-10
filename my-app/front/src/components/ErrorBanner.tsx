import { useError } from '@/hooks/useError'

const ErrorBanner = () => {
  const { error, setError } = useError()

  if (!error) return null

  return (
    <div
      style={{
        background: '#ffe0e0',
        color: '#900',
        padding: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <span>{error.message}</span>

      <button
        onClick={() => setError(null)}
        style={{ marginLeft: '12px'}}
      >
        閉じる
      </button>
    </div>
  )
}

export default ErrorBanner