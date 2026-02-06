import React, { useState } from 'react';
import {
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  Paperclip,
  MessageCircle,
  Send,
  ChevronDown,
  Tag,
  ArrowRight,
  FileText,
  MoreHorizontal
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

interface ActivityItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  detail?: string;
}

export interface TicketData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  assignee: string;
  reporter: string;
  created: string;
  updated: string;
  dueDate: string;
  shipmentRef?: string;
  attachments: number;
  comments: number;
}

interface TicketDetailModalProps {
  ticket: TicketData;
  onClose: () => void;
  onUpdateTicket: (updated: TicketData) => void;
}

const PRIORITY_OPTIONS: TicketData['priority'][] = ['low', 'medium', 'high', 'urgent'];
const STATUS_OPTIONS: TicketData['status'][] = ['open', 'in-progress', 'resolved', 'closed'];
const ASSIGNEE_OPTIONS = ['John Smith', 'Mike Chen', 'David Brown', 'Anna Martinez', 'James Anderson', 'Kevin Lee', 'Sarah Johnson'];
const CATEGORY_OPTIONS = ['Damage Claim', 'Documentation', 'Customs', 'Billing', 'Delivery', 'Technical', 'General'];

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose, onUpdateTicket }) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: ticket.reporter,
      content: ticket.description,
      timestamp: ticket.created,
      isInternal: false
    },
    {
      id: 'c2',
      author: ticket.assignee,
      content: `I've reviewed this ticket and will begin working on it shortly. Will update once I have more information.`,
      timestamp: ticket.updated,
      isInternal: false
    }
  ]);

  const [activity, setActivity] = useState<ActivityItem[]>([
    { id: 'a1', action: 'created this ticket', actor: ticket.reporter, timestamp: ticket.created },
    { id: 'a2', action: 'assigned to', actor: 'System', timestamp: ticket.created, detail: ticket.assignee },
    { id: 'a3', action: `set priority to ${ticket.priority}`, actor: ticket.reporter, timestamp: ticket.created },
    { id: 'a4', action: `changed status to ${ticket.status.replace('-', ' ')}`, actor: ticket.assignee, timestamp: ticket.updated }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'resolved': return 'bg-emerald-100 text-emerald-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const now = () => new Date().toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  const handleStatusChange = (newStatus: TicketData['status']) => {
    const prev = ticket.status;
    onUpdateTicket({ ...ticket, status: newStatus, updated: now() });
    setActivity(a => [...a, {
      id: `a_${Date.now()}`,
      action: `changed status from ${prev.replace('-', ' ')} to ${newStatus.replace('-', ' ')}`,
      actor: 'You',
      timestamp: now()
    }]);
    setEditingField(null);
  };

  const handlePriorityChange = (newPriority: TicketData['priority']) => {
    const prev = ticket.priority;
    onUpdateTicket({ ...ticket, priority: newPriority, updated: now() });
    setActivity(a => [...a, {
      id: `a_${Date.now()}`,
      action: `changed priority from ${prev} to ${newPriority}`,
      actor: 'You',
      timestamp: now()
    }]);
    setEditingField(null);
  };

  const handleAssigneeChange = (newAssignee: string) => {
    const prev = ticket.assignee;
    onUpdateTicket({ ...ticket, assignee: newAssignee, updated: now() });
    setActivity(a => [...a, {
      id: `a_${Date.now()}`,
      action: `reassigned from ${prev} to ${newAssignee}`,
      actor: 'You',
      timestamp: now()
    }]);
    setEditingField(null);
  };

  const handleCategoryChange = (newCategory: string) => {
    onUpdateTicket({ ...ticket, category: newCategory, updated: now() });
    setActivity(a => [...a, {
      id: `a_${Date.now()}`,
      action: `changed category to ${newCategory}`,
      actor: 'You',
      timestamp: now()
    }]);
    setEditingField(null);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c_${Date.now()}`,
      author: 'You',
      content: newComment.trim(),
      timestamp: now(),
      isInternal
    };
    setComments(prev => [...prev, comment]);
    setActivity(a => [...a, {
      id: `a_${Date.now()}`,
      action: isInternal ? 'added an internal note' : 'added a comment',
      actor: 'You',
      timestamp: now()
    }]);
    onUpdateTicket({ ...ticket, comments: ticket.comments + 1, updated: now() });
    setNewComment('');
    setIsInternal(false);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-600', 'bg-emerald-600', 'bg-amber-600',
      'bg-rose-600', 'bg-cyan-600', 'bg-teal-600'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-4 overflow-hidden animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            {getStatusIcon(ticket.status)}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-blue-600 font-medium">{ticket.id}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('-', ' ')}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mt-0.5">{ticket.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          <div className="flex-1 border-r border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
              <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                <span>Reported by <span className="font-medium text-gray-700">{ticket.reporter}</span></span>
                <span>on {ticket.created}</span>
                {ticket.shipmentRef && (
                  <span>Shipment: <span className="font-medium text-blue-600">{ticket.shipmentRef}</span></span>
                )}
              </div>
            </div>

            <div className="px-6 pt-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'comments'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Comments ({comments.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Activity ({activity.length})</span>
                  </div>
                </button>
              </div>
            </div>

            {activeTab === 'comments' && (
              <div className="px-6 py-4 space-y-4 max-h-[400px] overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment.id} className={`flex space-x-3 ${comment.isInternal ? 'bg-amber-50 -mx-2 px-2 py-2 rounded-lg border border-amber-100' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${getAvatarColor(comment.author)}`}>
                      {getInitials(comment.author)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-400">{comment.timestamp}</span>
                        {comment.isInternal && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-200 text-amber-800 rounded uppercase">Internal</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
                  <div className="space-y-4">
                    {activity.map(item => (
                      <div key={item.id} className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium text-gray-900">{item.actor}</span>{' '}
                            {item.action}
                            {item.detail && <span className="font-medium text-gray-900"> {item.detail}</span>}
                          </p>
                          <span className="text-xs text-gray-400">{item.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => setIsInternal(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    !isInternal ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Reply
                </button>
                <button
                  onClick={() => setIsInternal(true)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isInternal ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Internal Note
                </button>
              </div>
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold bg-blue-600`}>
                  Y
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isInternal ? 'Add an internal note (not visible to reporter)...' : 'Write a comment...'}
                    rows={3}
                    className={`w-full px-4 py-3 text-sm border rounded-xl focus:ring-2 focus:border-blue-500 resize-none transition-colors ${
                      isInternal
                        ? 'bg-amber-50 border-amber-200 focus:ring-amber-500 placeholder:text-amber-400'
                        : 'bg-gray-50 border-gray-200 focus:ring-blue-500 placeholder:text-gray-400'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddComment();
                    }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-gray-400">Ctrl+Enter to send</span>
                    </div>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        newComment.trim()
                          ? isInternal
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isInternal ? 'Add Note' : 'Comment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-72 bg-gray-50/70 p-5 space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
              {editingField === 'status' ? (
                <div className="space-y-1">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        s === ticket.status ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(s)}
                        <span className="capitalize">{s.replace('-', ' ')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setEditingField('status')}
                  className="flex items-center space-x-2 group"
                >
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('-', ' ')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
              {editingField === 'priority' ? (
                <div className="space-y-1">
                  {PRIORITY_OPTIONS.map(p => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        p === ticket.priority ? 'font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded border capitalize ${getPriorityColor(p)}`}>
                        {p}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setEditingField('priority')}
                  className="flex items-center space-x-2 group"
                >
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border capitalize ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Assignee</label>
              {editingField === 'assignee' ? (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {ASSIGNEE_OPTIONS.map(a => (
                    <button
                      key={a}
                      onClick={() => handleAssigneeChange(a)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                        a === ticket.assignee ? 'bg-blue-50 text-blue-800 font-medium' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getAvatarColor(a)}`}>
                        {getInitials(a)}
                      </div>
                      <span>{a}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setEditingField('assignee')}
                  className="flex items-center space-x-2 group"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getAvatarColor(ticket.assignee)}`}>
                    {getInitials(ticket.assignee)}
                  </div>
                  <span className="text-sm text-gray-900">{ticket.assignee}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              {editingField === 'category' ? (
                <div className="space-y-1">
                  {CATEGORY_OPTIONS.map(c => (
                    <button
                      key={c}
                      onClick={() => handleCategoryChange(c)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        c === ticket.category ? 'bg-blue-50 text-blue-800 font-medium' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setEditingField('category')}
                  className="flex items-center space-x-2 group"
                >
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{ticket.category}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            <hr className="border-gray-200" />

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Reporter</label>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getAvatarColor(ticket.reporter)}`}>
                  {getInitials(ticket.reporter)}
                </div>
                <span className="text-sm text-gray-900">{ticket.reporter}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{ticket.dueDate}</span>
              </div>
            </div>

            {ticket.shipmentRef && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Shipment</label>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600 font-medium">{ticket.shipmentRef}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Created</label>
              <span className="text-xs text-gray-500">{ticket.created}</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Last Updated</label>
              <span className="text-xs text-gray-500">{ticket.updated}</span>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-2">
              {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                <button
                  onClick={() => handleStatusChange('resolved')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolve Ticket</span>
                </button>
              )}
              {ticket.status === 'resolved' && (
                <button
                  onClick={() => handleStatusChange('closed')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Close Ticket</span>
                </button>
              )}
              {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                <button
                  onClick={() => handleStatusChange('open')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reopen Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
