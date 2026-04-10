import { useState } from 'react'
import { Heart, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react'

export default function RegisterPage({ onRegister, onBackToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    // Verificar se o e-mail já está cadastrado
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.email === email)) {
      setError('Este e-mail já está cadastrado')
      return
    }

    // Criar novo usuário
    const newUser = {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    }

    onRegister(newUser)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <button
          onClick={onBackToLogin}
          style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Voltar ao Login
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>❤️</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea', margin: '0 0 10px 0' }}>Special Care</h1>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: '0' }}>Crie sua conta</p>
        </div>

        {error && (
          <div style={{ background: '#fadbd8', color: '#c0392b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle style={{ width: '16px', height: '16px' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Nome Completo</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f5f7fa', borderRadius: '6px', padding: '12px', border: '2px solid #ecf0f1' }}>
              <User style={{ width: '18px', height: '18px', color: '#667eea', marginRight: '10px' }} />
              <input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#2c3e50' }}
              />
            </div>
          </div>

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

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Senha</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f5f7fa', borderRadius: '6px', padding: '12px', border: '2px solid #ecf0f1' }}>
              <Lock style={{ width: '18px', height: '18px', color: '#667eea', marginRight: '10px' }} />
              <input
                type="password"
                placeholder="Sua senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#2c3e50' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Confirmar Senha</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f5f7fa', borderRadius: '6px', padding: '12px', border: '2px solid #ecf0f1' }}>
              <Lock style={{ width: '18px', height: '18px', color: '#667eea', marginRight: '10px' }} />
              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  )
}
