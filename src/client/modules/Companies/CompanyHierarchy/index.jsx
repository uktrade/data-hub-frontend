import React, { useState } from 'react'
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

const HierarchyContents = styled.div`
  padding-bottom: 10px;
  ${StyledHierarchyHeader} {
    // background-color: red;
  }
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
  display: ${({ open }) => (open ? 'block' : 'none')};
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

const ToggleSubsidiariesButton = ({ open, onClick, count }) => (
  <ToggleSubsidiariesButtonContent data-test="toggle-subsidiaries-button">
    <StyledButton
      buttonColour={GREY_4}
      buttonTextColour={BLACK}
      aria-expanded={open}
      onClick={() => onClick(!open)}
    >
      <span>{open ? `-` : `+`}</span>
      <span>
        {open ? `Hide ${count} subsidiaries` : `Show ${count} subsidiaries`}
      </span>
    </StyledButton>
  </ToggleSubsidiariesButtonContent>
)

const Subsidiaries = ({ company, hierarchy, open, setOpen }) =>
  Array.isArray(company.subsidaries) &&
  company.subsidaries.length > 0 && (
    <>
      <ToggleSubsidiariesButton
        open={open}
        onClick={setOpen}
        count={company.subsidaries.length}
      />
      <SubsidiaryItem hierarchy={hierarchy} open={open}>
        {company.subsidaries.map((subsidary) => (
          <HierarchyItem company={subsidary} hierarchy={subsidary.hierarchy} />
        ))}
      </SubsidiaryItem>
    </>
  )

const HierarchyHeader = ({ count, className }) => (
  <div className={className}>
    <H2>
      {count}
      <span> companies</span>
    </H2>

    <ToggleSubsidiariesButton count={count} />
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
  // todo add null checks for family tree, and see if this component can be removed as its just a wrapper
  return (
    familyTree && (
      <HierarchyContents data-test="hierarchy-contents">
        <StyledHierarchyHeader
          count={familyTree.ultimate_global_companies_count}
        />
        <HierarchyItem
          requestedCompanyId={requestedCompanyId}
          company={familyTree.ultimate_global_company}
          hierarchy={familyTree.ultimate_global_company.hierarchy}
        />
      </HierarchyContents>
    )
  )
}

const HierarchyItem = ({ requestedCompanyId, company, hierarchy }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <HierarchyItemContents
        hierarchy={hierarchy}
        isRequestedCompanyId={requestedCompanyId === company.id}
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
        open={open}
        setOpen={setOpen}
      />
    </>
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
          company && (
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
