app.factory('opponent', function() {
  var opponent = new Opponent();

  function Opponent() {
    this.name= '';
    this.id='';
    this.hp= 100;
    this.img='';
  }

  // var create = function(name){
  //   return opponent = new Opponent(name);
  // };

  // Opponent.prototype.getName = function(){
  //   return this.name;
  // }

  return opponent;
});