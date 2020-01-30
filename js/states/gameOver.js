
var starfield, playerScore, bmpText, highScores, fs, randomNum, name, isTrueGameSession, gameOverButton;
//import fs from 'fs';






var gameOver = {
    init: function (theScore) {
        if(theScore){
            playerScore = theScore;
            isTrueGameSession = true;
        }
        else{
            //playerScore = game.rnd.integerInRange(0,100);
            playerScore = 8;
            isTrueGameSession = false;
        }
        //Adding this here for format the code to be displayed neatly
        if(playerScore < 10){
            let numberString = '0' + playerScore.toString()
            playerScore = parseInt(numberString);
            console.log(numberString);
        }

    },
    
    preload: function(){
         game.load.image('starfield', 'assets/starfield.jpg');
         game.load.bitmapFont('arcade', 'assets/mytext/arcade.png', 'assets/mytext/arcade.xml');
         game.load.image('playagn', 'assets/mybuttons/playagain.png', 193, 71);

    },
    create: function(game){
        //fs = require("fs");
        //playerScore = game.rnd.integerInRange(0,100);
                //alert(gameOverButton);
        let name = prompt("Input a name to save this game session's score:");
        if(name == 'delete'){
            localStorage.clear();
        }
        let record = { "name": name,
                        "score": playerScore,
                        "gametitle": "spaceshooter" 
                    };
        if(localStorage){
            if(isTrueGameSession)
                localStorage.setItem(name, JSON.stringify(record));

            //console.log("This is your score:", localStorage.getItem(name));
            let user = JSON.parse(localStorage.getItem(name));
            console.log(user);
        }else{
            alert("This doesn't support local storage");
        }
        let entireStorage = localStorage;
        let records = [];
        for(let rawRecordName in entireStorage){
            //console.log(rawRecordName);
            let record;
            try{
                record = JSON.parse(localStorage.getItem(rawRecordName))
                //record = JSON.parse(record);
                if(record.hasOwnProperty('gametitle')){
                    records.push(record);
                }
            }catch(err){
                //console.log("skip");
                //console.log(record);
                //console.log(err);
            }
            //console.log(record)
            
        }
        console.log(records);
        
        let highestScore;
        let highestScores = [];
        for(let i = 0; i < 5; i++){
            highestScore = this.findHighestScore(records);
            //Added the following to format the code display of the score
            if(highestScore.score < 10){
                highestScore.score = ' ' + highestScore.score;
            }
            highestScores.push(highestScore);
            //let tempArr = [];
            for(let j = 0; j < records.length; j++){
                if(records[j] == highestScore){
                    //console.log("here");
                    records.splice(j,1);
                    //console.log(records.length);
                }
            }
        }
        console.log(highestScores);

        
        //highestScores.push(highScore);
        //console.log(entireStorage);
        // for(var key in local.Score){
        //     console.log(key); 
        // }

        //console.log(localStorage.)
        bmpText = game.add.bitmapText(100, 110, 'arcade', 'YOUR SCORE:', 64);
        //console.log(bmpText);
        
        starfield = game.add.tileSprite(0, 0, game.width, game.height, 'starfield');

        bmpText = game.add.bitmapText(100, 110, 'arcade', 'YOUR SCORE: ' + playerScore, 24);

        let titleSpacer = '      ';
        let boardSpacer = '      '; 
        this.add.bitmapText(100, 160 + 10, 'arcade', `Rank${titleSpacer} Score${titleSpacer}Session Name`);
        for (let i = 1; i <= highestScores.length; i++) {
            // this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` Rank      Score    Session Name`);

            if (highestScores[i-1]) {
              this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}${boardSpacer}${boardSpacer}${highestScores[i-1].score}${boardSpacer} ${highestScores[i-1].name}`);
            } else {
              this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}${boardSpacer}${boardSpacer}0${boardSpacer}  ---`).setTint(0xffffff);
            }
          }

          gameOverButton = game.add.button(game.width/2, game.height - 50, 'playagn', this.playGame, this, 2, 1, 0);


          
        
        //highScores = fs.readFileSync("highscores.txt", "utf8");

        //console.log(highScores);

        //console.log(playerScore);


    },
    update: function(game){
        starfield.tilePosition.y += 2;
        //alert(gameOverButton);

    },
    findHighestScore: function(arr){
        let currentHighScore = -10;
        let highScoreIndex;
        for(let i = 0; i < arr.length; i++){
            if(arr[i].score > currentHighScore){
                currentHighScore = arr[i].score;
                highScoreIndex = i;
            }
        }
        return arr[highScoreIndex];
    },
    playGame: function(){
        game.state.start('open');
    }
    
    

   
};

