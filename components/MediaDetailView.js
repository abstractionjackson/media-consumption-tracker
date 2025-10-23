/**
 * @fileoverview Detail view component for media entries on a specific date
 */

'use client'

import { formatDate } from '../lib/media.js'
import { MEDIA_TYPES, formatDuration } from '../lib/media.js'

/**
 * Detail view for media entries on a specific date
 * @param {Object} props - Component props
 * @param {string} props.date - Date string in YYYY-MM-DD format
 * @param {Array} props.mediaEntries - Array of media entries for this date
 * @returns {JSX.Element} The detail view
 */
export default function MediaDetailView({ date, mediaEntries }) {
  if (!date || !mediaEntries || mediaEntries.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        No media entries found for this date.
      </div>
    )
  }

  const totalDuration = mediaEntries.reduce((sum, entry) => sum + entry.duration, 0)

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header Section */}
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <h3 style={{
          margin: 0,
          marginBottom: '0.5rem',
          color: '#333',
          fontSize: '1.5rem'
        }}>
          Media Entries
        </h3>
        <div style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '1rem'
        }}>
          {formatDate(date)}
        </div>
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          <span style={{
            fontSize: '0.9rem',
            color: '#666',
            marginRight: '0.5rem'
          }}>
            Total Duration:
          </span>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {formatDuration(totalDuration)}
          </span>
          <span style={{
            fontSize: '0.9rem',
            color: '#666',
            marginLeft: '0.5rem'
          }}>
            ({totalDuration} min)
          </span>
        </div>
      </div>

      {/* Media Entries List */}
      <div>
        <h4 style={{
          margin: 0,
          marginBottom: '1rem',
          color: '#666',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Entries ({mediaEntries.length})
        </h4>
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
        </div>
      </div>
    </div>
  )
}
