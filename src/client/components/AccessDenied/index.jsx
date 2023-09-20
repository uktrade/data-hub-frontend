import React from 'react'
import DefaultLayout from '../Layout/DefaultLayout'

const AccessDenied = ({ breadcrumbs }) => (
  <DefaultLayout
    heading="You don't have permission to view this page"
    pageTitle="Access denied"
    breadcrumbs={breadcrumbs}
  >
    <div data-test="access-denied">
      <p>
        If you think you should have access or need to sign up to a DBT system
        then <a href="/support">request access</a>.
      </p>
      <p>
        You can also <a href="/">browse or search from the homepage</a> to find
        the information you need.
      </p>

      <p>
        <strong>403</strong>
      </p>
    </div>
  </DefaultLayout>
)

export default AccessDenied
