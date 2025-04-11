const prompt = require('prompt-sync')();

paintsArray = [];
const defCoverage = 10;

let paintsCount = prompt("How many different paints will be used? ");
const paintnums = paintsCount;
console.log('You are now ADDING PAINT...\n');

// Create an array of paints, to calc the vol of paints across all walls before rounding cans/calculating cost.
// Get name for paint to be references later, get coverage of each paint. 
for(let i=0; i<paintnums; i++) {
    
    paintName = prompt("Provide color or name of paint ");
    console.log("The default paint coverage is calculated using 10.0m2/ L of paint.");
    coverageInput = prompt("Press enter if acceptable, or enter paint coverage in m2/L: ");
        if (coverageInput != 0){
        paintCoverage = coverageInput;
    } else {
        paintCoverage = defCoverage;
        
    }

    let paint = {name: paintName, coverage: Number(paintCoverage), totalVol: 0}
    console.log(paint);
    paintsArray.push(paint)
}
console.log(paintsArray);

console.log('\n');
console.log("*Disclaimer this calculator only calculates rectangular walls*");
console.log("*Doors painted different colors from their wall should be counted as a wall*");
wallsCount = prompt("How many walls?  ");
console.log('You are now ADDING WALLS...\n');

// Get dimensions of walls w||w/o gaps
for(let wall = 0; wall < wallsCount; wall++) {
    console.log(`Dimesions of wall ${wall}`);
    let wallLength = Number(prompt("Wall length (m): ")); 
    let wallWidth = Number(prompt("Wall width (m): ")); 

    //Could be replaced with getArea function for non-rectangles.
    let wallArea = wallLength * wallWidth;
    
    // Prompt user for if there are doors/windows on this walls, Enter 0 if there are none
    // Please no circluar windows, or you will be defenistrated. 
    gapAreaTotal = 0;
    console.log('\n');
    gaps = prompt("How many doors/windows/gaps are on this wall not to be painted? If none, enter 0 ");
    if (gaps != 0){
        for(let gap = 0; gap < gaps; gap++){
            let gapLength = Number(prompt("Gap length (m): ")); 
            let gapWidth = Number(prompt("Gap width (m): ")); 
            gapArea = gapLength * gapWidth;
            gapAreaTotal -= gapArea;
        }
    }

    // Prompt user for how many coats of paint on this wall, default is 1
    let coats = Number(prompt("How many coats on this wall: "));
    wallTotal = (wallArea - gapAreaTotal) * coats

    
    // Prompt for number of paint to add volume to that paints total volume. 
    console.log('Applying wall to paints\n');
    console.log("Here are your paints")
    console.log(paintsArray);

    paintSelected = false;
    // Paint Selection per wall
    for (let paint of paintsArray) {
            console.log("Displaying paint info");
            console.log(paint);
            paintSelection = Number(prompt("Apply this paint to the wall? Enter 1 for yes, or 0 for other paint "));
            if (paintSelection == 1) {
                let wallVol= wallTotal / paint.coverage;
                paint.totalVol += wallVol;
                paintSelected = true;
                console.log(paint);
            }
    }
      
}

/* Display all paint names, volumes of paint
   Prompt for paint volume denominations (1L, 5L) & price
*/
let totalCost = 0;
console.log('Calculating Paint Costs\n');
for (const paint of paintsArray) {
    console.log(paint.name);
    console.log(paint.totalVol +  "L of paint will be needed.");
    denomination = Number(prompt("What denomination would you prefer, usually 1 or 5?"));
    cost = Number(prompt(`Cost per ${denomination}L of paint: `));
    const neededVol = Math.ceil(paint.totalVol / denomination);
    paintCost = neededVol * cost;
    
    totalCost += paintCost;
    console.log(`${paintCost} pounds worth of ${paint.name} paint in ${denomination}L buckets.`);
}

console.log(`The total cost of paints is estimated: ${totalCost} pounds`);

