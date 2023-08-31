import React from 'react'

import PropTypes from 'prop-types'
import {
  Form,
  FieldTypeahead,
  FormLayout,
  FieldTextarea,
} from '../../../../components'
import { FORM_LAYOUT } from '../../../../../common/constants'
import { TASK_UPDATE_LARGE_CAPITAL_PROFILE } from './state'
import { getReturnLink, transformLocationDetailsToApi } from './transformers'
import { transformArrayIdNameToValueLabel } from '../../../../transformers'
import { FieldUKRegionTypeahead } from '../../../../components/Form/elements/UKRegionOptions'
import { CountriesResource } from '../../../../components/Resource'

const EditLocationForm = ({ profile }) => {
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
            cancelRedirectTo={() => getReturnLink(investorCompany.id)}
            flashMessage={() => 'Investor location details changes saved'}
            submitButtonLabel="Save and return"
            submissionTaskName={TASK_UPDATE_LARGE_CAPITAL_PROFILE}
            redirectTo={() => getReturnLink(investorCompany.id)}
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
                  aria-label="Uk locations of interest"
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
                  aria-label="Other countries the investor is considering"
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

EditLocationForm.propTypes = {
  profile: PropTypes.object.isRequired,
}

export default EditLocationForm
