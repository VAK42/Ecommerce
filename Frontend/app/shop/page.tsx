import { Container, TextField, CircularProgress, Typography, Alert, Pagination } from '@mui/material'
import ProductCard from '../../components/ProductCard'
import { getProducts } from '../../lib/queries'
import { useQuery } from '@apollo/client/react'
import { useState, ChangeEvent } from 'react'
import { Search } from 'lucide-react'
interface Product { id: number; title: string; price: number; stock: number; category: string; rating: number; imageUrl: string; description: string }
export default function Shop() {
  const itemsPerPage = 3
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const { data, loading, error } = useQuery<{ products: Product[] }>(getProducts, {
    variables: { limit: 100 },
    fetchPolicy: 'network-only'
  })
  const filtered = data?.products?.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())) || []
  const count = Math.ceil(filtered.length / itemsPerPage)
  const displayedProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const handlePageChange = (e: ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold">Shop All</Typography>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <TextField
            placeholder="Filter Products..."
            size="small"
            className="pl-10"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            sx={{ '& .MuiInputBase-input': { paddingLeft: '2.5rem' } }}
          />
        </div>
      </div>
      {error && (<Alert severity="error" className="mb-6">Error Loading Products: {error.message}</Alert>)}
      {loading ? (<div className="flex justify-center py-20"><CircularProgress /></div>) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((p) => (<ProductCard key={p.id} product={{ ...p, description: p.description || '' }} />))
            ) : (
              <Typography className="col-span-full text-center opacity-60 py-10">
                {error ? 'Unable To Load Products!' : 'No Products Found!'}
              </Typography>
            )}
          </div>
          {count > 1 && (
            <div className="flex justify-center pb-8">
              <Pagination count={count} page={page} onChange={handlePageChange} color="primary" size="large" shape="rounded" siblingCount={0} boundaryCount={1} />
            </div>
          )}
        </>
      )}
    </Container>
  )
}