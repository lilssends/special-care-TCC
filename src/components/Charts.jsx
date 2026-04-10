import { useState } from 'react'
import { ArrowLeft, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Charts({ measurements, profile, onBack }) {
  const [chartType, setChartType] = useState('all')
  const [period, setPeriod] = useState('30')

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

  const filterByPeriod = (measurements) => {
    const days = parseInt(period)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return measurements.filter(m => new Date(m.date) >= cutoffDate)
  }

  const glucoseMeasurements = filterByPeriod(measurements.filter(m => m.type === 'glucose'))
  const pressureMeasurements = filterByPeriod(measurements.filter(m => m.type === 'pressure'))

  const prepareGlucoseData = () => {
    return glucoseMeasurements
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(m => ({
        date: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: m.value,
        fullDate: new Date(m.date)
      }))
  }

  const preparePressureData = () => {
    return pressureMeasurements
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(m => ({
        date: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        systolic: m.systolic,
        diastolic: m.diastolic,
        pulse: m.pulse,
        fullDate: new Date(m.date)
      }))
  }

  const calculateTrend = (data, key) => {
    if (data.length < 2) return 'stable'
    const first = data[0][key]
    const last = data[data.length - 1][key]
    const diff = last - first
    if (Math.abs(diff) < (first * 0.05)) return 'stable'
    return diff > 0 ? 'up' : 'down'
  }

  const glucoseData = prepareGlucoseData()
  const pressureData = preparePressureData()
  
  const glucoseTrend = calculateTrend(glucoseData, 'value')
  const systolicTrend = calculateTrend(pressureData, 'systolic')

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={20} style={{ color: colors.alert }} />
    if (trend === 'down') return <TrendingDown size={20} style={{ color: colors.secondary }} />
    return <Minus size={20} style={{ color: colors.accent2 }} />
  }

  const getTrendText = (trend) => {
    if (trend === 'up') return 'Em alta'
    if (trend === 'down') return 'Em baixa'
    return 'Estável'
  }

  const exportChartsAsText = () => {
    let content = `RELATÓRIO DE GRÁFICOS - SPECIAL CARE\n`
    content += `Perfil: ${profile?.name}\n`
    content += `Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}\n`
    content += `Período: ${period} dias\n`
    content += `\n${'='.repeat(60)}\n\n`

    if (chartType === 'all' || chartType === 'glucose') {
      content += `GRÁFICO DE GLICEMIA\n`
      content += `Tendência: ${getTrendText(glucoseTrend)}\n`
      content += `Total de Medições: ${glucoseData.length}\n`
      if (glucoseData.length > 0) {
        const values = glucoseData.map(d => d.value)
        content += `Mínima: ${Math.min(...values)} mg/dL\n`
        content += `Máxima: ${Math.max(...values)} mg/dL\n`
        content += `Média: ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)} mg/dL\n`
      }
      content += `\n${'-'.repeat(60)}\n\n`
    }

    if (chartType === 'all' || chartType === 'pressure') {
      content += `GRÁFICO DE PRESSÃO ARTERIAL\n`
      content += `Tendência: ${getTrendText(systolicTrend)}\n`
      content += `Total de Medições: ${pressureData.length}\n`
      if (pressureData.length > 0) {
        const systolic = pressureData.map(d => d.systolic)
        const diastolic = pressureData.map(d => d.diastolic)
        content += `Sistólica - Mínima: ${Math.min(...systolic)}, Máxima: ${Math.max(...systolic)}, Média: ${(systolic.reduce((a, b) => a + b, 0) / systolic.length).toFixed(1)} mmHg\n`
        content += `Diastólica - Mínima: ${Math.min(...diastolic)}, Máxima: ${Math.max(...diastolic)}, Média: ${(diastolic.reduce((a, b) => a + b, 0) / diastolic.length).toFixed(1)} mmHg\n`
      }
      content += `\n${'-'.repeat(60)}\n\n`
    }

    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' })
    element.href = URL.createObjectURL(file)
    const timestamp = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
    element.download = `graficos_${timestamp}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`, padding: '1rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            marginBottom: '1.5rem',
            background: 'white',
            border: `1px solid ${colors.primary}`,
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: colors.neutral2,
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => { e.target.style.background = colors.primary; e.target.style.color = 'white'; }}
          onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = colors.neutral2; }}
        >
          <ArrowLeft size={16} />
          Voltar ao Dashboard
        </button>

        {/* Header Card */}
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem', borderTop: `4px solid ${colors.primary}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: colors.neutral2 }}>Gráficos de Evolução</h2>
              <p style={{ color: colors.neutral2, fontSize: '0.875rem', marginTop: '0.25rem' }}>Visualize o progresso das suas medições</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: `1px solid ${colors.primary}`,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: colors.neutral2
                }}
              >
                <option value="all">Todos</option>
                <option value="glucose">Glicemia</option>
                <option value="pressure">Pressão Arterial</option>
              </select>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: `1px solid ${colors.primary}`,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: colors.neutral2
                }}
              >
                <option value="7">7 dias</option>
                <option value="15">15 dias</option>
                <option value="30">30 dias</option>
                <option value="90">90 dias</option>
              </select>
              <button
                onClick={exportChartsAsText}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {(chartType === 'all' || chartType === 'glucose') && (
            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem', borderLeft: `4px solid ${colors.primary}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: colors.neutral2 }}>Glicemia</h3>
                  <p style={{ fontSize: '0.875rem', color: colors.neutral2, marginTop: '0.25rem' }}>Evolução de glicemia em mg/dL</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getTrendIcon(glucoseTrend)}
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.neutral2 }}>{getTrendText(glucoseTrend)}</span>
                </div>
              </div>
              {glucoseData.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: colors.neutral2 }}>
                  Nenhum dado de glicemia disponível para o período selecionado
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={glucoseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral1} />
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.neutral2}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke={colors.neutral2}
                      style={{ fontSize: '12px' }}
                      label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: `1px solid ${colors.neutral1}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={colors.primary} 
                      strokeWidth={3}
                      name="Glicemia"
                      dot={{ fill: colors.primary, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {(chartType === 'all' || chartType === 'pressure') && (
            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem', borderLeft: `4px solid ${colors.accent1}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: colors.neutral2 }}>Pressão Arterial</h3>
                  <p style={{ fontSize: '0.875rem', color: colors.neutral2, marginTop: '0.25rem' }}>Evolução de pressão arterial em mmHg</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getTrendIcon(systolicTrend)}
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.neutral2 }}>{getTrendText(systolicTrend)}</span>
                </div>
              </div>
              {pressureData.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: colors.neutral2 }}>
                  Nenhum dado de pressão arterial disponível para o período selecionado
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pressureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral1} />
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.neutral2}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke={colors.neutral2}
                      style={{ fontSize: '12px' }}
                      label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: `1px solid ${colors.neutral1}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke={colors.secondary} 
                      strokeWidth={3}
                      name="Sistólica"
                      dot={{ fill: colors.secondary, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke={colors.accent1} 
                      strokeWidth={3}
                      name="Diastólica"
                      dot={{ fill: colors.accent1, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
