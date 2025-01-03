// 記事一覧ページ admin/posts
'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import Link from 'next/link'
import { useEffect, useState } from "react";

export default function Page() {
  const [ posts, setPosts ] = useState<Post[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);
  // ログインユーザーのセッション情報を取得
  const { token } = useSupabaseSession()

  // Post型の定義
  interface Post{
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }

  useEffect(() => {
    if (!token) return
    const fetcher = async () => {
      setIsLoading(true) // ローディング開始
      const res = await fetch('/api/admin/posts', {
        headers: {
          'Content-Type': 'application/json',
          Authourication: token, // トークンをリクエストヘッダーに追加
        },
      })
      const { posts } = await res.json()
      setPosts([...posts]) //記事データをセット。状態の更新は非同期で行われるため、スプレッド構文を使用して新しい配列を生成
      setIsLoading(false) // ローディング終了
    }

    fetcher()
  }, [token]);

  if(isLoading) {
    return <p>読み込み中...</p>
  }

  if (posts.length === 0) {
    return <p>記事がありません</p>
  }

  return (

    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href='/admin/posts/new'>新規作成</Link>
        </button>
      </div>

      <div className="">
        {posts.map((post) => {
          return (
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className='text-xl font-bold'>{post.title}</div>
                <div className='text-gray-500'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}