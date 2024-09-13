import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Task from '../../../components/Task'
import {
  TASK_GET_COMPANY_DETAIL,
  ID as COMPANY_DETAILS_ID,
} from '../CompanyDetails/state'
import { COMPANY_LOADED } from '../../../actions'
import { state2props } from './state'
import urls from '../../../../lib/urls'
import DnbHierarchy from '../../../../apps/companies/apps/dnb-hierarchy/client/DnbHierarchy'
import { DefaultLayout } from '../../../components'
import AccessDenied from '../../../components/AccessDenied'
import {
  StyledAnchorTag,
  StyledListItem,
} from '../../../components/CompanyTabbedLocalNavigation/CompanyLocalTab'
import { buildCompanyBreadcrumbs } from '../utils'

//These styled components are copied from the CompanyLocalTab file. They will all be deleted in
//the next ticket, adding here temporarily to avoid needing to refactor code thatis about to
//be deleted
const StyledGridRow = styled.div`
  margin-right: -15px;
  margin-left: -15px;
`

const StyledGridColumn = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 15px;
  @media (min-width: 840px) {
    width: 100%;
    float: left;
  }
`
const StyledNav = styled.nav`
  margin-bottom: 15px;
  color: #0b0c0c;
  margin-top: 5px;
  @media (min-width: 840px) {
    margin-bottom: 30px;
    margin-top: 5px;
  }
`

const StyledUnorderedList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  border-bottom: none;
  @media (max-width: 839px) {
    display: block;
    padding-bottom: 20px;
    border-bottom: 0;
  }
`

const StyledTabAnchorTag = styled(StyledAnchorTag)`
  width: 100%;
`

const StyledTabListItem = styled(StyledListItem)`
  flex-grow: 1;
  max-width: 50%;
`

const CompanyLocalTab = ({ navItem, index }) => {
  return (
    navItem && (
      <StyledTabListItem key={`tab-${index}`}>
        <StyledTabAnchorTag
          selected={navItem.isActive}
          href={navItem.url}
          id={`tab-${navItem.path}`}
          key={`tab-link-${navItem.path}`}
          aria-label={navItem.ariaDescription}
        >
          {navItem.label}
        </StyledTabAnchorTag>
      </StyledTabListItem>
    )
  )
}

const localTabItems = (company) => {
  if (!company) {
    return []
  }

  const tabItems = []
  if (company.is_global_ultimate) {
    tabItems.push({
      url: urls.companies.dnbHierarchy.index(company.id),
      path: '',
      label: 'Dun & Bradstreet hierarchy',
      isActive: true,
    })
  }
  if (company.is_global_headquarters) {
    tabItems.push({
      url: urls.companies.subsidiaries.index(company.id),
      path: '',
      label: 'Manually linked subsidiaries',
      isActive: false,
    })
  }
  return tabItems
}

const breadcrumbs = (company) =>
  !company
    ? []
    : buildCompanyBreadcrumbs(
        [
          {
            link: urls.companies.businessDetails(company.id),
            text: 'Business details',
          },
          {
            text: 'Related companies',
          },
        ],
        company.id,
        company.name
      )

const CompanyHierarchy = ({ company }) => {
  const { companyId } = useParams()
  if (company && !company.global_ultimate_duns_number) {
    return (
      <AccessDenied
        breadcrumbs={[
          {
            link: urls.dashboard.index(),
            text: 'Home',
          },
          {
            text: 'Companies',
          },
        ]}
      />
    )
  }

  return (
    <DefaultLayout
      heading={company ? `Company records related to ${company.name}` : ''}
      pageTitle={
        company
          ? `Related companies - Business details - ${company.name} - Companies - DBT Data Hub`
          : 'DBT Data Hub'
      }
      breadcrumbs={breadcrumbs(company)}
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_COMPANY_DETAIL}
        id={COMPANY_DETAILS_ID}
        progressMessage="Loading company details"
        startOnRender={{
          payload: companyId,
          onSuccessDispatch: COMPANY_LOADED,
        }}
      >
        {() =>
          company && (
            <>
              <StyledGridRow>
                <StyledGridColumn>
                  <StyledNav
                    aria-label="local navigation"
                    data-test="tabbedLocalNav"
                  >
                    <StyledUnorderedList data-test="tabbedLocalNavList">
                      {localTabItems(company).map((t, index) => (
                        <CompanyLocalTab navItem={t} index={index} />
                      ))}
                    </StyledUnorderedList>
                  </StyledNav>
                </StyledGridColumn>
              </StyledGridRow>

              <div id="dnb-hierarchy">
                <DnbHierarchy
                  dataEndpoint={urls.companies.dnbHierarchy.data(company.id)}
                  isGlobalHQ={company.is_global_headquarters}
                />
              </div>
            </>
          )
        }
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(CompanyHierarchy)
