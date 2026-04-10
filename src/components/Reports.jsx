import { useState } from 'react'
import { ArrowLeft, FileText, Download, Printer } from 'lucide-react'

export default function Reports({ measurements, user, onBack }) {
  const [reportType, setReportType] = useState('all')
  const [period, setPeriod] = useState('30')

  const filterByPeriod = (measurements) => {
    const days = parseInt(period)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return measurements.filter(m => new Date(m.date) >= cutoffDate)
  }

  const filteredMeasurements = filterByPeriod(measurements).filter(m => {
    if (reportType === 'all') return true
    return m.type === reportType
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  const calculateStats = () => {
    const glucose = filteredMeasurements.filter(m => m.type === 'glucose')
    const pressure = filteredMeasurements.filter(m => m.type === 'pressure')

    const stats = {
      glucose: {
        count: glucose.length,
        avg: glucose.length > 0 ? (glucose.reduce((sum, m) => sum + m.value, 0) / glucose.length).toFixed(1) : 0,
        min: glucose.length > 0 ? Math.min(...glucose.map(m => m.value)) : 0,
        max: glucose.length > 0 ? Math.max(...glucose.map(m => m.value)) : 0
      },
      pressure: {
        count: pressure.length,
        avgSystolic: pressure.length > 0 ? (pressure.reduce((sum, m) => sum + m.systolic, 0) / pressure.length).toFixed(0) : 0,
        avgDiastolic: pressure.length > 0 ? (pressure.reduce((sum, m) => sum + m.diastolic, 0) / pressure.length).toFixed(0) : 0,
        avgPulse: pressure.length > 0 ? (pressure.reduce((sum, m) => sum + m.pulse, 0) / pressure.length).toFixed(0) : 0
      }
    }

    return stats
  }

  const stats = calculateStats()

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const reportContent = generateReportContent()
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-special-care-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateReportContent = () => {
    let content = `RELATÓRIO DE MEDIÇÕES - SPECIAL CARE\n`
    content += `========================================\n\n`
    content += `Paciente: ${user.name}\n`
    content += `E-mail: ${user.email}\n`
    content += `Período: Últimos ${period} dias\n`
    content += `Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}\n\n`
    
    content += `ESTATÍSTICAS\n`
    content += `------------\n\n`
    
    if (reportType === 'all' || reportType === 'glucose') {
      content += `GLICEMIA:\n`
      content += `  Total de medições: ${stats.glucose.count}\n`
      if (stats.glucose.count > 0) {
        content += `  Média: ${stats.glucose.avg} mg/dL\n`
        content += `  Mínima: ${stats.glucose.min} mg/dL\n`
        content += `  Máxima: ${stats.glucose.max} mg/dL\n`
      }
      content += `\n`
    }
    
    if (reportType === 'all' || reportType === 'pressure') {
      content += `PRESSÃO ARTERIAL:\n`
      content += `  Total de medições: ${stats.pressure.count}\n`
      if (stats.pressure.count > 0) {
        content += `  Média: ${stats.pressure.avgSystolic}/${stats.pressure.avgDiastolic} mmHg\n`
        content += `  Pulso médio: ${stats.pressure.avgPulse} bpm\n`
      }
      content += `\n`
    }
    
    content += `MEDIÇÕES DETALHADAS\n`
    content += `-------------------\n\n`
    
    filteredMeasurements
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((m, index) => {
        content += `${index + 1}. ${m.type === 'glucose' ? 'GLICEMIA' : 'PRESSÃO ARTERIAL'}\n`
        content += `   Data/Hora: ${formatDateTime(m.date)}\n`
        if (m.type === 'glucose') {
          content += `   Valor: ${m.value} mg/dL\n`
        } else {
          content += `   Pressão: ${m.systolic}/${m.diastolic} mmHg\n`
          content += `   Pulso: ${m.pulse} bpm\n`
        }
        if (m.notes) {
          content += `   Observações: ${m.notes}\n`
        }
        content += `\n`
      })
    
    content += `\n========================================\n`
    content += `Relatório gerado pelo Special Care\n`
    content += `Este documento é apenas para fins informativos.\n`
    content += `Consulte sempre um profissional de saúde.\n`
    
    return content
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgba(79, 70, 229, 0.05), rgba(255, 255, 255, 1), rgba(236, 72, 153, 0.05))', padding: '1rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            marginBottom: '1.5rem',
            background: 'transparent',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#666'
          }}
        >
          <ArrowLeft size={16} />
          Voltar ao Dashboard
        </button>

        {/* Header Card */}
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Relatórios</h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Gere relatórios das suas medições</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Todas</option>
                <option value="glucose">Glicemia</option>
                <option value="pressure">Pressão Arterial</option>
              </select>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="7">7 dias</option>
                <option value="15">15 dias</option>
                <option value="30">30 dias</option>
                <option value="90">90 dias</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={handlePrint}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <Printer size={16} />
            Imprimir
          </button>
          <button 
            onClick={handleDownload}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'white',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <Download size={16} />
            Baixar TXT
          </button>
        </div>

        {/* Relatório */}
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
          {/* Cabeçalho */}
          <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Relatório de Medições</h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Special Care - Monitoramento de Saúde</p>
          </div>

          {/* Informações do Paciente */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Paciente</p>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>{user.name}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>E-mail</p>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Período</p>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>Últimos {period} dias</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Data do Relatório</p>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>{formatDate(new Date().toISOString())}</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Estatísticas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {(reportType === 'all' || reportType === 'glucose') && (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Glicemia</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Total de medições:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.glucose.count}</span>
                    </div>
                    {stats.glucose.count > 0 && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Média:</span>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.glucose.avg} mg/dL</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Mínima:</span>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.glucose.min} mg/dL</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Máxima:</span>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.glucose.max} mg/dL</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {(reportType === 'all' || reportType === 'pressure') && (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Pressão Arterial</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Total de medições:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.pressure.count}</span>
                    </div>
                    {stats.pressure.count > 0 && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Pressão média:</span>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.pressure.avgSystolic}/{stats.pressure.avgDiastolic} mmHg</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Pulso médio:</span>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.pressure.avgPulse} bpm</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medições Detalhadas */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Medições Detalhadas</h3>
            {filteredMeasurements.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', paddingTop: '2rem', paddingBottom: '2rem' }}>Nenhuma medição encontrada para o período selecionado</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredMeasurements
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((m, index) => (
                    <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '1rem', background: '#f9fafb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: '600', color: '#1f2937' }}>
                          {index + 1}. {m.type === 'glucose' ? 'GLICEMIA' : 'PRESSÃO ARTERIAL'}
                        </h4>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{formatDateTime(m.date)}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {m.type === 'glucose' ? (
                          <p style={{ color: '#1f2937' }}>
                            <span style={{ color: '#6b7280' }}>Valor:</span> <span style={{ fontWeight: '600' }}>{m.value} mg/dL</span>
                          </p>
                        ) : (
                          <>
                            <p style={{ color: '#1f2937' }}>
                              <span style={{ color: '#6b7280' }}>Pressão:</span> <span style={{ fontWeight: '600' }}>{m.systolic}/{m.diastolic} mmHg</span>
                            </p>
                            <p style={{ color: '#1f2937' }}>
                              <span style={{ color: '#6b7280' }}>Pulso:</span> <span style={{ fontWeight: '600' }}>{m.pulse} bpm</span>
                            </p>
                          </>
                        )}
                        {m.notes && (
                          <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                            Observações: {m.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Relatório gerado pelo Special Care</p>
            <p>Este documento é apenas para fins informativos.</p>
            <p>Consulte sempre um profissional de saúde.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
