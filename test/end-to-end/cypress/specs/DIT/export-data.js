const { expect } = require('chai')
const urls = require('../../../../../src/lib/urls')

const csvHeadings = {
  companies: `Name,Link,Sector,Country,UK region,Countries exported to,Countries of interest,Archived,Date created,Number of employees,Annual turnover,Headquarter type`,
  contacts: `Name,Job title,Date created,Archived,Link,Company,Company sector,Company link,Company UK region,Country,Postcode,Phone number,Email address,Accepts DIT email marketing,Date of latest interaction,Teams of latest interaction,Created by team`,
  interactions: `Date,Type,Service,Subject,Link,Company,Company link,Company country,Company UK region,Company sector,Contacts,Advisers,Event,Communication channel,Service delivery status,Net company receipt,Policy issue types,Policy areas,Policy feedback notes`,
  investment_projects: `Date created,Project reference,Project name,Investor company,Investor company town or city,Country of origin,Investment type,Status,Stage,Link,Actual land date,Estimated land date,FDI value,Sector,Date of latest interaction,Project manager,Client relationship manager,Global account manager,Project assurance adviser,Other team members,Delivery partners,Possible UK regions,Actual UK regions,Specific investment programme,Referral source activity,Referral source activity website,Total investment,New jobs,Average salary of new jobs,Safeguarded jobs,Level of involvement,R&D budget,Associated non-FDI R&D project,New to world tech,Likelihood to land,FDI type,Foreign equity investment,GVA multiplier,GVA`,
  omis: `Order reference,Net price,Net refund,Status,Link,Sector,Market,UK region,Company,Company country,Company UK region,Company link,Contact,Contact job title,Contact link,Lead adviser,Created by team,Date created,Delivery date,Date quote sent,Date quote accepted,Date payment received,Date completed`,
  interactions_with_policy_feedback: `Date,Created date,Modified date,Link,Service,Subject,Company,Parent,Parent country,Company country,Company UK region,One List Tier,Company sector,Company sector cluster,turnover,number_of_employees,team_names,team_countries,kind_name,Communication channel,was_policy_feedback_provided,Policy issue types,Policy areas,Policy feedback notes,advisers,adviser_emails,tag_1,probability_score_tag_1,tag_2,probability_score_tag_2,tag_3,probability_score_tag_3,tag_4,probability_score_tag_4,tag_5,probability_score_tag_5,Contacts,Event,Service delivery status,Net company receipt`,
}

const queueDataExportTest = ({ name, url, headingKey }) => {
  it(`exports ${name} data`, () => {
    cy.request({
      url: url || urls[name].export(),
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.equal(
        'text/csv; charset=utf-8'
      )
      expect(
        response.body.startsWith(
          headingKey ? csvHeadings[headingKey] : csvHeadings[name]
        )
      ).to.be.true
    })
  })
}

describe('exporting data', () => {
  queueDataExportTest({ name: 'companies' })
  queueDataExportTest({ name: 'contacts' })
  queueDataExportTest({ name: 'interactions' })
  queueDataExportTest({
    name: 'investment projects',
    url: urls.investments.projects.export(),
    headingKey: 'investment_projects',
  })
  queueDataExportTest({ name: 'omis' })

  it('exports policy feedback data with specific CSV headers', () => {
    cy.request({
      url: urls.interactions.export(),
      qs: {
        sortby: 'date:desc',
        custom: 'true',
        was_policy_feedback_provided: 'true',
      },
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.equal(
        'text/csv; charset=utf-8'
      )
      expect(
        response.body.startsWith(csvHeadings.interactions_with_policy_feedback)
      ).to.be.true
    })
  })
})
