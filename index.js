
const express = require("express");
const mysql = require('mysql-await');
//Morgan logs every incoming request/response for us
const morgan = require("morgan");
const app = express();
var products
const port = 3000;

//boodschappenlijst = "kaas"

console.log("test")

function fetchJson(boodschappenlijst){
  fetch("https://raw.githubusercontent.com/supermarkt/checkjebon/main/data/supermarkets.json")
    .then(response => response.json())
    .then(json => JsonVar(json, boodschappenlijst));
}

async function JsonVar(json, boodschappenlijst) {
  boodschappen = boodschappenlijst.split(',')
  products = json
  let resultJson = {}
  let sortedData = {}
  for (let x = 0; x < boodschappen.length; x++){
    resultJson[x] = {}
    for (let i = 0; i < products.length; i++) {
      let result = await search(boodschappen[x], i)
      //console.log(product)
      let product = products[i].d.find(x => x.n === result.bestMatch);
      //console.log(product)
      resultJson 
      if (product){
        resultJson[x][product.n] = {
          p: product.p, 
          s: product.s, 
          prijsPerHoeveelheid: result.prijsPerHoeveelheid, 
          PPH: result.pph,
          markt: products[i].n
        }
      } else {
        console.log("bestaat niet " + products[i].n)
      }
    }
    sortedData[x] = Object.entries(resultJson[x]) //sorteert de json en zet de laagste pph bovenaan
          .sort(([,a], [,b]) => a.PPH - b.PPH)
          .reduce((obj, [key, value]) => ({...obj, [key]: value}), {});
    console.log(sortedData)
    console.log(Object.keys(sortedData[x]))
  } 
  getTop(sortedData)
}

function getTop(data){
  let output = ""
  for (let x = 0; x < Object.keys(data).length; x++) {
    arr = Object.keys(data[x])
    top3 = arr.slice(0, 3)
    for (let y = 0; y < 3; y++) {
      output += data[x][top3[y]].markt
    }
  }
  console.log(output)
}

function convertUnits(input) {
  input = input.toLowerCase()

  if (!input.match(/\d+/g) || !input.match(/[a-zA-Z]+/g)) {
    // return the input string unmodified if it doesn't match the expected pattern
    return input;
  }
  
  const amount = parseFloat(input.match(/[+-]?\d+(\.\d+|\,\d+)?/)[0]);
  const unit = input.replace(/\d+|\s+/g, '').match(/\w+/).join(' ');

  let convertedAmount;
  let convertedUnit;
  
  switch (true) {
    case unit.includes('g'):
    case unit.includes('gr'):
    case unit.includes('gram'):
      convertedAmount = amount / 1000;
      convertedUnit = 'kg';
      break;
    case unit.includes('ml'):
    case unit.includes('milliliter'):
      convertedAmount = amount / 1000;
      convertedUnit = 'L';
      break;
    case unit.includes('cl'):
    case unit.includes('centiliter'):
      convertedAmount = amount / 100
      convertedUnit = 'L';
      break;
    default:
      convertedAmount = amount;
      convertedUnit = unit;
  }
  return (`${convertedAmount} ${convertedUnit}`)
}

//ChatGPT
async function search(searchString, i) {
  searchString = searchString.toLowerCase()
  let searchWords = searchString.split(" ");
  let bestMatch = "";
  let bestScore = 0;
  let bestUnit = "";
  let bestPPH = 0
  let PPH = 0;
  for (let j = 0; j < products[i].d.length; j++) {
    let score = 0;
    let productName = products[i].d[j].n.toLowerCase();
    let productWords = productName.split(" ");
    for (let k = 0; k < searchWords.length; k++) {
      for (let l = 0; l < productWords.length; l++) {
        let verschilWoord = productWords[l].length - searchWords[k].length
        if (productWords[l].includes(searchWords[k]) && (verschilWoord >= -3 && verschilWoord <= 3) ) {
          score++
          break;
        }
      }
    }
    score = score / productWords.length
    let converted = convertUnits(products[i].d[j].s) 
    if (converted.match(/\d+/g) && !(converted === products[i].d[j].s)){
      PPH = products[i].d[j].p / parseFloat(converted.match(/[+-]?\d+(\.\d+)?/)[0]);
    } //else {
      //PPH = products[i].d[j].p //meta om dit weg te halen?
    //}
    if (score > bestScore) { //moet converted instaan zodat hij niet producten checkt die niet overeenkomen (heb ik eruit gehaald, weet nog niet of dat meta is)
      bestMatch = products[i].d[j].n;
      bestProduct = products[i].d.find(x => x.n === bestMatch)
      bestScore = score
      bestPPH = PPH
      bestUnit = converted.match(/[a-zA-Z]+/g)
    } else if (score === bestScore && bestPPH > PPH) { //kijkt of het product goedkoper is
      bestPPH = PPH
      bestUnit = converted.match(/[a-zA-Z]+/g)
      bestMatch = products[i].d[j].n
      bestProduct = products[i].d.find(x => x.n === bestMatch)
    }
  }
  return {
    bestMatch: bestMatch,
    prijsPerHoeveelheid: `${bestPPH} euro per ${bestUnit}`,
    pph: bestPPH
  };
}

app.use(express.json());
app.use(morgan("common"));
app.use(express.static("public"));
//app.set("view engine", "ejs");

app.post("/api", async (req, res) => {
  console.log(req.body.a)
  fetchJson(req.body.a)
});

/*app.get("/", function(req, res){
  res.render("index")
})*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});