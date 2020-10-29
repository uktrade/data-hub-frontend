# Activity Feed

## Adding new activity types

To add a card for a new activity type you will need to:
 
 1. Add a new `*.jsx` card component to this `~/src/activity-feed/activities` directory. To get started this could essentially be a copy of `Default.jsx`.
 2. Modify the `static` `canRender` function to render the new card using a condition based on data from the activity item JSON.
 3. Add the new card to the array found in `~/src/activity-feed/activities/index.js`. Note that cards at the top of the array are treated with higher priority, hence `Default` is last.
 
 Your new card will now render when the condition in `canRender` has been met.
 
 Ensure the tests in `~/src/Activity.test.jsx` are updated.
