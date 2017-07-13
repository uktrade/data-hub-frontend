const { renderComponentToDom } = require('../component-helper')

describe('Investment status component', () => {
  it('should not render if no project code is given', () => {
    const component = renderComponentToDom(
      'investment-status',
      {
        id: 'project id',
        name: 'Project name',
        stageName: 'Initial',
      }
    )

    expect(component).to.be.null
  })

  it('should render with all section titles', () => {
    const component = renderComponentToDom(
      'investment-status',
      {
        id: 'project id',
        name: 'Project name',
        projectCode: 'PROJECT-CODE',
        stageName: 'Initial',
      }
    )

    const sectionTitles = component.querySelectorAll('.status-bar__section-title')
    expect(component.className).to.contain('status-bar')
    expect(sectionTitles[0].textContent).to.contain('PROJECT-CODE')
    expect(sectionTitles[1].textContent).to.contain('Initial stage')
  })

  it('should render one section title when stageName is not given', () => {
    const component = renderComponentToDom(
      'investment-status',
      {
        id: 'project id',
        name: 'Project name',
        projectCode: 'PROJECT-CODE',
      }
    )

    const sectionTitles = component.querySelectorAll('.status-bar__section-title')
    expect(sectionTitles.length).to.equal(1)
  })
})
