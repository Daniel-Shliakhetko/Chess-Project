const spc = " ";
const boardSettings = {
  width: 8,
  height: 8,
  sizeOfCell: "5em",
};
const slc = {
  board: ".board",
  line: ".line",
  field: ".field",
  piece: ".piece",
  posibleMove: ".posible",
};
const tag = {
  line: '<div class="line" data-x="" data-y=""></div>',
  field: '<div class="field"></div>',
};
const atr = {
  x: "data-x",
  y: "data-y",
  pieceType: "data-piece-type",
};
const piecesCoordinates = [
  {
    pieceType: "pawn",
    coordinates: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      { x: 7, y: 2 },
      { x: 8, y: 2 },
    ],
  },
  {
    pieceType: "rook",
    coordinates: [
      { x: 1, y: 1 },
      { x: 8, y: 1 },
    ],
  },
  {
    pieceType: "knight",
    coordinates: [
      { x: 2, y: 1 },
      { x: 7, y: 1 },
    ],
  },
  {
    pieceType: "bishop",
    coordinates: [
      { x: 3, y: 1 },
      { x: 6, y: 1 },
    ],
  },
  {
    pieceType: "queen",
    coordinates: [{ x: 5, y: 1 }],
  },
  {
    pieceType: "king",
    coordinates: [{ x: 4, y: 1 }],
  },
];

let currentTeam = "white";

let $currentPiece;
let $curentField;
let $posibleMoves;

let posibleMathMoves = [];

createBoard();

$(document).on("click", slc.posibleMove, function () {
  //alert((slc.piece+crdnToSlc("x",$(this).attr(atr.x)) +crdnToSlc("y",$(this).attr(atr.x))));
  if (getPiece($(this).attr(atr.x), $(this).attr(atr.y)).length) {
    getPiece($(this).attr(atr.x), $(this).attr(atr.y)).remove();
  }
  if (
    $currentPiece.attr(atr.pieceType) == "pawn" &&
    ($(this).attr(atr.y) == 8 || $(this).attr(atr.y) == 1)
  ) {
    $(this)
      .parent(slc.field)
      .append(
        '<div class="piece ' +
          getTeam($currentPiece) +
          '" data-x="' +
          $(this).attr(atr.x) +
          '" data-y="' +
          $(this).attr(atr.y) +
          '" data-piece-type="queen"></div>'
      );
  } else {
    $(this)
      .parent(slc.field)
      .append(
        '<div class="piece ' +
          getTeam($currentPiece) +
          '" data-x="' +
          $(this).attr(atr.x) +
          '" data-y=' +
          $(this).attr(atr.y) +
          " data-piece-type=" +
          $currentPiece.attr(atr.pieceType) +
          "></div>"
      );
  }
  destroyCurrentPiece();
  nextMove();
});

$(document).on("click", slc.piece, function () {
  if (currentTeam == getTeam($(this))) {
    destroyPosibleMoves();
    $currentPiece = $(this);
    checkMoves($(this));
  }
});

function createBoard() {
  for (var i = 0; i < boardSettings.width; i++) {
    $(slc.board).append(tag.line);
    for (var j = 0; j < boardSettings.height; j++) {
      $(slc.board + spc + slc.line)
        .last()
        .append(tag.field);
      $(slc.field)
        .last()
        .attr(atr.x, i + 1);
      $(slc.field)
        .last()
        .attr(atr.y, j + 1);
      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
        $(slc.field).last().addClass("white-field");
      } else {
        $(slc.field).last().addClass("black-field");
      }
    }
  }
  setPieces();
}
function setPieces() {
  for (var i = 0; i < piecesCoordinates.length; i++) {
    for (var j = 0; j < piecesCoordinates[i].coordinates.length; j++) {
      $(
        slc.field +
          crdnToSlc("x", piecesCoordinates[i].coordinates[j].x) +
          crdnToSlc("y", piecesCoordinates[i].coordinates[j].y)
      ).append(
        '<button class="piece black" data-x=' +
          piecesCoordinates[i].coordinates[j].x +
          " data-y=" +
          piecesCoordinates[i].coordinates[j].y +
          " data-piece-type=" +
          piecesCoordinates[i].pieceType +
          "></button>"
      );
      $(
        slc.field +
          crdnToSlc("x", piecesCoordinates[i].coordinates[j].x) +
          crdnToSlc(
            "y",
            boardSettings.height + 1 - piecesCoordinates[i].coordinates[j].y
          )
      ).append(
        '<button class="piece white" data-x=' +
          piecesCoordinates[i].coordinates[j].x +
          " data-y=" +
          (boardSettings.height + 1 - piecesCoordinates[i].coordinates[j].y) +
          " data-piece-type=" +
          piecesCoordinates[i].pieceType +
          "></button>"
      );
    }
  }

  //data-x=' + $(cordinates).attr(atr.x) +" data-y=" +$(cordinates).attr(atr.y) +'
  //+ crdnToSlc("x", 4)
  // cordinates = slc.field + crdnToSlc("y", 7);
  // $(cordinates).append(
  //   '<button class="piece black" data-x=' +
  //     $(cordinates).attr(atr.x) +
  //     " data-y=" +
  //     $(cordinates).attr(atr.y) +
  //     ' data-piece-type="pawn"></button>'
  // );
}
function checkMoves($currentPiece) {
  var x = parseInt($currentPiece.attr(atr.x));
  var y = parseInt($currentPiece.attr(atr.y));
  var pieceType = $currentPiece.attr(atr.pieceType);
  var isTeamBlack = $currentPiece.hasClass("black");
  $posibleMoves = setPosibleMovesFields(x, y, pieceType, isTeamBlack);
}
function setPosibleMovesFields(x, y, pieceType, isTeamBlack) {
  switch (pieceType) {
    case "pawn":
      if (isTeamBlack) {
        indx = 1;
      } else {
        indx = -1;
      }
      if (!isFieldBusyByOtherPiece(x, y + indx * 1)) {
        posibleMathMoves.push(crdn2dToObject(x, y + indx * 1));

        if (
          !isFieldBusyByOtherPiece(x, y + indx * 2) &&
          ((y == 2 && isTeamBlack) || (y == 7 && !isTeamBlack))
        ) {
          posibleMathMoves.push(crdn2dToObject(x, y + indx * 2));
        }
      }

      if (isFieldBusyByOtherPiece(x + 1, y + indx * 1)) {
        posibleMathMoves.push(crdn2dToObject(x + 1, y + indx * 1));
      }
      if (isFieldBusyByOtherPiece(x - 1, y + indx * 1)) {
        posibleMathMoves.push(crdn2dToObject(x - 1, y + indx * 1));
      }
      break;
    case "rook":
      checkDirection(0, 1);
      checkDirection(1, 0);
      checkDirection(0, -1);
      checkDirection(-1, 0);
      break;
    case "knight":
      checkIsMovePosible(x + 2, y + 1);
      checkIsMovePosible(x + 2, y - 1);
      checkIsMovePosible(x - 2, y + 1);
      checkIsMovePosible(x - 2, y - 1);
      checkIsMovePosible(x + 1, y + 2);
      checkIsMovePosible(x + 1, y - 2);
      checkIsMovePosible(x - 1, y + 2);
      checkIsMovePosible(x - 1, y - 2);
      break;
    case "bishop":
      checkDirection(1, 1);
      checkDirection(-1, 1);
      checkDirection(1, -1);
      checkDirection(-1, -1);
      break;
    case "queen":
      checkDirection(0, 1);
      checkDirection(1, 0);
      checkDirection(0, -1);
      checkDirection(-1, 0);
      checkDirection(1, 1);
      checkDirection(-1, 1);
      checkDirection(1, -1);
      checkDirection(-1, -1);
      break;
    case "king":
      checkIsMovePosible(x + 1, y);
      checkIsMovePosible(x + 1, y - 1);
      checkIsMovePosible(x + 1, y + 1);
      checkIsMovePosible(x, y - 1);
      checkIsMovePosible(x, y + 1);
      checkIsMovePosible(x - 1, y);
      checkIsMovePosible(x - 1, y + 1);
      checkIsMovePosible(x - 1, y - 1);
      break;
  }
  for (var i = 0; i < posibleMathMoves.length; i++) {
    if (
      !(
        getPiece(posibleMathMoves[i].x, posibleMathMoves[i].y).length &&
        getTeam($currentPiece) ==
          getTeam(getPiece(posibleMathMoves[i].x, posibleMathMoves[i].y))
      )
    ) {
      $(
        slc.field +
          crdnToSlc("x", posibleMathMoves[i].x) +
          crdnToSlc("y", posibleMathMoves[i].y)
      ).append(
        '<button class="posible" data-x="' +
          posibleMathMoves[i].x +
          '" data-y="' +
          posibleMathMoves[i].y +
          '"></button>'
      );
    }
  }
  posibleMathMoves = [];
}
function destroyPosibleMoves() {
  $posibleMoves = [];
  $(slc.posibleMove).remove();
}
function destroyCurrentPiece() {
  $currentPiece.remove();
}
function crdn2dToObject(x, y) {
  return {
    x: x,
    y: y,
  };
}
function crdnToSlc(axis, value) {
  switch (axis) {
    case "x":
      return "[" + atr.x + "=" + value + "]";
      break;
    case "y":
      return "[" + atr.y + "=" + value + "]";
      break;
    default:
      return "";
      break;
  }
}
function getTeam($object) {
  if ($object.hasClass("white")) {
    return "white";
  } else {
    return "black";
  }
}
function getPiece(x, y) {
  return $(slc.piece + crdnToSlc("x", x) + crdnToSlc("y", y));
}
function isFieldBusyByOtherPiece(x, y) {
  return $(slc.field + crdnToSlc("x", x) + crdnToSlc("y", y) + spc + slc.piece)
    .length;
}
function nextMove() {
  if (currentTeam == "white") {
    return "black";
  } else {
    return "white";
  }
}
function getCrdnByDirection(cordinates, direction, index) {
  return {
    x: cordinates.x + direction.x * index,
    y: cordinates.y + direction.y * index,
  };
}
function isInBounds(crdn) {
  if (crdn.x > 0 && crdn.x <= 8 && crdn.y > 0 && crdn.y <= 8) {
    return true;
  } else {
    return false;
  }
}
function checkDirection(directionX, directionY) {
  // console.log(
  //   isInBounds(getCrdnByDirection(
  //     crdn2dToObject(parseInt($currentPiece.attr(atr.x)), parseInt($currentPiece.attr(atr.y))),
  //     crdn2dToObject(parseInt(directionX), parseInt(directionY)),
  //     i
  //   )));
  for (var i = 1; i < 8; i++) {
    var crdn = getCrdnByDirection(
      crdn2dToObject(
        parseInt($currentPiece.attr(atr.x)),
        parseInt($currentPiece.attr(atr.y))
      ),
      crdn2dToObject(parseInt(directionX), parseInt(directionY)),
      i
    );
    console.log(crdn);
    console.log(i);
    if (getPiece(crdn.x, crdn.y).length) {
      posibleMathMoves.push(crdn);
      return;
    } else {
      posibleMathMoves.push(crdn);
    }
    if (
      !isInBounds(
        getCrdnByDirection(
          crdn2dToObject(
            parseInt($currentPiece.attr(atr.x)),
            parseInt($currentPiece.attr(atr.y))
          ),
          crdn2dToObject(parseInt(directionX), parseInt(directionY)),
          i
        )
      )
    )
      return;
  }
}
function checkIsMovePosible(x, y) {
  if (
    !isFieldBusyByOtherPiece(x, y) ||
    getTeam($currentPiece) != getTeam(getPiece(x, y))
  ) {
    posibleMathMoves.push(crdn2dToObject(x, y));
  }
}
function changeCurrentTeam() {
  if (getTeam($currentPiece) == "white") {
    $(slc.piece).css({ transform:"rotate(180deg)"});
    $("span").css({ transform:"rotate(180deg)"});
    $(".indicator").css({backgroundColor:"black", borderColor:"white",transform:"scale(-1)"});
    currentTeam = "black";
  } else {
    $(slc.piece).css({ transform:"rotate(0deg)"});
    $("span").css({ transform:"rotate(0deg)"});
    $(".indicator").css({backgroundColor:"white", borderColor:"black",transform:"scale(1)"});
    currentTeam = "white";
  }
}
function nextMove(){
  changeCurrentTeam();
  destroyPosibleMoves();
  checkIsKingAlive();
}
function checkIsKingAlive(){
  if(!$('.white[data-piece-type="king"]').length){
    endGame(player2);
  }
  if(!$('.black[data-piece-type="king"]').length){
    endGame(player1);
  }
}
function endGame(winner){
  $(".end-modal").css({opacity:1}).slideDown();
  $(".end-modal p").text(winner+" won!");
}
