import React from 'react'
import { useParams } from 'react-router-dom'
import { H2, InsetText, Link } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'

import {
  DefaultLayout,
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
import { transformInvoiceDetailsForApi } from './transformers'

const billingAddressUrl = (orderId) =>
  `${urls.omis.edit.billingAddress(
    orderId
  )}?returnUrl=${urls.omis.edit.invoiceDetails(orderId)}`

export const BillingAddress = ({ company, order }) => {
  const address = order.billingAddressCountry
    ? {
        line1: order.billingAddress1,
        line2: order.billingAddress2,
        town: order.billingAddressTown,
        county: order.billingAddressCounty,
        postcode: order.billingAddressPostcode,
        country: order.billingAddressCountry,
      }
    : company.registeredAddress
    ? company.registeredAddress
    : company.address

  const transformedAddress = [
    address.line1,
    address.line2,
    address.town,
    address.county,
    address.postcode,
    address.country.name,
  ].filter((item) => item.length)

  return (
    <>
      <H2 size={LEVEL_SIZE[4]} data-test="billing-address-heading">
        Billing address
      </H2>
      <ul data-test="invoice-address">
        {transformedAddress.map((addressPart) => (
          <li>{addressPart}</li>
        ))}
      </ul>

      {address === company.address || address === company.registeredAddress ? (
        <InsetText data-test="company-address-inset">
          The company's address is currently being used for the invoice.
          <br />
          <br />
          <Link
            href={billingAddressUrl(order.id)}
            data-test="billing-address-link"
          >
            Add a different billing address
          </Link>
        </InsetText>
      ) : (
        <Link
          href={billingAddressUrl(order.id)}
          data-test="order-billing-address"
        >
          Change billing address
        </Link>
      )}
    </>
  )
}

export const FieldVATStatus = ({ order }) => (
  <FieldRadios
    name="vat_status"
    label="VAT category"
    hint="Choose a VAT category based on the billing address country"
    initialValue={order.vatStatus}
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
              initialValue={order.vatNumber}
              validate={validateVATNumber}
            />

            <FieldRadios
              name="vat_verified"
              label="Has a valid VAT number been supplied?"
              required="Has a valid VAT number been supplied?"
              initialValue={transformBoolToRadioOptionWithNullCheck(
                order.vatVerified
              )}
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
        <DefaultLayout
          heading="Edit invoice details"
          pageTitle={`Edit invoice details - ${order.reference} - Orders (OMIS)`}
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
            { text: 'Edit invoice details' },
          ]}
        >
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
        </DefaultLayout>
      )}
    </OrderResource>
  )
}

export default EditInvoiceDetails
