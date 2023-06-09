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
import { GREY_4, BLACK } from '../../../utils/colours'
import { isEmpty } from 'lodash'
import {
  StyledButton,
  ToggleSubsidiariesButtonContent,
  HierarchyContents,
  HierarchyItemContents,
  SubsidiaryList,
  HierachyListItem,
  HierarchyHeaderContents,
} from './styled'

const ToggleSubsidiariesButton = ({
  isOpen,
  onClick,
  count,
  insideTree = true,
  dataTest = 'toggle-subsidiaries-button',
}) => (
  <ToggleSubsidiariesButtonContent insideTree={insideTree}>
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
  requestedCompanyId,
}) =>
  Array.isArray(company.subsidiaries) &&
  company.subsidiaries.length > 0 && (
    <>
      <ToggleSubsidiariesButton
        isOpen={isOpen}
        onClick={setIsOpen}
        count={company.subsidiaries.length}
      />
      <SubsidiaryList
        data-test="subsidiary-item"
        hierarchy={hierarchy}
        isOpen={isOpen}
        childCount={company.subsidiaries.length}
      >
        {company.subsidiaries.map((subsidary, index) => (
          <HierarchyItem
            requestedCompanyId={requestedCompanyId}
            company={subsidary}
            hierarchy={subsidary.hierarchy}
            fullTreeExpanded={fullTreeExpanded}
            key={`hierarchy_item_${index}`}
            isFinalItemInLevel={index + 1 === company.subsidiaries.length}
          />
        ))}
      </SubsidiaryList>
    </>
  )

const HierarchyHeader = ({ count, fullTreeExpanded, onClick }) => (
  <HierarchyHeaderContents>
    <H2>
      {count}
      <span> companies</span>
    </H2>
    {count > 1 && (
      <ToggleSubsidiariesButton
        count={count}
        onClick={onClick}
        isOpen={fullTreeExpanded}
        insideTree={false}
        dataTest="expand-tree-button"
      />
    )}
  </HierarchyHeaderContents>
)

const Hierarchy = ({ requestedCompanyId, familyTree }) => {
  const [fullTreeExpanded, setFullTreeExpanded] = useState(undefined)
  return isEmpty(familyTree) ? (
    <div data-test="empty-hierarchy">
      No hierarchy could be found for this company
    </div>
  ) : (
    <HierarchyContents data-test="hierarchy-contents">
      <HierarchyHeader
        count={familyTree.ultimate_global_companies_count}
        fullTreeExpanded={fullTreeExpanded}
        onClick={setFullTreeExpanded}
      />
      <ul>
        <HierarchyItem
          fullTreeExpanded={fullTreeExpanded}
          requestedCompanyId={requestedCompanyId}
          company={familyTree.ultimate_global_company}
          hierarchy={familyTree.ultimate_global_company.hierarchy}
          globalParent={true}
        />
        {/* TODO The below will be replaced with values from the api in future tickets */}
        <li>
          <ToggleSubsidiariesButtonContent>
            <Button
              buttonColour={GREY_4}
              buttonTextColour={BLACK}
              as={Link}
              href={urls.companies.subsidiaries.index(requestedCompanyId)}
            >
              + Show manually linked susidiaries
            </Button>
          </ToggleSubsidiariesButtonContent>
        </li>
      </ul>
    </HierarchyContents>
  )
}

const HierarchyItem = ({
  requestedCompanyId,
  company,
  hierarchy,
  fullTreeExpanded,
  isFinalItemInLevel,
  globalParent = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (fullTreeExpanded !== undefined) {
      setIsOpen(fullTreeExpanded)
    }
  }, [fullTreeExpanded])

  return (
    <HierachyListItem
      globalParent={globalParent}
      isFinalItemInLevel={isFinalItemInLevel}
      data-test="hierarchy-item"
    >
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
        requestedCompanyId={requestedCompanyId}
      />
    </HierachyListItem>
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

const CompanyTree = ({ company, familyTree }) => {
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

export default connect(state2props)(CompanyTree)
