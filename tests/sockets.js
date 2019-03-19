const ioClient = require('socket.io-client');
const socketUrl = 'http://localhost:3000';
const { assert } = require('chai');
const server = require('../src/server-socket');

const options = {
	transports: [ 'websocket' ],
	'force new connection': true
};

describe('Socket.io : Events', async () => {
	beforeEach(async () => {
		server.http.listen(3000, () => {});
	});

	afterEach(async () => {
		server.http.close();
	});

	describe('Basic Connection', () => {
		let client;
		beforeEach(async () => {
			client = ioClient.connect(socketUrl, options);
		});
		afterEach(async () => {
			client.disconnect();
		});
		it('Should check that the socket is connected', (done) => {
			client.on('connect', () => {
				assert.equal(client.connected, true);
				done();
			});
		});
	});

	describe("Player's Location", () => {
		let player1;
		let player2;
		let player3;

		beforeEach(() => {
			player1 = ioClient.connect(socketUrl, options);
			player2 = ioClient.connect(socketUrl, options);
			player3 = ioClient.connect(socketUrl, options);
		});

		afterEach(() => {
			player1.disconnect();
			player2.disconnect();
			player3.disconnect();
		});

		it('Player 2 and 3 should receive location of player 1', (done) => {
			player1.emit('player_location', {
				pseudo: 'Mehdi',
				prev_location: [ 48.8569433, 2.2940138 ],
				location: [ 48.8586221, 2.2963717 ],
				timestamp: Date.now()
			});

			player2.on('player_location', (loc) => {
				assert.equal(loc.pseudo, 'Mehdi');
				player3.on('player_location', (loc) => {
					assert.equal(loc.pseudo, 'Mehdi');
					done();
				});
			});
		});
	});

	describe('Area: Rooms with Players', () => {
		let player1;
		let player2;
		let player3;
		const socketUrlRooms = 'http://localhost:3000/rooms';

		beforeEach(() => {
			player1 = ioClient.connect(socketUrlRooms, options);
			player2 = ioClient.connect(socketUrlRooms, options);
			player3 = ioClient.connect(socketUrlRooms, options);
		});

		afterEach(() => {
			player1.disconnect();
			player2.disconnect();
			player3.disconnect();
		});

		it('Players should receive a Welcome message', (done) => {
			player1.on('connect', () => {
				player1.on('welcome', (message) => {
					assert.equal(message, 'Welcome to the Area');
				});
			});
			player2.on('connect', () => {
				player2.on('welcome', (message) => {
					assert.equal(message, 'Welcome to the Area');
				});
			});
			player3.on('connect', () => {
				player3.on('welcome', (message) => {
					assert.equal(message, 'Welcome to the Area');
					done();
				});
			});
		});
	});

	describe('Joining & Leave room', () => {
		let player1;
		let player2;
		let player3;
		let player4;

		const socketUrlRooms = 'http://localhost:3000/rooms';

		beforeEach(() => {
			player1 = ioClient.connect(socketUrlRooms, options);
			player2 = ioClient.connect(socketUrlRooms, options);
			player3 = ioClient.connect(socketUrlRooms, options);
			player4 = ioClient.connect(socketUrlRooms, options);
		});

		afterEach(() => {
			player1.disconnect();
			player2.disconnect();
			player3.disconnect();
			player4.disconnect();
		});

		it('Players should join different rooms', (done) => {
			player1.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
			});
			player1.on('welcomeroom', function(message) {
				assert.equal(message, 'Welcome to 12');
			});
			player2.emit('joinroom', '13', function(res) {
				assert.equal(res, 'success');
			});
			player2.on('welcomeroom', function(message) {
				assert.equal(message, 'Welcome to 13');
				done();
			});
		});

		it('Players should receive an error if they join a room but they already joined', (done) => {
			player3.emit('joinroom', '12', function(res, rooms) {
				assert.equal(res, 'success');
				player3.emit('joinroom', '13', function(res) {
					assert.equal(res, 'error');
					done();
				});
			});
		});

		it('Players should receive an error if they try to leave without joining before', (done) => {
			player4.emit('leaveroom', '12', function(res) {
				assert.equal(res, 'error');
				done();
			});
		});
	});

	describe('Ready in the room', () => {
		let player1;
		let player2;
		let player3;
		let player4;

		const socketUrlRooms = 'http://localhost:3000/rooms';

		beforeEach(() => {
			player1 = ioClient.connect(socketUrlRooms, options);
			player2 = ioClient.connect(socketUrlRooms, options);
			player3 = ioClient.connect(socketUrlRooms, options);
			player4 = ioClient.connect(socketUrlRooms, options);
		});

		afterEach(() => {
			player1.disconnect();
			player2.disconnect();
			player3.disconnect();
			player4.disconnect();
		});

		it('Players should set ready and ack other players', (done) => {
			player1.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player1.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
			});
			player2.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player3.emit('joinroom', '12', function(res) {
					assert.equal(res, 'success');
				});
				player2.on('userReady', function(message) {
					assert.equal(message, player1.id + 'is ready');
					done();
				});
			});
		});

		it('Should begin the game when everyone is ready', (done) => {
			player1.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player1.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
			});
			player2.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player2.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
			});
			player3.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');

				player3.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
				player1.on('everyoneReady', function(message) {
					assert.equal(message, true);
					done();
				});
			});
		});
	});
});
