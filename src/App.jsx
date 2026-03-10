import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import StepBreed from './components/StepBreed'
import StepGender from './components/StepGender'
import ThinkingScreen from './components/ThinkingScreen'
import ResultsScreen from './components/ResultsScreen'
import './App.css'

function App() {
  const [step, setStep] = useState('welcome')
  const [dogType, setDogType] = useState(null)
  const [gender, setGender] = useState(null)

  const handleStart = () => setStep('breed')
  const handleBreed = (type) => { setDogType(type); setStep('gender') }
  const handleGender = (g) => { setGender(g); setStep('thinking') }
  const handleThinkingDone = () => setStep('results')
  const handleRestart = () => { setStep('welcome'); setDogType(null); setGender(null) }

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        <p className="app-header-label">מחולל שמות הכלבים של:</p>
        <img src="/anipet.png" alt="אנפט" className="app-logo" />
      </header>

      <main className="app-content">
        {step === 'welcome'  && <WelcomeScreen onStart={handleStart} />}
        {step === 'breed'    && <StepBreed onSelect={handleBreed} />}
        {step === 'gender'   && <StepGender onSelect={handleGender} onBack={() => setStep('breed')} />}
        {step === 'thinking' && <ThinkingScreen onDone={handleThinkingDone} />}
        {step === 'results'  && <ResultsScreen dogType={dogType} gender={gender} onRestart={handleRestart} />}
      </main>
    </div>
  )
}

export default App
