var charArray = []; //holds all characters
var charNames = ["Obi-Wan Kenobi", "Luke Skywalker", "Darth Vader", "Kylo Ren"];
var charImages = [
				"assets/images/obiwan.jpg", 
				"assets/images/luke.jpg",
				"assets/images/vader.jpg",
				"assets/images/kylo.jpg"
					];
var charHPVals = [100, 120, 150, 120]; 
var charCounterAttackVals = [20, 10, 30, 15];
var playerOne;
var defender;
var playerOneSelected = false;
var defenderSelected = false;
var enemiesDefeated = 0;
var gameOn = true;

	
function character (name, img, hp, counter) {
	this.name = name;
	this.img = img;
	this.hp = hp;
	this.counterVal = counter;
	this.attackVal = 8;
	this.attackCount = 1;
} // creates character

var game = {
	createChar() {
		for(var i=0; i < charNames.length; i++){
			var newChar = new character(charNames[i], charImages[i], charHPVals[i], charCounterAttackVals[i]);
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
		this.printPlayerOne(playerOne);
		charArray.splice(index, 1);
		this.printCharDivGame();
		console.log("New Array:");
		console.log(charArray);
	}, //makes playerOne the first character selected, splices that character out of charArray, prints to playerOne location
	chooseDefender(position) {
		var index = position;
		console.log("Selected position " + index);
		defender = charArray[index];
		defenderSelected = true;
		this.printDefender(defender);
		charArray.splice(index, 1);
		$("#enemiesAlive").empty();
		this.printCharDivGame();
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
		$("#messageOne").html(playerOne.name +" attacked " + defender.name + " for " + currentAttack + " hit points.");
		$("#messageTwo").html(defender.name + " attacked " + playerOne.name + " for " + defender.counterVal + " hit points.");
		console.log(playerOne);
		console.log(defender);
		this.checkAndPrint();
	},
	checkAndPrint () {
		$("#playerOne").empty();
		$("#playerTwo").empty();
		this.printPlayerOne(playerOne);
		this.printDefender(defender);
		if(playerOne.hp <= 0) {
			$("#messageOne").html("You have been defeated. GAME OVER!");
			$("#messageTwo").empty();
			this.restart();
		} else if (defender.hp <= 0) {
			$("#playerTwo").empty();
			enemiesDefeated++;
			defenderSelected = false;
			if (enemiesDefeated === 3) {
				$("#messageOne").html("You have defeated all enemies. You win!");
				$("#messageTwo").empty();
				this.restart();
			}
		}
	},
	restart () {
		gameOn = false;
		var gameOverButton = $("<button>");
		gameOverButton.html("Restart?")
						.click(function() {
							location.reload();
						});
		$("#restartButton").append(gameOverButton);				
	}
	
}


$(document).ready( function () {

	game.createChar();
	game.printCharDivStart();

	$("#attackButton").click( function () {
		game.attackStart();
	});

});


/*
var image = $("<img>");
image.attr("src", charImages[0]);
$("#characterStart").append(image);
*/