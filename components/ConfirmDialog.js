/**
 * @fileoverview Reusable confirmation dialog component
 */

'use client'

import { useEffect } from 'react'
import { AlertTriangle, Zap, Info } from 'lucide-react'

/**
 * Custom confirmation dialog component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} [props.confirmText='Confirm'] - Text for confirm button
 * @param {string} [props.cancelText='Cancel'] - Text for cancel button
 * @param {Function} props.onConfirm - Callback when confirmed
 * @param {Function} props.onCancel - Callback when cancelled
 * @param {string} [props.variant='danger'] - Visual style variant (danger, warning, info)
 * @returns {JSX.Element|null} The confirmation dialog or null if not open
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const variantStyles = {
    danger: {
      confirmBg: '#dc3545',
      confirmHoverBg: '#c82333',
      iconColor: '#dc3545',
      icon: AlertTriangle
    },
    warning: {
      confirmBg: '#ffc107',
      confirmHoverBg: '#e0a800',
      iconColor: '#ffc107',
      icon: Zap
    },
    info: {
      confirmBg: '#0d6efd',
      confirmHoverBg: '#0b5ed7',
      iconColor: '#0d6efd',
      icon: Info
    }
  }

  const style = variantStyles[variant] || variantStyles.danger
  const IconComponent = style.icon

  return (
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
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={onCancel}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'slideUp 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon and Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              color: style.iconColor
            }}
          >
            <IconComponent size={48} />
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#212529',
              textAlign: 'center'
            }}
          >
            {title}
          </h3>
        </div>

        {/* Message */}
        <p
          style={{
            margin: '0 0 1.5rem 0',
            fontSize: '0.95rem',
            color: '#6c757d',
            lineHeight: '1.5',
            textAlign: 'center'
          }}
        >
          {message}
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: 'transparent',
              color: '#6c757d',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '90px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f8f9fa'
              e.target.style.borderColor = '#adb5bd'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = '#dee2e6'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: style.confirmBg,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              minWidth: '90px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = style.confirmHoverBg
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = style.confirmBg
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
