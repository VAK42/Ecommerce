'use client'
import { TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material'
import { registerUser } from '../../../lib/queries'
import { useMutation } from '@apollo/client/react'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
export default function Register() {
  const router = useRouter()
  const [register, { loading }] = useMutation(registerUser)
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register({ variables: { input: form } })
      router.push('/auth/login')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message || 'Registration Failed' : 'Registration Failed')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-[85vh] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-400/20 dark:bg-green-600/10 rounded-full blur-[120px]" />
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="glass p-10 rounded-3xl w-full max-w-md w-[450px] relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-pink-600 dark:text-emerald-400">
              <UserPlus size={32} />
            </div>
            <Typography variant="h4" className="font-black">Join Us</Typography>
            <Typography className="opacity-60 text-sm">Start Your Shopping Journey Today</Typography>
          </div>
          {error && <Alert severity="error" className="mb-6 rounded-xl">{error}</Alert>}
          <form onSubmit={submit} className="flex flex-col gap-5">
            <TextField
              label="Full Name"
              variant="filled"
              fullWidth
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              slotProps={{ input: { disableUnderline: true, className: 'rounded-xl bg-white/50 dark:bg-black/20' } }}
            />
            <TextField
              label="Email Address"
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow(!show)}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <Button variant="contained" size="large" type="submit" disabled={loading} className="py-3 rounded-xl text-lg shadow-lg shadow-pink-500/30 dark:shadow-emerald-500/30 bg-gradient-to-r from-pink-500 to-rose-500 dark:from-emerald-500 dark:to-green-600">Create Account</Button>
          </form>
          <div className="mt-8 text-center">
            <Typography variant="body2" className="opacity-70">Already A Member? <Link href="/auth/login" className="font-bold text-pink-600 dark:text-emerald-400 hover:underline">Login Here</Link></Typography>
          </div>
        </div>
      </motion.div>
    </div>
  )
}