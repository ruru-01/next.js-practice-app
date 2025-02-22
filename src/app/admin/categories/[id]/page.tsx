// カテゴリー編集ページ admin/categories/[id]

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  // カテゴリー名の状態を管理
  const [name, setName] = useState('');
  // パスパラメーターからIDを取得
  const { id } = useParams();
  // ルーターを取得
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        // リクエストヘッダーにContent-Typeを指定（リクエストボディがJSON形式であることを示す）
        "Content-Type": "application/json",
        Authorization: token!, // トークンをリクエストヘッダーに追加。!をつけることでnullまたはundefinedでないことを保証
      },
      // カテゴリー名をJSON形式でサーバーに送信
      // JSON.stringifyは、JavaScriptのオブジェクトや値をJSON文字列に変換する関数
      body: JSON.stringify({ name }),
    })

    alert('カテゴリーを更新しました。')

    router.push('/admin/categories')
  }

  const handleDeletePost = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;

    // カテゴリーを削除
    await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "applecation/json",
        Authorization: token!,
      }
    });

    alert('カテゴリーを削除しました。')

    // カテゴリー一覧ページに遷移
    router.push('/admin/categories')
  }

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { category } = await res.json();
      setName(category.name);
    };

    fetcher();
  }, [id, token]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
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
  );
}