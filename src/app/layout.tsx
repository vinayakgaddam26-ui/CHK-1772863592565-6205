import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Smart City Carbon Dashboard',
  description: 'Real-time urban carbon emissions monitoring platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased h-screen w-screen bg-carbon-900 text-foreground flex overflow-hidden">
        
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full bg-carbon-900 overflow-y-auto">
          <Header />
          <div className="p-6 relative z-0">
            {children}
          </div>
        </div>

      </body>
    </html>
  )
}
