const rewire = require('rewire')

const config = require('../../config')

const modulePath = '../metadata'

describe('metadata', () => {
  let metadata
  let hawkRequest
  beforeEach(() => {
    metadata = rewire(modulePath)
  })
  afterEach(() => {
    expect(hawkRequest).to.have.been.calledOnceWith(
      `${config.apiRoot}/v4/metadata/fake`
    )
  })
  describe('#getMetadata', () => {
    beforeEach(() => {
      metadata.__set__('redisClient', null)
    })
    it('gets metadata from URL', async () => {
      const getMetadata = metadata.__get__('getMetadata')

      hawkRequest = sinon.stub().resolves({ fake: 'metadata' })
      metadata.__set__('hawkRequest', hawkRequest)
      await getMetadata('fake', 'fakeOptions')
      const { fakeOptions } = metadata.__get__('exports')
      expect(fakeOptions).to.deep.equal({ fake: 'metadata' })
    })

    it('fails to get metadata if request cannot be made', async () => {
      const getMetadata = metadata.__get__('getMetadata')

      hawkRequest = sinon.stub().rejects()
      metadata.__set__('hawkRequest', hawkRequest)
      await expect(getMetadata('fake', 'fakeOptions')).to.be.rejectedWith(Error)
      const { fakeOptions } = metadata.__get__('exports')
      expect(fakeOptions).to.deep.equal(undefined)
    })
  })
})
