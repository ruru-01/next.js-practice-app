'use client';

import React, {useEffect, useState} from 'react'
import { Container, Card, CardMedia, Typography, Box, Chip } from '@mui/material';
import parse from 'html-react-parser';
import {useParams} from "next/navigation";
import { Post } from '@/types/post'

export default function Page() {
  const params = useParams() as { id: string };
  const { id } = params;
  const [ post, setPost ] = useState<Post | null>(null);
  const [ loading, setLoading ] = useState(false);

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
        setLoading(true)
        const res = await fetch(`/api/posts/${id}`) // APIを
        const { post } = await res.json()
        setPost(post)
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
            {post?.thumbnailUrl && (
              <CardMedia
                  component="img"
                  image={post.thumbnailUrl}
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
            {/* プロパティ 'map' は型 '{ category: { id: number; name: string; createdAt: Date; updatedAt: Date; }; }' に存在しません。 */}
              {post?.postCategories.map((postCategory) => (
                  <Box key={postCategory.id} sx={{ mr: 1, display: 'inline-block' }}>
                    <Chip
                        label={postCategory.name || '不明なカテゴリ'}
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