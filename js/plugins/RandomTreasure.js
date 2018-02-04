/*---------------------------------------------------------------------------*
 * 2017/12/08 kido0617
 * http://kido0617.github.io/
 * License MIT
 * Ver.1.1
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ランダム宝箱プラグイン
 * @author kido0617
 * 
 * 
 * @help
 *   ランダムにアイテムを入手できる宝箱を実装するプラグインです。
 *   使い方は下記webページを参照
 *   http://kido0617.github.io/rpgmaker/2017-04-17-random-treasure/
 *
 */

(function(){

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'RandomTreasure') {
      switch (args[0]) {
      case 'reset':
        $gameTemp.randomTreasureReset = true;
        break;
      case 'get':
        getRandom.call(this);
        break;
      }
    }
  };

  function getRandom(){
    if(!$gameSystem.randomTreasures || !$gameSystem.randomTreasures.length){
      $gameSystem.lastRandomTreasure = null;
      return null;
    }
    var sum = 0;
    $gameSystem.randomTreasures.forEach(function(treasure){
      sum += treasure.rate;
    });
    var rand = Math.randomInt(sum);
    var item, id, type;
    sum = 0;
    for(var i = 0; i < $gameSystem.randomTreasures.length; i++){
      sum += $gameSystem.randomTreasures[i].rate;
      if(rand < sum){
        id = $gameSystem.randomTreasures[i].id;
        type = $gameSystem.randomTreasures[i].type;
        item = getItem(type, id);
        break;
      }
    }
    this._params = [id, 0, 0, 1, false];
    if(type == 0){
      this.command126();
    }else if(type == 1){
      this.command127();
    }else{
      this.command128();
    }
    $gameSystem.lastRandomTreasure = item;
  }

  function getItem(type, id){
    var item;
    switch (type) {
    case 0:
      item = $dataItems[id];
      break;
    case 1:
      item = $dataWeapons[id];
      break;
    case 2:
      item = $dataArmors[id];
      break;
    }
    return item;
  }

  // Shop Processing
  var _command302 = Game_Interpreter.prototype.command302;
  Game_Interpreter.prototype.command302 = function() {
    if($gameTemp.randomTreasureReset){
      $gameTemp.randomTreasureReset = false;
      var goodsList = [this._params];
      while (this.nextEventCode() === 605) {
        this._index++;
        goodsList.push(this.currentCommand().parameters);
      }
      data = [];
      goodsList.forEach(function(goods) {
        var item = getItem(goods[0], goods[1]);
        data.push({
          type: goods[0],
          id: goods[1],
          rate: goods[2] === 0 ? item.price : goods[3]
        });
      }, this);
      $gameSystem.randomTreasures = data;
      return true;
    }
    return _command302.call(this);
  };

})();