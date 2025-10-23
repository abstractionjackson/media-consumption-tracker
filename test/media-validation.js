/**
 * @fileoverview Test file for media schema validation
 */

import { createMediaEntry, validateMedia } from '../schemas/index.js'
import { MEDIA_TYPES, formatDuration, SAMPLE_DATA, validateSampleData } from '../lib/media.js'

console.log('=== Media Schema Validation Tests ===\n')

// Test 1: Valid media entries
console.log('Test 1: Valid media entries')
const validTests = [
  { date: '2024-10-23', type: 'book', duration: 60 },
  { date: '2024-10-23', type: 'video', duration: 120 },
  { date: '2024-10-23', type: 'podcast', duration: 45 },
  { date: '2024-10-23', type: 'music', duration: 30 },
  { date: '2024-10-23', type: 'book', duration: 1 }, // minimum duration
]

validTests.forEach((test, idx) => {
  const result = createMediaEntry(test.date, test.type, test.duration)
  console.log(`  ${idx + 1}. ${JSON.stringify(test)} -> ${result.success ? '✓ PASS' : '✗ FAIL'}`)
  if (!result.success) {
    console.log(`     Errors: ${result.errors.join(', ')}`)
  } else {
    console.log(`     Generated ID: ${result.data.id}`)
  }
})

// Test 2: Invalid media entries
console.log('\nTest 2: Invalid media entries (should fail)')
const invalidTests = [
  { date: 'invalid-date', type: 'book', duration: 60, expected: 'Invalid date format' },
  { date: '2024-10-23', type: 'invalid', duration: 60, expected: 'Invalid type' },
  { date: '2024-10-23', type: 'book', duration: 0, expected: 'Duration too small' },
  { date: '2024-10-23', type: 'book', duration: -30, expected: 'Negative duration' },
  { date: '2024-10-23', type: 'book', duration: 30.5, expected: 'Non-integer duration' },
  { type: 'book', duration: 60, expected: 'Missing date' },
  { date: '2024-10-23', duration: 60, expected: 'Missing type' },
  { date: '2024-10-23', type: 'book', expected: 'Missing duration' },
]

invalidTests.forEach((test, idx) => {
  const { expected, ...data } = test
  const result = validateMedia(data)
  console.log(`  ${idx + 1}. ${expected}: ${!result.isValid ? '✓ PASS' : '✗ FAIL'}`)
  if (!result.isValid) {
    console.log(`     Errors: ${result.errors.join(', ')}`)
  }
})

// Test 3: Media types
console.log('\nTest 3: Media types')
Object.entries(MEDIA_TYPES).forEach(([type, desc]) => {
  console.log(`  ${type}: ${desc}`)
})

// Test 4: Duration formatting
console.log('\nTest 4: Duration formatting')
const durations = [15, 30, 45, 60, 75, 90, 120, 150, 180, 240]
durations.forEach(duration => {
  console.log(`  ${duration} minutes -> ${formatDuration(duration)}`)
})

// Test 5: Sample data validation
console.log('\nTest 5: Sample data validation')
const sampleValidation = validateSampleData()
console.log(`  All valid: ${sampleValidation.allValid ? '✓ PASS' : '✗ FAIL'}`)
SAMPLE_DATA.forEach((entry, idx) => {
  const result = sampleValidation.results[idx]
  console.log(`  ${idx + 1}. ${JSON.stringify(entry)} -> ${result.validation.isValid ? '✓' : '✗'}`)
})

console.log('\n=== Tests Complete ===')
