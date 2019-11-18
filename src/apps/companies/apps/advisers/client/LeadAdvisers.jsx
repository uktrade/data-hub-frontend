import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { H2 } from '@govuk-react/heading'
import Table from '@govuk-react/table'
import { LEVEL_SIZE } from '@govuk-react/constants'

import { companies } from '../../../../../lib/urls'

const RenderHasAccountManager = (
  {
    team,
    name,
    email,
    replaceUrl,
    hasPermissionToAddIta,
    companyName,
    companyId,
  }) =>
  <div>
    <H2 size={LEVEL_SIZE[3]}>Lead ITA for {companyName}</H2>
    <Table>
      <Table.Row>
        <Table.Header setWidth="33%">Team</Table.Header>
        <Table.Header setWidth="33%">Lead ITA</Table.Header>
        <Table.Header setWidth="33%">Email</Table.Header>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{team}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{email ? <a href={`mailto:${email}`}>{email}</a> : '-'}</Table.Cell>
      </Table.Row>
    </Table>
    <p>You can <a href={companies.audit(companyId)}>see changes in the Audit trail</a></p>
    {hasPermissionToAddIta && <Button
      as={Link}
      href={replaceUrl}
    >
      Replace Lead ITA
    </Button>}
  </div>

const RenderHasNoAccountManager = (
  {
    hasPermissionToAddIta,
    confirmUrl,
    companyName,
  }) =>
  <div>
    <H2 size={LEVEL_SIZE[3]}>Lead ITA for {companyName}</H2>
    <p>This company has no Lead ITA</p>
    <p>An ITA (International Trade Adviser) can add themselves as the Lead ITA, which will be visible to all Data Hub
      users on the company page and any of its subsidiaries.</p>
    {hasPermissionToAddIta && <Button
      as={Link}
      href={confirmUrl}
    >
      Add myself as Lead ITA
    </Button>}
  </div>

const LeadAdvisers = (
  {
    hasAccountManager,
    name,
    team,
    email,
    companyName,
    companyId,
    confirmUrl,
    replaceUrl,
    hasPermissionToAddIta,
  }) => {
  return hasAccountManager
    ? <RenderHasAccountManager
      name={name}
      team={team}
      email={email}
      companyId={companyId}
      companyName={companyName}
      hasPermissionToAddIta={hasPermissionToAddIta}
      replaceUrl={replaceUrl}
    />
    : <RenderHasNoAccountManager
      companyName={companyName}
      hasPermissionToAddIta={hasPermissionToAddIta}
      confirmUrl={confirmUrl}
    />
}

LeadAdvisers.propTypes = {
  hasAccountManager: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
  email: PropTypes.string,
  companyName: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  confirmUrl: PropTypes.string.isRequired,
  replaceUrl: PropTypes.string.isRequired,
  hasPermissionToAddIta: PropTypes.bool.isRequired,
}

RenderHasAccountManager.propTypes = {
  name: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
  email: PropTypes.string,
  replaceUrl: PropTypes.string.isRequired,
  hasPermissionToAddIta: PropTypes.bool.isRequired,
  companyName: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
}

RenderHasNoAccountManager.propTypes = {
  confirmUrl: PropTypes.string.isRequired,
  hasPermissionToAddIta: PropTypes.bool.isRequired,
  companyName: PropTypes.string.isRequired,
}

export default LeadAdvisers
