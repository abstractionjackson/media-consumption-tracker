/**
 * @fileoverview Table component for displaying and managing media entries
 */

'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper
} from '@tanstack/react-table'
import { MEDIA_TYPES, formatDate, formatDuration } from '../lib/media.js'
import ConfirmDialog from './ConfirmDialog.js'
import MediaDetailView from './MediaDetailView.js'

const columnHelper = createColumnHelper()

/**
 * Data table component for displaying and managing media entries
 * Aggregates entries by date
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of media entries
 * @param {Function} props.onDeleteEntries - Callback when entries are deleted
 * @param {Function} props.onEditEntry - Callback when edit button is clicked for selected entry
 * @returns {JSX.Element} The data table
 */
export default function MediaTable({ data, onDeleteEntries, onEditEntry, onAddEntry }) {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedDateData, setSelectedDateData] = useState(null)

  // Aggregate data by date
  const aggregatedData = useMemo(() => {
    const grouped = {}
    
    data.forEach(entry => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = {
          date: entry.date,
          entries: [],
          types: new Set(),
          totalDuration: 0
        }
      }
      grouped[entry.date].entries.push(entry)
      grouped[entry.date].types.add(entry.type)
      grouped[entry.date].totalDuration += entry.duration
    })

    // Convert to array and sort by date
    return Object.values(grouped).map(group => ({
      date: group.date,
      entries: group.entries,
      types: Array.from(group.types),
      totalDuration: group.totalDuration
    }))
  }, [data])

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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {formatDate(info.getValue())}
          </div>
        ),
        sortingFn: 'datetime',
      }),
      columnHelper.accessor('types', {
        header: 'Media Types',
        cell: (info) => {
          const types = info.getValue()
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {types.map(type => (
                <span 
                  key={type}
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {MEDIA_TYPES[type]}
                </span>
              ))}
            </div>
          )
        },
        sortingFn: 'basic',
      }),
      columnHelper.accessor('totalDuration', {
        header: 'Total Duration',
        cell: (info) => {
          const duration = info.getValue()
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontWeight: 'bold',
                color: '#333'
              }}>
                {formatDuration(duration)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                ({duration} min)
              </span>
            </div>
          )
        },
        sortingFn: 'basic',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#005a87'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#007cba'
            }}
          >
            View Details
          </button>
        ),
        size: 150,
      }),
    ],
    []
  )

  const table = useReactTable({
    data: aggregatedData,
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
    getRowId: (row) => row.date,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  /**
   * Handles opening detail modal for a date
   */
  const handleViewDetails = (rowData) => {
    setSelectedDateData(rowData)
    setDetailModalOpen(true)
  }

  /**
   * Handles closing detail modal
   */
  const handleCloseDetail = () => {
    setDetailModalOpen(false)
    setSelectedDateData(null)
  }

  /**
   * Handles deletion of selected entries
   * Deletes all individual entries for selected dates
   */
  const handleDeleteSelected = () => {
    if (selectedCount === 0) return
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    // Collect all individual entries from selected dates
    const allEntriesToDelete = selectedRows.flatMap(row => row.original.entries)
    onDeleteEntries(allEntriesToDelete)
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
          {data.length} total entries • {aggregatedData.length} dates • {selectedCount} selected
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onAddEntry}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#218838'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#28a745'
            }}
          >
            + Add Media Entry
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
        border: '1px solid #ddd', 
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white'
        }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#333',
                      borderBottom: '2px solid #dee2e6',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none'
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
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
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#999',
                    fontStyle: 'italic'
                  }}
                >
                  No media entries yet. Click "+ Add Media Entry" to create one.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #dee2e6',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '1rem'
                      }}
                    >
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedDateData && (
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
          onClick={handleCloseDetail}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '800px',
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
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1
            }}>
              <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
                Media Details
              </h2>
              <button
                onClick={handleCloseDetail}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.25rem',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
            <MediaDetailView 
              date={selectedDateData.date}
              mediaEntries={selectedDateData.entries}
            />
          </div>
        </div>
      )}
    </div>
  )
}
