const prompt = require('prompt-sync')();

paintsArray = [];
const defCoverage = 10;

function needPosInput(promptText, min){
    let variable = Number(prompt(promptText));

    while (Number.isNaN(variable) || variable < min || variable > 100) {
        if (Number.isNaN(variable)) {
            console.log("Please enter a **valid number**.");
        } else if (min === 0){ // dimensions can't be negative
            console.log("Need a positive number.");
        } else if (min === 0.1){
            console.log("Need a larger number.");
        } else if (variable > 100){
            console.log("Need a smaller number.");
        }else { //min 1 paint, wall, or coat
            console.log("Need a number of 1 or more.");
        }
        variable = Number(prompt(promptText));
    }

    return variable;
}

class Paint {
    _name;
    _coverage;
    _volume = 0;

    constructor(paintName, coverageRate) {
        this._name = paintName;
        this._coverage = coverageRate;
    }

    displayPaint() {
        return `Color: ${this._name} Coverage: ${this._coverage} m2/L`;
    }

    needVol(neededVol) {
        this._volume += neededVol;
    }
}

class Wall {
    _height;
    _width;
    _area;

    constructor(height, width) {
        this._height = Math.max(0,height);
        this._width = Math.max(0,width);
        this._area = this._height * this._width;
    }

    removeGaps(gaps) {
        for(let gap = 0; gap < gaps; gap++){
            const gapHeight = needPosInput("Gap height (m): ", 0); 
            const gapWidth = needPosInput("Gap width (m): ", 0); 
            const gapArea = Math.max(0,gapHeight) * Math.max(0,gapWidth);
            if(gapArea < this._area){
                this._area -= gapArea;
            } else {
                console.log("You have entered a gap larger than the remaining wall, these measures have been ignored.");
            }
        }
    }

    getArea() {
        return this._area;
    }
}

function getPaintInfo(){
    const paintsCount = needPosInput("How many different paints will be used? ", 1);
    const paintnums = paintsCount;
    console.log('You are now ADDING PAINT...\n');
    
    // Create an array of paints
    // Get name for paint to be references later, get coverage of each paint. 
    for(let i=0; i<paintnums; i++) {
        
        paintName = prompt("Provide color or name of paint ");
        console.log("The default paint coverage is calculated using 10.0m2/ L of paint.");
        coverageInput = needPosInput("Press enter if acceptable, or enter paint coverage in m2/L: ",0);
        if (coverageInput != 0){
            paintCoverage = coverageInput;
        } else {
            paintCoverage = defCoverage; 
        }
    
        let paint = new Paint(paintName, paintCoverage);
        paintsArray.push(paint)
    }
}

function getWallInfo(){
    console.log('\n');
    console.log("*Disclaimer this calculator only calculates rectangular walls*");
    console.log("*Doors painted different colors from their wall should be counted as a wall*");
    wallsCount = needPosInput("How many walls?", 1);
    console.log('You are now ADDING WALLS...\n');
    
    // Get dimensions of walls w||w/o gaps
    for(let wall = 0; wall < wallsCount; wall++) {
        console.log(`Dimesions of wall ${wall}`);
        let wallHeight = needPosInput("Wall height (m): ", 0); 
        let wallWidth = needPosInput("Wall width (m): ", 0); 
    
        //Could be replaced with getArea function for non-rectangles.
        newWall = new Wall(wallHeight, wallWidth);
        
        // Prompt user for if there are doors/windows on this walls, Enter 0 if there are none
        // Please no circluar windows, or you will be defenistrated. 
        console.log('\n');
        gaps = needPosInput("How many doors/windows/gaps are on this wall not to be painted? If none, enter 0 ", 0);
        if (gaps != 0){
            newWall.removeGaps(gaps);
        }
    
        // Prompt for number of paint to add volume to that paints total volume. 
        console.log('Applying wall to paints\n');
            
        paintSelected = false;
        console.log("Displaying paint info");
        for (let paint of paintsArray) {
                console.log(paint.displayPaint());
                paintSelection = Number(prompt("Apply this paint to the wall? Enter 1 for yes, any other input for next paint "));
                if (paintSelection == 1) {
                    let coats = needPosInput("How many coats on this wall: ", 1);
                    let wallVol = (newWall.getArea() * coats) / paint._coverage;
                    console.log(`Calculated ${wallVol}L needed`)
                    paint.needVol(wallVol);
                    paintSelected = true;
                    console.log(paint.displayPaint());

                }
        }
        if (paintSelected === false){
            console.log("You forgot to apply any paints to this wall! It will be omitted.");
        }
          
    }
}

function getCost(){
    let totalCost = 0;
    console.log("\n");
    console.log('Calculating Paint Costs\n');
    for (const paint of paintsArray) {
        console.log(paint.displayPaint());
        console.log(paint._volume +  "L of paint will be needed.");
        denomination = needPosInput("What denomination (in litres) would you prefer, usually 1 or 5? ", 0.1);
        cost = needPosInput(`Cost per ${denomination}L of paint: £`, 0);
        const neededVol = Math.ceil(paint._volume / denomination);
        paintCost = neededVol * cost;
        
        totalCost += paintCost;
        console.log(`£${paintCost} worth of ${paint._name} paint in ${denomination}L buckets.`);
    }

console.log(`The total cost of paints is estimated: £${totalCost}`);
}

function main(){
    getPaintInfo();
    getWallInfo();
    getCost();

}
main();


