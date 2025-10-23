'use client'

import { useState, useEffect, useMemo } from 'react'
import { Smile, Film, Edit3 } from 'lucide-react'
import { HAPPINESS_LEVELS, formatDate, getTodayDate } from '../lib/happiness.js'
import HappinessForm from '../components/HappinessForm.js'
import HappinessTable from '../components/HappinessTable.js'
import MediaForm from '../components/MediaForm.js'
import MediaTable from '../components/MediaTable.js'
import HappinessDetailView from '../components/HappinessDetailView.js'

const STORAGE_KEY = 'happiness-vibe-entries'
const MEDIA_STORAGE_KEY = 'happiness-vibe-media-entries'

/**
 * Home page component showing happiness tracking
 * @returns {JSX.Element} The home page
 */
export default function Home() {
  const [entries, setEntries] = useState([])
  const [mediaEntries, setMediaEntries] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [showMediaFormModal, setShowMediaFormModal] = useState(false)
  const [editingMediaEntry, setEditingMediaEntry] = useState(null)
  const [activeTab, setActiveTab] = useState('happiness')
  const [showDetailView, setShowDetailView] = useState(false)
  const [detailEntry, setDetailEntry] = useState(null)

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
      
      const storedMediaEntries = localStorage.getItem(MEDIA_STORAGE_KEY)
      if (storedMediaEntries) {
        setMediaEntries(JSON.parse(storedMediaEntries))
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
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaEntries))
      } catch (error) {
        console.error('Failed to save entries to localStorage:', error)
      }
    }
  }, [entries, mediaEntries, isLoaded])

  // Handle modal keyboard events and body scroll lock
  useEffect(() => {
    if (showFormModal || showMediaFormModal) {
      document.body.style.overflow = 'hidden'
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          if (showFormModal) {
            handleCloseForm()
          } else if (showMediaFormModal) {
            handleCloseMediaForm()
          }
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showFormModal, showMediaFormModal])

  /**
   * Handles adding media entries
   * @param {Array} newMediaEntries - Array of new media entries
   */
  const handleMediaEntriesAdded = (newMediaEntries) => {
    setMediaEntries(prevMedia => {
      // Add new entries and sort by date (newest first)
      return [...newMediaEntries, ...prevMedia].sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }

  /**
   * Handles deleting a media entry
   * @param {Object} mediaEntry - The media entry to delete
   */
  const handleMediaEntryDeleted = (mediaEntry) => {
    setMediaEntries(prevMedia => {
      return prevMedia.filter(media => media.id !== mediaEntry.id)
    })
  }

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
      // Remove the old entry
      const filtered = prevEntries.filter(entry => 
        !(entry.date === oldEntry.date && entry.happiness === oldEntry.happiness)
      )
      // If date changed, also remove any existing entry with the new date
      const filteredByNewDate = newEntry.date !== oldEntry.date
        ? filtered.filter(entry => entry.date !== newEntry.date)
        : filtered
      // Add the new entry and sort by date (newest first)
      return [newEntry, ...filteredByNewDate].sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }

  /**
   * Handles editing today's entry
   */
  const handleEditToday = () => {
    setEditingEntry(todayEntry)
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
    setEditingEntry(null)
    setShowFormModal(true)
  }

  /**
   * Handles closing the form modal
   */
  const handleCloseForm = () => {
    setShowFormModal(false)
    setEditingEntry(null)
  }

  /**
   * Handles editing an entry from the table
   */
  const handleEditEntry = (entry) => {
    setEditingEntry(entry)
    setShowFormModal(true)
  }

  /**
   * Handles adding a media entry
   */
  const handleMediaEntryAdded = (newEntry) => {
    setMediaEntries(prevMedia => {
      // Add new entry and sort by date (newest first)
      return [newEntry, ...prevMedia].sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }

  /**
   * Handles updating a media entry
   */
  const handleMediaEntryUpdated = (oldEntry, newEntry) => {
    setMediaEntries(prevMedia => {
      return prevMedia.map(media => 
        media.id === oldEntry.id ? newEntry : media
      )
    })
  }

  /**
   * Handles deleting media entries
   */
  const handleDeleteMediaEntries = (entriesToDelete) => {
    setMediaEntries(prevMedia => {
      const deleteSet = new Set(entriesToDelete.map(entry => entry.id))
      return prevMedia.filter(entry => !deleteSet.has(entry.id))
    })
  }

  /**
   * Handles opening the media form modal
   */
  const handleOpenMediaForm = () => {
    setEditingMediaEntry(null)
    setShowMediaFormModal(true)
  }

  /**
   * Handles closing the media form modal
   */
  const handleCloseMediaForm = () => {
    setShowMediaFormModal(false)
    setEditingMediaEntry(null)
  }

  /**
   * Handles editing a media entry from the table
   */
  const handleEditMediaEntry = (entry) => {
    setEditingMediaEntry(entry)
    setShowMediaFormModal(true)
  }

  /**
   * Handles viewing details of a happiness entry
   */
  const handleViewDetails = (entry) => {
    setDetailEntry(entry)
    setShowDetailView(true)
  }

  /**
   * Handles closing the detail view
   */
  const handleCloseDetailView = () => {
    setShowDetailView(false)
    setDetailEntry(null)
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
              <h2 style={{ 
                margin: 0, 
                color: '#333', 
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Edit3 size={24} />
                {editingEntry ? 'Edit Your Happiness' : 'Log Your Happiness'}
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
              <HappinessForm 
                initialEntry={editingEntry}
                allMediaEntries={mediaEntries}
                onEntryAdded={(entry) => {
                  handleEntryAdded(entry)
                  setShowFormModal(false)
                  setEditingEntry(null)
                }}
                onEntryUpdated={(oldEntry, newEntry) => {
                  handleUpdateEntry(oldEntry, newEntry)
                  setShowFormModal(false)
                  setEditingEntry(null)
                }}
                onMediaEntriesAdded={handleMediaEntriesAdded}
                onMediaEntryDeleted={handleMediaEntryDeleted}
              />
            </div>
          </div>
        </div>
      )}

      {/* Log Happiness Button or Today's Entry Card */}
      {!todayEntry && (
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
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#005a87'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#007cba'
            }}
          >
            <Edit3 size={20} />
            Log Your Happiness
          </button>
        </div>
      )}

      {/* Tabbed Container for Tables */}
      <section>
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: 'white',
          overflow: 'hidden'
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          }}>
            <button
              onClick={() => setActiveTab('happiness')}
              style={{
                flex: 1,
                padding: '1rem 2rem',
                border: 'none',
                backgroundColor: activeTab === 'happiness' ? 'white' : 'transparent',
                borderBottom: activeTab === 'happiness' ? '3px solid #007cba' : '3px solid transparent',
                color: activeTab === 'happiness' ? '#007cba' : '#666',
                fontWeight: activeTab === 'happiness' ? 'bold' : 'normal',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'happiness') {
                  e.target.style.backgroundColor = '#e9ecef'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'happiness') {
                  e.target.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Smile size={20} />
              Happiness Entries ({entries.length})
            </button>
            <button
              onClick={() => setActiveTab('media')}
              style={{
                flex: 1,
                padding: '1rem 2rem',
                border: 'none',
                backgroundColor: activeTab === 'media' ? 'white' : 'transparent',
                borderBottom: activeTab === 'media' ? '3px solid #007cba' : '3px solid transparent',
                color: activeTab === 'media' ? '#007cba' : '#666',
                fontWeight: activeTab === 'media' ? 'bold' : 'normal',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'media') {
                  e.target.style.backgroundColor = '#e9ecef'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'media') {
                  e.target.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Film size={20} />
              Media Entries ({mediaEntries.length})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '1.5rem' }}>
            {activeTab === 'happiness' && (
              <HappinessTable 
                data={entries}
                mediaData={mediaEntries}
                onDeleteEntries={handleDeleteEntries}
                onUpdateEntry={handleUpdateEntry}
                onEditEntry={handleEditEntry}
                onViewDetails={handleViewDetails}
              />
            )}

            {activeTab === 'media' && (
              <MediaTable 
                data={mediaEntries}
                onDeleteEntries={handleDeleteMediaEntries}
                onEditEntry={handleEditMediaEntry}
                onAddEntry={handleOpenMediaForm}
              />
            )}
          </div>
        </div>
      </section>

      {/* Media Form Modal */}
      {showMediaFormModal && (
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
          onClick={handleCloseMediaForm}
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
              <h2 style={{ 
                margin: 0, 
                color: '#333', 
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Film size={24} />
                {editingMediaEntry ? 'Edit Media Entry' : 'Log Media Entry'}
              </h2>
              <button
                onClick={handleCloseMediaForm}
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
              <MediaForm 
                initialEntry={editingMediaEntry}
                onEntryAdded={(entry) => {
                  handleMediaEntryAdded(entry)
                  setShowMediaFormModal(false)
                  setEditingMediaEntry(null)
                }}
                onEntryUpdated={(oldEntry, newEntry) => {
                  handleMediaEntryUpdated(oldEntry, newEntry)
                  setShowMediaFormModal(false)
                  setEditingMediaEntry(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailView && detailEntry && (
        <HappinessDetailView
          entry={detailEntry}
          mediaEntries={mediaEntries.filter(media => media.date === detailEntry.date)}
          onClose={handleCloseDetailView}
        />
      )}
    </main>
  )
}