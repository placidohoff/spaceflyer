var Hexagon = function(game, x, y, frame){
    var key = "hexagon";
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.inputEnabled = true;
    this.idNum;
    this.events.onInputDown.add(this.listener, game);
    this.hasIcon = false;
    this.isHover = false;
};

Hexagon.prototype = Object.create(Phaser.Sprite.prototype);

Hexagon.prototype.constuctor = Hexagon;

Hexagon.prototype.update = function(){
    if(this.hasIcon == true){
        this.addChild(game.make.sprite(this.width/2, this.height/2, 'icon'));
        console.log("go");
    }
    if (this.input.pointerOver() && this.isHover == true)
    {
        //console.log(this.x);
        //this.loadTexture('hexagon2');
        //this.loadTexture('icon');
        //this.addChild(game.make.sprite(0, 0, 'icon'));
    }
    else{
        //this.loadTexture('hexagon');
    }
    
};

Hexagon.prototype.AddIcon = function(){
    this.addChild(game.make.sprite(0, 0, 'icon'));
    this.children[0].anchor = 0.5;
    console.log("hello");
    this.loadTexture('icon');
};

Hexagon.prototype.listener = function(){
    //alert("hello");
    this.hasIcon = true;
    //this.addChild(game.make.sprite(this.width/2, this.height/2, 'icon'));
    //game.add.sprite(this.x, this.y, 'icon');
    //var ball = new Icon(game, this.x, this.y);
};
