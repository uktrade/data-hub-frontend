import proposition from '../../../fixtures/v3/investment/proposition.json' with { type: 'json' }
import propositionEvidence from '../../../fixtures/v3/investment/proposition-evidence.json' with { type: 'json' }
import propositionUploadEvidence from '../../../fixtures/v3/investment/proposition-upload-evidence.json' with { type: 'json' }

export const getProposition = function (req, res) {
  res.json(proposition)
}

export const getPropositionEvidence = function (req, res) {
  res.json(propositionEvidence)
}

export const propositionEvidenceUpload = function (req, res) {
  res.json(propositionUploadEvidence)
}

export const propositionEvidenceUploadCallback = function (req, res) {
  res.sendStatus(200)
}

export const deletePropositionEvidence = function (req, res) {
  res.sendStatus(200)
}
