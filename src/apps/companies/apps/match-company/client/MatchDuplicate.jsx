import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import InsetText from '@govuk-react/inset-text'
import styled from 'styled-components'

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
        For some companies there are multiple (duplicate) records. To resolve
        this, and have this record automatically updated, you can{' '}
        <Link href={urls.support()}>
          contact support to request a merge of these records
        </Link>
        .
      </p>
      <p>
        Copy and paste the following instructions in the Desciption field of the
        form:
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

      <Link href={urls.companies.match.index(company.id)}>
        Back to search results
      </Link>
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
