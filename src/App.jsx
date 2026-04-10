import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Dashboard from './components/Dashboard'
import MeasurementForm from './components/MeasurementForm'
import History from './components/History'
import Charts from './components/Charts'
import Reminders from './components/Reminders'
import Reports from './components/Reports'
import ProfileManager from './components/ProfileManager'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentProfile, setCurrentProfile] = useState(null)
  const [userProfiles, setUserProfiles] = useState([])
  const [currentPage, setCurrentPage] = useState('login')
  const [measurements, setMeasurements] = useState([])
  const [reminders, setReminders] = useState([])

// Carregar dados do localStorage ao iniciar
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser({
        uid: user.uid,
        email: user.email
      });

      setCurrentPage("dashboard");
    } else {
      setCurrentUser(null);
      setCurrentPage("login");
    }
  });

  return () => unsubscribe();
}, []);

// Carregar medições e lembretes do localStorage
useEffect(() => {
  const savedMeasurements = localStorage.getItem('measurements')
  if (savedMeasurements) {
    setMeasurements(JSON.parse(savedMeasurements))
  }

  const savedReminders = localStorage.getItem('reminders')
  if (savedReminders) {
    setReminders(JSON.parse(savedReminders))
  }
}, []);

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    // Carregar ou criar perfis para este usuário
    const allProfiles = JSON.parse(localStorage.getItem('profiles') || '[]')
    const userProfs = allProfiles.filter(p => p.userId === user.email)
    
    if (userProfs.length === 0) {
      // Criar perfil padrão
      const defaultProfile = {
        id: Date.now(),
        userId: user.email,
        name: user.name || 'Meu Perfil',
        createdAt: new Date().toISOString()
      }
      const updatedProfiles = [...allProfiles, defaultProfile]
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles))
      setUserProfiles([defaultProfile])
      setCurrentProfile(defaultProfile)
    } else {
      setUserProfiles(userProfs)
      setCurrentProfile(userProfs[0])
    }
    
    setCurrentPage('dashboard')
  }

  const handleRegister = (user) => {
    // Salvar usuário no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Fazer login automaticamente
    handleLogin(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentProfile(null)
    setUserProfiles([])
    localStorage.removeItem('currentUser')
    setCurrentPage('login')
  }

  const handleAddProfile = (profileName) => {
    const newProfile = {
      id: Date.now(),
      userId: currentUser.email,
      name: profileName,
      createdAt: new Date().toISOString()
    }
    
    const allProfiles = JSON.parse(localStorage.getItem('profiles') || '[]')
    const updatedProfiles = [...allProfiles, newProfile]
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles))
    
    const updatedUserProfiles = [...userProfiles, newProfile]
    setUserProfiles(updatedUserProfiles)
    setCurrentProfile(newProfile)
  }

  const handleDeleteProfile = (profileId) => {
    const allProfiles = JSON.parse(localStorage.getItem('profiles') || '[]')
    const updatedProfiles = allProfiles.filter(p => p.id !== profileId)
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles))
    
    const updatedUserProfiles = userProfiles.filter(p => p.id !== profileId)
    setUserProfiles(updatedUserProfiles)
    
    // Se o perfil deletado era o atual, selecionar outro
    if (currentProfile?.id === profileId) {
      if (updatedUserProfiles.length > 0) {
        setCurrentProfile(updatedUserProfiles[0])
      } else {
        setCurrentProfile(null)
      }
    }
  }

  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile)
  }

  const addMeasurement = (measurement) => {
    const newMeasurement = {
      ...measurement,
      id: Date.now(),
      userId: currentUser.email,
      profileId: currentProfile.id,
      createdAt: new Date().toISOString()
    }
    setMeasurements([...measurements, newMeasurement])
  }

  const addReminder = (reminder) => {
    const newReminder = {
      ...reminder,
      id: Date.now(),
      userId: currentUser.email,
      profileId: currentProfile.id,
      active: true
    }
    setReminders([...reminders, newReminder])
  }

  const updateReminder = (id, updates) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  const getProfileMeasurements = () => {
    return measurements.filter(m => 
      m.userId === currentUser?.email && m.profileId === currentProfile?.id
    )
  }

  const getProfileReminders = () => {
    return reminders.filter(r => 
      r.userId === currentUser?.email && r.profileId === currentProfile?.id
    )
  }

  if (!currentUser) {
    if (currentPage === 'register') {
      return <RegisterPage onRegister={handleRegister} onBackToLogin={() => setCurrentPage('login')} />
    }
    return <LoginPage onLogin={handleLogin} onGoToRegister={() => setCurrentPage('register')} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={currentUser}
          profile={currentProfile}
          profiles={userProfiles}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          onManageProfiles={() => setCurrentPage('profiles')}
          measurements={getProfileMeasurements()}
        />
      )}
      {currentPage === 'profiles' && (
        <ProfileManager
          profiles={userProfiles}
          currentProfile={currentProfile}
          onSelectProfile={handleSelectProfile}
          onAddProfile={handleAddProfile}
          onDeleteProfile={handleDeleteProfile}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'add-glucose' && (
        <MeasurementForm 
          type="glucose"
          profile={currentProfile}
          onBack={() => setCurrentPage('dashboard')}
          onSave={addMeasurement}
        />
      )}
      {currentPage === 'add-pressure' && (
        <MeasurementForm 
          type="pressure"
          profile={currentProfile}
          onBack={() => setCurrentPage('dashboard')}
          onSave={addMeasurement}
        />
      )}
      {currentPage === 'history' && (
        <History 
          measurements={getProfileMeasurements()}
          profile={currentProfile}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'charts' && (
        <Charts 
          measurements={getProfileMeasurements()}
          profile={currentProfile}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'reminders' && (
        <Reminders 
          reminders={getProfileReminders()}
          profile={currentProfile}
          onBack={() => setCurrentPage('dashboard')}
          onAdd={addReminder}
          onUpdate={updateReminder}
          onDelete={deleteReminder}
        />
      )}
      {currentPage === 'reports' && (
        <Reports 
          measurements={getProfileMeasurements()}
          user={currentUser}
          profile={currentProfile}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  )
}

export default App
