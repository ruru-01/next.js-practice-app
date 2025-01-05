import * as React from 'react'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { Category } from '@/types/Category'
import { useEffect } from 'react'

interface Props {
  // 選択されたカテゴリー
  selectedCategories: Category[]
  // カテゴリーが選択されたときに呼び出される関数
  setSelectedCategories: (categories: Category[]) => void
  className?: string;
}

// カテゴリーを選択するセレクトボックス
export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
  className
}) => {
  // カテゴリーの一覧
  // ここではダミーデータを使っているが、実際にはAPIから取得する
  const [categories, setCategories] = React.useState<Category[]>([])

  // カテゴリーを取得
  const handleChange = (value: number[]) => {
    // 選択されたカテゴリーを取得
    value.forEach((v: number) => {
      // 選択されたカテゴリーがすでに選択されているかチェック
      const isSelect = selectedCategories.some((c) => c.id === v)
      if (isSelect) {
        setSelectedCategories(selectedCategories.filter((c) => c.id !== v))
        return
      }

      const category = categories.find((c) => c.id === v) // 選択されたカテゴリーを取得
      if (!category) return // カテゴリーが見つからない場合は何もしない
      setSelectedCategories([...selectedCategories, category]) // 選択されたカテゴリーを追加
    })
  }

  // コンポーネントがマウントされたときに一度だけ実行される
  useEffect(() => {
    const fetcher = async () => { // 非同期関数として定義されており、APIからカテゴリーを取得する
      const res = await fetch('/api/admin/categories')
      const { categories } = await res.json() // レスポンスをJSON形式に変換
      setCategories(categories)
    }

    // fetcher関数を呼び出して、上記の非同期処理を実行する
    fetcher()
  }, [])

  return (
    // カテゴリーを複数選択するセレクトボックスを提供
    <FormControl className={className}>
      <Select
        multiple  // 複数選択可能にする
        value={selectedCategories} // 選択されたカテゴリー
        onChange={(e) => handleChange((e.target.value as unknown) as number[])} // カテゴリーが選択されたときに呼び出される関数
        input={<OutlinedInput />}

        // 選択されたカテゴリーをChipコンポーネントとして表示する
        renderValue={(selected: Category[]) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: Category) => (
              <Chip key={value.id} label={value.name} />
            ))}
          </Box>
        )}
      >

        {/* 各カテゴリーを選択肢として表示する */}
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}