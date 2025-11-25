'use client'
import { TextField, Button, Typography, Alert, IconButton, InputAdornment } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await import('../../../lib/api').then(m => m.default.post('/auth/login', form))
      if (res.data.ok) { login(res.data.accessToken) } else { setError(res.data.message) }
    } catch { setError('Login Failed') }
  }
  return (
    <div className="flex justify-center items-center min-h-[85vh] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-400/30 dark:bg-green-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/30 dark:bg-emerald-500/20 rounded-full blur-[100px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="glass p-10 rounded-3xl w-full max-w-md w-[400px] relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-green-400">
              <LogIn size={32} />
            </div>
            <Typography variant="h4" className="font-black">Welcome Back</Typography>
            <Typography className="opacity-60 text-sm">Enter Your Credentials To Continue</Typography>
          </div>
          {error && <Alert severity="error" className="mb-6 rounded-xl">{error}</Alert>}
          <form onSubmit={submit} className="flex flex-col gap-5">
            <TextField
              label="Email"
              variant="filled"
              fullWidth
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              slotProps={{ input: { disableUnderline: true, className: 'rounded-xl bg-white/50 dark:bg-black/20' } }}
            />
            <TextField
              label="Password"
              type={show ? 'text' : 'password'}
              variant="filled"
              fullWidth
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              slotProps={{
                input: {
                  disableUnderline: true,
                  className: 'rounded-xl bg-white/50 dark:bg-black/20',
                  endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShow(!show)}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</IconButton></InputAdornment>)
                }
              }}
            />
            <Button variant="contained" size="large" type="submit" className="py-3 rounded-xl text-lg shadow-lg shadow-violet-500/30 dark:shadow-green-500/30">Login Now</Button>
          </form>
          <div className="mt-8 text-center">
            <Typography variant="body2" className="opacity-70">New Here? <Link href="/auth/register" className="font-bold text-violet-600 dark:text-green-400 hover:underline">Create Account</Link></Typography>
          </div>
        </div>
      </motion.div>
    </div>
  )
}