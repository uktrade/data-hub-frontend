import React, { useEffect, useRef, useState } from 'react'
import { Button, H2, Link } from 'govuk-react'
import { isEmpty, isFunction, kebabCase } from 'lodash'
import pluralize from 'pluralize'
import { BsFillPersonFill } from 'react-icons/bs'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import InsetText from '@govuk-react/inset-text'

import { COMPANY_LOADED, DNB_FAMILY_TREE_LOADED } from '../../../actions'
import { TASK_GET_COMPANY_DETAIL } from '../CompanyDetails/state'
import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { DefaultLayout } from '../../../components'
import AccessDenied from '../../../components/AccessDenied'
import Task from '../../../components/Task'
import { ToggleSection } from '../../../components/ToggleSection'
import urls from '../../../../lib/urls'
import { ID, TASK_GET_DNB_FAMILY_TREE, state2props } from './state'
import {
  StyledButton,
  ToggleSubsidiariesButtonContent,
  HierarchyContents,
  HierarchyItemContents,
  SubsidiaryList,
  HierarchyListItem,
  HierarchyHeaderContents,
  HierarchyTag,
  ManuallyLinkedHierarchyListItem,
  InlineDescriptionList,
  HierarchyItemHeading,
  StyledLinkedSubsidiaryButton,
  AddCompanyLink,
  AddCompanyLinkDiv,
  GridColTags,
  GridColHeader,
  TradingNames,
} from './styled'
import { addressToString } from '../../../utils/addresses'
import { GREY_4, BLACK, WHITE, BLUE } from '../../../utils/colours'
import { format } from '../../../utils/date'
import { hqLabels } from '../../../../apps/companies/labels'

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
      {dataTest === 'expand-tree-button' ? (
        <span>{isOpen ? 'Hide all' : 'Show all'}</span>
      ) : (
        <span>
          {isOpen
            ? `Hide ${count} ${pluralize(label, count)}`
            : `Show ${count} ${pluralize(label, count)}`}
        </span>
      )}
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
  openAncestorFunctions,
  parentItemRef,
  isManuallyLinked = false,
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
                : index + 1 === company.subsidiaries.length && !isManuallyLinked
            }
            openAncestorFunctions={openAncestorFunctions}
            parentItemRef={parentItemRef}
          />
        ))}
        {isManuallyLinked && (
          <li>
            <StyledLinkedSubsidiaryButton>
              <Button
                as={'a'}
                href={urls.companies.subsidiaries.link(requestedCompanyId)}
                buttonColour={GREY_4}
                buttonTextColour={BLACK}
                data-test="link-subsidiary-button"
              >
                Link a new subsidiary company
              </Button>
            </StyledLinkedSubsidiaryButton>
          </li>
        )}
      </SubsidiaryList>
    </>
  )

const HierarchyHeader = ({
  ultimateGlobalCount,
  familyTreeCompaniesCount,
  reducedTree,
  totalCount,
  fullTreeExpanded,
  onClick,
}) => (
  <HierarchyHeaderContents data-test="hierarchy-header">
    <H2>
      {totalCount}
      <span>
        {' '}
        {pluralize('company', totalCount)}
        {reducedTree && ` out of ${ultimateGlobalCount}`}
      </span>
    </H2>
    {familyTreeCompaniesCount > 1 && (
      <ToggleSubsidiariesButton
        count={familyTreeCompaniesCount}
        onClick={onClick}
        isOpen={fullTreeExpanded}
        insideTree={false}
        dataTest="expand-tree-button"
        label="verified subsidiaries"
      />
    )}
  </HierarchyHeaderContents>
)

export const Hierarchy = ({ requestedCompanyId, familyTree }) => {
  const [fullTreeExpanded, setFullTreeExpanded] = useState(undefined)
  const manuallyVerifiedSubsidiariesCount =
    familyTree.manually_verified_subsidiaries?.length
  const requestedCompanyHasManuallyVerified =
    manuallyVerifiedSubsidiariesCount > 0

  return isEmpty(familyTree) ? (
    <div data-test="empty-hierarchy">
      No hierarchy could be found for this company
    </div>
  ) : (
    <HierarchyContents data-test="hierarchy-contents">
      {familyTree.reduced_tree && (
        <InsetText data-test="reduced-tree-hierarchy">
          Due to the large number of companies in this tree, only the immediate
          parent companies are being shown
        </InsetText>
      )}
      <HierarchyHeader
        ultimateGlobalCount={familyTree.ultimate_global_companies_count}
        totalCount={
          familyTree.family_tree_companies_count +
          manuallyVerifiedSubsidiariesCount
        }
        fullTreeExpanded={fullTreeExpanded}
        onClick={setFullTreeExpanded}
        reducedTree={familyTree.reduced_tree}
        familyTreeCompaniesCount={familyTree.family_tree_companies_count}
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
    <ManuallyLinkedHierarchyListItem data-test="manually-linked-hierarchy-container">
      <Subsidiaries
        company={familyTree}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        requestedCompanyId={requestedCompanyId}
        isManuallyLinked={true}
        label="manually linked subsidiaries"
      />
    </ManuallyLinkedHierarchyListItem>
  )
}

const HierarchyItem = ({
  requestedCompanyId,
  company,
  hierarchy,
  requestedCompanyHasManuallyVerified,
  fullTreeExpanded,
  isFinalItemInLevel,
  openAncestorFunctions,
  parentItemRef,
  globalParent = false,
}) => {
  const hierarchyItemRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const [hasExpandedParents, setHasExpandedParents] = useState(undefined)

  const [toggleLabel, setToggleLabel] = useState('View more detail')
  const isOnDataHub = Object.keys(company).length !== 0 && company?.id
  const isRequestedCompanyId = requestedCompanyId === company.id

  useEffect(() => {
    if (
      isRequestedCompanyId &&
      Array.isArray(openAncestorFunctions) &&
      !hasExpandedParents
    ) {
      openAncestorFunctions
        .filter((x) => isFunction(x))
        .forEach((setIsOpen) => {
          setIsOpen(true)
        })
      setHasExpandedParents(true)
    }
  }, [hasExpandedParents])

  useEffect(() => {
    if (hasExpandedParents && parentItemRef?.current) {
      parentItemRef.current.scrollIntoView()
    }
  }, [hasExpandedParents])

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
      aria-expanded={isOpen}
      data-test-id={company?.id}
      ref={hierarchyItemRef}
    >
      <HierarchyItemContents
        hierarchy={hierarchy}
        isRequestedCompanyId={isRequestedCompanyId}
        data-test={
          isRequestedCompanyId ? 'requested-company' : 'related-company'
        }
      >
        <HierarchyItemHeading>
          <GridColHeader data-test="company-name-header">
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
              <span>{`${company.name} (not on Data Hub)`}</span>
            )}
            {company?.trading_names?.length > 0 && (
              <TradingNames
                data-test={`${companyName}-trading-names`}
                isRequestedCompanyId={isRequestedCompanyId}
              >
                Trading as: {company?.trading_names.join(', ')}
              </TradingNames>
            )}
          </GridColHeader>
          <GridColTags>
            {company.is_out_of_business && (
              <HierarchyTag
                colour="orange"
                data-test={`${companyName}-out-of-business`}
              >
                Out of business
              </HierarchyTag>
            )}
            {company.one_list_tier?.name && (
              <HierarchyTag
                colour="grey"
                data-test={`${companyName}-one-list-tag`}
              >
                One List {company.one_list_tier.name.slice(0, 6)}
              </HierarchyTag>
            )}
            {company.headquarter_type?.name && (
              <HierarchyTag
                colour="grey"
                data-test={`${companyName}-headquarter-type-tag`}
              >
                {hqLabels[company.headquarter_type.name]}
              </HierarchyTag>
            )}
            {!company.uk_region?.name && company.address?.country.name && (
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
                {company.uk_region.name}, UK
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
                <CompanyNumberOfEmployees company={company} />
              </HierarchyTag>
            )}
          </GridColTags>
        </HierarchyItemHeading>
        {isOnDataHub ? (
          <ToggleSection
            colour={isRequestedCompanyId ? WHITE : BLUE}
            onOpen={(open) =>
              setToggleLabel(open ? 'Hide detail' : 'View more detail')
            }
            label={toggleLabel}
            id={`${
              company.duns_number ? company.duns_number : company.id
            }_toggle`}
          >
            <InlineDescriptionList>
              <dt>Trading address</dt>
              <dd>
                <AddressString address={company.address} />
              </dd>
              <dt>Registered address</dt>
              <dd>
                <AddressString address={company.registered_address} />
              </dd>
              <dt>Sector</dt>
              <dd>{company.sector?.name ? company.sector.name : 'Not set'}</dd>
              <dt>Employees</dt>
              <dd>
                <CompanyNumberOfEmployees company={company} />
              </dd>
              <dt>Last interaction date</dt>
              <dd>
                {company.latest_interaction_date
                  ? format(company.latest_interaction_date)
                  : 'Not set'}
              </dd>
            </InlineDescriptionList>
          </ToggleSection>
        ) : (
          company.duns_number && (
            <AddCompanyLinkDiv>
              <AddCompanyLink
                href={urls.companies.createFromDNB(company.duns_number)}
                aria-label={`Add ${company.name} to data Hub`}
                data-test={`add-company-${companyName}`}
              >
                Add {company.name} to Data Hub
              </AddCompanyLink>
            </AddCompanyLinkDiv>
          )
        )}
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
        openAncestorFunctions={
          openAncestorFunctions
            ? [...openAncestorFunctions, setIsOpen]
            : [setIsOpen]
        }
        parentItemRef={hierarchyItemRef}
      />
    </HierarchyListItem>
  )
}

const CompanyNumberOfEmployees = ({ company }) => (
  <>
    {company.employee_range?.name
      ? company.employee_range.name
      : company.number_of_employees
        ? company.number_of_employees
        : 'Not set'}
  </>
)

const AddressString = ({ address }) => (
  <>{address ? addressToString(address) : 'Not set'}</>
)

const breadcrumbs = (company) =>
  !company
    ? []
    : [
        {
          link: urls.dashboard.index(),
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
        progressMessage="Loading all the related companies in this company tree"
        startOnRender={{
          payload: { companyId: companyId },
          onSuccessDispatch: DNB_FAMILY_TREE_LOADED,
        }}
        renderError={() => (
          <div data-test="company-tree-loaded-error">
            <h1>
              This company contains too many records to display the Company Tree
            </h1>
          </div>
        )}
      />
    </DefaultLayout>
  )
}

export default connect(state2props)(CompanyTree)
