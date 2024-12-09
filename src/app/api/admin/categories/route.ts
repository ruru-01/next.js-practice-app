import { createChainedFunction } from "@mui/material";
import { PrismaClient } from "@prisma/client/extension";
import { RequestAsyncStorage } from "next/dist/client/components/request-async-storage.external";
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

//カテゴリーの作成時に送られてくるリクエストのbodyの型
interface CreateCategoryRequestBody {
  name: string
}

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
export const POST = async (request: Request, context: any) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body

    // カテゴリーをDBに生成　
    const data = await prisma.category.create({
      data: {
        name,
      },
    })

    // 中間レコードはなし
    // レスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}