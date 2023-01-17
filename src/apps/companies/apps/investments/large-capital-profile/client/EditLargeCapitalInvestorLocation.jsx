import React from 'react'

import PropTypes from 'prop-types'
import {
  Form,
  Filters,
  FormLayout,
  FieldTextarea,
} from '../../../../../../client/components'
import { FORM_LAYOUT } from '../../../../../../common/constants'
import urls from '../../../../../../lib/urls'
import { TASK_SAVE_LARGE_CAPITAL_INVESTOR_LOCATION } from './state'
import {
  transformLocationDetailsToApi,
  transformNameIdToValueLabel,
} from './transformers'

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
            <Filters.Typeahead
              name="uk_region_locations"
              label="UK locations of interest"
              options={ukRegionLocations.items}
              selectedOptions={transformNameIdToValueLabel(
                ukRegionLocations?.value
              )}
              placeholder="-- Select region --"
              arial-label="Uk locations of interest"
              isMulti={true}
            />
            <Filters.Typeahead
              isMulti={true}
              label="Other countries the investor is considering"
              name="other_countries_being_considered"
              placeholder="-- Select country --"
              options={otherCountriesBeingConsidered.items}
              selectedOptions={transformNameIdToValueLabel(
                otherCountriesBeingConsidered?.value
              )}
              data-test="country-filter"
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

EditLargeCapitalInvestorLocation.prototype = {
  profileId: PropTypes.string.isRequired,
}

export default EditLargeCapitalInvestorLocation
