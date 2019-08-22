/* eslint-disable */

import React from 'react'
import ReactDOM from 'react-dom'

import { ActivityFeedApp } from 'data-hub-components'
import AddCompanyForm from './apps/companies/apps/add-company/client/AddCompanyForm'

function Mount({ selector, children }) {
  return [...document.querySelectorAll(selector)].map((domNode) => {
    const props = 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
    return ReactDOM.createPortal(
      typeof children === 'function' ? children(props) : children,
      domNode,
    )
  })
}

function App() {
  return (
    <>
      <Mount selector="#add-company-form">
        {props => <AddCompanyForm {...props} />}
      </Mount>
      <Mount selector="#activity-feed-app">
        {props => <ActivityFeedApp {...props} />}
      </Mount>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('react-app'));
