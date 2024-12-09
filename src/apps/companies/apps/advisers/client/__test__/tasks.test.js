import proxyquire from 'proxyquire'

import { expectThrowsAsync } from '../../../../../../../test/unit/helpers/promise-assertions'

describe('updateAdviser', () => {
  const adviserData = {
    dit_participants: { value: '123' },
    companyId: 'abc',
  }
  const adviserEmail = 'e@example.com'
  let tasks

  describe('when the update is succesful', () => {
    beforeEach(() => {
      tasks = proxyquire('../tasks', {
        '../../../../../client/components/Task/utils': {
          apiProxyAxios: {
            get: () =>
              Promise.resolve({
                data: {
                  one_list_group_global_account_manager: {
                    contact_email: adviserEmail,
                  },
                },
              }),
            post: () => Promise.resolve(),
          },
        },
      })
    })
    it('returns the lead ITA info', async () => {
      const result = await tasks.updateAdviser(adviserData)
      expect(result).to.deep.equal({
        contact_email: adviserEmail,
        email: adviserEmail,
      })
    })
  })

  describe('when there is no global lead ITA', () => {
    beforeEach(() => {
      tasks = proxyquire('../tasks', {
        '../../../../../client/components/Task/utils': {
          apiProxyAxios: {
            get: () => Promise.resolve({ data: {} }),
            post: () => Promise.resolve(),
          },
        },
      })
    })

    it('returns an error message', async () => {
      await expectThrowsAsync(
        () => tasks.updateAdviser(adviserData),
        "No global Lead ITAs were found for this company. Please note: it is not possible to add Lead ITAs to a subsidiary that are not attached to the company's Global Headquarters"
      )
    })
  })
})
