@interaction-save
Feature: Save a new interaction in Data hub
  As an Data Hub user
  I would like to add an interaction record to data hub
  So that I can enable the collection of key interaction data

  @interaction-save--companies-interaction-submit
  Scenario: Companies interaction is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message

  @interaction-save--companies-service-delivery-submit
  Scenario: Companies service delivery is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
    Then I see the success message

  @interaction-save--contacts-interaction-submit
  Scenario: Interaction fields from contacts

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message

  @interaction-save--contacts-service-delivery-submit
  Scenario: Service delivery fields from contacts

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
    Then I see the success message

  @interaction-save--investment-projects-interaction-submit
  Scenario: Interaction fields from investment projects

    Given I navigate to investment project fixture New rollercoaster
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message
