/**
 * @fileoverview Form component for creating happiness entries
 */

'use client'

import { useState } from 'react'
import { createHappinessEntry, createMediaEntry } from '../schemas/index.js'
import { HAPPINESS_LEVELS, getTodayDate } from '../lib/happiness.js'
import { MEDIA_TYPES } from '../lib/media.js'

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
   * Adds a new media entry fieldset
   */
  const handleAddMediaEntry = () => {
    // New entries don't have id yet - will be generated on submit
    setMediaEntries([...mediaEntries, { type: 'book', duration: 30 }])
  }

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
   * Updates a media entry field
   * @param {number} index - Index of the media entry
   * @param {string} field - Field name (type or duration)
   * @param {*} value - New value
   */
  const handleMediaEntryChange = (index, field, value) => {
    const updated = [...mediaEntries]
    updated[index][field] = field === 'duration' ? parseInt(value) || 0 : value
    setMediaEntries(updated)
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
    
    // Only validate media entries if there are any
    const mediaResults = mediaEntries.length > 0 
      ? mediaEntries.map((media, index) => ({
          index,
          result: createMediaEntry(date, media.type, media.duration, media.id)
        }))
      : []
    
    const allErrors = []
    if (!happinessResult.success) {
      allErrors.push(...happinessResult.errors.map(e => `Happiness: ${e}`))
    }
    
    mediaResults.forEach(({ index, result }) => {
      if (!result.success) {
        allErrors.push(...result.errors.map(e => `Media ${index + 1}: ${e}`))
      }
    })
    
    if (allErrors.length === 0) {
      setSuccessMessage('Entry logged successfully! 🎉')
      
      // If editing an existing entry, use onEntryUpdated callback
      if (initialEntry && onEntryUpdated) {
        onEntryUpdated(initialEntry, happinessResult.data)
      } else if (onEntryAdded) {
        onEntryAdded(happinessResult.data)
      }
      
      // Add media entries
      if (onMediaEntriesAdded) {
        const validMediaEntries = mediaResults
          .filter(({ result }) => result.success)
          .map(({ result }) => result.data)
        onMediaEntriesAdded(validMediaEntries)
      }
      
      // Reset form only if not editing
      if (!initialEntry) {
        setDate(getTodayDate())
        setHappiness(0)
        setMediaEntries([])
      }
    } else {
      setErrors(allErrors)
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
            Happiness Level: {HAPPINESS_LEVELS[happiness.toString()]}
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
            <span>😢 Very Unhappy</span>
            <span>😐 Neutral</span>
            <span>😄 Very Happy</span>
          </div>
        </div>

        {/* Media Entries Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <label style={{ 
              fontWeight: 'bold', 
              color: '#333',
              fontSize: '1rem'
            }}>
              Media Consumed:
            </label>
            <button
              type="button"
              onClick={handleAddMediaEntry}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#218838'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#28a745'
              }}
            >
              + Add Media
            </button>
          </div>

          {mediaEntries.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#999',
              fontStyle: 'italic',
              backgroundColor: '#fafafa',
              border: '1px dashed #ddd',
              borderRadius: '6px'
            }}>
              No media entries for this date. Click "+ Add Media" to add one.
            </div>
          ) : (
            mediaEntries.map((media, index) => (
            <fieldset
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#fafafa'
              }}
            >
              <legend style={{ 
                fontWeight: 'bold', 
                color: '#555',
                fontSize: '0.9rem',
                padding: '0 0.5rem'
              }}>
                Media {index + 1}
              </legend>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr auto',
                gap: '1rem',
                alignItems: 'end'
              }}>
                <div>
                  <label 
                    htmlFor={`media-type-${index}`}
                    style={{ 
                      display: 'block', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontSize: '0.9rem'
                    }}
                  >
                    Type:
                  </label>
                  <select
                    id={`media-type-${index}`}
                    value={media.type}
                    onChange={(e) => handleMediaEntryChange(index, 'type', e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      width: '100%'
                    }}
                  >
                    {Object.entries(MEDIA_TYPES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label 
                    htmlFor={`media-duration-${index}`}
                    style={{ 
                      display: 'block', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontSize: '0.9rem'
                    }}
                  >
                    Duration (minutes):
                  </label>
                  <input
                    type="number"
                    id={`media-duration-${index}`}
                    min="1"
                    value={media.duration}
                    onChange={(e) => handleMediaEntryChange(index, 'duration', e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      width: '100%'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMediaEntry(index)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#c82333'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#dc3545'
                  }}
                  title="Remove this media entry"
                >
                  Remove
                </button>
              </div>
            </fieldset>
          ))
          )}
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