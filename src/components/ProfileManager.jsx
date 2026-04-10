import { useState } from 'react'
import '../styles/ProfileManager.css'

export default function ProfileManager({ profiles, currentProfile, onSelectProfile, onAddProfile, onDeleteProfile, onBack }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [error, setError] = useState('')

  const handleAddProfile = (e) => {
    e.preventDefault()
    
    if (!newProfileName.trim()) {
      setError('Nome do perfil é obrigatório')
      return
    }

    if (profiles.some(p => p.name.toLowerCase() === newProfileName.toLowerCase())) {
      setError('Já existe um perfil com este nome')
      return
    }

    onAddProfile(newProfileName)
    setNewProfileName('')
    setShowAddForm(false)
    setError('')
  }

  return (
    <div className="profile-manager-container">
      <div className="profile-manager-header">
        <button className="back-btn" onClick={onBack}>← Voltar ao Dashboard</button>
        <h1>Gerenciar Perfis</h1>
      </div>

      <div className="profiles-grid">
        {profiles.map(profile => (
          <div 
            key={profile.id} 
            className={`profile-card ${currentProfile?.id === profile.id ? 'active' : ''}`}
          >
            <div className="profile-info">
              <div className="profile-avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h3>{profile.name}</h3>
              <p className="profile-type">Perfil de Paciente</p>
            </div>
            
            <div className="profile-actions">
              <button 
                className="select-btn"
                onClick={() => onSelectProfile(profile)}
              >
                {currentProfile?.id === profile.id ? '✓ Selecionado' : 'Selecionar'}
              </button>
              
              {profiles.length > 1 && (
                <button 
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm(`Deseja deletar o perfil "${profile.name}"?`)) {
                      onDeleteProfile(profile.id)
                    }
                  }}
                >
                  Deletar
                </button>
              )}
            </div>
          </div>
        ))}

        {!showAddForm && (
          <div className="profile-card add-profile-card" onClick={() => setShowAddForm(true)}>
            <div className="add-profile-content">
              <div className="plus-icon">+</div>
              <p>Adicionar Novo Perfil</p>
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="add-profile-form-container">
          <div className="add-profile-form">
            <h2>Criar Novo Perfil</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleAddProfile}>
              <div className="form-group">
                <label htmlFor="profileName">Nome do Perfil *</label>
                <input
                  id="profileName"
                  type="text"
                  placeholder="Ex: Sr. Antonio, Dona Cida"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Criar Perfil
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewProfileName('')
                    setError('')
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
