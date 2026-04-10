import { useState } from 'react'
import { ArrowLeft, Bell, Plus, Trash2, Clock, Droplet, Activity } from 'lucide-react'

export default function Reminders({ reminders, onBack, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'glucose',
    time: '08:00',
    frequency: 'daily',
    label: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.label.trim()) {
      alert('Por favor, preencha o rótulo do lembrete')
      return
    }
    onAdd(formData)
    setFormData({
      type: 'glucose',
      time: '08:00',
      frequency: 'daily',
      label: ''
    })
    setShowForm(false)
  }

  const getFrequencyText = (frequency) => {
    const map = {
      daily: 'Diariamente',
      weekdays: 'Dias úteis',
      weekends: 'Fins de semana',
      custom: 'Personalizado'
    }
    return map[frequency] || frequency
  }

  const getTypeLabel = (type) => {
    return type === 'glucose' ? 'Glicemia' : 'Pressão Arterial'
  }

  const getTypeIcon = (type) => {
    return type === 'glucose' ? <Droplet size={20} /> : <Activity size={20} />
  }

  const getTypeColor = (type) => {
    return type === 'glucose' ? '#3b82f6' : '#10b981'
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

        {/* Header Card */}
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Lembretes</h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Configure lembretes para suas medições</p>
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
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
              <Plus size={16} />
              Novo Lembrete
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Criar Novo Lembrete</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Tipo de Medição
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="glucose">Glicemia</option>
                    <option value="pressure">Pressão Arterial</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Rótulo do Lembrete
                  </label>
                  <input 
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="Ex: Medição matinal"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Horário
                  </label>
                  <input 
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Frequência
                  </label>
                  <select 
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="daily">Diariamente</option>
                    <option value="weekdays">Dias úteis</option>
                    <option value="weekends">Fins de semana</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit"
                    style={{
                      flex: 1,
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
                    Criar Lembrete
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      flex: 1,
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
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Lembretes */}
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
          {reminders.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
              <Bell size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
              <p style={{ fontSize: '1.125rem', color: '#9ca3af' }}>Nenhum lembrete configurado</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                Clique em "Novo Lembrete" para criar um
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderLeft: `4px solid ${getTypeColor(reminder.type)}`,
                    borderRadius: '0.375rem',
                    padding: '1rem',
                    background: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${getTypeColor(reminder.type)}20`,
                      flexShrink: 0
                    }}>
                      <div style={{ color: getTypeColor(reminder.type) }}>
                        {getTypeIcon(reminder.type)}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>
                        {reminder.label}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {getTypeLabel(reminder.type)} • {reminder.time} • {getFrequencyText(reminder.frequency)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(reminder.id)}
                    style={{
                      padding: '0.5rem',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informação */}
        <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '0.375rem', padding: '1rem', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
            <strong>Nota:</strong> Os lembretes são configurados localmente no seu navegador. Para receber notificações push, você precisará ativar as permissões de notificação do navegador.
          </p>
        </div>
      </div>
    </div>
  )
}
