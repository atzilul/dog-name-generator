import { useState } from 'react'
import './Step.css'

const breeds = [
  {
    id: 'small',
    emoji: '🐩',
    label: 'קטן',
    personality: 'קטן בגוף, ענק בלב',
    examples: "פודל, צ'יוואווה, יורקי",
  },
  {
    id: 'medium',
    emoji: '🐕',
    label: 'בינוני',
    personality: 'בדיוק כמו שצריך',
    examples: 'לברדור, ספניאל, בסנג\'י',
  },
  {
    id: 'large',
    emoji: '🦮',
    label: 'גדול',
    personality: 'גדול ורוצה חיבוקים',
    examples: 'רועה גרמני, דוברמן, הוסקי',
  },
  {
    id: 'puppy',
    emoji: '🐶',
    label: 'גור',
    personality: 'מלא חיים וקטן ומבולגן!',
    examples: 'עוד לא החליט מה יהיה 😄',
  },
]

export default function StepBreed({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const [bouncing, setBouncing] = useState(null)

  const handleSelect = (id) => {
    setBouncing(id)
    setSelected(id)
    setTimeout(() => onSelect(id), 420)
  }

  return (
    <div className="step">
      <div className="step-progress">
        <div className="progress-step active">1</div>
        <div className="progress-connector"></div>
        <div className="progress-step">2</div>
      </div>

      <div className="step-header">
        <h2 className="step-title">בואו נכיר אותו קצת! 👋</h2>
        <p className="step-subtitle">כי שם טוב מתאים לאישיות</p>
      </div>

      <div className="options-grid">
        {breeds.map(b => (
          <button
            key={b.id}
            className={`option-card ${selected === b.id ? 'selected' : ''} ${bouncing === b.id ? 'bounce-click' : ''}`}
            onClick={() => handleSelect(b.id)}
          >
            <span className="option-emoji">{b.emoji}</span>
            <span className="option-label">{b.label}</span>
            <span className="option-personality">{b.personality}</span>
            <span className="option-examples">{b.examples}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
