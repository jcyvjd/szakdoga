import React from 'react';

const GameRules = () => (
    <div className='h-full overflow-auto no-scrollbar'>
        In the following document we will explain the rules of the Azul board game.

        <h2 className='text-2xl font-bold mt-4'>Game Setup</h2>
        <p className='mt-2'>This step will be done automatically by our application.</p>
        <p>Each player will receive a player board. The player board is divided into:</p>
        <ul className='list-disc list-inside ml-4 mt-2'>
            <li>Wall</li>
            <li>Pattern Lines</li>
            <li>Floor Line</li>
            <li>Score tracker</li>
        </ul>
        <p className='mt-2'>In the pattern lines, you will place the tiles that you collect from the factories or the shared market.</p>
        <p>The pattern line can only contain tiles of the same color.</p>
        <p>The wall is where you place the tiles that you have collected from the pattern lines.</p>
        <p>The floor line is where you place the tiles that you can't place in the pattern lines.</p>
        <p>The score tracker is where you keep track of your points.</p>

        <h2 className='text-2xl font-bold mt-4'>Object of the Game</h2>
        <p className='mt-2'>To be the player with the most points at the end of the game.</p>
        <p>The game ends after the round in which at least one player has completed a horizontal line of 5 consecutive tiles on their wall.</p>

        <h2 className='text-2xl font-bold mt-4'>Gameplay</h2>
        <p className='mt-2'>The game is played over multiple rounds, each of which is composed of three phases:</p>
        <ul className='list-none list-inside ml-4 mt-2'>
            <li><b>A.</b> Factory offer</li>
            <li><b>B.</b> Wall-tiling</li>
            <li><b>C.</b> Preparing the next round</li>
        </ul>
        <h3 className='text-xl font-bold mt-4'>A. Factory offer</h3>
        <p className='mt-2'>On your turn, you must pick tiles in one of the following ways:</p>
        <p>Either</p>
        <p className='ml-4'><b>a)</b> Pick all the tiles of the same color from any one Factory display and then move the remaining tiles from the Factory display to the shared market.</p>
        <p>OR</p>
        <p className='ml-4'><b>b)</b> Pick all the tiles of the same color from the shared market. If you are the first player in this round to pick tiles from the shared market, you must also take the starting player marker and place it onto the floor line of your board.</p>
        <p>Then add the tiles you picked to one of the 5 pattern lines on your player board (the first line has 1 space and the 5th line has 5).</p>
        <p>If the pattern line already holds tiles, you may only add tiles of the same color to it.</p>
        <p>Once all spaces of the pattern line are filled, that line is considered complete.</p>
        <p>If you have picked up more tiles than you can place in your chosen pattern line, you must place the excess tiles on the floor line of your board.</p>
        <p>Your goal in this phase is to complete as many of your pattern lines as you can because during the following Wall-tiling phase, you will only be able to move tiles from complete pattern lines to their corresponding lines on your wall to score points.</p>
        <p>In all later rounds, you must also comply with the following rule: You are not allowed to place tiles of a certain color in a pattern line whose corresponding line of your wall already holds a tile of that color.</p>

        <h4 className='text-lg font-bold mt-4'>Floor line</h4>
        <p className='mt-2'>Any tiles you have picked that you cannot or do not want to place according to the rules, you must place in your floor line, filling its spaces from left to right. These tiles are considered having fallen on the floor and give you minus points in the Wall-tiling phase.</p>
        <p>If all spaces on your floor line are occupied, return any further fallen tiles to the bag.</p>
        <p>This phase ends when the shared market and all Factory displays contain no more tiles. Then continue with the Wall-tiling phase.</p>

        {/* example for placing tiles */}

        <h3 className='text-xl font-bold mt-4'>B. Wall-tiling</h3>
        <p className='mt-2'>This phase can be carried out by all players simultaneously as they move tiles from their complete pattern lines over to their walls.</p>
        <p className='ml-4'>A, Go through your pattern lines from top to bottom. Move the last tile from each complete line to the space of the same color in the corresponding line of your wall. Each time you move a tile, score points immediately (see Scoring).</p>
        <p className='ml-4'>B, Then, remove all the tiles from any pattern lines that now have no tile at their end. These tiles go back to the bag.</p>
        <p>Once that is done, any remaining tiles on the pattern lines stay on your board for the next round.</p>
        {/* example tiling */}

        <h4 className='text-lg font-bold mt-4'>Scoring</h4>
        <p className='mt-2'>Each tile you move over to your wall is always placed on the space matching its color and immediately scores as follows:</p>
        <p>If there are no tiles directly adjacent (vertically or horizontally) to the newly placed tile, gain 1 point.</p>
        <p>If there are any tiles adjacent, however, do the following:</p>
        <p className='ml-4'>First, check if there are 1 or more tiles horizontally linked to the newly placed tile. If so, count all these linked tiles (including the newly placed one) and gain that many points.</p>
        <p className='ml-4'>Then, check if there are 1 or more tiles vertically linked to the newly placed tile. If so, count all these linked tiles (including the newly placed one) and gain that many points.</p>
        {/* example scoring */}

        <p className='mt-2'>Finally, at the end of the Wall-tiling phase, check if you have any tiles in your floor line. For each tile in your floor line, you lose the number of points indicated.</p>
        <p>Afterwards, remove all tiles in your floor line and place them back in the bag. If you have the starting player tile in your floor line, it counts as a normal tile there. But instead of placing it in the bag, place it in the shared market.</p>
        {/* more examples  */}

        <h3 className='text-xl font-bold mt-4'>C. Preparing the next round</h3>
        <p className='mt-2'>If nobody has completed a horizontal line of 5 consecutive tiles on their wall yet (see End of the game), prepare for the next round.</p>
        <p>The player who had the starting player marker will be the starting player in the next round.</p>
        <p>The Factory displays are refilled with 4 tiles each from the bag. Then, start the new round.</p>

        <h2 className='text-2xl font-bold mt-4'>End of the game</h2>
        <p className='mt-2'>The game ends right after the Wall-tiling phase in which at least one player has completed at least one horizontal line of 5 consecutive tiles on their wall.</p>
        <p>Once the game has ended, score additional points if you have achieved the following goals:</p>
        <p className='ml-4'>Gain 2 points for each complete horizontal line of 5 consecutive tiles on your wall.</p>
        <p className='ml-4'>Gain 7 points for each complete vertical line of 5 consecutive tiles on your wall.</p>
        <p className='ml-4'>Gain 10 points for each color of tile of which you have placed all 5 on your wall.</p>
        <p>The player with the most points wins the game. In the case of a tie, the player with more complete horizontal lines wins the game. If that does not break the tie, the victory is shared.</p>
        {/* More pictures */}
    </div>
);

export default GameRules;