import { differenceBy } from 'lodash'

import { testIdentityNumbers } from './testIdentityNumbers'

export const createArrayOfUrls = (urls) => {
  const arrayOfUrls = []
  const processPaths = (mountPoint) => {
    for (const pages in mountPoint) {
      if (mountPoint[pages].route) {
        arrayOfUrls.push({
          url: mountPoint[pages].mountPoint + mountPoint[pages].route,
        })
      } else if (typeof mountPoint[pages] === 'object') {
        processPaths(mountPoint[pages])
      }
    }
  }

  for (const mountPoint in urls) {
    processPaths(urls[mountPoint])
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
