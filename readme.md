## Pertol Locator (PL) TS server


### Install
Required global instalations: `nodemon`,`typescript (tsc)`, and `esm`


### Available API routes:
```sh
## Get all available items from StaticDB
# (GET) http://localhost:5000/api/petrol/list

## Get one petron station by {id}
# (GET) http://localhost:5000/api/petrol/item/:id 

## Create new petrol station when providing {PetrolModel}, excluding {created_at,updated_at,id}
## Checks for same latitude/longitude, or address/city
# (POST) http://localhost:5000/api/petrol/create/

## Update existing petron station by {id} with details: {price,name}, accepting: {price,name,product_id}
# (POST) http://localhost:5000/api/petrol/update/:id

## Delete One item by petron product {id}
# (GET) http://localhost:5000/api/petrol/delete/:id

```

### Api examples:

```sh

### (GET) list all items
http://localhost:5000/api/petrol/list

# get one item
http://localhost:5000/api/petrol/item/61335ac2faf7da2be5d966db 

### (POST) create new item
##  x-www-form-urlencoded (application/json)
# {"name":"Migrol Tankstelle (alt)","address":"Scheffelstrasse 16","city":"Zürich","latitude":47.394395,"longitude":8.52982,"prices":[{"price":1.81,"currency":"CHF","product_id":"DIESEL"}],"products":[{"product_id":"DIESEL","points":[{"id":"1","status":"available"},{"id":"2","status":"not_available"}]}]}
http://localhost:5000/api/petrol/create/

### (POST) update item by {id} with {name,price}, accepting {price,name,product_id}
##  x-www-form-urlencoded (application/json)
# {"name":"Migrol Tankstelle (alt)","price":"1.1","product_id":"DIESEL"}
http://localhost:5000/api/petrol/update/61335ac2faf7da2be5d966db


### (GET) delete one item by {id}
http://localhost:5000/api/petrol/item/61335ac2faf7da2be5d966db 


### (GET) Get one item by {id}
http://localhost:5000/api/petrol/item/61335ac2faf7da2be5d966db 


```
* Providing the `port` is the same