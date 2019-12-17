var Icon = function(game, x, y, key){
    //key = "iconSpray";
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.inputEnabled = true;
    this.input.enableDrag(true);
    this.body.velocity.x = 6;
    
};

Icon.prototype = Object.create(Phaser.Sprite.prototype);

Icon.prototype.constuctor = Icon;

Icon.prototype.update = function(){
    //this.x += this.body.velocity.x;
}
