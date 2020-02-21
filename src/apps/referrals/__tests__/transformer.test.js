const transformReferralDetails = require('../transformer')
const referralDetails = require('../../../../test/unit/data/referrals/referralDetails')

describe('#transformReferralDetails', () => {
  it('should return details', () => {
    expect(transformReferralDetails(referralDetails)).to.deep.equal({
      subject: 'I am a subject',
      company: 'Lambda plc',
      contact: 'Johnny Cakeman',
      sendingAdviser: {
        name: 'Ian Leggett',
        email: 'caravans@ian.com',
        team: 'Advanced Manufacturing Sector',
      },
      receivingAdviser: {
        name: 'Barry Oling',
        email: 'barry@barry.com',
        team: 'Aberdeen City Council',
      },
      date: '2020-02-16T18:24:58.641396Z',
      notes:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    })
  })
})
