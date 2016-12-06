var charArray = []; //holds all characters
var charNames = ["Obi-Wan Kenobi", "Luke Skywalker", "Darth Vader", "Kylo Ren"];
var charSide = ["light", "light", "dark", "dark"];
var charImages = [
				"assets/images/obiwan.jpg", 
				"assets/images/luke.jpg",
				"assets/images/vader.jpg",
				"assets/images/kylo.jpg"
					];
var charSounds = [
				"assets/sounds/force.mp3",
				"assets/sounds/badfeeling.mp3",
				"assets/sounds/darkside.mp3",
				"assets/sounds/kylo.wav"
					];					
var charHPVals = [100, 125, 110, 105]; 
var charCounterAttackVals = [15, 5, 20, 10];
var playerOne;
var defender;
var playerOneSelected = false;
var defenderSelected = false;
var enemiesDefeated = 0;
var gameOn = true;

var lightWin = new Audio("assets/sounds/starwars.mp3");
var darkWin = new Audio("assets/sounds/imperial.mp3");
var saberOn = new Audio("assets/sounds/saberon.mp3");
var attackSound = new Audio("assets/sounds/clash.mp3");
var deathSound = new Audio("assets/sounds/pain.mp3");
	
function character (name, img, hp, counter, sound, side) {
	this.name = name;
	this.img = img;
	this.side = side;
	this.hp = hp;
	this.counterVal = counter;
	this.audio = sound;
	this.attackVal = 8;
	this.attackCount = 1;
} // creates character

var game = {
	start () {
		game.createChar();
		game.printCharDivStart();

		$("#attackButton").click( function () {
			game.attackStart();
		});
	},
	createChar() {
		for(var i=0; i < charNames.length; i++){
			var newChar = new character(charNames[i], charImages[i], charHPVals[i], charCounterAttackVals[i], charSounds[i], charSide[i]);
			charArray.push(newChar);
		} 
		console.log("Initial array:");
		console.log(charArray);
	},//creates characters and pushes them into charArray
	createCharDiv(char, position) {
		
			var newCharDiv = $("<div>");
			newCharDiv.addClass("charDivShow")
						.data("value", position)
						.click( function () {
							game.chooseCharacter($(this).data("value"));
							console.log(position);
						});
			var divImg = $("<img>");
			divImg.attr("src", char.img)
						.addClass("charImgShow");
			var divName = $("<p>"); 
			divName.html(char.name)
						.addClass("charNameShow");
			var divHP = $("<p>");
			divHP.html(char.hp)
						.addClass("charHPShow");
			newCharDiv.append(divName, divImg, divHP );
			return newCharDiv;	
	},//creates a div with character name, hp, and img
	printCharDivStart() {
		for(var i=0; i < charArray.length; i++){
			var charToPrint = this.createCharDiv(charArray[i], i);
			$("#characterStart").append(charToPrint);
		} 
	},//prints characters to start menu at beginning of game.
	printCharDivGame() {
		for(var i=0; i < charArray.length; i++){
			var charToPrint = this.createCharDiv(charArray[i], i);
			$("#enemiesAlive").append(charToPrint);
		}
	},//prints living characters to Enemies available to Attack
	printPlayerOne(player) {
		var charToPrint = this.createCharDiv(player, 0);
		$("#playerOne").append(charToPrint);
		
	},//prints first selected player to #playerOne id
	printDefender(player) {
		var charToPrint = this.createCharDiv(player, 0);
		$("#playerTwo").append(charToPrint);
		
	},//prints defender selected to #playerTwo id
	chooseCharacter(position) {
		if (gameOn) {
			if(playerOneSelected && defenderSelected){
				$("#messageOne").html("Player One and Defender have already been selected");
				$("#messageTwo").empty();
			} else if (playerOneSelected){
				game.chooseDefender(position);
			} else {
				game.choosePlayerOne(position);
			}
		}
	},//selects player one or defender. takes in current div value as position of character in chararray
	choosePlayerOne(position) {

		$("#characterStart").empty();
		var index = position;
		console.log("Selected position " + index);
		playerOne = charArray[index];
		playerOneSelected = true;
		
		var pOneAudio = new Audio(playerOne.audio);
		pOneAudio.play();
		
		this.printPlayerOne(playerOne);
		charArray.splice(index, 1);
		this.printCharDivGame();
		this.emptyMessage();
		$("#characterHeaderStart").empty();
		//console.log("New Array:");
		//console.log(charArray);
	}, //makes playerOne the first character selected, splices that character out of charArray, prints to playerOne location
	chooseDefender(position) {
		
		var index = position;
		console.log("Selected position " + index);
		defender = charArray[index];
		defenderSelected = true;

		var pTwoAudio = new Audio(defender.audio);
		pTwoAudio.play();
		
		this.printDefender(defender);
		charArray.splice(index, 1);
		$("#enemiesAlive").empty();
		this.printCharDivGame();
		this.emptyMessage();
		console.log("Newer Array:");
		console.log(charArray);
	}, //makes defender the next character selected, splices that character out of charArray, prints to defender location
	attackStart () {
		if (gameOn) {
			if(playerOneSelected && defenderSelected){
				this.attack();
			} else if (playerOneSelected) {
				$("#messageOne").html("Defender not chosen");
				$("#messageTwo").empty();
			} else {
				$("#messageOne").html("Player One not chosen");
				$("#messageTwo").empty();
			}
		}
	}, //checks to make sure player one and defender are both selected before making attack moves. 
	attack () {
		var currentAttack = playerOne.attackVal * playerOne.attackCount;
		playerOne.hp = playerOne.hp - defender.counterVal;
		defender.hp = defender.hp - currentAttack;
		playerOne.attackCount++;
		attackSound.play();
		$("#messageOne").html(playerOne.name +" attacked " + defender.name + " for " + currentAttack + " hit points.");
		$("#messageTwo").html(defender.name + " attacked " + playerOne.name + " for " + defender.counterVal + " hit points.");
		console.log(playerOne);
		console.log(defender);
		this.checkAndPrint();
	},//makes changes to HP values and attack count for player One and defender. 
	checkAndPrint () {
		$("#playerOne").empty();
		$("#playerTwo").empty();
		this.printPlayerOne(playerOne);
		this.printDefender(defender);
		if(playerOne.hp <= 0) {
			if(playerOne.side === "light"){
				darkWin.play();
			} else {
				lightWin.play();
			}
			$("#messageOne").html("You have been defeated by " + defender.name + ". GAME OVER!");
			$("#messageTwo").empty();
			this.restart();
		} else if (defender.hp <= 0) {
			deathSound.play();
			$("#playerTwo").empty();
			enemiesDefeated++;
			defenderSelected = false;
			this.emptyMessage();
			$("#messageOne").html("You defeated " + defender.name + "!");
			if (enemiesDefeated === 3) {
				if(playerOne.side === "light"){
					lightWin.play();
				} else {
					darkWin.play();
				}
				$("#messageOne").html("You have defeated all enemies. You win!");
				$("#messageTwo").empty();
				this.restart();
			}
		}
	},//prints new divs with new HP vals to playerOne and defender locations, checks if anyone as lost. 
	restart () {
		gameOn = false;
		var gameOverButton = $("<button>");
		gameOverButton.html("Restart?")
						.click(function() {
							location.reload();
						});
		$("#restartButton").append(gameOverButton);				
	},
	emptyMessage () {
		$("#messageOne").empty();
		$("#messageTwo").empty();
	}
	
}


$(document).ready( function () {

	game.start();

});


/*
var image = $("<img>");
image.attr("src", charImages[0]);
$("#characterStart").append(image);
*/