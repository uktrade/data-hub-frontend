const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function getEvidenceForInvestment (token, investmentId) {
  // return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/evidence-group`)

  console.log('~~~~~~~~~~~~~~')

  return [{
    'id': '9253e386-1088-4e72-95ea-e82b967a1ee1',
    'investment_project': '5dc3d601-1587-402f-8bbb-3be1ee7d145b',
    'tags': ['Apples', 'Cherries', 'Strawberries'],
    'comment': 'Lorem Ispum',
    'created_on': '2017-11-23T11:00:00.000000Z',
    'created_by': {
      'id': '62779662-f803-4820-a801-5e973e43fb6c',
      'first_name': 'John',
      'last_name': 'Doe',
      'name': 'John Doe',
    },
    'modified_on': '2017-11-23T11:00:00.000000Z',
    'modified_by': {
      'id': '62779662-f803-4820-a801-5e973e43fb6c',
      'first_name': 'John',
      'last_name': 'Doe',
      'name': 'John Doe',
    },
    document: {
      'id': 'ede5b90d-ef9b-4fe1-9577-7f7ae1c5ff2c',
      'created_by': {
        'id': '62779662-f803-4820-a801-5e973e43fb6c',
        'first_name': 'John',
        'last_name': 'Doe',
        'name': 'John Doe',
      },
      'av_clean': true,
      'original_filename': 'test.txt',
      'url': '/v3/investment/fc76d4d8-751f-448a-8fcf-0aba50f63fdd/evidence-group/24c02a1e-049a-4cdd-8e9a-93d931b5b9e4/document/75a78123-d31b-47b2-bfa8-7f34e4bb94bb/download',
      'status': 'virus_scanned',
      'created_on': '2017-11-23T11:00:00.000000Z',
      'uploaded_on': '2017-11-23T12:00:00.000000Z',
    },
  },{
    'id': '9253e386-1088-4e72-95ea-e82b967a1ee1',
    'investment_project': '5dc3d601-1587-402f-8bbb-3be1ee7d145b',
    'tags': ['Mangoes', 'Strawberries'],
    'comment': 'Lorem Ispum',
    'created_on': '2017-11-23T11:00:00.000000Z',
    'created_by': {
      'id': '62779662-f803-4820-a801-5e973e43fb6c',
      'first_name': 'John',
      'last_name': 'Doe',
      'name': 'John Doe',
    },
    'modified_on': '2017-11-23T11:00:00.000000Z',
    'modified_by': {
      'id': '62779662-f803-4820-a801-5e973e43fb6c',
      'first_name': 'John',
      'last_name': 'Doe',
      'name': 'John Doe',
    },
    document: {
      'id': 'ede5b90d-ef9b-4fe1-9577-7f7ae1c5ff2c',
      'created_by': {
        'id': '62779662-f803-4820-a801-5e973e43fb6c',
        'first_name': 'John',
        'last_name': 'Doe',
        'name': 'John Doe',
      },
      'av_clean': true,
      'original_filename': 'test.txt',
      'url': '/v3/investment/fc76d4d8-751f-448a-8fcf-0aba50f63fdd/evidence-group/24c02a1e-049a-4cdd-8e9a-93d931b5b9e4/document/75a78123-d31b-47b2-bfa8-7f34e4bb94bb/download',
      'status': 'virus_scanned',
      'created_on': '2017-11-23T11:00:00.000000Z',
      'uploaded_on': '2017-11-23T12:00:00.000000Z',
    },
  },
  {
    'id': '9253e386-1088-4e72-95ea-e82b967a1ee1',
    'investment_project': '5dc3d601-1587-402f-8bbb-3be1ee7d145b',
    'tags': ['Bananas', 'Peaches'],
    'comment': 'just need to sign on the dotted line',
    'created_on': '2017-11-23T11:00:00.000000Z',
    'created_by': {
      'id': '62779662-f803-4820-a801-5e973e43fb6c',
      'first_name': 'John',
      'last_name': 'Doe',
      'name': 'John Doe',
    },
    'modified_on': '2017-11-23T11:00:00.000000Z',
    'modified_by': {
      'id': '62779662-f803-4820-a801-5e973e43fb6c',
      'first_name': 'John',
      'last_name': 'Doe',
      'name': 'John Doe',
    },
    document: {
      'id': 'ede5b90d-ef9b-4fe1-9577-7f7ae1c5ff2c',
      'created_by': {
        'id': '62779662-f803-4820-a801-5e973e43fb6c',
        'first_name': 'John',
        'last_name': 'Doe',
        'name': 'John Doe',
      },
      'av_clean': false,
      'original_filename': 'evidence.pdf',
      'url': '/v3/investment/fc76d4d8-751f-448a-8fcf-0aba50f63fdd/evidence-group/24c02a1e-049a-4cdd-8e9a-93d931b5b9e4/document/75a78123-d31b-47b2-bfa8-7f34e4bb94bb/download',
      'status': 'virus_scanned',
      'created_on': '2017-11-23T11:00:00.000000Z',
      'uploaded_on': '2017-11-23T12:00:00.000000Z',
    },
  }

  ]
}

function addEvidence (token, evidence) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${evidence.investment_project}/evidence-document`,
    method: 'POST',
    body: evidence,
  }

  return authorisedRequest(token, options)
}

module.exports = {
  getEvidenceForInvestment,
  addEvidence,
}
