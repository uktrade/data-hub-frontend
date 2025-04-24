import React from 'react'
import { useParams } from 'react-router-dom'
import { H2, InsetText } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'

import {
  FieldInput,
  FieldRadios,
  Form,
  FormLayout,
  NewWindowLink,
} from '../../components'
import { CompanyResource, OrderResource } from '../../components/Resource'
import { FORM_LAYOUT, OPTIONS_YES_NO } from '../../../common/constants'
import { VAT_STATUS } from './constants'
import urls from '../../../lib/urls'
import { validateVATNumber } from './validators'
import { transformBoolToRadioOptionWithNullCheck } from '../Investments/Projects/Details/transformers'
import { TASK_EDIT_INVOICE_DETAILS } from './state'
import {
  transformInvoiceDetailsForApi,
  getAddress,
  transformAddress,
} from './transformers'
import OMISLayout from './OMISLayout'
import AccessibleLink from '../../components/Link'

export const BillingAddress = ({ company, order }) => {
  const address = getAddress(order, company)
  const transformedAddress = transformAddress(address)

  return (
    <>
      <H2 size={LEVEL_SIZE[4]} data-test="billing-address-heading">
        Billing address
      </H2>
      <ul data-test="invoice-address">
        {transformedAddress.map((addressPart) => (
          <li key={addressPart}>{addressPart}</li>
        ))}
      </ul>

      {address === company.address || address === company.registeredAddress ? (
        <InsetText data-test="company-address-inset">
          The company's address is currently being used for the invoice.
          <br />
          <br />
          <AccessibleLink
            href={urls.omis.edit.billingAddress(order.id)}
            data-test="billing-address-link"
          >
            Add a different billing address
          </AccessibleLink>
        </InsetText>
      ) : (
        <AccessibleLink
          href={urls.omis.edit.billingAddress(order.id)}
          data-test="order-billing-address"
        >
          Change billing address
        </AccessibleLink>
      )}
    </>
  )
}

export const FieldVATStatus = ({ order }) => (
  <FieldRadios
    name="vat_status"
    label="VAT category"
    hint="Choose a VAT category based on the billing address country"
    initialValue={order ? order.vatStatus : null}
    options={[
      {
        label: 'Non-EU company',
        hint: 'No VAT charged',
        value: VAT_STATUS.OUTSIDE_EU,
      },
      {
        label: 'UK company',
        hint: '20% VAT charged',
        value: VAT_STATUS.UK_COMPANY,
      },
      {
        label: 'EU company',
        hint: 'No VAT charged if validated. 20% VAT charged if not validated.',
        value: VAT_STATUS.EU_COMPANY,
        children: (
          <FormLayout setWidth={FORM_LAYOUT.ONE_HALF}>
            <FieldInput
              label="VAT number"
              name="vat_number"
              type="text"
              hint={
                <NewWindowLink
                  href={urls.external.euVIES}
                  data-test="eu-vat-link"
                >
                  Validate the EU VAT number
                </NewWindowLink>
              }
              initialValue={order ? order.vatNumber : ''}
              validate={validateVATNumber}
            />

            <FieldRadios
              name="vat_verified"
              label="Has a valid VAT number been supplied?"
              required="Has a valid VAT number been supplied?"
              initialValue={
                order
                  ? transformBoolToRadioOptionWithNullCheck(order.vatVerified)
                  : null
              }
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
              }))}
            />
          </FormLayout>
        ),
      },
    ]}
  />
)

const EditInvoiceDetails = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OMISLayout heading="Edit invoice details" order={order}>
          <Form
            id="edit-order-invoice-details"
            analyticsFormName="editOrderInvoiceDetails"
            submitButtonLabel="Save and return"
            cancelButtonLabel="Return without saving"
            cancelRedirectTo={() => urls.omis.order(order.id)}
            flashMessage={() => 'Invoice details updated'}
            redirectTo={() => urls.omis.order(order.id)}
            submissionTaskName={TASK_EDIT_INVOICE_DETAILS}
            transformPayload={(values) =>
              transformInvoiceDetailsForApi({
                orderId,
                values,
              })
            }
          >
            <CompanyResource id={order.company.id}>
              {(company) => <BillingAddress company={company} order={order} />}
            </CompanyResource>
            <br />
            <FieldVATStatus order={order} />
            <FormLayout setWidth={FORM_LAYOUT.ONE_HALF}>
              <FieldInput
                label="Purchase Order (PO) number (optional)"
                name="po_number"
                type="text"
                initialValue={order.poNumber}
              />
            </FormLayout>
          </Form>
        </OMISLayout>
      )}
    </OrderResource>
  )
}

export default EditInvoiceDetails
