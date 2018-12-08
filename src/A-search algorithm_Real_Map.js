//const LocationUtils = require('./utils/point_inside_polygon');
const {performance} = require('perf_hooks');



class AstarAlgorithm
{
    constructor(min_row, min_col, max_row, max_col)
    {
        //this.grid = grid;
        this.min_row = min_row;
        this.min_col = min_col;
        this.max_row = max_row;
        this.max_col = max_col;

        this.cell_details = [];
        this.closed_list = [];
        this.open_list = new Map();
        this.result = [];
        this.destination_found = false;
    }

    isValid(row, col)
    {
        //Is inside ? Need impl with real algo
        //
        //console.log('Row and Col', row, col, this.min_row, this.min_col, this.max_row, this.max_col);

        //const result = LocationUtils.robustPointInPolygon(polygon_area, [current_loc.lat, current_loc.lng]);

        return (row >= this.min_row) && (row < this.max_row) &&
            (col >= this.min_col) && (col < this.max_col);
    }

    isUnBlocked(row, col)
    {
        // Returns true if the cell is not blocked else false
        //console.log(this.grid);
       return true;

    }

    isDestination(x, y, destination)
    {
        return (x === destination.x && y === destination.y);
    }

    calculateHeuristicValue(x, y, destination)
    {
        let hypothenus = Math.sqrt((x - destination.x)**2 + (y - destination.y) ** 2);
       // console.log('Hypothenus ', hypothenus);
        return hypothenus;
    }

    get_final_result()
    {
        return this.result;
    }
    initArray()
    {
        /*let cell_details = [];
        console.log(this.row, this.col);

        for (let i = 0;  i < this.row ; i++)
        {
            for (let j = 0;  j < this.col; j++)
            {
                cell_details[i][j] = new Cell(-1, -1, Number.MAX_SAFE_INTEGER);
                console.log(cell_details);
            }

        }*/
        let matrix_test = [];

        for (let i = this.min_row; i < this.max_row; i++)
        {
            matrix_test[i] = [];

            for (let j = this.min_col; j < this.max_col; j++)
            {
                matrix_test[i][j] = new Cell(-1, -1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            }
        }

       /* let matrix = new Array(this.max_row).fill(1).map(() => new Array(this.max_col).fill(new Cell(-1, -1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)));
        return matrix;*/

       return matrix_test;
    }


    initArrayClosed()
    {


        let matrix_test = [];

        for (let i = this.min_row; i < this.max_row; i++)
        {
            matrix_test[i] = [];

            for (let j = this.min_col; j < this.max_col; j++)
            {
                matrix_test[i][j] = false;
            }
        }

        //let matrix = new Array(this.max_row).fill(false).map(() => new Array(this.max_col).fill(false));
        return matrix_test;
    }

    async update_neightbor(current_x, current_y, prev_x, prev_y, src, dest, value)
    {
        if (this.isValid(current_x, current_y) === true)
        {
            //console.log('Valid Cell', current_x, current_y, dest);
            if (this.isDestination(current_x, current_y, dest))
            {
                // We found the destination
                console.log('Destination found');
                console.log('Current x & Current y', current_x, current_y);
                console.log('Parent x & Parent y ', prev_x, prev_y);
                this.cell_details[current_x][current_y].set_parent_x(prev_x);
                this.cell_details[current_x][current_y].set_parent_y(prev_y);
                this.destination_found = true;
               // this.displaylist(this.cell_details);
                //this.trace_path(src, dest);
                return true;
            }
            else if (this.closed_list[current_x][current_y] === false && this.isUnBlocked(current_x, current_y) === true)
            {
                let new_g = this.cell_details[prev_x][prev_y].get_g() + value;
                let new_h = this.calculateHeuristicValue(current_x, current_y, dest);
                let new_f = new_g + new_h;

                if ((this.cell_details[current_x][current_y]).get_f() === Number.MAX_SAFE_INTEGER ||
                    (this.cell_details[current_x][current_y]).get_f() > new_f)
                {
                    //console.log('Entered here');
                    // We add the list in the open_list
                    this.open_list.set([current_x, current_y], new_f);
                    // We update the cell
                    (this.cell_details[current_x][current_y]).updateCell(prev_x, prev_y, new_g, new_h, new_f);
                }
            }
        }
        else
        {
            //console.log('Not valid cell');
            //console.log("\n");
            return false;
        }
        return false;
    }

    trace_path(src, dest)
    {
        console.log("\nPath is ");
        let queue = [];
        let dest_x = dest.x;
        let dest_y = dest.y;

        let src_x = src.x;
        let src_y = src.y;

       // queue.push([dest_x, dest_y]);
        while (!(dest_x === src_x && dest_y === src_y))
        {
                queue.push([dest_x, dest_y]);
                let temp_x = (this.cell_details[dest_x][dest_y]).get_parent_x();
                let temp_y = this.cell_details[dest_x][dest_y].get_parent_y();
                dest_x = temp_x;
                dest_y = temp_y;
        }
        queue.push([dest_x, dest_y]);

        //console.log(x, y)
        // We push the source
        this.result = [...queue];
        while (queue.length > 0)
        {
            let position = queue.pop();
            console.log("-> ", position[0], position[1]);
        }
        //console.log('finished');
    }

    async visit_neighbors(x, y, src, dest)
    {
        let result = false;

        //console.log('Visiting Neighbors', x, y);
        // Four directions (North, South, East, West)




        result =  await this.update_neightbor(x - 1, y, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        result =  await this.update_neightbor(x + 1, y, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        result = await this.update_neightbor(x, y - 1, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        result = await this.update_neightbor(x, y + 1, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        // Diagonals
        result =  await this.update_neightbor(x - 1, y + 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;

        result = await this.update_neightbor(x + 1, y + 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;

        result =  await this.update_neightbor(x - 1, y - 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;

        result =  await this.update_neightbor(x + 1, y - 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;



    }

    displaylist(array_)
    {
        for (let i = this.min_row; i < this.max_row; i++)
        {
            for (let j = this.min_col; j < this.max_col; j++)
            {
                console.log('Cell Details', i, j, array_[i][j]);
            }
        }
    }

    require_checking(src, dest)
    {
        if (this.isValid(src.x, src.y) === false)
        {
            console.log("Source is invalid");
            return false;
        }

        if (this.isValid(dest.x, dest.y) === false)
        {
            console.log("Destination is invalid");
            return false;
        }


        if (this.isUnBlocked(src.x, src.y) === false ||
            this.isUnBlocked(dest.x, dest.y) === false )
        {
            console.log("Source or Destination is blocked");
            return false;
        }


        if (this.isDestination(src.x, src.y, dest) === true)
        {
            console.log("We already in destination");
            return false;
        }

    }


     async AstarSearch(source, destination)
    {
        //console.log(this.isUnBlocked(destination.x, destination.y));
        if (this.require_checking(source, destination) === false)
            return;

        this.cell_details = this.initArray();
        this.closed_list = this.initArrayClosed();


        // Initialisation of the source
        //console.log(this.cell_details[0]);
        this.cell_details[source.x][source.y] = new Cell(source.x, source.y, 0.0, 0.0, 0.0);

        // Adding the starting cell in the Open List
        this.open_list.set([source.x, source.y], 0);
        //console.log('Open list Size ', this.open_list.size);
        while (this.open_list.size > 0)
        {
            let first_entry = this.open_list.entries().next();
            //console.log('Current Open List', this.open_list.entries());
            this.open_list.delete(first_entry.value[0]);

            let first_entry_values = first_entry.value[0];
            let first_entry_x = first_entry_values[0];
            let first_entry_y = first_entry_values[1];
            this.closed_list[first_entry_x][first_entry_y] = true;

            // Now, we need to check 8 next neighbors
           let result =  await this.visit_neighbors(first_entry_x, first_entry_y, source, destination);
           if (result === true)
           {

               //console.log('Destination Found');
               //this.displaylist(this.cell_details);

               return true;
           }

        }
        //this.displaylist(this.cell_details);


        if (this.destination_found === false)
            console.log('Failed to find the Destination Cell');

    }

}

class Cell
{

    constructor(parent_x, parent_y, g, h, f) {
        this.parent_x = parent_x;
        this.parent_y = parent_y;
        this.g = g;
        this.h = h;
        this.f = f;
    }

    updateCell(prev_x, prev_y, g, h, f)
    {
        this.parent_x = prev_x;
        this.parent_y = prev_y;
        this.g = g;
        this.h = h;
        this.f = f;
    }
    set_parent_x(parent_x)
    {
        this.parent_x = parent_x;
    }

    set_parent_y(parent_y)
    {
        this.parent_y = parent_y;
    }

    get_parent_x()
    {
        return this.parent_x;
    }

    get_parent_y()
    {
        return this.parent_y;
    }

    get_g()
    {
        return this.g;
    }


    get_f()
    {
        return this.f;
    }

}


function getPolygonArea(area)
{
    let top_left = [area[0].lat, area[0].lng];
    let top_right = [area[1].lat, area[1].lng];
    let bot_left = [area[2].lat, area[2].lng];
    let bot_right = [area[3].lat, area[3].lng];

    let bounds = [CoordinatesXY(top_left[0], top_left[1]),
        CoordinatesXY(top_right[0], top_right[1]),
        CoordinatesXY(bot_left[0], bot_left[1]),
        CoordinatesXY(bot_right[0], bot_right[1])];

   /* console.log(CoordinatesXY(top_left[0], top_left[1]));
    console.log(CoordinatesXY(top_right[0], top_right[1]));
    console.log(CoordinatesXY(bot_left[0], bot_left[1]));
    console.log(CoordinatesXY(bot_right[0], bot_right[1]));*/
    return bounds;
}



function CoordinatesXY(lat, lng)
{
    let factor = 25;
    let TILE_SIZE = 256;
    let scale = 1 << 20;

    let siny = Math.sin(lat * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    let x = TILE_SIZE * (0.5 + lng / 360);
    let y = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));


    let tile_x = Math.floor(x * scale / factor);
    let tile_y = Math.floor(y * scale / factor);

    return [tile_x, tile_y];
}

let area = [
    {
        //trocadero
        lat:48.8631503, lng:2.2864126
    },
    {
        //alma marceau
        lat:48.8646175, lng:2.3010568
    },
    {
        //Emile Zola
        lat:48.8469874, lng:2.2951146
    },
    {
        //Sevres Lecourbe
        lat:48.8456454, lng:2.3092419
    }
];

async function Astar()
{

    let center = {lat: 48.857206, lng: 2.2946687};
    let coordinates_src = CoordinatesXY(center.lat, center.lng);
    let random_point_inside = {lat:48.8501335, lng:2.2996423};
    let coordinates_dest = CoordinatesXY(random_point_inside.lat, random_point_inside.lng);

    let src = {x: coordinates_src[0], y:coordinates_src[1]};
    let dest = {x: coordinates_dest[0], y:coordinates_dest[1]};
    let bounds = getPolygonArea(area);


   console.log('Source', src);
    console.log('Destination', dest);
    console.log('Bounds', bounds);

   /* let grid = [
        [1, 1, 0, 1, 0],
        [1, 0, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 1],
        [1, 1, 1, 0, 1],
    ];*/

    let astar = new AstarAlgorithm(bounds[0][0], bounds[1][1], bounds[3][0], bounds[3][1]);
    //console.log(astar.grid);
    let t0 = performance.now();
    await astar.AstarSearch(src, dest);
    console.log(astar.trace_path(src, dest))
    console.log('Number Steps', astar.get_final_result().length);
    let t1 = performance.now();
    console.log("Perfomance : A* Algorithm took " + (t1 - t0) + " milliseconds.");

    //original_coordinates();
}

function original_coordinates(result)
{
    console.log(result);
    let original = [];
    for (let i = 0; i < result.length; i++)
    {
        //console.log('Result', result[i][0]);
        let values = result[i];
        let val_x = values[0] + 530000;
        let val_y = values[1] + 360000;
        original.push([val_x, val_y]);
    }
    console.log(original);
}

function modulo_10(value)
{

    console.log(value%1000);
}

//modulo_10(530983)

Astar();