import React, { useState, useRef, useEffect } from 'react';
import { 
  HiSearch, HiChevronLeft, HiChevronRight, HiOutlineEye, 
  HiPencil, HiTrash, HiAdjustments, HiX, HiCheck,
  HiOutlineSelector
} from 'react-icons/hi';
import { HiArrowPath } from 'react-icons/hi2';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Table Row Component
const SortableRow = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-move">
      {children}
    </tr>
  );
};

// Resizable Column Component
const ResizableColumn = ({ column, onResize, onVisibilityChange }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(column.width || 150);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(80, Math.min(400, startWidth.current + diff));
    setWidth(newWidth);
    if (onResize) onResize(column.field, newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <th
      className="relative px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 last:border-r-0 group"
      style={{ width: `${width}px`, minWidth: `${width}px` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{column.headerName}</span>
        <button
          onClick={() => onVisibilityChange(column.field)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Hide column"
        >
          <HiX className="text-xs" />
        </button>
      </div>
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary-yellow transition-colors"
        onMouseDown={handleMouseDown}
      />
    </th>
  );
};

// Column Visibility Modal
const ColumnVisibilityModal = ({ isOpen, onClose, columns, visibleColumns, onToggleColumn, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Show/Hide Columns</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <HiX className="text-xl" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {columns.map((column) => (
              <label key={column.field} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{column.headerName}</span>
                <button
                  onClick={() => onToggleColumn(column.field)}
                  className={`w-10 h-5 rounded-full transition-all ${visibleColumns.includes(column.field) ? 'bg-primary-yellow' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform mt-0.5 ml-0.5 ${visibleColumns.includes(column.field) ? 'translate-x-5' : ''}`} />
                </button>
              </label>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onReset} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            Reset to Default
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-primary-yellow text-primary-black rounded-lg font-semibold text-sm">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Main DataTable Component
const DataTable = ({
  data,
  columns: initialColumns,
  onView,
  onEdit,
  onDelete,
  onRefresh,
  refreshing = false,
  searchPlaceholder = "Search...",
  showSearch = true,
  showPagination = true,
  showColumnVisibility = true,
  itemsPerPage = 10,
  actions = true,
  actionButtons = null,
  emptyMessage = "No data found",
  onRowClick,
  dragAndDrop = false,
  onReorder,
  defaultVisibleColumns = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState(
    defaultVisibleColumns || initialColumns.map(c => c.field)
  );
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [draggedItems, setDraggedItems] = useState(data);

  // Update dragged items when data changes
  useEffect(() => {
    setDraggedItems(data);
  }, [data]);

  // Filter data based on search term
  let filteredData = [...(dragAndDrop ? draggedItems : data)];
  
  // Apply search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredData = filteredData.filter(item => {
      return columns.some(column => {
        if (!visibleColumns.includes(column.field)) return false;
        const value = column.getValue ? column.getValue(item) : item[column.field];
        return value?.toString().toLowerCase().includes(searchLower);
      });
    });
  }

  // Apply sorting
  if (sortField) {
    filteredData.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle column resize
  const handleColumnResize = (field, newWidth) => {
    setColumns(prev => prev.map(col => 
      col.field === field ? { ...col, width: newWidth } : col
    ));
  };

  // Handle column visibility toggle
  const handleToggleColumn = (field) => {
    setVisibleColumns(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  // Reset columns to default
  const handleResetColumns = () => {
    setVisibleColumns(initialColumns.map(c => c.field));
    setColumns(initialColumns);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id && onReorder) {
      const oldIndex = draggedItems.findIndex(item => item.id === active.id);
      const newIndex = draggedItems.findIndex(item => item.id === over.id);
      const newItems = arrayMove(draggedItems, oldIndex, newIndex);
      setDraggedItems(newItems);
      onReorder(newItems);
    }
  };

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Render cell based on column type
  const renderCell = (item, column, index) => {
    if (column.renderCell) {
      return column.renderCell(item, index);
    }
    const value = column.getValue ? column.getValue(item) : item[column.field];
    if (column.type === 'image') {
      return (
        <img 
          src={value || '/placeholder.png'} 
          alt={column.headerName} 
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    if (column.type === 'badge') {
      const badgeClass = column.badgeClass?.(value) || 'bg-gray-100 text-gray-700';
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
          {value || '-'}
        </span>
      );
    }
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString() : '-';
    }
    if (column.type === 'currency') {
      return value ? `₹${value.toLocaleString()}` : '-';
    }
    return value || '-';
  };

  const visibleColumnsList = columns.filter(col => visibleColumns.includes(col.field));

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow text-sm"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 text-gray-500 hover:text-primary-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <HiArrowPath className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          
          {showColumnVisibility && (
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="p-2 text-gray-500 hover:text-primary-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              title="Customize Columns"
            >
              <HiAdjustments className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dragAndDrop ? paginatedData.map(item => item.id) : []} strategy={verticalListSortingStrategy}>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                <tr>
                  {dragAndDrop && (
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-10 bg-gray-50 dark:bg-gray-900/50">
                      <HiOutlineSelector className="text-lg mx-auto" />
                    </th>
                  )}
                  {visibleColumnsList.map((column) => (
                    <ResizableColumn
                      key={column.field}
                      column={column}
                      onResize={handleColumnResize}
                      onVisibilityChange={handleToggleColumn}
                    />
                  ))}
                  {actions && (
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={visibleColumnsList.length + (actions ? 1 : 0) + (dragAndDrop ? 1 : 0)} 
                      className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => {
                    const TableRow = dragAndDrop ? SortableRow : 'tr';
                    const rowProps = dragAndDrop ? { id: item.id } : {};
                    return (
                      <TableRow
                        key={item.id || idx}
                        {...rowProps}
                        onClick={() => onRowClick?.(item)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                      >
                        {dragAndDrop && (
                          <td className="px-4 py-3 text-center">
                            <HiOutlineSelector className="text-gray-400 mx-auto cursor-move" />
                          </td>
                        )}
                        {visibleColumnsList.map((column) => (
                          <td 
                            key={column.field} 
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              column.align === 'center' ? 'text-center' : ''
                            }`}
                            style={{ width: `${column.width}px` }}
                          >
                            {renderCell(item, column, idx)}
                          </td>
                        ))}
                        {actions && (
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              {onView && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onView(item); }}
                                  className="p-2 text-gray-500 hover:text-primary-yellow rounded-lg hover:bg-yellow-50 transition-all"
                                  title="View Details"
                                >
                                  <HiOutlineEye className="text-lg" />
                                </button>
                              )}
                              {onEdit && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                  className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all"
                                  title="Edit"
                                >
                                  <HiPencil className="text-lg" />
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                                  className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                                  title="Delete"
                                >
                                  <HiTrash className="text-lg" />
                                </button>
                              )}
                              {actionButtons && actionButtons(item)}
                            </div>
                          </td>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <HiChevronLeft className="text-sm" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded-lg transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary-yellow text-primary-black font-semibold'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <HiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Column Visibility Modal */}
      <ColumnVisibilityModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onReset={handleResetColumns}
      />
    </div>
  );
};

export default DataTable;