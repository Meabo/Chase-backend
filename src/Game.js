class Game
{
    constructor(players_, chaseobject_, chasemap_)
    {
        this.players = players_;
        this.chaseobject = chaseobject_;
        this.chasemap = chasemap_
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
}

module.exports = Game;