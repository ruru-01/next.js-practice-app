import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export const getCurrentUser = async (request: NextRequest) => {

  // リクエストヘッダーからトークンを取得し、ユーザー情報を取得
  // request.headers.get('Authorization')がnullまたはundefinedではないことを保証するために!をつける
  const token = request.headers.get('Authorization')!
  const { data, error } = await supabase.auth.getUser(token)

  // ユーザー情報とエラーを返す
  return { currentUser: data, error}
}