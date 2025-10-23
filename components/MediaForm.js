/**
 * @fileoverview Form component for creating media entries
 */

'use client'

import { useState } from 'react'
import { createMediaEntry } from '../schemas/index.js'
import { MEDIA_TYPES, getTodayDate } from '../lib/media.js'

/**
 * Form component for logging media entries
 * @param {Object} props - Component props
 * @param {Function} props.onEntryAdded - Callback when entry is successfully added
 * @param {Object} props.initialEntry - Optional initial entry for editing
 * @param {Function} props.onEntryUpdated - Optional callback when entry is updated
 * @returns {JSX.Element} The media entry form
 */
export default function MediaForm({ onEntryAdded, initialEntry, onEntryUpdated }) {
  const [date, setDate] = useState(initialEntry?.date || getTodayDate())
  const [type, setType] = useState(initialEntry?.type || 'book')
  const [duration, setDuration] = useState(initialEntry?.duration || 30)
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])
    setSuccessMessage('')

    // Create and validate the entry
    const result = createMediaEntry(date, type, parseInt(duration), initialEntry?.id)
    
    if (result.success) {
      setSuccessMessage('Media entry logged successfully! 🎉')
      
      // If editing an existing entry, use onEntryUpdated callback
      if (initialEntry && onEntryUpdated) {
        onEntryUpdated(initialEntry, result.data)
      } else if (onEntryAdded) {
        onEntryAdded(result.data)
      }
      
      // Reset form only if not editing
      if (!initialEntry) {
        setDate(getTodayDate())
        setType('book')
        setDuration(30)
      }
    } else {
      setErrors(result.errors)
    }
    
    setIsSubmitting(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="date" 
            style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}
          >
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '200px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="type" 
            style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}
          >
            Media Type:
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            autoFocus
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '300px',
              cursor: 'pointer'
            }}
          >
            {Object.entries(MEDIA_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="duration" 
            style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}
          >
            Duration (minutes):
          </label>
          <input
            type="number"
            id="duration"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '200px'
            }}
            required
          />
        </div>

        {/* Error messages */}
        {errors.length > 0 && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <strong style={{ color: '#c33' }}>Validation Errors:</strong>
            <ul style={{ margin: '0.5rem 0 0 0', color: '#c33' }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '4px',
            marginBottom: '1rem',
            color: '#3c3'
          }}>
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isSubmitting ? '#ccc' : '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#005a87'
            }
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#007cba'
            }
          }}
        >
          {isSubmitting ? 'Logging...' : 'Log Media Entry'}
        </button>
      </form>
    </div>
  )
}
