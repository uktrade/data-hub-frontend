import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { H2 } from '@govuk-react/heading'
import { LEVEL_SIZE } from '@govuk-react/constants'

function LeadAdvisers ({ company, pageUrl, hasPermission, isItaTierDAccount }) {
  const renderIsNotItaTierDAccount =
    <div>
      <H2 size={LEVEL_SIZE[3]}>Lead ITA for {company}</H2>
      <p>This company has no Lead ITA</p>
      <p>An ITA (International Trade Adviser) can add themselves as the Lead ITA, which will be visible to all Data Hub
        users on the company page and any of its subsidiaries.</p>
      {hasPermission && <Button
        as={Link}
        href={pageUrl}
      >
        Add myself as Lead ITA
      </Button>}
    </div>

  const renderIsItaTierDAccount =
    <div>
      <H2 size={LEVEL_SIZE[3]}>Table to go here</H2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.</p>
    </div>

  return isItaTierDAccount
    ? renderIsItaTierDAccount
    : renderIsNotItaTierDAccount
}

LeadAdvisers.propTypes = {
  company: PropTypes.object.isRequired,
  pageUrl: PropTypes.string.isRequired,
  hasPermission: PropTypes.bool.isRequired,
}

export default LeadAdvisers
