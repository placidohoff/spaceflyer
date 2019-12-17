var startX, startY, moveSprite, lastPosition, tween, firstBezierPointX, secondBezierPointX, firstBezierPointY, secondBezierPointY, endX, endY;
var testing = {
    init: function(){

    }, preload: function(){
        game.load.image('abtbtn', 'assets/mybuttons/about.png', 193, 71);

    },create: function(){
        startX = game.width/2;
        startY = game.height;
        firstBezierPointX = 0;
        firstBezierPointY = game.height/2;
        secondBezierPointX = 200;
        secondBezierPointY = game.height-200;
        endX = game.width/2;//game.width;
        endY = 0;//game.height-300;//game.height;
        moveSprite = this.game.add.sprite(startX, startY, 'abtbtn');

        lastPosition = {x: moveSprite.x, y: moveSprite.y};

        tween = game.add.tween(moveSprite).to({
x: [startX, firstBezierPointX, /*secondBezierPointX,*/ endX],
y: [startY, firstBezierPointY, /*secondBezierPointY,*/ endY],
}, 1000,Phaser.Easing.Quadratic.Out, true);

tween.interpolation(Phaser.Math.bezierInterpolation);

    },update: function(){
        
    }, 
}
