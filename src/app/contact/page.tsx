'use client'

import * as React from 'react';
import { Button, Container, Grid2, TextField, Typography } from "@mui/material";
import {useState} from "react";
import {API_BASE_URL} from "@/app/Constants";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Page() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  // バリデーション
  const valid = () => {
    const errorMessage: Errors = {};

    if (!name) {
      errorMessage.name = "お名前は必須です。";
    } else if (name.length > 30) {
      errorMessage.name = "お名前は30文字以内で入力してください。";
    }

    if (!email) {
      errorMessage.email = "メールアドレスは必須です。";
    } else if (!email.match(/.+@.+\..+/)) {
      errorMessage.email = "有効なメールアドレスを入力してください。";
    }

    if (!message) {
      errorMessage.message = "本文は必須です。"
    } else if (message.length > 500) {
      errorMessage.message = "本文は500文字以内で入力してください。";
    }

    setErrors(errorMessage);
    return Object.keys(errorMessage).length === 0;
  }

  // フォームの送信
  const handleSubmit = async () => {
    if (!valid()) return

    setLoading(true);

    await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    window.alert('送信しました。');
    handleClear();
    setLoading(false);
  };

  // フォームクリア
  const handleClear = () => {
    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
  }

  return (
      <Container maxWidth="md" sx={{ pb: 10 }}>
        <Grid2 container direction="column" spacing={3}>
          <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 'bold',
              }}
          >
            問い合わせフォーム
          </Typography>

          <Grid2
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
          >
            <Typography
                sx={{
                  width: '300px',
                }}
            >
              お名前
            </Typography>
            <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: 'black',
                      },
                    },
                  },
                }}
            />
          </Grid2>
          <Grid2
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
          >
            <Typography
                sx={{
                  width: '300px',
                }}
            >
              メールアドレス
            </Typography>
            <TextField
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: 'black',
                      },
                    },
                  },
                }}
            />
          </Grid2>
          <Grid2
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
          >
            <Typography
                sx={{
                  width: '300px',
                }}
            >
              本文
            </Typography>
            <TextField
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={!!errors.message}
                helperText={errors.message}
                disabled={loading}
                multiline
                minRows={10}
                maxRows={10}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: 'black',
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    resize: 'vertical',
                    overflowY: 'auto',
                  },
                }}
            />
          </Grid2>
          <Grid2
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                borderRadius: '50px',
                height: '40px',
              }}
          >
            <Button
                onClick={handleSubmit}
                variant="contained"
                size="medium"
                disabled={loading}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: '#1F2937',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                }}
            >
              送信
            </Button>
            <Button
                onClick={handleClear}
                variant="contained"
                size="medium"
                disabled={loading}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: '#E5E7EB',
                  color: 'black',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                }}
            >
              クリア
            </Button>
          </Grid2>
        </Grid2>
      </Container>
  );
};