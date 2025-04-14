import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

/*
app.get("/paints", async (req, res) => {
    try {
        const paints = await getPaints();
        console.log("app.get paints ran");

        const finish = req.query.finish;
        if (!finish) {
            res.json(paints);
        } else {
            const filtered = paints.filter(paint => paint._name.toLowerCase().includes(finish.toLowerCase()));
            res.json(filtered);
        }
    } catch (error) {
        console.error("Error in /paints route:", error.message || error);
        res.status(500).json({ error: "Failed to fetch paints" });
    }
});
*/

class Paint {
    _code;
    _name;
    _coverage;
    _costPerL;
    _volume = 0;

    constructor(code, paintName, coverageRate, cost) {
        this._code = code;
        this._name = paintName;
        this._coverage = coverageRate;
        this._costPerL = cost;
    }

    displayPaint() {
        console.log(`Color: ${this._name} Coverage: ${this._coverage} m2/L Cost: £${this._costPerL}/L`);
    }

    needVol(neededVol) {
        this._volume += neededVol;
    }

    getVol(){
        return this._volume;
    }

    getCost(){
        return this._costPerL;
    }
}
class Wall {
    _paintID;
    _height;
    _width;
    _area;
    _coats;
    gaps;

    constructor(paintID, height, width, coats, gaps) {
        this._paintID = paintID;
        this._height = Math.max(0,height);
        this._width = Math.max(0,width);
        this._area = this._height * this._width;
        this._coats = coats;
        this.gaps = gaps;
    }

    removeGaps() {
        for(const gap of this.gaps){
            const gapArea = Math.max(0,gap.height) * Math.max(0,gap.width);
            
            if (gap.height > this._height || gap.width > this._width) {
                console.log("A gap is larger than the wall height or width. This gap has been ignored.");
                continue;
            }

            if(gapArea < this._area){
                this._area -= gapArea;
            } else {
                console.log("You have entered a gap larger than the remaining wall, these measures have been ignored.");
            }
        }
    }

    getAreaSingleCoat() {
        return this._area;
    }

    getAreaAllCoats() {
        return this._area * this._coats;
    }
}
async function getPaints() {
    const url = "https://my.api.mockaroo.com/paints";
    const headers = {
        "X-API-Key": "6c8c1e30"
    };

    const response = await fetch(url, { headers });
    //console.log(response);
    //console.log(response.body);
    
    const paintsJson = await response.json();
    //console.log(paintsJson);
    const paintsArray = [];
    for(let paintItem of paintsJson){
        const paintName = `${paintItem.color} ${paintItem.finish} (${paintItem.brand})`
        let paint = new Paint(paintItem["id"], paintName, paintItem["coverage"], paintItem["costPerLitre"]);
        paintsArray.push(paint)
    }
    //console.log(paintsArray);
    return paintsArray;
}

function getOrder(order) {
    const walls = [];

    if (!order || !Array.isArray(order.walls)){
        throw new Error("Invalid order format: missing walls array");
    
    }

    for (const wallInfo of order.walls) {
        const {paintID, coats, height, width, gaps} = wallInfo;

        if (!Array.isArray(gaps)) {
            console.warn(`Invalid gaps type, ignoring ${wallInfo}`);
            continue;
        } else if (typeof paintID !== "number" || typeof coats !== "number" || typeof height !== "number" || typeof width !== "number"){
            console.warn(`Invalid type, mising some numbers, ignoring ${wallInfo}`);
            continue;
        }

        const wall = new Wall(paintID, height, width, coats, gaps);
        walls.push(wall);
    }
    return walls;
}

function getVolumes(paints, walls){
    for (const wall of walls) {
        wall.removeGaps();
        const chosenPaint = paints.find(p => p._code === wall._paintID);
    
        if(!chosenPaint) {
            console.warn(`No matching paint for paintID ${wall._paintID}`);
            continue;
        }
    
        const neededVol = wall.getAreaAllCoats() / chosenPaint._coverage;
        chosenPaint.needVol(neededVol);
    
    }
    return paints;
}

app.post("/calculate", async (req, res) => {
    try {
        const order = req.body;
        
        const paints = await getPaints();
        console.log("getPaints completed");
        const walls = getOrder(order);
        console.log("getOrder completed");
        const paintsWithVolumes = getVolumes(paints, walls);
        console.log("getVolumes completed");
        const paintReport = []
        let totalCost = 0;
    
        for (const paint of paintsWithVolumes) {
            const minL = Math.ceil(paint._volume);
            const cost = (minL * paint.getCost()).toFixed(2);
            
            if (minL > 0) {
                paintReport.push({
                    paintID: paint._code,
                    paintName: paint._name,
                    litresNeeded: minL,
                    costInGBP: cost
                });
                totalCost += parseFloat(cost);
            }

             
        }

        res.json({
            message: "Paint volume & cost calculation findings",
            orderSummary: paintReport,
            totalCost: `£${totalCost.toFixed(2)}`
        });

    } catch (error) {
        console.error("Error calculating report:", error.message || error);
        res.status(500).json({ error: "Failed to fetch paint data" });
    }
    
});



