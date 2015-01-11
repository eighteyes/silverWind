<div ng-hide="user.name">
Are you a Player or a Company?

<h2>Player</h2>
<input placeholder="handle" ng-model="user.name">
<input placeholder="wallet" ng-model="user.wallet">
<button ng-click="addUser()">Join Game</button>

</div>

<div ng-show="user.name">
  <div class="dashboard"> {{ user.name }}, your stake: {{ state.stake }} </div>
  <div class="countdown"> {{ game.timeLeft }} </div>

  <div class="board" >


    <button class="bidBtn animated" ng-repeat="company in state.block" ng-click="addBid($index)" ng-class="{
    loser : (state.loserIndex == $index),
    winner: ( state.winnerIndex == $index ),
    done: ( game.timeLeft <= 5 ),
    pulse: ( game.timeLeft % 6 == 0 ),
    disabled: ( game.finished )
    }">

      <p class="name">{{ company.name }}</p>
      <p class="personal">{{ state.personal[$index] }}
      <span ng-show="(state.loserIndex == $index) && (state.gains[$index] > 0)" class="gain">( + {{ state.gains[$index] }} ) </span></p>
      <p ng-show="state.percentage[$index]" class="percentage">{{ state.percentage[$index] + "%"}}</p>
      <p class="total"> {{ state.total[$index] }}</p>
    </button>

    <div class="results" ng-show="game.finished && state.gains[state.loserIndex] > 0"> Congrats. You spent {{ state.stake }}
    and earned {{ state.gains[state.loserIndex] }}! </div>

  </div>

  <div class="playerList">
  <div class="player" ng-click="switchUser(player)" ng-repeat="player in players"> {{ player.name }} </div>
  </div>

  <form class="addUser">
    <div ng-show="login">
    <input ng-model="newUser.name"><span><button ng-click="addUser()">+</button></span>
    </div>
    <div ng-show="admin">
    <button ng-click="resetGame()">Reset</button>
    <button ng-click="startGame()">Start</button>
    <button ng-click="endGame()">end</button>
    <button ng-click="emptyUsers()">x all users</button>
    </div>
  </form>

  <div class="debug" ng-hide="true" ng-repeat="bid in game.bids">
    {{ bid.index }} - {{ bid.user.name }}
  </div>

</div>
