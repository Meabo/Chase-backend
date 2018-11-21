const {expect, assert}  = require('chai');
const ChaseObject = require('../src/ChaseObject');

describe('ChaseObject engine', () =>
{
    it('Creates a ChaseObject', async () =>
    {
        let chaseObject = new ChaseObject();
        assert.instanceOf(chaseObject, ChaseObject);
    });

    it('Creates a ChaseObject with a location', async () =>
    {
        let chaseObject_position = [48.8574884, 2.2955138];
        let chaseObject = new ChaseObject(chaseObject_position);
        assert.strictEqual(chaseObject.getLocation(), chaseObject_position );
    });


});