const rewire = require('rewire')

describe('#metadata: check getMetadata', () => {
  beforeEach(() => {
    this.metadata = rewire('~/src/lib/metadata')
    this.metadata.__set__('redisClient', null)
  })

  it('gets metadata from URL', async () => {
    let getMetadata = this.metadata.__get__('getMetadata')

    let hawkRequest = sinon.stub().resolves({ fake: 'metadata' })
    this.metadata.__set__('hawkRequest', hawkRequest)
    await getMetadata('fake', 'fakeOptions')
    const { fakeOptions } = this.metadata.__get__('exports')
    expect(hawkRequest).to.have.been.calledOnceWith('http://localhost:8000/v4/metadata/fake')
    expect(fakeOptions).to.deep.equal({ fake: 'metadata' })
  })

  it('fails to get metadata if request cannot be made', async () => {
    let getMetadata = this.metadata.__get__('getMetadata')

    let hawkRequest = sinon.stub().rejects()
    this.metadata.__set__('hawkRequest', hawkRequest)
    await expect(getMetadata('fake', 'fakeOptions')).to.be.rejectedWith(Error)
    const { fakeOptions } = this.metadata.__get__('exports')
    expect(hawkRequest).to.have.been.calledOnceWith('http://localhost:8000/v4/metadata/fake')
    expect(fakeOptions).to.deep.equal(undefined)
  })
})

describe('#metadata: check getMetadataItem', () => {
  beforeEach(() => {
    this.metadata = rewire('~/src/lib/metadata')
  })

  it('gets correct metadata item', async () => {
    let getMetadataItem = this.metadata.__get__('exports').getMetadataItem

    let hawkRequest = sinon.stub().resolves(
      [{ id: 1, name: 'Fake 1' }, { id: 2, name: 'Fake 2' }]
    )
    this.metadata.__set__('hawkRequest', hawkRequest)
    const option = await getMetadataItem('fake', 2)
    expect(hawkRequest).to.have.been.calledOnceWith('http://localhost:8000/v4/metadata/fake')
    expect(option).to.be.deep.equal({ id: 2, name: 'Fake 2' })
  })

  it('fails to get correct metadata item when request cannot be made', async () => {
    let getMetadataItem = this.metadata.__get__('exports').getMetadataItem

    let hawkRequest = sinon.stub().rejects()
    this.metadata.__set__('hawkRequest', hawkRequest)
    await expect(getMetadataItem('fake', 2)).to.be.rejectedWith(Error)
    expect(hawkRequest).to.have.been.calledOnceWith('http://localhost:8000/v4/metadata/fake')
  })
})
