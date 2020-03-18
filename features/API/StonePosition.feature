Feature: Stone Position

    As a developer
    I want to know the position where a Stone is located on the board and in a stack
    The stonebag should contain stone objects

    Scenario: Stone Position after taking Moves
        Given the user initializes a game with the parameters
            | size | 5 |
        When the user executes these moves
            | a1  |
            | a2  |
            | b1  |
            | b2  |
            | a1+ |
        Then all stones should have the position of the square and the stack they are placed on
    Scenario: Stone Position from TPS
        Given the user initializes a game with the parameters
            | size | 5                         |
            | tps  | 1,2,1,2,1/x5/x5/x5/x5 1 1 |
        Then all stones should have the position of the square and the stack they are placed on