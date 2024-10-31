import React from 'react'

import Table from '@govuk-react/table'

import { SummaryTable } from '../../../components'

const getConsentRows = (consentData) => {
  const domainGroupedConsent = Object.groupBy(
    consentData,
    ({ consentDomain }) => consentDomain
  )
  const domainRows = Object.entries(domainGroupedConsent).map((domain) => {
    {
      const domainTitle = domain[0]
      const domainTopics = domain[1]
      return domainTopics.map((topic, index) => (
        <Table.Row key={`domain_${index}`} data-test={`domain_${domainTitle}`}>
          {index == 0 && <td rowSpan={domainTopics.length}>{domainTitle}</td>}
          <Table.Cell>{topic.topic}</Table.Cell>
          <Table.Cell>
            {topic.emailContactConsent || topic.telephoneContactConsent
              ? 'Yes'
              : 'No'}
          </Table.Cell>
        </Table.Row>
      ))
    }
  })

  return (
    <>
      <Table.Row>
        <Table.CellHeader>Domain</Table.CellHeader>
        <Table.CellHeader>Topic</Table.CellHeader>
        <Table.CellHeader>Consent Given</Table.CellHeader>
      </Table.Row>
      {domainRows}
    </>
  )
}

const ConsentDetails = ({ contact }) => (
  <SummaryTable data-test="contact-consent-table" caption={'Contact consents'}>
    {contact.consentData ? (
      getConsentRows(contact.consentData)
    ) : (
      <Table.Row data-test="no-contact-consents">
        <Table.Cell>No consent data is available for this contact</Table.Cell>
      </Table.Row>
    )}
  </SummaryTable>
)
export default ConsentDetails
