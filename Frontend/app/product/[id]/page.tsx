'use client'
import { Container, Typography, Button, Rating, Divider, TextField, Avatar, CircularProgress } from '@mui/material'
import { ShoppingCart, Image as ImageIcon } from 'lucide-react'
import ProductCard from '../../../components/ProductCard'
import { useCart } from '../../../context/CartContext'
import { useAuth } from '../../../context/AuthContext'
import { getProduct } from '../../../lib/queries'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import api from '../../../lib/api'
import Image from 'next/image'
interface Product { id: number; title: string; price: number; stock: number; category: string; rating: number; imageUrl: string; description: string }
interface Review { id: number; rating: number; comment: string }
export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { data, loading } = useQuery<{ product: Product }>(getProduct, { variables: { id: Number(id) }, skip: !id })
  const product = data?.product
  const [reviews, setReviews] = useState<Review[]>([])
  const [similar, setSimilar] = useState<Product[]>([])
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  useEffect(() => {
    if (!id) return
    api.get(`/reviews?productId=${id}`).then(res => setReviews(res.data))
    api.get(`/recommendations/similar/${id}`).then(res => setSimilar(res.data))
  }, [id])
  const postReview = async () => {
    if (!comment) return
    await api.post('/reviews', { productId: Number(id), userId: user?.id, rating, comment })
    const res = await api.get(`/reviews?productId=${id}`)
    setReviews(res.data)
    setComment('')
  }
  if (loading) return <div className="h-screen flex items-center justify-center"><CircularProgress /></div>
  if (!product) return null
  return (
    <Container className="py-10">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          {product.imageUrl ? (<div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden"><Image src={product.imageUrl} alt={product.title} fill className="object-cover" unoptimized /></div>) : (<div className="w-full h-96 bg-gray-200 rounded flex items-center justify-center"><ImageIcon size={64} /></div>)}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} className="flex flex-col gap-4">
          <Typography variant="h3" className="font-bold">{product.title}</Typography>
          <div className="flex items-center gap-2">
            <Rating value={product.rating} readOnly precision={0.5} />
            <Typography color="text.secondary">({reviews.length} Reviews)</Typography>
          </div>
          <Typography variant="h4" color="primary">${product.price}</Typography>
          <Typography className="text-gray-600">{product.description}</Typography>
          <Typography>Stock: {product.stock}</Typography>
          <Button variant="contained" size="large" startIcon={<ShoppingCart />} onClick={() => addToCart(product)}>Add To Cart</Button>
        </Grid>
      </Grid>
      <Divider className="my-8" />
      <Typography variant="h5" className="mb-4 font-bold">Reviews</Typography>
      <div className="space-y-4 mb-8">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Avatar sx={{ width: 24, height: 24 }}>U</Avatar>
              <Rating value={r.rating} size="small" readOnly />
            </div>
            <Typography>{r.comment}</Typography>
          </div>
        ))}
        {user && (<div className="flex gap-4 items-start mt-6"><Rating value={rating} onChange={(_, v) => setRating(v || 5)} /><TextField fullWidth multiline rows={2} placeholder="Write A Review..." value={comment} onChange={e => setComment(e.target.value)} /><Button variant="contained" onClick={postReview}>Post</Button></div>)}
      </div>
      <Typography variant="h5" className="mb-4 font-bold">Similar Products</Typography>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similar.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </Container>
  )
}