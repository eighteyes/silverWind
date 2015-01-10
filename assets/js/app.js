var app = angular.module('silverWind', [
]);


app.controller( 'gameController', function($scope, gameService){
  $scope.state = gameService.state;
  $scope.user = { name: 'controller' };

  $scope.addBid = function(index){
    gameService.addBid(index, $scope.user);
  }
  $scope.switchUser = function(user){
    $scope.user = user;
    gameService.calculatePersonal(user);
  }

  $scope.addUser = function(){
    $scope.userList.push( _.clone($scope.user) );
  }

  $scope.userList = [ _.clone($scope.user), { name: 'user'} ];



});

app.filter('total', function(){
  return function(array){
    return _.reduce(array, function(result, item){
      return result + parseFloat(item);
    }, 0);
  }
});

var bidFactor = 1;

app.factory('gameService', function(){
  var company1 = { name: 'Microsoft' };
  var company2 = { name: 'Apple' };
  var company3 = { name: 'Comcast' };

  var gameState = {
    block: [ company1, company2, company3 ],
    //stored
    bids: [],
    //generated
    total: [  ],
    //individual records
    personal: [ ],
    //individual percentage
    percentage : [],
    //individual gains
    gains: [],
    loserIndex: null,
    winnerIndex: null
  }

  return {
    state: gameState,
    calculateBids : calculateBids,
    calculatePersonal : calculatePersonal,
    addBid: addBid
  }

  function calculateBids(){
     gameState.total = _.reduce( gameState.bids, function( result, bid ){
        result[bid.index] += bidFactor;
        return result;
      }, [0,0,0] )

     var biggestValue = _.clone(gameState.total).sort(function(a,b) {
      //stupid fuckign javascript
      return a>b
    }).pop();

     var smallestValue = _.clone(gameState.total).sort(function(a,b) {
      //stupid fuckign javascript
      return a<b
    }).pop();

     console.log('biggie', biggestValue, 'smalls', smallestValue);

     if (  gameState.total.indexOf( biggestValue ) === gameState.total.lastIndexOf( biggestValue ) ){
       // there can be only one
       gameState.loserIndex = gameState.total.indexOf( biggestValue );
       console.log('loser', gameState.loserIndex);
     } else {
      gameState.loserIndex = null;
     }

     if (  gameState.total.indexOf( smallestValue ) === gameState.total.lastIndexOf( smallestValue ) ){
       // there can be only one
       gameState.winnerIndex = gameState.total.indexOf( smallestValue );
       console.log('winner', gameState.winnerIndex);
     } else {
      gameState.winnerIndex = null;
     }
     return gameState.total;
  }

  function calculatePersonal(user){
    gameState.personal = _.reduce( gameState.bids, function( result, bid ){
      if ( bid.user.name === user.name ){
        result[bid.index] += bidFactor;
      }
      return result;
    }, [0,0,0]);
    gameState.percentage = _.map( gameState.personal, function( stake, i ){
      return Math.round(stake / gameState.total[i] * 100);
    });
    calculateGains(user);
  }

  function calculateGains(user){
    // find totals
    var totals = _.clone(gameState.total);

    // remove smallest
    var winnerTotal = totals.sort().shift();

    // add remainder
    var totalPot = _.reduce( totals, function(result, num){
      return result+num;
    });

    // figure out distribution via percentage
    gameState.gains = _.map( gameState.percentage, function(percent){
      return (totalPot * ( percent / 100 )).toPrecision(2) || null;
    });

    console.log('gains', gameState.gains)

  }

  function addBid( index, user ){
    console.log( ' Bid on ', gameState.block[index].name, ' by ', user.name);
    gameState.bids.push({ index: index, user: user, time: new Date() });
    calculateBids();
    calculatePersonal(user);
    console.log('p:', gameState)
    return gameState;
  }
});