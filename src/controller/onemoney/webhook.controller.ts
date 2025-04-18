import { Request, Response } from 'express';
import { ConsentNotification, FINotification } from 'services/onemoney/interfaces/IOneMoney';
import OneMoneyService from 'services/onemoney/oneMoneyService';

export default class WebhookController {
  private oneMoneyService: OneMoneyService;

  constructor() {
    this.oneMoneyService = new OneMoneyService();
  }

  /**
   * Handle consent notifications from Onemoney
   */
  async handleConsentNotification(req: Request, res: Response): Promise<void> {
    try {
      const notification = req.body as ConsentNotification;
      console.log('Received consent notification:', JSON.stringify(notification));

      // Process the notification
      const consentId = notification.ConsentStatusNotification.consentId;
      const consentStatus = notification.ConsentStatusNotification.consentStatus;

      if (consentStatus === 'ACTIVE') {
        // Fetch consent artefact for approved consent
        const consentArtefact = await this.oneMoneyService.getConsentArtefact(consentId);
        console.log('Fetched consent artefact:', JSON.stringify(consentArtefact));
        
        // Process the consent artefact as needed
        // Store in database, etc.
      }

      // Send acknowledgment response
      res.status(200).json({
        ver: notification.ver,
        timestamp: new Date().toISOString(),
        txnid: notification.txnid,
        response: 'OK'
      });
    } catch (error) {
      console.error('Error handling consent notification:', error);
      res.status(500).json({
        ver: '1.0',
        timestamp: new Date().toISOString(),
        txnid: req.body.txnid || '',
        response: 'ERROR'
      });
    }
  }

  /**
   * Handle FI notifications from Onemoney
   */
  async handleFINotification(req: Request, res: Response): Promise<void> {
    try {
      const notification = req.body as FINotification;
      console.log('Received FI notification:', JSON.stringify(notification));

      // Process the notification
      const sessionId = notification.FIStatusNotification.sessionId;
      const sessionStatus = notification.FIStatusNotification.sessionStatus;

      if (sessionStatus === 'COMPLETED') {
        // Data is ready, fetch it
        const fiData = await this.oneMoneyService.fetchFIData(sessionId);
        console.log('Fetched FI data for session:', sessionId);
        
        // Process and decrypt the FI data as needed
        // Store in database, etc.
      }

      // Send acknowledgment response
      res.status(200).json({
        ver: notification.ver,
        timestamp: new Date().toISOString(),
        txnid: notification.txnid,
        response: 'OK'
      });
    } catch (error) {
      console.error('Error handling FI notification:', error);
      res.status(500).json({
        ver: '1.0',
        timestamp: new Date().toISOString(),
        txnid: req.body.txnid || '',
        response: 'ERROR'
      });
    }
  }
}
