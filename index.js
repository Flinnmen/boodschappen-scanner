
const express = require("express");
const mysql = require('mysql-await');
//Morgan logs every incoming request/response for us
const morgan = require("morgan");
const app = express();
var products
const port = 3000;

boodschap = "witte rijst"

fetch("https://raw.githubusercontent.com/supermarkt/checkjebon/main/data/supermarkets.json")
  .then(response => response.json())
  .then(json => JsonVar(json));

async function JsonVar(json) {
  products = json
  for (let i = 0; i < products.length; i++) {
    let searchProduct = await search(boodschap, i)
    //console.log(product)
    let product = products[i].d.find(x => x.n === searchProduct);
    if (product){
      console.log(searchProduct + " " + product.p + " " + product.s + " " + products[i].n)
    } else {
      console.log("bestaat niet " + products[i].n)
    }
  }
}

//ChatGPT
async function search(searchString, i) {
  searchString = searchString.toLowerCase()
  let searchWords = searchString.split(" ");
  let bestMatch = "";
  let bestProduct = "";
  let bestScore = 0;
  for (let j = 0; j < products[i].d.length; j++) {
    let score = 0;
    let productName = products[i].d[j].n.toLowerCase();
    let productWords = productName.split(" ");
    for (let k = 0; k < searchWords.length; k++) {
      for (let l = 0; l < productWords.length; l++) {
        if (productWords[l].includes(searchWords[k])) {
          score++
          break;
        }
      }
    }
    if (score > bestScore) {
      bestMatch = products[i].d[j].n;
      bestProduct = products[i].d.find(x => x.n === bestMatch)
      bestScore = score
    } else if (score === bestScore && bestProduct.p > products[i].d[j].p) { //kijkt of het product goedkoper is
      bestMatch = products[i].d[j].n
      bestProduct = products[i].d.find(x => x.n === bestMatch)
    }
  }
  return bestMatch
}

app.use(express.json());
app.use(morgan("common"));
app.use(express.static("public"));

let connection = mysql.createPool({
  host: 'sql147.main-hosting.eu',
  user: 'u378807222_login',
  password: 'Login2022?!',
  database: 'u378807222_login'
});

function optellen(a, b) {
  return parseInt(a) + parseInt(b)
}

app.post("/api/optellen", async (req, res) => {
  // Data van request ophalen
  let { a, b } = req.body;

  // Database query uitvoeren 
  let naamTabel = 'users'
  let naamKolom = 'username'
  let query = `SELECT * FROM ${naamTabel} WHERE ${naamKolom} = ?`;
  let username = 'test'
  let databaseResult = await connection.awaitQuery(query, username,
    function(error, results) {
      if (error) {
        throw error
      };
    });

  // Data uitlezen en string maken
  strDatabaseResult = JSON.stringify(databaseResult)

  // Data terugsturen (result)
  res.send({
    message: `${a} + ${b} = ${optellen(a, b)} en database: ${strDatabaseResult}`,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});