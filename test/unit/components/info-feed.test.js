const { renderComponentToDom } = require('../component-helper')

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
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '21 hours ago',
    },
    {
      heading: 'Interactions',
      link:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '22 hours ago',
    },
    {
      heading: 'Interactions 2',
      link:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '1 day ago',
    },
    {
      heading: 'Interactions 3',
      link:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001412918-April-2019-improvements-to-company-page-data',
      date: '2 days ago',
    },
  ],
}

describe('Info feed component', () => {
  beforeEach(() => {
    this.component = renderComponentToDom('info-feed', data)
    this.heading = this.component.querySelector('.dashboard-section-title')
    this.subHeading = this.component.querySelector(
      '.dashboard-section__subheading'
    )
    this.outboundLink = this.component.querySelector(
      '.dashboard-section__top-link'
    )
    this.infoFeedLink = this.component.querySelectorAll(
      '.dashboard-section__info-feed-link'
    )
    this.infoFeedDate = this.component.querySelectorAll(
      '.dashboard-section__info-feed-date'
    )
  })
  describe('Render correct heading', () => {
    it('should render heading', () => {
      expect(this.heading.textContent).to.equal(data.heading)
    })
  })

  describe('Render correct sub-heading', () => {
    it('should render sub-heading', () => {
      expect(this.subHeading.textContent).to.equal(data.subHeading)
    })
  })

  describe('Render correct outbound link', () => {
    it('should render outbound link', () => {
      expect(this.outboundLink.textContent).to.equal(data.outboundLinkText)
      expect(this.outboundLink.href).to.equal(data.outboundLinkURL)
    })
  })

  describe('render feed values', () => {
    it('should only render as many feed items as feed limit value', () => {
      expect(this.infoFeedLink.length).to.equal(data.feedLimit)
      expect(this.infoFeedDate.length).to.equal(data.feedLimit)
    })
    it('should render correct feed items', () => {
      expect(this.infoFeedLink[0].text).to.equal(data.dataFeed[0].heading)
      expect(this.infoFeedLink[0].href).to.equal(data.dataFeed[0].link)
      expect(this.infoFeedLink[1].text).to.equal(data.dataFeed[1].heading)
      expect(this.infoFeedLink[1].href).to.equal(data.dataFeed[1].link)
      expect(this.infoFeedLink[2].text).to.equal(data.dataFeed[2].heading)
      expect(this.infoFeedLink[2].href).to.equal(data.dataFeed[2].link)
    })
  })
})
