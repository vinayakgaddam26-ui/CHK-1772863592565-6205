import { signIn, signOut, auth } from "@/auth"
import { User } from 'lucide-react'
import Link from 'next/link'

export async function AuthButton() {
  const session = await auth()
  
  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit" title={`Sign Out (${session.user.name})`} className="w-10 h-10 rounded-full bg-carbon-primary/20 flex items-center justify-center border border-carbon-primary/50 hover:shadow-[0_0_15px_rgba(123,63,228,0.5)] transition text-white">
          <User className="w-5 h-5 text-carbon-primary" />
        </button>
      </form>
    )
  }

  return (
    <Link 
      href="/login"
      title="Sign In" 
      className="text-sm px-4 py-2 rounded-full bg-carbon-primary/10 flex items-center justify-center border border-carbon-primary/30 hover:shadow-[0_0_15px_rgba(123,63,228,0.5)] hover:border-carbon-primary transition text-white font-medium"
    >
      Sign In
    </Link>
  )
}
