class Game
{
    constructor(players_, chaseobject_)
    {
        this.players = players_;
        this.chaseobject = chaseobject_;
    }

    getUsers()
    {
        return this.players;
    }

    getObject()
    {
        return this.chaseobject;
    }
}

module.exports = Game;