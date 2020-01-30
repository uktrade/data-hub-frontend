import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import Paragraph from '@govuk-react/paragraph'

import urls from '../../../../../lib/urls'

function CannotFindMatch({ companyId }) {
  return (
    <>
      <Paragraph>
        The message on the company page asking to update this record will remain
        visible, so you or other Data Hub users can try (again) to find the
        matching Dun & Bradstreet record.
      </Paragraph>
      <Paragraph>
        In the meantime you can continue to add interaction or other activity
        for this company record.
      </Paragraph>
      <Link href={urls.companies.detail(companyId)}>
        Return to the company page
      </Link>
    </>
  )
}

CannotFindMatch.props = {
  companyId: PropTypes.string.isRequired,
}

export default CannotFindMatch
