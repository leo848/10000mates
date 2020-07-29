function randomChessFensIndex (){
	return Math.floor(
		Math.random() * FENS.length,
	);
}

//===========================================================\\
var rcf = undefined;

var game = new Chess();

var board = null;

function onDragStart (
	source,
	piece,
	position,
	orientation,
){
	// do not pick up pieces if the game is over
	if (game.game_over()) return false;

	// only pick up pieces for the side to move
	if (
		(game.turn() === 'w' &&
			piece.search(/^b/) !== -1) ||
		(game.turn() === 'b' &&
			piece.search(/^w/) !== -1)
	) {
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
		setTimeout(nextIndex, 500);
	} else {
		game.undo();
		board.position(game.fen());
	}

	// $status.html(status)
	// $fen.html(game.fen())
	// $pgn.html(game.pgn())
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
	game.load(FENS[rcf]);
	board.position(FENS[rcf]);
	board.orientation(
		game.turn() == 'w' ? 'white' : 'black',
	);
}

nextIndex();

$('#nextButton').on('click', nextIndex);
