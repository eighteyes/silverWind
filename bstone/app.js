Players = new Mongo.Collection("players");
Games = new Mongo.Collection("games");

// AMGULAR
if (Meteor.isClient) {
  var app = angular.module('silverWind', ['angular-meteor']);

  app.controller('gameController', ['$scope', '$meteorObject', '$meteorCollection', 'GameService',
    'PlayerService',
    function($scope, $meteorObject, $meteorCollection, GameService, PlayerService) {
      var meteor = $meteorCollection;

      $scope.user = {
        name: 'default'
      };

      $scope.games = $meteorCollection(Games)
      $scope.game = $meteorObject(Games, $scope.games[0].id);

      function initGame(){
        $scope.state = GameService.initGame($scope.game, $scope.user);
      }
      initGame();
      rebuildState();

      function rebuildState(){
        $scope.state = GameService.buildGameState($scope.state);
      }


      console.log( 'GAME', $scope.state );


      $scope.addBid = function(index) {
        $scope.state = GameService.addBid($scope.state, index);
        rebuildState();
        console.log( 'Updated Game', $scope.state );
      }
      $scope.switchUser = function(user) {
        $scope.user = user;
        initGame();
        rebuildState();
      }

      $scope.addUser = function() {
        PlayerService.add($scope.newUser);
        $scope.user = $scope.newUser;
        $scope.newUser = {};
        initGame();
        rebuildState();
      }

      $scope.newUser = {};

      $scope.players = PlayerService.players;
      $scope.userList = [_.clone($scope.user), {
        name: 'user'
      }];
    }
  ]);


  app.factory('GameService', ['$q', '$meteorCollection', 'PlayerService',
    function($q, $meteorCollection, PlayerService) {

      var games = $meteorCollection(Games);

      return {
        add: function(p) {
          games.save(p);
        },
        getGame: function(id) {
          //return games[0];
        },
        buildGameState: function(game) {
          return calculateGame(game);
        },
        initGame: initGame,
        addBid: addBid
      }


      function initGame(game, user){
        return _.merge(game, {
          total: [0,0,0],
          //individual records
          personal: [0,0,0],
          //individual percentage
          percentage: [],
          //individual gains
          gains: [],
          loserIndex: null,
          winnerIndex: null,
          activeUser : user,
          stake : 0,
          pot : 0
        });
      };

      function calculateGame(game) {
        var gameState = game;
        var user = game.activeUser;

        var bidFactor = 1;
        // bids
        gameState.total = _.reduce(gameState.bids, function(result, bid) {
          gameState.pot += bidFactor;
          result[bid.index] += bidFactor;
          if ( bid.user.name === user.name ){
            gameState.stake += bidFactor;
          }
          return result;
        }, [0, 0, 0])

        console.log('total', gameState.total, 'pot', gameState.pot);

        var biggestValue = _.clone(gameState.total).sort(function(a, b) {
          //stupid fuckign javascript
          return a > b
        }).pop();

        var smallestValue = _.clone(gameState.total).sort(function(a, b) {
          //stupid fuckign javascript
          return a < b
        }).pop();

        console.log('biggie', biggestValue, 'smalls', smallestValue);

        if (gameState.total.indexOf(biggestValue) === gameState.total.lastIndexOf(biggestValue)) {
          // there can be only one
          gameState.loserIndex = gameState.total.indexOf(biggestValue);
          console.log('loser', gameState.loserIndex);
        } else {
          gameState.loserIndex = null;
        }

        if (gameState.total.indexOf(smallestValue) === gameState.total.lastIndexOf(smallestValue)) {
          // there can be only one
          gameState.winnerIndex = gameState.total.indexOf(smallestValue);
          console.log('winner', gameState.winnerIndex);
        } else {
          gameState.winnerIndex = null;
        }

        //personal

        gameState.personal = _.reduce(gameState.bids, function(result, bid) {
          if (bid.user.name === user.name) {
            result[bid.index] += bidFactor;
          }
          return result;
        }, [0, 0, 0]);

        console.log('personal', gameState.personal)

        gameState.percentage = _.map(gameState.personal, function(thisStake, i) {
          return Math.round(thisStake / gameState.total[i] * 100);
        });

        console.log('percentage', gameState.percentage)

        // compute gains
        // find totals
        var totals = _.clone(gameState.total);

        // remove smallest
        var winnerTotal = totals.sort().shift();

        // add remainder
        var totalPot = _.reduce(totals, function(result, num) {
          return result + num;
        });

        // figure out distribution via percentage
        gameState.gains = _.map(gameState.percentage, function(percent) {
          return (totalPot * (percent / 100)).toPrecision(2) || null;
        });

        // attach user
        gameState.activePlayer = user;

        console.log('Built Game', gameState);

        return gameState;

      }

      function addBid(game, index) {
        console.log(' Bid on ', game.block[index].name, ' by ', game.activePlayer.name);
        game.bids.push({
          index: index,
          user: game.activePlayer,
          time: new Date()
        });
        return game;
      }
    }
  ]);

  app.factory('PlayerService', ['$q', '$meteorCollection', function($q, $meteorCollection) {
    var players = $meteorCollection(Players);
    return {
      players: players,
      add: function(p) {
        var players = $meteorCollection(Players);
        players.save(p);
      }
    }
  }]);

  app.filter('total', function() {
    return function(array) {
      return _.reduce(array, function(result, item) {
        return result + parseFloat(item);
      }, 0);
    }
  });
}
// End client

