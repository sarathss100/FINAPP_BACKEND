// Import the correct types - note we need RequestHandler
import { Router, Request, Response, NextFunction } from 'express';
import OneMoneyService from 'services/onemoney/oneMoneyService';
import { v4 as uuidv4 } from 'uuid';
import onemoneyConfig from 'config/onemoney/onemoney';

const router = Router();
const oneMoneyService = new OneMoneyService();

// Heartbeat check
router.get('/heartbeat', (req: Request, res: Response, next: NextFunction) => {
  oneMoneyService.checkHeartbeat()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.error('Heartbeat API error:', error);
      res.status(500).json({ error: 'Failed to check heartbeat' });
    });
});

// Place consent request
router.post('/consent', (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(currentDate.getDate() + 1);
  
  // Example consent request with basic details
  const consentRequest = {
    ver: "1.0",
    timestamp: new Date().toISOString(),
    txnid: uuidv4(),
    ConsentDetail: {
      consentStart: currentDate.toISOString(),
      consentExpiry: tomorrow.toISOString(),
      consentMode: "VIEW",
      fetchType: "ONETIME",
      consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
      fiTypes: ["DEPOSIT"],
      DataConsumer: {
        id: onemoneyConfig.organizationId
      },
      Customer: {
        id: `${onemoneyConfig.phoneNumber}@onemoney`
      },
      Purpose: {
        code: "101",
        refUri: "https://api.rebit.org.in/aa/purpose/101",
        text: "Loan eligibility assessment",
        Category: {
          type: "string"
        }
      },
      FIDataRange: {
        from: new Date(currentDate.setMonth(currentDate.getMonth() - 6)).toISOString(),
        to: new Date().toISOString()
      },
      DataLife: {
        unit: "MONTH",
        value: 1
      },
      Frequency: {
        unit: "MONTH",
        value: 1
      },
      DataFilter: [{
        type: "TRANSACTIONAMOUNT",
        operator: ">=",
        value: "0"
      }]
    }
  };

  oneMoneyService.placeConsentRequest(consentRequest)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.error('Consent request API error:', error);
      res.status(500).json({ error: 'Failed to place consent request' });
    });
});

// Get consent status
router.post('/consent/status', (req: Request, res: Response, next: NextFunction) => {
  const { consentHandle } = req.body;
  
  if (!consentHandle) {
    return res.status(400).json({ error: 'Consent handle is required' });
  }
  
  const statusRequest = {
    ver: "1.0",
    timestamp: new Date().toISOString(),
    txnid: uuidv4(),
    consentHandle
  };
  
  oneMoneyService.getConsentStatus(statusRequest)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.error('Consent status API error:', error);
      res.status(500).json({ error: 'Failed to get consent status' });
    });
});

// Get consent artefact
router.get('/consent/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  oneMoneyService.getConsentArtefact(id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.error('Get consent artefact API error:', error);
      res.status(500).json({ error: 'Failed to get consent artefact' });
    });
});

export default router;
