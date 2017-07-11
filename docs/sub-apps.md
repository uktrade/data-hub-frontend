# Sub-app structure

Sub-apps form the basis of the application. They are self-contained Express
apps that can be mounted at a particular url.

- [Basic structure](#basic-structure)
- [File structure](#file-structure)

## Basic structure

Each sub-app should contain a recognised structure. This structure can change
slightly based on its size.

Each should normally contain:

- an index loader which exports `router`, `displayName` (optional), `mountpath` (optional)
- a router
- controllers
- views

It can also contain:

- middleware
- repos
- services

## Components

### Index loader

The loader is responsible for exporting the basic items needed for the sub-app.

- `router` the express router that contains the routes to mount
- `displayName` [optional] used to create a breadcrumb item for routes within this sub-app
- `mountpath` [optional] the path all routes will be nested under

### Router

[Express documentation](https://expressjs.com/en/guide/using-middleware.html#middleware.router)

This is where all routes are defined. It sets what middleware and controllers
should be called for each route and also any sub-app level middleware that should
be called.

### Controllers

Controllers should be thin and not contain much logic. They should be responsible
for deciding what action should be taken at the end of a route, normally rendering
a view but often redirecting to a different URL.

#### Naming convention

TBD

### Views

Views contain markup and components that are required for this route.

### Middleware

Sub-app specific middleware or logic that is required for multiple routes within
the sub-app.

#### Naming convention

TBD

### API

Contain calls to the API and are responsible for sending/receiving data.

### Transformers

Handle logic required to transform data to and from the API.

## File structure

For small sub-apps it may not warrant splitting the code into folder and files
but for larger apps it is suggested to help maintain the code.

A small app should start using this folder structure:

```
views/
controllers.js
middleware.js
index.js
router.js
```

As the app grows `controllers`, `middlware`, `repos` and `services` can be
expanded to a folder structure:

```
views/
controllers/
  details.js
  edit.js
  index.js
  list.js
middleware/
  details.js
  form.js
  index.js
index.js
router.js
```

When a folder structure is added, index loaders should be added to each folder
so that references don't need to be updated.

This is also the reason for using plurals even for smaller apps.
