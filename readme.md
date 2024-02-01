## Excel Fuel server (typescript)

This is an express.js server for Excel Fuel _(project)_ build in `Typescript` with `Nodemon`, including full rest/api with authentication and route separations: `/api`,`/app`

Features:

    - Express.js
    - Separation of concerns
    - Typescript with models
    - Production ready
    - Linted
    - Rest/api
    - Api Authentication

### Install

Application is fixed to `node@12.0.0` and `npm@6.9.0`, so install `nvm` manager when required.

-   Required global installations: `nodemon`,`typescript (tsc)`, and `esm`

```sh
$/ npm install
```

### Start / build / production

Server starts on port `5000`

-   production ready files are build at` /dist`

```sh
$/ npm run dev:start # development with nodenom
$/ npm run prod:start # build and run in production
$/ npm run build # only build new production files inside /dist
```

### Config

Config settings can be found at `/src/config.ts`

-   includes our user credentials (for demo), and session secret

### Running fullstack application

1. Generate new client build _(follow excel-fuel-app-client readme.md instructions)_
2. Add new build to /views, with the same application name: `/views/excel-fuel`
3. Run fullstack app in development or production modes at `localhost:5000/app`

#### Live Demo

Hosted on heroku node.js server (_server has timeout limit_, free dyno):

```
access:
https://pacific-meadow-55275.herokuapp.com/app
```

#### heroku

You will find a separate file for heroku if providing production only version, so need to rename `package.heroku.json` to `package.json` and follow heroku process instructions.

#### Client app repo

Excel fuel angular app can be found at:

```sh
/$ git clone https://github.com/eag1ex/excel-fuel-app-client
```

### Available API routes:

```sh

## Generate new {token}, with body details: {username,password} (credentials in config.ts)
# (POST) http://localhost:5000/api/auth

## Get all available Excel stations from StaticDB
# (GET) http://localhost:5000/api/excel/stations

## Get all available Excel products from StaticDB
# (GET) http://localhost:5000/api/excel/products

## Create new excel station, providing {ExcelModel}, excluding {created_at,updated_at,id}
## Checks for same latitude/longitude, or address/city
# (POST) http://localhost:5000/api/excel/create/

## Update existing excel station by {id} providing {ExcelModel}: excluding {created_at,updated_at,id}
# (POST) http://localhost:5000/api/excel/update/:id

## Delete One item by excel product {id}
# (GET) http://localhost:5000/api/excel/delete/:id

```

### Api examples:

```sh
### (POST) generate credentials
##  x-www-form-urlencoded (application/json)
# {"username":"eaglex","password":"eaglex"}
http://localhost:5000/api/auth

# then add generated token to:
### Header: Authorization : Bearer {token}
#### to all routes below



### (GET) list all stations for current user
http://localhost:5000/api/excel/stations

### (GET) list all products from Excel
http://localhost:5000/api/excel/products


# get one item
http://localhost:5000/api/excel/item/61335ac2faf7da2be5d966db


### (POST) create new item ( validation according with excelItem(...) method)
##  raw / x-www-form-urlencoded (application/json)
# {"name":"Migrol Tankstelle alt","address":"Scheffelstrasse 16","city":"Zürich (alt)","latitude":47.394395,"longitude":8.52982,"prices":[{"price":1.81,"currency":"CHF","product_id":"DIESEL"}],"products":[{"product_id":"DIESEL","points":[{"id":"1","status":"available"},{"id":"2","status":"not_available"}]}]}
http://localhost:5000/api/excel/create/


### (POST) update item by {id} with new {name,prices} ( validation according with excelItemUpdate(...) method)
##  raw / x-www-form-urlencoded (application/json)
#  {"name":"Migrol Tankstelle alt","prices":[{"price":1.81,"currency":"CHF","product_id":"DIESEL"}]}
http://localhost:5000/api/excel/update/61335ac2faf7da2be5d966db


### (GET) delete one item by {id}
http://localhost:5000/api/excel/delete/61335ac2faf7da2be5d966db


```

-   Assuming the `port` is the same

### Stack

Express.js, typescript, rest/api, api/authentication server/session, StaticDB _(database from json)_, x-utils-es (my own), Error/messages, utilities, route/separations, Nodemon

#### Developer Notes

-   Wasn't entirely sure of logic for products/points (ExcelProductPoint[]) and how they should behave so implemented my own take on it:)
-   I have included my last production build at /dist _(for heroku production only deployment)_
-   Dont run http://localhost:5000/api/ and http://localhost:5000/app/ in the same browser, angular manifest and ngsw-worker hijacks requests

#### TESTS

-   No tests available for this projects, except for 1 test to deploy to heroku

#### Thank you
