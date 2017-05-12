/* globals expect: true, describe: true, it: true */
/* eslint no-unused-expressions: 0 */
const servicedeliveryservice = require('../../src/services/service-delivery.service')

describe('Service delivery formatting service', function () {
  describe('convertServiceDeliveryFormToApiFormat', function () {
    it('Should format a service delivery to API format when there is no id or event', function () {
      const source = {
        subject: 'there is a subject',
        notes: 'there are some notes',
        date: '2017-05-08T00:00:00.00Z',
        company: 'bda922f9-8a9e-42bb-a797-0cc7955505a8',
        dit_team: '1ea9d661-e982-48b7-a3d3-c6f423754076',
        service: 'bf0c2978-ff8e-43bf-a92f-23a7ad769f97',
        status: '1af6e682-bdbc-4220-bdc0-3f7b41dba989',
        contact: 'b61af15e-b77a-4882-a6d0-926f7f4a33a2',
        dit_advisor: 'b96465a6-cd5b-4a24-aff7-bf5bfc02243d',
        uk_region: 'ff5a57b9-2182-4010-9f94-586fad566b56',
        sector: '8356633c-c604-4bd2-9a9a-cd19e3ed3430',
        country_of_interest: '86bfa86d-a015-4260-b425-61cbf4f05a7d'
      }
      const actual = servicedeliveryservice.convertServiceDeliveryFormToApiFormat(source)

      expect(actual).not.to.be.null
      expect(actual.data).not.to.be.null
      expect(actual.data.attributes).not.to.be.null
      expect(actual.data.relationships).not.to.be.null
      expect(actual.data.type).to.equal('ServiceDelivery')
      expect(actual.data.attributes.subject).to.equal('there is a subject')
      expect(actual.data.attributes.notes).to.equal('there are some notes')
      expect(actual.data.attributes.date).to.equal('2017-05-08T00:00:00.00Z')
      expect(actual.data.relationships.company).not.to.be.null
      expect(actual.data.relationships.company.data).not.to.be.null
      expect(actual.data.relationships.company.data.type).to.equal('Company')
      expect(actual.data.relationships.company.data.id).to.equal('bda922f9-8a9e-42bb-a797-0cc7955505a8')
      expect(actual.data.relationships.dit_team).not.to.be.null
      expect(actual.data.relationships.dit_team.data).not.to.be.null
      expect(actual.data.relationships.dit_team.data.type).to.equal('Team')
      expect(actual.data.relationships.dit_team.data.id).to.equal('1ea9d661-e982-48b7-a3d3-c6f423754076')
      expect(actual.data.relationships.service).not.to.be.null
      expect(actual.data.relationships.service.data).not.to.be.null
      expect(actual.data.relationships.service.data.type).to.equal('Service')
      expect(actual.data.relationships.service.data.id).to.equal('bf0c2978-ff8e-43bf-a92f-23a7ad769f97')
      expect(actual.data.relationships.status).not.to.be.null
      expect(actual.data.relationships.status.data).not.to.be.null
      expect(actual.data.relationships.status.data.type).to.equal('ServiceDeliveryStatus')
      expect(actual.data.relationships.status.data.id).to.equal('1af6e682-bdbc-4220-bdc0-3f7b41dba989')
      expect(actual.data.relationships.contact).not.to.be.null
      expect(actual.data.relationships.contact.data).not.to.be.null
      expect(actual.data.relationships.contact.data.type).to.equal('Contact')
      expect(actual.data.relationships.contact.data.id).to.equal('b61af15e-b77a-4882-a6d0-926f7f4a33a2')
      expect(actual.data.relationships.dit_advisor).not.to.be.null
      expect(actual.data.relationships.dit_advisor.data).not.to.be.null
      expect(actual.data.relationships.dit_advisor.data.type).to.equal('Advisor')
      expect(actual.data.relationships.dit_advisor.data.id).to.equal('b96465a6-cd5b-4a24-aff7-bf5bfc02243d')
      expect(actual.data.relationships.uk_region).not.to.be.null
      expect(actual.data.relationships.uk_region.data).not.to.be.null
      expect(actual.data.relationships.uk_region.data.type).to.equal('UKRegion')
      expect(actual.data.relationships.uk_region.data.id).to.equal('ff5a57b9-2182-4010-9f94-586fad566b56')
      expect(actual.data.relationships.sector).not.to.be.null
      expect(actual.data.relationships.sector.data).not.to.be.null
      expect(actual.data.relationships.sector.data.type).to.equal('Sector')
      expect(actual.data.relationships.sector.data.id).to.equal('8356633c-c604-4bd2-9a9a-cd19e3ed3430')
      expect(actual.data.relationships.country_of_interest).not.to.be.null
      expect(actual.data.relationships.country_of_interest.data).not.to.be.null
      expect(actual.data.relationships.country_of_interest.data.type).to.equal('Country')
      expect(actual.data.relationships.country_of_interest.data.id).to.equal('86bfa86d-a015-4260-b425-61cbf4f05a7d')
    })
    it('Should format the form into an API call if an id *is* provided', function () {
      const source = {
        id: '261551e5-4a95-4cee-9339-43407f6f3dde',
        subject: 'there is a subject',
        notes: 'there are some notes',
        date: '2017-05-08T00:00:00.00Z',
        company: 'bda922f9-8a9e-42bb-a797-0cc7955505a8',
        dit_team: '1ea9d661-e982-48b7-a3d3-c6f423754076',
        service: 'bf0c2978-ff8e-43bf-a92f-23a7ad769f97',
        status: '1af6e682-bdbc-4220-bdc0-3f7b41dba989',
        contact: 'b61af15e-b77a-4882-a6d0-926f7f4a33a2',
        dit_advisor: 'b96465a6-cd5b-4a24-aff7-bf5bfc02243d',
        uk_region: 'ff5a57b9-2182-4010-9f94-586fad566b56',
        sector: '8356633c-c604-4bd2-9a9a-cd19e3ed3430',
        country_of_interest: '86bfa86d-a015-4260-b425-61cbf4f05a7d'
      }
      const actual = servicedeliveryservice.convertServiceDeliveryFormToApiFormat(source)

      expect(actual).not.to.be.null
      expect(actual.data).not.to.be.null
      expect(actual.data.attributes).not.to.be.null
      expect(actual.data.relationships).not.to.be.null
      expect(actual.data.id).to.equal('261551e5-4a95-4cee-9339-43407f6f3dde')
      expect(actual.data.type).to.equal('ServiceDelivery')
      expect(actual.data.attributes.subject).to.equal('there is a subject')
      expect(actual.data.attributes.notes).to.equal('there are some notes')
      expect(actual.data.attributes.date).to.equal('2017-05-08T00:00:00.00Z')
      expect(actual.data.relationships.company).not.to.be.null
      expect(actual.data.relationships.company.data).not.to.be.null
      expect(actual.data.relationships.company.data.type).to.equal('Company')
      expect(actual.data.relationships.company.data.id).to.equal('bda922f9-8a9e-42bb-a797-0cc7955505a8')
      expect(actual.data.relationships.dit_team).not.to.be.null
      expect(actual.data.relationships.dit_team.data).not.to.be.null
      expect(actual.data.relationships.dit_team.data.type).to.equal('Team')
      expect(actual.data.relationships.dit_team.data.id).to.equal('1ea9d661-e982-48b7-a3d3-c6f423754076')
      expect(actual.data.relationships.service).not.to.be.null
      expect(actual.data.relationships.service.data).not.to.be.null
      expect(actual.data.relationships.service.data.type).to.equal('Service')
      expect(actual.data.relationships.service.data.id).to.equal('bf0c2978-ff8e-43bf-a92f-23a7ad769f97')
      expect(actual.data.relationships.status).not.to.be.null
      expect(actual.data.relationships.status.data).not.to.be.null
      expect(actual.data.relationships.status.data.type).to.equal('ServiceDeliveryStatus')
      expect(actual.data.relationships.status.data.id).to.equal('1af6e682-bdbc-4220-bdc0-3f7b41dba989')
      expect(actual.data.relationships.contact).not.to.be.null
      expect(actual.data.relationships.contact.data).not.to.be.null
      expect(actual.data.relationships.contact.data.type).to.equal('Contact')
      expect(actual.data.relationships.contact.data.id).to.equal('b61af15e-b77a-4882-a6d0-926f7f4a33a2')
      expect(actual.data.relationships.dit_advisor).not.to.be.null
      expect(actual.data.relationships.dit_advisor.data).not.to.be.null
      expect(actual.data.relationships.dit_advisor.data.type).to.equal('Advisor')
      expect(actual.data.relationships.dit_advisor.data.id).to.equal('b96465a6-cd5b-4a24-aff7-bf5bfc02243d')
      expect(actual.data.relationships.uk_region).not.to.be.null
      expect(actual.data.relationships.uk_region.data).not.to.be.null
      expect(actual.data.relationships.uk_region.data.type).to.equal('UKRegion')
      expect(actual.data.relationships.uk_region.data.id).to.equal('ff5a57b9-2182-4010-9f94-586fad566b56')
      expect(actual.data.relationships.sector).not.to.be.null
      expect(actual.data.relationships.sector.data).not.to.be.null
      expect(actual.data.relationships.sector.data.type).to.equal('Sector')
      expect(actual.data.relationships.sector.data.id).to.equal('8356633c-c604-4bd2-9a9a-cd19e3ed3430')
      expect(actual.data.relationships.country_of_interest).not.to.be.null
      expect(actual.data.relationships.country_of_interest.data).not.to.be.null
      expect(actual.data.relationships.country_of_interest.data.type).to.equal('Country')
      expect(actual.data.relationships.country_of_interest.data.id).to.equal('86bfa86d-a015-4260-b425-61cbf4f05a7d')
    })

    it('Should format the form into an API call if an event *is* provided', function () {
      const source = {
        subject: 'there is a subject',
        notes: 'there are some notes',
        date: '2017-05-08T00:00:00.00Z',
        company: 'bda922f9-8a9e-42bb-a797-0cc7955505a8',
        dit_team: '1ea9d661-e982-48b7-a3d3-c6f423754076',
        service: 'bf0c2978-ff8e-43bf-a92f-23a7ad769f97',
        status: '1af6e682-bdbc-4220-bdc0-3f7b41dba989',
        contact: 'b61af15e-b77a-4882-a6d0-926f7f4a33a2',
        dit_advisor: 'b96465a6-cd5b-4a24-aff7-bf5bfc02243d',
        uk_region: 'ff5a57b9-2182-4010-9f94-586fad566b56',
        event: '054d059a-6c3e-445a-948f-98a41882fb84',
        sector: '8356633c-c604-4bd2-9a9a-cd19e3ed3430',
        country_of_interest: '86bfa86d-a015-4260-b425-61cbf4f05a7d'
      }
      const actual = servicedeliveryservice.convertServiceDeliveryFormToApiFormat(source)

      expect(actual).not.to.be.null
      expect(actual.data).not.to.be.null
      expect(actual.data.attributes).not.to.be.null
      expect(actual.data.relationships).not.to.be.null
      expect(actual.data.type).to.equal('ServiceDelivery')
      expect(actual.data.attributes.subject).to.equal('there is a subject')
      expect(actual.data.attributes.notes).to.equal('there are some notes')
      expect(actual.data.attributes.date).to.equal('2017-05-08T00:00:00.00Z')
      expect(actual.data.relationships.company).not.to.be.null
      expect(actual.data.relationships.company.data).not.to.be.null
      expect(actual.data.relationships.company.data.type).to.equal('Company')
      expect(actual.data.relationships.company.data.id).to.equal('bda922f9-8a9e-42bb-a797-0cc7955505a8')
      expect(actual.data.relationships.dit_team).not.to.be.null
      expect(actual.data.relationships.dit_team.data).not.to.be.null
      expect(actual.data.relationships.dit_team.data.type).to.equal('Team')
      expect(actual.data.relationships.dit_team.data.id).to.equal('1ea9d661-e982-48b7-a3d3-c6f423754076')
      expect(actual.data.relationships.service).not.to.be.null
      expect(actual.data.relationships.service.data).not.to.be.null
      expect(actual.data.relationships.service.data.type).to.equal('Service')
      expect(actual.data.relationships.service.data.id).to.equal('bf0c2978-ff8e-43bf-a92f-23a7ad769f97')
      expect(actual.data.relationships.status).not.to.be.null
      expect(actual.data.relationships.status.data).not.to.be.null
      expect(actual.data.relationships.status.data.type).to.equal('ServiceDeliveryStatus')
      expect(actual.data.relationships.status.data.id).to.equal('1af6e682-bdbc-4220-bdc0-3f7b41dba989')
      expect(actual.data.relationships.contact).not.to.be.null
      expect(actual.data.relationships.contact.data).not.to.be.null
      expect(actual.data.relationships.contact.data.type).to.equal('Contact')
      expect(actual.data.relationships.contact.data.id).to.equal('b61af15e-b77a-4882-a6d0-926f7f4a33a2')
      expect(actual.data.relationships.dit_advisor).not.to.be.null
      expect(actual.data.relationships.dit_advisor.data).not.to.be.null
      expect(actual.data.relationships.dit_advisor.data.type).to.equal('Advisor')
      expect(actual.data.relationships.dit_advisor.data.id).to.equal('b96465a6-cd5b-4a24-aff7-bf5bfc02243d')
      expect(actual.data.relationships.uk_region).not.to.be.null
      expect(actual.data.relationships.uk_region.data).not.to.be.null
      expect(actual.data.relationships.uk_region.data.type).to.equal('UKRegion')
      expect(actual.data.relationships.uk_region.data.id).to.equal('ff5a57b9-2182-4010-9f94-586fad566b56')
      expect(actual.data.relationships.sector).not.to.be.null
      expect(actual.data.relationships.sector.data).not.to.be.null
      expect(actual.data.relationships.sector.data.type).to.equal('Sector')
      expect(actual.data.relationships.sector.data.id).to.equal('8356633c-c604-4bd2-9a9a-cd19e3ed3430')
      expect(actual.data.relationships.event).not.to.be.null
      expect(actual.data.relationships.event.data).not.to.be.null
      expect(actual.data.relationships.event.data.type).to.equal('Event')
      expect(actual.data.relationships.event.data.id).to.equal('054d059a-6c3e-445a-948f-98a41882fb84')
      expect(actual.data.relationships.country_of_interest).not.to.be.null
      expect(actual.data.relationships.country_of_interest.data).not.to.be.null
      expect(actual.data.relationships.country_of_interest.data.type).to.equal('Country')
      expect(actual.data.relationships.country_of_interest.data.id).to.equal('86bfa86d-a015-4260-b425-61cbf4f05a7d')
    })
  })
})
