// Webhook configuration and handlers for LogiTRACK
export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: any;
  signature?: string;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
}

// Available webhook events
export const WEBHOOK_EVENTS = {
  SHIPMENT_CREATED: 'shipment.created',
  SHIPMENT_UPDATED: 'shipment.updated',
  SHIPMENT_STATUS_CHANGED: 'shipment.status_changed',
  BOOKING_CREATED: 'booking.created',
  BOOKING_UPDATED: 'booking.updated',
  BOOKING_CONFIRMED: 'booking.confirmed',
  INVOICE_CREATED: 'invoice.created',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_OVERDUE: 'invoice.overdue',
  COMMUNICATION_MESSAGE: 'communication.message',
  TICKET_CREATED: 'ticket.created',
  TICKET_UPDATED: 'ticket.updated',
  CONTAINER_LOADED: 'container.loaded',
  CONTAINER_DISCHARGED: 'container.discharged',
  CUSTOMS_CLEARED: 'customs.cleared',
  DELIVERY_COMPLETED: 'delivery.completed'
};

// Webhook service class
export class WebhookService {
  private webhooks: WebhookConfig[] = [];

  // Register a new webhook
  registerWebhook(config: WebhookConfig): string {
    const webhookId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.webhooks.push({ ...config });
    console.log(`Webhook registered: ${webhookId}`, config);
    return webhookId;
  }

  // Send webhook notification
  async sendWebhook(event: string, data: any): Promise<void> {
    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data
    };

    const activeWebhooks = this.webhooks.filter(
      wh => wh.active && wh.events.includes(event)
    );

    for (const webhook of activeWebhooks) {
      try {
        await this.deliverWebhook(webhook, payload);
      } catch (error) {
        console.error(`Failed to deliver webhook to ${webhook.url}:`, error);
      }
    }
  }

  // Deliver webhook to endpoint
  private async deliverWebhook(webhook: WebhookConfig, payload: WebhookPayload): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'LogiTRACK-Webhooks/1.0',
      'X-LogiTRACK-Event': payload.event,
      'X-LogiTRACK-Timestamp': payload.timestamp
    };

    // Add signature if secret is provided
    if (webhook.secret) {
      const signature = await this.generateSignature(JSON.stringify(payload), webhook.secret);
      headers['X-LogiTRACK-Signature'] = signature;
    }

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`Webhook delivered successfully to ${webhook.url}`);
  }

  // Generate HMAC signature for webhook security
  private async generateSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const hashArray = Array.from(new Uint8Array(signature));
    return 'sha256=' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Get all registered webhooks
  getWebhooks(): WebhookConfig[] {
    return [...this.webhooks];
  }

  // Remove webhook
  removeWebhook(index: number): void {
    this.webhooks.splice(index, 1);
  }
}

// Global webhook service instance
export const webhookService = new WebhookService();

// Helper functions for common webhook triggers
export const triggerShipmentWebhook = (event: string, shipment: any) => {
  webhookService.sendWebhook(event, {
    shipment_no: shipment.shipmentNo,
    status: shipment.status,
    container_no: shipment.containerNo,
    shipper: shipment.shipper,
    consignee: shipment.consignee,
    departure: shipment.departure,
    arrival_port: shipment.arrivalPort,
    etd: shipment.etd,
    eta: shipment.eta,
    transport: shipment.transport,
    type: shipment.type
  });
};

export const triggerBookingWebhook = (event: string, booking: any) => {
  webhookService.sendWebhook(event, {
    booking_no: booking.bookingNo,
    booking_date: booking.bookingDate,
    shipper: booking.shipper,
    consignee: booking.consignee,
    origin: booking.origin,
    destination: booking.destination,
    transport: booking.transport,
    service_type: booking.serviceType,
    status: booking.bookingStatus,
    requested_etd: booking.requestedETD
  });
};

export const triggerInvoiceWebhook = (event: string, invoice: any) => {
  webhookService.sendWebhook(event, {
    invoice_ref: invoice.invoiceRef,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.invoiceStatus,
    due_date: invoice.dueDate,
    shipment_ref: invoice.shipmentRef,
    vendor: invoice.vendor,
    description: invoice.description
  });
};

export const triggerCommunicationWebhook = (event: string, message: any) => {
  webhookService.sendWebhook(event, {
    conversation_id: message.conversationId,
    sender: message.sender,
    content: message.content,
    timestamp: message.timestamp,
    shipment_id: message.shipmentId
  });
};

export const triggerTicketWebhook = (event: string, ticket: any) => {
  webhookService.sendWebhook(event, {
    ticket_id: ticket.id,
    title: ticket.title,
    priority: ticket.priority,
    status: ticket.status,
    category: ticket.category,
    assignee: ticket.assignee,
    shipment_ref: ticket.shipmentRef
  });
};