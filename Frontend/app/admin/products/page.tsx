'use client'
import { Button, Dialog, DialogContent, DialogTitle, TextField, Paper, Typography } from '@mui/material'
import { getProducts, createProduct, updateProduct, removeProduct } from '../../../lib/queries'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useQuery, useMutation } from '@apollo/client/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Plus, Trash, Edit } from 'lucide-react'
import { useState } from 'react'
interface RichEditorProps { content: string; onChange: (html: string) => void }
const RichEditor = ({ content, onChange }: RichEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })
  return <EditorContent editor={editor} className="border rounded p-2 min-h-[150px] prose dark:prose-invert max-w-none" />
}
interface Product { id: number; title: string; price: number; stock: number; category: string; rating: number; imageUrl: string; description?: string }
interface ProductForm { id?: number; title: string; price: number; stock: number; category: string; imageUrl: string; description: string }
export default function AdminProducts() {
  const { data, refetch } = useQuery<{ products: Product[] }>(getProducts, { variables: { limit: 100 } })
  const [makeProduct] = useMutation(createProduct)
  const [modProduct] = useMutation(updateProduct)
  const [delProduct] = useMutation(removeProduct)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ProductForm>({ title: '', price: 0, stock: 0, category: '', description: '', imageUrl: '' })
  const save = async () => {
    const input = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: 0
    }
    if (form.id) {
      await modProduct({ variables: { input: { ...input, id: Number(form.id) } } })
    } else {
      await makeProduct({ variables: { input } })
    }
    setOpen(false)
    refetch()
    setForm({ title: '', price: 0, stock: 0, category: '', description: '', imageUrl: '' })
  }
  const del = async (id: number) => {
    if (confirm('Delete?')) {
      await delProduct({ variables: { id: Number(id) } })
      refetch()
    }
  }
  const cols: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 70 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'category', headerName: 'Category', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (p: GridRenderCellParams) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => {
            const rowData = p.row as Product
            setForm({
              id: rowData.id,
              title: rowData.title,
              price: rowData.price,
              stock: rowData.stock,
              category: rowData.category,
              imageUrl: rowData.imageUrl,
              description: rowData.description || ''
            })
            setOpen(true)
          }}>
            <Edit size={16} />
          </Button>
          <Button size="small" color="error" onClick={() => del(p.row.id)}>
            <Trash size={16} />
          </Button>
        </div>
      )
    }
  ]
  return (
    <div className="h-[80vh] flex flex-col">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products (Graphql)</h1>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => {
            setForm({ title: '', price: 0, stock: 0, category: '', description: '', imageUrl: '' })
            setOpen(true)
          }}
        >
          Add Product
        </Button>
      </div>
      <Paper className="flex-1">
        <DataGrid
          rows={data?.products || []}
          columns={cols}
          checkboxSelection
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{form.id ? 'Edit Product' : 'New Product'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          <TextField label="Title" fullWidth value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
          <div className="flex gap-4">
            <TextField label="Price" type="number" fullWidth value={form.price || 0} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            <TextField label="Stock" type="number" fullWidth value={form.stock || 0} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
          </div>
          <TextField label="Category" fullWidth value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} />
          <TextField label="Image URL" fullWidth value={form.imageUrl || ''} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          <Typography variant="subtitle2">Description</Typography>
          <RichEditor content={form.description || ''} onChange={(h: string) => setForm({ ...form, description: h })} />
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}