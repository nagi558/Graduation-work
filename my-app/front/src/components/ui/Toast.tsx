type Props = {
  message: string
  onClose: () => void
}

export const Toast = ({ message, onClose }: Props) => {
  return (
    <div
      className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm">{message}</span>

        <button
          data-testid="toast-close"
          onClick={onClose}
          className="text-xs text-gray-300 px-2 py-1"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}