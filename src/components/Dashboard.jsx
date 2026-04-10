import { Users, LogOut } from 'lucide-react'

export default function Dashboard({ user, profile, profiles, onNavigate, onLogout, onManageProfiles, measurements }) {
  const glucoseMeasurements = measurements.filter(m => m.type === 'glucose')
  const pressureMeasurements = measurements.filter(m => m.type === 'pressure')

  const lastGlucose = glucoseMeasurements[glucoseMeasurements.length - 1]
  const lastPressure = pressureMeasurements[pressureMeasurements.length - 1]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  // Paleta de cores
  const colors = {
    primary: '#64B5F6',      // Azul Sereno
    secondary: '#81C784',    // Verde Esperança
    accent1: '#F06292',      // Rosa Acolhedor
    accent2: '#FFD54F',      // Amarelo Suave
    neutral1: '#EEEEEE',     // Cinza Claro
    neutral2: '#424242',     // Cinza Escuro
    alert: '#EF5350'         // Vermelho Alerta
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)` }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: `2px solid ${colors.primary}`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>
              ❤️
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary, margin: '0' }}>Special Care</h1>
              <p style={{ fontSize: '14px', color: colors.neutral2, margin: '5px 0 0 0' }}>Olá, {user.name}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={onManageProfiles}
              style={{ padding: '10px 15px', background: colors.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s' }}
              onMouseEnter={(e) => e.target.style.background = colors.accent1}
              onMouseLeave={(e) => e.target.style.background = colors.primary}
            >
              <Users style={{ width: '16px', height: '16px' }} />
              Perfis ({profiles.length})
            </button>
            <button 
              onClick={onLogout}
              style={{ padding: '10px 15px', background: colors.neutral1, color: colors.neutral2, border: `1px solid ${colors.primary}`, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { e.target.style.background = colors.alert; e.target.style.color = 'white'; }}
              onMouseLeave={(e) => { e.target.style.background = colors.neutral1; e.target.style.color = colors.neutral2; }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Profile Indicator */}
      <div style={{ background: 'white', borderBottom: `1px solid ${colors.neutral1}`, padding: '15px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: colors.neutral2 }}>Perfil Ativo:</span>
          <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
            {profile?.name}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Últimas Medições */}
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.neutral2 }}>Últimas Medições</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Glicemia */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: `4px solid ${colors.primary}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ width: '40px', height: '40px', background: `${colors.primary}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, fontSize: '20px' }}>
                    💧
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.neutral2, margin: '0' }}>Glicemia</h3>
                </div>
                {lastGlucose ? (
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: colors.primary, marginBottom: '10px' }}>{lastGlucose.value} mg/dL</div>
                    <p style={{ fontSize: '13px', color: colors.neutral2, margin: '5px 0' }}>
                      {formatDate(lastGlucose.date)} às {formatTime(lastGlucose.date)}
                    </p>
                    {lastGlucose.notes && (
                      <p style={{ fontSize: '13px', color: colors.neutral2, fontStyle: 'italic', margin: '5px 0' }}>"{lastGlucose.notes}"</p>
                    )}
                  </div>
                ) : (
                  <p style={{ color: colors.neutral2, fontSize: '14px' }}>Nenhuma medição registrada</p>
                )}
              </div>

              {/* Pressão Arterial */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: `4px solid ${colors.secondary}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ width: '40px', height: '40px', background: `${colors.secondary}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.secondary, fontSize: '20px' }}>
                    ❤️
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.neutral2, margin: '0' }}>Pressão Arterial</h3>
                </div>
                {lastPressure ? (
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: colors.secondary, marginBottom: '10px' }}>
                      {lastPressure.systolic}/{lastPressure.diastolic}
                    </div>
                    <p style={{ fontSize: '13px', color: colors.neutral2, margin: '5px 0' }}>
                      Pulso: {lastPressure.pulse} bpm
                    </p>
                    <p style={{ fontSize: '13px', color: colors.neutral2, margin: '5px 0' }}>
                      {formatDate(lastPressure.date)} às {formatTime(lastPressure.date)}
                    </p>
                    {lastPressure.notes && (
                      <p style={{ fontSize: '13px', color: colors.neutral2, fontStyle: 'italic', margin: '5px 0' }}>"{lastPressure.notes}"</p>
                    )}
                  </div>
                ) : (
                  <p style={{ color: colors.neutral2, fontSize: '14px' }}>Nenhuma medição registrada</p>
                )}
              </div>
            </div>
          </section>

          {/* Ações Rápidas */}
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.neutral2 }}>Registrar Nova Medição</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <button
                onClick={() => onNavigate('add-glucose')}
                style={{ padding: '30px 20px', background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '24px' }}>💧</span>
                Registrar Glicemia
              </button>
              <button
                onClick={() => onNavigate('add-pressure')}
                style={{ padding: '30px 20px', background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent2} 100%)`, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '24px' }}>❤️</span>
                Registrar Pressão Arterial
              </button>
            </div>
          </section>

          {/* Menu de Navegação */}
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.neutral2 }}>Ferramentas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div 
                onClick={() => onNavigate('history')}
                style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s', borderLeft: `4px solid ${colors.primary}` }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: `${colors.primary}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    📋
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.neutral2, margin: '0' }}>Histórico</h3>
                </div>
                <p style={{ fontSize: '13px', color: colors.neutral2, margin: '0' }}>Ver todas as medições</p>
              </div>

              <div 
                onClick={() => onNavigate('charts')}
                style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s', borderLeft: `4px solid ${colors.secondary}` }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: `${colors.secondary}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    📊
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.neutral2, margin: '0' }}>Gráficos</h3>
                </div>
                <p style={{ fontSize: '13px', color: colors.neutral2, margin: '0' }}>Visualizar evolução</p>
              </div>

              <div 
                onClick={() => onNavigate('reminders')}
                style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s', borderLeft: `4px solid ${colors.accent2}` }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: `${colors.accent2}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    🔔
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.neutral2, margin: '0' }}>Lembretes</h3>
                </div>
                <p style={{ fontSize: '13px', color: colors.neutral2, margin: '0' }}>Configurar alertas</p>
              </div>

              <div 
                onClick={() => onNavigate('reports')}
                style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s', borderLeft: `4px solid ${colors.accent1}` }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: `${colors.accent1}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    📄
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.neutral2, margin: '0' }}>Relatórios</h3>
                </div>
                <p style={{ fontSize: '13px', color: colors.neutral2, margin: '0' }}>Gerar documentos</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
