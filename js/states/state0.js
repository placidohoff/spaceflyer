//this.sprite;
var myDemo = {};

myDemo.state4 = function(){
    //var sprite;
};

myDemo.state4.prototype = {
    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //this.sprite;

    },
    
    preload: function(){
        var pad;
        var stick;
        this.load.atlas('arcade', 'assets/arcade-joystick.png', 'assets/arcade-joystick.json');
        this.load.image('ship', 'assets/thrust.png');

    },
    create: function(){
        //alert("hello");
        game.stage.backgroundColor = "#ffcccc";
        addChangeStateEventListeners();

        pad = game.plugins.add(Phaser.VirtualJoystick);
        stick = pad.addStick(600, 300, 150, 'arcade');
        stick.alignBottomLeft();

        sprite = this.add.sprite(400, 200, 'ship');
        sprite.texture.baseTexture.scaleMode = PIXI.NEAREST;
        sprite.scale.set(2);
        sprite.anchor.set(0.5);
        this.physics.arcade.enable(sprite);
        sprite.angle -= 90;
    },
    update: function () {

        //keyEventListen();

        var maxSpeed = 400;

        if (stick.isDown)
        {
            this.physics.arcade.velocityFromRotation(stick.rotation, stick.force * maxSpeed, sprite.body.velocity);
            //this.sprite.rotation = stick.rotation;
        }
        else
        {
            sprite.body.velocity.set(0);
        }

    },
    
};

function keyEventListen(){
    if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        //alert("hello");
        //stick.force = 30;;
        //stick.rotation = 30;
        //console.log(stick.rotation, stick.force);
        //this.sprite.body.velocity.x = 400;
        //sprite.body.velocity.x = 400;
    }

}