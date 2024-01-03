import React from 'react'

import LocalHeader from '../LocalHeader'

const exampleText = 'Example'
const breadcrumbs = [{ link: '/', text: 'Home' }, { text: exampleText }]

export default {
  title: 'LocalHeader',

  parameters: {
    component: LocalHeader,
  },
}

export const Default = () => (
  <LocalHeader breadcrumbs={breadcrumbs} heading={exampleText} />
)

export const WithLink = () => (
  <LocalHeader
    breadcrumbs={breadcrumbs}
    heading={exampleText}
    headingLink={{
      url: '/',
      text: exampleText,
    }}
  />
)

WithLink.story = {
  name: 'With link',
}

export const WithSuperheading = () => (
  <LocalHeader
    breadcrumbs={breadcrumbs}
    heading={exampleText}
    superheading={exampleText}
  />
)

WithSuperheading.story = {
  name: 'With superheading',
}

export const WithChildren = () => (
  <LocalHeader
    breadcrumbs={breadcrumbs}
    heading={exampleText}
    children={exampleText}
  />
)

WithChildren.story = {
  name: 'With children',
}
