import React from 'react'
import ReactDOM from 'react-dom'

import { ActivityFeedApp } from 'data-hub-components'
import AddCompanyForm from './apps/companies/apps/add-company/client/AddCompanyForm'
import EditCompanyForm from './apps/companies/apps/edit-company/client/EditCompanyForm'
import DeleteCompanyList from './apps/company-lists/client/DeleteCompanyList'
import MyCompanies from './apps/dashboard/client/MyCompanies.jsx'
import CreateListFormSection from './apps/company-lists/client/CreateListFormSection'
import AddRemoveFromListSection from './apps/company-lists/client/AddRemoveFromListSection'
import BusinessDetailsRegionEdit from './apps/companies/client/BusinessDetailsRegionEdit'
import BusinessDetailsSectorEdit from './apps/companies/client/BusinessDetailsSectorEdit'
import LeadAdvisers from './apps/companies/client/LeadAdvisers'
import DnbSubsidiaries from './apps/companies/apps/dnb-subsidiaries/client/DnbSubsidiaries'

const appWrapper = document.getElementById('react-app')

function parseProps (domNode) {
  return 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
}

function Mount ({ selector, children }) {
  return [...document.querySelectorAll(selector)].map(domNode => {
    const props = parseProps(domNode)
    return ReactDOM.createPortal(
      typeof children === 'function' ? children(props) : children,
      domNode
    )
  })
}

function App () {
  const globalProps = parseProps(appWrapper)
  return (
    <>
      <Mount selector="#add-company-form">
        {props => <AddCompanyForm csrfToken={globalProps.csrfToken} {...props} />}
      </Mount>
      <Mount selector="#edit-company-form">
        {props => <EditCompanyForm csrfToken={globalProps.csrfToken} {...props} />}
      </Mount>
      <Mount selector="#activity-feed-app">
        {props => <ActivityFeedApp {...props} />}
      </Mount>
      <Mount selector="#my-companies" children={MyCompanies} />
      <Mount selector="#delete-company-list">
        {props => <DeleteCompanyList csrfToken={globalProps.csrfToken} {...props} />}
      </Mount>
      <Mount selector="#create-company-list-form">
        {props => <CreateListFormSection csrfToken={globalProps.csrfToken} {...props} />}
      </Mount>
      <Mount selector="#add-remove-list-form">
        {props => <AddRemoveFromListSection {...props} />}
      </Mount>
      <Mount selector="#business-details-region-edit">
        {props => <BusinessDetailsRegionEdit csrfToken={globalProps.csrfToken} {...props} />}
      </Mount>
      <Mount selector="#business-details-sector-edit">
        {props => <BusinessDetailsSectorEdit {...props} />}
      </Mount>
      <Mount selector="#lead-advisers">
        {props => <LeadAdvisers {...props} />}
      </Mount>
      <Mount selector="#dnb-subsidiaries">
        {props => <DnbSubsidiaries {...props} />}
      </Mount>
    </>
  )
}

ReactDOM.render(<App />, appWrapper)
