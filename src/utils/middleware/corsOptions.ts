
const corsOptions = {
    origin: [
        'https://finapp.my',       
        'https://www.finapp.my',  
        'https://finapp-frontend-k3fx.vercel.app', 
        'http://localhost:3000',
        'http://127.0.0.1:3000' 
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
}

export default corsOptions;
