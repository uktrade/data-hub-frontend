import React from 'react'
import { useParams } from 'react-router-dom'
import { CompanyResource } from '../../../components/Resource'
import { H2, H4, Link } from 'govuk-react'
import Button from '@govuk-react/button'
import urls from '../../../../lib/urls'
import { format } from '../../../../client/utils/date'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { DARK_GREY, GREY_3, TEXT_COLOUR } from '../../../utils/colours'
import { DefaultLayout } from '../../../components'

const LastUpdatedHeading = styled(H4)`
  color: ${DARK_GREY};
  font-weight: normal;
  margin-top: -25px;
`

const Strategy = ({ company }) => (
  <>
    <GridRow>
      <GridCol>
        <H2>Strategy</H2>
      </GridCol>
      {company.strategy && (
        <div>
          <Link
            href={urls.companies.accountManagement.create(company.id)}
            data-test="edit-strategy-link"
          >
            Edit
          </Link>
        </div>
      )}
    </GridRow>

    {company.strategy && (
      <>
        <GridCol>
          <GridRow>
            <LastUpdatedHeading data-test="last-updated-details">
              <span>{`Last updated by ${company?.modifiedBy?.name}: ${format(
                company.modifiedOn
              )}. `}</span>
              <span>
                View changes in{' '}
                <Link
                  href={urls.companies.editHistory.index(company.id)}
                  data-test="edit-history-link"
                >
                  Edit history page
                </Link>
              </span>
            </LastUpdatedHeading>
          </GridRow>
        </GridCol>
        <p>{company.strategy}</p>
      </>
    )}

    {!company.strategy && (
      <Button
        data-test="add-strategy-button"
        as={Link}
        href={urls.companies.accountManagement.create(company.id)}
        buttonColour={GREY_3}
        buttonTextColour={TEXT_COLOUR}
      >
        Add strategy
      </Button>
    )}
  </>
)

const AccountManagement = ({}) => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          heading={'Account Management'}
          pageTitle={'Account Management'}
          breadcrumbs={[{ text: 'Account Management' }]}
          useReactRouter={false}
        >
          <Strategy company={company} />
        </DefaultLayout>
      )}
    </CompanyResource>
  )
}

export default AccountManagement
