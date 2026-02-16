const io = require('socket.io-client');
const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5009/api';
const SOCKET_URL = 'http://127.0.0.1:5009/socket.io'; // Socket.io defaults

async function runTest() {
    try {
        console.log('--- Starting Chat Flow Test ---');

        // 1. Register User
        const uniqueSuffix = Date.now();
        const userData = {
            username: `tester${uniqueSuffix}`,
            email: `tester${uniqueSuffix}@example.com`,
            password: 'StrongP@ssw0rd123!',
            role: 'athlete'
        };

        console.log(`1. Registering user: ${userData.username}`);
        let authRes;
        try {
            authRes = await axios.post(`${BASE_URL}/auth/register`, userData);
        } catch (e) {
            console.error('Register failed:', e.response ? e.response.data : e.message);
            // Fallback to login if exists (unlikely with unique suffix)
            console.log('Register failed, trying login...');
            authRes = await axios.post(`${BASE_URL}/auth/login`, { email: userData.email, password: userData.password });
        }

        const token = authRes.data.token;
        if (!token) throw new Error('No token received');
        console.log('   User registered/logged in. Token received.');

        // 2. Create Room
        const roomData = {
            name: `Test Room ${uniqueSuffix}`,
            description: "A room for testing",
            purpose: "Testing websocket flow",
            category: "General",
            visibility: "Public",
            max_members: 10,
            rules: "Be nice",
            creator_agreed_terms: true
        };

        console.log(`2. Creating room: ${roomData.name}`);
        const createRes = await axios.post(`${BASE_URL}/v1/chat/rooms`, roomData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const roomId = createRes.data._id;
        console.log(`   Room created. ID: ${roomId}`);

        // 3. Join Room (Creator is auto-joined, but let's test join endpoint with another user if we had one. 
        // For now, let's just create another user to join)

        const user2Data = {
            username: `joiner${uniqueSuffix}`,
            email: `joiner${uniqueSuffix}@example.com`,
            password: 'StrongP@ssw0rd123!',
            role: 'athlete'
        };
        console.log(`3. Registering User 2: ${user2Data.username}`);
        const auth2Res = await axios.post(`${BASE_URL}/auth/register`, user2Data);
        const token2 = auth2Res.data.token;

        console.log(`4. User 2 Joining Room ${roomId}`);
        await axios.post(`${BASE_URL}/v1/chat/rooms/${roomId}/join`, { agreed_to_rules: true }, {
            headers: { Authorization: `Bearer ${token2}` }
        });
        console.log('   User 2 joined successfully via API.');

        // Ensure we connect to the /chat namespace on the correct port
        const socket = io(`${SOCKET_URL}/chat`, {
            path: '/socket.io',
            auth: { token: token2 },
            transports: ['websocket'],
            extraHeaders: {
                Origin: 'http://localhost:5173'
            }
        });

        socket.on('connect', () => {
            console.log('   Socket connected!');

            // Join the specific room namespace/channel
            socket.emit('joinRoom', { roomId });
        });

        socket.on('error', (err) => {
            console.error('   Socket Error:', err);
        });

        socket.on('connect_error', (err) => {
            console.error('   Socket Connect Error:', err.message);
            // console.error('   Socket Connect Error Details:', err);
        });

        return new Promise((resolve, reject) => {
            socket.on('message', (msg) => {
                console.log('   Received Message:', msg);
                if (msg.content === 'Hello World from Test Script') {
                    console.log('--- TEST PASSED: Message received correctly ---');
                    socket.disconnect();
                    resolve();
                }
            });

            // Send message after a delay to ensure join completes
            setTimeout(() => {
                console.log('6. Sending Message from User 2...');
                socket.emit('sendMessage', {
                    roomId,
                    content: 'Hello World from Test Script'
                });
            }, 1000);

            setTimeout(() => {
                reject(new Error('Timeout waiting for message'));
                socket.disconnect();
            }, 10000);
        });

    } catch (error) {
        console.error('TEST FAILED:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

runTest();
