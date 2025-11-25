import { Container, Typography, Paper, Chip, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { Package, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Image from 'next/image'
interface Order { id: number; createdAt: string; total: number; status: string }
interface Product { id: number; imageUrl: string; title: string; price: number }
interface Shipment { id: number; service: string; status: string; days: number }
export default function Profile() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [recs, setRecs] = useState<Product[]>([])
  const [tracking, setTracking] = useState<Shipment | null>(null)
  const [openTrack, setOpenTrack] = useState(false)
  useEffect(() => {
    if (user) {
      api.get(`/orders?userId=${user.id}`).then(res => setOrders(res.data))
      api.get(`/recommendations/for-user/${user.id}`).then(res => setRecs(res.data))
    }
  }, [user])
  const trackOrder = async (orderId: number) => {
    try {
      const res = await api.get(`/shipping/track/${orderId}`)
      setTracking(res.data)
      setOpenTrack(true)
    } catch (e) {
      console.error(e)
      alert('Tracking Information Not Available For This Order!')
    }
  }
  if (!user) return null
  return (
    <Container className="py-10 pt-28">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">{user.name[0]}</div>
        <div>
          <Typography variant="h4" className="font-bold">{user.name}</Typography>
          <Typography color="text.secondary">{user.email} • <span className="uppercase">{user.role}</span></Typography>
        </div>
      </div>
      <Typography variant="h5" className="mb-4 font-bold flex items-center gap-2"><Package /> Order History</Typography>
      <Paper className="overflow-hidden mb-10 glass">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Id</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>#{o.id}</TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${o.total}</TableCell>
                <TableCell><Chip label={o.status} color={o.status === 'pending' ? 'warning' : 'success'} size="small" /></TableCell>
                <TableCell>
                  <Button size="small" startIcon={<Truck size={16} />} onClick={() => trackOrder(o.id)}>Track</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Typography variant="h5" className="mb-4 font-bold">Recommended For You</Typography>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recs.map((p) => (
          <Paper key={p.id} className="p-3 glass-card">
            <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
              <Image
                src={p.imageUrl}
                alt={p.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <Typography className="font-semibold truncate">{p.title}</Typography>
            <Typography color="primary">${p.price}</Typography>
          </Paper>
        ))}
      </div>
      <Dialog open={openTrack} onClose={() => setOpenTrack(false)}>
        <DialogTitle>Tracking Information</DialogTitle>
        <DialogContent>
          {tracking ? (<div className="min-w-[300px] space-y-2 pt-2"><Typography><strong>Tracking Id:</strong> #{tracking.id}</Typography><Typography><strong>Service:</strong> {tracking.service}</Typography><Typography><strong>Estimated Days:</strong> {tracking.days}</Typography><Chip label={tracking.status} color="primary" /></div>) : (<Typography>Loading...</Typography>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTrack(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}