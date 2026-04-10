import { useState } from 'react'
import { ArrowLeft, Droplet, Activity, Calendar, Clock, FileText } from 'lucide-react'

export default function History({ measurements, onBack }) {
  const [filter, setFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('desc')

  const filteredMeasurements = measurements.filter(m => {
    if (filter === 'all') return true
    return m.type === filter
  })

  const sortedMeasurements = [...filteredMeasurements].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgba(79, 70, 229, 0.05), rgba(255, 255, 255, 1), rgba(236, 72, 153, 0.05))', padding: '1rem' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
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

        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Histórico de Medições</h2>
              
              {/* Filtros */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">Todas as Medições</option>
                  <option value="glucose">Glicemia</option>
                  <option value="pressure">Pressão Arterial</option>
                </select>

                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="desc">Mais Recentes</option>
                  <option value="asc">Mais Antigas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div style={{ padding: '1.5rem' }}>
            {sortedMeasurements.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
                <FileText size={64} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
                <p style={{ fontSize: '1.125rem', color: '#9ca3af' }}>Nenhuma medição encontrada</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  Comece registrando suas medições no dashboard
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sortedMeasurements.map((measurement) => (
                  <div 
                    key={measurement.id} 
                    style={{
                      border: '1px solid #e5e7eb',
                      borderLeft: `4px solid ${measurement.type === 'glucose' ? '#3b82f6' : '#10b981'}`,
                      borderRadius: '0.375rem',
                      padding: '1rem',
                      background: '#f9fafb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      {/* Ícone e Informações */}
                      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          background: measurement.type === 'glucose' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                        }}>
                          {measurement.type === 'glucose' ? (
                            <Droplet size={20} style={{ color: '#3b82f6' }} />
                          ) : (
                            <Activity size={20} style={{ color: '#10b981' }} />
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                            {measurement.type === 'glucose' ? 'Glicemia' : 'Pressão Arterial'}
                          </h3>
                          <div style={{ marginTop: '0.5rem' }}>
                            {measurement.type === 'glucose' ? (
                              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                {measurement.value} mg/dL
                              </p>
                            ) : (
                              <>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                                  {measurement.systolic}/{measurement.diastolic} mmHg
                                </p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                  Pulso: {measurement.pulse} bpm
                                </p>
                              </>
                            )}
                            {measurement.notes && (
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic', marginTop: '0.5rem' }}>
                                "{measurement.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Data e Hora */}
                      <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#6b7280', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                          <Calendar size={14} />
                          <span>{formatDate(measurement.date)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                          <Clock size={14} />
                          <span>{formatTime(measurement.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
