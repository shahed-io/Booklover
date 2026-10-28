
export interface TemplateEntry {
  component: (props: any) => unknown;
  subject: string | ((data: any) => string);
  displayName?: string;
  previewData?: Record<string, any>;
  to?: string | ((data: any) => string);
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as welcome } from './welcome.tsx'
import { template as invoiceDelivery } from './invoice-delivery.tsx'
import { template as admin2faCode } from './admin-2fa-code.tsx'
import { template as subscriptionRenewalReminder } from './subscription-renewal-reminder.tsx'
import { template as loginNotification } from './login-notification.tsx'
import { template as orderStatusUpdate } from './order-status-update.tsx'
import { template as subscriptionActivated } from './subscription-activated.tsx'
import { template as paymentSuccess } from './payment-success.tsx'
import { template as paymentFailed } from './payment-failed.tsx'
import { template as subscriptionCancelled } from './subscription-cancelled.tsx'
import { template as refundProcessed } from './refund-processed.tsx'
import { template as giveawayWinner } from './giveaway-winner.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'order-status-update': orderStatusUpdate,
  'welcome': welcome,
  'invoice-delivery': invoiceDelivery,
  'admin-2fa-code': admin2faCode,
  'subscription-renewal-reminder': subscriptionRenewalReminder,
  'login-notification': loginNotification,
  'subscription-activated': subscriptionActivated,
  'payment-success': paymentSuccess,
  'payment-failed': paymentFailed,
  'subscription-cancelled': subscriptionCancelled,
  'refund-processed': refundProcessed,
  'giveaway-winner': giveawayWinner,
};
