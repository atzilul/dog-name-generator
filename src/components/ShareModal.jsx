import { useState, useEffect, useRef } from 'react'
import { generateShareImage, DOG_PRESETS } from '../utils/generateShareImage'
import './ShareModal.css'

// Label + colors shown in the picker for each preset
const PRESET_LABELS = ['זהוב', 'חום', 'שחור', 'בהיר']

export default function ShareModal({ favoriteNames, gender, onClose }) {
  const [imageUrl, setImageUrl]         = useState(null)
  const [imageBlob, setImageBlob]       = useState(null)
  const [generating, setGenerating]     = useState(true)
  const [toast, setToast]               = useState(null)
  const [canNativeShare, setCanNativeShare] = useState(false)

  // Dog picker state
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [photoSrc, setPhotoSrc]             = useState(null)  // objectURL of uploaded photo
  const photoObjectUrl                      = useRef(null)
  const fileInputRef                        = useRef(null)

  const mainObjectUrl = useRef(null)

  const dogOption = photoSrc
    ? { type: 'photo', src: photoSrc }
    : { type: 'preset', index: selectedPreset }

  // Regenerate image whenever dog selection changes
  useEffect(() => {
    setGenerating(true)
    generateShareImage({ favoriteNames, gender, dogOption })
      .then(({ blob, objectUrl }) => {
        if (mainObjectUrl.current) URL.revokeObjectURL(mainObjectUrl.current)
        mainObjectUrl.current = objectUrl
        setImageUrl(objectUrl)
        setImageBlob(blob)
        setGenerating(false)
        const file = new File([blob], 'dog-name.png', { type: 'image/png' })
        setCanNativeShare(!!(navigator.canShare && navigator.canShare({ files: [file] })))
      })
      .catch(() => setGenerating(false))
  }, [selectedPreset, photoSrc])

  useEffect(() => {
    return () => {
      if (mainObjectUrl.current) URL.revokeObjectURL(mainObjectUrl.current)
      if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    }
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    const url = URL.createObjectURL(file)
    photoObjectUrl.current = url
    setPhotoSrc(url)
  }

  const clearPhoto = () => {
    if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    photoObjectUrl.current = null
    setPhotoSrc(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const appUrl    = window.location.href
  const nameStr   = favoriteNames.join(', ')
  const shareText = favoriteNames.length === 1
    ? `🐕 קראנו לכלב שלנו ${favoriteNames[0]}! גם לכלב שלכם מגיע שם מושלם 👇\n${appUrl}`
    : `🐕 השמות שאהבנו לכלב שלנו: ${nameStr}! גם לכלב שלכם מגיע שם מושלם 👇\n${appUrl}`

  const downloadImage = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'שם-הכלב-שלי.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    showToast('✓ התמונה הורדה! שתפו אותה ברשתות החברתיות')
  }

  const handleNativeShare = async () => {
    if (!imageBlob) return
    const file = new File([imageBlob], 'dog-name.png', { type: 'image/png' })
    try {
      await navigator.share({ files: [file], text: shareText, title: 'שם הכלב שלנו!' })
    } catch (e) {
      if (e.name !== 'AbortError') showToast('השיתוף נכשל — נסו להוריד את התמונה')
    }
  }

  const handleWhatsApp  = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
  const handleFacebook  = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`, '_blank')
  const handleCopyLink  = async () => {
    try {
      await navigator.clipboard.writeText(appUrl)
      showToast('✓ הקישור הועתק!')
    } catch {
      showToast('לא ניתן להעתיק — נסו ידנית')
    }
  }

  return (
    <div className="share-overlay" onClick={onClose}>
      {toast && <div className="share-toast">{toast}</div>}

      <div className="share-modal" dir="rtl" onClick={e => e.stopPropagation()}>
        <button className="share-close-btn" onClick={onClose} aria-label="סגור">✕</button>

        <h2 className="share-title">שתפו את הבחירה שלכם! 🐾</h2>
        <p className="share-subtitle">
          {favoriteNames.length === 1
            ? `הכלב נקרא: "${favoriteNames[0]}"`
            : `${favoriteNames.length} שמות מועדפים: ${nameStr}`}
        </p>

        {/* ── Dog picker ── */}
        <div className="dog-picker">
          <p className="dog-picker-label">בחרו תמונת כלב לתמונה:</p>
          <div className="dog-picker-row">
            {DOG_PRESETS.map((p, i) => (
              <button
                key={i}
                className={`dog-preset-btn ${!photoSrc && selectedPreset === i ? 'active' : ''}`}
                style={{ '--fur': p.head, '--ear': p.ear }}
                onClick={() => { setSelectedPreset(i); clearPhoto() }}
                title={PRESET_LABELS[i]}
              >
                <span className="dog-preset-icon">🐶</span>
                <span className="dog-preset-name">{PRESET_LABELS[i]}</span>
              </button>
            ))}

            {/* Upload button */}
            <button
              className={`dog-preset-btn dog-upload-btn ${photoSrc ? 'active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              title="העלו תמונה של הכלב שלכם"
            >
              <span className="dog-preset-icon">{photoSrc ? '✅' : '📷'}</span>
              <span className="dog-preset-name">{photoSrc ? 'הועלה' : 'תמונה שלי'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </div>
          {photoSrc && (
            <button className="dog-clear-photo" onClick={clearPhoto}>✕ הסר תמונה</button>
          )}
        </div>

        {/* ── Image preview ── */}
        <div className="share-preview-wrap">
          {generating ? (
            <div className="share-generating">
              <span className="gen-emoji">🎨</span>
              <p>מכין תמונה מיוחדת...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="תמונה לשיתוף" className="share-preview" />
          ) : (
            <div className="share-generating">
              <span>😕</span>
              <p>לא ניתן ליצור תמונה</p>
            </div>
          )}
        </div>

        {/* ── Primary action ── */}
        {canNativeShare ? (
          <button className="btn-share-primary" onClick={handleNativeShare} disabled={generating || !imageBlob}>
            📱 שתפו עכשיו (וואצאפ, אינסטגרם ועוד)
          </button>
        ) : (
          <button className="btn-share-primary" onClick={downloadImage} disabled={generating || !imageUrl}>
            ⬇️ הורד תמונה לשיתוף
          </button>
        )}

        {/* ── Desktop text-link fallbacks ── */}
        {!canNativeShare && (
          <div className="share-platforms">
            <button className="platform-btn whatsapp" onClick={handleWhatsApp} disabled={generating}>
              <span className="platform-icon">💬</span>
              <span className="platform-label">WhatsApp</span>
            </button>
            <button className="platform-btn facebook" onClick={handleFacebook} disabled={generating}>
              <span className="platform-icon">📘</span>
              <span className="platform-label">Facebook</span>
            </button>
            <button className="platform-btn instagram" onClick={downloadImage} disabled={generating || !imageUrl}>
              <span className="platform-icon">📸</span>
              <span className="platform-label">Instagram</span>
            </button>
            <button className="platform-btn copy" onClick={handleCopyLink}>
              <span className="platform-icon">🔗</span>
              <span className="platform-label">קישור</span>
            </button>
          </div>
        )}

        <p className="share-hint">
          {canNativeShare
            ? 'בחרו את האפליקציה לשיתוף מהתפריט שייפתח'
            : 'הורידו את התמונה ושתפו אותה ישירות באינסטגרם, וואצאפ ועוד'}
        </p>
      </div>
    </div>
  )
}
