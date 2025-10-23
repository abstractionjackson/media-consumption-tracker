/**
 * @fileoverview Detail view component for happiness entries
 */

'use client'

import { HAPPINESS_LEVELS, formatDate } from '../lib/happiness.js'
import { MEDIA_TYPES, formatDuration } from '../lib/media.js'

/**
 * Detail view component for displaying happiness entry details
 * @param {Object} props - Component props
 * @param {Object} props.entry - The happiness entry to display
 * @param {Array} props.mediaEntries - Media entries for this date
 * @param {Function} props.onClose - Callback when modal is closed
 * @returns {JSX.Element} The detail view
 */
export default function HappinessDetailView({ entry, mediaEntries = [], onClose }) {
  if (!entry) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
            Happiness Entry Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f0f0f0'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* Date Section */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Date
            </label>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {formatDate(entry.date)}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#999',
              marginTop: '0.25rem'
            }}>
              {entry.date}
            </div>
          </div>

          {/* Happiness Level Section */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Happiness Level
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: entry.happiness >= 0 ? '#e8f5e8' : '#ffeaea',
              borderRadius: '8px',
              border: `2px solid ${entry.happiness >= 0 ? '#c3e6c3' : '#ffcaca'}`
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: entry.happiness >= 0 ? '#2d5a2d' : '#8b2635',
                minWidth: '60px',
                textAlign: 'center',
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '8px'
              }}>
                {entry.happiness}
              </div>
              <div style={{
                fontSize: '1.25rem',
                color: entry.happiness >= 0 ? '#2d5a2d' : '#8b2635',
                fontWeight: '500'
              }}>
                {HAPPINESS_LEVELS[entry.happiness.toString()]}
              </div>
            </div>
          </div>

          {/* Media Consumed Section */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.75rem'
            }}>
              Media Consumed
            </label>
            
            {mediaEntries.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#999',
                fontStyle: 'italic',
                backgroundColor: '#fafafa',
                border: '1px dashed #ddd',
                borderRadius: '8px'
              }}>
                No media entries for this date
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mediaEntries.map((media, index) => (
                  <div
                    key={media.id || index}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}>
                        {MEDIA_TYPES[media.type]}
                      </span>
                      <div>
                        <div style={{
                          fontSize: '1rem',
                          color: '#333',
                          fontWeight: '500',
                          marginBottom: '0.25rem'
                        }}>
                          {media.title}
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#666'
                        }}>
                          {formatDuration(media.duration)}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#999'
                    }}>
                      {media.duration} min
                    </div>
                  </div>
                ))}
                
                {/* Total Duration */}
                {mediaEntries.length > 1 && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px',
                    border: '2px solid #1976d2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: '#1976d2',
                      fontSize: '1rem'
                    }}>
                      Total Duration
                    </span>
                    <span style={{
                      fontWeight: 'bold',
                      color: '#1976d2',
                      fontSize: '1.1rem'
                    }}>
                      {formatDuration(mediaEntries.reduce((sum, m) => sum + m.duration, 0))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#005a87'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#007cba'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
