myDemo.state3 = function(){
    var sprite, cursors, sprite2, playerCollisionGroup, enemyCollisionGroup, count;
};

myDemo.state3.prototype = {
    
    preload: function(){
        game.load.spritesheet('bullet', 'assets/spritesheets/bullet.png', 50, 50);
    },
    create: function(){
        game.stage.backgroundColor = "#66004d";
        addChangeStateEventListeners();
        
        count = 0;
        
        	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);
        
        //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);

    //  Make things a bit more bouncey
    game.physics.p2.defaultRestitution = 0.8;
    //game.physics.p2.gravity.y = 3500;

    //  Add a sprite
	sprite = game.add.sprite(200, 200, 'bullet');
        sprite2 = game.add.sprite(300, 200, 'bullet');

    //  Enable if for physics. This creates a default rectangular body.
	game.physics.p2.enable(sprite);
        game.physics.p2.enable(sprite2);

    //  Modify a few body properties
	sprite.body.setZeroDamping();
	sprite.body.fixedRotation = true;
    sprite.height = 100;
        
        sprite2.body.setZeroDamping();
	sprite2.body.fixedRotation = true;
    sprite2.height = 50;

    text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

    cursors = game.input.keyboard.createCursorKeys();
        
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    enemyCollisionGroup = game.physics.p2.createCollisionGroup();
        
    //sprite.setRectangle(40,40);
    //sprite2.setRectangle(40,40);
        
    sprite.body.setCollisionGroup(playerCollisionGroup);
    sprite2.body.setCollisionGroup(enemyCollisionGroup);
        
    sprite.body.collides(enemyCollisionGroup, collideCall);
    sprite2.body.collides(playerCollisionGroup, collideCall);    
        
    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();    
        
    },
    
    update: function(){
        
        sprite.body.setZeroVelocity();
        
        if (cursors.left.isDown)
        {
    	   sprite.body.moveLeft(400);
        }
        else if (cursors.right.isDown)
        {
            sprite.body.moveRight(400);
        }      

        if (cursors.up.isDown)
        {
            sprite.body.moveUp(400);
        }
        else if (cursors.down.isDown)
        {
            sprite.body.moveDown(400);
        }
        
        sprite.angle++;
        
        if(checkTouch(sprite, sprite2)){
            //alert("hello");
            console.log("touch");
        }
        
        if(checkTouch(sprite2, sprite)){
            //alert("hello");
        }
    }
    
};

function collideCall(){
    console.log(count);
    count++;
};

function checkTouch(obj1, obj2){
    if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y){
        return true;
    }else{
        return false;
    }
}