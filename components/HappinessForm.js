/**
 * @fileoverview Form component for creating happiness entries
 */

'use client'

import { useState } from 'react'
import { Check, Frown, Meh, Smile } from 'lucide-react'
import { createHappinessEntry } from '../schemas/index.js'
import { getTodayDate } from '../lib/happiness.js'

/**
 * Form component for logging happiness entries
 * @param {Object} props - Component props
 * @param {Function} props.onEntryAdded - Callback when entry is successfully added
 * @param {Object} props.initialEntry - Optional initial entry for editing
 * @param {Function} props.onEntryUpdated - Optional callback when entry is updated (passes old and new entry)
 * @param {Function} props.onMediaEntriesAdded - Optional callback when media entries are added
 * @param {Function} props.onMediaEntryDeleted - Optional callback when a media entry is deleted
 * @param {Array} props.allMediaEntries - All media entries to filter by date
 * @returns {JSX.Element} The happiness entry form
 */
export default function HappinessForm({ onEntryAdded, initialEntry, onEntryUpdated, onMediaEntriesAdded, onMediaEntryDeleted, allMediaEntries = [] }) {
  const [date, setDate] = useState(initialEntry?.date || getTodayDate())
  const [happiness, setHappiness] = useState(initialEntry?.happiness ?? 0)
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Get media entries for the current date
  const getMediaEntriesForDate = (selectedDate) => {
    const entriesForDate = allMediaEntries.filter(media => media.date === selectedDate)
    return entriesForDate.length > 0 ? entriesForDate : []
  }
  
  const [mediaEntries, setMediaEntries] = useState(getMediaEntriesForDate(initialEntry?.date || getTodayDate()))

  /**
   * Removes a media entry fieldset
   * @param {number} index - Index of the media entry to remove
   */
  const handleRemoveMediaEntry = (index) => {
    const mediaToRemove = mediaEntries[index]
    
    // Remove from local state
    const updatedEntries = mediaEntries.filter((_, i) => i !== index)
    setMediaEntries(updatedEntries)
    
    // If this is an existing media entry (has id), notify parent to delete
    if (onMediaEntryDeleted && mediaToRemove.id) {
      onMediaEntryDeleted(mediaToRemove)
    }
  }

  /**
   * Handles date change and updates media entries accordingly
   * @param {string} newDate - New date value
   */
  const handleDateChange = (newDate) => {
    setDate(newDate)
    // Update media entries to match the new date
    const entriesForDate = getMediaEntriesForDate(newDate)
    setMediaEntries(entriesForDate)
  }

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])
    setSuccessMessage('')

    // Create and validate the happiness entry
    const happinessResult = createHappinessEntry(date, parseInt(happiness))
    
    if (happinessResult.success) {
      setSuccessMessage(
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={20} />
          Entry logged successfully!
        </span>
      )
      
      // If editing an existing entry, use onEntryUpdated callback
      if (initialEntry && onEntryUpdated) {
        onEntryUpdated(initialEntry, happinessResult.data)
      } else if (onEntryAdded) {
        onEntryAdded(happinessResult.data)
      }
      
      // Reset form only if not editing
      if (!initialEntry) {
        setDate(getTodayDate())
        setHappiness(0)
      }
    } else {
      setErrors(happinessResult.errors)
    }
    
    setIsSubmitting(false)
  }

  /**
   * Handles happiness range input change
   * @param {Event} e - Input change event
   */
  const handleHappinessChange = (e) => {
    setHappiness(parseInt(e.target.value))
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
            onChange={(e) => handleDateChange(e.target.value)}
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="happiness" 
            style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}
          >
            Happiness Level: {happiness}
          </label>
          <input
            type="range"
            id="happiness"
            min="-2"
            max="2"
            step="1"
            value={happiness}
            onChange={handleHappinessChange}
            autoFocus
            style={{
              width: '100%',
              maxWidth: '300px',
              height: '40px',
              cursor: 'pointer'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '300px',
            fontSize: '0.9rem',
            color: '#666',
            marginTop: '0.5rem'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Frown size={16} /> Very Unhappy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Meh size={16} /> Neutral
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Smile size={16} /> Very Happy
            </span>
          </div>
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
          {isSubmitting ? 'Logging...' : 'Log Happiness Entry'}
        </button>
      </form>
    </div>
  )
}