# RESTful Restaurants
## Description
A Codecademy off-platform project where you build an API to connect the front-end and back-end of a restaurant review site. 
The site allows its users to view a list of saved restaurants, add to that list, star their favourite restaurants, and leave comments about these places. 
Codecademy provide starter code which contains the built front-end and sets up some of the API routes that are required. The remaining routes needed to handle starred restaurants and comments. 

- **Backend:** Node.js + Express REST API (`backend/`)
- **Frontend:** React, created with Create React App (`frontend/`)

## How the front end and back end communicate

1. **Components** in `frontend/src/components` start API calls when the user does something (stars a restaurant, edits a comment, and so on).
2. **API functions** in `frontend/src/api` send the HTTP requests to the back end.
3. **Routers** in `backend/routes` handle those requests, update the data and send a response.

Data is kept in memory in arrays inside the routers. A real application would use a database. Any changes are lost when the backend restarts.

## Running the app

Start the **backend first**, because both the backend and the frontend default to port 3000.

```bash
# Terminal 1: backend (runs on http://localhost:3000)
cd backend
npm install
npm start

# Terminal 2: frontend
cd frontend
npm install
npm start
```

When the frontend asks whether to run on another port because 3000 is in use, answer **yes**. It will open on http://localhost:3001.

The frontend expects the API at `http://localhost:3000` (set in `frontend/src/api/index.js`).

## API endpoints

### Restaurants: `backend/routes/restaurants.js`

| Feature | Method | URL | Body | Response |
|---|---|---|---|---|
| 1. List restaurants | GET | `/restaurants` | none | `200` + array of restaurants |
| 2. Get a restaurant | GET | `/restaurants/:id` | none | `200` + restaurant, or `404` |
| 3. Add a restaurant | POST | `/restaurants` | `{ "name": "..." }` | `200` + new restaurant |
| 4. Delete a restaurant | DELETE | `/restaurants/:id` | none | `200`, or `404` |
| 5. Rename a restaurant | PUT | `/restaurants/:id` | `{ "newName": "..." }` | `200`, or `404` |

### Starred restaurants: `backend/routes/starredRestaurants.js`

| Feature | Method | URL | Body | Response |
|---|---|---|---|---|
| 6. List starred restaurants | GET | `/restaurants/starred` | none | `200` + array of `{ id, comment, name }` |
| 7. Get a starred restaurant | GET | `/restaurants/starred/:id` | none | `200` + `{ id, comment, name }`, or `404` |
| 8. Star a restaurant | POST | `/restaurants/starred` | `{ "id": "<restaurant id>" }` | `200` + `{ id, comment, name }`, or `404` |
| 9. Unstar a restaurant | DELETE | `/restaurants/starred/:id` | none | `200`, or `404` |
| 10. Update a comment | PUT | `/restaurants/starred/:id` | `{ "newComment": "..." }` | `200`, or `404` |

In Features 7, 9 and 10, `:id` is the **starred** restaurant's id. In Feature 8, the body `id` is the **restaurant's** id from the full restaurant list.

## Work completed: starred restaurant endpoints (Features 7–10)

Features 1–6 were provided. Features 7–10 were added to `backend/routes/starredRestaurants.js`. Each was planned first as step-by-step comments, then coded under those comments.

Every endpoint follows the same order: get the input, look up the data, send a `404` and stop if it isn't found, change the data, then send a single response.

### Feature 7: Get a specific starred restaurant
- Reads the id from the URL and finds it in `STARRED_RESTAURANTS`.
- Sends `404` if no starred restaurant has that id.
- Looks up the name in the full restaurant list using `restaurantId`, then sends back `{ id, comment, name }`.

### Feature 8: Add a restaurant to the starred list
- Reads the restaurant id from the request body and checks it exists in the full restaurant list. Sends `404` if it doesn't.
- Creates a new starred record with a fresh id from `uuidv4()`, the restaurant's id as `restaurantId`, and `comment: null`.
- Adds the record to `STARRED_RESTAURANTS` and sends back `{ id, comment, name }`. The frontend adds this response straight to the starred list on screen, so `name` must be included.

### Feature 9: Remove a restaurant from the starred list
- Uses `.filter()` to build a new list without the starred restaurant.
- If the new list is the same length as the old one, nothing was removed, so it sends `404`.
- Otherwise it replaces `STARRED_RESTAURANTS` with the new list and sends `200`.

### Feature 10: Update the comment of a starred restaurant
- Reads the id from the URL and `newComment` from the request body.
- Finds the starred restaurant and sends `404` if it isn't found.
- Sets its `comment` to `newComment` and sends `200`.

## Testing

All four new endpoints were tested with `curl` against a running backend, checking both the success case and the "not found" case:

| Feature | Test | Result |
|---|---|---|
| 7 | Get an existing starred restaurant | `200` with id, comment and name |
| 7 | Get an id that doesn't exist | `404` |
| 8 | Star an existing restaurant | `200` with new id, `comment: null` and name |
| 8 | Star a restaurant that doesn't exist | `404` |
| 9 | Unstar an existing starred restaurant | `200`, removed from the list |
| 9 | Unstar an id that doesn't exist | `404` |
| 10 | Update an existing comment | `200`, new comment saved |
| 10 | Update an id that doesn't exist | `404` |

To run these checks yourself while the backend is running:

```bash
# Feature 7
curl http://localhost:3000/restaurants/starred/a7272cd9-26fb-44b5-8d53-9781f55175a1

# Feature 8
curl -X POST -H "Content-Type: application/json" \
  -d '{"id":"0b65fe74-03a9-4b37-ab09-1c8d23189273"}' \
  http://localhost:3000/restaurants/starred

# Feature 10
curl -X PUT -H "Content-Type: application/json" \
  -d '{"newComment":"Great pho"}' \
  http://localhost:3000/restaurants/starred/a7272cd9-26fb-44b5-8d53-9781f55175a1

# Feature 9
curl -X DELETE http://localhost:3000/restaurants/starred/8df59b21-2152-4f9b-9200-95c19aa88226
```

In the app itself, you can check the same things by clicking **Star**, editing a comment, and clicking **Unstar**. If none of them show "Updating failed", the endpoints are working.