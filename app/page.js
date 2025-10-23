'use client'

import { useState, useEffect, useMemo } from 'react'
import { HAPPINESS_LEVELS, formatDate, getTodayDate } from '../lib/happiness.js'
import HappinessForm from '../components/HappinessForm.js'
import HappinessTable from '../components/HappinessTable.js'

const STORAGE_KEY = 'happiness-vibe-entries'

/**
 * Home page component showing happiness tracking
 * @returns {JSX.Element} The home page
 */
export default function Home() {
  const [entries, setEntries] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)

  // Find today's entry
  const todayEntry = useMemo(() => {
    const today = getTodayDate()
    return entries.find(entry => entry.date === today)
  }, [entries])

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(STORAGE_KEY)
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries))
      }
    } catch (error) {
      console.error('Failed to load entries from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
      } catch (error) {
        console.error('Failed to save entries to localStorage:', error)
      }
    }
  }, [entries, isLoaded])

  // Handle modal keyboard events and body scroll lock
  useEffect(() => {
    if (showFormModal) {
      document.body.style.overflow = 'hidden'
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleCloseForm()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showFormModal])

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

  /**
   * Handles deleting selected entries
   * @param {Array} entriesToDelete - Array of entries to delete
   */
  const handleDeleteEntries = (entriesToDelete) => {
    setEntries(prevEntries => {
      const deleteSet = new Set(entriesToDelete.map(entry => `${entry.date}-${entry.happiness}`))
      return prevEntries.filter(entry => !deleteSet.has(`${entry.date}-${entry.happiness}`))
    })
  }

  /**
   * Handles updating an existing entry
   * @param {Object} oldEntry - The original entry
   * @param {Object} newEntry - The updated entry
   */
  const handleUpdateEntry = (oldEntry, newEntry) => {
    setEntries(prevEntries => {
      return prevEntries.map(entry => {
        if (entry.date === oldEntry.date && entry.happiness === oldEntry.happiness) {
          return newEntry
        }
        return entry
      })
    })
  }

  /**
   * Handles editing today's entry
   */
  const handleEditToday = () => {
    setShowFormModal(true)
  }

  /**
   * Handles deleting today's entry
   */
  const handleDeleteToday = () => {
    if (todayEntry) {
      handleDeleteEntries([todayEntry])
    }
  }

  /**
   * Handles opening the form modal
   */
  const handleOpenForm = () => {
    setShowFormModal(true)
  }

  /**
   * Handles closing the form modal
   */
  const handleCloseForm = () => {
    setShowFormModal(false)
  }

  return (
    <main style={{ 
      padding: '2rem', 
      maxWidth: '1000px', 
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

      {/* Form Modal */}
      {showFormModal && (
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
          onClick={handleCloseForm}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
                {todayEntry ? 'Edit Your Happiness' : 'Log Your Happiness'} 📝
              </h2>
              <button
                onClick={handleCloseForm}
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
            <div style={{ padding: '1.5rem' }}>
              <HappinessForm onEntryAdded={(entry) => {
                handleEntryAdded(entry)
                setShowFormModal(false)
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Log Happiness Button or Today's Entry Card */}
      {!todayEntry ? (
        <div style={{
          padding: '2rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '1.5rem'
          }}>
            You haven't logged your happiness for today yet.
          </p>
          <button
            onClick={handleOpenForm}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#005a87'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#007cba'
            }}
          >
            Log Your Happiness 📝
          </button>
        </div>
      ) : (
        <div style={{
          padding: '1.5rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Today's Happiness Entry ✨
          </h2>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#666',
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}>
                Date
              </div>
              <div style={{ fontSize: '1rem', color: '#333' }}>
                {formatDate(todayEntry.date)}
              </div>
            </div>

            <div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#666',
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}>
                Happiness Level
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}>
                <span style={{
                  display: 'inline-block',
                  minWidth: '30px',
                  textAlign: 'center',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: todayEntry.happiness >= 0 ? '#e8f5e8' : '#ffeaea',
                  color: todayEntry.happiness >= 0 ? '#2d5a2d' : '#8b2635',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}>
                  {todayEntry.happiness}
                </span>
                <span style={{ fontSize: '1.1rem', color: '#333' }}>
                  {HAPPINESS_LEVELS[todayEntry.happiness.toString()]}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleEditToday}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007cba',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
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
              Edit Entry
            </button>
            <button
              onClick={handleDeleteToday}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
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
            >
              Delete Entry
            </button>
          </div>
        </div>
      )}

      <section>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Your Happiness Entries
        </h2>
        <HappinessTable 
          data={entries} 
          onDeleteEntries={handleDeleteEntries}
          onUpdateEntry={handleUpdateEntry}
        />
      </section>
    </main>
  )
}