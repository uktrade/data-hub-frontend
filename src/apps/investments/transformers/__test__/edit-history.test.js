const { transformAuditLog } = require('../edit-history')

describe('#transformAuditLog', () => {
  const testUser = {
    name: 'John Doe',
    email: 'john@doe.doe',
  }

  const testTimestamp = '2019-12-10T18:07:27.864590Z'

  const testChanges = {
    a_change: [false, true],
  }

  it('should return an empty array when there is no audit log', () => {
    const actual = transformAuditLog([])
    expect(actual).to.deep.equal([])
  })

  it('should return array of objects with timestamp, user and changes values, where there is an audit log with changes', () => {
    const actual = transformAuditLog([
      {
        user: testUser,
        timestamp: testTimestamp,
        changes: testChanges,
      },
    ])
    expect(actual[0].timestamp).to.equal('2019-12-10T18:07:27.864590Z')
    expect(actual[0].changedBy).to.equal('John Doe')
    expect(actual[0].changes).to.deep.equal([
      {
        fieldName: 'A change',
        oldValue: false,
        newValue: true,
      },
    ])
  })

  it('should return empty changes values objects, where there is an audit log without changes', () => {
    const actual = transformAuditLog([
      {
        user: testUser,
        timestamp: testTimestamp,
        changes: {},
      },
    ])

    expect(actual[0].changes).to.deep.equal([])
  })

  it('should return user email if there is no user name given', () => {
    const actual = transformAuditLog([
      {
        user: {
          email: 'test@test.testtest',
        },
        timestamp: testTimestamp,
        changes: testChanges,
      },
    ])

    expect(actual[0].changedBy).to.equal('test@test.testtest')
  })
})
