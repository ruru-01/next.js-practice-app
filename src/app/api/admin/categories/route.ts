import { PrismaClient } from "@prisma/client/extension";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  try {
    // カテゴリー一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAd: 'desc'
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}