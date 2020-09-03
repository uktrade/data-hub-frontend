const { zipWith, get, assign, forOwn, isEmpty, castArray } = require('lodash')

const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { updateInvestmentTeamMembers } = require('../../repos')
const { teamMembersLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

function transformFormToTeamMemberArray({ adviser, role }) {
  const advisersArray = castArray(adviser)
  const rolesArray = castArray(role)

  const teamMembers = zipWith(advisersArray, rolesArray, (adviser, role) => ({
    adviser,
    role,
  }))
  return teamMembers.filter((member) => !isEmpty(member.adviser))
}

function transformTeamMemberArrayToFields(teamMemberArray, advisers) {
  return teamMemberArray.map((teamMember) =>
    getTeamMemberField({ teamMember, advisers })
  )
}

function transformInvestmentTeamMemberstoTeamMemberArray(investment = {}) {
  const teamMembers = investment.team_members || []

  const teamMemberArray = teamMembers.map((teamMember) => {
    return {
      adviser: get(teamMember, 'adviser.id'),
      role: teamMember.role,
    }
  })

  return teamMemberArray
}

function getTeamMemberField({ teamMember, advisers }) {
  const adviser = teamMember ? teamMember.adviser : undefined

  const options = filterActiveAdvisers({
    advisers,
    includeAdviser: adviser,
  }).map(transformObjectToOption)

  return {
    options,
    adviser,
    role: get(teamMember, 'role'),
  }
}

function makeForm(path, teamMembers) {
  return {
    fields: { teamMembers },
    labels: teamMembersLabels.edit,
    buttonText: 'Save',
    returnLink: `${path}/team`,
  }
}

function transformErrorResponseToFormErrors(error) {
  const messages = {}

  castArray(error).forEach((errorItem, index) => {
    forOwn(errorItem, function (value, key) {
      messages[`${key}-${index}`] = value[0]
    })
  })

  return messages
}

async function populateTeamEditForm(req, res, next) {
  try {
    const { token } = req.session
    const { investmentId } = req.params
    const { projects } = res.locals.paths
    const path = `${projects}/${investmentId}`

    const { results: advisers } = await getAdvisers(token)

    const teamMembers = transformInvestmentTeamMemberstoTeamMemberArray(
      res.locals.investment
    )

    const fields = transformTeamMemberArrayToFields(teamMembers, advisers)
    fields.push(getTeamMemberField({ advisers }))

    res.locals.form = makeForm(path, fields)

    next()
  } catch (error) {
    next(error)
  }
}

async function postTeamEdit(req, res, next) {
  const { token } = req.session
  const { investmentId } = req.params
  const { projects } = res.locals.paths
  const path = `${projects}/${investmentId}`

  const teamMembersArray = transformFormToTeamMemberArray(req.body)

  try {
    await updateInvestmentTeamMembers(token, investmentId, teamMembersArray)
    req.flash('success', 'Investment details updated')
    return res.redirect(`${path}/team`)
  } catch (exception) {
    if (exception.statusCode === 400) {
      const messages = transformErrorResponseToFormErrors(exception.error)

      res.locals.form = assign({}, res.locals.form, {
        errors: { messages },
      })
    } else {
      return next(exception)
    }
  }

  const { results: advisers } = await getAdvisers(token)
  const fields = transformTeamMemberArrayToFields(teamMembersArray, advisers)
  res.locals.form = assign({}, res.locals.form, makeForm(path, fields))

  next()
}

module.exports = {
  populateTeamEditForm,
  postTeamEdit,
  transformFormToTeamMemberArray,
  transformTeamMemberArrayToFields,
  transformErrorResponseToFormErrors,
}
