/**
 * @fileoverview Core data schema definitions and validation utilities
 */

import happinessSchema from './happiness.json'

/**
 * All available schemas
 * @type {Object<string, Object>}
 */
export const schemas = {
  happiness: happinessSchema
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