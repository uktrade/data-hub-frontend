import React, { useEffect, useState } from 'react'
import { H2, Link } from 'govuk-react'
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
import { BsFillPersonFill } from 'react-icons/bs'
import { isEmpty, kebabCase } from 'lodash'
import {
  StyledButton,
  ToggleSubsidiariesButtonContent,
  HierarchyContents,
  HierarchyItemContents,
  SubsidiaryList,
  HierarchyListItem,
  HierarchyHeaderContents,
  HierarchyTag,
} from './styled'

const ToggleSubsidiariesButton = ({
  isOpen,
  onClick,
  count,
  insideTree = true,
  dataTest = 'toggle-subsidiaries-button',
  label,
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
        {isOpen ? `Hide ${count} ${label}` : `Show ${count} ${label}`}
      </span>
    </StyledButton>
  </ToggleSubsidiariesButtonContent>
)

const Subsidiaries = ({
  company,
  hierarchy,
  requestedCompanyHasManuallyVerified,
  isOpen,
  setIsOpen,
  fullTreeExpanded,
  requestedCompanyId,
  label,
}) =>
  Array.isArray(company.subsidiaries) &&
  company.subsidiaries.length > 0 && (
    <>
      <ToggleSubsidiariesButton
        isOpen={isOpen}
        onClick={setIsOpen}
        count={company.subsidiaries.length}
        label={label}
      />
      <SubsidiaryList
        data-test="subsidiary-item"
        hierarchy={hierarchy}
        isOpen={isOpen}
        childCount={company.subsidiaries.length}
      >
        {company.subsidiaries.map((subsidiary, index) => (
          <HierarchyItem
            requestedCompanyId={requestedCompanyId}
            company={subsidiary}
            hierarchy={subsidiary.hierarchy}
            fullTreeExpanded={fullTreeExpanded}
            key={`hierarchy_item_${index}`}
            isFinalItemInLevel={
              requestedCompanyHasManuallyVerified && hierarchy === 1
                ? false
                : index + 1 === company.subsidiaries.length
            }
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
        label="verified subsidiaries"
      />
    )}
  </HierarchyHeaderContents>
)

const Hierarchy = ({ requestedCompanyId, familyTree }) => {
  const [fullTreeExpanded, setFullTreeExpanded] = useState(undefined)
  const requestedCompanyHasManuallyVerified =
    familyTree.manually_verified_subsidiaries?.length > 0
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
          requestedCompanyHasManuallyVerified={
            requestedCompanyHasManuallyVerified
          }
          globalParent={true}
        />
        <ManuallyLinkedList
          requestedCompanyId={requestedCompanyId}
          familyTree={familyTree}
        />
      </ul>
    </HierarchyContents>
  )
}

const ManuallyLinkedList = ({ requestedCompanyId, familyTree }) => {
  familyTree.subsidiaries = familyTree.manually_verified_subsidiaries

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Subsidiaries
      company={familyTree}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      requestedCompanyId={requestedCompanyId}
      label="manually linked subsidiaries"
    />
  )
}

const HierarchyItem = ({
  requestedCompanyId,
  company,
  hierarchy,
  requestedCompanyHasManuallyVerified,
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

  const companyName = kebabCase(company.name)
  return (
    <HierarchyListItem
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
        <span>
          {Object.keys(company).length === 0 ? (
            `No related companies found`
          ) : company?.id ? (
            <Link
              href={urls.companies.overview.index(company.id)}
              aria-label={`Go to ${company.name} details`}
            >
              {company.name}
            </Link>
          ) : (
            `${company.name} (not on Data Hub)`
          )}
          {company.one_list_tier?.name && (
            <HierarchyTag
              colour="grey"
              data-test={`${companyName}-one-list-tag`}
            >
              One List {company.one_list_tier.name.slice(0, 6)}
            </HierarchyTag>
          )}
          {company.address?.country.name && (
            <HierarchyTag
              colour="blue"
              data-test={`${companyName}-country-tag`}
            >
              {company.address.country.name}
            </HierarchyTag>
          )}
          {company.uk_region?.name && (
            <HierarchyTag
              colour="blue"
              data-test={`${companyName}-uk-region-tag`}
            >
              {company.uk_region.name}
            </HierarchyTag>
          )}
          {(company.number_of_employees || company.employee_range?.name) && (
            <HierarchyTag
              colour="blue"
              data-test={`${companyName}-number-of-employees-tag`}
            >
              <BsFillPersonFill
                size={'12'}
                style={{ verticalAlign: 'top', paddingTop: '1px' }}
              />
              {company.number_of_employees && ` ${company.number_of_employees}`}
              {company.employee_range?.name &&
                ` ${company.employee_range?.name}`}
            </HierarchyTag>
          )}
        </span>
      </HierarchyItemContents>
      <Subsidiaries
        company={company}
        hierarchy={hierarchy}
        requestedCompanyHasManuallyVerified={
          requestedCompanyHasManuallyVerified
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fullTreeExpanded={fullTreeExpanded}
        requestedCompanyId={requestedCompanyId}
        label="verified subsidiaries"
      />
    </HierarchyListItem>
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
          link: urls.companies.overview.index(company.id),
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
  if (company && !company.duns_number) {
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
