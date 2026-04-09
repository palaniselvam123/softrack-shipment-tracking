import React from 'react';
import { Plus, X, Upload, FileText, ChevronDown } from 'lucide-react';
import { BookingData, documentTypes } from './bookingData';

interface Props {
  data: BookingData;
  onChange: (field: string, value: unknown) => void;
}

export default function StepDocuments({ data, onChange }: Props) {
  const addDoc = () => {
    onChange('documents', [...data.documents, { id: Date.now().toString(), type: '', name: '' }]);
  };

  const updateDoc = (id: string, field: string, value: unknown) => {
    onChange('documents', data.documents.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDoc = (id: string) => {
    onChange('documents', data.documents.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Documents</h3>
        <button
          onClick={addDoc}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {data.documents.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500 font-medium">No documents uploaded</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">Add commercial invoices, packing lists, or certificates</p>
          <button onClick={addDoc} className="px-5 py-2.5 bg-sky-50 text-sky-600 rounded-xl text-sm font-semibold hover:bg-sky-100 transition-colors border border-sky-200">
            <Plus className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Upload First Document
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.documents.map((doc, idx) => (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Document {idx + 1}</span>
                </div>
                <button onClick={() => removeDoc(doc.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Document Type</label>
                  <div className="relative">
                    <select
                      value={doc.type}
                      onChange={e => updateDoc(doc.id, 'type', e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white appearance-none transition-colors"
                    >
                      <option value="">Select type</option>
                      {documentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Document Name</label>
                  <input
                    type="text"
                    value={doc.name}
                    onChange={e => updateDoc(doc.id, 'name', e.target.value)}
                    placeholder="Enter document name"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Upload File</label>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 truncate">{doc.file ? (doc.file as File).name : 'Choose file...'}</span>
                    <input type="file" className="hidden" onChange={e => updateDoc(doc.id, 'file', e.target.files?.[0])} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
