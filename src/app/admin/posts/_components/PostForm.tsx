import { Category } from '@/types/Category'
import React from 'react'
import { CategoriesSelect } from './CategoriesSelect'

interface Props {
  mode: 'new' | 'edit';
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (thumbnailUrl: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleted: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  onSubmit,
  onDeleted,
}) => {
  return(
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e)=> setTitle(e.target.value)}
          />
      </div>
      <div>
        <label htmlFor="content">本文</label>
        <textarea
          id="content"
          value={content}
          onChange={(e)=> setContent(e.target.value)}
          />
      </div>
      <div>
        <label htmlFor="thumbnailUrl">サムネイルURL</label>
        <input
          type="text"
          id="thumbnailUrl"
          value={thumbnailUrl}
          onChange={(e)=> setThumbnailUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="categories">カテゴリー</label>

        {/* CategoriesSelectコンポーネントを呼び出す */}
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
        {mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          onClick={onDeleted}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
          削除
        </button>
      )}
    </form>
  )
}