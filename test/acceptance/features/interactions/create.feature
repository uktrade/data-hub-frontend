@interactions-create
Feature: Save an Interaction in Data hub
  As a data hub user
  I would like to add an interaction to data hub
  So that I can collection interaction data

  @interactions-create--companies-interaction
  Scenario: Interaction fields from companies

    Given a company is created
    When I search for the company
    And the first search result is clicked
    And I navigate to the companies contacts page
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then navigating to the create company interactions and services step 1 page
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--contacts-interaction
  Scenario: Interaction fields from contacts

    Given a company is created
    When I search for the company
    And the first search result is clicked
    And I navigate to the companies contacts page
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then navigating to the create contact interactions and services step 1 page
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--investment-projects-interaction @ignore
  Scenario: Interaction fields from investment projects

    Given a company is created
    When I search for the company
    And the first search result is clicked
    And I navigate to the companies contacts page
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then a company investment project is created for interactions
    When navigating to the create investment project interaction page
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--companies-service-delivery
  Scenario: Service delivery fields from companies

    Given a company is created
    When I search for the company
    And the first search result is clicked
    And I navigate to the companies contacts page
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then navigating to the create company interactions and services step 1 page
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated

  @interactions-create--contacts-service-delivery
  Scenario: Service delivery fields from contacts

    Given a company is created
    When I search for the company
    And the first search result is clicked
    And I navigate to the companies contacts page
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then navigating to the create contact interactions and services step 1 page
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated

  @interactions-create--events-toggle
  Scenario: Toggle service delivery event association

    Given a company is created
    When I search for the company
    And the first search result is clicked
    And I navigate to the companies contacts page
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then navigating to the create company interactions and services step 1 page
    And selecting service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed
