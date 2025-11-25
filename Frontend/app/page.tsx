'use client'
import { Typography, Container, CircularProgress, Button } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectCards } from 'swiper/modules'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import 'swiper/css/effect-cards'
import 'swiper/css/pagination'
import Link from 'next/link'
import api from '../lib/api'
import 'swiper/css'
interface Product { id: number; title: string; price: number; imageUrl: string; rating: number; description: string }
export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [top, setTop] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([api.get('/products/featured'), api.get('/products/top')])
      .then(([f, t]) => { setFeatured(f.data); setTop(t.data); setLoading(false) })
  }, [])
  if (loading) return <div className="h-screen flex items-center justify-center"><CircularProgress /></div>
  return (
    <div className="space-y-20">
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-transparent to-pink-100/50 dark:from-green-900/20 dark:to-black pointer-events-none" />
        <Container className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-bold text-violet-600 dark:text-green-400">
              <Sparkles size={16} /> New Collection 2025
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
              Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 dark:from-green-400 dark:to-emerald-600">Fashion</span>
            </h1>
            <p className="text-xl opacity-70 mb-8 max-w-lg leading-relaxed">Experience The Next Generation Of Shopping With Our Curated Collection Of Premium Products.</p>
            <div className="flex gap-4">
              <Link href="/shop"><Button variant="contained" size="large" className="rounded-full px-8 py-4 text-lg shadow-xl shadow-violet-500/30 dark:shadow-green-500/30">Explore Now</Button></Link>
              <Link href="/auth/register"><Button variant="outlined" size="large" className="rounded-full px-8 py-4 text-lg border-2">Join Us</Button></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="hidden md:block">
            <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards, Autoplay]} autoplay={{ delay: 2500 }} className="w-full max-w-[320px] h-[420px]">
              {featured.slice(0, 5).map((p) => (
                <SwiperSlide key={p.id} className="rounded-2xl overflow-hidden shadow-2xl relative">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white z-10">
                    <Typography variant="h6" className="font-bold">{p.title}</Typography>
                    <Typography color="primary" className="font-bold">${p.price}</Typography>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </Container>
      </section>
      <Container>
        <div className="flex justify-between items-end mb-10">
          <div>
            <Typography variant="h3" className="font-black mb-2">Featured Drops</Typography>
            <Typography className="opacity-60">Handpicked Just For You</Typography>
          </div>
          <Link href="/shop">
            <Button endIcon={<ArrowRight />} color="inherit">View All</Button>
          </Link>
        </div>
        <Swiper modules={[Autoplay, Pagination]} spaceBetween={24} slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }} autoplay={{ delay: 4000 }} className="!pb-14">
          {featured.map((p) => (<SwiperSlide key={p.id} className="h-auto"><ProductCard product={p} /></SwiperSlide>))}
        </Swiper>
      </Container>
      <Container className="pb-20">
        <div className="p-6 md:p-12 rounded-3xl glass text-center mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 dark:from-green-500/10 dark:to-blue-500/10 z-0" />
          <div className="relative z-10">
            <Typography variant="h3" className="font-black mb-4">Top Rated Gear</Typography>
            <Typography className="opacity-60 mb-8 max-w-2xl mx-auto">Our Community&apos;s Favorite Picks. Verified Reviews, Premium Quality.</Typography>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10 text-left">
            {top.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </Container>
    </div>
  )
}