'use client'

import { useState } from 'react'
import { SAMPLE_DATA, HAPPINESS_LEVELS, formatDate } from '../lib/happiness.js'
import HappinessForm from '../components/HappinessForm.js'

/**
 * Home page component showing happiness tracking
 * @returns {JSX.Element} The home page
 */
export default function Home() {
  const [entries, setEntries] = useState(SAMPLE_DATA)

  /**
   * Handles adding a new happiness entry
   * @param {Object} newEntry - The new happiness entry
   */
  const handleEntryAdded = (newEntry) => {
    setEntries(prevEntries => {
      // Remove any existing entry for the same date
      const filtered = prevEntries.filter(entry => entry.date !== newEntry.date)
      // Add the new entry and sort by date (newest first)
      return [newEntry, ...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }

  return (
    <main style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 1rem 0', 
          color: '#333' 
        }}>
          Happiness Vibe Tracker 🌟
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666' 
        }}>
          Track your daily happiness levels
        </p>
      </header>

      {/* Happiness Entry Form */}
      <HappinessForm onEntryAdded={handleEntryAdded} />

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Happiness Scale Reference
        </h2>
        <div style={{ 
          display: 'grid', 
          gap: '0.5rem',
          marginBottom: '2rem' 
        }}>
          {Object.entries(HAPPINESS_LEVELS).map(([level, description]) => (
            <div key={level} style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff'
            }}>
              <span style={{ fontWeight: 'bold' }}>Level {level}:</span>
              <span>{description}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Your Happiness Entries ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <p style={{ 
            color: '#666', 
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '2rem'
          }}>
            No entries yet. Add your first happiness entry above! 🎯
          </p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '1rem' 
          }}>
            {entries.map((entry, index) => (
              <div key={`${entry.date}-${index}`} style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {formatDate(entry.date)}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#666',
                    backgroundColor: '#f5f5f5',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    Level {entry.happiness}
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {HAPPINESS_LEVELS[entry.happiness.toString()]}
                </div>
                <details style={{ fontSize: '0.9rem', color: '#666' }}>
                  <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                    Show raw data
                  </summary>
                  <pre style={{
                    backgroundColor: '#f9f9f9',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(entry, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}