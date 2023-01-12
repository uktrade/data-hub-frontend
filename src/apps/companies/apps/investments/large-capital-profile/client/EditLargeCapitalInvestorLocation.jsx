import React from 'react'

import PropTypes from 'prop-types'
import {
  Form,
  FieldTypeahead,
  FormLayout,
  Typeahead,
  FieldTextarea,
} from '../../../../../../client/components'
import { FORM_LAYOUT } from '../../../../../../common/constants'
import urls from '../../../../../../lib/urls'
import { FieldUKRegionTypeahead } from '../../../../../../client/components/Form/elements/UKRegionOptions'
import FieldCountrySelect from '../../../../../../client/components/Form/elements/FieldCountrySelect'

const EditLargeCapitalInvestorLocation = ({
  companyId,
  profileId,
  ukRegionLocations,
  otherCountriesBeingConsidered,
}) => {
  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      <Form
        id="edit-large-capital-investor-location"
        //Todo: analyticsFormName="editLargeCapitalInvestorDetails"
        cancelButtonLabel="Return without saving"
        cancelRedirectTo={() =>
          urls.companies.investments.largeCapitalProfile(companyId)
        }
        flashMessage={() => 'Investor location details changes saved'}
        submitButtonLabel="Save and return"
        //Todo: submissionTaskName={TASK_SAVE_LARGE_CAPITAL_INVESTOR_DETAILS}
        redirectTo={() =>
          urls.companies.investments.largeCapitalProfile(companyId)
        }
        //Todo: transformPayload={(values) =>
        //   transformInvestorDetailsToApi({ profileId, companyId, values })
        // }
      >
        {() => (
          <>
            <FieldUKRegionTypeahead
              name="uk_region_locations"
              label="UK locations of interest"
              //Todo: initialValue={transformObjectToValueLabel(investorType)}
              //Todo: options={transformIdNameToValueLabel(investorType?.items)}
              placeholder="-- Select region --"
              arial-label="Uk locations of interest"
              isMulti={true}
            />
            <FieldCountrySelect
              isMulti={true}
              label="Other countries the investor is considering"
              name="other_countries_being_considered"
              placeholder="-- Select country --"
              options={otherCountriesBeingConsidered}
            />
            <FieldTextarea
              name="notes_on_locations"
              label="Notes on investor's location preferences"
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
