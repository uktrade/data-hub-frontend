import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { H2 } from '@govuk-react/heading'
import Table from '@govuk-react/table'
import { LEVEL_SIZE } from '@govuk-react/constants'

import { FormActions } from '../../../../../client/components'
import { TEXT_COLOUR, GREY_3 } from '../../../../../client/utils/colours'
import { CompanyResource } from '../../../../../client/components/Resource'
import CompanyLayout from '../../../../../client/components/Layout/CompanyLayout'
import urls from '../../../../../lib/urls'

const ButtonSecondary = (props) => (
  <Button buttonColour={GREY_3} buttonTextColour={TEXT_COLOUR} {...props} />
)

const hasPermissionToAddIta = (permissions) =>
  permissions.includes('company.change_regional_account_manager')

const RenderHasAccountManager = ({
  leadITA,
  addUrl,
  companyId,
  permissions,
}) => (
  <div>
    <Table data-test="lead-adviser-table">
      <Table.Row>
        <Table.CellHeader setWidth="33%">Team</Table.CellHeader>
        <Table.CellHeader setWidth="33%">Lead ITA</Table.CellHeader>
        <Table.CellHeader setWidth="33%">Email</Table.CellHeader>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{leadITA.ditTeam.name}</Table.Cell>
        <Table.Cell>{leadITA.name}</Table.Cell>
        <Table.Cell>
          {leadITA.contactEmail ? (
            <a href={`mailto:${leadITA.contactEmail}`}>
              {leadITA.contactEmail}
            </a>
          ) : (
            '-'
          )}
        </Table.Cell>
      </Table.Row>
    </Table>
    <p>
      You can{' '}
      <a href={urls.companies.editHistory.index(companyId)}>
        see changes in the Edit history
      </a>
    </p>
    {hasPermissionToAddIta(permissions) && (
      <FormActions>
        <ButtonSecondary as={Link} href={addUrl} data-test="replace-ita-button">
          Replace Lead ITA
        </ButtonSecondary>
        <ButtonSecondary
          as={Link}
          href={urls.companies.advisers.remove(companyId)}
          data-test="remove-ita-button"
        >
          Remove Lead ITA
        </ButtonSecondary>
      </FormActions>
    )}
  </div>
)

export const LeadITA = ({ company, permissions }) => (
  <>
    <H2 size={LEVEL_SIZE[3]}>Lead ITA for {company.name}</H2>
    {!!company.oneListGroupGlobalAccountManager ? (
      <RenderHasAccountManager
        leadITA={company.oneListGroupGlobalAccountManager}
        companyId={company.id}
        permissions={permissions}
        addUrl={urls.companies.advisers.assign(company.id)}
      />
    ) : (
      <>
        <p>
          This company record has no Lead International Trade Adviser (ITA).
        </p>
        {hasPermissionToAddIta(permissions) && (
          <>
            <p>
              You can add a Lead ITA. This will be visible to all Data Hub
              users.
            </p>
            <Button as={Link} href={urls.companies.advisers.assign(company.id)}>
              Add a Lead ITA
            </Button>
          </>
        )}
      </>
    )}
  </>
)

LeadITA.propTypes = {
  company: PropTypes.object.isRequired,
  permissions: PropTypes.array.isRequired,
}

const LeadAdvisers = ({
  companyId,
  dnbRelatedCompaniesCount,
  localNavItems,
  flashMessages,
  returnUrl,
  permissions,
}) => (
  <CompanyResource id={companyId}>
    {(company) => (
      <CompanyLayout
        company={company}
        breadcrumbs={[{ text: 'Lead adviser' }]}
        dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
        localNavItems={localNavItems}
        flashMessages={flashMessages}
        returnUrl={returnUrl}
      >
        <LeadITA company={company} permissions={permissions}></LeadITA>
      </CompanyLayout>
    )}
  </CompanyResource>
)
LeadAdvisers.propTypes = {
  companyId: PropTypes.string.isRequired,
  permissions: PropTypes.array.isRequired,
}

RenderHasAccountManager.propTypes = {
  addUrl: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  permissions: PropTypes.array.isRequired,
  leadITA: PropTypes.object.isRequired,
}

export default LeadAdvisers
