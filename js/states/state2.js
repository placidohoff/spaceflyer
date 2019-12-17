myDemo.state2 = function(){
    var hexagonWidth, hexagonHeight, gridSizeX, gridSizeY, columns, moveIndex, sectorWidth, sectorHeight, gradient, marker, hexagonGroup, size, icon;
};

myDemo.state2.prototype = {
    
    preload: function(){
        hexagonWidth = 70;
        hexagonHeight = 80;
        gridSizeX = 17;
        gridSizeY = 7;
        columns = [Math.ceil(gridSizeY/2),Math.floor(gridSizeY/2)];
        //moveIndex;
        sectorWidth = hexagonWidth;
        sectorHeight = hexagonHeight/4*3;
        gradient = (hexagonWidth/4)/(hexagonHeight/2);
        //marker;
        //hexagonGroup;
        
        game.load.image('hexagon', 'assets/2/hexagon.png');
        game.load.image('hexagon2', 'assets/2/hexagon2.png');
        game.load.image('icon', 'assets/2/icon.png', 35, 34);
        //game.load.image('icon', 'assets/2/icon.png', 15, 14);
        //game.load.image('icon', 'assets/2/icon.png');
        
        size = 0;
    },
    create: function(){
        hexagonGroup = game.add.group();
		game.stage.backgroundColor = "#ffffff"
	     for(var i = 0; i < gridSizeY/2; i ++){
			for(var j = 0; j < gridSizeX; j ++){
				if(gridSizeY%2==0 || i+1<gridSizeY/2 || j%2==0){
					var hexagonX = hexagonWidth*j/2;
					var hexagonY = hexagonHeight*i*1.5+(hexagonHeight/4*3)*(j%2);	
					//var hexagon = game.add.sprite(hexagonX,hexagonY,"hexagon");
                    var hexagon = new Hexagon(this.game, hexagonX, hexagonY);
                    hexagon.idNum = i;
                    //hexagon.AddIcon();
					hexagonGroup.add(hexagon);
                    size++;
				}
			}
		}
		hexagonGroup.x = (game.width-hexagonWidth*Math.ceil(gridSizeX/2))/2;
          if(gridSizeX%2==0){
               hexagonGroup.x-=hexagonWidth/4;
          }
		hexagonGroup.y = (game.height-Math.ceil(gridSizeY/2)*hexagonHeight-Math.floor(gridSizeY/2)*hexagonHeight/2)/2;
          if(gridSizeY%2==0){
               hexagonGroup.y-=hexagonHeight/8;
          }
		/*marker = game.add.sprite(0,0,"marker");
		marker.anchor.setTo(0.5);
		marker.visible=false;
		hexagonGroup.add(marker);*/
          //moveIndex = game.input.addMoveCallback(checkHex, this);
        
        var randId = game.rnd.integerInRange(0, size);
        for(var i = 0; i < hexagonGroup.children.length; i++){
            if(hexagonGroup.children[i].idNum == randId){
                //hexagonGroup.children[i].AddIcon();
            }
        }
        icon = game.add.sprite(50, 50, 'icon');
        icon.inputEnabled = true;
        icon.input.enableDrag(true);
        game.physics.arcade.enableBody(icon);
        icon.anchor.setTo(0.5);
        icon.width = 25;
        icon.height = 25;
    },
    update: function(){
       for(var i = 0; i < hexagonGroup.children.length; i++){
           /*if(hexagonGroup.children[i].input.pointerOver()){
               //console.log(hexagonGroup.children[i].x);
           }*/
           hexagonGroup.children[i].update();
           //if(game.physics.arcade.overlap(icon, hexagonGroup.children[i], dragOverlap, null, this));
           if(checkOverlap(icon, hexagonGroup.children[i])){
               //console.log("overlap");
               //icon.x = (hexagonGroup.children[i].x + hexagonGroup.children[i].width) /2;
               //icon.y = (hexagonGroup.children[i].y + hexagonGroup.children[i].height) /2;
               hexagonGroup.children[i].loadTexture("hexagon2");
               hexagonGroup.children[i].isHover = true;
           }else{
               hexagonGroup.children[i].isHover = false;
               hexagonGroup.children[i].loadTexture("hexagon");
           }
       } 
    }
    
};
    
function dragOverlap(icn, hex){
    console.log("hello");
    alert("hello");
};   

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

};