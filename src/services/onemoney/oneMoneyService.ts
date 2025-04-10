// services/oneMoneyService.js
import axios from 'axios';
import crypto from 'crypto';
import * as jose from 'node-jose';

class OneMoneyService {
  constructor(config) {
    this.baseUrl = config.baseUrl; // OneMoney API base URL
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.privateKey = config.privateKey; // Your signing private key
    this.encryptionPublicKey = config.encryptionPublicKey; // OneMoney's encryption public key
    this.httpClient = axios.create({ baseURL: this.baseUrl });
  }

  // Generate authentication token
  async getAuthToken() {
    try {
      const response = await this.httpClient.post('/oauth2/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Auth token error:', error);
      throw error;
    }
  }

  // Create consent request
  async createConsentRequest(userId, purpose, consentDetail) {
    const token = await this.getAuthToken();
    
    // Create consent request payload
    const payload = {
      ver: "1.0",
      timestamp: new Date().toISOString(),
      txnid: crypto.randomUUID(),
      ConsentDetail: {
        consentStart: consentDetail.startDate,
        consentExpiry: consentDetail.endDate,
        consentMode: "VIEW",
        fetchType: "ONETIME",
        consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
        fiTypes: ["DEPOSIT", "TERM-DEPOSIT", "RECURRING_DEPOSIT", "SIP"],
        DataConsumer: { id: this.clientId },
        Customer: { id: userId },
        Purpose: {
          code: purpose.code,
          refUri: purpose.refUri,
          text: purpose.text,
          Category: { type: purpose.category }
        },
        FIDataRange: {
          from: consentDetail.dataFrom,
          to: consentDetail.dataTo
        },
        DataLife: { unit: "MONTH", value: 1 },
        Frequency: { unit: "MONTH", value: 1 }
      }
    };

    // Sign the payload
    const signedPayload = await this.signPayload(payload);
    
    try {
      const response = await this.httpClient.post('/Consent', signedPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Consent request error:', error);
      throw error;
    }
  }

  // Sign the payload using your private key
  async signPayload(payload) {
    const keystore = await jose.JWK.createKeyStore();
    const key = await keystore.add(this.privateKey, 'pem');
    
    const signOptions = {
      format: 'compact',
      fields: { typ: 'JWT' }
    };
    
    const signed = await jose.JWS.createSign(signOptions, key)
      .update(JSON.stringify(payload))
      .final();
    
    return signed;
  }

  // Get consent status
  async getConsentStatus(consentId) {
    const token = await this.getAuthToken();
    
    try {
      const response = await this.httpClient.get(`/Consent/${consentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Get consent status error:', error);
      throw error;
    }
  }

  // Request financial data once consent is approved
  async requestData(consentId) {
    const token = await this.getAuthToken();
    
    const payload = {
      ver: "1.0",
      timestamp: new Date().toISOString(),
      txnid: crypto.randomUUID(),
      FIDataRange: {
        from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
        to: new Date().toISOString()
      },
      Consent: {
        id: consentId,
        digitalSignature: "Signature"  // This would be signed using your private key
      }
    };

    const signedPayload = await this.signPayload(payload);
    
    try {
      const response = await this.httpClient.post('/FI/request', signedPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Data request error:', error);
      throw error;
    }
  }

  // Fetch financial data using the session ID from the data request
  async fetchData(sessionId) {
    const token = await this.getAuthToken();
    
    try {
      const response = await this.httpClient.get(`/FI/fetch/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Decrypt the received data
      const decryptedData = await this.decryptData(response.data);
      return decryptedData;
    } catch (error) {
      console.error('Data fetch error:', error);
      throw error;
    }
  }

  // Decrypt the financial data using your private key
  async decryptData(encryptedData) {
    // Implementation would use node-jose to decrypt the JWE data
    // This is a simplified placeholder
    return encryptedData;
  }
}

export default OneMoneyService;
