export const transformContactConsents = (contact) => {
  if (!contact || !contact.consentData) {
    return false
  }

  return contact.consentData.some((consent) => consent.emailContactConsent)
}
