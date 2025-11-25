import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Paper, Typography } from '@mui/material'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import api from '../../lib/api'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)
interface SalesReport { totalOrders: number; totalRevenue: number }
interface UserAnalytics { totalUsers: number; admins: number }
export default function AdminDashboard() {
  const [sales, setSales] = useState<SalesReport | null>(null)
  const [users, setUsers] = useState<UserAnalytics | null>(null)
  useEffect(() => {
    api.get('/admin/reports/sales').then(res => setSales(res.data))
    api.get('/analytics/users').then(res => setUsers(res.data))
  }, [])
  if (!sales || !users) return null
  return (
    <div>
      <Typography variant="h4" className="mb-6 font-bold">Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6 flex flex-col items-center justify-center h-40">
            <Typography color="text.secondary">Total Revenue</Typography>
            <Typography variant="h3" className="font-bold text-green-500">${sales.totalRevenue}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6 flex flex-col items-center justify-center h-40">
            <Typography color="text.secondary">Total Orders</Typography>
            <Typography variant="h3" className="font-bold text-blue-500">{sales.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6 flex flex-col items-center justify-center h-40">
            <Typography color="text.secondary">Total Users</Typography>
            <Typography variant="h3" className="font-bold text-purple-500">{users.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">Sales Overview</Typography>
            <div className="h-64">
              <Bar
                data={{ labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'Sales', data: [12, 19, 3], backgroundColor: '#3b82f6' }] }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">User Distribution</Typography>
            <div className="h-64 flex justify-center">
              <Doughnut
                data={{ labels: ['Admins', 'Customers'], datasets: [{ data: [users.admins, users.totalUsers - users.admins], backgroundColor: ['#ec4899', '#3b82f6'] }] }}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}