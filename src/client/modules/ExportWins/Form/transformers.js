import { isEmpty } from 'lodash'

import { sumWinTypeYearlyValues } from './utils'
import {
  breakdownTypes,
  bothGoodsAndServices,
  goodsServicesIdToLabelMap,
} from './constants'

export const transformTeamsAndAdvisers = (values) =>
  Object.keys(values)
    .filter((key) => key.startsWith('contributing_officer_'))
    .map((key) => {
      // We can't use the map index here as the user may delete one of the
      // items out of sequence. The FieldAddAnother component doesn't reindex
      // after a delete so we have to go by the digit at the very end of the key
      const index = key[key.length - 1]
      return {
        officer: values[`contributing_officer_${index}`]?.label,
        teamType: values[`team_type_${index}`].label,
        hqTeam: values[`hq_team_${index}`].label,
      }
    })

export const transformGoodsAndServices = (goodsAndServices = []) =>
  goodsAndServices.length === 0
    ? 'Not set'
    : goodsAndServices.length === 1
    ? goodsServicesIdToLabelMap[goodsAndServices[0]]
    : bothGoodsAndServices.label

export const transformCustomerConfidential = (confidential = []) =>
  isEmpty(confidential) ? 'No' : 'Yes'

const transformContributingOfficersToAdvisers = (values) =>
  Object.keys(values)
    .filter((key) => key.startsWith('contributing_officer'))
    .map((k, index) => ({
      adviser: values[k].value,
      hq_team: values[`hq_team_${index}`].value,
      team_type: values[`team_type_${index}`].value,
    }))

const transformYearlyValuesToBreakdown = (key, type, values) =>
  Object.keys(values)
    .filter((k) => k.startsWith(key))
    .map((k) => ({
      type,
      year: parseInt(k[k.length - 1], 10) + 1,
      value: values[k],
    }))

export const transformFormValuesForAPI = (values) => ({
  // Officer details
  lead_officer: values.lead_officer.value,
  team_type: values.team_type.value,
  hq_team: values.hq_team.value,
  team_members: values.team_members.map((member) => member.value),
  // Credit for this win
  advisers: transformContributingOfficersToAdvisers(values),
  // Customer details
  company_contacts: [values.company_contacts.value],
  customer_location: values.customer_location.value,
  business_potential: values.business_potential.value,
  export_experience: values.export_experience.value,
  // Win details
  country: values.country.value,
  date: `${values.win_date.year}-${values.win_date.month}-01`,
  description: values.description,
  name_of_customer: values.name_of_customer,
  name_of_customer_confidential:
    values.name_of_customer_confidential[0] === 'yes',
  business_type: values.business_type,
  breakdowns: [
    ...transformYearlyValuesToBreakdown(
      'export_win_year',
      breakdownTypes.EXPORT,
      values
    ),
    ...transformYearlyValuesToBreakdown(
      'business_success_win_year',
      breakdownTypes.BUSINESS_SUCCESS,
      values
    ),
    ...transformYearlyValuesToBreakdown(
      'odi_win_year',
      breakdownTypes.ODI,
      values
    ),
  ],
  goods_vs_services:
    values.goods_vs_services.length === 1
      ? values.goods_vs_services[0]
      : bothGoodsAndServices.value,
  name_of_export: values.name_of_export,
  sector: values.sector.value,
  // Support given
  hvc: values.hvc.value,
  type_of_support: values.type_of_support.map((support) => support.value),
  associated_programme: values.associated_programme.map((c) => c.value),
  is_personally_confirmed: values.is_personally_confirmed[0] === 'yes',
  is_line_manager_confirmed: values.is_line_manager_confirmed[0] === 'yes',
  // Miscellaneous
  total_expected_export_value: sumWinTypeYearlyValues(
    'export_win_year',
    values
  ),
  total_expected_non_export_value: sumWinTypeYearlyValues(
    'business_success_win_year',
    values
  ),
  total_expected_odi_value: sumWinTypeYearlyValues('odi_win_year', values),
  type: '59eb39a7-3215-4504-ae3a-8c31ba413ad7', // Remove this once Pawel has merged his PR
})
