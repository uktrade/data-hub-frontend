const transformReferralDetails = require('../transformer')
const referralDetails = require('../../../../../../test/unit/data/referrals/referralDetails')

describe('#transformReferralDetails', () => {
  it('should return details', () => {
    expect(transformReferralDetails(referralDetails)).to.deep.equal({
      subject: 'I am a subject',
      completed: false,
      company: {
        name: 'Lambda plc',
        id: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
      },
      contact: {
        name: 'Johnny Cakeman',
        id: '9b1138ab-ec7b-497f-b8c3-27fed21694ef',
      },
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
      // We need to have explicit undefined, because deep equal is sensitive
      // about not existent and set to undefined properties.
      interaction: undefined,
      date: '2020-02-16T18:24:58.641396Z',
      notes:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    })
  })
})
