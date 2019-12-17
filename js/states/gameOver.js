
var starfield, playerScore, bmpText, highScores, fs, randomNum, name;
//import fs from 'fs';






var gameOver = {
    init: function (theScore) {
        if(theScore)
            playerScore = theScore;
        else
            playerScore = game.rnd.integerInRange(0,100);

    },
    
    preload: function(){
         game.load.image('starfield', 'assets/starfield.jpg');
         game.load.bitmapFont('arcade', 'assets/mytext/arcade.png', 'assets/mytext/arcade.xml');

    },
    create: function(game){
        //fs = require("fs");
        //playerScore = game.rnd.integerInRange(0,100);
        let name = prompt("Input a name to save this game session's score:");
        let record = { "name": name,
                        "score": playerScore,
                        "gametitle": "spaceshooter" 
                    };
        // if(localStorage){
        //     localStorage.setItem(name, JSON.stringify(record));

        //     //console.log("This is your score:", localStorage.getItem(name));
        //     let user = JSON.parse(localStorage.getItem(name));
        //     console.log(user);
        // }else{
        //     alert("This doesn't support local storage");
        // }
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

        for (let i = 1; i <= highestScores.length; i++) {
            if (highestScores[i-1]) {
              this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      ${highestScores[i-1].score}    ${highestScores[i-1].name}`);
            } else {
              this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      0    ---`).setTint(0xffffff);
            }
          }

          
        
        //highScores = fs.readFileSync("highscores.txt", "utf8");

        //console.log(highScores);

        //console.log(playerScore);


    },
    update: function(game){
        starfield.tilePosition.y += 2;

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
    }

   
};

