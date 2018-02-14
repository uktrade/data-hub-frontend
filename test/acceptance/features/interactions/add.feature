@interaction-add
Feature: Add a new interaction in Data hub

  @interaction-add--companies-interaction-submit
  Scenario: Companies interaction is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message


  @interaction-add--companies-service-delivery-submit
  Scenario: Companies service delivery is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
    Then I see the success message


  @interaction-add--contacts-interaction-submit
  Scenario: Interaction fields from contacts

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message


  @interaction-add--contacts-service-delivery-submit
  Scenario: Service delivery fields from contacts

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
    Then I see the success message


  @interaction-add--investment-projects-interaction-submit
  Scenario: Interaction fields from investment projects

    Given I navigate to investment project fixture New rollercoaster
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message


  @interactions-add--events-toggle
  Scenario: Toggle service delivery event association

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed


  @interactions-add--service-toggle
  Scenario: Toggle service delivery service fields

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    When I change form dropdown "service" to Tradeshow Access Programme (TAP)
    Then the service fields are visible
    When I change form dropdown "service" to Trade - Enquiry
    Then the service fields are hidden
