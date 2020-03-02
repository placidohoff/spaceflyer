########## Fix-Respawn:

..I will have the user click where they want to respawn at and get a display message to do just that.

..Will create a bool called isWaitingToRespawn. This will be listening and while in update if the user clicks the screen and this bool is set to true it will respawn where clicked. This is set to true if player is indeed waiting to respawn. Will also give a countdown to do this via: setTimeOut(). This countdown will be displayed to the screen. 
 ..If the player does not click, the the old/original respawn logic will run, which may or may not lead directly into the line of fire from the enemy ships.
 ..If the player does click in time, a clearTimeOut() will execute and the player will respawn according to those coordinates.