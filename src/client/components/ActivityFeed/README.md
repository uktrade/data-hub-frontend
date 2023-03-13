# Activity Feed

## Adding new activity types

To add a card for a new activity type you will need to:

1.  Add a new `*.jsx` card component to this `~/src/client/components/ActivityFeed/activities` directory. To get started this could essentially be a copy of `Default.jsx`.
2.  Modify the `static` `canRender` function to render the new card using a condition based on data from the activity item JSON.
3.  Create two version of the card a default one that shows full details on the Activity tab and an overview version that shows on the Company overview Recent and Upcoming cards when the isOverview prop is set.
4.  Add the new card to the array found in `~/src/client/components/ActivityFeed/activities/index.js`. Note that cards at the top of the array are treated with higher priority, hence `Default` is last.
5.  Add the card type to the tests at ....
6. ###### Document summary card 

Your new card will now render when the condition in `canRender` has been met.
