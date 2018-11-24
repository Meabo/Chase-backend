"use strict"

const inside = require("../utils/point_inside_polygon");
const {expect, assert}  = require('chai');

describe('RobustInsidePolygon engine', () =>
{
    it('Test Inside or Outside Polygon', async () =>
    {
        let polygon = [[1, 1], [1, 2], [2, 2], [2, 1]];
        assert.equal(inside.robustPointInPolygon(polygon, [1.5, 1.5]), -1);
        assert.equal(inside.robustPointInPolygon(polygon, [1.2, 1.9]), -1);
        assert.equal(inside.robustPointInPolygon(polygon, [0, 1.9]), 1);
        assert.equal(inside.robustPointInPolygon(polygon, [1.5, 2]), 0);
        assert.equal(inside.robustPointInPolygon(polygon, [1.5, 2.2]), 1);
        assert.equal(inside.robustPointInPolygon(polygon, [3, 5]), 1);
        assert.equal(inside.robustPointInPolygon(polygon, [1.5, 2]), 0);
    });
});
