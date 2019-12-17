//alert("hello");
var startButton, starfield, startText, startStyle, text, aboutButton, title;

var mainMenu = {
    init: function () {

    },
    
    preload: function(){
        game.load.image('plybtn', 'assets/mybuttons/playnow.png', 193, 71);
        game.load.image('abtbtn', 'assets/mybuttons/about.png', 193, 71);
        game.load.image('highscrbtn', 'assets/mybuttons/highscore.png', 193, 71);
        game.load.image('starfield', 'assets/starfield.jpg');
        game.load.image('title', 'assets/mytext/logo.png');

    },
    create: function(game){
        // this.createButton(game, "Play", game.world.centerX, game.world.centerY + 32, 300, 100,
        // function() {
        //     this.state.start('open');
        // });

        // this.createButton(game, "About", game.world.centerX, game.world.centerY + 192, 300, 100,
        // function() {
        //     console.log("About");
        // });
        starfield = game.add.tileSprite(0, 0, game.width, game.height, 'starfield');

        startButton = game.add.button(game.width/2, game.height/2 + 50, 'plybtn', this.playGame, this, 2, 1, 0);
        startButton.anchor.setTo(0.5,0.5);
        aboutButton = game.add.button(game.width/2, startButton.y + startButton.height + 10, 'abtbtn', this.about, this, 2, 1, 0);
        aboutButton.anchor.setTo(0.5,0.5);

        title = game.add.text(game.world.centerX, game.world.centerY - 100, 'SPACESHOOTER')
        title.anchor.setTo(0.5,0.5);

        //	Font style
        title.font = 'Arial Black';
        title.fontSize = 50;
        title.fontWeight = 'bold';

        //	Stroke color and thickness
        title.stroke = '#000000';
        title.strokeThickness = 6;
        title.fill = 'purple';

    
        //text.anchor.setTo(0.5,0.5);


    },
    update: function(game){
        starfield.tilePosition.y += 2;

    },

    createButton: function(game, string, x,y,w,h,callback){
        var button1 = game.add.button(x, y, 'button', callback, this, 2, 1, 0);

        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, string, {font:"14px Arial", fill
                                                                :"#fff", align:"center"});
        txt.anchor.setTo(0.5,0.5);
    },
    playGame: function(){
        //alert("hello");
        game.state.start('open');
    },
    about: function(){
        //console.log("About");
        game.state.start('gameOver');
    }

};

