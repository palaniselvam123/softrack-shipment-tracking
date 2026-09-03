import React, { useState } from 'react';
import { StickyNote, Plus, User, Calendar, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface NotesListProps {
  shipmentNo: string;
}

const NotesList: React.FC<NotesListProps> = ({ shipmentNo }) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('info');

  const notes = [
    {
      id: 1,
      title: 'Customs Clearance Update',
      content: 'Customs clearance pending additional documentation. Shipper has been notified to provide missing commercial invoice amendments.',
      type: 'warning',
      author: 'Sarah Johnson',
      createdAt: '2026-11-15 14:30',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Container Loading Completed',
      content: 'Container BKSU9898988 has been successfully loaded at Nhava Sheva port. All 260 packages accounted for and secured.',
      type: 'success',
      author: 'Mike Chen',
      createdAt: '2026-11-14 09:15',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Special Handling Instructions',
      content: 'Fragile items in packages 45-67 require special handling. Destination port has been notified of temperature-sensitive cargo.',
      type: 'info',
      author: 'Emma Wilson',
      createdAt: '2026-11-13 16:45',
      priority: 'medium'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-brand-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-400 bg-amber-50';
      case 'success':
        return 'border-l-green-400 bg-green-50';
      case 'info':
      default:
        return 'border-l-blue-400 bg-surface-tile';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-amber-50 text-amber-700';
      case 'low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In a real app, this would make an API call
      console.log('Adding note:', { content: newNote, type: noteType });
      setNewNote('');
      setShowAddNote(false);
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-surface-line">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-navy-900">Notes ({notes.length})</h2>
          <button 
            onClick={() => setShowAddNote(!showAddNote)}
            className="flex items-center space-x-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {showAddNote && (
        <div className="px-6 py-4 border-b border-surface-line bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
              <select 
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Content</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
                rows={3}
                className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleAddNote}
                className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors text-sm"
              >
                Save Note
              </button>
              <button 
                onClick={() => setShowAddNote(false)}
                className="px-4 py-2 border border-surface-line text-navy-900 rounded-md hover:bg-surface-head transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-surface-soft">
        {notes.map((note) => (
          <div key={note.id} className={`p-6 border-l-4 ${getTypeColor(note.type)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getTypeIcon(note.type)}
                <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(note.priority)}`}>
                  {note.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{note.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{note.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{note.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="p-12 text-center">
          <StickyNote className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-500 mb-4">Add your first note to keep track of important information.</p>
          <button 
            onClick={() => setShowAddNote(true)}
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors"
          >
            Add First Note
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesList;