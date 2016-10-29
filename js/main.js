$(document).ready(function() {
	// html tags
	var startBtn = $("#startBtn");
	var strictMode = $("#strictMode");
	var viewport = $("#viewport");
	var simonBtn = "simonBtn";
	var numSimonBtns = 4;

	// global variables used in functions
	var currentSeq = [];
	var currentCount = 0;
	var allSimonBtns = {};
	var allSoundFreqs = [180, 200, 230, 250];
	var warningSound = 300;
	var maxRounds = 20;

	// messages for .command-bar__viewport
	var statusMessages = {
		"initial": "press Start to begin.",
		"simonSaying": ". memorise the button order.",
		"playerTurn": "press the buttons in order!",
		"warning": "incorrect! watch again carefully.",
		"fail": "uh oh! better luck next time!",
		"pass": "well done! prepare for the next round.",
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

	// function for playing sounds
	// plays the required frequency
	function playSound(frequency) {
		oscillator.frequency.value = frequency;
		gainNode.connect(audioCtx.destination);
	}

	// function for changing text in viewport
	function changeViewport(text) {
		return writeHTML(viewport)(text).hide().fadeIn(600);
	}

	// function for stopping sound
	function stopSound() {
		gainNode.disconnect(audioCtx.destination);
	}

	// switch message and play initial sequence
	// add sequence to array to save it
	// TODO: make sure the right sound is played and the right icon is highlighted
	function compTurn(repeat) {
		if (!repeat) {
			var rand = Math.floor(Math.random() * allSoundFreqs.length);
			currentSeq.push(rand);
		}
		currentCount = 0;
		var currentTotalCount = currentSeq.length.toString();
		changeViewport("round: " + currentTotalCount + statusMessages.simonSaying);
		var delay = 0;
		var killDelay = 0;
		
		for (var i = 0; i < currentSeq.length; i++) {
			var temp = currentSeq[i].toString();
			var tempTag = allSimonBtns[temp];
			var tempFreq = allSoundFreqs[currentSeq[i]];
			delay = i * 1200 + 1500;
			killDelay = delay + 900;
			setTimeout(function() {
				playSound(tempFreq);
				$("#simonBtn1").addClass("active");
			}, delay);
			setTimeout(function() {
				stopSound();
				$("#simonBtn1").removeClass("active");
			}, killDelay);
		}
		setTimeout(function() {
			playerTurn();
		}, killDelay + 500);
	}

	// function for beginning player turn
	function playerTurn() {
		changeViewport(statusMessages.playerTurn);
		for (var i = 0; i < numSimonBtns; i++) {
			var temp = i.toString();
			var tempTag = allSimonBtns[temp];

			// buttons, when pressed, play sound, and call the evaluator
			// immediately once button is released
			tempTag.mousedown(function() {
				var tempNum = $(this).attr("id").match(/[0-9]/)[0];
				$(this).addClass("active");
				playSound(allSoundFreqs[tempNum]);
			});
			tempTag.mouseup(function() {
				stopSound();
				var tempNum = $(this).attr("id").match(/[0-9]/)[0];
				$(this).removeClass("active");
				currentCount++;
				evalMove(tempNum);
			});
		}

		// add animation to buttons
	}

	// player move evaluator
	// listen for sequence
	// if correct, continue again
	// if wrong, replay sequence
	// if strict, end game
	function evalMove(num) {
		if (num != currentSeq[currentCount - 1]) {
			// kill button animations
			$(".command-bar__content__game").off();

			// play error sound'
			setTimeout(function() {playSound(warningSound);;}, 300);
			setTimeout(function() {stopSound();}, 1500);
			
			// TODO: check if strict mode, else restart compTurn
			if (strictMode.is(":checked")) {
				changeViewport(statusMessages.fail);
			}
			else {
				changeViewport(statusMessages.warning);
				setTimeout(function() {compTurn(true);}, 1800);
			}
		}
		else if (currentCount == currentSeq.length) {
			$(".command-bar__content__game").off();
			if (currentSeq.length == maxRounds) {
				changeViewport(statusMessages.win);
			}
			else {
				changeViewport(statusMessages.pass);
				setTimeout(function() {compTurn();}, 1800);
			}
		}
	}

	// trigger game when Start button is pressed.
	// include trigger for restarting game by swapping out Start
	startBtn.click(function() {
		writeHTML(startBtn)("Restart");
		currentSeq = [];
		allSimonBtns = {};
		populateSimonBtns();	
		compTurn();
	});
});