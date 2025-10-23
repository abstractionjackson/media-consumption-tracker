'use client'

import { useState, useEffect } from 'react'
import { HAPPINESS_LEVELS, formatDate } from '../lib/happiness.js'
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

      {/* Happiness Entry Form */}
      <HappinessForm onEntryAdded={handleEntryAdded} />

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