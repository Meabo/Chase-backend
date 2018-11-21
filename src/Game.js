const GameHistory = require('../src/GameHistory');

class Game
{
    constructor(players_, chaseobject_, chasemap_)
    {
        this.players = players_;
        this.chaseobject = chaseobject_;
        this.chasemap = chasemap_;
        this.history = new GameHistory();
    }

    getUsers()
    {
        return this.players;
    }

    getObject()
    {
        return this.chaseobject;
    }

    getMap()
    {
        return this.chasemap ;
    }

    getHistory()
    {
        return this.history;
    }
}

module.exports = Game;