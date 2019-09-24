Feature: Win Recognition

    As a User
    I want that the game engine recognizes a win
    So that I don't need manually end the game

    Scenario Outline: Road Wins with TPS
        When I parse the PTN file
            """
            [Size "<size>"]
            [TPS "<tps>"]
            """
        Then the game ends
        And the result is "<result>"
        Examples:
            | size | tps                        | result |
            | 3    | 1,1,1/x3/x3 2 1            | R-0    |
            | 3    | 1,x2/1,x2/1,x2 2 1         | R-0    |
            | 3    | 1,1,x1/x1,1,x1/x1,1,x1 2 1 | R-0    |
            | 3    | 2,2,2/x3/x3 2 1            | 0-R    |
            | 3    | 2,x2/2,x2/2,x2 2 1         | 0-R    |
            | 3    | 2,2,x1/x1,2,x1/x1,2,x1 2 1 | 0-R    |

    Scenario Outline: Flat count Wins with TPS
        When I parse the PTN file
            """
            [Size "<size>"]
            [TPS "<tps>"]
            """
        Then the game ends
        And the result is "<result>"
        Examples:
            | size | tps                                                     | result  |
            # full board
            | 3    | 1,2,1/2,1,2/1,2,1 2 1                                   | F-0     |
            | 3    | 2,1,2/1,2,1/2,1,2 2 1                                   | 0-F     |
            # all stones on one tile so that the top player wins
            | 3    | 12121212121212121212,x2/x3/x3 2 1                       | 0-F     |
            | 3    | 21212121212121212121,x2/x3/x3 2 1                       | F-0     |
            # draw between two player
            | 3    | 1212121212121212121,2,x1/x3/x3 2 1                      | 1/2-1/2 |
            | 3    | 2121212121212121212,1,x1/x3/x3 2 1                      | 1/2-1/2 |
            # bigger board
            | 5    | 1,2,1,2,1/2,1,2,1,2/1,2,1,2,1/2,1,2,1,2/1,2,1,2,1 2 1   | F-0     |
            # capstone doesn't count to flat stones
            | 5    | 1,2,1,2,1/2,1,2,1,2/1,2,1,2,1/2,1,2,1,2/1,2,1,2,1C 2 1  | 1/2-1/2 |
            | 5    | 1,2,1,2,1/2,1,2,1,2/1,2,1,2,1/2,1,2,1,2/1,2,1,2C,1C 2 1 | F-0     |