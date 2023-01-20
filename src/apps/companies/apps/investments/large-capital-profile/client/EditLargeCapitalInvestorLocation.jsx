import React from 'react'

import PropTypes from 'prop-types'
import {
  Form,
  FieldTypeahead,
  FormLayout,
  FieldTextarea,
} from '../../../../../../client/components'
import { FORM_LAYOUT } from '../../../../../../common/constants'
import urls from '../../../../../../lib/urls'
import { TASK_SAVE_LARGE_CAPITAL_INVESTOR_LOCATION } from './state'
import { transformLocationDetailsToApi } from './transformers'
import { transformArrayIdNameToValueLabel } from '../../../../../../client/transformers'

const EditLargeCapitalInvestorLocation = ({
  companyId,
  profileId,
  ukRegionLocations,
  otherCountriesBeingConsidered,
  notesOnInvestorsLocation,
}) => {
  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      <Form
        id="edit-large-capital-investor-location"
        analyticsFormName="EditLargeCapitalInvestorLocation"
        cancelButtonLabel="Return without saving"
        cancelRedirectTo={() =>
          urls.companies.investments.largeCapitalProfile(companyId)
        }
        flashMessage={() => 'Investor location details changes saved'}
        submitButtonLabel="Save and return"
        submissionTaskName={TASK_SAVE_LARGE_CAPITAL_INVESTOR_LOCATION}
        redirectTo={() =>
          urls.companies.investments.largeCapitalProfile(companyId)
        }
        transformPayload={(values) =>
          transformLocationDetailsToApi({ profileId, companyId, values })
        }
      >
        {() => (
          <>
            <FieldTypeahead
              name="uk_region_locations"
              label="UK locations of interest"
              initialValue={transformArrayIdNameToValueLabel(
                ukRegionLocations?.value
              )}
              options={ukRegionLocations.items}
              placeholder="-- Select region --"
              arial-label="Uk locations of interest"
              isMulti={true}
            />
            <FieldTypeahead
              name="other_countries_being_considered"
              label="Other countries the investor is considering"
              initialValue={transformArrayIdNameToValueLabel(
                otherCountriesBeingConsidered?.value
              )}
              options={otherCountriesBeingConsidered.items}
              placeholder="-- Select country --"
              arial-label="Other countries the investor is considering"
              isMulti={true}
            />
            <FieldTextarea
              name="notes_on_locations"
              label="Notes on investor's location preferences"
              initialValue={notesOnInvestorsLocation}
              type="text"
            />
          </>
        )}
      </Form>
    </FormLayout>
  )
}

// const arrayProp = PropTypes.shape({
//   label: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
// })
// EditLargeCapitalInvestorLocation.prototype = {
//   profileId: PropTypes.string.isRequired,
//   companyId: PropTypes.string.isRequired,
//   ukRegionLocations: PropTypes.arrayOf(arrayProp),
//   otherCountriesBeingConsidered: PropTypes.arrayOf(arrayProp),
//   notesOnInvestorsLocation: PropTypes.string.isRequired,
// }

export default EditLargeCapitalInvestorLocation
