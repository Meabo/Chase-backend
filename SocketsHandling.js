const LocationUtils = require('./utils/point_inside_polygon');


exports = module.exports = function(http)
{
    const googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyA7e9hT7XciYcAf0g0lG4p0kYSGQBcrLrA',
        Promise: Promise
    });

    let io = require('socket.io')(http);
    let send_location_interval;
    let current_loc;
    let polygon_area;
    let center;

    function new_loc(current_position, meters_lat, meters_long)
    {
        let earth = 6378.137,  //radius of the earth in kilometer
            pi = Math.PI,
            m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

        let new_latitude = current_position.lat + (meters_lat * m);
        let new_longitude = current_position.lng + (meters_long * m) /
            Math.cos(current_position.lat * (pi / 180));


        let loc = {
            lat: new_latitude, lng: new_longitude
        };

        return loc;
    }

    function PushMovements(current_position)
    {
        /* Position guide **  X, -X : TOP / X, X = RIGHT / -X, -X = LEFT / -X, X = BOT */
        let value = getRandomValue();
        let value1 = getRandomValue();
        current_loc = new_loc(current_position, value, value1);
        return current_loc;
    }
    function getRandomValue()
    {
        let random_number = (Math.random() * 20) - 10;
        //console.log(random_number);
        return random_number;

    }
    function SendFakeData(socket)
    {
        let begin_here = {lat: 48.8556475, lng: 2.2986304};
        socket.emit("send_begin_position", begin_here);
        current_loc = begin_here;
        send_location_interval =  setInterval(function()
        {
            PushMovements(current_loc);
            console.log(CoordinatesXY(current_loc.lat, current_loc.lng));
            InsideOrOutsideChecker();
            socket.emit("movement", current_loc);
        }, 2000) // Every 2 seconds
    }


    //Todo
    function calculate_shortest_path(socket)
    {
            console.log(current_loc);
            googleMapsClient.directions
            ({
                origin: current_loc,
                destination: center,
                mode: 'walking',
            })
            .asPromise()
            .then((response) =>
            {
                //gconsole.log(response.json.routes[0]);
               socket.emit('get_polyline', response.json.routes[0].overview_polyline);
            })
            .catch((err) =>
            {
                console.log(err);
            })

    }

    function CoordinatesXY(lat, lng)
    {
        let TILE_SIZE = 256;
        let scale = 1 << 20;

        let siny = Math.sin(lat * Math.PI / 180);
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);

        let x = TILE_SIZE * (0.5 + lng / 360);
        let y = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));


        let tile_x = Math.floor(x * scale / TILE_SIZE);
        let tile_y = Math.floor(y * scale / TILE_SIZE);

        return [tile_x, tile_y];
    }

    function GoBackToCenter()
    {
        current_loc = center;
    }

    function StopMoving()
    {
        clearInterval(send_location_interval);
    }


    function InsideOrOutsideChecker()
    {
        const result = LocationUtils.robustPointInPolygon(polygon_area, [current_loc.lat, current_loc.lng]);
        switch(result)
        {
            case -1:
                break;
            case 1:
                console.log('outside');
                GoBackToCenter();
                break;
            case 0:
                console.log('on the limit');
                break;
        }
    }

    function getPolygonArea(area)
    {
        let top_left = [area[0].lat, area[0].lng];
        let top_right = [area[1].lat, area[1].lng];
        let bot_left = [area[2].lat, area[2].lng];
        let bot_right = [area[3].lat, area[3].lng];

        let bounds = [top_left, top_right, bot_left, bot_right];
        return bounds;
    }

    io.on('connection', function(socket)
    {

        console.log('a user connected');
        socket.emit('hello', "Hello Map!");
        center = {lat: 48.8556475, lng: 2.2986304};
        let area = [
                {
                    lat:48.8569443, lng:2.2940138
                },
                {
                    lat:48.8586221,lng:2.2963717
                },
                {
                    lat:48.8539637,lng:2.3035665
                },
                {
                    lat:48.8523546,lng:2.3012814
                },
                {
                    lat:48.8569443,lng:2.2940138
                }
            ];
        polygon_area =  getPolygonArea(area);
        let params = {
            center: center,
            area: area
        };

        socket.emit('get_map', params);
        SendFakeData(socket);

        socket.on('stopmoving', function(data)
        {
            console.log('Stop moving');
            StopMoving();
        });

        socket.on('calculate_shortest_path', function(data)
        {
            console.log('Calculate shortest');
            calculate_shortest_path(socket);
        })
    });

}
