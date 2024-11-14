# Data Hub Front End

Client for [`data-hub-api`](https://github.com/uktrade/data-hub-api).

An Express web application running on Node.js where markup is rendered server
side with [Nunjucks](https://mozilla.github.io/nunjucks/)
and more markup is added to it client side with [React](https://react.dev/).

It depends on these services:

* `data-hub-api` - the main data source
* Staff SSO - identity provider
* Redis - session persistance
* ZenDesk - ???
* Help centre - For help centre announcement data
* Post code look up API
* AWS S3 bucket - for uploading documents

## Legacy Pre-React code

Before React was added to Data Hub, the whole app was implemented as a traditional
request-response application with HTML rendered with the Nunjucks templating
engine, which is in essence a JavaScript port of
[Jinja2](https://jinja.palletsprojects.com/en/stable/).

The app consists of
[_sub apps_](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Sub-apps.md),
which are defined as sub-directories of `src/apps`. Each subdirectory must have
an `./index.js` module.

A rather [ingenious code](https://github.com/uktrade/data-hub-frontend/blob/main/src/apps/routers.js#L152-L167)
then iterates over all those directories in `src/apps`,
filtering out those which start with two underscores and imports each directory's
`./index.js`. If the module exports an object with the `router` property,
the code will register that router with Express. If not, it won't do anything.

There is a sort of naming convention where:

* _Controllers_ are request handlers
* _Repos_ are functions which talk to the API
* _Transformers_ are functions which transform data fetched from the API to
  the shape required by the templates
* _Client_ are directories which contain React code

Some of the _sub apps_ (`companies`, `interactions`, `omis`) consist of further
sub-applications and they usually live in an `./apps` sub-directory.
For these however, there's no ingenious mechanism as above to register them
with Express.

### Controllers which render Nunjucks templates

There are 32 total `res.render(template)` calls, of which all merely provide a
mount point for React entry points, except the following:

* [`src/apps/companies/controllers/subsidiaries.js`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/companies/controllers/subsidiaries.js#L40-L48) renders [`src/apps/companies/views/subsidiaries.njk`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/companies/views/subsidiaries.njk)
* [`src/apps/investments/controllers/create/project.js`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/investments/controllers/create/project.js#L4) renders non-existent template `investments/views/create/project`
* [src/apps/oauth/controllers.js](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/oauth/controllers.js#L123-L125) renders [`src/apps/oauth/views/help-page.njk`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/oauth/views/help-page.njk)
* [`src/apps/search/controllers.js`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/search/controllers.js#L23)
renders [`src/apps/search/view.njk`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/search/view.njk)
* [`src/apps/support/controllers.js)`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/support/controllers.js)
	renders
	[`src/apps/support/views/feedback.njk)`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/support/views/feedback.njk)
	and [`src/apps/support/views/thank-you.njk`](https://github.com/uktrade/data-hub-frontend/blob/2d9f79b26fbebfe71759f79987de1d2545db4f07/src/apps/support/views/thank-you.njk)
	(which doesn't seem to have any content)

## React

React code is transpiled with Webpack and there are two main entrypoints:

* [`src/client/ExportWinReview/index.jsx`](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/ExportWinReview/index.jsx) — A small standalone application
  exposed to general public (if they provide a valid token in the URL)
* [`src/client/DataHub/index.jsx`](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/DataHub/index.jsx) — The rest of Data Hub

Then there are many other entry points for the early React code, defined with the
[`react-slot.njk`](https://github.com/uktrade/data-hub-frontend/tree/main/src/templates/_components/react-slot.njk)
Nunjucks component, which can usually be found in `./client` subdirectories of
_sub apps_.

### Export Wins Review

A _Single Page Application_ (SPA) where the React app is mounted on a blank HTML
document, which however is still [rendered with Nunjucks](https://github.com/uktrade/data-hub-frontend/tree/main/src/apps/__export-wins-review/view.njk)
and served with Express because it reuses mechanisms provided by it for injecting:

* Google Tag Manager
* Content Security Policy (CSP) _nonce_

The Export Wins Review page is fully routed with React Router.
It shares a lot of components with Data Hub, including the `Provider`
component and CSS.

### Data Hub

All React code is rendered onto HTML generated with Nunjucks
and served with Express with a combination of the `react-slot.njk` Nunjucks component
and the [`Mount`](https://github.com/uktrade/data-hub-frontend/tree/main/src/client/DataHub/App.jsx#L50-L58) React component.

This contraption serves the purpose of passing data from Express to React.

The `react-slot.njk` component takes an `id` and `props` parameters and renders
a `<div id="{{id}}" class="react-slot" data-props="{{ props | dump }}">`
element, wehere the `data-props` attribute will contain JSON serialized data
passed from an Express controller (request handler).

The `Mount` React component then takes the _id_ (prefixed with `#`) as its `selector` prop 
and React markup to render as its children and mount's them to all the elements matching
that selector (which is always only one), or does nothing if there's no such
element. If children is a function, it passes the deserialized contenents of
the element's `data-props` attribute to it as its only argument,
which can then be passed as props to the components which make up the children.

```jsx
<Mount selector="#contact-activity">
	{(props) => <ContactActivity {...props} />}
</Mount>
```

Alas, it gets more complicated. The [`src/templates/_layouts/template.njk`](https://github.com/uktrade/data-hub-frontend/tree/main/src/templates/_layouts/template.njk) template also contains the
`<div id="react-app" data-props="{{ globalProps | dump }}">`
element which serves multiple purposes:

* As a
	[mount point](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/DataHub/index.jsx#L7)
  for the entire
	[Data Hub React App](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/DataHub/App.jsx#L89)
*	As a way to pass data from Express to the
  [initial Redux state](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/createProvider.jsx#L15)
* To pass data in yet another way from Express to the
  [React app](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/DataHub/App.jsx#L60)
* As a React
	[portal selector](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/DataHub/App.jsx#L213)
  for a [subset of 126 routes](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/routes.js#L112-L1126) fully routed with React Router in a rather
	peculiar way. Moreover, Express needs to know about these routes, so that it
	can render the `src/templates/react.njk` template for each of them.
	The routes for Express are
	[defined in a separate module](https://github.com/uktrade/data-hub-frontend/blob/main/src/apps/routers.js#L10-L140) and both list of routes need to be kept in sync.

Most of React code lives in [`src/client`](https://github.com/uktrade/data-hub-frontend/tree/main/src/client), but the oldest React code still lives
in `./client` folders inside the Express sub app folders.

React used this way takes the worse of the two worlds — the user has to first wait for data to be
loaded server side before Express responds with empty HTML, only containing mount points for react
and the preloaded data and then has to wait again for the virtual DOM to be rendered by React.

#### State management

We use [Redux](https://redux.js.org/) for state management which prohibits side effects anywhere except in
its middleware, which rule is violated in many places of the codebase.
We write the middleware with [Redux-Saga](https://redux-saga.js.org/).
It's very rare to need to write any new middleware as this is abstracted away
by the `Task` component.

Redux doesn't provide much out of the box so we are using a couple of our own
abstractions on top of it:

* `multiInstance` — to allow separate state for different _instances_ of the
  same component.
* `Task` — a component for handling asynchronous side effects, e.g. HTTP requests
  and provides out of the box progress and error views
* `Resource` — an abstraction on top of `Task` which makes it very easy to fetch
  data from API
* `Form` and `*Field` components — for implementing forms

#### Routing

We use [React Router](https://reactrouter.com/en/main)
v6 for browser history routing. Unfortunately, we are not using the
advantage that the router is hierarchical and we have all the routes,
including the nested ones defined in a [single massive array](https://github.com/uktrade/data-hub-frontend/blob/main/src/client/routes.js#L112-L1126). This makes the code
tightly coupled.

Browser history routing is mostly only used for navigating between sections of
a particular Data Hub subpage. For navigating between the main sections e.g
_Events_, _Companies_ etc, we still use hard links. The goal is to use browser
history routing everywhere and for Data Hub to be fully a SPA.

#### Data fetching

In React code data is fetched from API in two ways.

* With XHR request from browser through the `/api-proxy/<endpoint>` endpoint
  which adds credentials to the requests — the desired way
	* As we are using Redux, this only can be done in the Redux Middleware as it
	is a side effect.
* In Express request handlers where data is passed through Nunjucks templates
  and the mount point element's `data-props` attribute to the React component
	— not the desired way

#### CSS

We style React components with CSS written in JavaScript using the [Styled Components](https://styled-components.com/)
library and we use [SASS](https://sass-lang.com/) (SCSS) for styling the markup generated with Nunjucks,
which heavily relies on the `govuk-frontend` SASS library.

There are two main downsides to using Styled Components:

* Everytime we want to apply a style to an element we have to create a named
  component, which results in the codebase being littered with components like
	`StyledSpan`, `StyledList`, `StyledHeading` etc
* The JSS mechanism dynamically writes `<style>` elements to the DOM, which
  have to include a `nonce` attribute with a non-guessable server side generated
	value, which must be unique for each response, if we should keep the Content
	Security Policy (CSP) as strict as possible. This would be a problem if
  Data Hub finally became a full SPA and we wanted to serve it through a CDN
	and leverage caching

#### Storybook

We use a tool called [Storybook](https://storybook.js.org/),
which serves as an interactive [catalogue](https://uktrade.github.io/data-hub-frontend/?path=/docs/archivepanel--docs) of
reusable (and also not so reusable) components. We also often used it for
development as it supports hot module replacement (HMR) out of the box,
which we didn't have for years in DH's development mode, but now we do.

## Testing

We have a number of test suites:

* Accessibility
* Component
* End to end
* Functional
* Unit 
* Unit client

We also used to have the _visual_ and _visual component_ tests, but they were
rather problematic and provided little value and we got rid of them.

### Unit tests

The oldest test suite. Tests Express code, mostly controllers and transformers.
Tests are defined close to the tested code as `*.test.js` files, usually inside
`__test__/` directories. They can be used to test client side code as the Node
runtime they are run in doesn't recognize the import syntax.

It turned out that currently there's a bug when the tests are not executed at
all because of the `example service dependency health check failed example error`,
but the process still ends with a 0 code, due to which the result of the whole
suite is falsely reported as positive. When I run the test suite locally, I get
the same error, but the tests actually do run, but with one consistently failing
on `TypeError: legacyCreateProxyMiddleware is not a function`. This issue is
present for at least as far the Circle CI history can be viewed which is about
3 months.

When run locally the 1209 tests take about 4 seconds to complete.

### Unit client tests

Test some really old frontend code which lives in `assets/javascript`,
namely the `XHR` and `AddItems` modules.

* `AddItems` is used in the Nunjucks `Form` macro, which finds its way through
  template inheritance to pretty much every Nunjucks template.
* `XHR` is used in the auto `AutoSubmit` module which is in turn used in
  * `src/apps/events/attendees/macros.js`
	* `src/templates/_macros/collection/collection-filters.njk`
		* `src/templates/_macros/collection.njk`
			* `src/apps/investments/views/create/start.njk`
			* `src/templates/_layouts/template.njk`
				* From which most templates are extended

There is a good chance that most of this is dead code, but it would require some
proper analysis whether these are actually used in some obscure recesses of the
app.

There are 39 tests passing in about half a second. The whole suite takes about
4 minutes of CI time.

### End to end tests

Test application features by orchestrating browser with Cypress. The application
is configured to talk to a local instance of `data-hub-api`. The tests use the
API's
[test fixture endpoints](https://github.com/uktrade/data-hub-api/tree/main/datahub/testfixtureapi)
to populate the SUT with data and tear it down:

* `/testfixtureapi/load-fixture/`
* `/testfixtureapi/create-user/`
* `/testfixtureapi/reset-fixtures/`

The suite actually consists of three separate sets of specs
`DA`, `DIT` and `LEP`, each of which is a separate test suite.

The specs live under `test/end-to-end/specs`.

The tests are a pain to make run locally as it requires to either manually
edit specific lines in the codebase when run with Docker, which most of the time
doesn't work as per the docs, or to have an instance of `data-hub-api` running
locally, populated with data and connected to mock services exactly as required
by the e2e tests.

Docs related to e2e tests:

* [`docs/Running tests.md`](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#e2e-tests)
* [`docs/Docker`](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Docker.md#start-the-e2e-tests-ditlepda)
* [`docs/Writing tests.md`](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Writing%20tests.md#end-to-end-e2e-tests)

All three suites combined take about 25 minutes to pass on CI.

* `e2e_tests_dit` ~ 13 minutes; 79 tests in 5.5 minutes = 2 seconds per test
* `e2e_tests_da` ~ 6 minutes; 15 tests in 22 seconds = 1.46 seconds per test
* `e2e_tests_lep` ~ 6 minutes; 15 tests in 22 seconds = 1.46 seconds per test

The tests themselves only make a fraction of the overal time. Most of the time
is spent on waiting for all parts of the SUT (Docker compose) to be ready, which
can take 5 to 8 minutes.

### Functional tests

Test some app features with Cypress with the app being connected to a static
mock of `data-hub-api`, which we for historic and completely irrational reasons
call _sandbox_.

The test suite takes about 15 minutes on CI to complete with tests split
into 9 parallel runs.

There are 2772 tests in this suite and it takes about an hour of total time to run them,
which is about 1.3 seconds per test.

### Component tests

Test React components in isolation with Cypress.
By far the fastest to run per test. Some components are actually whole application
sections e.g.
[Export Win Review](https://github.com/uktrade/data-hub-frontend/blob/main/test/component/cypress/specs/ExportWins/Review.cy.jsx).

Tests are defined in `test/component/cypress/specs`.

861 tests pass in less than 2 minutes on CI, which is about 0.14 second per test.
The overal CI time is 15 minutes though.

### Accessibility tests

Test a list of specific URLs (computed in a rather
[complicated way](https://github.com/uktrade/data-hub-frontend/blob/c0095b46c721e914f480eb9d57b3c7b17947535f/test/a11y/cypress/specs/all-accessibility.spec.js#L5-L7)),
and checks the page for a11y violations with the `cypress-axe` Cypress plugin.

This yealds 161 tests which pass in about 3 minutes, which is about 1.1 second per test.
The overal CI time is about 7 minutes.

### Visual tests

The visual (and visual component) tests took snapshots of selected pages (or components)
and compared them to a baseline image taken in previous commits. If the images differed beyond a certain threshold, the test failed. This was used for detecting visual regression.

This was problematic though because the way the markup was rendered differed across browser and OSs. So the the tests had to run in exactly the same environment as was used to generate the baseline images. This was achieved with Docker. After an upgrade of Cypress and the related plugins for visual tests,
the tests stopped working in Docker running on Mac computers with M2 chips, due to which we couldn't update the baseline snapshots when we deliberately updated appearance. There was a workaround for visual tests when we could manually download the snapshots generated on CI and made available as artifacts and set them as the new baselines, but for visual components there was no such workaround as the snapshots were not stored as artifacts.

This was a major blocker to several PRs.

The value of these tests was also questionable as DH appearance is not really a
coherent visual masterpiece that needs to be pixel-perfectly preserved, so we
decided to get rid of those tests.

## Vision

Ideally

* The front end would be a pure SPA
* Written in TypeScript
	* With types for API endpoints compiled from `data-hub-api` OpenAPI schema,
	  which would be so much simpler to synchronized if the FE and API lived in
		a monorepo
* Transpiled with a modern module bundler like Vite
* Served through a CDN
* With no need for Express, nor any other _backend for frontend_ layer
* For that to work...
	* The SSO would have to support client-only OAuth 2.0 with PKCE
	* We would have to write CSS in a way which doesn't require a CSP nonce

## Q&A

### Can you explain the FE structure?

I hope I just did that.

### Was it always like this? If not, then why was it changed?

It wasn't always like this of course.

1. First there was only the Express app with all HTML rendered serverside with
   Nunjucks with some client side JS (remember the unit client tests?)
2. Then there even was Vue.js for a short while
3. At some point someone convinced the whole DH community to introduce React
4. React was first used only to pepper the Nunjucks generated HTML with interactivity
5. At some point we decided that we want DH to become a SPA and that we would like
   to get rid of Nunjucks and Express, which we are now considering as tech-debt
6. The strategy to achieve that was to eat the hierarchy of Nunjucks generated
   HTML from its leaves all the way to the root
7. The strategy was forgotten
8. Over time the React code got littered with compromises needed to make it work
   with Express and Nunjucks

### Why do E2E tests take so much time to run?

The tests themselves don't seem to take that much time to run:

* `e2e_tests_dit` 79 tests in 5.5 minutes
* `e2e_tests_da` 15 tests in 22 seconds
* `e2e_tests_lep` 15 tests in 22 seconds

It's the Docker compose contraption that takes long to spin up.

### Why don't we have more E2E tests?

Developers avoid them as they are hard to make work locally and probably
it is much harder to set up data for tests than in the functional or component
tests.

### Can we run them locally? If not, why not?

We can't run them with the `make start-e2e-dit e2e-tests-dit` which is the way
we run it in CI, because of the Cypress bug, when it hangs when running inside
Docker on M2 Mac machines.

We could just run `make start-e2e-dit` to get the SUT up and running and then
run the e2e tests locally ouside Docker with `npm run test:e2e:dit`, which I
did't succeed to make work because the Express app responds with 500 for requests
protected by OAuth. It was most likely an issue related to the `mock-sso` service,
but I didn't have time to dig deeper.

We could run the tests agains the app connected to a local API instance with
`ALLOW_TEST_FIXTURE_SETUP=True`, but setting up all the mocked services locally
is a very daunting task.

When I tried to run the e2e tests locally with `make start-e2e-dit e2e-tests-dit` after not trying it for a couple of months, I encountered these issues:

1. `postgres` service wouldn't start because of the
   `PostgreSQL Database directory appears to contain a database; Skipping initialization`
	 error. This was because the `postgres` image keeps around the volume where
	 it persists the DB files. I solved this by pruning the containers and removing
	 the volume used by the `postgres` service container.
2. After fixing the above issue, the `frontend` container crashed right after
   starting the Express server with the
	 `Redis client has encountered an error connect ECONNREFUSED 127.0.0.1:6379`
	 error.
3. I stopped and restarted the Docker compose
4. Now the `api` container crashed because on DB migration because the data was
   already there, persisted from the previous attempt.
5. As expected, the restart didn't help
6. I added the `REDIS_URL: redis://redis:6379` env var to
   `docker-compose.e2e.frontend.yml`.
7. I pruned the containers and removed the volume to avoid issues
8. It turned out that Cypress hangs when run from within the `frontend` container, which is still an open [Cypress issue](https://github.com/cypress-io/cypress/issues/29095)

The next day, I was facing different kind of issues:

1. `django.core.exceptions.ImproperlyConfigured: Set the DJANGO_SECRET_KEY environment variable`
   thrown by both `api` and `rq` containers
2. I stopped all the containers with `make stop-e2e`
3. Building of the `dh-frontend-1` container faild with this error:
   ```
	 Error response from daemon: failed to copy files: failed to open target /var/lib/docker/volumes/2be6c7f3a059df75da8aee124235d0be2f2d06eeb7e40be9359adeff1f391358/_data/cypress/node_modules/fs-extra/lib/util/utimes.js: open /var/lib/docker/volumes/2be6c7f3a059df75da8aee124235d0be2f2d06eeb7e40be9359adeff1f391358/_data/cypress/node_modules/fs-extra/lib/util/utimes.js: no space left on device
	 ```
4. Fixed it by tweaking Docker client settings
5. After adding the missing `DJANGO_SECRET_KEY`, and run the whole thing again
   it kept complaining about more missing env vars one at a time
6. I have realized that the `make start-e2e-*` scripts are using the `./.env`
   file, which we keep changing all the time during development.
7. I copied the `./sample.env` to `./.env`
8. This time `activity-feed` failed on missing `VCAP_SERVICES` env var
9. It turned out env vars for `activity-feed` are not taken from `./.env`
10. I added the `VCAP_SERVICES` env var to `docker-compose.e2e.backend.yml`
11. Now it complains about missing `ES_AWS_ACCESS_KEY_ID`
12. Alas, `lbweb-1` is complaing that
		```
		django.db.utils.OperationalError: connection to server at "lbdb" (172.18.0.3), port 5432 failed: fe_sendauth: no password supplied
		```
13. `rq-1` is complaining that
		```
		simplejson.errors.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
		```

### Why do tests take so long to complete?

The e2e and functional tests are slower per test compared to component tests by
an order of magnitude, which can be attributed to the overhead of making
actual HTTP requests.

We can't do much about it in e2e tests, but we can definitely
improve the performance of functional tests by mocking the API in browser
instead of talking to a mock HTTP server. This can be done in many ways
e.g. `Task` side effect dependency injection, Mock Service Worker or Mock HTTP
requests in Cypress. This could reduce the total time of running the 2772 tests
from one hour to about 6 minutes. It would also allow removing the complexity
of parallelizing the test runs in CI.

In e2e tests, the tests themselves don't take that long to run because there is
not that many of them. What takes very long though is for the whole docker compose
contraption to become ready. 

### If we decide to change the current E2E testing framework, will that cause any problems?

No, it should only improve some things, that is if we are talking about Playwright:

* We would have a much better post-mortem debugging tools for tests failing
  only on CI, which is quite common and currently it's a nightmare to debug.
* Playwright embraces the a11y philosophy pioneered by The Testing Library,
  which we are only using in the Enquiry Management Tool and we should do it
	in DH too.
* Playwright seems to be a much more mature and stable tool than Cypress

### Is there any document that shows all the workflows in the FE?

There are lots of documents in the `docs/` directory:

* [Adding a new page in datahub](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Adding%20a%20new%20page.md)
* [Running tests](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md)
* [Request flow diagram](https://github.com/uktrade/data-hub-frontend/blob/main/docs/CodePathMap.png), which is slightly outdated
* [Redux and Saga](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Redux%20and%20Saga.md)
* [Data Fetching Building Blocks](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Data%20Fetching%20Building%20Blocks.md)
* [Single Sign-On](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Single%20sign-on.md)


### Any gotchas that we should be aware of?

???