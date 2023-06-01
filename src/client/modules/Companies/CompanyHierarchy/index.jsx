import React, { useEffect, useState } from 'react'
import { Button, H2, Link } from 'govuk-react'
import Task from '../../../components/Task'
import { TASK_GET_COMPANY_DETAIL } from '../CompanyDetails/state'
import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { COMPANY_LOADED, DNB_FAMILY_TREE_LOADED } from '../../../actions'
import { useParams } from 'react-router-dom'
import { ID, TASK_GET_DNB_FAMILY_TREE, state2props } from './state'
import { connect } from 'react-redux'
import urls from '../../../../lib/urls'
import { DefaultLayout } from '../../../components'
import AccessDenied from '../../../components/AccessDenied'
import styled from 'styled-components'
import {
  GREY_2,
  GREY_4,
  BLACK,
  DARK_BLUE_LEGACY,
  WHITE,
} from '../../../utils/colours'
import { isEmpty } from 'lodash'

const HierarchyContents = styled.div`
  padding-bottom: 10px;
`

const HierarchyItemContents = styled.div`
  background-color: ${({ isRequestedCompanyId }) =>
    isRequestedCompanyId ? DARK_BLUE_LEGACY : GREY_4};
  border: 1px solid ${GREY_2};
  min-height: 60px;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  ${({ isRequestedCompanyId }) =>
    isRequestedCompanyId &&
    `
    color: ${WHITE};
  `}
  ${Link} {
    width: fit-content;
    ${({ isRequestedCompanyId }) =>
      isRequestedCompanyId &&
      `
    color: ${WHITE};
  `}
  }
`

const SubsidiaryItem = styled.div`
  padding-left: 25px;
  margin-top: 20px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`
const StyledButton = styled(Button)``

const ToggleSubsidiariesButtonContent = styled.div`
  padding-top: 20px;
  ${StyledButton} {
    margin-bottom: 0px;
    span:nth-child(1) {
      padding-right: 10px;
    }
  }
`

const ToggleSubsidiariesButton = ({
  isOpen,
  onClick,
  count,
  dataTest = 'toggle-subsidiaries-button',
}) => (
  <ToggleSubsidiariesButtonContent>
    <StyledButton
      buttonColour={GREY_4}
      buttonTextColour={BLACK}
      aria-expanded={isOpen}
      onClick={() => onClick(!isOpen)}
      data-test={dataTest}
    >
      <span>{isOpen ? `-` : `+`}</span>
      <span>
        {isOpen
          ? `Hide ${count} verified subsidiaries`
          : `Show ${count} verified subsidiaries`}
      </span>
    </StyledButton>
  </ToggleSubsidiariesButtonContent>
)

const Subsidiaries = ({
  company,
  hierarchy,
  isOpen,
  setIsOpen,
  fullTreeExpanded,
}) =>
  Array.isArray(company.subsidiaries) &&
  company.subsidiaries.length > 0 && (
    <>
      <ToggleSubsidiariesButton
        isOpen={isOpen}
        onClick={setIsOpen}
        count={company.subsidiaries.length}
      />
      <SubsidiaryItem hierarchy={hierarchy} isOpen={isOpen}>
        {company.subsidiaries.map((subsidary, index) => (
          <HierarchyItem
            company={subsidary}
            hierarchy={subsidary.hierarchy}
            fullTreeExpanded={fullTreeExpanded}
            key={`hierarchy_${index}`}
          />
        ))}
      </SubsidiaryItem>
    </>
  )

const HierarchyHeader = ({ count, className, fullTreeExpanded, onClick }) => (
  <div className={className}>
    <H2>
      {count}
      <span> companies</span>
    </H2>
    {count > 1 && (
      <ToggleSubsidiariesButton
        count={count}
        onClick={onClick}
        isOpen={fullTreeExpanded}
        dataTest="expand-tree-button"
      />
    )}
  </div>
)

const StyledHierarchyHeader = styled(HierarchyHeader)`
  display: flex;
  justify-content: space-between;
  align-items: bottom;
  border-bottom: 4px solid ${BLACK};
  ${ToggleSubsidiariesButtonContent} {
    padding-top: 0px;
  }
  > h2 {
    margin-bottom: 10px;
    > span {
      font-size: 24px;
    }
  }
`

const Hierarchy = ({ requestedCompanyId, familyTree }) => {
  const [fullTreeExpanded, setFullTreeExpanded] = useState(undefined)
  return isEmpty(familyTree) ? (
    <div data-test="empty-hierarchy">
      No hierarchy could be found for this company
    </div>
  ) : (
    <HierarchyContents data-test="hierarchy-contents">
      <StyledHierarchyHeader
        count={familyTree.ultimate_global_companies_count}
        fullTreeExpanded={fullTreeExpanded}
        onClick={setFullTreeExpanded}
      />
      <HierarchyItem
        fullTreeExpanded={fullTreeExpanded}
        requestedCompanyId={requestedCompanyId}
        company={familyTree.ultimate_global_company}
        hierarchy={familyTree.ultimate_global_company.hierarchy}
      />
    </HierarchyContents>
  )
}

const HierarchyItem = ({
  requestedCompanyId,
  company,
  hierarchy,
  fullTreeExpanded,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (fullTreeExpanded !== undefined) {
      setIsOpen(fullTreeExpanded)
    }
  }, [fullTreeExpanded])

  return (
    <div data-test="hierarchy-item">
      <HierarchyItemContents
        hierarchy={hierarchy}
        isRequestedCompanyId={requestedCompanyId === company.id}
        data-test={
          requestedCompanyId === company.id
            ? 'requested-company'
            : 'related-company'
        }
      >
        {company.id ? (
          <Link
            href={urls.companies.detail(company.id)}
            aria-label={`Go to ${company.name} details`}
          >
            {company.name}
          </Link>
        ) : (
          <span>{`${company.name} (not on Data Hub)`}</span>
        )}
      </HierarchyItemContents>
      <Subsidiaries
        company={company}
        hierarchy={hierarchy}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fullTreeExpanded={fullTreeExpanded}
      />
    </div>
  )
}

const breadcrumbs = (company) =>
  !company
    ? []
    : [
        {
          link: urls.dashboard(),
          text: 'Home',
        },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        {
          link: urls.companies.detail(company.id),
          text: company.name,
        },
        {
          link: urls.companies.businessDetails(company.id),
          text: 'Business details',
        },
        {
          text: 'Related companies',
        },
      ]

const CompanyHierarchy = ({ company, familyTree }) => {
  const { companyId } = useParams()
  if (company && !company.global_ultimate_duns_number) {
    return (
      <AccessDenied
        breadcrumbs={[
          {
            link: urls.dashboard(),
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
          company &&
          familyTree && (
            <Hierarchy
              requestedCompanyId={companyId}
              familyTree={familyTree}
            ></Hierarchy>
          )
        }
      </Task.Status>
      <Task.Status
        name={TASK_GET_DNB_FAMILY_TREE}
        id={ID}
        startOnRender={{
          payload: { companyId: companyId },
          onSuccessDispatch: DNB_FAMILY_TREE_LOADED,
        }}
      />
    </DefaultLayout>
  )
}

export default connect(state2props)(CompanyHierarchy)
