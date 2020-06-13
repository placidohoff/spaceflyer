var BasicEnemy0 = function(game, x, y, key,){
    key = "basicenmy0";
    //game.add.sprite(400, 200, 'ship');
    Phaser.Sprite.call(this, game, x, y, key);
    this.sig = "fallingObject";

    //added for collision with laser, a unique identifyyer:
    this.uid = this.game.rnd.integerInRange(0, 20000)

    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;
    this.anchor.setTo(0.5, 0.5);
    //this.body.velocity.x = 0;
    //this.body.velocity.y = 10;

    /*Make a random starter generator. 3 
    possibilities: Left, Right, and Direct Above.

    */
   this.y = 0 - this.height;
   var randomOriginNum = this.game.rnd.integerInRange(0,5);
   //console.log(randomOriginNum);
   /*
   (enemy.origin == left)
    this.x = player.x - 1500;
    this.y = player.y - 1500;
   */
   if(randomOriginNum == 0){
        this.origin = "directAbove";
   }else if(randomOriginNum == 1){
        this.origin = "topLeft";
   }
   else if(randomOriginNum == 2){
        this.origin = "left";
   }
   else if(randomOriginNum == 3){
        this.origin = "right";
   }
   else if(randomOriginNum == 4){
        this.origin = "topRight";
   }
   
   //this.origin = "directabove";
   if(this.origin == "directAbove"){
       this.x = player.x;
       this.body.velocity.x = 0;
       this.body.velocity.y = 500;
       this.direction = "down";
   }else if(this.origin == "topLeft"){
        //this.x = player.x - 500;
        this.x = player.x - 1500;
        this.y = player.y - 1500;
        this.body.velocity.x = 500;
        this.body.velocity.y = 500;
        this.direction = "downRight";
   }else if(this.origin == "left"){
        //this.x = player.x - 500;
        this.x = player.x - 1500;
        this.y = player.y;
        this.body.velocity.x = 500;
        this.body.velocity.y = 0;
        this.direction = "right";
    }
   else if(this.origin == "right"){
        this.x = player.x + 1500;
        this.y = player.y;
        this.body.velocity.x = -500;
        this.body.velocity.y = 0;
        this.direction = "left";
   }else if(this.origin == "topRight"){
        //this.x = player.x - 500;
        this.x = player.x + 1500;
        this.y = player.y - 1500;
        this.body.velocity.x = -500;
        this.body.velocity.y = 500;
        this.direction = "downLeft";
    }

   this.sig = this.game.rnd.integerInRange(0,1000);
   this.score = 1;
   //this.y = 0 - this.height;
};

BasicEnemy0.prototype = Object.create(Phaser.Sprite.prototype);

BasicEnemy0.prototype.constuctor = BasicEnemy0;

BasicEnemy0.prototype.update = function(){
    //this.game.console.log("update");
    //alert("hello");
    //this.body.velocity.x -= 20;
    //this.body.velocity.y -= 20;
    if(this.y > game.height){
        this.killThis();
    }
    
};

BasicEnemy0.prototype.killThis = function(){
    this.isHit = true;
    //this.body.velocity.x = 0;
    this.body.enable = false;
    //this.game.physics.arcade.enableBody = false;
    //Phaser.Sprite.call(this, game, this.x, this.y, 'explosion_atlas');
    //var explo = game.add.sprite(this.x, this.y, 'explosion_atlas');
    //explo.anchor.set(0.5, 0.5);
    this.loadTexture('explosion_atlas');
    this.animations.add('explode', Phaser.Animation.generateFrameNames('explo', 0, 8), 5, true);

    this.animations.play('explode', 12, false);
    //this.body.velocity.y = 0;

    this.animations.currentAnim.onComplete.add(function (){
        this.body = null;
        this.kill();
    
    }, this);
    enemySpriteCount--;
    //alert("kill");

};