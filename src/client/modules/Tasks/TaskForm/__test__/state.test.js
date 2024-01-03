import urls from '../../../../../lib/urls'
import {
  getTaskBreadcrumbs,
  getGenericBreadcumbs,
  getInvestmentProjectBreadcumbs,
  getCompanyBreadcrumbs,
} from '../state'

describe('getTaskBreadcrumbs', () => {
  context('When task is null', () => {
    const task = null

    it('should return the generic breadcrumbs', () => {
      expect(getTaskBreadcrumbs(task)).to.deep.equal(getGenericBreadcumbs(task))
    })
  })

  context('When task is existing generic task', () => {
    const task = { id: 1, title: 'a' }

    it('should return the generic breadcrumbs', () => {
      expect(getTaskBreadcrumbs(task)).to.deep.equal(getGenericBreadcumbs(task))
    })
  })

  context('When task has an investment project', () => {
    const task = { investmentProject: { name: 'a', value: 1 } }

    it('should return the investment project breadcrumbs', () => {
      expect(getTaskBreadcrumbs(task)).to.deep.equal(
        getInvestmentProjectBreadcumbs(task.investmentProject)
      )
    })
  })

  context('When task has a company', () => {
    const task = { company: { name: 'a', value: 1 } }

    it('should return the company breadcrumbs', () => {
      expect(getTaskBreadcrumbs(task)).to.deep.equal(
        getCompanyBreadcrumbs(task.company)
      )
    })
  })
})

describe('getInvestmentProjectBreadcumbs', () => {
  context('When investment project is null', () => {
    it('should return investment project breadcrumbs without the investment detail', () => {
      expect(getInvestmentProjectBreadcumbs(null)).to.deep.equal([
        { link: urls.dashboard.myTasks(), text: 'Home' },
        { link: urls.investments.index(), text: 'Investments' },
        { link: urls.investments.projects.index(), text: 'Projects' },
      ])
    })
  })

  context('When investment project exists', () => {
    const investmentProject = { value: 1, label: 'a' }

    it('should return investment project breadcrumbs with the investment detail', () => {
      expect(getInvestmentProjectBreadcumbs(investmentProject)).to.deep.equal([
        { link: urls.dashboard.myTasks(), text: 'Home' },
        { link: urls.investments.index(), text: 'Investments' },
        { link: urls.investments.projects.index(), text: 'Projects' },
        {
          link: urls.investments.projects.tasks.index(investmentProject.value),
          text: investmentProject.label,
        },
        { text: 'Task' },
      ])
    })
  })
})

describe('getCompanyBreadcrumbs', () => {
  context('When company exists', () => {
    it('should return company breadcrumbs ', () => {
      const company = { value: 1, label: 'a' }
      expect(getCompanyBreadcrumbs(company)).to.deep.equal([
        { link: urls.dashboard.myTasks(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        {
          link: urls.companies.detail(company.value),
          text: company.label,
        },
        { text: 'Task' },
      ])
    })
  })
})
