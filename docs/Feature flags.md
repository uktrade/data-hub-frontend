# Feature flags

There are two types of feature flags.
1. Environment flags. Set as one value across an environment. 
1. User flags. These can be set on a user-by-user basis. Useful if you want to turn a feature on only for certain users to see it in different environments. 

## User feature flags

1. Create the flag in Django admin - `{api}/admin/feature_flag/userfeatureflag/` -> 'Add User Feature Flag`
2. Add to user in Django admin - `{api}/admin/company/advisor/` select user, and scroll down to the bottom under the 'other' heading. You should be able to see your flag on the left hand column and add it to the user.
3. Call the `userFeatures` middleware function with the name of your key (e.g. `userFeatures('user-contact-activities')`) directly before your controller function gets called in the router, e.g.:

```
router.get(
  '/',
  userFeatures('user-contact-activities'),
  renderInteractionsForEntity
)
```

4. Check the `res.locals.userFeatures` for your feature in the controller function, e.g.:

```
 isAventriFeatureOn: res.locals.userFeatures?.includes(
        'user-contact-activities'
      ),
    ...
```

## Environment feature flags

To create a feature flag you just need to add one in Django and it will be added to a property called 'features' on `res.locals`.

1. When building locally log into your Django admin http://localhost:8000/admin/.
2. Under FEATURE FLAG, click "add" to create a new one, fill out the form and make sure you click "active".
3. Your feature flag will now be available as a property called 'features' within `res.locals`.
4. As this gets exposed to the view you can now toggle components on/off using conditions in your `.njk` files.
5. Once you are happy with your feature flag, ask for this flag to be added to environments such as staging and production.
6. Clean up afterwards :-)  

## Adding feature flags in Sandbox

Data Hub Sandbox repo - https://github.com/uktrade/data-hub-sandbox

To add a feature flag in Sandbox for functional testing you just need to add your feature flag name to this JSON file https://github.com/uktrade/data-hub-sandbox/blob/master/fixtures/v3/feature-flag/feature-flag.json 
