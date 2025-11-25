'use client'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { getUsers } from '../../../lib/queries'
import { Paper, Avatar } from '@mui/material'
import { useQuery } from '@apollo/client/react'
interface User { id: number; name: string; email: string; role: string }
export default function AdminUsers() {
  const { data } = useQuery<{ users: User[] }>(getUsers)
  const cols: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 70 },
    { field: 'avatar', headerName: '', width: 60, renderCell: (p: GridRenderCellParams) => (<Avatar>{p.row.name ? p.row.name[0] : 'U'}</Avatar>) },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 120 }
  ]
  return (
    <div className="h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Paper className="h-full">
        <DataGrid
          rows={data?.users || []}
          columns={cols}
        />
      </Paper>
    </div>
  )
}