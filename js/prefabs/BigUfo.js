var endPosX;
var BigUfo = function(game, x, y,){
    //1. Add sprite to the game and apply physics:
    var key = "bigufo";
    //game.add.sprite(400, 200, 'ship');
    Phaser.Sprite.call(this, game, x, y, key);
    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;
    this.anchor.setTo(0.5, 0.5);

    //2. Add children sprites and apply physics:
    this.littleUfos = game.add.group();
    this.littleUfos.enableBody = true;
    this.littleUfos.physicsBodyType = Phaser.Physics.ARCADE;
    //this.laserShot.createMultiple(50, 'enemylaser');
    //this.laserShot.setAll('checkWorldBounds', true);
    //this.laserShot.setAll('outOfBoundsKill', true);

    this.nextLittleUfos = 0;
    this.littleUfosRate = 2000;
    this.isReadyToMakeShips = false;
    this.nextFireWeapon = 0;
    this.fireWeaponRate = 2000;

    //3. Add properties of the sprite 
    this.sig = "bigUfo";
    this.width = 200;
    this.height = 58;
    this.tweenStopPoint = {x:0,y:0};
    //this.tweenStopPoint.x;
    this.tweenStopPoint.y = game.world.centerY - 100;
    this.isHit = false;
    this.blinkCounter = 0;
    this.hitPoints = 20;
    this.isDead = false;
    this.points = 6;

    var originX = this.game.rnd.integerInRange(0, game.width);
    this.x = originX;

    this.setLogic();
    this.numberTimesLogicCompleted = 0;

    this.isReadyToDoLogic = false;
    //this.logic = "spawnShips";
        //DEBUGGING:
        this.logic = "shootLasers";

    //if(or)

    //this.logic = ""


    //Make the tween here?
    game.add.tween(this).to({ y: this.tweenStopPoint.y }, 1000, Phaser.Linear, true);


};

BigUfo.prototype = Object.create(Phaser.Sprite.prototype);

BigUfo.prototype.constuctor = BigUfo;

BigUfo.prototype.update = function(){
    //BEGINING LOGIC
    //if(this.isOnFirstSpawnLogic){
        if(!this.isDead){
        if(this.y >= this.tweenStopPoint.y){
            //this.body.velocity.x = 200;
            this.isReadyToMakeShips = true;
            this.isReadyToDoLogic = true;
            this.isOnFirstSpawnLogic = false;
            //this.body.velocity.y = -200;
        }
    //}
        if(this.isReadyToDoLogic){
            //alert("hello");
            //this.body.velocity.x = 200;
            this.doBasicUfoSideToSideMovement();
            let randomAttack = this.game.rnd.integerInRange(0,1);
            if(randomAttack == 0){
                this.spawnEnemyShips();
            }else{
                this.shootLaserBeam();
            }
            // if(this.logic == "spawnShips"){
            //         this.doBasicUfoSideToSideMovement();
            //     // }
            //     this.spawnEnemyShips();
            // }
            // if(this.logic == "shootLasers"){
            //     this.doBasicUfoSideToSideMovement();
            // // }
            // this.shootLaserBeam();

            // }
            //this.spawnEnemyShips();
        }

        //RESET LOGIC:
        if(this.isOnResetLogic){
            //TWEENSTOPPOINT WILL CHANGE 
            //if(this.x == this.tweenStopPoint.)
            if(this.direction == "left"){
                if(this.x <= this.tweenStopPoint.x){
                    //this.body.velocity = 0;
                    this.isOnResetLogic = false;
                    this.setLogic();
                    this.isReadyToDoLogic = true;
                }
            }
            else if(this.direction == "right"){
                if(this.x >= this.tweenStopPoint.x){
                    this.isOnResetLogic = false;
                    //this.body.velocity = 0;
                    this.setLogic();
                    this.isReadyToDoLogic = true;
                }
            }

        }


        if(this.numberTimesLogicCompleted == 4){
            this.numberTimesLogicCompleted = 0;
            this.reset();
            //this.setLogic();
            
        }

        //HIT-LOGIC:
        if(this.isHit){
            this.blinkCounter++;
        }

        if(this.blinkCounter == 10){
            this.alpha = 1;
            this.blinkCounter = 0;
            this.isHit = false;
        }

        if(this.hitPoints < 0){
            this.alpha = 1;
            //openState.updateScore(this.points)
            this.killThis();
        }
    }
    
    //console.log(this.hitPoints);
};

BigUfo.prototype.reset = function(){
    this.isReadyToDoLogic = false;
    this.isOnResetLogic = true;
    this.tweenStopPoint.y = 100;
    this.tweenStopPoint.x = game.world.centerX;
    console.log("reset");
    if(this.x < this.tweenStopPoint.x){
        this.direction = "right"
        this.body.velocity.x = 200;
    }
    else if(this.x > this.tweenStopPoint.x){
        this.direction = "left";
        this.body.velocity.x = -200;
    }
};

BigUfo.prototype.doBasicUfoSideToSideMovement = function(){
    if(this.direction == "left"){
        this.body.velocity.x = -200;
        if(this.x < endPosX.left){
            this.direction = "right";
            this.numberTimesLogicCompleted++;
        }
    }
    else if(this.direction == "right"){
        this.body.velocity.x = 200;
        if(this.x > endPosX.right){
            this.direction = "left";
            this.numberTimesLogicCompleted++;
        }
    }
}

BigUfo.prototype.killThis = function(){
   //this.kill();
    //alert("hit");
    this.isDead = true;
    this.isHit = true;
    console.log(this.sig);
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.enable = false;
    //this.body.clearCollision();
    //Phaser.Sprite.call(this, game, this.x, this.y, 'explosion_atlas');
    //var explo = game.add.sprite(this.x, this.y, 'explosion_atlas');
    //explo.anchor.set(0.5, 0.5);
    this.loadTexture('bigexplosion');
    this.animations.add('explode', Phaser.Animation.generateFrameNames('bm', 0, 7), 5, true);

    this.animations.play('explode', 6, false);
    console.log(this.sig);

    this.animations.currentAnim.onComplete.add(function (){
        this.children.forEach(function(child){
            child.destroy();
        });
        this.destroy();
    
    }, this);
    //this.kill();
    //this.destroy();


};

BigUfo.prototype.fireWeapon = function() {
    // if(this.isReadyToMakeShips){
        if(game.time.now > this.nextFireWeapon){
            //var probability = this.game.rnd.integerInRange(0,5)
            this.nextFireWeapon = game.time.now + this.fireWeaponRate;
            //this.ufo = new UfoEnemy//game.add.sprite(this.x, this.y, 'enemylaser');
            
            if(probability <= 2){
                var source = {x: this.x, y: this.y + this.height}
                var howMany = this.game.rnd.integerInRange(0, 4);
                    howMany = 4;
                openState.spawnMultipleEnemies('ufoEnemy', howMany, source);
            }
            // this.laser.enableBody = true;
            // this.laser.physicsBodyType = Phaser.Physics.ARCADE;
            // game.physics.arcade.enableBody(this.laser);
        }
    // }
};

BigUfo.prototype.spawnEnemyShips = function() {
    if(this.isReadyToMakeShips){
        if(game.time.now > this.nextLittleUfos){
            var probability = this.game.rnd.integerInRange(0,5)
            this.nextLittleUfos = game.time.now + this.littleUfosRate;
            //this.ufo = new UfoEnemy//game.add.sprite(this.x, this.y, 'enemylaser');
            
            //THIS PUTS A RANDOM PROBABILITY ON SPAWINING SHIPS
            if(probability <= 2){
                var source = {x: this.x, y: this.y + this.height}
                var howMany = this.game.rnd.integerInRange(0, 4);
                    howMany = 4;
                openState.spawnMultipleEnemies('ufoEnemy', howMany, source);
            }
            // this.laser.enableBody = true;
            // this.laser.physicsBodyType = Phaser.Physics.ARCADE;
            // game.physics.arcade.enableBody(this.laser);
        }
    }
};

BigUfo.prototype.shootLaserBeam = function(){
    if(game.time.now > this.nextFireWeapon){
        
        this.nextFireWeapon = game.time.now + this.fireWeaponRate;
        this.laser;
        let mod;
        console.log(this.direction);

        //BIG UFO SHOOTS MULTIPLE BEAMS AT ONCE:
            //MUST CHECK IF THIS.DIRECTION IS LEFT OR RIGHT TO ADJUST THE BEGINNNING AT LAST BEAMS PROPERLY
        if(this.direction == "right"){
             mod = -5;
        }else{
             mod = -15;
        }
        for(let i = 0; i < 3; i++){
            if(i == 0){
                this.laser = game.add.sprite(this.x -this.width/2, this.y, 'laserball');
            }
            else if(i == 1){
                this.laser = game.add.sprite(this.x, this.y, 'laserball');

            }
            else if(i == 2){
                this.laser = game.add.sprite(this.x + this.width/2 + mod, this.y, 'laserball');

            }
            //doLaserMoveLogic();
            //this.laser = game.add.sprite(this.x, this.y, 'laserball');
            this.laser.enableBody = true;
            this.laser.physicsBodyType = Phaser.Physics.ARCADE;
            game.physics.arcade.enableBody(this.laser);
            this.laser.body.velocity.y = 600;
            this.checkWorldBounds = true;
            this.laser.sig = "enemyUfoLaser";
            enemyLasers.add(this.laser);
        }

        // function doLaserMoveLogic(){
        //     this.laser = game.add.sprite(this.x, this.y, 'laserball');
        
            
        // }

        
        
       
        //LOGIC: attempting to fix the lasers' positioning when in formation
            //It was broken because the 'laserY' is not set?
            
        //this.laser.reset(this.laserX, this.laserY);
        //this.laser.anchor.setTo(0.5);
        //this.laser.sig = "old";
        
        
        //console.log("Fire Weapon");
        
    }
};

BigUfo.prototype.handleHit = function(laser){
    this.isHit = true;
    this.alpha = 0;
    this.hitPoints -= laser.damage;
};

//This should take a argument 'logic' var= 
BigUfo.prototype.setLogic = function(){
    //Change Enemy Logic:
    let randomLogicNumber = this.game.rnd.integerInRange(0,1);
    if(randomLogicNumber == 0){
        this.logic = 'spawnShips';
    }else{
        this.logic = 'shootLasers'
    }
    //Debugging purposes:
        //this.logic = "shootLasers";
    if(this.logic == "spawnShips"){
        // var randomDirection = this.game.rnd.integerInRange(0, 1);
        // if(randomDirection == 0)
        //     randomDirection = "left";
        // else    
        //     randomDirection = "right";

        // endPosX = {left:0,right:0};    
        // if(randomDirection == "left"){
        //     endPosX.left = this.game.rnd.integerInRange(this.x - 600, this.x);
        //     endPosX.right = this.game.rnd.integerInRange(this.x, this.x + 600);
        // }
        // else if(randomDirection == "right"){
        //     endPosX.left = this.game.rnd.integerInRange(this.x - 600, this.x);
        //     endPosX.right = this.game.rnd.integerInRange(this.x, this.x + 600);
        // }
        // this.direction = randomDirection;
        this.doLogicMovement();
    }
    else if(this.logic == "shootLasers"){
        this.doLogicMovement();
    }
    this.numberTimesLogicCompleted = 0;
};

BigUfo.prototype.doLogicMovement = function(){
    
        var randomDirection = this.game.rnd.integerInRange(0, 1);
        if(randomDirection == 0)
            randomDirection = "left";
        else    
            randomDirection = "right";

        endPosX = {left:0,right:0};    
        if(randomDirection == "left"){
            endPosX.left = this.game.rnd.integerInRange(this.x - 600, this.x);
            endPosX.right = this.game.rnd.integerInRange(this.x, this.x + 600);
        }
        else if(randomDirection == "right"){
            endPosX.left = this.game.rnd.integerInRange(this.x - 600, this.x);
            endPosX.right = this.game.rnd.integerInRange(this.x, this.x + 600);
        }
        this.direction = randomDirection;

        this.direction == "left" ? this.body.velocity.x = -200 : this.body.velocity.x = 200;
    
    
}