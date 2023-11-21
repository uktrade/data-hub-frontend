import React from 'react'

import { DefaultLayout, Form } from '../../../components'
import urls from '../../../../lib/urls'

const CreateOrder = () => {
  return (
    <DefaultLayout
      pageTitle="Add an OMIS order - Orders (OMIS)"
      heading="Add an OMIS order"
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        { link: urls.omis.index(), text: 'Orders (OMIS)' },
        { text: 'Add an order' },
      ]}
    >
      <Form
        id="add-order-form"
        //submissionTaskName="Create company"
        analyticsFormName="addOmisOrder"
        //redirectTo={(company) => `/companies/${company.id}`}
        flashMessage={() => 'Company added to Data Hub'}
        //transformPayload={transformPayload}
      ></Form>
    </DefaultLayout>
  )
}

export default CreateOrder
