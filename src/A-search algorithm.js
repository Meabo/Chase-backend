class AstarAlgorithm
{
    constructor(grid, row, col)
    {
        this.grid = grid;
        this.row = row;
        this.col = col;
        this.cell_details = [];
        this.closed_list = [];
        this.open_list = new Map();
        this.destination_found = false;
    }

    isValid(row, col)
    {
        //Is inside ? Need impl with real algo
        //
        //console.log('Row and Col', row, col, this.row, this.col);
        return (row >= 0) && (row < this.row) &&
            (col >= 0) && (col < this.col);
    }

    isUnBlocked(row, col)
    {
        // Returns true if the cell is not blocked else false
        //console.log(this.grid);
       if (this.grid[row][col] === 1)
       {
           return true;
       }
       else
           return false;

    }

    isDestination(x, y, destination)
    {
        return (x === destination.x && y === destination.y);
    }

    calculateHeuristicValue(x, y, destination)
    {
        let hypothenus = Math.sqrt((x - destination.x)**2 + (y - destination.y) ** 2);
        console.log('Hypothenus ', hypothenus);
        return hypothenus;
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

        let matrix = new Array(this.row).fill(1).map(() => new Array(this.col).fill(new Cell(-1, -1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)));
        return matrix;
    }


    initArrayClosed()
    {
        let matrix = new Array(this.row).fill(false).map(() => new Array(this.col).fill(false));
        return matrix;
    }

     update_neightbor(current_x, current_y, prev_x, prev_y, src, dest, value)
    {
        if (this.isValid(current_x, current_y) === true)
        {
            console.log('Valid Cell', current_x, current_y, dest);
            if (this.isDestination(current_x, current_y, dest))
            {
                // We found the destination
                console.log('Destination found');
                console.log('Current x & Current y', current_x, current_y);
                console.log('Parent x & Parent y ', prev_x, prev_y);
                this.cell_details[current_x][current_y].set_parent_x(prev_x);
                this.cell_details[current_x][current_y].set_parent_y(prev_y);
                this.destination_found = true;
                this.displaylist(this.cell_details);
                this.trace_path(src, dest);
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
                    console.log('Entered here');
                    // We add the list in the open_list
                    this.open_list.set([current_x, current_y], new_f);
                    // We update the cell
                    this.cell_details[current_x][current_y] = new Cell(prev_x, prev_y, new_g, new_h, new_f);
                }
            }
        }
        else
        {
            console.log('Not valid cell');
            console.log("\n");
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

        while (queue.length > 0)
        {
            let position = queue.pop();
            console.log("-> ", position[0], position[1]);
        }
    }

    visit_neighbors(x, y, src, dest)
    {
        let result = false;

        console.log('Visiting Neighbors', x, y);
        // Four directions (North, South, East, West)
        result =  this.update_neightbor(x - 1, y, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        result =  this.update_neightbor(x + 1, y, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        result =  this.update_neightbor(x, y - 1, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        result =  this.update_neightbor(x, y + 1, x, y, src, dest, 1.0);
        if (result === true)
            return true;

        // Diagonals
        result =   this.update_neightbor(x - 1, y + 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;

        result =   this.update_neightbor(x + 1, y + 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;

        result =   this.update_neightbor(x - 1, y - 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;

        result =   this.update_neightbor(x + 1, y - 1, x, y, src, dest, Math.sqrt(2));
        if (result === true)
            return true;

    }

    displaylist(array_)
    {
        for (let i = 0; i < this.row; i++)
        {
            for (let j = 0; j < this.col; j++)
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


     AstarSearch(source, destination)
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
            console.log('Current Open List', this.open_list.entries());
            this.open_list.delete(first_entry.value[0]);

            let first_entry_values = first_entry.value[0];
            let first_entry_x = first_entry_values[0];
            let first_entry_y = first_entry_values[1];
            this.closed_list[first_entry_x][first_entry_y] = true;

            // Now, we need to check 8 next neighbors
           let result =  this.visit_neighbors(first_entry_x, first_entry_y, source, destination);
           if (result === true)
           {

               //console.log('Destination Found');
               this.displaylist(this.cell_details);

               return true;
           }

        }
        this.displaylist(this.cell_details);


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


function Astar()
{
    let src = {x:0, y:0};
    let dest = {x: 4, y:4};

    let grid = [
        [1, 1, 0, 1, 0],
        [1, 0, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 1],
        [1, 1, 1, 0, 1],
    ];

    let astar = new AstarAlgorithm(grid, 5, 5);
    console.log(astar.grid);
    astar.AstarSearch(src, dest);
}

Astar();