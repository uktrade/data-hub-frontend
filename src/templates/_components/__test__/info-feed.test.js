const {
  renderComponentToDom,
} = require('../../../../test/unit/component-helper')

const data = {
  heading: 'Data Hub Updates',
  subHeading:
    'Announcements, updates, release notes and roadmap from the Data Hub team',
  feedLimit: 3,
  outboundLinkText: 'All updates',
  outboundLinkURL: 'www.google.com',
  dataFeed: [
    {
      heading:
        'Interactions - Recording Multiple Advisors - Changes Coming in April',
      link:
        'https://www.help-centre.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '21 hours ago',
    },
    {
      heading: 'Interactions',
      link:
        'https://www.help-centre.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '22 hours ago',
    },
    {
      heading: 'Interactions 2',
      link:
        'https://www.help-centre.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '1 day ago',
    },
    {
      heading: 'Interactions 3',
      link:
        'https://www.help-centre.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '2 days ago',
    },
  ],
}

describe('Info feed component', () => {
  let component
  let heading
  let subHeading
  let outboundLink
  let infoFeedLink
  let infoFeedDate

  beforeEach(() => {
    component = renderComponentToDom('info-feed', data)
    heading = component.querySelector('.govuk-heading-m')
    subHeading = component.querySelector('.dashboard-section__subheading')
    outboundLink = component.querySelector('.dashboard-section__top-link')
    infoFeedLink = component.querySelectorAll(
      '.dashboard-section__info-feed-link'
    )
    infoFeedDate = component.querySelectorAll(
      '.dashboard-section__info-feed-date'
    )
  })
  describe('Render correct heading', () => {
    it('should render heading', () => {
      expect(heading.textContent).to.equal(data.heading)
    })
  })

  describe('Render correct sub-heading', () => {
    it('should render sub-heading', () => {
      expect(subHeading.textContent).to.equal(data.subHeading)
    })
  })

  describe('Render correct outbound link', () => {
    it('should render outbound link', () => {
      expect(outboundLink.textContent.trim()).to.equal(data.outboundLinkText)
      expect(outboundLink.href).to.equal(data.outboundLinkURL)
    })
  })

  describe('render feed values', () => {
    it('should only render as many feed items as feed limit value', () => {
      expect(infoFeedLink.length).to.equal(data.feedLimit)
      expect(infoFeedDate.length).to.equal(data.feedLimit)
    })
    it('should render correct feed items', () => {
      expect(infoFeedLink[0].text).to.equal(data.dataFeed[0].heading)
      expect(infoFeedLink[0].href).to.equal(data.dataFeed[0].link)
      expect(infoFeedLink[1].text).to.equal(data.dataFeed[1].heading)
      expect(infoFeedLink[1].href).to.equal(data.dataFeed[1].link)
      expect(infoFeedLink[2].text).to.equal(data.dataFeed[2].heading)
      expect(infoFeedLink[2].href).to.equal(data.dataFeed[2].link)
    })
  })
  context('when there is no sub heading', () => {
    beforeEach(() => {
      component = renderComponentToDom('info-feed', {
        ...data,
        subHeading: null,
      })
      subHeading = component.querySelector('.dashboard-section__subheading')
    })
    it('should not render a sub heading', () => {
      expect(subHeading).to.not.exist
    })
  })
})
