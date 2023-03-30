import { OVERVIEW__COMPANY_INVESTMENT_WON_COUNT } from '../../../../../client/actions'
import { camelCase } from 'lodash'

const initialState = {
  results: [],
  selectedAdvisers: [],
  metadata: {},
  isComplete: false,
}

function getLatestCreatedWon(investmentList) {
  let wonLatestDate = ''
  let investmentLatest = {}
  for (let i = 0; i < Object.keys(investmentList).length; i++) {
    let wonDate = investmentList[i].data.stage_log.filter(
      (investment) => investment.stage.name === 'Won'
    )
    if (wonLatestDate === '') {
      wonLatestDate = wonDate[0].created_on
    }
    if (wonLatestDate !== '') {
      if (wonLatestDate < wonDate[0].created_on) {
        wonLatestDate = wonDate[0].created_on
        investmentLatest = {
          name: investmentList[i].data.name,
          id: investmentList[i].data.id,
          date: wonLatestDate,
        }
      }
    }
  }
  return investmentLatest
}

export default (state = { initialState }, { type, result }) => {
  if (type === OVERVIEW__COMPANY_INVESTMENT_WON_COUNT) {
    let resultList = []
    let stageList = {}
    let statusList = {}
    let stageListAll = []
    let statusListAll = []
    result.investmentProjects.results.map((investment) =>
      resultList.push(investment)
    )
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
    let lastWon = getLatestCreatedWon(result.wonData)
    return {
      ...state,
      stageList,
      statusList,
      resultList,
      lastWon,
      isComplete: true,
    }
  }
  return state
}
