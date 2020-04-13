var PowerUp = function(game, x, y, key,){
    //key = "basicenmy0";
    //game.add.sprite(400, 200, 'ship');
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.signiture = key;
    this.sig = key;
    //alert(this.sig);
    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.velocity.x = 0;
    this.body.velocity.y = 2;

    /*Make a random starter generator. 3 
    possibilities: Left, Right, and Direct Above.

    */

   //this.sig = this.game.rnd.integerInRange(0,1000);
   //this.score = 1;
   //this.y = 0 - this.height;
};

PowerUp.prototype = Object.create(Phaser.Sprite.prototype);

PowerUp.prototype.constuctor = PowerUp;

PowerUp.prototype.update = function(){
    //this.game.console.log("update");
    //alert("hello");
    //this.body.velocity.x -= 20;
    //this.body.velocity.y -= 20;
    this.y += this.body.velocity.y;

    // if(this.y > game.height + 10){
    //     //this.killThis();
    //     this.offScreen();
    // }
    
};

PowerUp.prototype.offScreen = function(){
    this.destroy();

    //27281362
    //Goddamus2020
},

PowerUp.prototype.killThis = function(){
    this.isHit = true;
    this.body.velocity.x = 0;
    this.body.enable = false;
    //this.game.physics.arcade.enableBody = false;
    //Phaser.Sprite.call(this, game, this.x, this.y, 'explosion_atlas');
    //var explo = game.add.sprite(this.x, this.y, 'explosion_atlas');
    //explo.anchor.set(0.5, 0.5);
    this.loadTexture('explosion_atlas');
    this.animations.add('explode', Phaser.Animation.generateFrameNames('explo', 0, 8), 5, true);

    this.animations.play('explode', 12, false);
    this.body.velocity.y = 0;

    this.animations.currentAnim.onComplete.add(function (){
        this.body = null;
        this.kill();
    
    }, this);
    enemySpriteCount--;
    //alert("kill");

};