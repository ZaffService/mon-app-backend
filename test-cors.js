const fetch = require('node-fetch');

async function testCORS() {
    try {
        const response = await fetch('http://localhost:5001/chats', {
            method: 'GET',
            headers: {
                'Origin': 'https://mon-app-frontend.vercel.app'
            }
        });
        
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testCORS();