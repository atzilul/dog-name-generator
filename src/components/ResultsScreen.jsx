import { useState, useEffect } from 'react'
import { getRandomNames } from '../data/names'
import ShareModal from './ShareModal'
import './ResultsScreen.css'

const genderLabels = { male: 'זכר 🐾', female: 'נקבה 🌸' }
const typeEmojis   = { small: '🐩', medium: '🐕', large: '🦮', puppy: '🐶' }
const CONFETTI     = ['🎊', '🎉', '⭐', '✨', '🎈', '🥳']

export default function ResultsScreen({ dogType, gender, onRestart }) {
  const [names, setNames]               = useState([])
  const [visible, setVisible]           = useState([])
  const [favorites, setFavorites]       = useState(new Set())
  const [isGenerating, setIsGenerating] = useState(false)
  const [round, setRound]               = useState(0)
  const [showShare, setShowShare]       = useState(false)

  const generateNames = () => {
    if (isGenerating) return
    setIsGenerating(true)
    setVisible([])
    setFavorites(new Set())

    setTimeout(() => {
      const newNames = getRandomNames(gender, dogType, 10)
      setNames(newNames)
      setIsGenerating(false)
      setRound(r => r + 1)
    }, 600)
  }

  // Generate on first mount
  useEffect(() => { generateNames() }, [])

  // Cascade animation after names load
  useEffect(() => {
    if (names.length === 0 || isGenerating) return
    names.forEach((_, i) => {
      setTimeout(() => setVisible(prev => [...prev, i]), i * 80)
    })
  }, [names, isGenerating])

  const toggleFavorite = (i) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const favoriteNames = [...favorites].map(i => names[i]).filter(Boolean)

  return (
    <div className="results">
      {/* Confetti row */}
      <div className="confetti-row" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <span key={i} className="confetti-item" style={{ '--delay': `${i * 0.12}s` }}>{c}</span>
        ))}
      </div>

      <div className="results-header">
        <h2 className="results-title">
          {gender === 'female' ? '🐾 השם של הכלבה שלכם' : '🐾 השם של הכלב שלכם'}
        </h2>
        <p className="results-subtitle">
          10 שמות מושלמים {genderLabels[gender]} {typeEmojis[dogType]}
        </p>
      </div>

      {isGenerating ? (
        <div className="generating-spinner">
          <span className="spinner-dog">🐕</span>
          <p>מחפש שמות חדשים...</p>
        </div>
      ) : (
        <div className="names-grid">
          {names.map((name, i) => (
            <div
              key={`${round}-${i}`}
              className={`name-card ${visible.includes(i) ? 'visible' : ''} ${favorites.has(i) ? 'is-fav' : ''}`}
              onClick={() => toggleFavorite(i)}
              title={favorites.has(i) ? 'הסר ממועדפים' : 'הוסף למועדפים'}
            >
              <span className="name-text">{name}</span>
              <span className={`fav-btn ${favorites.has(i) ? 'loved' : ''}`}>
                {favorites.has(i) ? '❤️' : '🤍'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="results-actions">
        {favoriteNames.length > 0 && (
          <button className="btn-share" onClick={() => setShowShare(true)}>
            🚀 שתפו את המועדפים שלכם!
            <span className="fav-count">{favoriteNames.length}</span>
          </button>
        )}

        <button className="btn-generate" onClick={generateNames} disabled={isGenerating}>
          🎲 חולל עוד שמות!
        </button>

        <button className="btn-restart" onClick={onRestart}>
          ← התחל מחדש
        </button>
      </div>

      {showShare && (
        <ShareModal
          favoriteNames={favoriteNames}
          gender={gender}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
