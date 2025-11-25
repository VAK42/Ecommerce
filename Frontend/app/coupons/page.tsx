'use client'
import { Container, Typography, Card, CardContent, Button } from '@mui/material'
import { TicketPercent, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
interface Coupon { id: number; code: string; discount: number; active: boolean }
export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  useEffect(() => {
    api.get('/coupons').then(res => setCoupons(res.data)).catch(() => { })
  }, [])
  return (
    <Container className="py-10 min-h-[60vh]">
      <Typography variant="h3" className="mb-8 font-black flex items-center gap-3">
        <TicketPercent size={40} className="text-violet-600 dark:text-green-400" /> Active Coupons
      </Typography>
      {coupons.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center">
          <Typography variant="h5" className="opacity-60">No Active Coupons At The Moment!</Typography>
          <Typography className="opacity-40 mt-2">Check Back Later For Exclusive Deals!</Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c) => (
            c.active && (
              <Card key={c.id} className="glass-card border-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-violet-600 dark:bg-green-600 text-white px-3 py-1 rounded-bl-xl font-bold text-xs">
                  {c.discount}% Off
                </div>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-white/50 dark:bg-black/20">
                    <Typography variant="h4" className="font-black tracking-widest text-violet-600 dark:text-green-400">
                      {c.code}
                    </Typography>
                  </div>
                  <Typography variant="h6" className="font-bold mb-4">Save {c.discount}% On Your Order</Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Copy size={16} />}
                    onClick={() => {
                      navigator.clipboard.writeText(c.code)
                      alert('Coupon Copied!')
                    }}
                    className="rounded-xl shadow-lg shadow-violet-500/20 dark:shadow-green-500/20"
                  >
                    Copy Code
                  </Button>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}
    </Container>
  )
}