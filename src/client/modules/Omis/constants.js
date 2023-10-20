export const STATUS = {
  DRAFT: 'draft',
  QUOTE_AWAITING_ACCEPTANCE: 'quote_awaiting_acceptance',
  CANCELLED: 'cancelled',
  PAID: 'paid',
  COMPLETE: 'complete',
  QUOTE_ACCEPTED: 'quote_accepted',
}

export const VAT_STATUS = {
  OUTSIDE_EU: 'outside_eu',
  UK_COMPANY: 'uk',
  EU_COMPANY: 'eu',
}

export const EU_VAT_NUMBER_REGEX =
  /^(ATU[0-9]{8}|BE0[0-9]{9}|BG[0-9]{9,10}|HR[0-9]{11}|CY[0-9]{8}L|CZ[0-9]{8,10}|DE[0-9]{9}|DK[0-9]{8}|EE[0-9]{9}|(EL|GR)[0-9]{9}|ES[0-9A-Z][0-9]{7}[0-9A-Z]|FI[0-9]{8}|FR[0-9A-Z]{2}[0-9]{9}|GB([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|HU[0-9]{8}|IE[0-9]{7}[A-Z]{1,2}|IE[0-9]{1}[A-Z]{1}[0-9]{5}[A-Z]{1}|IT[0-9]{11}|LT([0-9]{9}|[0-9]{12})|LU[0-9]{8}|LV[0-9]{11}|MT[0-9]{8}|NL[0-9]{9}B[0-9]{2}|PL[0-9]{10}|PT[0-9]{9}|RO[0-9]{2,10}|SE[0-9]{12}|SI[0-9]{8}|SK[0-9]{10})$/
