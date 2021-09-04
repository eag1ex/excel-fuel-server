const qs = require('querystring')


console.log(qs.stringify({"id":"61335ac2faf7da2be5d966db","name":"Migrol Tankstelle","address":"Scheffelstrasse 16","city":"Zürich","latitude":47.3943939,"longitude":8.52981,"prices":[{"price":1.81,"currency":"CHF","product_id":"DIESEL"}],"products":[{"product_id":"DIESEL","points":[{"id":"1","status":"available"},{"id":"2","status":"not_available"}]}]}))