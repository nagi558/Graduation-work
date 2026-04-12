import { useNavigate } from 'react-router-dom'

export const CategoryList = () => {
  const navigate = useNavigate()

  // 仮データ（あとでAPIに置き換え）
  const categories = [
    { id: 1, name: '仕事' },
    { id: 2, name: 'プライベート' },
  ]

  return (
    <div>
      <h2>カテゴリ一覧</h2>

      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => navigate(`/categories/${category.id}/posts`)}
          style={{ cursor: 'pointer', margin: '10px 0' }}
        >
          {category.name}
        </div>
      ))}
    </div>
  )
}