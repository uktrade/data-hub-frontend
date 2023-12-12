import { isEmpty } from 'lodash'

import { currencyGBP } from '../../../../client/utils/number-utils'

export const sumWinType = (name, values) =>
  Object.keys(values)
    .filter((key) => key.startsWith(name))
    .reduce((acc, value) => acc + Number(values[value]), 0)

export const sumTotalValue = (winTypes = [], values) =>
  winTypes.reduce((acc, value) => acc + sumWinType(`${value}_`, values), 0)

export const getYearCountFromValues = (name, values) =>
  Object.keys(values)
    .filter((key) => key.startsWith(name))
    .filter((key) => !isEmpty(values[key])).length

export const formatValue = (sum) => currencyGBP(sum)
