
const onemoneyConfig  = {
    baseUrl: process.env.ONEMONEY_API_BASE_URL || 'https://api-sandbox.onemoney.in/aa',
    clientId: process.env.ONEMONEY_CLIENT_ID || '',
    clientSecret: process.env.ONEMONEY_CLIENT_SECRET || '',
    organizationId: process.env.ONEMONEY_ORGANIZATION_ID || '',
    phoneNumber: process.env.ONEMONEY_PHONE_NUMBER || ''
}

export default onemoneyConfig;
