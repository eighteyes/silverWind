Players = new Mongo.Collection("players");
Games = new Mongo.Collection("games");

/*
// AMGULAR
if (Meteor.isClient) {
  var app = angular.module('silverWind', ['angular-meteor', 'ui-router']);

  app.controller('gameController', ['$scope', '$meteorCollection', 'GameService',
    'PlayerService',
    function($scope, $meteorCollection, GameService, PlayerService) {
      var meteor = $meteorCollection;

      $scope.game = GameService.getGame(1);
      $scope.state = GameService.getGameState($scope.game);

      $scope.user = {
        name: 'poopy'
      }

      $scope.state = GameService;


      $scope.addBid = function(index) {
        GameService.addBid(index, $scope.user);
      }
      $scope.switchUser = function(user) {
        $scope.user = user;
        $scope.state =
          GameService.calculatePersonal(user);
      }

      $scope.addUser = function(user) {
        PlayerService.add(user);
        $scope.user = user;
      }

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
        getGameState: function(game, user) {
          //return calculateGame(game, user);
        },
        addBid: addBid
      }


      function calculateGame(game, user) {
        var gameState = _.merge(game, {
          total: [],
          //individual records
          personal: [],
          //individual percentage
          percentage: [],
          //individual gains
          gains: [],
          loserIndex: null,
          winnerIndex: null
        });

        // bids
        gameState.total = _.reduce(gameState.bids, function(result, bid) {
          result[bid.index] += bidFactor;
          return result;
        }, [0, 0, 0])

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
        gameState.percentage = _.map(gameState.personal, function(stake, i) {
          return Math.round(stake / gameState.total[i] * 100);
        });


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

        return gameState;

      }

      function addBid(game, user, index) {
        console.log(' Bid on ', gameState.block[index].name, ' by ', user.name);
        gameState.bids.push({
          index: index,
          user: user,
          time: new Date()
        });
        calculateBids();
        calculatePersonal(user);
        console.log('p:', gameState)
        return gameState;
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

*/