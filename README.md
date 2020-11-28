## Node-MySql Assignment Task

## Installation

First download the project. 

```bash
npm install
```
## Setup DB 

1. Create a DB with name `nodemysql`
2. Set your db connection in db.js

## Run project
```bash
npm start
```

## Create tables and import sample data

Tables and sample data will be imported by a GET request
```http
GET http://localhost:3000/create_tables
```

## APIs Created

1. To find treasure
```http
POST http://localhost:3000/find_treasure
Content-Type: application/json
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `latitude` | `number` | **Required**. A valid latitude |
| `longitude` | `number` | **Required**. A valid longitude |
| `distance` | `number` | **Required**. Distance can only contain `1` or `10` (km) |
| `prize_value` | `number (integer)` | **Optional**. Prize value is >= `10` and <= `30` ($) |

## Response

```javascript
{
  "status" : bool,
  "message" : string,
  "data" : any
}
```


2. Bonus API to find biggest treasure near me (specified location)
```http
POST http://localhost:3000/find_biggest_treasure_near_me
Content-Type: application/json
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `latitude` | `number` | **Required**. A valid latitude |
| `longitude` | `number` | **Required**. A valid longitude |

## Response

```javascript
{
  "status" : bool,
  "message" : string,
  "data" : any
}
```

The `status` attribute describes if the transaction was successful or not.

The `message` attribute contains a message commonly used to indicate errors or success messages.

If `status` is `true` only then `data` field will be available in response.
The `data` attribute can contain an array or an object of result.

## Status Codes

Returns the following status codes in API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |


## To RUN Tests 

```bassh
npm test
```

