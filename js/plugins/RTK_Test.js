//=============================================================================
// RTK_Test.js	2016/07/02
//=============================================================================

/*:
 * @plugindesc Test
 * @author Toshio Yamashita (yamachan)
 *
 * @help This plugin does not provide plugin commands.
 */

(function(_global) {
	var N = 'RTK_Test';

	var param = PluginManager.parameters(N);

	var _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
	Game_Event.prototype.updateSelfMovement = function() {
		_Game_Event_updateSelfMovement.call(this);
		var d = Number(this.event().meta.sight||"0");
		if (d == 0) { return; }
		switch (this._directionFix ? this._originalDirection : this._direction) {
		case 2: // down
			if (this.x == $gamePlayer.x && this.y < $gamePlayer.y && $gamePlayer.y - this.y < d) {
				$gameSelfSwitches.setValue([this._mapId, this._eventId, "A"], true);
			}
			break;
		case 4: // left
			if (this.y == $gamePlayer.y && $gamePlayer.x < this.x && this.x - $gamePlayer.x  < d) {
				$gameSelfSwitches.setValue([this._mapId, this._eventId, "A"], true);
			}
			break;
		case 6: // right
			if (this.y == $gamePlayer.y && this.x < $gamePlayer.x && $gamePlayer.x - this.x < d) {
				$gameSelfSwitches.setValue([this._mapId, this._eventId, "A"], true);
			}
			break;
		case 8: // up
			if (this.x == $gamePlayer.x && this.y > $gamePlayer.y && this.y - $gamePlayer.y < d) {
				$gameSelfSwitches.setValue([this._mapId, this._eventId, "A"], true);
			}
			break;
		};
	};

})(this);
