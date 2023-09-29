import React from 'react'
import { useParams } from 'react-router-dom'

import {
  DefaultLayout,
  FieldTextarea,
  FieldTypeahead,
  Form,
  FormLayout,
} from '../../components'
import ResourceOptionsField from '../../components/Form/elements/ResourceOptionsField'
import {
  OrderResource,
  OrderServiceTypesResource,
  SectorResource,
} from '../../components/Resource'
import urls from '../../../lib/urls'
import { TASK_EDIT_OMIS_INTERNAL_INFORMATION } from './state'
import { FORM_LAYOUT } from '../../../common/constants'
import {
  transformArrayForTypeahead,
  transformObjectForTypeahead,
} from '../Investments/Projects/transformers'
import { transformInternalInformationForApi } from './transformers'
import { idNamesToValueLabels } from '../../utils'

const EditInternalInformation = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <DefaultLayout
          heading="Edit internal information"
          pageTitle={`Edit internal information - ${order.reference} - Orders (OMIS)`}
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
            { text: 'Edit internal information' },
          ]}
        >
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="edit-order-internal-information"
              analyticsFormName="editOrderInternalInformation"
              submitButtonLabel="Save and return"
              cancelButtonLabel="Return without saving"
              cancelRedirectTo={() => urls.omis.order(order.id)}
              flashMessage={() => 'Internal information updated'}
              redirectTo={() => urls.omis.order(order.id)}
              submissionTaskName={TASK_EDIT_OMIS_INTERNAL_INFORMATION}
              transformPayload={(values) =>
                transformInternalInformationForApi({
                  orderId,
                  values,
                })
              }
            >
              <ResourceOptionsField
                name="service_types"
                label="Service types the order covers"
                resource={OrderServiceTypesResource}
                field={FieldTypeahead}
                isMulti={true}
                initialValue={transformArrayForTypeahead(order.serviceTypes)}
                resultToOptions={(result) =>
                  idNamesToValueLabels(
                    result.filter((option) => !option.disabledOn)
                  )
                }
              />
              <ResourceOptionsField
                name="sector"
                label="Sector"
                resource={SectorResource}
                field={FieldTypeahead}
                initialValue={transformObjectForTypeahead(order.sector)}
                placeholder="Choose a sector"
              />
              <FieldTextarea
                type="text"
                name="further_info"
                label="Internal notes and useful information (optional)"
                hint="For example, specific client requirements, market and distribution strategies or key deadlines"
                initialValue={order.furtherInfo}
              />
              <FieldTextarea
                type="text"
                name="existing_agents"
                label="Contacts the company already has in the market (optional)"
                hint="For example, partners, suppliers or distributors"
                initialValue={order.existingAgents}
              />
              <FieldTextarea
                type="text"
                name="contacts_not_to_approach"
                label="Specific people or organisations the company does not want DBT to talk to (optional)"
                initialValue={order.contactsNotToApproach}
              />
            </Form>
          </FormLayout>
        </DefaultLayout>
      )}
    </OrderResource>
  )
}

export default EditInternalInformation
