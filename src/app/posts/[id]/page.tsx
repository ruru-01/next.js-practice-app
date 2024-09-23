'use client';

import React, {useEffect, useState} from 'react'
import { Card, Typography, Box, Container, Chip, CardMedia } from '@mui/material';
import parse from 'html-react-parser';
import {Post} from "@/app/_types/Post";
import {API_BASE_URL} from "@/app/Constants";
import {useParams} from "next/navigation";

export default function Page() {
  const params = useParams() as { id: string };
  const { id } = params;

  const [ post, setPosts ] = useState<Post | null>(null);
  const [ loading, setLoading ] = useState<boolean>(false);

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };

  // APIでpostsを取得する処理をuseEffectで実行する
  useEffect(() => {
    if (!id) return;
    const fetcher = async () => {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/posts/${id}`)
      const { post } = await res.json()
      setPosts(post)
      setLoading(false)
    }
    fetcher()
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
          <CardMedia
              component="img"
              image={post?.thumbnailUrl}
              alt={post?.title}
          />
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
              {formatDate(post?.createdAt || 0)}
            </Typography>
            <Box>
              {post?.categories?.map((category, index) => (
                  <Box key={index} sx={{ mr: 1, display: 'inline-block' }}>
                    <Chip
                        label={category}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    />
                  </Box>
              ))}
            </Box>
          </Box>
          <Typography sx={{ fontSize: '24px', padding: '15px 0' }}>
            {post?.title}
          </Typography>
          <Typography sx={{ fontSize: '16px' }}>
            {parse(post?.content || '')}
          </Typography>
        </Box>
      </Container>
  );
};