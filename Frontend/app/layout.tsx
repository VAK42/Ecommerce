import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { ApolloWrapper } from '../lib/apolloWrapper'
import ChatWidget from '../components/ChatWidget'
import Navbar from '../components/Navbar'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = { title: 'E-Shop', description: 'Modern E-Commerce' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ApolloWrapper>
            <ThemeProvider>
              <AuthProvider>
                <CartProvider>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-10">
                      {children}
                    </main>
                    <ChatWidget />
                    <footer className="py-6 text-center text-gray-500 border-t dark:border-gray-800 mt-auto">
                      © 2025 E-Shop! All Rights Reserved!
                    </footer>
                  </div>
                </CartProvider>
              </AuthProvider>
            </ThemeProvider>
          </ApolloWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}