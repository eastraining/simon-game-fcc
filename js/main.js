$(document).ready(function() {
	// html tags
	var startBtn = $("#startBtn");
	var strictMode = $("#strictMode");
	var viewport = $("#viewport");
	var simonBtn = "simonBtn";
	var numSimonBtns = 4;
	var disabledTag = "-disabled";

	// global variables used in functions
	var currentSeq = [];
	var allSimonBtns = {};
	var soundFreqs = [180, 200, 230, 250];
	var warningSound = 300;

	// messages for .command-bar__viewport
	var statusMessages = {
		"initial": "press Start to begin.",
		"simonSaying": "memorise the button order.",
		"playerTurn": "press the buttons in order!",
		"warning": "incorrect! watch again carefully.",
		"fail": "uh oh! better luck next time!",
		"win": "congratulations, you have won!"
	}

	// set up audio contexts
	// use gainNode.connect(audioCtx.destination); and 
	// gainNode.disconnect(audioCtx.destination);
	// to turn sound on and off
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var oscillator = audioCtx.createOscillator();
	var gainNode = audioCtx.createGain();
	oscillator.connect(gainNode);
	oscillator.type = "sine";
	oscillator.frequency.value = 180;
	oscillator.start();

	// function for reading text content of html
	function readText(tag) {
		return tag.text();
	}

	// function for returning html tag
	function returnIDtag(item) {
		return $("#" + item);
	}

	// closure for updating html
	function writeHTML(tag) {
		function inserter(content) {
			return tag.html(content);
		}
		return inserter;
	}

	// function for constructing allSimonBtns
	function populateSimonBtns() {
		for (var i = 0; i < numSimonBtns; i++) {
			var tempKey = i.toString();
			allSimonBtns[tempKey] = returnIDtag(simonBtn + tempKey);
		}
	}

	// function for switching the state of the buttons
	function switchIDstate(tag) {
		var currentID = tag.attr("id");
		var newID = "";
		console.log(currentID);
		if (currentID.match(disabledTag)) {
			var temp = currentID.split("-")
			newID = temp.shift();
		}
		else {
			newID = currentID + disabledTag;
		}
		tag.attr("id", newID);
		return tag;
	}

	// function for playing sounds
	// plays the required frequency
	function playSound(frequency) {
		oscillator.frequency.value = frequency;
		gainNode.connect(audioCtx, destination);
	}

	// function for stopping sound
	function stopSound() {
		gainNode.disconnect(audioCtx, destination);
	}

	// function for beginning player turn
	function playerTurn() {
		for (var i = 0; i < numSimonBtns; i++) {
			var temp = i.toString();
			switchIDstate(returnIDtag(simonBtn + temp + disabledTag));
		}
		writeHTML(viewport)(statusMessages.playerTurn).hide().fadeIn(600);
	}

	// TODO: switch message and play initial sequence
	// add sequence to array to save it

	// TODO: player move evaluator
	// listen for sequence
	// if correct, continue again
	// if wrong, replay sequence
	// if strict, end game

	// TODO: trigger game when Start button is pressed.
	// include trigger for restarting game by swapping out Start

});