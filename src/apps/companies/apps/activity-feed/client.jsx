/* eslint-disable no-unused-vars */

// Include polyfills
require('react-app-polyfill/ie9')
require('react-app-polyfill/stable')

const React = require('react')
const { render } = require('react-dom')
const { ActivityFeedApp } = require('data-hub-components')

const element = document.querySelector('#activity-feed-app')

if (element) {
  const params = JSON.parse(element.dataset.params)

  render(
    <ActivityFeedApp {...params} />,
    element,
  )
}
