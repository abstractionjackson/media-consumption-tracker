/**
 * @fileoverview Simple test for date formatting
 */

// Simple date formatting test without imports
function formatDateTest(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

console.log('Testing date formatting (fixed UTC issue):')
console.log('2024-10-22 ->', formatDateTest('2024-10-22'))
console.log('2024-10-23 ->', formatDateTest('2024-10-23'))
console.log('2024-12-25 ->', formatDateTest('2024-12-25'))
console.log('2024-01-01 ->', formatDateTest('2024-01-01'))