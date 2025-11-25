'use client'
import { LayoutDashboard, Package, Users, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && user?.role !== 'admin') router.push('/') }, [user, loading, router])
  if (loading || user?.role !== 'admin') return null
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
        <div className="mb-8 text-2xl font-bold text-blue-400">Admin Panel</div>
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded"><LayoutDashboard size={20} />Dashboard</Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded"><Package size={20} />Products</Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded"><ShoppingBag size={20} />Orders</Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded"><Users size={20} />Users</Link>
        </nav>
      </aside>
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 overflow-auto">{children}</div>
    </div>
  )
}