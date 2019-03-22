const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Namespaces
const rooms = io.of('/rooms');
const games = io.of('/games');

io.on('connection', async (socket) => {});

// Utils
function getSocketIdByRoom(nsp, room) {
	return new Promise((resolve, reject) => {
		nsp.in(room).clients((error, clientsId) => {
			resolve(clientsId);
		});
	});
}

function getSocketId(nsp) {
	return new Promise((resolve, reject) => {
		nsp.clients((error, clientsId) => {
			resolve(clientsId);
		});
	});
}

async function getSockets(nsp, room) {
	const results = await getSocketIdByRoom(nsp, room);
	const resultSockets = results.map((socketId) => {
		return nsp.connected[socketId];
	});
	return resultSockets;
}

rooms.on('connection', (socket) => {
	rooms.emit('welcome', 'Welcome to the Area');
	socket.on('joinroom', function(roomNum, fn) {
		if (Object.keys(socket.rooms).length === 1) {
			socket.join(roomNum, () => {
				rooms.to(roomNum).emit('welcomeroom', 'Welcome to ' + roomNum);
				fn('success', socket.rooms);
			});
		} else {
			fn('error', 'You already joined a room');
		}
	});

	socket.on('leaveroom', function(roomNum, fn) {
		if (Object.keys(socket.rooms).length === 2 && Object.keys(socket.rooms).includes(roomNum)) {
			socket.leave(roomNum);
			rooms.to(roomNum).emit('userleft', socket.id + 'has left the room');
			fn('success');
		} else {
			fn('error', 'You are not in a room');
		}
	});

	function everyoneIsReady(results) {
		const numberSocketReady = results.reduce((acc, socketReady) => {
			return acc + (socketReady.ready === true ? 1 : 0);
		}, 0);
		return numberSocketReady === results.length ? true : false;
	}

	socket.on('ready', async (fn) => {
		const roomsJoined = Object.keys(socket.rooms);
		if (roomsJoined.length === 2) {
			socket.ready = !socket.ready;
			socket.ready === true
				? rooms.to(roomsJoined[0]).emit('userReady', socket.id + 'is ready')
				: rooms.to(roomsJoined[0]).emit('userNotReady', socket.id + 'is not ready');

			const results = await getSockets(rooms, roomsJoined[0]);
			const isEveryoneReady = everyoneIsReady(results);
			if (isEveryoneReady === true) rooms.to(roomsJoined[0]).emit('everyoneReady', true);
			fn('success', socket.ready);
		} else {
			fn('error', 'You are not in a room');
		}
	});
});

games.on('connection', (socket) => {
	socket.on('location', (payload) => {
		socket.broadcast.emit('location', {
			pseudo: payload.pseudo,
			location: payload.location,
			timestamp: Date.now()
		});
	});
	socket.on('joingame', function(roomNum, fn) {
		if (Object.keys(socket.rooms).length === 1) {
			socket.join(roomNum, () => {
				rooms.to(roomNum).emit('welcomeroom', 'Welcome to ' + roomNum);
				fn('success', socket.rooms);
			});
		} else {
			fn('error', 'You already joined a room');
		}
	});

	socket.on('leavegame', function(roomNum, fn) {
		if (Object.keys(socket.rooms).length === 2 && Object.keys(socket.rooms).includes(roomNum)) {
			socket.leave(roomNum);
			rooms.to(roomNum).emit('userleft', socket.id + 'has left the room');
			fn('success');
		} else {
			fn('error', 'You are not in a room');
		}
	});
});

const gameHooks = {
	sendChaseObject: (chaseObjectLoc, roomName) => {
		return new Promise((resolve, reject) => {
			games.to(roomName).emit('chaseObject', chaseObjectLoc);
			resolve(true);
		});
	},
	newGuardian: async (socket, payload, roomName) => {
		const socketsIdsInRoom = await getSocketIdByRoom(games, roomName);
		socketsIdsInRoom.filter((socketId) => socketId !== socket.id).map((socketId) => {
			games.to(socketId).emit('newGuardian', payload);
		});
		games.to(socket.id).emit('newGuardian', 'You are the new guardian');
	},
	newGuardianSteal: async (socket, payload, roomName) => {
		const socketsIdsInRoom = await getSocketIdByRoom(games, roomName);
		socketsIdsInRoom.filter((socketId) => socketId !== socket.id).map((socketId) => {
			games.to(socketId).emit('newGuardianSteal', payload);
		});
		games.to(socket.id).emit('newGuardianSteal', 'You are the new guardian');
	}
};

module.exports = {
	http: http,
	games: games,
	gameHooks: gameHooks
};
