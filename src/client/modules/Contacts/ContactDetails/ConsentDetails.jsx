import React from 'react'
import { isNil } from 'lodash'

import { SectionHeader } from '../../../components'
import { transformContactConsents } from './transformers'

const ConsentText = ({ consent }) => {
  const message = (domain, topicNames, consentGiven) => {
    let consentedMessage = `This contact has ${consentGiven ? 'given' : 'not given'} consent to ${domain}`
    if (!topicNames) {
      return ''
    } else if (topicNames.length == 1) {
      consentedMessage += ` and topic ${topicNames[0]}`
    } else if (topicNames.length > 1) {
      consentedMessage += ` and topics: ${topicNames.join(', ')}`
    }
    return consentedMessage + '.'
  }

  const topicsWithNames = (topics) =>
    topics.length > 0
      ? topics.filter((topic) => topic.name).map((topic) => topic.name)
      : undefined

  const consentedTopicNames = topicsWithNames(consent.consentedTopics)
  const notConsentedTopicNames = topicsWithNames(consent.notConsentedTopics)

  const consentedMessage = message(consent.domain, consentedTopicNames, true)
  const notConsentedMessage = message(
    consent.domain,
    notConsentedTopicNames,
    false
  )

  const finalMessage = []
  if (consentedMessage) {
    finalMessage.push(consentedMessage)
  }
  if (notConsentedMessage) {
    if (consentedMessage) {
      finalMessage.push(' ')
    }
    finalMessage.push(notConsentedMessage)
  }

  return <p>{finalMessage.join('')}</p>
}

const ConsentDetails = ({ contact }) => {
  const consents = transformContactConsents(contact)
  return (
    <div>
      <SectionHeader type="contact-consent">Contact consents</SectionHeader>
      {isNil(consents) ? (
        <p data-test="no-contact-consents">
          There is no consent data available for this contact
        </p>
      ) : (
        <>
          {consents.map((consent) => {
            return <ConsentText consent={consent} />
          })}
        </>
      )}
    </div>
  )
}

export default ConsentDetails
