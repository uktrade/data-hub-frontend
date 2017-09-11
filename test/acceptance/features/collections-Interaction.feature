@collections-interaction @ignore
Feature: View collection of interactions
  As an existing user
  I would like to view all the Interactions in one place
  And be able to read the interaction details as expected

@collections-interaction-name @ignore
Scenario: View first and last name of interacted contact

Given I am an authenticated user on Data Hub website
And I create a new interaction for a contact
When I search for this interaction name
Then I view an interaction tab
When I click on interaction tab
Then I view the first and last name of the contact involved in the interaction


@collections-interaction-subject @ignore
Scenario: View subject line of interaction

Given I am an authenticated user on Data Hub website
And I create a new interaction for a contact
When I search for this interaction name
Then I view an interaction tab
When I click on interaction tab
Then I view the subject line of the interaction


@collections-interaction-datestamp @ignore
Scenario: View date of interaction

Given I am an authenticated user on Data Hub website
And I create a new interaction for a contact
When I search for this interaction name
Then I view an interaction tab
When I click on interaction tab
Then I view the date of the interaction


@collections-interaction-company @ignore
Scenario: View company name of interaction

Given I am an authenticated user on Data Hub website
And I create a new interaction for a contact
When I search for this interaction name
Then I view an interaction tab
When I click on interaction tab
Then I view the company name of the interaction


@collections-interaction-link @ignore
Scenario: Verify link to interaction details page

Given I am an authenticated user on Data Hub website
And I create a new interaction for a contact
When I search for this interaction name
Then I view an interaction tab
When I click on interaction tab
And I click on the first interaction collection link
Then I navigate to interaction details page
