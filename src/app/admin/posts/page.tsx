// 記事一覧ページ admin/posts
'use client';

import Link from 'next/link'
import { useEffect, useState } from "react";

export default function Page() {
  const [ posts, setPosts ] = useState<Post[]>([]);


  // Post型の定義
  interface Post{
    id: number;
    title: string;
    content: string;
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/posts')
      const { posts } = await res.json()
      setPosts(posts)
    }

    fetcher()
  }, []);

  return (

    <div className="">
      <div className="">
        <h1 className="">記事一覧</h1>
        <button className="">
          <Link href='/admin/posts/new'>新規作成</Link>
        </button>
      </div>

    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}