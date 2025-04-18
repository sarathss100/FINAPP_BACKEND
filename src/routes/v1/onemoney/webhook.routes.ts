import { Router } from 'express';
import WebhookController from 'controller/onemoney/webhook.controller';

const router = Router();
const webhookController = new WebhookController();

// Webhook endpoints for Onemoney notifications
router.post('/consent-notification', (req, res) => webhookController.handleConsentNotification(req, res));
router.post('/fi-notification', (req, res) => webhookController.handleFINotification(req, res));

export default router;
