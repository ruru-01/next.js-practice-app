// 記事新規作成ページ admin/posts/new

'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types/Category'
import { PostForm } from '../_components/PostForm'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const [ title, setTitle ] = useState('')
  const [ content, setContent] = useState('')
  const [ thumbnailImageKey, setThumbnailImageKey ] = useState('')
  const [ categories, setCategories ] = useState<Category[]>([])
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの送信処理をキャンセル
    e.preventDefault()

    // 記事を作成してAPIに送信
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      // リクエストヘッダーにContent-Typeを指定（リクエストボディがJSON形式であることを示す）
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!, // トークンをリクエストヘッダーに追加。!をつけることでnullまたはundefinedでないことを保証
      },
      // フォームの入力値をJSON形式でサーバーに送信
      body: JSON.stringify({ title, content, thumbnailImageKey, categories}),
    })

    // レスポンスから作成された記事のIDを取得
    const { id } = await res.json()

    // 作成された記事の詳細ページに遷移
    router.push(`/admin/posts/${id}`)

    alert('記事を作成しました')

    router.push(`/admin/posts`)
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className='text-2xl font-bold mb-4'>記事作成</h1>
      </div>

      {/* PostFormコンポーネントを呼び出す */}
      <PostForm
      mode="new"
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      thumbnailImageKey={thumbnailImageKey}
      setThumbnailImageKey={setThumbnailImageKey}
      categories={categories}
      setCategories={setCategories}
      onSubmit={handleSubmit}
      />
    </div>
  )
}