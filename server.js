const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Game state per room
const rooms = {};

function getOrCreateRoom(code) {
  if (!rooms[code]) {
    rooms[code] = {
      players: {},
      revealedThisRound: false,
    };
  }
  return rooms[code];
}

function broadcastRoom(code, data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.roomCode === code) {
      client.send(msg);
    }
  });
}

function getRoomState(room) {
  return {
    type: 'room_state',
    players: room.players,
    revealedThisRound: room.revealedThisRound,
  };
}

wss.on('connection', (ws) => {
  ws.roomCode = null;
  ws.playerName = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    const { type } = msg;

    if (type === 'join') {
      const { code, name, diceCount, dice, color } = msg;
      ws.roomCode = code;
      ws.playerName = name;

      const room = getOrCreateRoom(code);
      room.players[name] = {
        name,
        dice: dice || [],
        diceCount: diceCount || 5,
        eliminated: diceCount === 0,
        ready: false,
        color: color || '#c9a84c',
      };

      broadcastRoom(code, getRoomState(room));
    }

    else if (type === 'update_player') {
      const { name, dice, diceCount, ready, color } = msg;
      const room = rooms[ws.roomCode];
      if (!room || !room.players[name]) return;

      if (dice !== undefined) room.players[name].dice = dice;
      if (diceCount !== undefined) {
        room.players[name].diceCount = diceCount;
        room.players[name].eliminated = diceCount === 0;
      }
      if (ready !== undefined) room.players[name].ready = ready;
      if (color !== undefined) room.players[name].color = color;

      broadcastRoom(ws.roomCode, getRoomState(room));
    }

    else if (type === 'new_round') {
      const room = rooms[ws.roomCode];
      if (!room) return;

      room.revealedThisRound = false;
      Object.values(room.players).forEach(p => { p.ready = false; });

      broadcastRoom(ws.roomCode, getRoomState(room));
    }

    else if (type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
    }
  });

  ws.on('close', () => {
    // Keep player in room state (they may reconnect)
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Perudo server running on port ${PORT}`);
});
