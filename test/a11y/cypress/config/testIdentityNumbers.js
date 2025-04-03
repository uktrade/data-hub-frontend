import { companyFaker } from '../../../functional/cypress/fakers/companies'
import { investmentProjectFaker } from '../../../functional/cypress/fakers/investment-projects'
import {
  objectiveFaker,
  objectiveListFaker,
} from '../../../functional/cypress/fakers/objective'
import { propositionFaker } from '../../../functional/cypress/fakers/propositions'

const company = companyFaker()
const investment = investmentProjectFaker({
  investor_company: company.id,
})
const listOfObjectives = objectiveListFaker((length = 2))
const objective = objectiveFaker({ company: company })
const proposition = propositionFaker({ investmentProject: investment })
const doNotHave = 'do_not_have'

export const testIdentityNumbers = {
  ':companyId': listOfObjectives[0].company.id,
  ':contactId': '952232d2-1d25-4c3a-bcac-2f3a30a94da9',
  ':countryId': '3e6debb4-1596-40c5-aa25-f00da0e05af9',
  ':eventId': 'b93d4273-36fe-4008-ac40-fbc197910791',
  ':eybLeadId': '45122997-f323-4161-9ea4-2babe305b598',
  ':globalHqId': '3e6debb4-1596-40c5-aa25-f00da0e05af9',
  ':interactionId': 'd14abf23-7f07-4640-8908-cb6b40dc3ce3',
  ':exportId': 'f5bc555e-0eba-4a7e-abe9-db89a78afc5c',
  ':investmentId': investment.id,
  ':listId': '75e14e32-292e-4d1b-a361-992d548251f7',
  ':opportunityId': 'a84f8405-c419-40a6-84c8-642b7c3209b2',
  ':orderId': '7ea3943c-6220-41c8-b704-ff0c4b33b346',
  ':objectiveId': objective.id,
  ':projectId': investment.id,
  ':propositionId': proposition.id,
  ':referralId': 'cc5b9953-894c-44b4-a4ac-d0f6a6f6128f',
  ':subsidiaryCompanyId': 'cc7e2f19-7251-4a41-a27a-f98437720532',
  ':taskId': '162ba2d6-8b78-4720-b644-626b010be30b',
  ':winId': '1',
  // Missing ID numbers
  ':theme': doNotHave,
  ':kind': doNotHave,
  ':pipelineItemId': doNotHave,
}
