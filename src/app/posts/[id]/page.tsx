'use client';

import React, {useEffect, useState} from 'react'
import { Container, Card, CardMedia, Typography, Box, Chip } from '@mui/material';
import parse from 'html-react-parser';
import { MicroCmsPost } from "@/app/_types/Post";
import {useParams} from "next/navigation";

export default function Page() {
  const params = useParams() as { id: string };
  const { id } = params;

  const [ post, setPost ] = useState<MicroCmsPost | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };

  // APIでpostsを取得する処理をuseEffectで実行する
  useEffect(() => {
    const fetcher = async () => {
        const res = await fetch(`https://f15a9rs0qh.microcms.io/api/v1/posts/${id}`, { // 管理画面で取得したエンドポイント
            headers: { // fetch関数の第二引数にheaderを設定し、その中にAPIを設定
                'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string, // 管理画面で取得したAPIキー
            },
        })
        const data = await res.json()
        setPost(data)
        setLoading(false)
    }
    if (!post) {
        <div>記事が見つかりません</div>
    }

    fetcher()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (!loading && !post) {
    return <div>記事が見つかりません</div>
  }

  return (
      <Container maxWidth="md" sx={{ pb: 5 }}>
        <Card>
            {post?.thumbnail && (
              <CardMedia
                  component="img"
                  image={post.thumbnail.url}
                  alt={post.title || 'サムネイル'}
              />
            )}
        </Card>
        <Box sx={{ padding: '20px' }}>
          <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
          >
            <Typography sx={{ fontSize: '13px', color: '#888888' }}>
            {post?.createdAt ? formatDate(Date.parse(post.createdAt)) : '日付なし'}
            </Typography>
            <Box>
              {post?.categories.map((category) => (
                  <Box key={category.id} sx={{ mr: 1, display: 'inline-block' }}>
                    <Chip
                        label={category.name || '不明なカテゴリ'}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    />
                  </Box>
              ))}
            </Box>
          </Box>
          <Typography sx={{ fontSize: '24px', padding: '15px 0' }}>
            {post?.title || 'タイトルなし'}
          </Typography>
          <Typography sx={{ fontSize: '16px' }}>
            {post?.content ? parse(post.content) : '本文なし'}
          </Typography>
        </Box>
      </Container>
  );
};