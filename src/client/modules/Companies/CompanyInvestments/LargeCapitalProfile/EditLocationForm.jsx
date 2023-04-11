import React from 'react'

import PropTypes from 'prop-types'
import {
  Form,
  FieldTypeahead,
  FormLayout,
  FieldTextarea,
} from '../../../../components'
import { FORM_LAYOUT } from '../../../../../common/constants'
import urls from '../../../../../lib/urls'
import { TASK_SAVE_LARGE_CAPITAL_INVESTOR_LOCATION } from './state'
import { transformLocationDetailsToApi } from './transformers'
import { transformArrayIdNameToValueLabel } from '../../../../transformers'
import { FieldUKRegionTypeahead } from '../../../../components/Form/elements/UKRegionOptions'
import CountriesResource from '../../../../components/Resource/Countries'

const EditLargeCapitalInvestorLocation = ({ profile }) => {
  const {
    id: profileId,
    investorCompany,
    notesOnLocations,
    otherCountriesBeingConsidered,
    ukRegionLocations,
  } = profile

  return (
    <CountriesResource>
      {(countries) => (
        <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
          <Form
            id="edit-large-capital-investor-location"
            analyticsFormName="editLargeCapitalInvestorLocation"
            cancelButtonLabel="Return without saving"
            cancelRedirectTo={() =>
              urls.companies.investments.largeCapitalProfile(investorCompany.id)
            }
            flashMessage={() => 'Investor location details changes saved'}
            submitButtonLabel="Save and return"
            submissionTaskName={TASK_SAVE_LARGE_CAPITAL_INVESTOR_LOCATION}
            redirectTo={() =>
              urls.companies.investments.largeCapitalProfile(investorCompany.id)
            }
            transformPayload={(values) =>
              transformLocationDetailsToApi({
                profileId,
                companyId: investorCompany.id,
                values,
              })
            }
          >
            {() => (
              <>
                <FieldUKRegionTypeahead
                  name="uk_region_locations"
                  label="UK locations of interest"
                  initialValue={transformArrayIdNameToValueLabel(
                    ukRegionLocations
                  )}
                  placeholder="-- Select region --"
                  arial-label="Uk locations of interest"
                  isMulti={true}
                />
                <FieldTypeahead
                  name="other_countries_being_considered"
                  label="Other countries the investor is considering"
                  initialValue={transformArrayIdNameToValueLabel(
                    otherCountriesBeingConsidered
                  )}
                  options={transformArrayIdNameToValueLabel(countries)}
                  placeholder="-- Select country --"
                  arial-label="Other countries the investor is considering"
                  isMulti={true}
                />
                <FieldTextarea
                  name="notes_on_locations"
                  label="Notes on investor's location preferences"
                  initialValue={notesOnLocations}
                  type="text"
                />
              </>
            )}
          </Form>
        </FormLayout>
      )}
    </CountriesResource>
  )
}

EditLargeCapitalInvestorLocation.propTypes = {
  profile: PropTypes.object.isRequired,
}

export default EditLargeCapitalInvestorLocation
