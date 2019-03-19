const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', async (socket) => {
	socket.on('player_location', async (loc) => {
		socket.broadcast.emit('player_location', loc);
	});
});

const rooms = io.of('/rooms').on('connection', (socket) => {
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

	function getSocketsId(nsp, room) {
		return new Promise((resolve, reject) => {
			nsp.in(room).clients((error, clientsId) => {
				resolve(clientsId);
			});
		});
	}

	async function getSockets(nsp, room) {
		const results = await getSocketsId(nsp, room);
		const resultSockets = results.map((socketId) => {
			return nsp.connected[socketId];
		});
		return resultSockets;
	}

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

exports.http = http;
