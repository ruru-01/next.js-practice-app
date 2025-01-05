// カテゴリー一覧ページ admin/categories

'use client'

import { Category } from '@prisma/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([])
  const [ isLoading, setIsLoading ] = useState(true);
  const { token } = useSupabaseSession()

  useEffect(() => {
    // トークンがない場合は処理を中断
    if (!token) return;

    const fetcher = async () => {
      setIsLoading(true) // ローディング開始
      const res = await fetch('/api/admin/categories', {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // トークンをリクエストヘッダーに追加
        },
      });
      const { categories } = await res.json()
      setCategories(categories); // カテゴリーデータをセット
      setIsLoading(false) // ローディング終了
    }
    fetcher()
  }, [token])

  if (isLoading) {
    return <p>読み込み中...</p>
  }

  if (categories.length === 0) {
    return <p>カテゴリーがありません</p>
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">カテゴリー一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {categories.map((category) => {
          return (
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{category.name}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}