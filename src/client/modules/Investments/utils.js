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
