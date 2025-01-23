import { sentence, title } from 'case'

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

/**
 * Converts EYB choices to sentence case labels
 * @param {string|string[]|null} choices - Single string, or array of strings, or null to convert
 * @returns {string|string[]|null} - Converted string(s) in the same format as the input
 */
export const convertEYBChoicesToLabels = (choices) => {
  if (choices === null) {
    return null
  }

  // Helper function to handle capitalisation of UK
  const capitaliseUK = (str) => {
    return str.replace(/\b[Uu][Kk]\b/g, 'UK')
  }
  // Helper function to process a single string
  const processString = (str) => {
    return capitaliseUK(sentence(str))
  }

  if (typeof choices == 'string') {
    return processString(choices)
  }
  if (Array.isArray(choices)) {
    return choices.map((choice) => processString(choice))
  }

  throw new Error('Input must be null, a string, or array of strings')
}

/**
 * Formats EYB lead proposed investment city to Title Case labels
 * @param {string|null} city - Single string or null to format
 * @returns {string|null} - Formatted string
 */
export const formatProposedInvestmentCity = (choices) => {
  if (choices === null) {
    return null
  }
  if (typeof choices == 'string') {
    return title(choices)
  }
  throw new Error('Input must be null or a string')
}
