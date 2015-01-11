Players = new Mongo.Collection("players");
Games = new Mongo.Collection("games");

// AMGULAR
if (Meteor.isClient) {

  //angular chart
  // !function(){"use strict";function t(t){return{restrict:"CA",scope:{data:"=",labels:"=",options:"=",series:"=",colours:"=",chartType:"=",legend:"@",click:"="},link:function(e,n){var a,g=document.createElement("div");g.className="chart-container",n.replaceWith(g),g.appendChild(n[0]),"object"==typeof G_vmlCanvasManager&&null!==G_vmlCanvasManager&&"function"==typeof G_vmlCanvasManager.initElement&&G_vmlCanvasManager.initElement(n[0]),e.$watch("data",function(g,f){if(g&&g.length&&(!i(t)||g[0].length)){var c=t||e.chartType;if(c){if(a){if(o(c,g,f))return l(a,c,g,e);a.destroy()}a=r(c,e,n)}}},!0),e.$watch("chartType",function(t){t&&(a&&a.destroy(),a=r(t,e,n))})}}}function o(t,o,r){return o&&r&&o.length&&r.length?i(t)?o.length===r.length&&o[0].length===r[0].length:o.length===r.length:!1}function r(t,o,r){var l=r[0],n=l.getContext("2d"),g=i(t)?a(o.labels,o.data,o.series||[],o.colours):f(o.labels,o.data,o.colours),c=new Chart(n)[t](g,o.options||{});return o.click&&(l.onclick=function(r){if(c.getPointsAtEvent||c.getSegmentsAtEvent){var e=i(t)?c.getPointsAtEvent(r):c.getSegmentsAtEvent(r);o.click(e,r)}}),o.legend&&e(r,c),c}function e(t,o){var r=t.parent(),e=r.find("chart-legend"),l="<chart-legend>"+o.generateLegend()+"</chart-legend>";e.length?e.replaceWith(l):r.append(l)}function l(t,o,r,e){i(o)?t.datasets.forEach(function(t,o){e.colours&&n(t,e.colours[o]),(t.points||t.bars).forEach(function(t,e){t.value=r[o][e]})}):t.segments.forEach(function(t,o){t.value=r[o],e.colours&&n(t,e.colours[o])}),t.update()}function n(t,o){t.fillColor=o.fillColor,t.highlightColor=o.highlightColor,t.strokeColor=o.strokeColor,t.pointColor=o.pointColor,t.pointStrokeColor=o.pointStrokeColor}function i(t){return["Line","Bar","Radar"].indexOf(t)>-1}function a(t,o,r,e){return e=e||Chart.defaults.global.colours,{labels:t,datasets:o.map(function(t,o){var l=g(e[o]);return l.label=r[o],l.data=t,l})}}function g(t){var o={};for(var r in t)t.hasOwnProperty(r)&&(o[r]=t[r]);return o}function f(t,o,r){return r=r||Chart.defaults.global.colours,t.map(function(t,e){return{label:t,value:o[e],color:r[e].strokeColor,highlight:r[e].pointHighlightStroke}})}Chart.defaults.global.responsive=!0,Chart.defaults.global.multiTooltipTemplate="<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",Chart.defaults.global.colours=[{fillColor:"rgba(151,187,205,0.2)",strokeColor:"rgba(151,187,205,1)",pointColor:"rgba(151,187,205,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(151,187,205,0.8)"},{fillColor:"rgba(220,220,220,0.2)",strokeColor:"rgba(220,220,220,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(220,220,220,0.8)"},{fillColor:"rgba(247,70,74,0.2)",strokeColor:"rgba(247,70,74,1)",pointColor:"rgba(247,70,74,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(247,70,74,0.8)"},{fillColor:"rgba(70,191,189,0.2)",strokeColor:"rgba(70,191,189,1)",pointColor:"rgba(70,191,189,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(70,191,189,0.8)"},{fillColor:"rgba(253,180,92,0.2)",strokeColor:"rgba(253,180,92,1)",pointColor:"rgba(253,180,92,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(253,180,92,0.8)"},{fillColor:"rgba(148,159,177,0.2)",strokeColor:"rgba(148,159,177,1)",pointColor:"rgba(148,159,177,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(148,159,177,0.8)"},{fillColor:"rgba(77,83,96,0.2)",strokeColor:"rgba(77,83,96,1)",pointColor:"rgba(77,83,96,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(77,83,96,1)"}],angular.module("chart.js",[]).directive("chartBase",function(){return t()}).directive("chartLine",function(){return t("Line")}).directive("chartBar",function(){return t("Bar")}).directive("chartRadar",function(){return t("Radar")}).directive("chartDoughnut",function(){return t("Doughnut")}).directive("chartPie",function(){return t("Pie")}).directive("chartPolarArea",function(){return t("PolarArea")})}();
//# sourceMappingURL=angular-chart.js.map
//
//
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

       $urlRouterProvider.otherwise("/game");
  }]);

  app.controller('gameController', ['$scope', '$meteorCollection', 'GameService',
    'PlayerService','$interval',
    function($scope, $meteorCollection, GameService, PlayerService, $interval) {
      var meteor = $meteorCollection;

      $scope.user = {
        name: 'default'
      };

      $scope.admin = true;
      $scope.disable = false;

      $scope.games = $meteorCollection(Games);

      $scope.game = {};

      // $scope.games = $meteorCollection(function() {
      //   return Games.find({}, {
      //     game: $scope.getReactivly('game') // Every time $scope.bids will change,
      //       // the reactive function will re-run again
      //   });
      // });

      $scope.random = Math.random()

      $scope.startGame = function startGame() {
        $scope.game.started = true;
        $interval.cancel( $scope.ticker );
        $scope.ticker = $interval( function tick(){
          $scope.game.timeLeft--;
          if ( $scope.game.timeLeft <= 0 ){
            $scope.endGame();
          }
        }, 1000)
      }

      $scope.endGame = function() {
        $interval.cancel( $scope.ticker );
        $scope.disable = true;
        $scope.game.finished = true;
        // TODO calculate results
      }

      $scope.game.started = false;
      $scope.game.finished = false;

      $scope.resetGame = function(){
        $scope.games.remove();
        $scope.games.save({
          block: [
           { name: "Bobs Orphan Exploitation", info:"Bobs is the guy to know when you need child workers.", link: '#'},
           { name: "Grift & Sons Communication", info:"Charging you money for things you already paid for.", link: '#'},
           { name: "Urban Noise Guild", info:"Ensuring nobody gets a full night of sleep.", link: '#'}
          ],
          bids: [],
          timeLeft: 15
        });

        initGame();
        rebuildState();
      }

      initGame();
      rebuildState();

      function initGame(){
        $scope.game = $scope.games[0];
        console.log('Init Called', $scope.game);
        buildStateFromGame();
      }

      $scope.emptyUsers = function(){
        PlayerService.players.remove();
      }

      function buildStateFromGame(){
        $scope.state = GameService.initGame( $scope.game, $scope.user);
        $scope.state = GameService.buildGameState($scope.state, $scope.user);
      }


      function rebuildState(){
        $scope.state = GameService.buildGameState($scope.state, $scope.user);
        // console.log('rebuild state', $scope.state)
      }

      $scope.$watchCollection('game', function(){
        console.log('game changed', $scope.game);
        buildStateFromGame();
        rebuildState();
      })

      function updateGame(){
        $scope.game.bids = $scope.state.bids;
        // console.log( 'Updated Game', $scope.game );
      }



      $scope.addBid = function(index) {
        if ( $scope.game.started && !$scope.game.finished ){
          $scope.state = GameService.addBid($scope.state, index);
          $scope.game.timeLeft = 14;
          rebuildState();
          updateGame();
        }
      }

      $scope.switchUser = function(user) {
        // console.log('switching', user);
        $scope.user = user;
        buildStateFromGame();
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
        // console.log('game in', game)
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
        // console.log('State In', state);
        var gameState = state;

        var bidFactor = 1;

        gameState.stake = 0;
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

