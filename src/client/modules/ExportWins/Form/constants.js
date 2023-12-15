export const steps = {
  OFFICER_DETAILS: 'officer_details',
  CREDIT_FOR_THIS_WIN: 'credit_for_this_win',
  CUSTOMER_DETAILS: 'customer_details',
  WIN_DETAILS: 'win_details',
  SUPPORT_PROVIDED: 'support_provided',
  CHECK_BEFORE_SENDING: 'check_before_sending',
}

export const winTypes = {
  EXPORT: 'export_win',
  BUSINESS_SUCCESS: 'business_success_win',
  ODI: 'odi_win',
}

export const winTypeOptions = [
  { label: 'Export', value: winTypes.EXPORT },
  { label: 'Business success', value: winTypes.BUSINESS_SUCCESS },
  { label: 'Outward Direct Investment (ODI)', value: winTypes.ODI },
]

export const goodsServicesOptions = [
  { value: 'goods', label: 'Goods' },
  { value: 'services', label: 'Services' },
]
