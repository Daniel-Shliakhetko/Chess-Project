$(".end-modal").slideUp();
let player1 = "Player 1";
let player2 = "Player 2";
$(document).on("click", "#start-game", function () {
  if(getRandomInt(2) == 0){
      if($("#player1").val()!="")
      player1 = $("#player1").val();
      if($("#player2").val()!="")
      player2 = $("#player2").val();
  }
  else{
    if($("#player2").val()!="")
      player1 = $("#player2").val();
      if($("#player1").val()!="")
      player2 = $("#player1").val();
  }
  $("span").text(player1);
  $("span").first().text(player2);
  $(".start-modal").slideUp(500);
});
$(document).on("click", "#reload-game", function () {
  location.reload();
});
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
