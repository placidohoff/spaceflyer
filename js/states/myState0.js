var player, isKeyDown, starfield, width, height, bullets, shootButton, basic, basicEnemies, nextEnemy, enemyRate, enemyLasers, nextMultipleEnemy, multipleEnemyRate, score, text, bigUfoGroup, playerLives, numberOfPlayerLives, gameOverText, isGameOver, isWaitingToRespawn, playerHitTimeOut, respawnText, enemySpriteCount, nextPowerUp, powerUpRate, moveSpeed, energyBar, stepBarSize, nextPowerUpTimer, powerUpTimerRate, isGotPowerup, powerUpGroup, shipShield, hasShield, enemyLevel;
var gameOptions = {

};
var enemyOptions = {

};

var openState = {
    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        // game.width = 400;
        // game.height = 600;
        //this.sprite;

    },

    preload: function () {
        var pad;
        var stick;
        this.load.atlas('arcade', 'assets/joystick/arcade-joystick.png', 'assets/joystick/arcade-joystick.json');
        this.load.image('ship', 'assets/thrust.png');
        game.load.image('starfield', 'assets/starfield.jpg');
        game.load.image('laser', 'assets/laser.png', 13, 22);
        game.load.image('enemylaser', 'assets/enemylaser1.png', 13, 22);

        //var sprite;
        game.load.image('basicenmy0', 'assets/spritesheets/enemy/basicenemy0.png');
        game.load.image('ufo', 'assets/spritesheets/enemy/ufoenemy.png')

        game.load.atlas('explosion_atlas', 'assets/spritesheets/explosions/explosionsheet.png', 'assets/spritesheets/explosions/explosionjson.json');
        game.load.atlas('playerexplosion_atlas', 'assets/spritesheets/explosions/explosionsplayer.png', 'assets/spritesheets/explosions/explosionsplayer.json');

        game.load.atlas('bigexplosion', 'assets/spritesheets/explosions/bigexplosion/bigexplosionsheet.png', 'assets/spritesheets/explosions/bigexplosion/bigexplosionsheet.json');


        game.load.image('bigufo', 'assets/bigufo.png');

        game.load.image('laserball', 'assets/laserball.png');

        game.load.image('powerup-shield', 'assets/powerups/powerup-shield.png');
        game.load.image('basic', 'assets/powerups/powerup-basic.png');
        game.load.image('powerup-bomb', 'assets/powerups/powerup-bomb.png');
        game.load.image('powerup-rapid', 'assets/powerups/powerup-rapid.png');
        game.load.image('powerup-speed', 'assets/powerups/powerup-speed.png');
        game.load.image('powerup-spray', 'assets/powerups/powerup-spray.png');


        game.load.image('energybar', 'assets/powerups/energybar.png');

        game.load.image('shipShield', 'assets/powerups/shipShield.png');

        game.load.image('missile', 'assets/powerups/missile.png');

    },
    create: function () {
        //alert("hello");
        width = game.width;
        height = game.height;
        game.stage.backgroundColor = "#ffcccc";
        starfield = game.add.tileSprite(0, 0, width, height, 'starfield');
        addChangeStateEventListeners();

        pad = game.plugins.add(Phaser.VirtualJoystick);
        stick = pad.addStick(600, 300, 150, 'arcade');
        stick.alignBottomRight();

        shootButton = pad.addButton(game.width + 60, game.height + 60, 'arcade', 'button1-up', 'button1-down');
        //shootButton.alignBottomRight();
        //shootButton.y -= 200;
        //shootButton.onDown.add(this.fireWeapon, this);
        //this.add.tween(stick).to( { posX: 140, posY: 460 }, 2000, "Back.easeOut", true, 500);
        //alert(shootButton);
        //alert(stick);

        player = this.add.sprite(400, game.height, 'ship');
        player.texture.baseTexture.scaleMode = PIXI.NEAREST;
        player.scale.set(2);
        player.anchor.set(0.5, 0.5);
        this.physics.arcade.enable(player);
        player.angle -= 90;
        player.nextFire = 0;
        player.fireRate = 500;
        player.width = 50;
        player.height = 50;
        player.score = 0;
        // player.weapon = 'powerup-speed';
        // //player.weapon == "powerup=speed" ? moveSpeed = 800 : moveSpeed = 400;
        // if(player.weapon == 'powerup-speed')
        //     moveSpeed = 800;
        player.weapon = 'basic';
        player.fireRate = 500;
        player.ability = 'none';
        player.isDead = false;

        isKeyDown = false;

        //this.createGroups();

        basicEnemies = game.add.group();
        basicEnemies.enableBody = true;
        basicEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        //basicenemies.createMultiple(50, 'basicenmy0');
        //basicenemies.setAll('checkWorldBounds', true);
        //basicEnemies.events.onOutOfBounds.add(this.offScreenKill, this);
        basicEnemies.setAll('checkWorldBounds', true);
        basicEnemies.setAll('outOfBoundsKill', true);
        nextEnemy = 0;
        enemyRate = 3000;

        nextMultipleEnemy = 0;
        multipleEnemyRate = 500;

        ufoEnemyGroup = game.add.group();
        ufoEnemyGroup.enableBody = true;
        ufoEnemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
        ufoEnemyGroup.setAll('checkWorldBounds', true);
        ufoEnemyGroup.setAll('outOfBoundsKill', true);

        lasers = game.add.group();
        lasers.enableBody = true;
        lasers.physicsBodyType = Phaser.Physics.ARCADE;
        //lasers.createMultiple(50, 'laser');
        //lasers.angle += 90;
        lasers.setAll('checkWorldBounds', true);
        lasers.setAll('outOfBoundsKill', true);

        // var lsr = this.add.sprite(200, 200, 'laser');
        // lsr.height += 50;

        enemyLasers = game.add.group();
        enemyLasers.enableBody = true;
        enemyLasers.physicsBodyType = Phaser.Physics.ARCADE;
        enemyLasers.createMultiple(100, 'enemylaser');
        enemyLasers.setAll('checkWorldBounds', true);
        enemyLasers.setAll('outOfBoundsKill', true);

        bigUfoGroup = game.add.group();
        bigUfoGroup.enableBody = true;
        bigUfoGroup.physicsBodyType = Phaser.Physics.ARCADE;

        



        totalObjects = game.add.group();
        nextClearTotalObj = 0;
        clearTotalObjRate = 10000;

        //var text = this.add.bitmapText(20, 30, 'HELLO WORLD', 96).setOrigin(0.5);
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        //TWEEN:
        game.add.tween(player).to({ y: game.world.centerY + 100 }, 1000, Phaser.Linear, true);

        score = 0;
        text = game.add.text(20, 40, "Score: " + score);
        //text.anchor.setTo(0.5);
        text.addColor('#ffffff', 0);
        text.font = 'Revalia';
        text.fontSize = 16;

        playerLives = [];
        numberOfPlayerLives = 2;
        for(var i = 0; i <= numberOfPlayerLives; i++){
            playerLives[i] = this.add.sprite(25 + i*20, text.y + text.height, 'ship');
            playerLives[i].width = 20;
            playerLives[i].height = 20;
            playerLives[i].angle -= 90;
            playerLives[i].anchor.set(0.5, 0.5);
        }

        isGameOver = false;
        isWaitingToRespawn = false;
        enemySpriteCount = 0;

        nextPowerUp = 0;
        powerUpRate = 6000;

        powerUpGroup = game.add.group();
        powerUpGroup.enableBody = true;
        powerUpGroup.physicsBodyType = Phaser.Physics.ARCADE;
        powerUpGroup.setAll('checkWorldBounds', true);
        powerUpGroup.setAll('outOfBoundsKill', true);
        //numberOfPlayerLives--;

        moveSpeed = 400;
        if(player.weapon == 'powerup-speed')
            moveSpeed = 800;

            // energyBar = this.add.sprite(400, 10, "energybar");
            // energyBar.width = 50;
            // energyBar.height = 10;
            // stepBarSize = energyBar.width / 30;

            //let energyMask = this.add.sprite(energyBar.x, energyBar.y, "energybar");
 
            // ...it's not visible...
            //energyMask.visible = false;
     
            // and we assign it as energyBar's mask.
            //energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, energyMask);
        nextPowerUpTimer = 0;
        powerUpTimerRate = 500

        isGotPowerup = false;
        hasShield = false;

        enemyLevel = 0;
    },

    update: function (enemy, shield) {

        if(score < 15)
            enemyLevel = 0;
        else if(score > 15 && score < 30 )
            enemyLevel = 0;
        else if(score > 30 && score < 45 )
            enemyLevel = 0;
        else
            enemyLevel = 0;

        if(isGotPowerup){
            this.timeBarMinus();
            if(hasShield){
                shipShield.x = player.x;
                shipShield.y = player.y;
            }
            
        }
        this.dropPowerUp();
        this.spawnEnemy();

        //Player Respawn Return To Not Invulnerable:
        /*if(player.y >= player.endPosY)
            player.body.enable = true;*/
        //score++;
        if(game.input.activePointer.isDown){
            if(isWaitingToRespawn){
                clearTimeout(playerHitTimeOut)
                this.respawnPlayer(game.input.activePointer.x, game.input.activePointer.y);
            }
        }
        

        if(!isGameOver){
        text.setText("Score: "+ score);
        //COLLISIONS:
        if(hasShield){
            game.physics.arcade.overlap(shipShield, enemyLasers.children, this.shieldHit);    
            game.physics.arcade.overlap(shipShield, basicEnemies.children, this.shieldHit);    
        }
        game.physics.arcade.overlap(player, enemyLasers.children, this.playerHit);
        game.physics.arcade.overlap(player, basicEnemies.children, this.playerHit);
        game.physics.arcade.overlap(ufoEnemyGroup.children, lasers.children, this.ufoHit);
        game.physics.arcade.overlap(lasers.children, ufoEnemyGroup.children, this.ufoHit);
        game.physics.arcade.overlap(basicEnemies.children, ufoEnemyGroup.children, this.basicEnemyHit);
        game.physics.arcade.overlap(lasers.children, basicEnemies.children, this.basicEnemyHit);
        
        game.physics.arcade.collide(ufoEnemyGroup.children, lasers.children, this.ufoHit);
        game.physics.arcade.collide(lasers.children, ufoEnemyGroup.children, this.ufoHit);
        game.physics.arcade.overlap(lasers.children, bigUfoGroup.children, this.bigUfoHit);
        game.physics.arcade.overlap(player, powerUpGroup.children, this.getPowerUp);

        this.checkEnemiesOffScreen();

        //game.physics.arcade.collide(lasers.children, ufoEnemyGroup.children, this.ufoHit);


        
        
        //this.spawnPowerUp();

        //BIG-UFO GROUP:
        for(var i = 0; i < bigUfoGroup.length; i++){
            bigUfoGroup.children[i].update();
            //this.boundsCheck(bigUfoGroup.children[i]);
        }

        //ENEMYUFO GROUP:
        for (var i = 0; i < ufoEnemyGroup.children.length; i++) {
            if (ufoEnemyGroup.children[i].alive) {
                // lasers.children[i].x += lasers.children[i].body.velocity.x;
                // basicEnemies.children[i].y += basicEnemies.children[i].body.velocity.y;
                ufoEnemyGroup.children[i].update();
                this.boundsCheck(ufoEnemyGroup.children[i]);
            }
        }
        //BASICENEMY GROUP:
        for (var i = 0; i < basicEnemies.children.length; i++) {
            if (basicEnemies.children[i].alive) {
                // lasers.children[i].x += lasers.children[i].body.velocity.x;
                // basicEnemies.children[i].y += basicEnemies.children[i].body.velocity.y;
                basicEnemies.children[i].update();
                //console.log("Falling " + basicEnemies.children[i].y);
                this.boundsCheck(basicEnemies.children[i]);
            }
        }
        //ENEMYLASERS GROUP:
        for (var i = 0; i < enemyLasers.children.length; i++) {
            if (enemyLasers.children[i].alive) {
                // lasers.children[i].x += lasers.children[i].body.velocity.x;
                // basicEnemies.children[i].y += basicEnemies.children[i].body.velocity.y;
                //basicEnemies.children[i].update();
                //console.log(enemyLasers.children[i].y);
                if (enemyLasers.children[i].y > game.height || enemyLasers.children[i].x > game.width || enemyLasers.children[i].x < 0) {
                    //enemyLasers.children[i].destroy();
                }
                this.boundsCheck(enemyLasers.children[i]);
            }
        }
        //BULLETS GROUP:
        for (var i = 0; i < lasers.children.length; i++) {
            if (lasers.children[i].alive) {
                // lasers.children[i].x += lasers.children[i].body.velocity.x;
                lasers.children[i].y += lasers.children[i].body.velocity.y;
                lasers.children[i].body.velocity.y = -10;
            }
            //this.boundsCheck(lasers.children[i]);
            if (lasers.children[i].y < 0) {
                lasers.children[i].destroy();
                //this.boundsCheck(lasers.children[i]);
            }
        }

        //POWERUPS GROUP:
        for(let i = 0; i < powerUpGroup.children.length; i++){
            if(powerUpGroup.children[i].alive){
                //powerUpGroup.children[i].y += powerUpGroup.children[i].body.velocity.y;
                powerUpGroup.children[i].update();
                //console.log(powerUpGroup.children)
                if(powerUpGroup.children[i].y >= game.height + 10){
                    //console.log(powerUpGroup.children)
                    //this.boundsCheck(powerUpGroup.children[i])
                    powerUpGroup.children[i].destroy();
                }
                //this.boundsCheck(powerUpGroup.children[i]);
            }
        }

        //COLLISIONS:
       
        //DEBBUGGING: Seeing how many objects are in my game currently:
        //console.log(enemyLasers.children.length);


        starfield.tilePosition.y += 2;
        this.checkInput();
        var maxSpeed = moveSpeed;

        if (stick.isDown) {
            this.physics.arcade.velocityFromRotation(stick.rotation, stick.force * maxSpeed, player.body.velocity);
            //this.sprite.rotation = stick.rotation;
        }
        else if (!stick.isDown && !game.input.keyboard.isDown()) {
            if (isKeyDown == false)
                player.body.velocity.set(0);
        }

        shootButton.isDown = true;
        if (shootButton.isDown) {
            this.fireWeapon();
        }

        //PLAYER CANNOT GO OFFSCREEN:
        if(player.x <= 0){
            player.x = 10;
            player.x += 2;
        }
        if(player.x >= game.width){
            player.x = game.width - 10;
            player.x -= 2;
        }
        if(player.y > game.height){
            player.y = game.height - 10;
            player.y -= 2;
        }

        //sprite.x += sprite.body.velocity.x;
        //sprite.y += sprite.body.velocity.y;
        //console.log(sprite.body.velocity.x);
        //this.clearEnemyField();
    }

    },
    shieldHit: function(enemy, shield){
        //alert("Yo");
        var theShield;
        var theEnemy;
        if (enemy.sig) {
            theEnemy = enemy;
            theShield = shield;
        } else {
            theEnemy = shield;
            theShield = enemy;
        }
        //theEnemy.loadTexture('explosion_atlas');
        //theEnemy.destroy();
        score += theEnemy.score;
        theEnemy.killThis();
    },
    timeBarMinus: function(){
        //let timer = setTimeout(function(){ energyBar.width -= stepBarSize; clearTimeout(timer) }, 3000);
        if (game.time.now > nextPowerUpTimer) {
            nextPowerUpTimer = game.time.now + powerUpTimerRate;
            energyBar.width -= stepBarSize;
        }
        if(energyBar.width <= 0){
            energyBar.destroy();
            player.weapon = 'basic';
            player.ability = 'none';
            isGotPowerup = false;
            
            if(hasShield)
                shipShield.destroy();

            hasShield = false;

            player.nextFire = 0;
            player.fireRate = 500;
            moveSpeed = 400;
        }
        
    },
    getPowerUp: function(plyr, pwr){
        if(isGotPowerup){
            energyBar.destroy();
            if(hasShield)
                shipShield.destroy();
        }
        isGotPowerup = true;
        player.weapon = pwr.signiture;
        player.nextFire = 0;
        player.fireRate = 500;
        moveSpeed = 400;
        if(pwr.signiture == 'powerup-rapid'){
            player.fireRate = 100;
            //player.weapon = pwr.signiture;
        }
        else if(pwr.signiture == 'powerup-shield'){
            //change the sprite to the shieldShip. When shieldShip breaks, call breakShield() which will
             //do the break animation and change the ship sprite back to the original.
             //player.ability = pwr.signiture;
             shipShield = game.add.sprite(player.x, player.y, "shipShield");
             shipShield.anchor.set(0.5,0.5);
             shipShield.width = 100;
             shipShield.height = 100;
             game.physics.arcade.enable(shipShield);
             hasShield = true;


        }
        else if(pwr.signiture == "powerup-speed"){
            moveSpeed = 800;
            player.fireRate = 150;
        }
        //alert(power);
        pwr.destroy();

        energyBar = game.add.sprite(playerLives[0].x, playerLives[0].y + playerLives[0].height, "energybar");
        energyBar.width = 50;
        energyBar.height = 10;
        stepBarSize = energyBar.width / 30;
        //alert(power);
    },
    dropPowerUp: function() {
        //Powerups we will have:
            //Shield
            //Spray
            //Bomb
            //Rapid-Fire Rate
            //Speed

        //Would be more neat if we put all the string names of the powerups into an array, and assign
         //variable name that way instead of the method used here buuuuut.....
            
        if(game.time.now > nextPowerUp){
            nextPowerUp = game.time.now + powerUpRate;
            let randomPick = Math.floor(Math.random() * 6);
            let name;

            if(randomPick == 0)
                name = "powerup-shield";
            else if(randomPick == 1)
                name = "powerup-spray"
            else if(randomPick == 2){
                //name = "powerup-bomb"
                name = "basic"
            }
            else if(randomPick == 3)
                name = "powerup-rapid"
            else if(randomPick == 4)
                name = "basic";
            else    
                name="powerup-speed";


            let x = Math.floor(Math.random() * game.width);
            //alert(x);
            let powerUp = new PowerUp(this.game, x, -10, name);
            console.log(powerUp);
            powerUpGroup.add(powerUp);
            console.log(powerUpGroup);
        }
    },

    spriteCountCheck: function(){
        //console.log(enemySpriteCount);
        if(enemySpriteCount < 55){
            enemySpriteCount++;
            return true;
        }
        return false
    },
    checkEnemiesOffScreen: () => {
        //Check each enemygroup here and check their bounds
        /*basicEnemies
        ufoEnemyGroup
        lasers
        enemyLasers*/

        this.basicEnemies.forEach(enemy => {
            if(enemy.y > game.height){
                
                enemy.destroy();
                //enemy = null;
                enemySpriteCount--;
            }
        })

        this.ufoEnemyGroup.forEach(enemy => {
            if(enemy.x < 0){
                enemy.destroy()
                enemySpriteCount--;
            }
            else if(enemy.x > game.width){
                enemy.destroy()
                enemySpriteCount--;
            }

        })

        this.lasers.forEach(laser => {
            if(laser.y + laser.height < 0){
                laser.destroy();
            }
        })

        this.enemyLasers.forEach(laser => {
            if(laser.y > game.height){
                laser.destroy();
                enemySpriteCount--;
            }
        })

    },

    clearEnemyField: function () {
        if (game.time.now > nextClearTotalObj) {
            //var enemy;
            nextClearTotalObj = game.time.now + clearTotalObjRate;
            for (var i = 0; i < totalObjects.length; i++) {
                if (totalObjects[i])
                    totalObjects[i].kill();
            }
            console.log("Clear All");
            this.createGroups();
        }
    },
    boundsCheck: function (obj) {
        /*if(obj.x > game.width || obj.x < 0 || obj.y < -100 || obj.y > game.heigh){
            obj.destroy();
        }*/

        if(obj.sig == "bigUfo"){
            if(obj.x > game.width || obj.x < 0){
                obj.destroy();
            }
        }
        if(obj.sig2 == "enemyUfo"){
            if(obj.x > game.width || obj.x < 0){
                obj.destroy();
            }
        }
        if (obj.sig == "fallingObject") {
       if (obj.y > game.height) {
                obj.destroy();
            }
        }
        else if (obj.sig == "enemyUfoLaser") {
            if (obj.y > game.height) {
                obj.destroy();
            }
        }
        else if (obj.sig2 == "playerLaser") {
            if (obj.y < 0)
                obj.destroy();
        }
    },
    offScreenKill: function (obj) {
        obj.kill();
    },
    ufoHit: function (ufo, laser) {
        //console.log("ufo hit")
        //console.log(ufo.sig, "a");
        //console.log(laser.sig, "b");
        var theLaser;
        var theUfo;
        if (ufo.sig) {
            theUfo = ufo;
            theLaser = laser;
        } else {
            theUfo = laser;
            theLaser = ufo;
        }
        if (!theUfo.isHit) {
            var target;
            for (var i = 0; i < ufoEnemyGroup.children.length; i++) {
                if (theUfo.idNum == ufoEnemyGroup.children[i].idNum) {
                    console.log(theUfo.idNum)
                    target = ufoEnemyGroup.children[i];
                    //ufoEnemyGroup.children[i].killThis();
                    //alert(ufoEnemyGroup.children[i]);
                }
            }
            
            if(!target.isHit){
                score += target.score;
                console.log(target.idNum);
                target.killThis();
                theLaser.destroy();
            }
            //ufo.destroy();
        }
        //console.log(target);

    },
    basicEnemyHit: function (ufo, laser) {
        //console.log("ufo hit")
        //console.log(ufo.sig, "a");
        //console.log(laser.sig, "b");
        var theLaser, theUfo;
        if (ufo.sig) {
            theUfo = ufo;
            theLaser = laser;
        } else {
            theUfo = laser;
            theLaser = ufo;
        }
        var target;
        for (var i = 0; i < basicEnemies.children.length; i++) {
            if (theUfo.uid == basicEnemies.children[i].uid) {
                target = basicEnemies.children[i];
                //ufoEnemyGroup.children[i].killThis();
                //alert(ufoEnemyGroup.children[i]);
            }
        }
        score += target.score;
        target.killThis();
        theLaser.destroy();
        //console.log(target);

    },
    whatThe: function(){
        alert("new");
    },
    playerHit: function () {
        player.isDead = true;
        console.log("hit");
        // game.this.checkInput();
        player.loadTexture('playerexplosion_atlas');
        player.animations.add('explode', Phaser.Animation.generateFrameNames('explo', 0, 12), 5, true);

        player.body.enable = false;
        player.animations.play('explode', 12, false);
        //LOGIC: Hanlde Player Respawn
        game.add.tween(playerLives[numberOfPlayerLives]).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

        numberOfPlayerLives--;

        player.animations.currentAnim.onComplete.add(function () {
            if(numberOfPlayerLives < 0){
                // alert("Game Over. Your Score is " + score);
                // player.body.enable = false;
                openState.gameOver();
            }
            else{
                //Must handle the user clicking to the screen get those coordinates,
        //then we will use those coords to call player = game.add.sprite()
                var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
                respawnText = game.add.text(game.world.centerX, game.world.centerY, "Click Where To Respawn", style);
                respawnText.anchor.set(0.5);
                respawnText.alpha = 0.1;

                respawnTextAnimation = game.add.tween(text).to( { alpha: 1 }, 3000, "Linear", true);
                isWaitingToRespawn = true;
                playerHitTimeOut = window.setTimeout(() => {
                   //alert('yo');
                    openState.respawnPlayer(-10, -10);
            
            }, 4000);
        //game.time.events.add(Phaser.Timer.SECOND * 4, this.doThis, this);
        // let pos = game.input.mousePointer.x;
        // alert(pos);

        // respawnTextAnimation.onComplete.add(doSomething, this);function doSomething () { game.state.start('gameOver',true, false, score);}


                // player = game.add.sprite(400, game.height, 'ship');
                // player.texture.baseTexture.scaleMode = PIXI.NEAREST;
                // player.scale.set(2);
                // player.anchor.set(0.5, 0.5);
                // game.physics.arcade.enable(player);

                // player.angle -= 90;
                // player.nextFire = 0;
                // player.fireRate = 200;
                // player.width = 50;
                // player.height = 50;

                // player.endPosY = game.world.centerY + 200;

                // game.add.tween(player).to({ y: player.endPosY }, 1000, Phaser.Linear, true);

                
            }
        })
        //this.handlePlayerRespawn();

        
        //numberOfPlayerLives--;

        if(isGotPowerup){
            isGotPowerup = false;
            energyBar.destroy();
            if(hasShield){
                shipShield.destroy();
            }
        }
        //isGotPowerup = false;
        player.weapon = 'basic';
        player.ability = 'none';
    },
    respawnPlayer: function(coordX, coordY){
        respawnText.destroy();
        isWaitingToRespawn = false;
        let playerX;
        let playerY;
        if(coordX == -10 && coordY == -10){
            playerX = 400;
            playerY = game.world.centerY + 200;
        }else{
            playerX = coordX;
            playerY = coordY;
        }
        player = game.add.sprite(playerX, game.height, 'ship');
        player.texture.baseTexture.scaleMode = PIXI.NEAREST;
        player.scale.set(2);
        player.anchor.set(0.5, 0.5);
        game.physics.arcade.enable(player);

        player.angle -= 90;
        player.nextFire = 0;
        player.fireRate = 500;
        player.width = 50;
        player.height = 50;
        player.isDead = false;
        player.weapon = 'basic';

        

        game.add.tween(player).to({ y: playerY }, 1000, Phaser.Linear, true);
    },
    
    doThis: function(){
        alert("This");
    },
    
    bigUfoHit: function(ufo, laser){
        var theLaser, theUfo;
        if (ufo.sig) {
            theUfo = ufo;
            theLaser = laser;
        } else {
            theUfo = laser;
            theLaser = ufo;
        }
        //theLaser.destroy();
        //theUfo.destroy();
        //console.log("hello");
        //var target = bigUfoGroup.children[0];
        //game.add.tween(theUfo).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, false);
        theUfo.handleHit(theLaser);
        theLaser.destroy();
        //sleep(500);
        //theUfo.alpha = 1;        
    },
    
    handlePlayerRespawn: function (){

        //Must handle the user clicking to the screen get those coordinates,
        //then we will use those coords to call player = game.add.sprite()
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = game.add.text(game.world.centerX, game.world.centerY, "", style);
        text.anchor.set(0.5);
        text.alpha = 0.1;

        var respawnTextAnimation = game.add.tween(text).to( { alpha: 1 }, 3000, "Linear", true);
        respawnTextAnimation.onComplete.add(doSomething, this);function doSomething () { game.state.start('gameOver',true, false, score);}


                // player = game.add.sprite(400, game.height, 'ship');
                // player.texture.baseTexture.scaleMode = PIXI.NEAREST;
                // player.scale.set(2);
                // player.anchor.set(0.5, 0.5);
                // game.physics.arcade.enable(player);

                // player.angle -= 90;
                // player.nextFire = 0;
                // player.fireRate = 200;
                // player.width = 50;
                // player.height = 50;

                // player.endPosY = game.world.centerY + 200;

                // game.add.tween(player).to({ y: player.endPosY }, 1000, Phaser.Linear, true);
    
    },
    spawnEnemy: function () {
        //if(isMultipleEnemiesDone){
        //Before spawning more enemies, should do a double check to kill
        //anything offscreen to avoid lag
        //console.log("hello");
        if(enemyLevel == -1){
            if (game.time.now > nextEnemy) {
                var enemy;
                nextEnemy = game.time.now + enemyRate;
                var nextEnemyNum = this.game.rnd.integerInRange(0, 3);

                //DEBUGGING: ONLY SPAWINING UFO-FORMATIONS:
                    //nextEnemyNum = 1;
                if (nextEnemyNum == 0) {
                    enemy = new BasicEnemy0(this.game, 0, 0);
                    if(this.spriteCountCheck()){
                        basicEnemies.add(enemy);
                    }
                    //totalObjects.add(enemy);
                } else if (nextEnemyNum == 1 || nextEnemyNum == 3) {
                    var howMany = this.game.rnd.integerInRange(0, 6);
                    var whichType = this.game.rnd.integerInRange(0, 1);
                    //DEBUGGING: ONLY SPAWINING UFO-FORMATIONS:
                    // whichType = 1;
                    if (whichType == 0) {
                        this.spawnMultipleEnemies('ufoEnemy', howMany, {x:0,y:0});
                    } else {
                        this.spawnMultipleEnemies('ufoEnemyFormation', howMany, {x:0,y:0});
                    }
                }else if(nextEnemyNum == 2){
                    if(bigUfoGroup.length < 1){
                        enemy = new BigUfo(this.game, 50, 50);
                        //enemy.body.velocity.y = 100;
                        console.log(enemy);
                        //game.add.sprite(200, 200, 'bigufo');
                        if(this.spriteCountCheck()){
                            bigUfoGroup.add(enemy);
                        }
                    }
                }

            }
        }
        //TODO: These should all be basic enemies/astroids that come flying in from the top or the sides
            //either one at a time or in groups of three.

        //One astroid flying in from a random direction.
        else if(enemyLevel == 0){
            if(game.time.now > nextEnemy){
                let enemy;
                nextEnemy = game.time.now + enemyRate;
                    let randomNumber = this.game.rnd.integerInRange(0, 100)
                    if(randomNumber < 75){
                        enemy = new BasicEnemy0(this.game, 0, 0);
                        if(this.spriteCountCheck()){
                            basicEnemies.add(enemy);
                        }
                    }
                    else
                        this.spawnMultipleEnemies('basicEnemy', 0, 0)

            } 
        }
    },
    spawnMultipleEnemies: function (type, howMany, source) {
        //console.log("hello");
        if (type == 'ufoEnemy') {
            //var posX, posY, originNum, origin, endPosY;
            var originNum;
            //Create the enemy stats outside to be passed
            //to the constructor
            var enemyInfo = {
                originX: source.x,
                originY: source.y,
                //originNum: 0,
                origin: '',
                endPosX1: 0,
                endPosY: 0,
                velocityX: 0,
                velocityY: 0,
                direction: '',
                sig: 0,
                isInAFormation: false
            };
            //posX = 
            originNum = this.game.rnd.integerInRange(0, 1);
            if (originNum == 0) {
                enemyInfo.origin = "left";
            } else if (originNum == 1) {
                enemyInfo.origin = "right";
            }

            if (enemyInfo.origin == "left") {
                //posX = this.game.rnd.integerInRange(0, game.width/4);
                //DEBUG: I am changing the origins so it starts on screen so
                //I can see the tween movements
                if(source.x != 0){
                    enemyInfo.originX = source.x
                }else{
                    enemyInfo.originX = /*700*/this.game.rnd.integerInRange(0, game.width / 4);
                }
                enemyInfo.originY = source.y - 100;
                enemyInfo.velocityX = 500;
                enemyInfo.velocityY = 300;
                enemyInfo.direction = "right";
                enemyInfo.endPosX1 = enemyInfo.originX + 350;
                enemyInfo.endPosY = enemyInfo.originY + 150;
            } else if (enemyInfo.origin == "right") {
                if(source.x != 0){
                    enemyInfo.originX = source.x
                }else{
                    enemyInfo.originX = /*700*/this.game.rnd.integerInRange(0, game.width / 4);
                }
                enemyInfo.originY = source.y - 100;
                enemyInfo.velocityX = -500;
                enemyInfo.velocityY = 300;
                enemyInfo.direction = "left";
                enemyInfo.endPosX1 = enemyInfo.originX + 350;
                enemyInfo.endPosY = enemyInfo.originY + 150;
            }
            //LOGIC: Adding multiple enemies at slightly different origin point
            //and slightly different firing rates
            enemyInfo.sig = this.game.rnd.integerInRange(0, 1000);
            for (var i = 0; i < howMany; i++) {
                //if(game.time.now > nextMultipleEnemy){
                //nextMultipleEnemy = game.time.now + multipleEnemyRate;
                var enemy = new UfoEnemy(enemyInfo);
                enemy.x -= 40 * i;
                enemy.laserRate += 40 * i;
                enemy.body.velocity.x = this.game.rnd.integerInRange(200, 500);
                if (enemyInfo.direction == "left")
                    enemy.body.velocity.x *= -1;
                //enemy.endPosY += 10 * i;
                if(this.spriteCountCheck()){
                    ufoEnemyGroup.add(enemy);
                }
                //totalObjects.add(enemy);

                //}
            }

            //var enemy = new UfoEnemy(enemyInfo);
            //console.log(enemy);
            //ufoEnemyGroup.add(enemy);
            //return enemy;
            //ufoEnemyGroup.add(enemy);
        }
        //console.log("hello");
        if (type == 'ufoEnemyFormation') {
            var enemyInfo = {
                originX: 0,
                originY: 0,
                //originNum: 0,
                origin: '',
                endPos1: { x: 0, y: 0 },
                endPos2: { x: 0, y: 0 },
                endPos3: { x: 0, y: 0 },
                endPos4: { x: 0, y: 0 },
                velocityX: 0,
                velocityY: 0,
                direction: '',
                sig: 0,
                isInAFormation: true,
                direction: ''
            };

            //LOGIC: Setting up the ufoFormation's direction and also it's starting position which
            //is based on that direction
            originNum = this.game.rnd.integerInRange(0, 1);
            if (originNum == 0) {
                enemyInfo.origin = "left";
                enemyInfo.direction = "right";
                originX = this.game.rnd.integerInRange(0, game.width / 2);
            } else if (originNum == 1) {
                enemyInfo.origin = "right";
                enemyInfo.direction = "left";
                originX = this.game.rnd.integerInRange(game.width / 2, game.width);
            }





            //LOGIC: Creating the endpoints for the the ufo formation:
            //NOTE: These values have to be based on the "startingDirectionOrigin"
            if (enemyInfo.direction == "left") {
                enemyInfo.endPos1.x = enemyInfo.originX
                enemyInfo.endPos1.y = enemyInfo.originY + 200 //this.game.rnd.integerInRange(200, 600);;

                enemyInfo.endPos2.x = enemyInfo.endPos1.x + 200;
                enemyInfo.endPos2.y = enemyInfo.endPos1.y + 100;

                enemyInfo.endPos3.x = enemyInfo.endPos2.x - 100;
                enemyInfo.endPos3.y = enemyInfo.endPos2.y - 200;

                enemyInfo.endPos4.x = enemyInfo.endPos3.x - 100;
                enemyInfo.endPos4.y = enemyInfo.endPos3.y - 100;
            }
            else if (enemyInfo.direction == "right") {
                enemyInfo.endPos1.x = enemyInfo.originX
                enemyInfo.endPos1.y = enemyInfo.originY + 200; //this.game.rnd.integerInRange(200, 600);;

                enemyInfo.endPos2.x = enemyInfo.endPos1.x + 200;
                enemyInfo.endPos2.y = enemyInfo.endPos1.y + 100;

                enemyInfo.endPos3.x = enemyInfo.endPos2.x + 100;
                enemyInfo.endPos3.y = enemyInfo.endPos2.y - 200;

                enemyInfo.endPos4.x = enemyInfo.endPos3.x - 100;
                enemyInfo.endPos4.y = enemyInfo.endPos3.y - 100;
            }
            //NOTE: the 'X' endPositions don't matter as much as the 'Y', and also within
            //the enemy logic the ship will adjust velocity accordingly as it meets end points Y



            //LOGIC: Adding multiple enemies at slightly different origin point
            //and slightly different firing rates
            enemyInfo.sig = this.game.rnd.integerInRange(0, 1000);
            //enemyInfo.isInAFormation = true;
            var xOrigin = this.game.rnd.integerInRange(0, game.width);
            for (var i = 0; i < howMany; i++) {
                //if(game.time.now > nextMultipleEnemy){
                //nextMultipleEnemy = game.time.now + multipleEnemyRate;
                var enemy = new UfoEnemy(enemyInfo);
                //enemy.x -= 40 * i;
                enemy.x = xOrigin;
                enemy.y = enemy.y - 50 * i;
                enemy.laserRate += 40 * i;
                //enemy.body.velocity.x = 200;//this.game.rnd.integerInRange(100);
                //enemy.body.velocity.y = 200;
                if (enemyInfo.direction == "left")
                    enemy.body.velocity.x *= -1;
                //enemy.endPosY += 10 * i;
                if(this.spriteCountCheck()){
                    ufoEnemyGroup.add(enemy);
                }
                //console.log(enemy.body.velocity);
                //totalObjects.add(enemy);

                //}
            }
        }
        if(type == 'basicEnemy'){
            let configs = {
                space: 40,
                startLeft: -15,
                startRight: game.width + 15
            };
            //alert('hello')
            let originalEnemy = new BasicEnemy0(this.game, 0, 0)
            // let centerOriginX = originalEnemy.x;
            // let originY = originalEnemy.y;
            if(originalEnemy.origin == 'directAbove'){
                for(let i = 0; i < 3; i++){
                   //let enemy = new BasicEnemy0(this.game, centerOriginX += 10 * i, originY )
                   let newEnemy = new BasicEnemy0(this.game, 0, 0)
                   newEnemy.body.velocity = originalEnemy.body.velocity;
                   newEnemy.origin = originalEnemy.origin;
                   newEnemy.direction = originalEnemy.direction;
                   newEnemy.x = originalEnemy.x + configs.space * i
                   newEnemy.y = originalEnemy.y;
                   basicEnemies.add(newEnemy)
                
                }

            }
            else if(originalEnemy.origin == "topLeft"){
                for(let i = 0; i < 2; i++){
                    //let enemy = new BasicEnemy0(this.game, centerOriginX += 10 * i, originY )
                    let newEnemy = new BasicEnemy0(this.game, 0, 0)
                    newEnemy.body.velocity = originalEnemy.body.velocity;
                    newEnemy.origin = originalEnemy.origin;
                    newEnemy.direction = originalEnemy.direction;
                    newEnemy.x = originalEnemy.x + configs.space * i
                    newEnemy.y = originalEnemy.y;
                    basicEnemies.add(newEnemy)
                 
                 }                
            }
            else if(originalEnemy.origin == 'left'){
                for(let i = 0; i < 3; i++){
                    let newEnemy = new BasicEnemy0(this.game, 0, 0)
                    newEnemy.body.velocity = originalEnemy.body.velocity;
                    newEnemy.origin = originalEnemy.origin;
                    newEnemy.direction = originalEnemy.direction;
                    newEnemy.x = configs.startLeft
                    newEnemy.y = originalEnemy.y + configs.space * i;
                    basicEnemies.add(newEnemy)
                
                }

            }
            else if(originalEnemy.origin == 'right'){
                for(let i = 0; i < 3; i++){
                    let newEnemy = new BasicEnemy0(this.game, 0, 0)
                    newEnemy.body.velocity = originalEnemy.body.velocity;
                    newEnemy.origin = originalEnemy.origin;
                    newEnemy.direction = originalEnemy.direction;
                    newEnemy.x = configs.startRight;
                    newEnemy.y = originalEnemy.y + configs.space * i;
                    basicEnemies.add(newEnemy)
                
                }

            }
            else if(originalEnemy.origin == "topRight"){
                for(let i = 0; i < 2; i++){
                    //let enemy = new BasicEnemy0(this.game, centerOriginX += 10 * i, originY )
                    let newEnemy = new BasicEnemy0(this.game, 0, 0)
                    newEnemy.body.velocity = originalEnemy.body.velocity;
                    newEnemy.origin = originalEnemy.origin;
                    newEnemy.direction = originalEnemy.direction;
                    newEnemy.x = originalEnemy.x + configs.space * i
                    newEnemy.y = originalEnemy.y;
                    basicEnemies.add(newEnemy)
                 
                 }
            }
        }

        //OR MAYBE CAN USE A SET INTERVAL()
    },
    checkInput: function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            //console.log("space");
            this.fireWeapon();
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                
                    player.body.velocity.x = moveSpeed;
                    player.body.velocity.y = moveSpeed;
                
                
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                player.body.velocity.x = moveSpeed;
                player.body.velocity.y = -moveSpeed;
            }
            else {

                if (player.body.velocity.x == -moveSpeed) {
                    player.body.velocity.x *= -1;
                    player.body.velocity.x = 0;
                } else {
                    player.body.velocity.x = moveSpeed;
                    player.body.velocity.y = 0;
                }
            }
            isKeyDown = true;
            //console.log(sprite.body.velocity.x);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                //if(sprite.body.velocity.x == 400){
                //sprite.body.velocity.x *= -1;
                //}
                player.body.velocity.x = -moveSpeed;
                player.body.velocity.y = moveSpeed;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                player.body.velocity.x = moveSpeed;
                player.body.velocity.y = moveSpeed;
            }
            else {
                player.body.velocity.y = moveSpeed;
                player.body.velocity.x = 0;
            }
            isKeyDown = true;
        }
        /*else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            
        }*/
        else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                player.body.velocity.x = -moveSpeed;
                player.body.velocity.y = -moveSpeed;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                player.body.velocity.x = -moveSpeed;
                player.body.velocity.y = moveSpeed;
            } else {
                if (player.body.velocity.x == moveSpeed) {
                    player.body.velocity.x *= -1;
                    player.body.velocity.x = 0;
                } else {
                    player.body.velocity.x = -moveSpeed;
                    player.body.velocity.y = 0;
                }
            }
            isKeyDown = true;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                player.body.velocity.x = -moveSpeed;
                player.body.velocity.y = -moveSpeed;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                player.body.velocity.x = moveSpeed;
                player.body.velocity.y = -moveSpeed;
            }
            else {
                player.body.velocity.x = 0;
                player.body.velocity.y = -moveSpeed;
                isKeyDown = true;
            }
        }
        /*else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            
        }*/
        else {
            isKeyDown = false;
        }
    },
    fireWeapon: function () {
        //console.log("hello");
        //Powerups we will have:
            //Shield
            //Spray
            //Bomb
            //Rapid-Fire Rate
            //Speed
        if(!player.isDead){
            if (game.time.now > player.nextFire) {
                player.nextFire = game.time.now + player.fireRate;

                if(player.weapon == 'basic'){
                    var laser = this.add.sprite(400, game.height, 'laser');
                    laser.enableBody = true;
                    laser.physicsBodyType = Phaser.Physics.ARCADE;
                    game.physics.arcade.enableBody(laser);
                    laser.reset(player.x - 4, player.y - (player.height / 2));
                    laser.body.velocity.y = -10;
                    laser.sig2 = "playerLaser";
                    laser.laserType = "basicLaser";
                    laser.damage = 1;
                    lasers.add(laser);
                    //totalObjects.add(laser);
                    //laser.angle += 90;
                    //laser.width += 50;
                }
            else if(player.weapon == 'powerup-spray'){
                    for(let laserNum = 0; laserNum < 7; laserNum++){
                        var laser = this.add.sprite(400, game.height, 'laser');
                        laser.enableBody = true;
                        laser.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enableBody(laser);
                        let laserX;
                        if(laserNum == 0){
                            laserX = (player.x - 4) - 30
                        }
                        else if(laserNum == 1){
                            laserX = (player.x - 4) - 10
                        }
                        else if(laserNum == 2){
                            laserX = (player.x - 4) 
                        }
                        else if(laserNum == 3){
                            laserX = (player.x - 4) + 10
                        }
                        else if(laserNum == 4){
                            laserX = (player.x - 4) + 30
                        }
                        else if(laserNum == 5){
                            laserX = (player.x - 4) - 50
                        }
                        else if(laserNum == 6){
                            laserX = (player.x - 4) + 50
                        }
                        laser.reset(laserX, player.y - (player.height / 2));
                        laser.body.velocity.y = -10;
                        laser.sig2 = "playerLaser";
                        laser.laserType = "basicLaser";
                        laser.damage = 1;
                        lasers.add(laser);
                        //totalObjects.add(laser);
                        //laser.angle += 90;
                        //laser.width += 50;
                    }
                }

                else if(player.weapon == 'powerup-bomb'){
                    var missile = this.add.sprite(400, game.height, 'missile');
                    missile.angle -= 90
                    laser.enableBody = true;
                    laser.physicsBodyType = Phaser.Physics.ARCADE;
                    game.physics.arcade.enableBody(laser);
                    laser.reset(player.x - 4, player.y - (player.height / 2));
                    laser.body.velocity.y = -10;
                    laser.sig2 = "playerLaser";
                    laser.laserType = "basicLaser";
                    laser.damage = 1;
                    lasers.add(laser);
                    //totalObjects.add(laser);
                    //laser.angle += 90;
                    //laser.width += 50;
                }

                else if(player.weapon == 'powerup-rapid'){
                    var laser = this.add.sprite(400, game.height, 'laser');
                    laser.enableBody = true;
                    laser.physicsBodyType = Phaser.Physics.ARCADE;
                    game.physics.arcade.enableBody(laser);
                    laser.reset(player.x - 4, player.y - (player.height / 2));
                    laser.body.velocity.y = -10;
                    laser.sig2 = "playerLaser";
                    laser.laserType = "basicLaser";
                    laser.damage = 1;
                    lasers.add(laser);
                    //totalObjects.add(laser);
                    //laser.angle += 90;
                    //laser.width += 50;
                }
                else if(player.weapon == 'powerup-shield'){
                    var laser = this.add.sprite(400, game.height, 'laser');
                    laser.enableBody = true;
                    laser.physicsBodyType = Phaser.Physics.ARCADE;
                    game.physics.arcade.enableBody(laser);
                    laser.reset(player.x - 4, player.y - (player.height / 2));
                    laser.body.velocity.y = -10;
                    laser.sig2 = "playerLaser";
                    laser.laserType = "basicLaser";
                    laser.damage = 1;
                    lasers.add(laser);
                    //totalObjects.add(laser);
                    //laser.angle += 90;
                    //laser.width += 50;
                }
                else if(player.weapon == 'powerup-speed'){
                    var laser = this.add.sprite(400, game.height, 'laser');
                    laser.enableBody = true;
                    laser.physicsBodyType = Phaser.Physics.ARCADE;
                    game.physics.arcade.enableBody(laser);
                    laser.reset(player.x - 4, player.y - (player.height / 2));
                    laser.body.velocity.y = -10;
                    laser.sig2 = "playerLaser";
                    laser.laserType = "basicLaser";
                    laser.damage = 1;
                    lasers.add(laser);
                    //totalObjects.add(laser);
                    //laser.angle += 90;
                    //laser.width += 50;
                }
            }
        }
    },
    headsOrTales: function(){
        let randomNum = Math.floor(Math.random() * 10)
        let flag;
        if(randomNum % 2 == 0)
            flag = true
        else    
            flag = false

        console.log(flag)
        return flag
    },
    gameOver: function (){
        isGameOver = true;
        player.body.enable = false;
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = game.add.text(game.world.centerX, game.world.centerY, "Game Over", style);
        text.anchor.set(0.5);
        text.alpha = 0.1;

        shootButton.destroy();
        stick.destroy();

        var over = game.add.tween(text).to( { alpha: 1 }, 3000, "Linear", true);
        over.onComplete.add(doSomething, this);function doSomething () { game.state.start('gameOver',true, false, score);}
        
    },

};

function keyEventListen() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        //alert("hello");
        //stick.force = 30;;
        //stick.rotation = 30;
        //console.log(stick.rotation, stick.force);
        //this.sprite.body.velocity.x = 400;
        player.body.velocity.x = 5;
        //console.log(sprite.body.velocity.x);
    }

}