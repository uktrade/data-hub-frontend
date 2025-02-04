import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import { SPACING_POINTS } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import SectionAbout from './SectionAbout'
import SectionAddresses from './SectionAddresses'
import SectionHierarchy from './SectionHierarchy'
import SectionRegion from './SectionRegion'
import SectionSector from './SectionSector'
import SectionOneList from './SectionOneList'
import ArchiveForm from '../../../components/ArchiveForm'
import { StatusMessage } from '../../../components'
import {
  CompanyResource,
  RelatedCompaniesCountResource,
} from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import Task from '../../../components/Task'
import urls from '../../../../lib/urls'
import { formatDate, DATE_FORMAT_COMPACT } from '../../../utils/date-utils'

import {
  ID,
  TASK_ARCHIVE_COMPANY,
  TASK_GET_GLOBAL_ULTIMATE,
  state2props,
} from './state'
import {
  COMPANIES__GLOBAL_ULTIMATE_LOADED,
  DNB__CHECK_PENDING_REQUEST,
} from '../../../actions'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

const StyledRoot = styled('div')`
  & > table {
    margin-top: ${SPACING_POINTS[8]}px;
    margin-bottom: ${SPACING_POINTS[8]}px;
  }
`
const isDnbCompany = (dunsNumber) => !!dunsNumber
const isArchived = (archived) => !!archived
const lastUpdated = (company) =>
  [company.dnbModifiedOn, company.modifiedOn, company.createdOn]
    .filter(Boolean)
    .sort()
    .reverse()[0]
const canEditOneList = (company, user, permissions) =>
  company.oneListAccountOwner == user ||
  (permissions &&
    permissions.includes('company.change_company') &&
    permissions.includes('company.change_one_list_core_team_member') &&
    permissions.includes(
      'company.change_one_list_tier_and_global_account_manager'
    ))

const COMPANY_DISSOLVED_OPTION = 'Company is dissolved'

const CompanyBusinessDetails = ({
  globalUltimate,
  isDnbPending,
  csrfToken,
  userPermissions,
  user,
}) => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Business details' }]}
            csrfToken={csrfToken}
            pageTitle="Business details"
          >
            <StyledRoot>
              <div>
                This page shows information about this business and how it is
                related to other businesses.
              </div>
              <div>
                Changes made to this information can be found on the{' '}
                <Link href={urls.companies.editHistory.index(companyId)}>
                  Edit history page
                </Link>
                .
              </div>
              {lastUpdated(company) && (
                <div>
                  Last updated on:{' '}
                  {formatDate(lastUpdated(company), DATE_FORMAT_COMPACT)}
                </div>
              )}
              <Task.Status
                name={DNB__CHECK_PENDING_REQUEST}
                id={ID}
                progressMessage="Checking for pending change requests"
                startOnRender={{
                  payload: company.dunsNumber,
                  onSuccessDispatch: DNB__CHECK_PENDING_REQUEST,
                }}
              >
                {() =>
                  isDnbPending && (
                    <>
                      <br />
                      <StatusMessage>
                        Changes to these business details are currently being
                        reviewed.
                      </StatusMessage>
                    </>
                  )
                }
              </Task.Status>
              {isDnbCompany(company.dunsNumber) && (
                <Details
                  summary="Are these business details right?"
                  data-test="businessDetailsWhereDoesInformation"
                >
                  <p>
                    Most business details have been verified by trusted
                    third-parties to keep them updated automatically. Business
                    description, region and sector are not updated by third
                    parties.
                  </p>
                  <p>
                    <strong>Think some details are wrong?</strong> ‘Edit’ and
                    ‘Submit’ new details for review.
                  </p>
                </Details>
              )}
              <SectionAbout
                company={company}
                isArchived={isArchived(company.archived)}
                isDnbCompany={isDnbCompany(company.dunsNumber)}
              />
              <SectionAddresses
                company={company}
                isArchived={isArchived(company.archived)}
                isDnbCompany={isDnbCompany(company.dunsNumber)}
              />
              <SectionRegion
                company={company}
                isArchived={isArchived(company.archived)}
              />
              <SectionSector
                company={company}
                isArchived={isArchived(company.archived)}
              />
              <SectionOneList
                company={company}
                isArchived={isArchived(company.archived)}
                isDnbCompany={isDnbCompany(company.dunsNumber)}
              />
              <Task.Status
                name={TASK_GET_GLOBAL_ULTIMATE}
                id={ID}
                progressMessage="laoding subsidiary details"
                startOnRender={{
                  payload: company.globalUltimateDunsNumber,
                  onSuccessDispatch: COMPANIES__GLOBAL_ULTIMATE_LOADED,
                }}
              >
                {() =>
                  company.dunsNumber ? (
                    <RelatedCompaniesCountResource id={company.id}>
                      {(relatedCompanies) => (
                        <>
                          <SectionHierarchy
                            company={company}
                            subsidiariesCount={
                              relatedCompanies.manuallyLinkedSubsidiariesCount
                            }
                            dnbRelatedCompaniesCount={
                              relatedCompanies.relatedCompaniesCount
                            }
                            isArchived={isArchived(company.archived)}
                            isDnbCompany={isDnbCompany(company.dunsNumber)}
                            globalUltimate={globalUltimate}
                          />
                        </>
                      )}
                    </RelatedCompaniesCountResource>
                  ) : (
                    <>
                      <SectionHierarchy
                        company={company}
                        subsidiariesCount={0}
                        dnbRelatedCompaniesCount={0}
                        isArchived={isArchived(company.archived)}
                        isDnbCompany={isDnbCompany(company.dunsNumber)}
                        globalUltimate={globalUltimate}
                      />
                    </>
                  )
                }
              </Task.Status>
              {canEditOneList(company, user, userPermissions) && (
                <Button as={'a'} href={urls.companies.editOneList(companyId)}>
                  Edit One List Information
                </Button>
              )}
              <ArchiveForm
                type="company"
                id={ID}
                submissionTaskName={TASK_ARCHIVE_COMPANY}
                isArchived={isArchived(company.archived)}
                isDnbCompany={isDnbCompany(company.dunsNumber)}
                analyticsFormName="archiveCompany"
                redirectUrl={urls.companies.businessDetails(companyId)}
                transformPayload={(values) => ({
                  values,
                  companyId,
                  csrfToken,
                })}
                archiveReasons={[
                  {
                    label: COMPANY_DISSOLVED_OPTION,
                    value: COMPANY_DISSOLVED_OPTION,
                  },
                ]}
              />
            </StyledRoot>
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

CompanyBusinessDetails.propTypes = {
  csrfToken: PropTypes.string,
  permissions: PropTypes.array,
  user: PropTypes.object,
}

export default connect(state2props)(CompanyBusinessDetails)
