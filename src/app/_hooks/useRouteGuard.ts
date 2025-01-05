import { useSupabaseSession } from "./useSupabaseSession"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export const useRouteGuard = () => {
  const router = useRouter()
  const { session } = useSupabaseSession()

  useEffect(() => {
    if (session === undefined) return // sessionがundefinedの場合は読み込み中なので何もしない

    // sessionがnullの場合はログインしていないのでログインページにリダイレクト
    const fetcher = async () => {
      if (session === null) {
        router.replace('/login')
      }
    }

    // sessionが取得できたらfetcherを実行
    fetcher()
  }, [router, session])
}