import { PrismaClient } from "@prisma/client/extension";
import exp from "constants";
import { exportTraceState } from "next/dist/trace";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// カテゴリーの更新時に送られてくるリクエストのbodyの型
interface UpdateCategoryRequestBody {
  name: string
}

// PUTという命名にすることで、PUTリクエストの時にこの関数が呼ばれる
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているため、それを取り出す
  const { id } = params

  // リクエストのbodyを取得
  const { name }: UpdateCategoryRequestBody = await request.json()

  try {
    // idを指定して、Categoryを更新
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}