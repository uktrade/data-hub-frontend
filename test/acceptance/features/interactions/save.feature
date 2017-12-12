@interaction-save
Feature: Save a new interaction in Data hub
  As an Data Hub user
  I would like to add an interaction record to data hub
  So that I can enable the collection of key interaction data

  @interaction-save--companies-interaction-submit
  Scenario: Companies interaction is saved

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the company "Interactions" tab
    And I click the "Add interaction" link
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message

  @interaction-save--companies-service-delivery-submit
  Scenario: Companies service delivery is saved

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    When a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the company "Interactions" tab
    And I click the "Add interaction" link
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
    Then I see the success message

  @interactions-create--contacts-interaction-submit
  Scenario: Interaction fields from contacts

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the contact "Interactions" tab
    And I click the "Add interaction" link
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message

  @interactions-create--contacts-service-delivery-submit
  Scenario: Service delivery fields from contacts

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the contact "Interactions" tab
    And I click the "Add interaction" link
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
    Then I see the success message

  @interactions-create--investment-projects-interaction-submit @ignore
  Scenario: Interaction fields from investment projects

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then a company investment project is created for interactions
    When I navigate to the investment project "Interactions" tab
    And I click the "Add interaction" link
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message
