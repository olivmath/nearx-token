import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (username) => {
    try {
      // Simular autenticação com Passkey
      if (!navigator.credentials) {
        throw new Error('WebAuthn não é suportado neste navegador')
      }
      
      // Simular criação/verificação de credencial
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: 'Blockchain Quiz' },
          user: {
            id: new TextEncoder().encode(username),
            name: username,
            displayName: username
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          timeout: 60000,
          attestation: 'direct'
        }
      })
      
      if (credential) {
        set({ 
          user: { username },
          isAuthenticated: true 
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return false
    }
  },
  
  register: async (username) => {
    // Para simplificar, usar a mesma lógica do login
    return get().login(username)
  },
  
  logout: () => {
    set({ 
      user: null,
      isAuthenticated: false 
    })
  }
}))

export default useAuthStore