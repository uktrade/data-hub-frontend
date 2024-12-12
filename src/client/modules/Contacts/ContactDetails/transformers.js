export const transformContactConsents = (contact) => {
  if (!contact || !contact.consentData) {
    return undefined
  }

  const domainGroupedConsent = Object.groupBy(
    contact.consentData,
    ({ consentDomain }) => consentDomain
  )

  return Object.entries(domainGroupedConsent).map((domain) => ({
    domain: domain[0],
    consentedTopics: domain[1]
      .filter(
        (topic) => topic.emailContactConsent || topic.telephoneContactConsent
      )
      .map((topic) => ({
        consent: true,
        name: topic.topic,
      })),
    notConsentedTopics: domain[1]
      .filter(
        (topic) => !topic.emailContactConsent && !topic.telephoneContactConsent
      )
      .map((topic) => ({
        consent: false,
        name: topic.topic,
      })),
  }))
}
