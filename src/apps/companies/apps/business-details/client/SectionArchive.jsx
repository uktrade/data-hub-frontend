import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, GREY_3 } from 'govuk-colours'
import Button from '@govuk-react/button'
import { ButtonLink } from '../../../../../client/components/'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import axios from 'axios'

import {
  FormStateful,
  FormActions,
  FieldRadios,
  FieldInput,
} from '../../../../../client/components'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const SectionArchive = ({ isArchived, isDnbCompany, urls }) => {
  const [formIsOpen, setFormIsOpen] = useState(false)

  if (isArchived || isDnbCompany) {
    return null
  }

  const archiveSubmitCallback = async (values) => {
    await axios({
      method: 'POST',
      url: urls.companyArchive,
      data: values,
    })
    return urls.companyBusinessDetails
  }

  return (
    <div data-auto-id="archiveCompanyContainer">
      <StyledSectionHeader>Archive company</StyledSectionHeader>

      <p>Archive this company if it is no longer required or active.</p>

      {formIsOpen && (
        <FormStateful onSubmit={archiveSubmitCallback} scrollToTop={false}>
          <FieldRadios
            label="Archive reason"
            name="archived_reason"
            required="Select a reason"
            options={[
              { label: 'Company is dissolved', value: 'Company is dissolved' },
              {
                label: 'Other',
                value: 'Other',
                children: (
                  <FieldInput label="Other" name="archived_reason_other" />
                ),
              },
            ]}
          />

          <FormActions>
            <Button>Archive</Button>
            <ButtonLink onClick={() => setFormIsOpen(false)}>Cancel</ButtonLink>
          </FormActions>
        </FormStateful>
      )}

      {!formIsOpen && (
        <Button
          onClick={() => setFormIsOpen(true)}
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
        >
          Archive
        </Button>
      )}
    </div>
  )
}

SectionArchive.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionArchive
