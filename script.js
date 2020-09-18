(function (){
	try {
	document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
	var currentParams = (function (url){
		var params = {};
		var parser = document.createElement('a');
		parser.href = url;
		var query = parser.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			params[pair[0]] = decodeURIComponent(
				pair[1],
			);
		}
		return params;
	})(window.location.url);

	if ('fen' in currentParams) {
		document.body.innerHTML = `${FENS[
			currentParams.fen
		]}`;
		return;
	}
	function randomChessFensIndex (){
		return Math.floor(
			Math.random() * FENS.length,
		);
	}

	//===========================================================\\
	var rcf = undefined;

	var game = new Chess();

	var board = null;
	var isAbleToMove = true;

	var time = 60;

	let timerInterval = setInterval(() => {
		if (time >= 0) {
			time -= 0.1;
			$('#bar').css(
				'width',
				Math.round(time * 10) /
					10 *
					(100 / 60) +
					'%',
			);
			$('#bar').css(
				'background-color',
				`hsl(${time * 2.4}, 100%, 50%)`,
				// 'hsl(' +
				// 	 +
				// 	', 100, 50)',
			);
		} else {
		isAbleToMove = false;
			splash_screen();
		}
	}, 100);

	
	
	
	function onDragStart (
		source,
		piece,
		position,
		orientation,
	){
		// do not pick up pieces if the game is over
		if (game.game_over()) return false;

		if (!isAbleToMove) return false;

		// only pick up pieces for the side to move
		if (
			(game.turn() === 'w' &&
				piece.search(/^b/) !== -1) ||
			(game.turn() === 'b' &&
				piece.search(/^w/) !== -1)
		) {
			makeStatusTextBold(250);
			return false;
		}
	}

	function onDrop (source, target){
		// see if the move is legal
		var move = game.move({
			from      : source,
			to        : target,
			promotion : 'q', // NOTE: always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return 'snapback';

		updateStatus();
	}

	// update the board position after the piece snap
	// for castling, en passant, pawn promotion
	function onSnapEnd (){
		board.position(game.fen());
	}

	function updateStatus (){
		var status = '';

		var moveColor = 'White';
		if (game.turn() === 'b') {
			moveColor = 'Black';
		}

		// checkmate?
		if (game.in_checkmate()) {
			status =
				'Game over, ' +
				moveColor +
				' is in checkmate.';
			$('#score').html(
				$('#score').html() - -1,
			);
			setTimeout(nextIndex, 500);
		} else {
			isAbleToMove = false;

			board.position(game.fen(), false);
			game.move(
				game.moves()[
					Math.floor(
						Math.random() *
							game.moves().length,
					)
				],
			);

			setTimeout(() => {
				game.undo();
				game.undo();
				board.position(game.fen());
				isAbleToMove = true;
			}, 1000);
		}

		// $status.html(status)
		// $fen.html(game.fen())
		// $pgn.html(game.pgn())
	}

	function makeStatusTextBold (time){
		$('#side-to-move').css(
			'font-weight',
			'bold',
		);
		setTimeout(() => {
			$('#side-to-move').css(
				'font-weight',
				'normal',
			);
		}, time);
	}

	var config = {
		draggable   : true,
		position    : 'start',
		onDragStart : onDragStart,
		onDrop      : onDrop,
		onSnapEnd   : onSnapEnd,
	};
	board = new Chessboard('myBoard', config);

	updateStatus();

	function nextIndex (){
		rcf = randomChessFensIndex();
		$('#fen-id').html(rcf);

		game.load(FENS[rcf]);
		board.position(FENS[rcf]);
		$('#side-to-move').html(
			game.turn() == 'w'
				? 'Weiß'
				: 'Schwarz',
		);
		$('#solution').attr(
			'href',
			'https://lichess.org/analysis/' +
				game.fen().replace(/ /gi, '_'),
		);
		board.orientation(
			game.turn() == 'w'
				? 'white'
				: 'black',
		);
	}

	nextIndex();

	$('#nextButton').on('click', nextIndex);
	$('#splash').on('click', splash_screen);
	
	function splash_screen(){
		document.body.innerHTML += '<div id="splashscreen">Gut gemacht!</div>';
	
	};}
	catch (e) {
	alert(e)}
})();
