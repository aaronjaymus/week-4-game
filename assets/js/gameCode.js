var charArray = []; //holds all characters
var charNames = ["Obi-Wan Kenobi", "Luke Skywalker", "Darth Vader", "Kylo Ren"];
var charImages = [
				"assets/images/obiwan.jpg", 
				"assets/images/luke.jpg",
				"assets/images/vader.jpg",
				"assets/images/kylo.jpg"
					];
var charHPVals = [100, 120, 150, 120]; 
var charCounterAttackVals = [30, 25, 50, 25];
var playerOne;
var defender;
var playerOneSelected = false;
var defenderSelected = false;

	
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
		console.log("character chosen");
		if(playerOneSelected && defenderSelected){
			$("#messageOne").html("Player One and Defender have already been selected");
			$("#messageTwo").html("");
		} else if (playerOneSelected){
			game.chooseDefender(position);
		} else {
			game.choosePlayerOne(position);
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
	},
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
	},
	attack {
		if(playerOneSelected && defenderSelected){

		} else if (playerOneSelected) {
			$("#messageOne").html("Defender not chosen");
			$("#messageTwo").html("");
		} else {
			$("#messageOne").html("Player One not chosen");
			$("#messageTwo").html("");
		}
	},
	
}


$(document).ready( function () {

	game.createChar();
	game.printCharDivStart();

	$("#attackButton").click( function () {
		game.attack();
	});

});


/*
var image = $("<img>");
image.attr("src", charImages[0]);
$("#characterStart").append(image);
*/