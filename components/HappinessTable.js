/**
 * @fileoverview Data table component for happiness entries
 */

'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { HAPPINESS_LEVELS, formatDate } from '../lib/happiness.js'
import { formatDuration } from '../lib/media.js'
import ConfirmDialog from './ConfirmDialog.js'

const columnHelper = createColumnHelper()

/**
 * Data table component for displaying and managing happiness entries
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of happiness entries
 * @param {Array} props.mediaData - Array of media entries
 * @param {Function} props.onDeleteEntries - Callback when entries are deleted
 * @param {Function} props.onUpdateEntry - Callback when an entry is updated
 * @param {Function} props.onEditEntry - Callback when edit button is clicked for selected entry
 * @returns {JSX.Element} The data table
 */
export default function HappinessTable({ data, mediaData = [], onDeleteEntries, onUpdateEntry, onEditEntry }) {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')

  /**
   * Calculates total media duration for a given date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {number} Total duration in minutes
   */
  const getMediaDurationForDate = (date) => {
    return mediaData
      .filter(media => media.date === date)
      .reduce((total, media) => total + media.duration, 0)
  }

  /**
   * Handles starting edit mode for a cell
   */
  const handleStartEdit = (rowId, currentValue) => {
    setEditingCell(rowId)
    setEditValue(currentValue.toString())
  }

  /**
   * Handles canceling edit mode
   */
  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  /**
   * Handles saving the edited value
   */
  const handleSaveEdit = (originalEntry) => {
    const newValue = parseInt(editValue, 10)
    
    // Validate the new value
    if (isNaN(newValue) || newValue < -2 || newValue > 2) {
      handleCancelEdit()
      return
    }
    
    // Only update if the value actually changed
    if (newValue !== originalEntry.happiness) {
      const updatedEntry = {
        ...originalEntry,
        happiness: newValue
      }
      onUpdateEntry?.(originalEntry, updatedEntry)
    }
    
    handleCancelEdit()
  }

  // Table columns definition
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            style={{ cursor: 'pointer' }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            style={{ cursor: 'pointer' }}
          />
        ),
        size: 50,
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (info) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {formatDate(info.getValue())}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              {info.getValue()}
            </div>
          </div>
        ),
        sortingFn: 'datetime',
      }),
      columnHelper.accessor('happiness', {
        header: 'Happiness Level',
        cell: (info) => {
          const level = info.getValue()
          const rowId = info.row.id
          const isEditing = editingCell === rowId
          
          return isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="-2"
                max="2"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit(info.row.original)
                  } else if (e.key === 'Escape') {
                    handleCancelEdit()
                  }
                }}
                onBlur={() => handleSaveEdit(info.row.original)}
                autoFocus
                style={{
                  minWidth: '30px',
                  width: '65px',
                  textAlign: 'center',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: parseInt(editValue) >= 0 ? '#e8f5e8' : '#ffeaea',
                  color: parseInt(editValue) >= 0 ? '#2d5a2d' : '#8b2635',
                  border: '2px solid #0d6efd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  outline: 'none',
                  boxShadow: 'none',
                  margin: 0
                }}
              />
              <span style={{ fontSize: '0.9rem', color: '#495057' }}>
                {HAPPINESS_LEVELS[editValue] || ''}
              </span>
            </div>
          ) : (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onClick={() => handleStartEdit(rowId, level)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              title="Click to edit"
            >
              <span style={{
                display: 'inline-block',
                minWidth: '30px',
                textAlign: 'center',
                padding: '0.25rem 0.5rem',
                backgroundColor: level >= 0 ? '#e8f5e8' : '#ffeaea',
                color: level >= 0 ? '#2d5a2d' : '#8b2635',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {level}
              </span>
              <span>{HAPPINESS_LEVELS[level.toString()]}</span>
            </div>
          )
        },
        sortingFn: 'basic',
      }),
      columnHelper.accessor('date', {
        id: 'mediaDuration',
        header: 'Media Duration',
        cell: (info) => {
          const date = info.getValue()
          const totalDuration = getMediaDurationForDate(date)
          
          if (totalDuration === 0) {
            return (
              <span style={{ color: '#999', fontStyle: 'italic' }}>
                No media
              </span>
            )
          }
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {formatDuration(totalDuration)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                ({totalDuration} min)
              </span>
            </div>
          )
        },
        sortingFn: (rowA, rowB) => {
          const durationA = getMediaDurationForDate(rowA.original.date)
          const durationB = getMediaDurationForDate(rowB.original.date)
          return durationA - durationB
        },
      }),
    ],
    [editingCell, editValue, handleStartEdit, handleSaveEdit, handleCancelEdit, mediaData, getMediaDurationForDate]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => `${row.date}-${row.happiness}`, // Unique ID for each row
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  /**
   * Handles deletion of selected entries
   */
  const handleDeleteSelected = () => {
    if (selectedCount === 0) return
    setShowDeleteDialog(true)
  }

  /**
   * Handles editing the selected entry
   */
  const handleEditSelected = () => {
    if (selectedCount !== 1) return
    const selectedEntry = selectedRows[0].original
    if (onEditEntry) {
      onEditEntry(selectedEntry)
    }
  }

  const handleConfirmDelete = () => {
    const selectedData = selectedRows.map(row => row.original)
    onDeleteEntries(selectedData)
    setRowSelection({})
    setShowDeleteDialog(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Selected Entries"
        message={`Are you sure you want to delete ${selectedCount} selected ${
          selectedCount === 1 ? 'entry' : 'entries'
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />

      {/* Table controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          {data.length} total entries • {selectedCount} selected
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleEditSelected}
            disabled={selectedCount !== 1}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCount === 1 ? '#007cba' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: selectedCount === 1 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (selectedCount === 1) {
                e.target.style.backgroundColor = '#005a87'
              }
            }}
            onMouseOut={(e) => {
              if (selectedCount === 1) {
                e.target.style.backgroundColor = '#007cba'
              }
            }}
          >
            Edit Selected (1)
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedCount === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCount > 0 ? '#dc3545' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (selectedCount > 0) {
                e.target.style.backgroundColor = '#c82333'
              }
            }}
            onMouseOut={(e) => {
              if (selectedCount > 0) {
                e.target.style.backgroundColor = '#dc3545'
              }
            }}
          >
            Delete Selected ({selectedCount})
          </button>
        </div>
      </div>

      {/* Data table */}
      <div style={{
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{
            backgroundColor: '#f8f9fa'
          }}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#495057',
                      borderBottom: '2px solid #dee2e6',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      width: header.getSize(),
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted()] ?? '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }}
                >
                  No happiness entries yet. Add your first entry above! 🎯
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: row.getIsSelected() ? '#e3f2fd' : index % 2 === 0 ? '#fff' : '#f8f9fa',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (!row.getIsSelected()) {
                      e.currentTarget.style.backgroundColor = '#f1f3f4'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!row.getIsSelected()) {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f8f9fa'
                    }
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '1rem',
                        borderBottom: '1px solid #e9ecef',
                        verticalAlign: 'top'
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}