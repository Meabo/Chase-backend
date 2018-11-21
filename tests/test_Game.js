const {expect}  = require('chai');
const { assert } = require('chai')
const Game = require('../src/Game');
const User = require('../src/User');
const ChaseObject = require('../src/ChaseObject')

describe('Game engine', () =>
{
    let game;
    let users = [];
    let chaseobject;

    before(() =>
    {
        let user = new User("Mehdi", [48.8556475,2.2986304]);
        let user1 = new User("Bebert", [48.8574884, 2.2955138]);
        users.push(user, user1);

        chaseobject = new ChaseObject([48.8574884, 2.2955138]);
    });

    it('Creates a game', async () =>
    {
        game = new Game();
        assert.instanceOf(game, Game);
    });

    it('Creates a game with players', async () =>
    {
        game = new Game(users);
        assert.strictEqual(game.getUsers(), users);
    });

    it('Creates an objet in the game', async () =>
    {
        let game = new Game(users, chaseobject);
        assert.strictEqual(game.getObject(), chaseobject);
    });
});