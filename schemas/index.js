/**
 * @fileoverview Core data schema definitions and validation utilities
 */

import happinessSchema from './happiness.json' with { type: 'json' }
import mediaSchema from './media.json' with { type: 'json' }

/**
 * All available schemas
 * @type {Object<string, Object>}
 */
export const schemas = {
  happiness: happinessSchema,
  media: mediaSchema
}

/**
 * Validates data against a schema
 * @param {Object} data - The data to validate
 * @param {Object} schema - The JSON schema to validate against
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateData(data, schema) {
  const errors = []
  
  // Basic validation implementation
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`)
      }
    }
  }
  
  // Type and constraint validation
  for (const [key, value] of Object.entries(data)) {
    const prop = schema.properties?.[key]
    if (!prop) {
      if (schema.additionalProperties === false) {
        errors.push(`Additional property not allowed: ${key}`)
      }
      continue
    }
    
    // Type validation
    if (prop.type === 'string' && typeof value !== 'string') {
      errors.push(`Field ${key} must be a string`)
    } else if (prop.type === 'integer' && (!Number.isInteger(value))) {
      errors.push(`Field ${key} must be an integer`)
    }
    
    // Enum validation for strings
    if (prop.type === 'string' && prop.enum) {
      if (!prop.enum.includes(value)) {
        errors.push(`Field ${key} must be one of: ${prop.enum.join(', ')}`)
      }
    }
    
    // Pattern validation for strings
    if (prop.type === 'string' && prop.pattern) {
      const regex = new RegExp(prop.pattern)
      if (!regex.test(value)) {
        errors.push(`Field ${key} does not match required pattern`)
      }
    }
    
    // Range validation for integers
    if (prop.type === 'integer') {
      if (prop.minimum !== undefined && value < prop.minimum) {
        errors.push(`Field ${key} must be >= ${prop.minimum}`)
      }
      if (prop.maximum !== undefined && value > prop.maximum) {
        errors.push(`Field ${key} must be <= ${prop.maximum}`)
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates a happiness entry
 * @param {Object} data - The happiness data to validate
 * @returns {Object} Validation result
 */
export function validateHappiness(data) {
  return validateData(data, schemas.happiness)
}

/**
 * Creates a new happiness entry with validation
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} happiness - Happiness level (-2 to 2)
 * @returns {Object} Either the valid happiness object or validation errors
 */
export function createHappinessEntry(date, happiness) {
  const entry = { date, happiness }
  const validation = validateHappiness(entry)
  
  if (validation.isValid) {
    return { success: true, data: entry }
  } else {
    return { success: false, errors: validation.errors }
  }
}

/**
 * Generates a UUID v4
 * @returns {string} UUID string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Validates a media entry
 * @param {Object} data - The media data to validate
 * @returns {Object} Validation result
 */
export function validateMedia(data) {
  return validateData(data, schemas.media)
}

/**
 * Creates a new media entry with validation
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} type - Media type (book, video, podcast, music)
 * @param {number} duration - Duration in minutes (positive integer)
 * @param {string} id - Optional UUID (will be generated if not provided)
 * @returns {Object} Either the valid media object or validation errors
 */
export function createMediaEntry(date, type, duration, id = null) {
  const entry = { 
    id: id || generateUUID(),
    date, 
    type, 
    duration 
  }
  const validation = validateMedia(entry)
  
  if (validation.isValid) {
    return { success: true, data: entry }
  } else {
    return { success: false, errors: validation.errors }
  }
}