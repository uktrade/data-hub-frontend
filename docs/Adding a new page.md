# Adding a new page in datahub

If a new page is required in datahub, these are the files that require changes. For this example, we are going to be creating a new page to be used as a tab on the companies page, with a url /companies/:companyId/new-page

### src/lib/urls.js

This file contains a nested json object containing all the urls used by datahub. When adding a new page there may already be a json object present that can be extended. For example, our new-page exists in the companies section so we would add it like this:

```
companies: {
  // Previous urls will be here
  newPage:{
    index: url('/companies', '/:companyId/new-page'),
  }
}
```

When adding a new page:

- Add it at the bottom of the nested level
- Use a nested `index` property, this assists where we later add api requests that require urls

### src/apps/routers.js

The `reactRoutes` variable in this file contains all routes that are handled by `react-router`. All new pages should be created using React and not nunjucks. Add a new entry to this variable at the bottom of the array like this:

```
const reactRoutes = [
  // Previous routes will be here...
  '/companies/:companyId/new-page'
]
```

### src/client/modules

A new React component needs to be created for our page, this will reside with the `src/client/modules` folder. There may already be a suitable subfolder to place the component, for our new page we will create a new folder `src/client/modules/Companies/NewPage` and inside it an `index.jsx` file. For now, this will create a very basic component that displays a `<h1>`:

```
import React from 'react'

const NewPage = () => {
  return (
    <h1>New Page</h1>
  )
}

export default NewPage
```

### src/client/routes.js

This file is used to map a url to a react component. A new json object with the following properties needs to be added:

- path: The url of the new page
- module: This is used to map a set of permissions that are applied to the new page. There is a set of permissions already defined in the system, and where possible an existing module should be used. Where that is not possible additional permission changes will be required, which is outside the scope of this document
- component: The React component created in the previous step

For our new page, we would add the below to the companies object

```
import NewPage from './modules/Companies/NewPage'

companies: [
  // Previous components will be here...
  {
    path: '/companies/:companyId/new-page',
    module: 'datahub:companies',
    component: NewPage,
  }
]
```

### Cypress Testing

A basic test should be added to ensure the new route loads the component correctly. There will usually be a sub folder in the `test/functional/cypress/specs` folder that the new test can be added into, if not a new one can be created. For this test, we will create a new spec file in `/companies/new-page-spec.js`

```
const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('New page', () => {
  context('When visiting the new page', () => {
    it('should display the h1 heading of New Page', () => {
      cy.visit(
        urls.companies.newPage.index(
          fixtures.company.allActivitiesCompany.id
        )
      )
      cy.get('h1').contains('New page')
    })
  })
})
```

An example PR where this process was followed can be viewed at: https://github.com/uktrade/data-hub-frontend/pull/5713
