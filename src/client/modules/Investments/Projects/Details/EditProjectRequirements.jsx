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
import {
  isFieldOptionalForStageLabel,
  validateFieldForStage,
} from '../validators'
import {
  isUkRegionLocationsRequiredForStage,
  siteDecidedValidator,
} from './validators'

const ukObject = {
  name: 'United Kingdom',
  id: UNITED_KINGDOM_ID,
}

const EditProjectRequirements = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
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
                label={
                  'Strategic drivers behind this investment' +
                  isFieldOptionalForStageLabel('strategic_drivers', project)
                }
                resource={StrategicDriversResource}
                field={FieldTypeahead}
                initialValue={transformArrayForTypeahead(
                  project.strategicDrivers
                )}
                placeholder="Select a strategic driver"
                isMulti={true}
                validate={(values, field, formFields) => {
                  return validateFieldForStage(
                    field,
                    formFields,
                    project,
                    'Select a strategic driver'
                  )
                }}
              />
              <FieldTextarea
                type="text"
                name="client_requirements"
                label={
                  'Client requirements' +
                  isFieldOptionalForStageLabel('client_requirements', project)
                }
                initialValue={project.clientRequirements || ''}
                validate={(values, field, formFields) => {
                  return validateFieldForStage(
                    field,
                    formFields,
                    project,
                    'Enter client requirements'
                  )
                }}
              />
              <FieldRadios
                name="client_considering_other_countries"
                label={
                  'Is the client considering other countries?' +
                  (isUkRegionLocationsRequiredForStage(project)
                    ? ''
                    : ' (optional)')
                }
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
                validate={(values, field, formFields) => {
                  return validateFieldForStage(
                    field,
                    formFields,
                    project,
                    'Select other countries considered'
                  )
                }}
              />
              <FieldUKRegionTypeahead
                name="uk_region_locations"
                label={
                  'Possible UK locations for this investment' +
                  (isUkRegionLocationsRequiredForStage(project)
                    ? ''
                    : ' (optional)')
                }
                initialValue={transformArrayForTypeahead(
                  project.ukRegionLocations
                )}
                placeholder="Select a UK region"
                isMulti={true}
                validate={(values, field, formFields) => {
                  return isUkRegionLocationsRequiredForStage(project) &&
                    !formFields.values[field.name]
                    ? 'Select a possible UK location'
                    : null
                }}
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
                          label={
                            'UK regions landed' +
                            isFieldOptionalForStageLabel(
                              'actual_uk_regions',
                              project
                            )
                          }
                          initialValue={transformArrayForTypeahead(
                            project.actualUkRegions
                          )}
                          placeholder="Select a UK region"
                          isMulti={true}
                          validate={(values, field, formFields) => {
                            return validateFieldForStage(
                              field,
                              formFields,
                              project,
                              'Select a UK region'
                            )
                          }}
                        />
                      </>
                    ),
                  }),
                }))}
                validate={(values, field, formFields) => {
                  return siteDecidedValidator(field, formFields, project)
                }}
              />
              <ResourceOptionsField
                name="delivery_partners"
                label={
                  'Delivery partners' +
                  isFieldOptionalForStageLabel('investor_type', project)
                }
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
                validate={(values, field, formFields) => {
                  return validateFieldForStage(
                    field,
                    formFields,
                    project,
                    'Select a delivery partner'
                  )
                }}
              />
            </Form>
          </>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

export default EditProjectRequirements
