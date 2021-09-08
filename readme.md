## Excel Fuel (ExF) server (typescript)


### Install
Required global instalations: `nodemon`,`typescript (tsc)`, and `esm`


### Available API routes:
```sh

## Generate new {token}, with body details: {username,password} (credentials in config.ts)
# (POST) http://localhost:5000/api/auth

## Get all available Excel stations from StaticDB
# (GET) http://localhost:5000/api/excel/stations

## Get all available Excel products from StaticDB
# (GET) http://localhost:5000/api/excel/products

## Get one excel station by {id}
# (GET) http://localhost:5000/api/excel/item/:id 

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


### (GET) Get one item by {id}
http://localhost:5000/api/excel/item/61335ac2faf7da2be5d966db 


```
* Assuming the `port` is the same