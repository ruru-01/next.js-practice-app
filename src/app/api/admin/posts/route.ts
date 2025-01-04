import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/supabase";

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // DBとの接続を切断する（これを省くとDBとの接続が維持されたままになり、リクエストが増えるとDBの接続数が増えてしまうため）
    await prisma.$disconnect()

    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// 記事作成のリクエストボディの型
interface CreatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
export const POST = async (request: NextRequest, context: any) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からtitle, contant, categories, thumbnailUrlを取り出す
    const { title, content, categories, thumbnailImageKey } = body

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないためfor文1つずつ実施する
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      })
    }

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