'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography, Grid2, Box, Container, Chip, CardActionArea} from '@mui/material';
import parse from 'html-react-parser';
import { MicroCmsPost } from './_types/Post';
import Link from 'next/link';

export default function Page() {
  const [ posts, setPosts ] = useState<MicroCmsPost[]>([]);
  const [ loading ] = useState<boolean>(false);
  const formatDate = (dateString: number) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };

  // APIでpostsを取得する処理をuseEffectで実行する
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('https://f15a9rs0qh.microcms.io/api/v1/posts', { // 管理画面で取得したエンドポイント
            headers: {
                    'X-MICROCMS-API-KEY' : process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string, // 管理画面で取得したAPIキー
                },
          })
      const { contents } = await res.json()
      setPosts(contents)
    }

    fetcher()
  }, []);

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (!loading && (!posts || posts.length === 0)) {
    return <div>記事が見つかりません</div>
  }

  return (
      <Container maxWidth="md" sx={{ pb: 5 }}>
        <Grid2 container direction="column" spacing={5}>
          {posts.map((post) => (
              <Link href={`/posts/${post.id}`} passHref key={post.id}>
                <CardActionArea component="a">
                  <Card
                      sx={{
                        boxShadow: 'none',
                        border: '1px solid #e0e0e0',
                        pr: 10
                      }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Typography
                            sx={{
                              fontSize: '13px',
                              color: '#888888'
                            }}
                        >
                          {post.createdAt ? formatDate(Date.parse(post.createdAt)) : '日付なし'}
                        </Typography>
                        <Box>
                          {post.categories.map((category) => (
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
                      <Typography sx={{ fontSize: '24px' }}>{post.title || 'タイトルなし'}</Typography>
                      <Typography
                          sx={{
                            pt: 2,
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                          }}
                      >
                        {post.content ? parse(post.content) : '本文なし'}
                      </Typography>
                    </CardContent>
                  </Card>
                </CardActionArea>
              </Link>
          ))}
        </Grid2>
      </Container>
  );
};