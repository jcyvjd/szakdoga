import React from 'react';

const HowToUse = () => (
    <div className='h-full overflow-auto no-scrollbar'>
        
        In the following document we will explain how this application works.

        <h2>Sign in</h2>
        When you load up the site, you will be greeted with a login screen. You can either login with an existing account or create a new one.
        To do the latter, click on the "already have an account" text and fill in the required fields. Your username must be unique, your password must be at least 6 characters long
        and to confirm your password you have to type it in again in the "Confirm Password" input area. Once you have done that, you will be automaticly logged in with your new account.
        Note that you will be logged in automaticly if you were previously logged in and closed the page without signing out. This will only apply
        if you are using the same browser and device; and you logged in in the past 3 days.

        <h2>Log out</h2>
        To log out, click on the "Log out" icon in the bottom right corner of the screen. After logging out you will be redirected to the login page.
        Logging out will also make you leave any game and room that you were a part of.

        <h2>Home Page</h2>
        In the home screen you can see the list of currently hosted rooms and a form to create a new one.
        To create a new room, type in the name of the room that you want to create(should be unique) and click on the "Create Room" button. You will be navigated inside your 
        newly created room. 
        To join an existing room, you can search through the existing rooms and click on the "Join" button of the room that you want to join.
        You can only join a room if it has a waiting status and has less than 4 users in it.
        If you know the name of the room that you wish to join, you can type it in the search bar to find it more easily. Or you can scroll through the list of RoomCards.

        <h2>Inside a Room</h2>
        <h3>Left side</h3>
        Once you join a room either by creating it or joining it later you will see the same page as every other user in it.
        There is a side bar on the left side of the screen that has some buttons on the top and a live chat below them.
        The buttons on the top are used for leaving the room, setting your status to ready or not ready.
        By leaving the room you will be navigated back to the home page. If you had a game in progress, you will be removed from the game as well.
        If every user leaves the room, the room will be deleted. The same goes for the game that is linked to the room.
        Please don't leave int the middle of a game, as it will affect the others user experience / gameplay. 
        By setting your status to ready you will signal the other users that you are ready to start the game.
        Once every user in the room has a status of ready, the game will start automatically.
        The live chat is used for communicating with the other users in the room. You can type in the input area and send the message by pressing the enter key or the send button.

        The left side panel might not always be visible. If you are using a smaller screen size, the panel will be hidden and you can access it by clicking the "MENU" button at the top of 
        the screen. The menu button will toggle the view between the left and right side of the page.  
        <h3>Right side</h3>
        When you just joined the room and the game is yet to be started you will see the ready status of each user. You can also set your status by clicking on the 
        button next to your own username.
        Once the game starts, you will see the game board on the right side of the screen. The game board consists of the following elements:
        <ul>
            <li>Player boards</li>
            <li>Factories</li>
            <li>Shared market</li>
            <li>Tiles</li>
        </ul> 
        On how to play the game and what each element does, you can read in the "Game Rules" section.

        After the game ends, you will be shown a Score Board, displaying each user and their final score.
        Here you will have a single "Accpet" button that will(make you leave the room and) navigate you back to the home page.
        Note that the room will be deleted after the last user leaves it.
        <h3>
            Have fun using the app!
        </h3>
    </div>
);

export default HowToUse;