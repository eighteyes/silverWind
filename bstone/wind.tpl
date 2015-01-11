<div>
  <div class="dashboard"> {{ user.name }}, your stake: {{ state.stake }} </div>
  <div class="countdown"> {{ game.timeLeft }} </div>

  <div class="board" ng-repeat="company in state.block">

    <button class="bidBtn" ng-click="addBid($index)" ng-class="{
    loser : (state.loserIndex == $index),
    winner: ( state.winnerIndex == $index )
    }">
      <p class="name">{{ company.name }}</p>
      <p class="personal">{{ state.personal[$index] }}
      <span ng-show="(state.loserIndex == $index)" class="gain">( + {{ state.gains[$index] }} ) </span></p>
      <p ng-show="state.percentage[$index]" class="percentage">{{ state.percentage[$index] + "%"}}</p>
      <p class="total"> {{ state.total[$index] }}</p>
    </button>
  </div>

  <div class="playerList">
  <div class="player" ng-click="switchUser(player)" ng-repeat="player in players"> {{ player.name }} </div>
  </div>

  <form class="addUser">
    <input ng-model="newUser.name"><span><button ng-click="addUser()">+</button>
    <button ng-click="resetGame()">Reset</button>
    <button ng-click="startGame()">Start</button>
    <button ng-click="endGame()">end</button>
  </form>

  <div class="debug" ng-repeat="bid in game.bids">
    {{ bid.index }} - {{ bid.user.name }}
  </div>

</div>
