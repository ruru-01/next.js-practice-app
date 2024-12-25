// カテゴリー一覧ページ admin/categories

'use client'

import { Category } from '@prisma/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories')
      const { categories } = await res.json()
      setCategories(categories)
    }
    fetcher()
  }, [])

  return(
    <div className=''>
      <div className=''>
        <h1>カテゴリー一覧</h1>
        <button className=''>
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>

      <div className=''>
        {categories.map((category) => {
          return (
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className=''>
                <div className=''>{category.name}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}