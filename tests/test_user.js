const {expect}  = require('chai');
const { assert } = require('chai')
const User = require('../src/User');

describe('User engine', () =>
{
    it('Creates a user', async () =>
    {
        let user = new User();
        assert.instanceOf(user, User);
    });

    it('Creates a user with a pseudo', async () =>
    {
        let pseudo = "Mehdi";
        let user = new User(pseudo);
        assert.strictEqual(user.getPseudo(), pseudo);
    });

    it('Creates a user with a pseudo and a location', async () =>
    {
        let pseudo = "Mehdi";
        let location = [48.8556475,2.2986304];
        let user = new User(pseudo, location);
        assert.strictEqual(user.getLocation(), location);
    });

    it('Moves a user from a location to another', async () =>
    {
        let pseudo = "Mehdi";
        let location = [48.8556475, 2.2986304];
        let new_location = [48.8574884, 2.2955138];

        let user = new User(pseudo, location);
        user.moveTo(new_location);
        assert.strictEqual(user.getLocation(), new_location);
    });



});