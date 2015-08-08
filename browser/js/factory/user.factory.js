app.factory('user', function() {
  var user = {
    name: 'anonymous',
    message: 'You better tone down, Pitch!',
    hp: 100
  };
  var getName = function() {
    return user.name;
  };

  var setName = function(name) {
    user.name = name;
    return user.name;
  };

  var getHP = function(){
    return user.hp
  };

  var addHP = function(num){
    return Math.max(user.hp+=num,100);
  };

  var substractHP = function(num){
    return Math.min(user.hp-=num,0);
  };

  var getAll = function(){
    return user;
  }

  return {
    getName: getName,
    setName: setName,
    getHP: getHP,
    getAll : getAll
  };
});