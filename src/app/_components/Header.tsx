'use client'

import Link from 'next/link'
import React from 'react'
import { supabase } from '@/utils/supabase'
import { useSupabaseSession } from '../_hooks/useSupabaseSession'
import { useRouter } from 'next/navigation'

export const Header: React.FC = () => {
  // useRouterを初期化
  const router = useRouter()
  // ログアウト処理
  const handleLogout = async () => {
    // ログアウト処理。ログアウト後はトップページに遷移
    await supabase.auth.signOut()
    router.push('/')
  }

  // セッション情報とローディング状態を取得
  // セッション情報が取得できるまでローディング画面を表示
  const { session, isLoding } = useSupabaseSession()

  return (
    <header className="bg-gray-800 text-white p-6 font-bold flex justify-between items-center">
      <Link href="/" className="header-link">
        Blog
      </Link>
      {/* ログイン状態によって表示を切り替え,ログイン状態の読み込み中は何も表示しない */}
      {/* sessionがある場合はログイン中のメニュー、なければ未ログイン状態のメニューを表示 */}
      {!isLoding && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              <Link href="/login" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}