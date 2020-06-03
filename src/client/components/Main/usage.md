Main
=========

### Description

 The`<Main>`is a layout component which wraps content inside the`<main>`HTML tag, this component also contains a grid container which will center the content in the page with the appropriate gutters and responsive behaviour we expect from [our grid](https://design-system.service.gov.uk/styles/layout/). Its important that we include this in all pages as the`<main>`represents the dominant content of the`<body>`of the document, this also acts as a landmark which can help assistive technologies.


### Usage

```jsx
  <Main role="main" id="main-content">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </p>
  </Main>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `children` | false | undefined | node | Text for main


