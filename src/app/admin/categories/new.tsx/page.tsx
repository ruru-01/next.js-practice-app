// カテゴリー新規作成ページ admin/categories/new

'use client'

import { useState } from 'react'
import { Category } from '@/types/Category'
import { useRouter } from 'next/router'
import { PostForm } from '../../posts/_components/PostForm'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('https://placehold.jp/800x400.png',)
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの送信処理（ページのリロード）をキャンセル
    e.preventDefault()

    // 記事を作成してAPIに送信
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: {
        // リクエストヘッダーにContent-Typeを指定（リクエストボディがJSON形式であることを示す）
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, thumbnailUrl, categories})
    })

    // レスポンスから作成された記事のIDを取得
    const { id } = await res.json()

    // 作成された記事の詳細ページに遷移
    router.push(`/admin/posts/${id}`)

    alert('記事を作成しました。')
  }

  return (
    <div className=''>
      <div className=''>
        <h1>記事作成</h1>
      </div>

      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
      />
    </div>
  )
}