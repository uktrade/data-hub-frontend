const { transformCompanyAuditLog } = require('../transformers')

describe('Edit history transformers', () => {
  it('should return an empty array when there are no changes', () => {
    const transformed = transformCompanyAuditLog([])
    expect(transformed).to.deep.equal([])
  })

  it('should transform an archived company', () => {
    expect(transformCompanyAuditLog([
      {
        id: 236,
        user: {
          id: '8b76daf2-0f8a-4887-9b4b-43bbda21c934',
          first_name: 'Paul',
          last_name: 'Gain',
          name: 'Paul Gain',
          email: 'paul.gain@digital.trade.gov.uk',
        },
        timestamp: '2019-12-10T18:07:27.864590Z',
        comment: '',
        changes: {
          archived: [
            false,
            true,
          ],
          archived_on: [
            null,
            '2019-12-10T18:07:27.974000Z',
          ],
          archived_reason: [
            null,
            'Company is dissolved',
          ],
          archived_by: [
            null,
            'Paul Gain',
          ],
        },
      },
    ])).to.deep.equal([
      {
        timestamp: '2019-12-10T18:07:27.864590Z',
        changedBy: 'Paul Gain',
        changes: [
          {
            fieldName: 'archived',
            oldValue: false,
            newValue: true,
          },
          {
            fieldName: 'archived_reason',
            oldValue: null,
            newValue: 'Company is dissolved',
          },
        ],
      },
    ])
  })

  it('should transform an unarchived company', () => {
    expect(transformCompanyAuditLog([
      {
        id: 237,
        user: {
          id: '8b76daf2-0f8a-4887-9b4b-43bbda21c934',
          first_name: 'Paul',
          last_name: 'Gain',
          name: 'Paul Gain',
          email: 'paul.gain@digital.trade.gov.uk',
        },
        timestamp: '2019-12-10T18:12:37.649476Z',
        comment: '',
        changes: {
          archived: [
            true,
            false,
          ],
          archived_on: [
            '2019-12-10T18:07:27.974000Z',
            null,
          ],
          archived_reason: [
            'Company is dissolved',
            '',
          ],
          archived_by: [
            'Paul Gain',
            null,
          ],
        },
      },
    ])).to.deep.equal([
      {
        timestamp: '2019-12-10T18:12:37.649476Z',
        changedBy: 'Paul Gain',
        changes: [
          {
            fieldName: 'archived',
            oldValue: true,
            newValue: false,
          },
          {
            fieldName: 'archived_reason',
            oldValue: 'Company is dissolved',
            newValue: '',
          },
        ],
      },
    ])
  })

  it('should transform a company address', () => {
    expect(transformCompanyAuditLog([
      {
        id: 233,
        user: {
          id: '8b76daf2-0f8a-4887-9b4b-43bbda21c934',
          first_name: 'Paul',
          last_name: 'Gain',
          name: 'Paul Gain',
          email: 'paul.gain@digital.trade.gov.uk',
        },
        timestamp: '2019-12-10T17:58:59.393078Z',
        comment: '',
        changes: {
          address_1: [
            '14 Wharf Road',
            'Her Majesty’s Courts and Tribunals Service - 102 Petty France',
          ],
          address_2: [
            '',
            'Westminster',
          ],
          address_town: [
            'Brentwood',
            'London',
          ],
          address_county: [
            'Essex',
            'Greater London',
          ],
          address_postcode: [
            'CM14 4LQ',
            'SW1H 9AJ',
          ],
        },
      },
    ])).to.deep.equal([
      {
        timestamp: '2019-12-10T17:58:59.393078Z',
        changedBy: 'Paul Gain',
        changes: [
          {
            fieldName: 'address_1',
            oldValue: '14 Wharf Road',
            newValue: 'Her Majesty’s Courts and Tribunals Service - 102 Petty France',
          },
          {
            fieldName: 'address_2',
            oldValue: '',
            newValue: 'Westminster',
          },
          {
            fieldName: 'address_town',
            oldValue: 'Brentwood',
            newValue: 'London',
          },
          {
            fieldName: 'address_county',
            oldValue: 'Essex',
            newValue: 'Greater London',
          },
          {
            fieldName: 'address_postcode',
            oldValue: 'CM14 4LQ',
            newValue: 'SW1H 9AJ',
          },
        ],
      },
    ])
  })

  it('should transform a DnB company', () => {
    expect(transformCompanyAuditLog([
      {
        id: 235,
        user: {
          id: '8b76daf2-0f8a-4887-9b4b-43bbda21c934',
          first_name: 'Paul',
          last_name: 'Gain',
          name: 'Paul Gain',
          email: 'paul.gain@digital.trade.gov.uk',
        },
        timestamp: '2019-12-10T18:04:54.287410Z',
        comment: '',
        changes: {
          sector: [
            'Biotechnology and Pharmaceuticals',
            'Airports',
          ],
          description: [
            null,
            'Superior editing services',
          ],
          uk_region: [
            'South East',
            'London',
          ],
        },
      },
    ])).to.deep.equal([
      {
        timestamp: '2019-12-10T18:04:54.287410Z',
        changedBy: 'Paul Gain',
        changes: [
          {
            fieldName: 'sector',
            oldValue: 'Biotechnology and Pharmaceuticals',
            newValue: 'Airports',
          },
          {
            fieldName: 'description',
            oldValue: null,
            newValue: 'Superior editing services',
          },
          {
            fieldName: 'uk_region',
            oldValue: 'South East',
            newValue: 'London',
          },
        ],
      },
    ])
  })

  it('should transform a company trading address', () => {
    expect(transformCompanyAuditLog([
      {
        id: 234,
        user: {
          id: '8b76daf2-0f8a-4887-9b4b-43bbda21c934',
          first_name: 'Paul',
          last_name: 'Gain',
          name: 'Paul Gain',
          email: 'paul.gain@digital.trade.gov.uk',
        },
        timestamp: '2019-12-10T18:00:52.265115Z',
        comment: '',
        changes: {
          trading_names: [
            [],
            [
              'Edit History Enterprises',
            ],
          ],
        },
      },
    ])).to.deep.equal([
      {
        timestamp: '2019-12-10T18:00:52.265115Z',
        changedBy: 'Paul Gain',
        changes: [
          {
            fieldName: 'trading_names',
            oldValue: null,
            newValue: 'Edit History Enterprises',
          },
        ],
      },
    ])
  })

  it('should transform when the user is null - DnB update', () => {
    expect(transformCompanyAuditLog([
      {
        id: 234,
        user: null,
        timestamp: '2019-12-10T14:39:28.768359Z',
        comment: 'Updated from D&B [celery:company_update]',
        changes: {
          address_1: [
            '1600 Amphitheatre Pkwyz',
            '1600 Amphitheatre Pkwy',
          ],
          dnb_modified_on: [
            null,
            '2019-12-10T14:39:28.768000Z',
          ],
        },
      },
    ])).to.deep.equal([
      {
        timestamp: '2019-12-10T14:39:28.768359Z',
        changedBy: 'automaticUpdate',
        changes: [
          {
            fieldName: 'address_1',
            oldValue: '1600 Amphitheatre Pkwyz',
            newValue: '1600 Amphitheatre Pkwy',
          },
        ],
      },
    ])
  })
})
