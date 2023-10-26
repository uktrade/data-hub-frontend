import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout, FieldAddress, Form, FormLayout } from '../../components'
import { OrderResource } from '../../components/Resource'
import { TASK_EDIT_ORDER_BILLING_ADDRESS } from './state'
import { transformBillingAddressForApi } from './transformers'
import { FORM_LAYOUT } from '../../../common/constants'
import urls from '../../../lib/urls'

const checkIfCountryHasChanged = (order, values) =>
  order.billingAddressCountry.id === values.country

const EditBillingAddress = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <DefaultLayout
          heading="Edit billing address"
          pageTitle={`Edit billing address - ${order.reference} - Orders (OMIS)`}
          breadcrumbs={[
            {
              link: urls.dashboard.index(),
              text: 'Home',
            },
            {
              link: urls.omis.index(),
              text: 'Orders (OMIS)',
            },
            {
              link: urls.omis.order(order.id),
              text: order.reference,
            },
            { text: 'Edit billing address' },
          ]}
        >
          <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
            <Form
              id="edit-order-billing-address"
              analyticsFormName="editOrderBillingAddress"
              submitButtonLabel="Save and return"
              cancelButtonLabel="Return without saving"
              cancelRedirectTo={() => urls.omis.edit.invoiceDetails(order.id)}
              flashMessage={(result, values) =>
                checkIfCountryHasChanged(order, values)
                  ? 'Billing address updated'
                  : null
              }
              redirectTo={(result, values) =>
                checkIfCountryHasChanged(order, values)
                  ? urls.omis.edit.invoiceDetails(order.id)
                  : urls.omis.edit.vatStatus(order.id)
              }
              submissionTaskName={TASK_EDIT_ORDER_BILLING_ADDRESS}
              transformPayload={(values) =>
                transformBillingAddressForApi({
                  orderId,
                  values,
                })
              }
            >
              <FieldAddress
                name="address"
                isCountrySelectable={true}
                country={order.billingAddressCountry}
                hideCountyField={false}
                useStaticPostcodeField={true}
                isPostcodeRequired={true}
                showBorder={false}
                useStaticCountyField={true}
                initialValue={{
                  address1: order.billingAddress1,
                  address2: order.billingAddress2,
                  town: order.billingAddressTown,
                  county: order.billingAddressCounty,
                  postcode: order.billingAddressPostcode,
                }}
              />
            </Form>
          </FormLayout>
        </DefaultLayout>
      )}
    </OrderResource>
  )
}

export default EditBillingAddress
