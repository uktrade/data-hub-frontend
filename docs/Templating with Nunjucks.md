## Templating With Nunjucks

This app includes support for including components using a custom [nunjucks
tag](https://mozilla.github.io/nunjucks/api.html#custom-tags). This method
allows components to be available in all layouts, views, includes and macros
and allows each component to be a separating entity which makes maintaining
and testing them easier.

To include a component with its default state or one that expects no data:

```njk
{% component 'person' %}
```

To include a component and pass data to it:

```njk
{% component 'person', {
  name: 'Barry',
  age: '55'
} %}
```

Component can take multiple arguments. It will combine them in single object:

```js
res.render('some-page', {
  personData: {
    name: 'Barry',
    age: 55,
  },
})
```

```njk
{% component 'person', personData, gender='male' %}
```

Is the same as:

```njk
{% component 'person', {
  name: 'Barry',
  age: '55',
  gender: 'male'
} %}
```

## Templates

Templates use Nunjuck's [template inheritance](https://mozilla.github.io/nunjucks/templating.html#template-inheritance).
There are several top level blocks which are used for injecting content during rendering. Each subsequent template
that extends the base layout can include these additional blocks.

### Nunjucks base template blocks

Template block names are structured by combining main element names to form path. e.g. `head` wraps everything inside
the `head` element, the same applies to `headIcons`.

- `_layouts/template.njk extends govuk-frontend/template.njk` - the GOV.UK frontend template Data Hub extends from

`<head>`

- `pageTitle` - contains the page title
- `headIcons` - contains various GOV.UK icons
- `head` - overridden by Data Hub containing mainly `<meta>`, `<link>` and `<script>` tags

`</head>`

`</body>`

- `bodyStart` - contains Google Tag Manager (GTM) and the notification banner
- `skipLink` - a GOV.UK "skip to content" link
- `header` - overridden by Data Hub
  - `header_site_title` - wraps the site title
  - `header_menu` - wraps the header menu
  - `local_header` - wraps header content specific to the app
- `main` - Data Hub overrides the GOV.UK main block
  - `content` - overridden by Data Hub
    - `local_nav` - wraps navigation specific to the app
    - `body_main_content` - contains main content (inside main#content)
- `footer` - contains a GOV.UK footer which DataHub overrides with an empty block
- `bodyEnd` - initialise scripts (e.g. app.js and GOV.UK frontend)

`</body>`

### Base template variables

Base layout checks for certain variables.

- `siteTitle` {string} - name of the site. Defaults to 'Department for International Trade'.
- `serviceTitle` {string} - name of the service.
- `phaseBanner` {boolean} - whether to show the separate phase banner or default to phase tag in the global header. Possible values: `true` and `false`.
- `projectPhase` {string} - phase of the project. Possible values: `alpha` and `beta`.
