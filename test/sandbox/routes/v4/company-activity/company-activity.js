import stovaEvent from '../../../fixtures/v4/company-activity/stova-event.json' with { type: 'json' }

export const getCompanyActivityById = (req, res) => {
  const companyActivity = {
    '2df6560a-a7cc-49cb-a257-c4e109204eff': stovaEvent,
  }
  return res.status(200).json(companyActivity[req.params.stovaEventId])
}
