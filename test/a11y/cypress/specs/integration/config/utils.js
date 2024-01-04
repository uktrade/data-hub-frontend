import { differenceBy } from 'lodash'

import { testIdentityNumbers } from './testIdentityNumbers'

export const createArrayOfUrls = (mountPoint) => {
  const arrayOfUrls = []

  for (const levelOnePath in mountPoint) {
    if (mountPoint[levelOnePath].route) {
      arrayOfUrls.push({
        url:
          mountPoint[levelOnePath].mountPoint + mountPoint[levelOnePath].route,
      })
    } else {
      const levelTwoPaths = Object.keys(mountPoint[levelOnePath])
      levelTwoPaths.forEach((levelTwoPath) => {
        if (mountPoint[levelOnePath][levelTwoPath].route) {
          arrayOfUrls.push({
            url:
              mountPoint[levelOnePath][levelTwoPath].mountPoint +
              mountPoint[levelOnePath][levelTwoPath].route,
          })
        } else {
          const levelThreePaths = Object.keys(
            mountPoint[levelOnePath][levelTwoPath]
          )
          levelThreePaths.forEach((levelThreePath) => {
            if (mountPoint[levelOnePath][levelTwoPath][levelThreePath].route) {
              arrayOfUrls.push({
                url:
                  mountPoint[levelOnePath][levelTwoPath][levelThreePath]
                    .mountPoint +
                  mountPoint[levelOnePath][levelTwoPath][levelThreePath].route,
              })
            }
          })
        }
      })
    }
  }
  return arrayOfUrls
}

export const cleanseArrayOfUrls = (arrayOfUrls, excludedUrls) => {
  let filteredArrayOfUrls = differenceBy(arrayOfUrls, excludedUrls, 'url')

  filteredArrayOfUrls = filteredArrayOfUrls.filter(
    (path) => path.url.split('/').pop() !== 'data'
  )

  filteredArrayOfUrls = filteredArrayOfUrls.filter(
    (path) => path.url.split('/').pop() !== 'export'
  )

  filteredArrayOfUrls = filteredArrayOfUrls.map((path) => {
    let pathUrl = path.url.split('/')
    const currentPathUrl = pathUrl.map((pathSegment) => {
      if (pathSegment.startsWith(':')) {
        return (pathSegment = testIdentityNumbers[pathSegment])
      }
      return pathSegment
    })
    return currentPathUrl.join('/')
  })
  return filteredArrayOfUrls
}
