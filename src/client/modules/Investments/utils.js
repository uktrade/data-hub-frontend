import urls from '../../../lib/urls'

const transformToSentenceCase = (text) => {
  let result = text.replace(/_/g, ' ')
  return (
    result.charAt(0).toUpperCase() +
    result.slice(1).toLowerCase().replace(/uk/g, 'UK')
  )
}

export const buildProjectBreadcrumbs = (pageBreadcrumbs) => {
  const initialBreadcrumbs = [
    { link: urls.dashboard.index(), text: 'Home' },
    {
      link: urls.investments.index(),
      text: 'Investments',
    },
    {
      link: urls.investments.projects.index(),
      text: 'Projects',
    },
  ]
  return initialBreadcrumbs.concat(pageBreadcrumbs)
}

export const buildEYBLeadBreadcrumbs = (pageBreadcrumbs) => {
  const initialBreadcrumbs = [
    { link: urls.dashboard.index(), text: 'Home' },
    {
      link: urls.investments.index(),
      text: 'Investments',
    },
    {
      link: urls.investments.eybLeads.index(),
      text: 'EYB leads',
    },
  ]
  return initialBreadcrumbs.concat(pageBreadcrumbs)
}

export const camelCaseToSentenceCase = (text) => {
  if (typeof text === 'string') {
    return transformToSentenceCase(text)
  } else if (Array.isArray(text)) {
    return text.map((item) => {
      if (typeof item === 'string') {
        return transformToSentenceCase(item)
      } else {
        return item
      }
    })
  }
}
