'use client'
import { Container, Typography, Button, IconButton, Divider } from '@mui/material'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useMutation } from '@apollo/client/react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder } from '../../lib/queries'
import { useRouter } from 'next/navigation'
import api from '../../lib/api'
import Image from 'next/image'
import Link from 'next/link'
interface CreateOrderData { createOrder: { id: number; total: number; status: string } }
interface CreateOrderVars { input: { userId: number; items: string[]; total: number } }
export default function Cart() {
  const { items, removeFromCart, addToCart, removeOne, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [makeOrder] = useMutation<CreateOrderData, CreateOrderVars>(createOrder)
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const checkout = async () => {
    if (!user) return router.push('/auth/login')
    try {
      const result = await makeOrder({
        variables: {
          input: {
            userId: user.id,
            items: items.map(i => JSON.stringify({ productId: i.id, quantity: i.quantity })),
            total
          }
        }
      })
      if (result.data) {
        const orderId = result.data.createOrder.id
        await api.post('/payments/create', { providerId: 'stripe_mock', amount: total, orderId })
        await api.post('/shipping/estimate', { orderId })
        clearCart()
        router.push('/profile')
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)
      } else {
        console.error('An Unknown Error Occurred')
      }
      alert('Checkout Failed')
    }
  }
  return (
    <div className="min-h-screen pt-10 pb-20 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-violet-500/10 dark:bg-green-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 dark:bg-blue-500/10 rounded-full blur-[100px] -z-10" />
      <Container className="max-w-5xl relative z-10">
        <Typography variant="h3" className="mb-8 font-black bg-gradient-to-r from-violet-600 to-pink-600 dark:from-green-400 dark:to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
          <ShoppingBag className="text-violet-600 dark:text-green-400" size={40} /> Shopping Cart
        </Typography>
        {items.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center">
            <Typography variant="h5" className="mb-4 font-bold opacity-80">Your Cart Is Currently Empty</Typography>
            <Link href="/shop">
              <Button variant="contained" size="large" className="rounded-xl px-8 py-3 shadow-lg shadow-violet-500/20 dark:shadow-green-500/20 bg-gradient-to-r from-violet-600 to-pink-600 dark:from-green-500 dark:to-emerald-600">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {items.map(i => (
                <div key={i.id} className="glass-card p-4 rounded-2xl flex items-center gap-6 group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md relative">
                    <Image
                      src={i.imageUrl}
                      alt={i.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <Typography variant="h6" className="font-bold leading-tight mb-1">{i.title}</Typography>
                    <Typography variant="h6" className="text-violet-600 dark:text-green-400 font-bold">${i.price}</Typography>
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 rounded-xl p-1 backdrop-blur-sm">
                    <IconButton size="small" onClick={() => removeOne(i.id)} className="hover:bg-white dark:hover:bg-black/40"><Minus size={16} /></IconButton>
                    <span className="w-6 text-center font-bold">{i.quantity}</span>
                    <IconButton size="small" onClick={() => addToCart(i)} className="hover:bg-white dark:hover:bg-black/40"><Plus size={16} /></IconButton>
                  </div>
                  <IconButton color="error" onClick={() => removeFromCart(i.id)} className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 ml-2">
                    <Trash2 size={20} />
                  </IconButton>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-96">
              <div className="glass p-8 rounded-3xl sticky top-28 border border-white/20">
                <Typography variant="h5" className="mb-6 font-bold">Order Summary</Typography>
                <div className="space-y-3 mb-6 opacity-80">
                  <div className="flex justify-between text-lg"><Typography>Subtotal</Typography><Typography className="font-bold">${total.toFixed(2)}</Typography></div>
                  <div className="flex justify-between"><Typography>Shipping</Typography><Typography className="text-green-500 font-medium">Free</Typography></div>
                  <div className="flex justify-between"><Typography>Taxes</Typography><Typography>Calculated At Checkout</Typography></div>
                </div>
                <Divider className="mb-6 border-dashed" />
                <div className="flex justify-between mb-8">
                  <Typography variant="h5" className="font-black">Total</Typography>
                  <Typography variant="h4" className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 dark:from-green-400 dark:to-emerald-600">
                    ${total.toFixed(2)}
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={checkout}
                  endIcon={<ArrowRight />}
                  className="py-4 rounded-xl text-lg font-bold shadow-xl shadow-violet-500/30 dark:shadow-green-500/30 bg-gradient-to-r from-violet-600 to-pink-600 dark:from-green-500 dark:to-emerald-600 hover:scale-[1.02] transition-transform"
                >
                  Checkout Now
                </Button>
                <Typography variant="caption" className="block text-center mt-4 opacity-50">
                  Secure Checkout Powered By Stripe
                </Typography>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}