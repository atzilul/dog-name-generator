import { useState, useEffect } from 'react'
import './ThinkingScreen.css'

const stages = [
  { emoji: '📚', text: 'מכנס שמות מרחבי ישראל...' },
  { emoji: '🔍', text: 'בודק מה הכי מתאים לכלב שלכם...' },
  { emoji: '⚖️', text: 'שוקל בין המועמדים הטובים...' },
  { emoji: '🌟', text: 'כמעט מוכן! בוחרים את המנצחים...' },
]

const candidateNames = [
  'לונה?', 'מקס?', 'סימבה?', 'נאלה?', 'לואי?',
  'זאוס?', 'לולה?', 'ברק?', 'מוקה?', 'ריי?',
  'טופי?', 'בל?', 'לוקה?', 'זואי?', 'ראקי?',
]

export default function ThinkingScreen({ onDone }) {
  const [stage, setStage] = useState(0)
  const [nameIdx, setNameIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showStage, setShowStage] = useState(true)

  useEffect(() => {
    // Stage cycling with fade
    const stageTimer = setInterval(() => {
      setShowStage(false)
      setTimeout(() => {
        setStage(prev => (prev + 1) % stages.length)
        setShowStage(true)
      }, 200)
    }, 1000)

    // Name cycling fast — feels like it's "searching"
    const nameTimer = setInterval(() => {
      setNameIdx(prev => (prev + 1) % candidateNames.length)
    }, 280)

    // Progress bar
    const progressTimer = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100))
    }, 80)

    // Auto-advance to results
    const doneTimer = setTimeout(onDone, 4000)

    return () => {
      clearInterval(stageTimer)
      clearInterval(nameTimer)
      clearInterval(progressTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div className="thinking">
      {/* Thought bubble with cycling name */}
      <div className="thought-cloud">
        <span className="cloud-name" key={nameIdx}>{candidateNames[nameIdx]}</span>
      </div>
      <div className="thought-tail">⬤ ⬤ ⬤</div>

      {/* Bouncing dog */}
      <div className="thinking-dog">🐕</div>

      {/* Stage text */}
      <div className={`thinking-stage ${showStage ? 'visible' : 'hidden'}`}>
        <span className="stage-emoji">{stages[stage].emoji}</span>
        <span className="stage-text">{stages[stage].text}</span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
