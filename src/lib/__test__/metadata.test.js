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
    expect(hawkRequest).to.have.been.calledOnceWith(`${config.apiRoot}/v4/metadata/fake`)
  })
  describe('#getMetadata', () => {
    beforeEach(() => {
      metadata.__set__('redisClient', null)
    })
    it('gets metadata from URL', async () => {
      let getMetadata = metadata.__get__('getMetadata')

      hawkRequest = sinon.stub().resolves({ fake: 'metadata' })
      metadata.__set__('hawkRequest', hawkRequest)
      await getMetadata('fake', 'fakeOptions')
      const { fakeOptions } = metadata.__get__('exports')
      expect(fakeOptions).to.deep.equal({ fake: 'metadata' })
    })

    it('fails to get metadata if request cannot be made', async () => {
      let getMetadata = metadata.__get__('getMetadata')

      hawkRequest = sinon.stub().rejects()
      metadata.__set__('hawkRequest', hawkRequest)
      await expect(getMetadata('fake', 'fakeOptions')).to.be.rejectedWith(Error)
      const { fakeOptions } = metadata.__get__('exports')
      expect(fakeOptions).to.deep.equal(undefined)
    })
  })

  describe('#getMetadataItem', () => {
    it('gets correct metadata item', async () => {
      const getMetadataItem = metadata.__get__('exports').getMetadataItem

      hawkRequest = sinon.stub().resolves(
        [{ id: 1, name: 'Fake 1' }, { id: 2, name: 'Fake 2' }]
      )
      metadata.__set__('hawkRequest', hawkRequest)
      const option = await getMetadataItem('fake', 2)
      expect(option).to.be.deep.equal({ id: 2, name: 'Fake 2' })
    })

    it('fails to get correct metadata item when request cannot be made', async () => {
      const getMetadataItem = metadata.__get__('exports').getMetadataItem

      hawkRequest = sinon.stub().rejects()
      metadata.__set__('hawkRequest', hawkRequest)
      await expect(getMetadataItem('fake', 2)).to.be.rejectedWith(Error)
    })
  })
})
