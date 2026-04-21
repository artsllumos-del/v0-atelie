'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router, supabase.auth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        toast.error('Email ou senha inválidos')
        setIsLoading(false)
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user!.id)
        .single()

      if (userData?.role === 'admin_principal' || userData?.role === 'admin' || userData?.role === 'colaborador') {
        router.push('/admin')
      } else {
        router.push('/loja')
      }

      toast.success('Bem-vindo!')
    } catch (error: any) {
      toast.error('Erro ao fazer login')
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error, data } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: email.trim(),
          role: 'cliente',
          is_active: true,
        })

        await supabase.from('customers').insert({
          user_id: data.user.id,
          full_name: email.split('@')[0],
          email: email.trim(),
        })
      }

      toast.success('Cadastro realizado! Verifique seu e-mail.')
      setActiveTab('login')
      setEmail('')
      setPassword('')
    } catch (error: any) {
      toast.error('Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center border-b">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-serif">Ateliê Sagrado</CardTitle>
          <CardDescription className="text-sm">
            {activeTab === 'login' ? 'Acesse sua conta' : 'Crie uma nova conta'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('login')
                setEmail('')
                setPassword('')
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab('signup')
                setEmail('')
                setPassword('')
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'signup'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={activeTab === 'login' ? handleLogin : handleSignup} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-10 bg-muted border-0 focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10 pr-10 bg-muted border-0 focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-10 font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Processando...
                </div>
              ) : activeTab === 'login' ? (
                'Entrar'
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            {activeTab === 'login'
              ? 'Sem conta? Clique em Cadastro para começar'
              : 'Já tem conta? Clique em Login'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
