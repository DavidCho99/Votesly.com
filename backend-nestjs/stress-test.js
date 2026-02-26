const io = require('socket.io-client');

const SOCKET_URL = 'http://localhost:3001';
const CONCURRENT_CLIENTS = 100;
const CLICKS_PER_CLIENT = 1000;
const TEAM_IDS = ['1', '2', '3', '4'];

async function runLoadTest() {
  console.log(`Starting Socket.IO load test: ${CONCURRENT_CLIENTS} clients, each sending ${CLICKS_PER_CLIENT} votes...`);
  
  let connectedCount = 0;
  let clients = [];

  // Initialize clients
  for (let i = 0; i < CONCURRENT_CLIENTS; i++) {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      forceNew: true,
    });
    
    socket.on('connect', () => {
      connectedCount++;
      if (connectedCount === CONCURRENT_CLIENTS) {
        console.log('All clients connected. Beginning vote bombardment...');
        startBombardment(clients);
      }
    });

    socket.on('vote_batch_update', (data) => {
        // Just listening to ensure payload delivery under load
    });

    clients.push(socket);
  }
}

function startBombardment(clients) {
  const startTime = Date.now();
  let totalVotesDispatched = 0;

  clients.forEach((socket, index) => {
    // Simulate aggressive auto-clicker
    for (let c = 0; c < CLICKS_PER_CLIENT; c++) {
      setTimeout(() => {
        const teamId = TEAM_IDS[Math.floor(Math.random() * TEAM_IDS.length)];
        socket.emit('vote', {
          teamId,
          userId: `load_test_${index}`,
          type: 'organic',
          amount: 1
        });
        totalVotesDispatched++;
        
        if (totalVotesDispatched === CONCURRENT_CLIENTS * CLICKS_PER_CLIENT) {
          const endTime = Date.now();
          console.log(`\n🎉 Load test completed in ${(endTime - startTime) / 1000} seconds!`);
          console.log(`Dispatched ${totalVotesDispatched} total votes targeting Redis.`);
          
          setTimeout(() => {
             console.log('Closing client sockets...');
             clients.forEach(c => c.disconnect());
             process.exit(0);
          }, 2000); // give it 2 seconds to receive final batch payload before exiting
        }
      }, Math.random() * 5000); // spread load randomly across 5 seconds
    }
  });
}

runLoadTest();
