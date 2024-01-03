import { camelCase } from 'lodash'

import { OVERVIEW__COMPANY_INVESTMENT_WON_COUNT } from '../../../../../client/actions'
import { STAGE_ACTIVE } from '../../../../../client/modules/Investments/Projects/constants'

const initialState = {
  results: [],
  selectedAdvisers: [],
  metadata: {},
  isComplete: false,
}

export default (state = { initialState }, { type, result }) => {
  if (type === OVERVIEW__COMPANY_INVESTMENT_WON_COUNT) {
    let resultList = []
    let stageList = {}
    let statusList = {}
    let stageListAll = []
    let statusListAll = []
    let upcomingActiveInvestments = []
    result.results.map((investment) => resultList.push(investment))
    resultList.map((investment) => stageListAll.push(investment.stage.name))
    resultList.map((investment) => statusListAll.push(investment.status))

    let statusNames = statusListAll.filter(
      (item, i, ar) => ar.indexOf(item) === i
    )
    let stageNames = stageListAll.filter(
      (item, i, ar) => ar.indexOf(item) === i
    )

    for (let i = 0; i < statusNames.length; i++) {
      let name = camelCase(statusNames[i])
      statusList[name] = resultList.filter(
        (investment) => investment.status === statusNames[i]
      ).length
    }
    for (let i = 0; i < stageNames.length; i++) {
      let name = camelCase(stageNames[i])
      stageList[name] = resultList.filter(
        (investment) => investment.stage.name === stageNames[i]
      ).length
    }

    const allActiveInvestments = []
    for (const investment of resultList) {
      if (
        (investment.stage.name === STAGE_ACTIVE &&
          investment.status === 'delayed') ||
        (investment.stage.name === STAGE_ACTIVE &&
          investment.status === 'ongoing')
      ) {
        let newDate = new Date(investment.estimated_land_date)
        investment.estimated_land_date = newDate
        allActiveInvestments.push(investment)
      }
    }
    allActiveInvestments.sort(
      (dateA, dateB) =>
        Number(dateA.estimated_land_date) - Number(dateB.estimated_land_date)
    )
    if (allActiveInvestments.length > 3) {
      upcomingActiveInvestments = allActiveInvestments.slice(0, 3)
    } else {
      upcomingActiveInvestments = allActiveInvestments
    }

    return {
      ...state,
      stageList,
      statusList,
      resultList,
      summary: result.summary,
      upcomingActiveInvestments,
      isComplete: true,
    }
  }
  return state
}
