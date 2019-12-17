var HealthBar = function(game, x, y, b){
    //var key = "icon";
    /*var bmd = game.add.bitmapData(200,40);
    bmd.ctx.rect(0,0,180,30);
    bmd.ctx.fillStyle = "#00685e";
    bmd.ctx.fill();*/
    //Phaser.Sprite.call(this, game, x, y, b);
    //this = game.add.sprite(x,y,b);
    
    //this.anchor.y = 0.5;
    //this.inputEnabled = true;
    //this.input.enableDrag(true);
};

HealthBar.prototype = Object.create(Phaser.Sprite.prototype);

HealthBar.prototype.constuctor = HealthBar;

HealthBar.prototype.update = function(){
    var barWidth = healthBar.width;
     var   LIFE = 40;
        this.width = barWidth - barWidth/LIFE;
}
