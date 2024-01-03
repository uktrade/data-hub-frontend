const { ERROR_MESSAGES } = require('../constants')
const { validateTeamMembers } = require('../validation')

describe('validateTeamMembers', () => {
  context('When team_members is missing', () => {
    it('should return null', () => {
      expect(validateTeamMembers()).to.be.null
    })
  })

  context('When team_members is not an array', () => {
    it('should return null', () => {
      expect(validateTeamMembers('1234567abcdef')).to.be.null
      expect(validateTeamMembers('abc')).to.be.null
    })
  })

  context('When team_members is an array below 5 items', () => {
    it('should return null', () => {
      expect(validateTeamMembers([1, 2, 3, 4])).to.be.null
      expect(validateTeamMembers('abc')).to.be.null
    })
  })

  context('When team_members is an array equal to 5 items', () => {
    it('should return null', () => {
      expect(validateTeamMembers([1, 2, 3, 4, 5])).to.be.null
    })
  })

  context('When team_members is an array above to 5 items', () => {
    it('should return an validation message', () => {
      expect(validateTeamMembers([1, 2, 3, 4, 5, 6])).to.be.equal(
        ERROR_MESSAGES.team_members
      )
    })
  })
})
