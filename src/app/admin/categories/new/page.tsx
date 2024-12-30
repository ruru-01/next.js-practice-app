// カテゴリー新規作成ページ admin/categories/new

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { CategoryForm } from '../_components/CategoryForm'

export default function Page() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        // リクエストヘッダーにContent-Typeを指定（リクエストボディがJSON形式であることを示す）
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    // レスポンスから作成されたカテゴリーのIDを取得
    const { id } = await res.json()

    // 作成されたカテゴリーの詳細ページに遷移
    router.push(`/admin/categories/${id}`)

    alert('カテゴリーを作成しました。')

    router.push('/admin/categories')
  }

  return (
    <div className='container mx-auto px-4'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-4'>カテゴリー作成</h1>
      </div>

      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
      />
    </div>
  )
}