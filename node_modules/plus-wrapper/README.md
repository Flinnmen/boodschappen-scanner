<div align="center">
  <h1>
    Plus API Wrapper
  </h1>
  </br>
  <p>
    <a href="https://www.npmjs.com/package/plus-wrapper"><img src="https://img.shields.io/npm/v/plus-wrapper" alt="NPM version" /></a>
    <a href="https://github.com/RinseV/plus-wrapper"><img src="https://img.shields.io/npm/l/plus-wrapper" alt="NPM license" /></a>
    <a href="https://www.npmjs.com/package/plus-wrapper"><img src="https://img.shields.io/librariesio/release/npm/plus-wrapper" alt="NPM dependencies"/></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/plus-wrapper/"><img src="https://nodei.co/npm/plus-wrapper.svg" alt="npm installnfo" /></a>
  </p>
</div>

Unofficial Node.js API wrapper for the [Plus](https://www.plus.nl/).

## Installation

```sh
npm install plus-wrapper
```

or

```sh
yarn add plus-wrapper
```

then
```typescript
import { Plus } from 'plus-wrapper';
```

## Basic usage

```typescript
// Creates Plus object, set verbose to true to see all requests
const plus = new Plus({ verbose: true });
// Gets products by name
const products = await plus.product().getProductsFromName('melk');
```

More information about the functions and parameters can be found on the [wiki](https://github.com/RinseV/plus-wrapper/wiki)

## Example usage

For all of these examples, please keep in mind that your function in which you request something should be `async` since the requests return a `Promise`.

#### Product

If I want to find all product names that match a given query:

```typescript
import { Plus } from 'plus-wrapper';

async function findProducts(productName: string) {
    const plus = new Plus();
    const products = await plus.product().getProductsFromName(productName);
    console.log(
        products.items.map((item) => {
            return item.title;
        })
    );
}

findProducts('melk');
```
```sh
[
  'Zuivelmeester Halfvolle melk',
  'PLUS Halfvolle melk',
  'PLUS Halfvolle koffiemelk',
  'Zuivelmeester Halfvolle melk',
  'PLUS Houdbare halfvolle melk',
  'PLUS Houdbare halfvolle melk',
  'Biologisch PLUS Halfvolle melk',
  'Campina Halfvolle melk',
  'Biologisch PLUS Volle melk',
  'Campina Karnemelk',
  'Melkunie Bolletjes vanillevla met crunch',
  'PLUS Houdbare volle melk'
]
```

### Recipe

If I want to find all recipe names that match a given query:

```typescript
import { Plus } from 'plus-wrapper';

async function findRecipes(recipeName: string) {
    const plus = new Plus();
    const recipes = await plus.recipe().getRecipesFromName(recipeName);
    console.log(
        recipes.elements.map((element) => {
            return element.name;
        })
    );
}

findRecipes('lasagne');
```
```sh
[
  'Open lasagne met paddenstoelen, spinazie en ricotta',
  'Vegetarische groentelasagne met spinazie en prei',
  'Vegetarische groentelasagne met geitenkaas',
  'Vegetarische lasagne met spinazie en kaas',
  'Courgette lasagne met rucola',
  'Lasagne met gegrilde aubergine',
  'Lasagne bolognese',
  'Romige lasagne met kip en champignons',
  'Zalmlasagne met courgette, spinazie en roomkaas',
  'Romige lasagne rolletjes met basilicum',
  'Zoete aardappel lasagne met aubergine'
]
```
### Store

If I want to find the name of a store located in a given city:

```typescript
import { Plus } from 'plus-wrapper';

async function findStores(cityName: string) {
    const plus = new Plus();
    const stores = await plus.store().getStores();
    console.log(stores.filter((store) => store.city === cityName)[0]?.name);
}

findStores('Druten');
```
```sh
PLUS Lenssen
```
