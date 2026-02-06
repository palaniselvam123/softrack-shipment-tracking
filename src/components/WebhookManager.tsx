import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Globe, Key, Eye, EyeOff, Copy, Check, ArrowLeft } from 'lucide-react';
import { WebhookConfig, WebhookService, WEBHOOK_EVENTS, webhookService } from '../api/webhooks';

interface WebhookManagerProps {
  onBack: () => void;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ onBack }) => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showSecrets, setShowSecrets] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<WebhookConfig>({
    url: '',
    events: [],
    secret: '',
    active: true
  });

  useEffect(() => {
    setWebhooks(webhookService.getWebhooks());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIndex !== null) {
      // Update existing webhook
      const updatedWebhooks = [...webhooks];
      updatedWebhooks[editingIndex] = formData;
      setWebhooks(updatedWebhooks);
      setEditingIndex(null);
    } else {
      // Add new webhook
      webhookService.registerWebhook(formData);
      setWebhooks(webhookService.getWebhooks());
    }
    
    setShowAddForm(false);
    setFormData({
      url: '',
      events: [],
      secret: '',
      active: true
    });
  };

  const handleEdit = (index: number) => {
    setFormData(webhooks[index]);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this webhook?')) {
      webhookService.removeWebhook(index);
      setWebhooks(webhookService.getWebhooks());
    }
  };

  const handleEventChange = (event: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        events: [...prev.events, event]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        events: prev.events.filter(e => e !== event)
      }));
    }
  };

  const toggleSecretVisibility = (index: number) => {
    const newShowSecrets = new Set(showSecrets);
    if (newShowSecrets.has(index)) {
      newShowSecrets.delete(index);
    } else {
      newShowSecrets.add(index);
    }
    setShowSecrets(newShowSecrets);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const testWebhook = async (webhook: WebhookConfig, index: number) => {
    try {
      await webhookService.sendWebhook('test.webhook', {
        message: 'This is a test webhook from LogiTRACK',
        timestamp: new Date().toISOString(),
        test: true
      });
      alert('Test webhook sent successfully!');
    } catch (error) {
      alert('Failed to send test webhook: ' + error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Webhook Management</h1>
                <p className="text-sm text-gray-600 mt-1">Configure webhooks to receive real-time notifications</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Webhook</span>
            </button>
          </div>
        </div>

        {/* Webhook List */}
        <div className="p-6">
          {webhooks.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
              <p className="text-gray-500 mb-4">Add your first webhook to start receiving notifications</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Webhook
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{webhook.url}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          webhook.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {webhook.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Events ({webhook.events.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.slice(0, 5).map(event => (
                            <span key={event} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {event}
                            </span>
                          ))}
                          {webhook.events.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{webhook.events.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {webhook.secret && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 mb-1">Secret</p>
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {showSecrets.has(index) ? webhook.secret : '••••••••••••••••'}
                            </code>
                            <button
                              onClick={() => toggleSecretVisibility(index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {showSecrets.has(index) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(webhook.secret || '', index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedIndex === index ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testWebhook(webhook, index)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Webhook Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingIndex !== null ? 'Edit Webhook' : 'Add New Webhook'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL *
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://your-app.com/webhooks/logitrack"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.secret}
                      onChange={(e) => setFormData(prev => ({ ...prev, secret: e.target.value }))}
                      placeholder="Enter a secret for webhook signature verification"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used to generate HMAC-SHA256 signature for webhook security
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Events to Subscribe
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                      {Object.entries(WEBHOOK_EVENTS).map(([key, event]) => (
                        <label key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.events.includes(event)}
                            onChange={(e) => handleEventChange(event, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingIndex(null);
                      setFormData({
                        url: '',
                        events: [],
                        secret: '',
                        active: true
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingIndex !== null ? 'Update Webhook' : 'Add Webhook'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookManager;