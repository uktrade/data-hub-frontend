import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { get } from 'lodash'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import { SPACING_POINTS } from '@govuk-react/constants'

import SectionAbout from './SectionAbout'
import SectionAddresses from './SectionAddresses'
import SectionHierarchy from './SectionHierarchy'
import SectionRegion from './SectionRegion'
import SectionSector from './SectionSector'
import SectionOneList from './SectionOneList'
import SectionDocuments from './SectionDocuments'
import ArchiveForm from '../../../../../client/components/ArchiveForm'
import { StatusMessage } from '../../../../../client/components/'
import { COMPANY_DISSOLVED_OPTION } from '../../../constants'
import ArchivePanel from '../../../../../client/components/ArchivePanel'

import {
  ID as CHECK_PENDING_REQUEST_ID,
  TASK_ARCHIVE_COMPANY,
  state2props,
} from './state'
import { DNB__CHECK_PENDING_REQUEST } from '../../../../../client/actions'
import Task from '../../../../../client/components/Task'

const { format } = require('../../../../../client/utils/date')

const StyledRoot = styled('div')`
  & > table {
    margin-top: ${SPACING_POINTS[8]}px;
    margin-bottom: ${SPACING_POINTS[8]}px;
  }
`

const CompanyBusinessDetails = ({
  businessDetails,
  subsidiariesCount,
  dnbRelatedCompaniesCount,
  globalUltimate,
  canEditOneList,
  urls,
  isDnbPending,
}) => {
  const isGlobalHQ = get(businessDetails, 'headquarter_type.name') === 'ghq'
  const isGlobalUltimate = !!businessDetails.is_global_ultimate
  const isDnbCompany = !!businessDetails.duns_number
  const isArchived = !!businessDetails.archived
  const isBasedInUK = !!businessDetails.uk_based
  const lastUpdated = [
    businessDetails.dnb_modified_on,
    businessDetails.modified_on,
    businessDetails.created_on,
  ]
    .filter(Boolean)
    .sort()
    .reverse()[0]

  return (
    <StyledRoot>
      <div>
        This page shows information about this business and how it is related to
        other businesses.
      </div>
      <div>
        Changes made to this information can be found on the{' '}
        <Link href={urls.companyEditHistory}>Edit history page</Link>.
      </div>
      {lastUpdated && <div>Last updated on: {format(lastUpdated)}</div>}
      {isArchived && (
        <ArchivePanel
          archivedBy={businessDetails.archived_by}
          archivedOn={businessDetails.archived_on}
          archiveReason={businessDetails.archived_reason}
          unarchiveUrl={urls.companyUnarchive}
          type="company"
        />
      )}
      <Task.Status
        name={DNB__CHECK_PENDING_REQUEST}
        id={CHECK_PENDING_REQUEST_ID}
        progressMessage="Checking for pending change requests"
        startOnRender={{
          payload: businessDetails.duns_number,
          onSuccessDispatch: DNB__CHECK_PENDING_REQUEST,
        }}
      >
        {() =>
          isDnbPending && (
            <>
              <br />
              <StatusMessage>
                Changes to these business details are currently being reviewed.
              </StatusMessage>
            </>
          )
        }
      </Task.Status>
      {isDnbCompany && (
        <Details
          summary="Are these business details right?"
          data-test="businessDetailsWhereDoesInformation"
        >
          <p>
            Most business details have been verified by trusted third-parties to
            keep them updated automatically. Business description, region and
            sector are not updated by third parties.
          </p>
          <p>
            <strong>Think some details are wrong?</strong> ‘Edit’ and ‘Submit’
            new details for review.
          </p>
        </Details>
      )}
      <SectionAbout
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />
      <SectionAddresses
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />
      <SectionRegion
        businessDetails={businessDetails}
        isArchived={isArchived}
        isBasedInUK={isBasedInUK}
        urls={urls}
      />
      <SectionSector
        businessDetails={businessDetails}
        isArchived={isArchived}
        urls={urls}
      />
      <SectionOneList
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />
      <SectionHierarchy
        businessDetails={businessDetails}
        subsidiariesCount={subsidiariesCount}
        dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        isGlobalUltimate={isGlobalUltimate}
        isGlobalHQ={isGlobalHQ}
        globalUltimate={globalUltimate}
        urls={urls}
      />
      <SectionDocuments urls={urls} />
      <ArchiveForm
        type="company"
        id={CHECK_PENDING_REQUEST_ID}
        submissionTaskName={TASK_ARCHIVE_COMPANY}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        analyticsFormName="archiveCompany"
        redirectUrl={urls.companyBusinessDetails}
        transformPayload={(values) => ({
          values,
          urls,
        })}
        archiveReasons={[
          {
            label: COMPANY_DISSOLVED_OPTION,
            value: COMPANY_DISSOLVED_OPTION,
          },
        ]}
      />
      {canEditOneList && (
        <Button as={Link} href={urls.editOneList}>
          Edit One List Information
        </Button>
      )}
    </StyledRoot>
  )
}

CompanyBusinessDetails.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
  subsidiariesCount: PropTypes.number,
  dnbRelatedCompaniesCount: PropTypes.number,
  globalUltimate: PropTypes.object,
  canEditOneList: PropTypes.bool,
}

CompanyBusinessDetails.defaultProps = {
  subsidiariesCount: 0,
  dnbRelatedCompaniesCount: 0,
}

export default connect(state2props)(CompanyBusinessDetails)
