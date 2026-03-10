import { useState } from 'react'
import './Step.css'

export default function StepGender({ onSelect, onBack }) {
  const [bouncing, setBouncing] = useState(null)

  const handleSelect = (g) => {
    setBouncing(g)
    setTimeout(() => onSelect(g), 420)
  }

  return (
    <div className="step">
      <div className="step-progress">
        <div className="progress-step done">✓</div>
        <div className="progress-connector filled"></div>
        <div className="progress-step active">2</div>
      </div>

      <div className="step-header">
        <h2 className="step-title">הוא... או היא? 🤫</h2>
        <p className="step-subtitle">שאלה אחת נוספת ואנחנו מתחילים בקסמים! ✨</p>
      </div>

      <div className="gender-grid">
        <button className={`gender-card male ${bouncing === 'male' ? 'bounce-click' : ''}`} onClick={() => handleSelect('male')}>
          <div className="gender-icon">🐾</div>
          <div className="gender-label">זכר</div>
          <div className="gender-desc">שמות אמיצים וחזקים</div>
        </button>
        <button className={`gender-card female ${bouncing === 'female' ? 'bounce-click' : ''}`} onClick={() => handleSelect('female')}>
          <div className="gender-icon">🌸</div>
          <div className="gender-label">נקבה</div>
          <div className="gender-desc">שמות חמודים ומלאי חן</div>
        </button>
      </div>

      <button className="btn-back" onClick={onBack}>
        ← חזרה לשלב הקודם
      </button>
    </div>
  )
}
