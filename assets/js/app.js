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
    $scope.userList.push( $scope.user );
  }

  $scope.userList = [ _.clone($scope.user), { name: 'user'} ];



});

app.filter('total', function(array){
  return _.reduce(array, function(result, item){
    return result + item;
  })
});

var bidFactor = 1;

app.factory('gameService', function(){
  var company1 = { name: 'Poopy1' };
  var company2 = { name: 'Poopy2' };
  var company3 = { name: 'Poopy3' };

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
    gains: []
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
      console.log( gameState.total[i], stake)
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
    gameState.gains = _.map( gameState.percentage, function(percent, i){
      return totalPot * ( percent / 100 );
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