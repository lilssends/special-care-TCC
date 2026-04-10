import { useState } from 'react'
import { ArrowLeft, Droplet, Activity, Save, AlertCircle } from 'lucide-react'

export default function MeasurementForm({ type, onBack, onSave }) {
  const isGlucose = type === 'glucose'
  
  //Inserindo Correção para a data e hora Incorreta

  const getLocalDateTime = () => {
  const agora = new Date()
  const offset = agora.getTimezoneOffset()

  return new Date(agora.getTime() - (offset * 60000))
    .toISOString()
    .slice(0, 16)
}

  const [formData, setFormData] = useState({
    value: '',
    systolic: '',
    diastolic: '',
    pulse: '',
    date: getLocalDateTime(),
    notes: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (isGlucose) {
      if (!formData.value || formData.value <= 0) {
        setError('Por favor, insira um valor válido de glicemia')
        return
      }
    } else {
      if (!formData.systolic || !formData.diastolic || !formData.pulse) {
        setError('Por favor, preencha todos os campos obrigatórios')
        return
      }
      if (formData.systolic <= 0 || formData.diastolic <= 0 || formData.pulse <= 0) {
        setError('Por favor, insira valores válidos')
        return
      }
    }

    const measurement = {
      type,
      ...(isGlucose 
        ? { value: parseFloat(formData.value) }
        : {
            systolic: parseInt(formData.systolic),
            diastolic: parseInt(formData.diastolic),
            pulse: parseInt(formData.pulse)
          }
      ),
      date: formData.date,
      notes: formData.notes,
      timestamp: new Date().toISOString()
    }

    onSave(measurement)
    setSuccess(true)
    
    setTimeout(() => {
      setFormData({
        value: '',
        systolic: '',
        diastolic: '',
        pulse: '',
        date: getLocalDateTime(),
        notes: ''
      })
      setSuccess(false)
    }, 2000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Voltar ao Dashboard
        </button>

        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isGlucose ? (
              <>
                <Droplet style={{ width: '24px', height: '24px', color: '#3498db' }} />
                Registrar Glicemia
              </>
            ) : (
              <>
                <Activity style={{ width: '24px', height: '24px', color: '#27ae60' }} />
                Registrar Pressão Arterial
              </>
            )}
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '20px' }}>Preencha os dados da sua medição</p>

          {error && (
            <div style={{ background: '#fadbd8', color: '#c0392b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle style={{ width: '16px', height: '16px' }} />
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#d5f4e6', color: '#27ae60', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
              ✓ Medição registrada com sucesso!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Data e Hora</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '2px solid #ecf0f1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {isGlucose ? (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Glicemia (mg/dL) *</label>
                <input
                  type="number"
                  name="value"
                  placeholder="Ex: 95"
                  value={formData.value}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  style={{ width: '100%', padding: '10px', border: '2px solid #ecf0f1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Pressão Sistólica (mmHg) *</label>
                  <input
                    type="number"
                    name="systolic"
                    placeholder="Ex: 120"
                    value={formData.systolic}
                    onChange={handleChange}
                    min="0"
                    style={{ width: '100%', padding: '10px', border: '2px solid #ecf0f1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Pressão Diastólica (mmHg) *</label>
                  <input
                    type="number"
                    name="diastolic"
                    placeholder="Ex: 80"
                    value={formData.diastolic}
                    onChange={handleChange}
                    min="0"
                    style={{ width: '100%', padding: '10px', border: '2px solid #ecf0f1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Frequência Cardíaca (bpm) *</label>
                  <input
                    type="number"
                    name="pulse"
                    placeholder="Ex: 72"
                    value={formData.pulse}
                    onChange={handleChange}
                    min="0"
                    style={{ width: '100%', padding: '10px', border: '2px solid #ecf0f1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Observações</label>
              <textarea
                name="notes"
                placeholder="Adicione observações sobre a medição..."
                value={formData.notes}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '2px solid #ecf0f1', borderRadius: '6px', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: isGlucose ? '#3498db' : '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              <Save style={{ width: '18px', height: '18px' }} />
              Salvar Medição
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
