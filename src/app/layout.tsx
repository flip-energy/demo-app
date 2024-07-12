import Container from '@/components/container'
import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import LayoutState from './LayoutState'

const inter = Poppins({ weight: ['300', '400', '600'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Flip App',
  description: 'Save on your utility bills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`text-md ${inter.className}`}>
        <LayoutState>
          <Container>{children}</Container>
        </LayoutState>
      </body>
    </html>
  )
}
