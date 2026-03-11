import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { ThemeProvider } from 'next-themes'

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased w-screen bg-carbon-900 text-foreground flex flex-col overflow-x-hidden transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header />
          </div>

          <div className="w-full h-screen relative z-0 flex-shrink-0 mt-20">
            <iframe src='https://my.spline.design/sunny-SAYQkkgeFemwYO5RvSZziUCh/' frameBorder='0' width='100%' height='100%' className="absolute inset-0"></iframe>
          </div>
          
          <div className="flex flex-col flex-1 w-full relative z-10 bg-transparent transition-colors duration-300">
            <main className="flex-1 p-6 relative z-0 bg-carbon-900">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
