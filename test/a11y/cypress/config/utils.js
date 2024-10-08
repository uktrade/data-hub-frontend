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

const defaultExcludedUrlDataEndPoints = ['/data', '/export']
const defaultExcludedUrlDataStartPoints = ['/api-proxy/v4/']

export const cleanseArrayOfUrls = (arrayOfUrls, excludedUrls) => {
  const filteredArrayOfUrls = arrayOfUrls
    .filter(
      (path) => !excludedUrls.some((excluded) => excluded.url === path.url)
    )
    .filter(
      (path) =>
        !defaultExcludedUrlDataEndPoints.some((suffix) =>
          path.url.endsWith(suffix)
        )
    )
    .filter(
      (path) =>
        !defaultExcludedUrlDataStartPoints.some((suffix) =>
          path.url.startsWith(suffix)
        )
    )
    .map((path) => {
      const pathUrl = path.url.split('/')
      const currentPathUrl = pathUrl.map((pathSegment) =>
        pathSegment.startsWith(':')
          ? testIdentityNumbers[pathSegment]
          : pathSegment
      )
      return currentPathUrl.join('/')
    })

  return filteredArrayOfUrls
}
