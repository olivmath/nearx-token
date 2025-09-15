import React, { useState } from 'react'
import useAuthStore from '../store/authStore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const Auth = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuthStore()

  const handleAuth = async (type) => {
    if (!username.trim()) {
      setError('Por favor, insira um nome de usuário')
      return
    }

    setLoading(true)
    setError('')

    try {
      const success = type === 'login' ? await login(username) : await register(username)
      if (!success) {
        setError('Falha na autenticação. Tente novamente.')
      }
    } catch (err) {
      setError('Erro durante a autenticação: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-accent p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Blockchain Quiz</CardTitle>
          <CardDescription>Teste seus conhecimentos sobre blockchain</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username-login" className="text-sm font-medium">Nome de usuário</label>
                <Input
                  id="username-login"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu nome de usuário"
                  disabled={loading}
                />
              </div>
              {error && <div className="text-sm text-destructive">{error}</div>}
              <Button 
                onClick={() => handleAuth('login')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processando...' : 'Entrar com Passkey'}
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username-register" className="text-sm font-medium">Nome de usuário</label>
                <Input
                  id="username-register"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu nome de usuário"
                  disabled={loading}
                />
              </div>
              {error && <div className="text-sm text-destructive">{error}</div>}
              <Button 
                onClick={() => handleAuth('register')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processando...' : 'Registrar com Passkey'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-xs text-muted-foreground">Powered by WebAuthn (Passkey)</p>
          <a 
            href="https://stellar.expert" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Explore Stellar Network
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Auth