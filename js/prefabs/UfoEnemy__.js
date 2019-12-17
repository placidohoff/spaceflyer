var UfoEnemy = function(info){
    var key = "ufo";
    //game.add.sprite(400, 200, 'ship');
    Phaser.Sprite.call(this, game, info.posX, info.posY, key);
    //this.sig =

    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;
    this.anchor.setTo(0.5, 0.5);
    
    this.laserShot = game.add.group();
    this.laserShot.enableBody = true;
    this.laserShot.physicsBodyType = Phaser.Physics.ARCADE;
    this.laserShot.createMultiple(50, 'enemylaser');
    this.laserShot.setAll('checkWorldBounds', true);
    this.laserShot.setAll('outOfBoundsKill', true);

    this.nextLaser = 0;
    this.laserRate = 1000;

    this.isReadyToShoot = false;

   this.x = info.originX;
   this.y = 0 - 100;
   this.body.velocity.x = info.velocityX;
   this.body.velocity.y = info.velocityY;
   this.direction = info.direction;
   this.endPosX1 = info.endPosX1;
   this.endPosY = info.endPosY;
   this.isToReverse = false;
   this.isReversed = false;
   this.isInAFormation = info.isInAFormation;
   
   //Specific properties for formation ufos:
   if(this.isInAFormation){
        this.isOnEndPos1 = true;
        this.isOnEndPos2 = false;
        this.isOnEndPos3 = false;
        this.endPos1 = info.endPos1;
        this.endPos2 = info.endPos2;
        this.endPos3 = info.endPos3;
        this.endPos4 = info.endPos4;
        this.pivot.x = 100;
        this.isOnTween = false;
        this.x = info.originX;
        this.y = info.originY;;
        this.direction = "left";
        this.isReadyToShoot = true;
   }

   if(this.direction == "left"){
    this.reversePosX = this.x - this.game.rnd.integerInRange(100, 500);
   }else{
    this.reversePosX = this.x + this.game.rnd.integerInRange(100, 500);;
   }
   var num = this.game.rnd.integerInRange(0,1);
       if(num == 0)
       this.isToReverse = true;
       else
       this.isToReverse = false;

    this.sig = /*info.sig;*/ this.game.rnd.integerInRange(0, 1000);
    this.isHit = false;

    this.animations.add('explode', Phaser.Animation.generateFrameNames('explo', 0, 8), 5, true);

    

    this.setAnimations();
       
};

UfoEnemy.prototype = Object.create(Phaser.Sprite.prototype);

UfoEnemy.prototype.constuctor = UfoEnemy;

UfoEnemy.prototype.update = function(){
  if(!this.isInAFormation){
        if(this.y > this.endPosY){
            this.body.velocity.y = 0;
            this.isReadyToShoot = true;
        }

        /*if(this.x == player.x){
            console.log("shoot");
        }*/
        if(this.direction == "left"){
                if(this.isToReverse && this.x <= this.reversePosX && !this.isReversed){
                    //console.log("shoot")
                    this.body.velocity.x *= -1;
                    this.isReversed = true;
                    this.direction = "right";
                }
        }else if(this.direction == "right" && !this.isReversed){
            if(this.isToReverse && this.x >= this.reversePosX){
                //console.log("shoot")
                this.body.velocity.x *= -1;
                this.isReversed = true;
                this.direction = "left";
            }
        }
        
    }else{
        //this.isOnTween = true;
        //this.isOnEndPos1 = false;
        if(this.isOnEndPos1){
            this.body.velocity.x = 50;
            this.body.velocity.y = 200;
            if(this.y > this.endPos1.y){
                this.isOnEndPos1 = false;
                //this.isOnTween = true;
                this.isOnEndPos2 = true;
                //this.body.velocity.y = 0;
                //this.body.velocity.x = 0;
            }
        }else if(this.isOnTween){
            // var tween = game.add.tween(this).to({
            //     x: [this.endPos2.x, game.width/2, 100],
            //     y: [this.endPos2.y, game.height, game.height/2]
            //     }, 1000,Phaser.Easing.Quadratic.Out, true);

            // tween.interpolation(Phaser.Math.bezierInterpolation);
            //console.log("ayyy");
        
        }else if(this.isOnEndPos2){
            //this.x--;
            //this.y += 3;
            this.body.velocity.x = -80;
            this.body.velocity.y = 100;
            if(this.y > this.endPos2.y){
                this.isOnEndPos2 = false;
                this.isOnEndPos3 = true;
                this.isReadyToShoot = true;
                //this.body.velocity.x = 0;
                //this.body.velocity.y = 0;
            }
        }else if(this.isOnEndPos3){
            this.body.velocity.x = -80;
            this.body.velocity.y = -200;
            //this.isReadyToShoot = false;
            if(this.y < this.endPos3.y){
                this.isOnEndPos3 = false;
                this.isOnEndPos4 = true;
                //this.body.velocity.x = 0;//80;
                //this.body.velocity.y = 0;//-200
            }
            
        }
        else if(this.isOnEndPos4){
            this.body.velocity.x = 80;
            this.body.velocity.y = -200;
            this.isReadyToShoot = false;
        }
    }

    if(this.x < 0 || this.x > game.width || this.y > game.height)
            this.kill();
            if(!this.isHit)
        this.shootLaser();

   //CHECK INTERNALLY FOR COLLISIONS ALSO DURING UPDATE()
   //this.game.physics.arcade.overlap(game.player, this.enemySights, this.enemySeePlayer, null, this);
   //}
};

UfoEnemy.prototype.shootLaser = function(){
    if(this.isReadyToShoot){
    if(game.time.now > this.nextLaser){
        this.nextLaser = game.time.now + this.laserRate;
        this.laser = enemyLasers.getFirstDead();
        //if(!this.laser)
            //this.laser = enemyLasers.getFirstDead();
        //this.laser.width = 10;
        //this.laser.height = 300;
        this.laser.enableBody = true;
        this.laser.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enableBody(this.laser);
        //this.direction == "left" ? let thisX = this.x - this.width : thisX = this.x + this.width;
        this.laserX;
        if(this.direction == "left")
            this.laserX = this.x - this.width;
        else    
            this.laserX = this.x + this.width;    
        this.laser.reset(this.laserX, this.y);
        this.laser.anchor.setTo(0.5);
        //this.laser.sig = "old";
        this.laser.body.velocity.y = 300;
        this.checkWorldBounds = true;
        //totalObjects.add(this.laser)
        //this.body.onWor
        //this.events.onOutOfBounds.add(this.killBot, this);
        //this.body.onWorldBounds = true;

// 'worldbounds' event listener
        /*this.body.world.on('worldbounds', function(body){
            this.kill();
        }, this);
        */
    
    }
}
};

UfoEnemy.prototype.killThis = function(){
    //this.kill();
    this.isHit = true;
    console.log(this.sig);
    this.body.velocity.x = 0;
    //Phaser.Sprite.call(this, game, this.x, this.y, 'explosion_atlas');
    //var explo = game.add.sprite(this.x, this.y, 'explosion_atlas');
    //explo.anchor.set(0.5, 0.5);
    this.loadTexture('explosion_atlas');
    this.animations.add('explode', Phaser.Animation.generateFrameNames('explo', 0, 8), 5, true);

    this.animations.play('explode', 12, false);

    this.animations.currentAnim.onComplete.add(function (){
        //this.children.kill();
        this.children.forEach(function(child){
            //if(this.newSights == false)
            //if(child.sig == "old")
            child.kill();
        });
        this.kill();
    
    }, this);
    //this.kill();
};

UfoEnemy.prototype.setAnimations = function(){
    //console.log("Animate");
    this.animations.add('explode', Phaser.Animation.generateFrameNames('explo', 0, 8), 5, true);
    // Phaser.Sprite.call(this, game, this.x, this.y, 'explosion_atlas');

    //this.animations.add('explode', Phaser.Animation.generateFrameNames('explo', 0, 9, '', 4), 30, true);
    /*Phaser.animations.create({
        key: "explode",
        frameRate: 10,
        frames: Phaser.Animation.generateFrameNames("explo", {
            prefix: "explo",
            suffix: ".png",
            start: 0,
            end: 9
        })
    });*/

};


/*
When I do a createMultipleUfos(), I will pass in 
the origin coordinates, and make a few of them so 
that they all have the same endpoints and starts
in the entire group at once.

*/