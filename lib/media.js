/**
 * @fileoverview Media data management utilities
 */

import { validateMedia, createMediaEntry } from '../schemas/index.js'

/**
 * Media type descriptions for UI display
 * @type {Object<string, string>}
 */
export const MEDIA_TYPES = {
  'book': 'Book 📚',
  'video': 'Video 🎬',
  'podcast': 'Podcast 🎙️',
  'music': 'Music 🎵'
}

/**
 * Gets the description for a media type
 * @param {string} type - Media type
 * @returns {string} Description with emoji
 */
export function getMediaTypeDescription(type) {
  return MEDIA_TYPES[type] || 'Unknown'
}

/**
 * Formats duration in minutes to human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (mins === 0) {
    return `${hours} hr`
  }
  
  return `${hours} hr ${mins} min`
}

/**
 * Formats a date string for display without UTC adjustment
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  // Parse the date parts manually to avoid UTC issues
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day) // month is 0-indexed
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Sample media data for testing
 * @type {Array<Object>}
 */
export const SAMPLE_DATA = [
  { id: '550e8400-e29b-41d4-a716-446655440000', date: '2024-10-20', type: 'book', title: 'The Great Gatsby', duration: 45 },
  { id: '550e8400-e29b-41d4-a716-446655440001', date: '2024-10-21', type: 'video', title: 'Inception', duration: 120 },
  { id: '550e8400-e29b-41d4-a716-446655440002', date: '2024-10-22', type: 'podcast', title: 'Serial Episode 1', duration: 60 },
  { id: '550e8400-e29b-41d4-a716-446655440003', date: '2024-10-23', type: 'music', title: 'Abbey Road', duration: 30 }
]

/**
 * Validates sample data against schema
 * @returns {Object} Validation results
 */
export function validateSampleData() {
  const results = SAMPLE_DATA.map(entry => ({
    entry,
    validation: validateMedia(entry)
  }))
  
  return {
    allValid: results.every(r => r.validation.isValid),
    results
  }
}
