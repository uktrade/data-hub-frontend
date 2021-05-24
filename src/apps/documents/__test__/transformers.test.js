const mockFilesResponse = require('../../../../test/unit/data/documents/files-response.json')

const {
  transformFilesResultsToDetails,
  transformLabelsToShowFiles,
} = require('../transformers')

const propositionId = '1'
const investmentId = '2'

describe('Document Upload Transformers', () => {
  describe('#transformFilesResultsToDetails', () => {
    const commonTests = ({ expectedFileName, expectedItem }) => {
      it('should set the file name', () => {
        expect(this.transformed.file1[0]).to.equal(expectedFileName)
      })

      it('should set the link', () => {
        expect(this.transformed.file1[1]).to.deep.equal(expectedItem)
      })
    }

    context('when file passed virus scan', () => {
      beforeEach(() => {
        const response = [
          {
            ...mockFilesResponse[0],
            status: 'virus_scanned',
            av_clean: true,
          },
        ]

        this.transformed = transformFilesResultsToDetails(
          response,
          propositionId,
          investmentId
        )
      })

      commonTests({
        expectedFileName: mockFilesResponse[0].original_filename,
        expectedItem: {
          name: 'Download',
          url: `/investments/projects/2/propositions/1/download/${mockFilesResponse[0].id}`,
        },
      })
    })

    context('when file failed virus scan', () => {
      beforeEach(() => {
        const response = [
          {
            ...mockFilesResponse[0],
            status: 'virus_scanned',
            av_clean: false,
          },
        ]

        this.transformed = transformFilesResultsToDetails(
          response,
          propositionId,
          investmentId
        )
      })

      commonTests({
        expectedFileName: mockFilesResponse[0].original_filename,
        expectedItem: {
          name: "The file didn't pass virus scanning, contact your administrator",
          type: 'error',
        },
      })
    })

    context('when file has not been scanned', () => {
      beforeEach(() => {
        const response = [
          {
            ...mockFilesResponse[0],
            status: 'not_virus_scanned',
            av_clean: false,
          },
        ]

        this.transformed = transformFilesResultsToDetails(
          response,
          propositionId,
          investmentId
        )
      })

      commonTests({
        expectedFileName: mockFilesResponse[0].original_filename,
        expectedItem: 'File not virus scanned',
      })
    })

    context('when file virus scanning is scheduled', () => {
      beforeEach(() => {
        const response = [
          {
            ...mockFilesResponse[0],
            status: 'virus_scanning_scheduled',
            av_clean: false,
          },
        ]

        this.transformed = transformFilesResultsToDetails(
          response,
          propositionId,
          investmentId
        )
      })

      commonTests({
        expectedFileName: mockFilesResponse[0].original_filename,
        expectedItem: 'Virus scanning scheduled',
      })
    })

    context('when file virus scanning is in progress', () => {
      beforeEach(() => {
        const response = [
          {
            ...mockFilesResponse[0],
            status: 'virus_scanning_in_progress',
            av_clean: false,
          },
        ]

        this.transformed = transformFilesResultsToDetails(
          response,
          propositionId,
          investmentId
        )
      })

      commonTests({
        expectedFileName: mockFilesResponse[0].original_filename,
        expectedItem: 'File is being scanned, try again in a few moments',
      })
    })

    context('when file virus scanning failed', () => {
      beforeEach(() => {
        const response = [
          {
            ...mockFilesResponse[0],
            status: 'virus_scanning_failed',
            av_clean: false,
          },
        ]

        this.transformed = transformFilesResultsToDetails(
          response,
          propositionId,
          investmentId
        )
      })

      commonTests({
        expectedFileName: mockFilesResponse[0].original_filename,
        expectedItem: 'Virus scanning failed, contact your administrator',
      })
    })
  })

  describe('#transformLabelsToShowFiles', () => {
    const mockLabels = {
      apples: 'Pears',
      cherries: 'Berries',
    }

    context('when a file element is transformed', () => {
      beforeEach(() => {
        const mockKey = 'file21'
        this.transformed = transformLabelsToShowFiles(mockKey, mockLabels)
      })

      it('should generate a label string for each file element', () => {
        expect(this.transformed).to.equal('File 21')
      })
    })

    context('when a usual form element is transformed', () => {
      beforeEach(() => {
        const mockKey = 'apples'
        this.transformed = transformLabelsToShowFiles(mockKey, mockLabels)
      })

      it('should get the form element label from the labels file', () => {
        expect(this.transformed).to.equal('Pears')
      })
    })
  })
})
