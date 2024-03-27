const { mergeSectorAndSubSectorParams } = require('../../services')

describe('mergeSectorAndSubSectorParams', () => {
  const basicRequestBody = {
    sortby: 'desc',
    archived: 'false',
    area: [],
    uk_postcode: undefined,
  }
  it('should merge the sector and sub sector params when both are present', () => {
    const reqBody = {
      ...basicRequestBody,
      sector_descends: ['sector_uuid1'],
      sub_sector_descends: ['sub_sector_uuid1'],
    }

    expect(mergeSectorAndSubSectorParams(reqBody)).to.deep.equal({
      ...basicRequestBody,
      sector_descends: ['sector_uuid1', 'sub_sector_uuid1'],
    })
  })

  it('should merge all sector and sub sector params when multiple of both are present', () => {
    const reqBody = {
      ...basicRequestBody,
      sector_descends: ['sector_uuid1', 'sector_uuid2'],
      sub_sector_descends: ['sub_sector_uuid1', 'sub_sector_uuid2'],
    }

    expect(mergeSectorAndSubSectorParams(reqBody)).to.deep.equal({
      ...basicRequestBody,
      sector_descends: [
        'sector_uuid1',
        'sector_uuid2',
        'sub_sector_uuid1',
        'sub_sector_uuid2',
      ],
    })
  })

  it('should include just the sector params if there are not any sub sector params', () => {
    const reqBody = {
      ...basicRequestBody,
      sector_descends: ['sector_uuid1', 'sector_uuid2'],
    }

    expect(mergeSectorAndSubSectorParams(reqBody)).to.deep.equal({
      ...basicRequestBody,
      sector_descends: ['sector_uuid1', 'sector_uuid2'],
    })
  })

  it('should include just the sub sector params if there are not any sector params', () => {
    const reqBody = {
      ...basicRequestBody,
      sub_sector_descends: ['sub_sector_uuid1', 'sub_sector_uuid2'],
    }

    expect(mergeSectorAndSubSectorParams(reqBody)).to.deep.equal({
      ...basicRequestBody,
      sector_descends: ['sub_sector_uuid1', 'sub_sector_uuid2'],
    })
  })

  it('should not include any sector or sub sector params if neither are present', () => {
    expect(mergeSectorAndSubSectorParams(basicRequestBody)).to.deep.equal(
      basicRequestBody
    )
  })
})
