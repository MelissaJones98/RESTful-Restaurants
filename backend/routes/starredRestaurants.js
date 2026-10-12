const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
// Method/URL: GET /restaurants/starred/:id
router.get("/:id", (req, res) => {
  // 1. Get the id from the URL (req.params)
  const { id } = req.params; // destructuring - shorthand for const id = req.params.id;

  // 2. Find the starred restaurant in STARRED_RESTAURANTS with that id
  const starredRestaurant = STARRED_RESTAURANTS.find( // find goes through the array and returns the first item where the check is true, if nothing is found it returns undefined
    (starredRestaurant) => starredRestaurant.id === id
  );

  // 3. If it isn't found, send a 404 and stop
  if (!starredRestaurant) { // !undefined is true so this runs when nothing was found (undefined is falsey so if just undefined was there the error handling code wouldn't run)
    res.sendStatus(404);
    return; // stops the function - otherwise the code would continue and crash on starredRestaurant.restaurantId
  }

  // 4. Use its restaurantId to find the matching restaurant in ALL_RESTAURANTS (to get the name)
  const restaurant = ALL_RESTAURANTS.find(
    (restaurant) => restaurant.id === starredRestaurant.restaurantId
  );

  // 5. Send back { id, comment, name } (res.json sends a 200 automatically)
  res.json({ // send the json object to the frontend 
    id: starredRestaurant.id,
    comment: starredRestaurant.comment,
    name: restaurant.name,
  });
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
// Method/URL: POST /restaurants/starred
router.post("/", (req, res) => {
  // 1. Get the restaurant id from req.body
  const { id } = req.body; // destructuring - shorthand for const id = req.body.id;

  // 2. Find the restaurant in ALL_RESTAURANTS with that id
  const restaurant = ALL_RESTAURANTS.find( // find goes through the array and returns the first item where the check is true, if nothing is found it returns undefined
    (restaurant) => restaurant.id === id
  );
  
  // 3. If it isn't found, send a 404 and stop
  if (!restaurant) { // !undefined is true so this runs when nothing was found (undefined is falsey so if just undefined was there the error handling code wouldn't run)
    res.sendStatus(404);
    return; // stops the function
  }

  // 4. Create a new id with uuidv4()
  const newId = uuidv4(); // Generate a unique ID for the newly starred restaurant.

  // 5. Build the new starred item: { id: newId, restaurantId: id, comment: null }
  const starredRestaurant = {
    id: newId,
    restaurantId: id, 
    comment: null
  };

  // 6. Add it to STARRED_RESTAURANTS (push)
  STARRED_RESTAURANTS.push(starredRestaurant); // add the new object to the STARRED_RESTAURANTS array

  // 7. Send back { id, comment, name } for the new item (res.json sends the 200)
  res.json({ // send the json object to the frontend 
    id: starredRestaurant.id,
    comment: starredRestaurant.comment,
    name: restaurant.name,
  });
});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
// Method/URL: DELETE /restaurants/starred/:id
router.delete("/:id", (req, res) => {
  // 1. Get the id from the URL (req.params)
  const { id } = req.params;  // destructuring - shorthand for const id = req.params.id;

  // 2. Make a new list that leaves out the starred restaurant with that id
  const newListOfRestaurants = STARRED_RESTAURANTS.filter( // filter goes through an array and creates a new array with the items that meets the required condition
    (restaurant) => restaurant.id !== id
  );

  // 3. If the new list is the same length as the old one, nothing was removed
  //    -> send 404 and stop
  // The user tried to delete a restaurant that doesn't exist.
  if (ALL_RESTAURANTS.length === newListOfRestaurants.length) {
    res.sendStatus(404);
    return;
  }

  // 4. Replace STARRED_RESTAURANTS with the new list
  STARRED_RESTAURANTS = newListOfRestaurants;

  // 5. Send 200 so the frontend knows it worked
  res.sendStatus(200);
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
// Method/URL: PUT /restaurants/starred/:id
// 1. Get the id from req.params and newComment from req.body
// 2. Find the starred restaurant in STARRED_RESTAURANTS with that id
// 3. If it isn't found, send a 404 and stop
// 4. Set its comment to newComment
// 5. Send a 200

module.exports = router;