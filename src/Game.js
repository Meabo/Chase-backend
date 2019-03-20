const History = require('./History');
const { timer, pipe, from } = require('rxjs');
const { take, finalize, mergeMap } = require('rxjs/operators');
const LocationUtils = require('./LocationUtils');
const Results = require('./Results');

class Game {
	constructor(players_, chaseobject_, area) {
		this.players = players_;
		this.chaseobject = chaseobject_;
		this.area = area;
		this.socketServerFunctions = null;
		this.history = new History();
		this.timer = null;
		this.roomName = '12'; // NEED TO BE CHANGED
		this.gameState = {};
		this.guardian = null;
		this.results = new Results();
	}

	attach(socketServerFunctions) {
		if (socketServerFunctions) this.socketServerFunctions = socketServerFunctions;
	}

	isFinished() {
		return this.gameState.isFinished;
	}

	async BeginTimer(limit, ticker) {
		this.gameState.isFinished = false;
		this.timer = timer(0, ticker)
			.pipe(
				take(limit),
				finalize(() => {
					this.gameState.isFinished = true;
				})
			)
			.subscribe();
	}

	getGuardian() {
		return this.guardian;
	}
	moveTo(pseudo, loc) {
		const player = this.players.find((player) => pseudo === player.pseudo);
		if (player) {
			this.history.addMove(pseudo, player.getLocation(), loc, Date.now());
			player.moveTo(loc);
		}
	}
	sendChaseObjectLocation() {
		this.socketServerFunctions.sendChaseObject(this.getChaseObject().getLocation(), this.roomName);
	}

	catchChaseObject(player) {
		const distance = LocationUtils.distanceByLoc(player.getLocation(), this.chaseobject.getLocation());
		if (distance < 10) {
			this.history.addCatch('catch', player.pseudo, player.getLocation(), Date.now());
			this.guardian = player;
		}
	}

	stealChaseObject(player) {
		if (this.guardian === null) return null;
		const distance = LocationUtils.distanceByLoc(player.getLocation(), this.guardian.getLocation());
		if (distance < 0.5) {
			this.history.addSteal('steal', player.pseudo, this.guardian.pseudo, player.getLocation(), Date.now());
			this.guardian = player;
		}
	}

	getResults() {
		return this.results.getResults(this.history);
	}

	getResultsByPlayer(player) {
		return this.results.getResultsByPlayer(this.history, player);
	}

	getPlayersObservers() {
		return from(this.players).pipe(mergeMap((player) => player.actionObserver));
	}

	getPlayers() {
		return this.players;
	}

	getChaseObject() {
		return this.chaseobject;
	}

	getArea() {
		return this.area;
	}

	getHistory() {
		return this.history;
	}
}

module.exports = Game;
