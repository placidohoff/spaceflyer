var player, isKeyDown, starfield, width, height, bullets, shootButton, basic, basicEnemies, nextEnemy, enemyRate, enemyLasers, nextMultipleEnemy, multipleEnemyRate, score, text, bigUfoGroup, playerLives, numberOfPlayerLives, gameOverText, isGameOver, isWaitingToRespawn, playerHitTimeOut, respawnText, enemySpriteCount;
var gameOptions = {

};
var enemyOptions = {

};

var openState = {
    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
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
        stick.alignBottomLeft();

        shootButton = pad.addButton(200, 200, 'arcade', 'button1-up', 'button1-down');
        shootButton.alignBottomRight();
        //shootButton.y -= 200;
        shootButton.onDown.add(this.fireWeapon, this);
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
        //numberOfPlayerLives--;
    },

    update: function () {

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
        game.physics.arcade.overlap(player, enemyLasers.children, this.playerHit);
        game.physics.arcade.overlap(player, basicEnemies.children, this.playerHit);
        game.physics.arcade.overlap(ufoEnemyGroup.children, lasers.children, this.ufoHit);
        game.physics.arcade.overlap(lasers.children, ufoEnemyGroup.children, this.ufoHit);
        game.physics.arcade.overlap(basicEnemies.children, ufoEnemyGroup.children, this.basicEnemyHit);
        game.physics.arcade.overlap(lasers.children, basicEnemies.children, this.basicEnemyHit);

        game.physics.arcade.collide(ufoEnemyGroup.children, lasers.children, this.ufoHit);
        game.physics.arcade.collide(lasers.children, ufoEnemyGroup.children, this.ufoHit);
        game.physics.arcade.overlap(lasers.children, bigUfoGroup.children, this.bigUfoHit);

        this.checkEnemiesOffScreen();

        //game.physics.arcade.collide(lasers.children, ufoEnemyGroup.children, this.ufoHit);


        //keyEventListen();
        this.spawnEnemy();

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
                //lasers.children[i].kill();
                this.boundsCheck(lasers.children[i]);
            }
        }

        //COLLISIONS:
       
        //DEBBUGGING: Seeing how many objects are in my game currently:
        //console.log(enemyLasers.children.length);


        starfield.tilePosition.y += 2;
        this.checkInput();
        var maxSpeed = 400;

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

        //sprite.x += sprite.body.velocity.x;
        //sprite.y += sprite.body.velocity.y;
        //console.log(sprite.body.velocity.x);
        //this.clearEnemyField();
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

        if(obj.sig = "bigUfo"){
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
            if (theUfo.sig == basicEnemies.children[i].sig) {
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
        player.fireRate = 200;
        player.width = 50;
        player.height = 50;

        

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

        //OR MAYBE CAN USE A SET INTERVAL()
    },
    checkInput: function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            //console.log("space");
            this.fireWeapon();
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                player.body.velocity.x = 400;
                player.body.velocity.y = 400;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                player.body.velocity.x = 400;
                player.body.velocity.y = -400;
            }
            else {

                if (player.body.velocity.x == -400) {
                    player.body.velocity.x *= -1;
                    player.body.velocity.x = 0;
                } else {
                    player.body.velocity.x = 400;
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
                player.body.velocity.x = -400;
                player.body.velocity.y = 400;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                player.body.velocity.x = 400;
                player.body.velocity.y = 400;
            }
            else {
                player.body.velocity.y = 400;
                player.body.velocity.x = 0;
            }
            isKeyDown = true;
        }
        /*else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            
        }*/
        else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                player.body.velocity.x = -400;
                player.body.velocity.y = -400;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                player.body.velocity.x = -400;
                player.body.velocity.y = 400;
            } else {
                if (player.body.velocity.x == 400) {
                    player.body.velocity.x *= -1;
                    player.body.velocity.x = 0;
                } else {
                    player.body.velocity.x = -400;
                    player.body.velocity.y = 0;
                }
            }
            isKeyDown = true;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                player.body.velocity.x = -400;
                player.body.velocity.y = -400;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                player.body.velocity.x = 400;
                player.body.velocity.y = -400;
            }
            else {
                player.body.velocity.x = 0;
                player.body.velocity.y = -400;
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
        if (game.time.now > player.nextFire) {
            player.nextFire = game.time.now + player.fireRate;
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
        
    }

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