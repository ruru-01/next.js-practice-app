
import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)
  const [isLoding, setIsLoding] = useState(true)

  useEffect(() => {
    // ログイン状態を取得する関数
    const fetcher = async () => {
      const {
        // ログインしているかどうかを取得し、ログインしている場合はセッション情報を取得
        data: { session },
      } = await supabase.auth.getSession()
      // ログイン状態をセット
      setSession(session)
      // ログインしている場合はアクセストークンを取得し、していない場合はnullをセット
      setToken(session?.access_token || null)
      // ローディングを終了
      setIsLoding(false)
    }

    fetcher()
  }, [])

  /**
   * セッション情報、ローディング状態、アクセストークンを返す
   * セッション情報：ログインしているかどうかを判定するために使用
   * ローディング状態：ログイン状態を取得する処理が完了しているかどうかを判定するために使用
   * アクセストークン：APIリクエストを送信する際に使用
   * アクセストークンがnullの場合は、ログインしていない状態
   */
  return { session, isLoding, token }
}