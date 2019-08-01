# Feature flags

## How to add a feature flag

To create a feature flag you just need to add one in Django and it will be added to a property called 'features' on `res.locals`.

1. When building locally log into your Django admin http://localhost:8000/admin/.
2. Under FEATURE FLAG, click "add" to create a new one, fill out the form and make sure you click "active".
3. Your feature flag will now be available as a property called 'features' within `res.locals`.
4. As this gets exposed to the view you can now toggle components on/off using conditions in your `.njk` files.
5. Once you are happy with your feature flag, ask for this flag to be added to environments such as staging and production.
6. Clean up afterwards :-)  

## Adding feature flags in Sandbox

Data Hub Sandbox repo - https://github.com/uktrade/data-hub-sandbox

To add a feature flag in Sandbox for functional testing you just need to add you flag name to this file https://github.com/uktrade/data-hub-sandbox/blob/master/fixtures/v3/feature-flag/feature-flag.json 
