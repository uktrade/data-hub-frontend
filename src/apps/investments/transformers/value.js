/* eslint-disable camelcase */
const { get, isPlainObject, isNull } = require('lodash')
const { projects } = require('../paths')

function transformInvestmentAmount(
  clientCannotProvideInvestment,
  investmentAmount
) {
  if (clientCannotProvideInvestment) {
    return 'Client cannot provide this information'
  }

  if (!investmentAmount) {
    return null
  }

  return {
    type: 'currency',
    name: investmentAmount,
  }
}

function transformGrossValueAdded(grossValueAdded) {
  if (!grossValueAdded) {
    return null
  }

  return {
    type: 'currency',
    name: grossValueAdded,
  }
}

function transformInvestmentValueForView({
  client_cannot_provide_total_investment,
  total_investment,
  client_cannot_provide_foreign_investment,
  foreign_equity_investment,
  gross_value_added,
  number_new_jobs,
  number_safeguarded_jobs,
  government_assistance,
  r_and_d_budget,
  average_salary,
  new_tech_to_uk,
  export_revenue,
  sector,
  investor_company,
  business_activities,
  non_fdi_r_and_d_budget,
  id,
  associated_non_fdi_r_and_d_project,
  likelihood_to_land,
}) {
  function formatBoolean(boolean, { pos, neg }) {
    if (isNull(boolean)) {
      return null
    }
    return boolean ? pos : neg
  }

  const europeanOrGlobalHeadquartersBusinessActivities = business_activities.filter(
    (activity) => {
      return /^(european|global) headquarters$/i.test(activity.name)
    }
  )

  return {
    total_investment: transformInvestmentAmount(
      client_cannot_provide_total_investment,
      total_investment
    ),
    foreign_equity_investment: transformInvestmentAmount(
      client_cannot_provide_foreign_investment,
      foreign_equity_investment
    ),
    gross_value_added: transformGrossValueAdded(gross_value_added),
    number_new_jobs: number_new_jobs && `${number_new_jobs} new jobs`,
    number_safeguarded_jobs:
      number_safeguarded_jobs && `${number_safeguarded_jobs} safeguarded jobs`,
    government_assistance: formatBoolean(government_assistance, {
      pos: 'Has government assistance',
      neg: 'No government assistance',
    }),
    r_and_d_budget: formatBoolean(r_and_d_budget, {
      pos: 'Has R&D budget',
      neg: 'No R&D budget',
    }),
    new_tech_to_uk: formatBoolean(new_tech_to_uk, {
      pos: 'Has new-to-world tech, business model or IP',
      neg: 'No new-to-world tech, business model or IP',
    }),
    export_revenue: formatBoolean(export_revenue, {
      pos: 'Yes, will create significant export revenue',
      neg: 'No, will not create significant export revenue',
    }),
    likelihood_to_land: likelihood_to_land,
    average_salary: get(average_salary, 'name'),
    sector_name: get(sector, 'name'),
    account_tier: get(investor_company, 'one_list_group_tier.name'),
    business_activities: europeanOrGlobalHeadquartersBusinessActivities.length
      ? 'Yes'
      : 'No',
    associated_non_fdi_r_and_d_project: non_fdi_r_and_d_budget
      ? transformAssociatedProject({ id, associated_non_fdi_r_and_d_project })
      : 'Not linked to a non-FDI R&D project',
  }
}

function transformInvestmentValueFormBodyToApiRequest(props) {
  const totalInvestment =
    props.client_cannot_provide_total_investment === 'true'
      ? null
      : props.total_investment || null

  const foreignEquityInvestment =
    props.client_cannot_provide_foreign_investment === 'true'
      ? null
      : props.foreign_equity_investment || null

  return {
    ...props,
    ...{
      total_investment: totalInvestment,
      foreign_equity_investment: foreignEquityInvestment,
      number_new_jobs: props.number_new_jobs || null,
      number_safeguarded_jobs: props.number_safeguarded_jobs || null,
    },
  }
}

function transformAssociatedProject({
  id,
  associated_non_fdi_r_and_d_project,
}) {
  if (isPlainObject(associated_non_fdi_r_and_d_project)) {
    const { name, project_code } = associated_non_fdi_r_and_d_project

    return {
      name,
      actions: [
        {
          label: 'Edit project',
          url: `${projects}/${id}/edit-associated?term=${project_code}`,
          test: 'edit-associated-link',
        },
        {
          label: 'Remove association',
          url: `${projects}/${id}/remove-associated`,
          test: 'remove-associated-link',
        },
      ],
    }
  }

  return {
    name: 'Find project',
    url: `${projects}/${id}/edit-associated`,
    test: 'edit-associated-link',
  }
}

module.exports = {
  transformInvestmentValueForView,
  transformInvestmentValueFormBodyToApiRequest,
}
