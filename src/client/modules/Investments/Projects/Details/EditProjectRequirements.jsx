import React from 'react'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import {
  FieldAddress,
  FieldRadios,
  FieldTextarea,
  FieldTypeahead,
  Form,
} from '../../../../components'
import {
  CountriesResource,
  DeliveryPartnersResource,
  InvestmentResource,
  StrategicDriversResource,
} from '../../../../components/Resource'
import ResourceOptionsField from '../../../../components/Form/elements/ResourceOptionsField'
import { FieldUKRegionTypeahead } from '../../../../components/Form/elements/UKRegionOptions'
import { TASK_EDIT_INVESTMENT_PROJECT_REQUIREMENTS } from './state'
import urls from '../../../../../lib/urls'
import { transformArrayForTypeahead } from '../transformers'
import {
  transformBoolToRadioOptionWithNullCheck,
  transformProjectRequirementsForApi,
} from './transformers'
import {
  OPTIONS_YES_NO,
  OPTION_YES,
  UNITED_KINGDOM_ID,
} from '../../../../../common/constants'

import { idNamesToValueLabels } from '../../../../utils'
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import InvestmentName from '../InvestmentName'

const ukObject = {
  name: 'United Kingdom',
  id: UNITED_KINGDOM_ID,
}

const EditProjectRequirements = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      projectName={<InvestmentName id={projectId} />}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Edit requirements' },
      ]}
      pageTitle="Edit requirements"
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <>
            <H2 size={LEVEL_SIZE[3]}>Edit requirements and location</H2>
            <Form
              id="edit-project-requirements"
              analyticsFormName="editInvestmentProjectRequirements"
              cancelButtonLabel="Back"
              cancelRedirectTo={() =>
                urls.investments.projects.details(project.id)
              }
              flashMessage={() => 'Investment requirements updated'}
              submitButtonlabel="Save"
              redirectTo={() => urls.investments.projects.details(project.id)}
              submissionTaskName={TASK_EDIT_INVESTMENT_PROJECT_REQUIREMENTS}
              transformPayload={(values) =>
                transformProjectRequirementsForApi({
                  projectId,
                  values,
                })
              }
            >
              <ResourceOptionsField
                name="strategic_drivers"
                label="Strategic drivers behind this investment"
                resource={StrategicDriversResource}
                field={FieldTypeahead}
                initialValue={transformArrayForTypeahead(
                  project.strategicDrivers
                )}
                placeholder="Select a strategic driver"
                isMulti={true}
              />
              <FieldTextarea
                type="text"
                name="client_requirements"
                label="Client requirements"
                initialValue={project.clientRequirements || ''}
              />
              <FieldRadios
                name="client_considering_other_countries"
                label="Is the client considering other countries?"
                initialValue={transformBoolToRadioOptionWithNullCheck(
                  project.clientConsideringOtherCountries
                )}
                options={OPTIONS_YES_NO.map((option) => ({
                  ...option,
                  ...(option.value === OPTION_YES && {
                    children: (
                      <ResourceOptionsField
                        name="competitor_countries"
                        label="Competitor countries"
                        resource={CountriesResource}
                        field={FieldTypeahead}
                        initialValue={transformArrayForTypeahead(
                          project.competitorCountries
                        )}
                        placeholder="Choose a country"
                        isMulti={true}
                      />
                    ),
                  }),
                }))}
              />
              <FieldUKRegionTypeahead
                name="uk_region_locations"
                label="Possible UK locations for this investment"
                initialValue={transformArrayForTypeahead(
                  project.ukRegionLocations
                )}
                placeholder="Select a UK region"
                isMulti={true}
              />
              <FieldRadios
                name="site_decided"
                label="Has the UK location (site address) for this investment been decided yet?"
                initialValue={transformBoolToRadioOptionWithNullCheck(
                  project.siteDecided
                )}
                options={OPTIONS_YES_NO.map((option) => ({
                  ...option,
                  ...(option.value === OPTION_YES && {
                    children: (
                      <>
                        <FieldAddress
                          legend="Address"
                          name="address"
                          country={ukObject}
                          hideCountyField={true}
                          useStaticPostcodeField={true}
                          initialValue={{
                            address1: project.address1 || '',
                            address2: project.address2 || '',
                            town: project.addressTown || '',
                            postcode: project.addressPostcode || '',
                          }}
                        />
                        <FieldUKRegionTypeahead
                          name="actual_uk_regions"
                          label="UK regions landed"
                          initialValue={transformArrayForTypeahead(
                            project.actualUkRegions
                          )}
                          placeholder="Select a UK region"
                          isMulti={true}
                        />
                      </>
                    ),
                  }),
                }))}
              />
              <ResourceOptionsField
                name="delivery_partners"
                label="Delivery partners"
                resource={DeliveryPartnersResource}
                field={FieldTypeahead}
                initialValue={transformArrayForTypeahead(
                  project.deliveryPartners
                )}
                placeholder="Select a delivery partner"
                isMulti={true}
                resultToOptions={(result) =>
                  idNamesToValueLabels(
                    result.filter((option) => !option.disabledOn)
                  )
                }
              />
            </Form>
          </>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

export default EditProjectRequirements
