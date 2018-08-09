
const mockFilesResponse = require('~/test/unit/data/document-upload/files-response.json')

const {
  transformFilesResultsToDetails,
  transformLabelsToShowFiles,
} = require('~/src/apps/document-upload/transformers')

describe('Document Upload Transformers', () => {
  describe('#transformFilesResultsToDetails', () => {
    context('when a file is uploaded', () => {
      beforeEach(() => {
        const investmentProjectId = 'investmentprojectid123'
        const propositionId = 'propositionid456'
        this.transformed = transformFilesResultsToDetails(mockFilesResponse, propositionId, investmentProjectId)
      })

      it('should transform display a download link if the virus scan is successful', () => {
        expect(this.transformed).to.deep.equal({
          file1: [
            '001BC61C-400-400.jpg',
            '\n            <a href="/investment-projects/investmentprojectid123/propositions/propositionid456/download/e5de035f-86d5-4cc1-80a3-4b7f03876da8">Download</a>\n        ',
          ],
        })
      })
    })
  })

  describe('#transformLabelsToShowFiles', () => {
    const mockLabels = {
      'apples': 'Pears',
      'cherries': 'Berries',
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
