@interaction-add
Feature: Add a new interaction in Data hub

  @interaction-add--companies-interaction-submit
  Scenario: Companies interaction is saved

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
      | key                      | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of interaction      | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Communication channel    | interaction.communicationChannel         |
      | Documents                | There are no files or documents          |

  @interaction-add--companies-policy-feedback-submit
  Scenario: Companies policy feedback is saved

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select policy feedback
    Then there are policy feedback fields
    And policy feedback fields are pre-populated
    When a policy feedback is added
      | key                      | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | Policy feedback                          |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of interaction      | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Communication channel    | interaction.communicationChannel         |
      | Documents                | There are no files or documents          |
      | Policy issue type        | interaction.policyIssueType              |
      | Policy area              | interaction.policyArea                   |

  @interaction-add--companies-service-delivery-submit
  Scenario: Companies service delivery is saved

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key                      | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of service delivery | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Event                    | interaction.event                        |
      | Documents                | There are no files or documents          |

  @interaction-add--companies-service-delivery-tap-service-optional-complete-submit
  Scenario: Companies service delivery is saved and TAP service optional fields are specified

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key                      | value                                    |
      | Service                  | Tradeshow Access Programme (TAP)         |
      | Service status           | Completed                                |
      | Grant offered            | 100000                                   |
      | Net receipt              | 50000                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Service status           | interaction.serviceStatus                |
      | Grant offered            | £100,000.00                              |
      | Net receipt              | £50,000.00                               |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of service delivery | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Event                    | interaction.event                        |
      | Documents                | There are no files or documents          |

  @interaction-add--companies-service-delivery-tap-service-optional-empty-submit
  Scenario: Companies service delivery is saved and TAP service optional fields are not specified

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key                      | value                                    |
      | Service                  | Tradeshow Access Programme (TAP)         |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of service delivery | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Event                    | interaction.event                        |
      | Documents                | There are no files or documents          |

  @interaction-add--contacts-interaction-submit
  Scenario: Interaction fields from contacts

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
      | key                      | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of interaction      | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Communication channel    | interaction.communicationChannel         |
      | Documents                | There are no files or documents          |

  @interaction-add--contacts-policy-feedback-submit
  Scenario: Policy feedback fields from contacts

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select policy feedback
    Then there are policy feedback fields
    And policy feedback fields are pre-populated
    When a policy feedback is added
      | key                      | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | Policy feedback                          |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of interaction      | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Communication channel    | interaction.communicationChannel         |
      | Documents                | There are no files or documents          |
      | Policy issue type        | interaction.policyIssueType              |
      | Policy area              | interaction.policyArea                   |

  @interaction-add--contacts-service-delivery-submit
  Scenario: Service delivery fields from contacts

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key                      | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of service delivery | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Event                    | interaction.event                        |
      | Documents                | There are no files or documents          |

  @interaction-add--investment-projects-interaction-submit
  Scenario: Interaction fields from investment projects

    When I navigate to the `investments.interactions` page using `investment project` `New rollercoaster` fixture
    And I click the "Add interaction" link
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
      | key                      | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact                  | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of interaction      | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Investment project       | New rollercoaster                        |
      | Communication channel    | interaction.communicationChannel         |
      | Documents                | There are no files or documents          |

  @interactions-add--events-toggle
  Scenario: Toggle service delivery event association

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed


  @interactions-add--service-toggle
  Scenario: Toggle service delivery service fields

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    When I change form dropdown "service" to Tradeshow Access Programme (TAP)
    Then the service fields are visible
    When I change form dropdown "service_delivery_status" to Completed
    Then the net receipt field is visible
    When I change form dropdown "service_delivery_status" to Current
    Then the net receipt field is hidden
    When I change form dropdown "service" to Bank Referral
    Then the service fields are hidden
