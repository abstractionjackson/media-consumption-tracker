/**
 * @fileoverview Manual test script for form validation
 * Run with: node test/form-validation.js
 */

import { createHappinessEntry } from '../schemas/index.js'

console.log('🧪 Testing Happiness Form Validation\n')

// Test cases
const testCases = [
  // Valid cases
  { date: '2024-10-23', happiness: 2, expected: 'valid' },
  { date: '2024-12-25', happiness: -1, expected: 'valid' },
  { date: '2023-01-01', happiness: 0, expected: 'valid' },
  
  // Invalid cases
  { date: '23-10-2024', happiness: 1, expected: 'invalid' }, // Wrong date format
  { date: '2024-10-23', happiness: 3, expected: 'invalid' }, // Happiness out of range
  { date: '2024-10-23', happiness: -3, expected: 'invalid' }, // Happiness out of range
  { date: '', happiness: 1, expected: 'invalid' }, // Missing date
  { happiness: 1, expected: 'invalid' }, // Missing date field
  { date: '2024-10-23', expected: 'invalid' }, // Missing happiness field
  { date: '2024-10-23', happiness: 1.5, expected: 'invalid' }, // Non-integer happiness
]

let passed = 0
let failed = 0

testCases.forEach((testCase, index) => {
  const result = createHappinessEntry(testCase.date, testCase.happiness)
  const isValid = result.success
  const expectedValid = testCase.expected === 'valid'
  
  if (isValid === expectedValid) {
    console.log(`✅ Test ${index + 1}: PASS`)
    passed++
  } else {
    console.log(`❌ Test ${index + 1}: FAIL`)
    console.log(`   Input: ${JSON.stringify(testCase)}`)
    console.log(`   Expected: ${testCase.expected}`)
    console.log(`   Got: ${isValid ? 'valid' : 'invalid'}`)
    if (!isValid) {
      console.log(`   Errors: ${result.errors.join(', ')}`)
    }
    failed++
  }
})

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)

if (failed === 0) {
  console.log('🎉 All tests passed!')
} else {
  console.log('⚠️  Some tests failed')
  process.exit(1)
}