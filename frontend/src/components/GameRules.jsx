import React from 'react';

const GameRules = () => (
    <div className='h-full overflow-auto no-scrollbar'>
        In the following document we will explain the rules of the Azul boardgame.

        <h2>Game Setup</h2>
        This step will be done automatically by our application.
        Each player will recive a player board. the playerboard is divided into:
        <ul>
            <li>Wall</li>
            <li>Pattern Lines</li>
            <li>Floor Line</li>
            <li>Score tracker</li>
        </ul>
        In the pattern lines you will place the tiles that you collect from the factories or the shared market.
        The pattern line can only contain tiles of the same color.
        The wall is where you place the tiles that you have collected from the pattern lines.
        The floor line is where you place the tiles that you can't place in the pattern lines.
        The score tracker is where you keep track of your points.

        <h2>Object of the Game</h2>
        To be the player with the most points at the end of the game.
        The game ends after the round in which at least one player has
        completed a horizontal line of 5 consecutive tiles on their wall.

        <h2>Gameplay</h2>
        The game is played over multiple rounds, each of which is composed of three phases:\
        <ul>
            <li>A. Factory offer</li>
            <li>B. Wall-tiling</li>
            <li>C. Preaparing the next rounnd</li>
        </ul>
        <h3>A. Factory offer</h3>
        On your turn you must pick tiles in one of the following ways:
        Either
        a, Pickk all the tiles of the same color from any one Factory display and then move
        the remaining tiles from the Factory display to the shared market.

        OR

        b, Pick all the tiles of the same color from the shared market. If you are the first player in this 
        round to pick tiles from the shared market, you must also take the starting player marker
        and place it onto the floor line of your board.

        Then add the tiles you picked to one of the 5 pattern lines on your player board(the first line has 1 space
        and the 5th line has 5).
        If the pattern line already holds tiles, you may only add tiles of the same color to it.
        Once all spaces of the pattern line are filled, that line is considered complete.
        If you have picked up more tiles than you can place in your chosen pattern line,
        you must place the excess tiles on the floor line of your board.
        Your goal in this phase is to complete as many of your pattern
        lines as you can, because during the following Wall-tiling phase,
        you will only be able to move tiles from complete pattern lines to
        their corresponding lines on your wall to score points.

        In all later rounds, you must also comply with the following
        rule: You are not allowed to place tiles of a certain color in
        a pattern line whose corresponding line of your wall already
        holds a tile of that color.

        <h4>Floor line</h4>
        Any tiles you have picked that you cannot or do not want to place according to the rules, you must place 
        in your floor line, filling its spaces from left to right. These tiles are considered having 
        fallen on the floor and gicve you minus points in the Wall-tiling phase.
        If all spaces on your floor line are occupied, return any further fallen tiles to the bag.

        This phase ends when the shared market and all Factory displays contain no more tiles.
        Then continue with the Wall-tiling phase.

        {/* example for placing tiles */}

        <h3>B. Wall-tiling</h3>
        This phase can be carried out by all players simultaneously, as they move tiles from their complete 
        pattern lines over to their walls.

        A, Go through your pattern lines from top to bottom. Move the last tile from each complete line
        to the space of the same color in the corresponfing line of your wall. Each time you move a tile, score 
        points  immediatly(see Scoring).

        B, Then, remove all the tiles from any pattern lines that now have no tile at their end.
        These tiles go back to the bag.

        Once that is done, any remaining tiles on the pattern lines stay on your board for the next round.
        {/* example tiling */}

        <h4>Scoring</h4>
        Each tile you move over to your wall is always placed on the space matching its color and immediatly 
        scores as follows:
        if there are no tiles directly adjacent(vertically or horizontally) to the newly placed tile, gain 1 point.
        if there are any tiles adjacent, however, do the following:
        First check if there are 1 or more tiles horizontally linked to the newly placed tile. If so,
        count all these linked tiles(including the newly placed one) and gain that many poins.
        Then check if there are 1 or more tiles vertically linked to the newly placed tile. If so,
        count all these linked tiles(including the newly placed one) and gain that many points.
        {/* example scoring */}

        Finally, at the end of the Wall-tiling phase, check if you have any tiles in your floor line. For each
        tile in your floor line, you lose the number of points indicated.

        Afterwards, remove all tiles in your florr line and place them back in the bag. If you have the starting player
        tile in your floor line, it counts as a normal tile there. But instead of placing it in the bag,
        place it in the shared market.
        {/* more examples  */}

        <h3>C. Preparing the next round</h3>
        If nobody has completed a horizontal line of 5 consecutive tiles on thier wall yet(see End of the game), prepare for the next round
        The player who had the starting player marker will be the starting player in the next round.
        The Facroty displays are refilled with 4 ties each from the bag. Then, start the new round.

        <h2>End of the game</h2>
        The game ends right after the wall-tiling phase in which at least one player has completed at least one
        horizontal line of 5 consecutive tiles on their wall. Once the game has ended, score additional points
        if you have achived the following goals:
        Gain 2 points for each complete horizontal line of 5 consecutive tiles on your wall.
        Gain 7 points for each complete vertical line of 5 consecutive tiles on your wall.
        Gain 10 points for each color of tile of which you have placed all 5 on your wall.

        The player with the most points wins the game. In the case of a tie, the player withmore complete
        horizontal line wins the game. If that does not break the tie, the victory is shared.
        {/* More pictures */}

    </div>
);

export default GameRules;