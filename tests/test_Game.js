const {assert, expect}  = require('chai');
const Game = require('../src/Game');
const User = require('../src/User');
const ChaseObject = require('../src/ChaseObject');
const ChaseMap = require('../src/ChaseMap');
const GameHistory = require('../src/GameHistory');

describe('Game engine', () =>
{
    let game;
    let users = [];
    let chaseobject;
    let bounds;
    let map;
    let history;

    function get_bounds() {
        let top_left = [48.8569443,2.2940138];
        let top_right = [48.8586221,2.2963717];
        let bot_left = [48.8523546,2.3012814];
        let bot_right = [48.8539637,2.3035665];

        bounds = [top_left, top_right, bot_left, bot_right];

    }

    before(() =>
    {
        let user = new User("Mehdi", [48.8556475,2.2986304]);
        let user1 = new User("Bebert", [48.8574884, 2.2955138]);
        users.push(user, user1);

        chaseobject = new ChaseObject([48.8574884, 2.2955138]);
        get_bounds();
        map = new ChaseMap(bounds);
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

    it('Creates a map in the game', async () =>
    {
        let game = new Game(users, chaseobject, map);
        assert.strictEqual(game.getMap(), map);
    });

    it('Creates a history in the game', async () =>
    {
        let game = new Game(users, chaseobject, map);
        assert.instanceOf(game.getHistory(), GameHistory);
    });


});