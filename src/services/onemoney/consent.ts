// pages/api/onemoney/consent.js
import OneMoneyService from './oneMoneyService';
import onemoneyConfig  from 'config/onemoney/onemoney';

const oneMoneyService = new OneMoneyService(onemoneyConfig);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, purpose, consentDetail } = req.body;
      const result = await oneMoneyService.createConsentRequest(userId, purpose, consentDetail);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/onemoney/consent/[consentId].js

export default async function handler(req, res) {
  const { consentId } = req.query;
  
  if (req.method === 'GET') {
    try {
      const result = await oneMoneyService.getConsentStatus(consentId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/onemoney/request-data.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { consentId } = req.body;
      const result = await oneMoneyService.requestData(consentId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/onemoney/fetch-data/[sessionId].js

export default async function handler(req, res) {
  const { sessionId } = req.query;
  
  if (req.method === 'GET') {
    try {
      const result = await oneMoneyService.fetchData(sessionId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
