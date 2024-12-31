// カテゴリー編集ページ admin/categories/[id]

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'

export default function Page() {
  // カテゴリー名の状態を管理
  const [name, setName] = useState('')
  // パスパラメーターからIDを取得
  const { id } = useParams()
  // ルーターを取得
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch(`/api/admin/categories/${id}`,{
      method: 'PUT',
      headers: {
        // リクエストヘッダーにContent-Typeを指定（リクエストボディがJSON形式であることを示す）
        'Content-Type': 'application/json',
      },
      // カテゴリー名をJSON形式でサーバーに送信
      // JSON.stringifyは、JavaScriptのオブジェクトや値をJSON文字列に変換する関数
      body: JSON.stringify({ name }),
    })

    alert('カテゴリーを更新しました。')

    router.push('/admin/categories')
  }

  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return

    // カテゴリーを削除
    await fetch(`/api/admin/categories/${id}`,{
      method: 'DELETE',
    })

    alert('カテゴリーを削除しました。')

    // カテゴリー一覧ページに遷移
    router.push('/admin/categories')
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`)
      const { category } = await res.json()
      setName(category.name)
    }

    fetcher()
  }, [id])

  return (
    <div className=''>
      <div className=''>
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />
    </div>
  )
}