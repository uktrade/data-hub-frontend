import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import Paragraph from '@govuk-react/paragraph'

import urls from '../../../../../lib/urls'

function CannotFindMatch({ companyId }) {
  return (
    <>
      <Paragraph>
        Thanks for trying to verify the business details on this Data Hub
        record.
      </Paragraph>
      <Paragraph>You can continue to use Data Hub as normal.</Paragraph>
      <br />
      <Link href={urls.companies.detail(companyId)}>
        Return to company record
      </Link>
    </>
  )
}

CannotFindMatch.props = {
  companyId: PropTypes.string.isRequired,
}

export default CannotFindMatch
