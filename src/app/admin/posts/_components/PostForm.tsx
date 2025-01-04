import { Category } from '@/types/Category'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { CategoriesSelect } from './CategoriesSelect'
import { v4 as uuidv4 } from 'uuid' // 固有IDを生成するライブラリ
import { supabase } from '@/utils/supabase'
import Image from 'next/image'

interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailImageKey: string
  setThumbnailImageKey: (thumbnailImageKey: string) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
}) => {

  /**
   * サムネイル画像のURL
   * thumbnailImageKeyを元に、Supabaseから取得した画像のURLを格納する
   * 画像がアップロードされるたびに、画像のURLを取得する
   */
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      // 画像が選択されていないのでreturn
      return
    }

    const file = event.target.files[0] // 選択された画像を取得

    const filePath = `private/${uuidv4()}` // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
    .from('post_thumbnail') // バケット（post_thumbnail）を指定
    .upload(filePath, file, {
      cacheControl: '3600', // キャッシュの有効期限を指定
      upsert: false, // すでにファイルが存在する場合、上書きしない
    })

    // エラーが発生した場合、エラーメッセージを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path)
  }

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return

    // Supabaseから画像のURLを取得する関数
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
      // バケット名を指定して、画像のURLを取得
      .from('post_thumbnail')
      // 画像のkeyを指定
      .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])


  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
        />
        {thumbnailImageUrl && (
          <div className='mt-2'>
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="thumbnailUrl"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <button
        type="submit"
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          onClick={onDelete}
        >
          削除
        </button>
      )}
    </form>
  )
}