'use client'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { getOrders } from '../../../lib/queries'
import { useQuery } from '@apollo/client/react'
import { Paper, Chip } from '@mui/material'
interface Order { id: number; userId: number; total: number; status: string; createdAt: string }
export default function AdminOrders() {
  const { data } = useQuery<{ orders: Order[] }>(getOrders)
  const cols: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 90 },
    { field: 'userId', headerName: 'User Id', width: 100 },
    { field: 'total', headerName: 'Total ($)', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (p: GridRenderCellParams) => (
        <Chip label={p.value as string} color={p.value === 'pending' ? 'warning' : 'success'} size="small" />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 200,
      valueFormatter: (value: string) => new Date(value).toLocaleString()
    }
  ]
  return (
    <div className="h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <Paper className="h-full">
        <DataGrid
          rows={data?.orders || []}
          columns={cols}
        />
      </Paper>
    </div>
  )
}