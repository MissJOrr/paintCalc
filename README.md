# paintCalc
paintApi.js integrates an API to receive a paint order (in a series of walls, each assigned a paintId, and may or may not contain an array of gaps to be omitted) such as the Example Request body below, and returns a report of litres and price for each paint. Paintersv2.js is a previous iteration of the program which used CLI to get the number of walls, wall and gap dimensions, as well as paint information. A feature found in this earlier version not integrated into the API version is the ability to apply multiple paints (e.g. primer) to the same wall. painters.js is the earliest iteration with little abstraction, error handling, or user validations. 

Example Request body:
{
  "walls": [
    {
      "paintID": 1,
      "height": 5,
      "width": 5,
      "coats": 2,
      "gaps": [
        { "height": 2, "width": 2 },
        { "height": 1, "width": 1 }
      ]
    },
    {
      "paintID": 3,
      "height": 5,
      "width": 3.5,
      "coats": 1,
      "gaps": []
    },
    {
      "paintID": 5,
      "height": 5,
      "width": 5,
      "coats": 1,
      "gaps": []
    }
    
  ]
}

Example Response body:
{
    "message": "Paint volume & cost calculation findings",
    "orderSummary": [
        {
            "paintID": 1,
            "paintName": "Yellow satin (Dulux)",
            "litresNeeded": 8,
            "costInGBP": "70.72"
        },
        {
            "paintID": 3,
            "paintName": "Orange satin (Rustoleum)",
            "litresNeeded": 3,
            "costInGBP": "20.79"
        },
        {
            "paintID": 5,
            "paintName": "Mauv gloss (Dulux)",
            "litresNeeded": 3,
            "costInGBP": "26.85"
        }
    ],
    "totalCost": "£118.36"
}

Sample values of paints
[
    {
        "id": 1,
        "color": "Aquamarine",
        "brand": "Valspar",
        "finish": "satin",
        "coverage": 10,
        "costPerLitre": 5.98
    },
    {
        "id": 2,
        "color": "Purple",
        "brand": "Valspar",
        "finish": "matte",
        "coverage": 19,
        "costPerLitre": 9.54
    },
    {
        "id": 3,
        "color": "Green",
        "brand": "Rustoleum",
        "finish": "eggshell",
        "coverage": 14,
        "costPerLitre": 10.78
    },
    {
        "id": 4,
        "color": "Blue",
        "brand": "Farrow & Ball",
        "finish": "gloss",
        "coverage": 15,
        "costPerLitre": 6.56
    },
    {
        "id": 5,
        "color": "Puce",
        "brand": "Farrow & Ball",
        "finish": "satin",
        "coverage": 6,
        "costPerLitre": 14.38
    },
    {
        "id": 6,
        "color": "Blue",
        "brand": "Rustoleum",
        "finish": "gloss",
        "coverage": 5,
        "costPerLitre": 18.04
    },
    {
        "id": 7,
        "color": "Turquoise",
        "brand": "Rustoleum",
        "finish": "matte",
        "coverage": 12,
        "costPerLitre": 6.74
    },
    {
        "id": 8,
        "color": "Mauv",
        "brand": "Dulux",
        "finish": "gloss",
        "coverage": 9,
        "costPerLitre": 5.34
    },
    {
        "id": 9,
        "color": "Violet",
        "brand": "Dulux",
        "finish": "eggshell",
        "coverage": 15,
        "costPerLitre": 19.95
    },
    {
        "id": 10,
        "color": "Khaki",
        "brand": "Rustoleum",
        "finish": "satin",
        "coverage": 16,
        "costPerLitre": 15.82
    }
]
