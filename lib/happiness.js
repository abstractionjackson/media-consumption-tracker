/**
 * @fileoverview Happiness data management utilities
 */

import { validateHappiness, createHappinessEntry } from '../schemas/index.js'

/**
 * Happiness level descriptions for UI display
 * @type {Object<string, string>}
 */
export const HAPPINESS_LEVELS = {
  '-2': 'Very Unhappy 😢',
  '-1': 'Unhappy 😔',
  '0': 'Neutral 😐',
  '1': 'Happy 😊',
  '2': 'Very Happy 😄'
}

/**
 * Gets the description for a happiness level
 * @param {number} level - Happiness level (-2 to 2)
 * @returns {string} Description with emoji
 */
export function getHappinessDescription(level) {
  return HAPPINESS_LEVELS[level] || 'Unknown'
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
 * Sample happiness data for testing
 * @type {Array<Object>}
 */
export const SAMPLE_DATA = [
  { date: '2024-10-20', happiness: 1 },
  { date: '2024-10-21', happiness: -1 },
  { date: '2024-10-22', happiness: 2 },
  { date: '2024-10-23', happiness: 0 }
]

/**
 * Validates sample data against schema
 * @returns {Object} Validation results
 */
export function validateSampleData() {
  const results = SAMPLE_DATA.map(entry => ({
    entry,
    validation: validateHappiness(entry)
  }))
  
  return {
    allValid: results.every(r => r.validation.isValid),
    results
  }
}