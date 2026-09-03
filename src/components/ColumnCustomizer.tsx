import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, GripVertical, RotateCcw } from 'lucide-react';

/* Generic over the caller's column shape: callers carry extra fields (the
   invoice grid adds `sortable`) and reordering here must not strip them. */
interface Column {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
}

interface ColumnCustomizerProps<T extends Column> {
  isOpen: boolean;
  onClose: () => void;
  columns: T[];
  onColumnsChange: (columns: T[]) => void;
}

function ColumnCustomizer<T extends Column>({
  isOpen,
  onClose,
  columns,
  onColumnsChange
}: ColumnCustomizerProps<T>) {
  const [localColumns, setLocalColumns] = useState<T[]>(columns);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  /* Re-seed each time it opens; otherwise the initial useState value sticks
     and a second open shows the column set from the first. */
  useEffect(() => {
    if (isOpen) setLocalColumns(columns);
  }, [isOpen, columns]);

  if (!isOpen) return null;

  const handleToggleVisibility = (index: number) => {
    /* Replace the entry rather than mutating it - the objects belong to the
       caller's state and were being edited in place before Apply. */
    setLocalColumns(prev =>
      prev.map((col, i) => (i === index ? { ...col, visible: !col.visible } : col))
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updatedColumns = [...localColumns];
    const draggedColumn = updatedColumns[draggedIndex];
    
    // Remove dragged column
    updatedColumns.splice(draggedIndex, 1);
    
    // Insert at new position
    updatedColumns.splice(dropIndex, 0, draggedColumn);
    
    setLocalColumns(updatedColumns);
    setDraggedIndex(null);
  };

  const handleApply = () => {
    onColumnsChange(localColumns);
    onClose();
  };

  const handleReset = () => {
    const resetColumns = columns.map(col => ({ ...col, visible: true }));
    setLocalColumns(resetColumns);
  };

  const visibleCount = localColumns.filter(col => col.visible).length;

  return (
    <div className="fixed inset-0 bg-navy-950/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-surface-line">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-navy-900">Customize Columns</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Show/hide columns and drag to reorder. {visibleCount} of {localColumns.length} columns visible.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {localColumns.map((column, index) => (
              <div
                key={column.key}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-move transition-colors ${
                  draggedIndex === index ? 'bg-surface-tile border-surface-line' : 'hover:bg-gray-50'
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                
                <button
                  onClick={() => handleToggleVisibility(index)}
                  className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                    column.visible 
                      ? 'bg-surface-tile text-brand-600 hover:bg-surface-head' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {column.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    column.visible ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {column.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-surface-line">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-surface-line text-navy-900 rounded-md hover:bg-surface-head transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColumnCustomizer;