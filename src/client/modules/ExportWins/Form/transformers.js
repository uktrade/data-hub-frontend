import { isEmpty } from 'lodash'

import { OPTION_YES, OPTION_NO } from '../../../../common/constants'
import { idNameToValueLabel } from '../../../../client/utils'
import { sumWinTypeYearlyValues } from './utils'
import { isWithinLastTwelveMonths } from './date'
import { isoStringToDateParts } from '../../../utils/date'
import {
  winTypeId,
  GOODS_ID,
  SERVICES_ID,
  bothGoodsAndServices,
  winTypeIdToWinTypeMap,
  goodsServicesIdToLabelMap,
} from './constants'

const CONFIDENTIAL = 'confidential'

const transformContributingOfficers = (values) =>
  Object.keys(values)
    .filter((key) => key.startsWith('contributing_officer'))
    .map((k, index) => ({
      adviser: values[k].value,
      hq_team: values[`hq_team_${index}`].value,
      team_type: values[`team_type_${index}`].value,
    }))

const transformYearlyValuesToBreakdowns = (key, id, values) =>
  Object.keys(values)
    .filter((k) => k.startsWith(key))
    .filter((k) => values[k])
    .map((k) => ({
      type: id,
      year: parseInt(k[k.length - 1], 10) + 1,
      value: values[k],
    }))

const transformContributingAdvisers = (contributing_advisers = []) =>
  contributing_advisers.reduce(
    (acc, val, index) => ({
      ...acc,
      [`contributing_officer_${index}`]: {
        label: `${val.adviser.first_name} ${val.adviser.last_name}`, // TODO: Add team as well?
        value: val.adviser.id,
      },
      [`team_type_${index}`]: {
        label: val.team_type.name,
        value: val.team_type.id,
      },
      [`hq_team_${index}`]: {
        label: val.hq_team.name,
        value: val.hq_team.id,
      },
    }),
    {}
  )

const transformBreakdownsToYearlyValues = (breakdowns) =>
  breakdowns.reduce((acc, obj) => {
    const winType = winTypeIdToWinTypeMap[obj.type.id]
    return {
      ...acc,
      [`${winType}_${obj.year - 1}`]: obj.value,
    }
  }, {})

const getWinTypesFromBreakdowns = (breakdowns) => {
  const winTypeSet = new Set()
  breakdowns.forEach((breakdown) =>
    winTypeSet.add(winTypeIdToWinTypeMap[breakdown.type.id])
  )
  return Array.from(winTypeSet)
}

const transformCompanyContact = ({ id, name, email }) => ({
  value: id,
  label: name,
  email,
})

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

export const transformExportProjectForForm = (exportProject) => {
  const date = new Date(exportProject.estimated_win_date) // "YYYY-MM-DD"
  return {
    // Officer details
    lead_officer: idNameToValueLabel(exportProject.owner),
    team_members: exportProject.team_members.map(idNameToValueLabel),
    // Customer details
    // The exporter experience field is optional when adding an Export Project
    ...(exportProject.exporter_experience && {
      export_experience: idNameToValueLabel(exportProject.exporter_experience),
    }),
    company_contacts:
      exportProject.contacts.length === 1
        ? transformCompanyContact(exportProject.contacts[0])
        : null, // Get the user to choose the contact
    // Win Details
    date: isWithinLastTwelveMonths(date) && {
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1),
    },
    sector: idNameToValueLabel(exportProject.sector),
    country: idNameToValueLabel(exportProject.destination_country),
  }
}

export const transformExportWinForForm = (exportWin) => ({
  // Officer details
  lead_officer: idNameToValueLabel(exportWin.lead_officer),
  team_type: idNameToValueLabel(exportWin.team_type),
  hq_team: idNameToValueLabel(exportWin.hq_team),
  team_members: exportWin.team_members.map(idNameToValueLabel),
  // Credit for this win
  credit_for_win: exportWin.contributing_advisers.length
    ? OPTION_YES
    : OPTION_NO,
  ...transformContributingAdvisers(exportWin.contributing_advisers),
  // Customer details
  company_contacts: transformCompanyContact(exportWin.company_contacts[0]),
  customer_location: idNameToValueLabel(exportWin.customer_location),
  business_potential: idNameToValueLabel(exportWin.business_potential),
  export_experience: idNameToValueLabel(exportWin.export_experience),
  // Win details
  country: idNameToValueLabel(exportWin.country),
  date: isoStringToDateParts(exportWin.date),
  description: exportWin.description,
  name_of_customer: exportWin.name_of_customer,
  name_of_customer_confidential: exportWin.name_of_customer_confidential
    ? OPTION_YES
    : OPTION_NO,
  business_type: exportWin.business_type,
  ...transformBreakdownsToYearlyValues(exportWin.breakdowns),
  win_type: getWinTypesFromBreakdowns(exportWin.breakdowns),
  goods_vs_services:
    exportWin.goods_vs_services.id === bothGoodsAndServices.value
      ? [GOODS_ID, SERVICES_ID]
      : [exportWin.goods_vs_services.id],
  name_of_export: exportWin.name_of_export,
  sector: idNameToValueLabel(exportWin.sector),
  // Support given
  hvc: exportWin.hvc && idNameToValueLabel(exportWin.hvc), // Optional field
  type_of_support: exportWin.type_of_support.map(idNameToValueLabel),
  associated_programme: exportWin.associated_programme.map(idNameToValueLabel),
  is_personally_confirmed: exportWin.is_personally_confirmed
    ? OPTION_YES
    : OPTION_NO,
  is_line_manager_confirmed: exportWin.is_line_manager_confirmed
    ? OPTION_YES
    : OPTION_NO,
  // Summary page
  company: exportWin.company,
  customer_response: exportWin.customer_response,
  first_sent: exportWin.first_sent,
  last_sent: exportWin.last_sent,
})

export const transformFormValuesForAPI = (values) => ({
  // Officer details
  lead_officer: values.lead_officer.value,
  team_type: values.team_type.value,
  hq_team: values.hq_team.value,
  team_members: values.team_members
    ? values.team_members.map((member) => member.value)
    : [],
  // Credit for this win
  contributing_advisers: transformContributingOfficers(values),
  // Customer details
  company_contacts: [values.company_contacts.value],
  customer_location: values.customer_location.value,
  business_potential: values.business_potential.value,
  export_experience: values.export_experience.value,
  // Win details
  country: values.country.value,
  date: `${values.date.year}-${values.date.month}-01`,
  description: values.description,
  name_of_customer:
    values.name_of_customer_confidential === OPTION_YES
      ? CONFIDENTIAL
      : values.name_of_customer,
  name_of_customer_confidential:
    values.name_of_customer_confidential === OPTION_YES,
  business_type: values.business_type,
  breakdowns: [
    ...transformYearlyValuesToBreakdowns(
      'export_win',
      winTypeId.EXPORT,
      values
    ),
    ...transformYearlyValuesToBreakdowns(
      'business_success_win',
      winTypeId.BUSINESS_SUCCESS,
      values
    ),
    ...transformYearlyValuesToBreakdowns('odi_win', winTypeId.ODI, values),
  ],
  goods_vs_services:
    values.goods_vs_services.length === 1
      ? values.goods_vs_services[0]
      : bothGoodsAndServices.value,
  name_of_export: values.name_of_export,
  sector: values.sector.value,
  // Support given
  ...(values.hvc && { hvc: values.hvc.value }), // optional field
  type_of_support: values.type_of_support.map((support) => support.value),
  associated_programme: values.associated_programme.map((c) => c.value),
  is_personally_confirmed: values.is_personally_confirmed[0] === OPTION_YES,
  is_line_manager_confirmed: values.is_line_manager_confirmed[0] === OPTION_YES,
  // Miscellaneous
  total_expected_export_value: sumWinTypeYearlyValues('export_win', values),
  total_expected_non_export_value: sumWinTypeYearlyValues(
    'business_success_win',
    values
  ),
  total_expected_odi_value: sumWinTypeYearlyValues('odi_win', values),
})
