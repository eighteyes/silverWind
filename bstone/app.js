Players = new Mongo.Collection("players");
Games = new Mongo.Collection("games");

// AMGULAR
if (Meteor.isClient) {
  console.log('hi from meteor');
  var app = angular.module('silverWind', ['angular-meteor','ui.router']);

  app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('board', {
        url: '/game',
        templateUrl: 'wind.tpl',
        controller: 'gameController'
      });
  }]);

  app.controller('gameController', ['$scope', '$meteorCollection', 'GameService',
    'PlayerService','$interval',
    function($scope, $meteorCollection, GameService, PlayerService, $interval) {
      var meteor = $meteorCollection;

      $scope.user = {
        name: 'default'
      };

      $scope.disable = false;

      // $scope.games = $meteorCollection(Games);

      $scope.game = {};

      $scope.games = $meteorCollection(function() {
        return Games.find({}, {
          game: $scope.getReactivly('game') // Every time $scope.bids will change,
            // the reactive function will re-run again
        });
      });

      $scope.random = Math.random()

      $scope.startGame = function startGame() {
        $interval.cancel( $scope.ticker );
        $scope.ticker = $interval( function tick(){
          console.log( 'tick')
          $scope.game.timeLeft--;
          if ( $scope.game.timeLeft <= 0 ){
            $scope.endGame();
          }
        }, 1000)
      }

      $scope.endGame = function() {
        $interval.cancel( $scope.ticker );
        $scope.disable = true;
        // TODO calculate results
      }


      $scope.resetGame = function(){
        $scope.games.remove();
        $scope.games.save({
          block: [
           { name: "Monsanto"},
           { name: "ComCast"},
           { name: "Microsoft"}
          ],
          bids: [],
          timeLeft: 60
        });

        initGame();
        rebuildState();
      }

      initGame();
      rebuildState();

      function initGame(){
        $scope.game = $scope.games[0];
        $scope.state = GameService.initGame( $scope.game, $scope.user);
      }


      function rebuildState(){
        $scope.state = GameService.buildGameState($scope.state, $scope.user);
        updateGame();
      }

      function updateGame(){
        $scope.game.bids = $scope.state.bids;
        console.log( 'Updated Game', $scope.game );
      }



      $scope.addBid = function(index) {
        $scope.state = GameService.addBid($scope.state, index);
        rebuildState();
      }

      $scope.switchUser = function(user) {
        console.log('switching', user);
        $scope.user = user;
        rebuildState();
      }

      $scope.addUser = function() {
        PlayerService.add($scope.newUser);
        $scope.user = $scope.newUser;
        $scope.newUser = {};
        initGame();
        rebuildState();
      }

      $scope.newUser = { };

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
        buildGameState: calculateGame,
        initGame: initGame,
        addBid: addBid
      }


      function initGame(game, user){
        console.log('game in', game)
        return {
          bids: game.bids,
          block: game.block,
          total: [0,0,0],
          //individual records
          personal: [0,0,0],
          //individual percentage
          percentage: [],
          //individual gains
          gains: [],
          loserIndex: null,
          winnerIndex: null,
          stake : 0,
          pot : 0
        };
      };

      function calculateGame(state, user) {
        console.log('State In', state);
        var gameState = state;

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

        // console.log('total', gameState.total, 'pot', gameState.pot);

        var biggestValue = _.clone(gameState.total).sort(function(a, b) {
          //stupid fuckign javascript
          return a > b
        }).pop();

        var smallestValue = _.clone(gameState.total).sort(function(a, b) {
          //stupid fuckign javascript
          return a < b
        }).pop();

        // console.log('biggie', biggestValue, 'smalls', smallestValue);

        if (gameState.total.indexOf(biggestValue) === gameState.total.lastIndexOf(biggestValue)) {
          // there can be only one
          gameState.loserIndex = gameState.total.indexOf(biggestValue);
          // console.log('loser', gameState.loserIndex);
        } else {
          gameState.loserIndex = null;
        }

        if (gameState.total.indexOf(smallestValue) === gameState.total.lastIndexOf(smallestValue)) {
          // there can be only one
          gameState.winnerIndex = gameState.total.indexOf(smallestValue);
          // console.log('winner', gameState.winnerIndex);
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

        // console.log('personal', gameState.personal)

        gameState.percentage = _.map(gameState.personal, function(thisStake, i) {
          return Math.round(thisStake / gameState.total[i] * 100);
        });

        // console.log('percentage', gameState.percentage)

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

        // console.log('Built Game', gameState);

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

