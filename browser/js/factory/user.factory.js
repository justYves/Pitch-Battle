app.factory('user', function() {
  var user = {
    name: 'Anonymous',
    message: 'You better tone down, Pitch!',
    hp: 100,
    pic:''
  };
  var getName = function() {
    return user.name;
  };

  var setName = function(name) {
    if (name !== undefined && name !=="") {
      user.name = name;
    }
    return user.name;
  };

  var getHP = function() {
    return user.hp
  };

  var addHP = function(num) {
    return Math.min(user.hp += num, 100);
  };

  var substractHP = function(num) {
    return Math.max(user.hp -= num, 0);
  };

  var getAll = function() {
    return user;
  };

  var restart = function() {
    user.hp = 100;
  };

  var setPic = function(pic){
    user.pic = pic;
  };

  var getPic =function(){
    return user.pic;
  };

  return {
    getName: getName,
    setName: setName,
    getHP: getHP,
    getAll: getAll,
    restart: restart,
    setPic: setPic,
    getPic: getPic
  };
});