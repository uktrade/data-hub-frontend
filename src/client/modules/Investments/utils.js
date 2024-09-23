import urls from '../../../lib/urls'

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
