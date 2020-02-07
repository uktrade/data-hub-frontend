import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import InsetText from '@govuk-react/inset-text'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import { FormActions } from 'data-hub-components'

import urls from '../../../../../lib/urls'

const StyledRoot = styled('div')`
  p:last-child {
    margin-bottom: 0;
  }
`

function MatchDuplicate({ company, dnbCompany }) {
  return (
    <StyledRoot>
      <p>
        This can happen when there are duplicate company records in Data Hub. To
        resolve this, you can ask the Support Team to merge these duplicates
        into one record.
      </p>
      <p>
        You can copy and paste the following instructions in the Description
        field of the form:
      </p>
      <InsetText>
        <p>
          <strong>Company records merge request</strong>
        </p>
        <p>
          Please merge company record {company.name} ({company.id}) with company
          record {dnbCompany.primary_name} ({dnbCompany.datahub_company_id}).
        </p>
      </InsetText>

      <FormActions>
        <Button as="a" href={urls.support()}>
          Request merge
        </Button>
        <Link href={urls.companies.match.index(company.id)}>
          Back to search results
        </Link>
      </FormActions>
    </StyledRoot>
  )
}

MatchDuplicate.props = {
  company: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  dnbCompany: PropTypes.shape({
    primary_name: PropTypes.string,
    duns_number: PropTypes.string,
    datahub_company_id: PropTypes.string,
  }).isRequired,
}

export default MatchDuplicate
