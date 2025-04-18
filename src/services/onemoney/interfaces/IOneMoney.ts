// Common interfaces
export interface NotifierInfo {
  type: string;
  id: string;
}

// Heartbeat Response
export interface HeartbeatResponse {
  ver: string;
  timestamp: string;
  Status: string;
  Error?: {
    code?: number;
    msg?: string;
    detail?: string;
  };
}

// Consent Request
export interface ConsentRequest {
  ver: string;
  timestamp: string;
  txnid: string;
  ConsentDetail: {
    consentStart: string;
    consentExpiry: string;
    consentMode: string;
    fetchType: string;
    consentTypes: string[];
    fiTypes: string[];
    DataConsumer: {
      id: string;
    };
    Customer: {
      id: string;
    };
    Purpose: {
      code: string;
      refUri: string;
      text: string;
      Category: {
        type: string;
      };
    };
    FIDataRange: {
      from: string;
      to: string;
    };
    DataLife: {
      unit: string;
      value: number;
    };
    Frequency: {
      unit: string;
      value: number;
    };
    DataFilter: {
      type: string;
      operator: string;
      value: string;
    }[];
  };
}

// Consent Response
export interface ConsentResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  consentHandle: string;
  status: string;
}

// Consent Status
export interface ConsentStatusRequest {
  ver: string;
  timestamp: string;
  txnid: string;
  consentHandle: string;
}

export interface ConsentStatusResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  consentStatus: string;
  consentId?: string;
}

// Consent Notification
export interface ConsentNotification {
  ver: string;
  timestamp: string;
  txnid: string;
  Notifier: NotifierInfo;
  ConsentStatusNotification: {
    consentId: string;
    consentStatus: string;
  };
}

export interface ConsentNotificationResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  response: string;
}

// Consent Artefact
export interface ConsentArtefact {
  ver: string;
  timestamp: string;
  txnid: string;
  ConsentDetail: {
    consentId: string;
    // Additional consent details
    // This should match the structure returned by the API
  };
}

// FI Data Request
export interface FIDataRequest {
  ver: string;
  timestamp: string;
  txnid: string;
  FIDataRange: {
    from: string;
    to: string;
  };
  Consent: {
    id: string;
    digitalSignature: string;
  };
  KeyMaterial: {
    cryptoAlg: string;
    curve: string;
    params: string;
    DHPublicKey: {
      expiry: string;
      Parameters: string;
      KeyValue: string;
    };
    Nonce: string;
  };
}

export interface FIDataResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  sessionId: string;
}

// FI Notification
export interface FINotification {
  ver: string;
  timestamp: string;
  txnid: string;
  Notifier: NotifierInfo;
  FIStatusNotification: {
    sessionId: string;
    sessionStatus: string;
    FIStatusResponse: Array<{
      fipID: string;
      Accounts: {
        linkRefNumber: string;
      };
      FIStatus: string;
      description: string;
    }>;
  };
}

// FI Fetch
export interface FIFetchResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  FI: Array<{
    fipID: string;
    data: string; // This will be encrypted data
    KeyMaterial: {
      cryptoAlg: string;
      curve: string;
      params: string;
      DHPublicKey: {
        expiry: string;
        Parameters: string;
        KeyValue: string;
      };
      Nonce: string;
    };
  }>;
}
