import React, { useState } from 'react';
import { Book, Code, Copy, Check, Globe, Key, Shield, Zap } from 'lucide-react';

const WebhookDocumentation: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const samplePayload = `{
  "event": "shipment.status_changed",
  "timestamp": "2026-01-25T10:30:00Z",
  "data": {
    "shipment_no": "MUM/SE/SHP/0001",
    "status": "In Transit",
    "container_no": "MEDU6997206",
    "shipper": "Australian Fine Wines Pty Ltd",
    "consignee": "South Asia Trading Company",
    "departure": "East Perth, AU",
    "arrival_port": "Nhava Sheva Port, MH",
    "etd": "09-Oct-2026",
    "eta": "29-Jan-2026",
    "transport": "Sea",
    "type": "Export"
  }
}`;

  const nodeJsExample = `const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Webhook endpoint
app.post('/webhooks/logitrack', (req, res) => {
  const signature = req.headers['x-logitrack-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify signature (if secret is configured)
  if (signature) {
    const expectedSignature = 'sha256=' + 
      crypto.createHmac('sha256', 'your-webhook-secret')
        .update(payload)
        .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).send('Invalid signature');
    }
  }
  
  // Process the webhook
  const { event, data } = req.body;
  
  switch (event) {
    case 'shipment.status_changed':
      console.log(\`Shipment \${data.shipment_no} status: \${data.status}\`);
      break;
    case 'invoice.created':
      console.log(\`New invoice: \${data.invoice_ref}\`);
      break;
    // Handle other events...
  }
  
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});`;

  const pythonExample = `from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

@app.route('/webhooks/logitrack', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-LogiTRACK-Signature')
    payload = request.get_data()
    
    # Verify signature (if secret is configured)
    if signature:
        expected_signature = 'sha256=' + hmac.new(
            b'your-webhook-secret',
            payload,
            hashlib.sha256
        ).hexdigest()
        
        if signature != expected_signature:
            return jsonify({'error': 'Invalid signature'}), 401
    
    # Process the webhook
    data = request.get_json()
    event = data.get('event')
    webhook_data = data.get('data')
    
    if event == 'shipment.status_changed':
        print(f"Shipment {webhook_data['shipment_no']} status: {webhook_data['status']}")
    elif event == 'invoice.created':
        print(f"New invoice: {webhook_data['invoice_ref']}")
    
    return jsonify({'status': 'success'}), 200

if __name__ == '__main__':
    app.run(port=3000)`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Book className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Webhook Documentation</h1>
                <p className="text-sm text-gray-600 mt-1">Learn how to integrate LogiTRACK webhooks</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 mb-4">
                LogiTRACK webhooks allow you to receive real-time notifications about events in your freight forwarding operations. 
                When an event occurs (like a shipment status change or new invoice), LogiTRACK will send an HTTP POST request to your configured endpoint.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Zap className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Real-time</h3>
                  <p className="text-sm text-gray-600">Instant notifications when events occur</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Shield className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Secure</h3>
                  <p className="text-sm text-gray-600">HMAC signature verification</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Globe className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Reliable</h3>
                  <p className="text-sm text-gray-600">Automatic retry mechanism</p>
                </div>
              </div>
            </section>

            {/* Available Events */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipment Events</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><code className="bg-gray-100 px-1 rounded">shipment.created</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">shipment.updated</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">shipment.status_changed</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">container.loaded</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">container.discharged</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">customs.cleared</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">delivery.completed</code></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Business Events</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><code className="bg-gray-100 px-1 rounded">booking.created</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">booking.confirmed</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">invoice.created</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">invoice.paid</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">invoice.overdue</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">ticket.created</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">communication.message</code></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payload Structure */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payload Structure</h2>
              <p className="text-gray-600 mb-4">
                All webhook payloads follow a consistent structure with event type, timestamp, and event-specific data.
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{samplePayload}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(samplePayload, 'payload')}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copiedCode === 'payload' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Key className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Webhook Signatures</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Configure a secret to enable HMAC-SHA256 signature verification for enhanced security.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Headers:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code>X-LogiTRACK-Event</code>: The event type</li>
                  <li><code>X-LogiTRACK-Timestamp</code>: ISO 8601 timestamp</li>
                  <li><code>X-LogiTRACK-Signature</code>: HMAC signature (if secret configured)</li>
                </ul>
              </div>
            </section>

            {/* Implementation Examples */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Implementation Examples</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Node.js (Express)</h3>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{nodeJsExample}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(nodeJsExample, 'nodejs')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === 'nodejs' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Python (Flask)</h3>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{pythonExample}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(pythonExample, 'python')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === 'python' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p><strong>Idempotency:</strong> Handle duplicate webhook deliveries gracefully</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p><strong>Response Time:</strong> Respond with 200 status within 10 seconds</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p><strong>Error Handling:</strong> Return appropriate HTTP status codes</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p><strong>Logging:</strong> Log webhook events for debugging and monitoring</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p><strong>Security:</strong> Always verify signatures when using secrets</p>
                </div>
              </div>
            </section>

            {/* Testing */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Testing</h2>
              <p className="text-gray-600 mb-4">
                Use the "Test" button in the webhook management interface to send a test payload to your endpoint. 
                This helps verify your webhook handler is working correctly.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Test Payload Event:</strong> <code>test.webhook</code><br/>
                  <strong>Expected Response:</strong> HTTP 200 status code
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookDocumentation;