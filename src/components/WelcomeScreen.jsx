import { useState } from 'react'
import './WelcomeScreen.css'

export default function WelcomeScreen({ onStart }) {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(onStart, 380)
  }

  return (
    <div className="welcome">
      {/* Decorative paw prints */}
      <div className="paw-trail" aria-hidden="true">
        <span className="paw-print">⭐</span>
        <span className="paw-print">✨</span>
        <span className="paw-print">⭐</span>
        <span className="paw-print">✨</span>
        <span className="paw-print">⭐</span>
      </div>

      <div className="welcome-dog">🐕</div>

      <h1 className="welcome-title">
        יש כלב חדש בבית? מזל טוב!<br />
        <span className="welcome-title-sub">בוא נמצא לו שם חמוד, מגניב וכייפי</span>
      </h1>

      <div className="welcome-chips">
        <span>🐾 שמות מקומיים מגניבים</span>
        <span>✨ מותאם לכלב שלכם</span>
        <span>🎲 אינסוף אפשרויות</span>
      </div>

      <button
        className={`btn-start ${clicked ? 'clicked' : ''}`}
        onClick={handleClick}
      >
        בואו נתחיל! 🚀
      </button>

      <p className="welcome-hint">לוקח פחות מדקה ✓</p>
    </div>
  )
}
