exports = module.exports = function(http)
{
    let io = require('socket.io')(http);

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
        let value = 10;
        let loc = new_loc(current_position, -value, value);
        return loc;
    }

    function SendFakeData(socket)
    {
        let begin_here = {lat: 48.8556475, lng: 2.2986304};
        socket.emit("send_begin_position", begin_here);
        let counter = 0;
        let new_loc = begin_here;
        setInterval(function()
        {
            new_loc = PushMovements(new_loc);
            socket.emit("movement", new_loc);
        }, 2000) // Every 2 seconds


    }


    io.on('connection', function(socket)
    {
        console.log('a user connected');
        socket.emit('hello', "Hello Map!");
        let center = {lat: 48.8556475, lng: 2.2986304};
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
        let params = {
            center: center,
            area: area
        };

        socket.emit('get_map', params);
        SendFakeData(socket);
    });

}
