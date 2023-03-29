import { OVERVIEW__COMPANY_INVESTMENT_WON_COUNT } from '../../../../../client/actions'
import { camelCase } from 'lodash'

const initialState = {
  results: [],
  selectedAdvisers: [],
  metadata: {},
  isComplete: false,
}

function getLatestCreatedWon(investmentList) {
  investmentList.sort(function (a, b) {
    return new Date(b.created_on) - new Date(a.created_on)
  })
  let wonList = investmentList.filter(
    (wonInvestment) => wonInvestment.status === 'won'
  )
  let latestWon
  if (wonList.length > 0) {
    latestWon = wonList[0]
  }
  return latestWon
}

export default (state = { initialState }, { type, result }) => {
  if (type === OVERVIEW__COMPANY_INVESTMENT_WON_COUNT) {
    let resultList = []
    let stageList = {}
    let statusList = {}
    let stageListAll = []
    let statusListAll = []
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
    let lastWon = getLatestCreatedWon(resultList)
    return {
      ...state,
      stageList,
      statusList,
      resultList,
      lastWon,
      testData: result.testData,
      isComplete: true,
    }
  }
  return state
}
