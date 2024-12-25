// 記事新規作成ページ admin/posts/new

'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { Category } from '@/types/Category'
import PostForm from '@/components/PostForm'

export default function Page() {
  const [ title, setTitle ] = useState('')
  const [ content, setContent] = useState('')
  const [ thumbnailUrl, setThumbnailUrl ] = useState('https://placehold.jp/800x400.png',) // 画像のデフォルトURL
  const [ categories, setCategories ] = useState<Category[]>([])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの送信処理をキャンセル
    e.preventDefault()

    // 記事を作成してAPIに送信
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      // リクエストヘッダーにContent-Typeを指定（リクエストボディがJSON形式であることを示す）
      headers: {
        'Content-Type': 'application/json',
      },
      // フォームの入力値をJSON形式でサーバーに送信
      body: JSON.stringify({ title, content, thumbnailUrl, categories}),
    })

    // レスポンスから作成された記事のIDを取得
    const { id } = await res.json()

    // 作成された記事の詳細ページに遷移
    router.push(`/admin/posts/${id}`)
    alert('記事を作成しました')
  }

  return (
    <div className="">
      <div className="">
        <h1>記事作成</h1>
      </div>

      {/* PostFormコンポーネントを呼び出す */}
      <PostForm
      mode="new"
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      thumbnailUrl={thumbnailUrl}
      setThumbnailUrl={setThumbnailUrl}
      categories
      setCategories={setCategories}
      onSubmit={handleSubmit}
      />
    </div>
  )
}