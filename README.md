 ..*To deploy to Netlify, used command: git push -u origin --force master:netlify-deploy

 ..*To clone from a specific branch:  $ git clone --single-branch -b netlify-deploy https
://github.com/hacka-slash/spaceshooter.git

 ..*!!** Must create logic to limit the amount of sprites on the screen at one time.. vicous, nasty and ugly lag

########## Fix-Respawn:

..I will have the user click where they want to respawn at and get a display message to do just that.

..Will create a bool called isWaitingToRespawn. This will be listening and while in update if the user clicks the screen and this bool is set to true it will respawn where clicked. This is set to true if player is indeed waiting to respawn. Will also give a countdown to do this via: setTimeOut(). This countdown will be displayed to the screen. 
 ..If the player does not click, the the old/original respawn logic will run, which may or may not lead directly into the line of fire from the enemy ships.
 ..If the player does click in time, a clearTimeOut() will execute and the player will respawn according to those coordinates.


 ######### Login-Logic:
 ..Must create a server.js file


 ######## Sprite-limit:
 ..Everytime a game object is added to the screen, the global sprite count will incriment. When the sprite leaves the screen it will 'destroy()' and the global count will decriment.

 ..before every sprite.add, we call: 'if(this.spriteCountCheck())' which returns a boolean if the sprite count is ok.

 ..SpriteCountCheck increments on every gameObjects.add() but we must decrement on everytime the Object is destroyed. Also check where they go off screen to be sure they are 'destroyed()' and the decrement happens. 

 ..Within the sprite's 'killThis()' The sprite.kill() or this.destroy() does not stop the sprite from updating and using up memory.. Perhaps an outside function that goes thru all gameObjects nd deletes them by changing them to null?

..
