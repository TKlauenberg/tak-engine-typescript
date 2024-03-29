Feature: Move handling
    As a User
    I want to excecute different Moves
    in order to play the game

  Background: Initial Game
    When Bop initializes a game with the parameters
      | size | 5 |

  Scenario: simple first move
    When Bop places a flat stone at b2
    Then On b2 is a flat black stone

  Scenario: both player one move
    When Bop places a flat stone at a1
    And Bop places a flat stone at e5
    Then On a1 is a flat black stone
    Then On e5 is a flat white stone

  Scenario: completed second round
    When Bop places a flat stone at b2
    And Bop places a flat stone at a1
    And Bop places a flat stone at a2
    And Bop places a flat stone at a3
    Then On b2 is a flat black stone
    And On a1 is a flat white stone
    And On a2 is a flat white stone
    And On a3 is a flat black stone

  Scenario: place standing stone
    When Bop places a flat stone at b2
    And Bop places a flat stone at a1
    And Bop places a standing stone at a2
    And Bop places a standing stone at a3
    Then On a2 is a standing white stone
    And On a3 is a standing black stone

  Scenario: place capstone
    When Bop places a flat stone at b2
    And Bop places a flat stone at a1
    And Bop places a capstone at a2
    And Bop places a capstone at a3
    Then On a2 is a white capstone
    And On a3 is a black capstone
