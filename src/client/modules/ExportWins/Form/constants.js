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

export const breakdownTypes = {
  EXPORT: 'cecb1f61-abd2-4715-a0c9-b196b52671d9',
  BUSINESS_SUCCESS: '07fbb895-8e04-48f8-bedb-f7054dbdb85f',
  ODI: '833e7aad-912b-4b93-89b4-64b05222c958',
}

//  Goods and Services
const GOODS = '456e951d-a633-4f21-afde-d41381407efe'
const SERVICES = '9b65391a-0359-44c2-b020-a710fb29211f'
const GOODS_AND_SERVICES = '8711e3dd-3a2c-4b47-aea7-9a53c135efb6'

export const goodsServicesOptions = [
  { label: 'Goods', value: GOODS },
  { label: 'Services', value: SERVICES },
]

export const goodsServicesIdToLabelMap = {
  [GOODS]: 'Goods',
  [SERVICES]: 'Services',
}

export const bothGoodsAndServices = {
  label: 'Both goods and services',
  value: GOODS_AND_SERVICES,
}
