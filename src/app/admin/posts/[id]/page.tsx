// 記事編集ページ admin/posts/[id]

'use client'

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PostForm } from "../_components/PostForm"
import { Category } from "@/types/Category"
import { Post } from "@/types/post"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    // ページのデフォルトの動作をキャンセル
    e.preventDefault()

    // 記事を作成する
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!, // トークンをリクエストヘッダーに追加。!をつけることでnullまたはundefinedでないことを保証
      },
      body: JSON.stringify({ title, content, thumbnailImageKey, categories }),
    })

    alert('記事を更新しました。')

    // 記事一覧ページに遷移
    router.push('/admin/posts')
  }

  const handleDeletePost = async () => {
    if(!confirm('記事を削除しますか？')) return

    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token!,
        "Content-Type": "application/json",
      },
    })

    alert('記事を削除しました。')

    router.push('/admin/posts')
  }

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const { post }: { post: Post } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);
      setCategories(post.postCategories.map((pc) => pc.category));
    };

    fetcher();
  }, [id, token]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

    <PostForm
      mode="edit"
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      thumbnailImageKey={thumbnailImageKey}
      setThumbnailImageKey={setThumbnailImageKey}
      categories={categories}
      setCategories={setCategories}
      onSubmit={handleSubmit}
      onDelete={handleDeletePost}
    />
    </div>
  )
}