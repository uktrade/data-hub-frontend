import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import { DefaultLayout } from '../../components'
import {
  CompanyResource,
  ContactResource,
  OrderResource,
  OrderAssigneesResource,
  OrderQuoteResource,
  OrderSubscribersResource,
} from '../../components/Resource'
import urls from '../../../lib/urls'
import { STATUS } from './constants'
import OMISLocalHeader from './OMISLocalHeader'
import { getIncompleteFields } from './transformers'

import ContactTable from './WorkOrderTables/ContactTable'
import AssigneesTable from './WorkOrderTables/AssigneesTable'
import SubscribersTable from './WorkOrderTables/SubscribersTable'
import QuoteInformationTable from './WorkOrderTables/QuoteInformationTable'
import InternalUseTable from './WorkOrderTables/InternalUseTable'
import InvoiceDetailsTable from './WorkOrderTables/InvoiceDetailsTable'
import OrderIncompleteFields from './OrderIncompleteFields'

const WorkOrder = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OrderAssigneesResource id={order.id}>
          {(assignees) => (
            <DefaultLayout
              heading={order.reference}
              pageTitle={`${order.reference} - Orders (OMIS)`}
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
                  text: order.reference,
                },
              ]}
              localHeaderChildren={
                order.status === STATUS.QUOTE_AWAITING_ACCEPTANCE ? (
                  <OrderQuoteResource id={order.id}>
                    {(quote) => <OMISLocalHeader order={order} quote={quote} />}
                  </OrderQuoteResource>
                ) : (
                  <OMISLocalHeader
                    order={order}
                    quote={null}
                    incompleteFields={getIncompleteFields(order, assignees)}
                  />
                )
              }
            >
              <>
                <OrderIncompleteFields order={order} assignees={assignees} />

                <ContactResource id={order.contact.id}>
                  {(contact) => (
                    <ContactTable order={order} contact={contact} />
                  )}
                </ContactResource>

                <AssigneesTable assignees={assignees} order={order} />

                <OrderSubscribersResource id={order.id}>
                  {(subscribers) => (
                    <SubscribersTable subscribers={subscribers} order={order} />
                  )}
                </OrderSubscribersResource>

                <QuoteInformationTable order={order} />

                <InternalUseTable order={order} />

                <CompanyResource id={order.company.id}>
                  {(company) => (
                    <InvoiceDetailsTable order={order} company={company} />
                  )}
                </CompanyResource>
              </>
            </DefaultLayout>
          )}
        </OrderAssigneesResource>
      )}
    </OrderResource>
  )
}

export default WorkOrder
