import { signIn, signOut, auth } from "@/auth"
import { User } from 'lucide-react'

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
        <button type="submit" title={`Sign Out (${session.user.name})`} className="w-10 h-10 rounded-full bg-carbon-primary/20 flex items-center justify-center border border-carbon-primary/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition">
          <User className="w-5 h-5 text-carbon-primary" />
        </button>
      </form>
    )
  }

  return (
    <form
      action={async () => {
        "use server"
        await signIn()
      }}
    >
      <button type="submit" title="Sign In" className="text-sm px-4 py-2 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition text-white">
        Sign In
      </button>
    </form>
  )
}
