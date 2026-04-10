import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useState } from 'react'
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (!email || !password) {
    setError('Por favor, preencha todos os campos')
    return
  }

  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    setError('E-mail ou senha incorretos')
  }
}

  const handleGoogleLogin = () => {
    // Simulação de login com Google
    const googleUser = {
      name: 'Usuário Google',
      email: 'usuario@gmail.com',
      loginMethod: 'google'
    }
    onLogin(googleUser)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>❤️</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea', margin: '0 0 10px 0' }}>Special Care</h1>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: '0' }}>Cuide da sua saúde com confiança</p>
        </div>

        {error && (
          <div style={{ background: '#fadbd8', color: '#c0392b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle style={{ width: '16px', height: '16px' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>E-mail</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f5f7fa', borderRadius: '6px', padding: '12px', border: '2px solid #ecf0f1' }}>
              <Mail style={{ width: '18px', height: '18px', color: '#667eea', marginRight: '10px' }} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#2c3e50' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Senha</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f5f7fa', borderRadius: '6px', padding: '12px', border: '2px solid #ecf0f1' }}>
              <Lock style={{ width: '18px', height: '18px', color: '#667eea', marginRight: '10px' }} />
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#2c3e50' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Entrar
          </button>
        </form>

        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ borderTop: '1px solid #ecf0f1' }}></div>
          <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 10px', color: '#7f8c8d', fontSize: '12px' }}>OU</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{ width: '100%', padding: '12px', background: '#f5f7fa', color: '#2c3e50', border: '2px solid #ecf0f1', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onMouseEnter={(e) => { e.target.style.background = '#ecf0f1'; e.target.style.borderColor = '#bdc3c7'; }}
          onMouseLeave={(e) => { e.target.style.background = '#f5f7fa'; e.target.style.borderColor = '#ecf0f1'; }}
        >
          <span style={{ fontSize: '18px' }}>🔐</span>
          Entrar com Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: '0' }}>
            Não tem uma conta?{' '}
            <button
              onClick={onGoToRegister}
              style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: '600', fontSize: '14px', textDecoration: 'underline' }}
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
