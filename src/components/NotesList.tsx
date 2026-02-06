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
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'success':
        return 'border-l-green-400 bg-green-50';
      case 'info':
      default:
        return 'border-l-blue-400 bg-blue-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Notes ({notes.length})</h2>
          <button 
            onClick={() => setShowAddNote(!showAddNote)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {showAddNote && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
              <select 
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Save Note
              </button>
              <button 
                onClick={() => setShowAddNote(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add First Note
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesList;