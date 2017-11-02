//=============================================================================
// Picture_window_riru.js
//=============================================================================
/*:
 * @plugindesc メッセージウィンドウ表示時、消去時にコモンイベントを起動させて自動ピクチャウィンドウを可能にします
 * @author riru
 *
 * @param PWnodisplaySwitch
 * @desc ピクチャウィンドウコモンを起動させないときのスイッチID（ピクチャをそのままにするときなど）
 * @default 0
 *
 * @param OpenCommon
 * @desc メッセージウィンドウ表示時の起動コモンID
 * @default 0
 *
 * @param CloseCommon
 * @desc メッセージウィンドウ消去時の起動コモンID
 * @default 0
 *
 *
 * @help 
 *＜使い方＞
 *・各パラメータに表示用と消去用のイベントを組んだコモンイベントID、それらを起動させないときのスイッチIDを記入する
 *・このプラグインでは文章の表示が連続して通常ウィンドウが開きっぱなしのところも1回1回閉じ開きします。
 *通常ウィンドウと同じ動きをさせたい場合、前の文章の表示の中に「\SWON[PWnodisplaySwitchで指定した番号]」（「」は必要なし）と記入し、
 *ウィンドウが閉じる文章の中に「\SWOFF[PWnodisplaySwitchで指定した番号]」（「」は必要なし）と記入します。
 *例）文章の表示
 *なんたらかんたら\SWON[1]
 *　　文章の表示
 *なんたらかんたら\SWOFF[1]
 *※Ver1.01以前現在バトルイベント内では機能しません。この場合は個別にコモンイベントを挟む等の処置をとっていただきますようお願いいたします。
 *
 * ＜規約＞
 * 有償無償問わず使用できます。改変もご自由にどうぞ。使用報告もいりません。２次配布は作成者を偽らなければOKです（ただし素材単品を有償でやりとりするのはNG）。
 *著作権は放棄していません。使用する場合は以下の作者とURLをreadmeなどどこかに記載してください
 *
 * ＜作者情報＞
 *作者：riru 
 *HP：ガラス細工の夢幻
 *URL：http://garasuzaikunomugen.web.fc2.com/index.html
 *
 * ＜更新情報＞
 *2016/3/4　Ver1.10。イベントの一時消去がある自動実行イベント等特定の状況下で文章の表示以降のコマンドが起動しない不具合を修正。PWnodisplaySwitch項目追加。
 *2015/12/31　Ver1.01。バトルイベント内でウィンドウ消去時にウィンドウ表示用のコモンイベントが起動する不具合を修正。
 */

(function() {
    var parameters = PluginManager.parameters('Picture_window_riru');
    var pw_nodisplay_sw = Number(parameters['PWnodisplaySwitch'] || 0);
    var open_common = Number(parameters['OpenCommon'] || 0);
    var close_common = Number(parameters['CloseCommon'] || 0);
    
Riru_picturewindow_Window_Message_startMessage =
		Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {

    //riruメッセコモン挿入
        var commonEvent = $dataCommonEvents[open_common];
   　if (commonEvent) {
        var eventId = $gameMap._interpreter.isOnCurrentMap() ? $gameMap._interpreter._eventId : 0;
        if (!$gameParty.inBattle()&&!$gameSwitches.value(pw_nodisplay_sw))  $gameMap._interpreter.setuppwChild(commonEvent.list, eventId);
   　 }
		Riru_picturewindow_Window_Message_startMessage.call(this);
};

Riru_picturewindow_Window_Message_terminateMessage =
		Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
//riruウィンドウ閉じコモン挿入
  var commonEvent = $dataCommonEvents[close_common];
    if (commonEvent) {
  　   var eventId = $gameMap._interpreter.isOnCurrentMap() ? $gameMap._interpreter._eventId : 0;
       if (!$gameParty.inBattle()&&!$gameSwitches.value(pw_nodisplay_sw))  $gameMap._interpreter.setuppw2Child(commonEvent.list, eventId);
    }
  Riru_picturewindow_Window_Message_terminateMessage.call(this);
};
//pw_Child_Child作成と更新
Game_Interpreter.prototype.setuppwChild = function(list, eventId) {
    this._pw_child_childInterpreter = new Game_Interpreter(this._depth + 2);
    this._pw_child_childInterpreter.setup(list, eventId);
};
Game_Interpreter.prototype.updatepw_Child_Child = function() {
    if (this._pw_child_childInterpreter) {
        this._pw_child_childInterpreter.update();
        if (this._pw_child_childInterpreter.isRunning()) {
            return true;
        } else {
            this._pw_child_childInterpreter = null;
        }
    }
    return false;
};
//pw2_Child_Child作成と更新
Game_Interpreter.prototype.setuppw2Child = function(list, eventId) {
    this._pw2_child_childInterpreter = new Game_Interpreter(this._depth + 3);
    this._pw2_child_childInterpreter.setup(list, eventId);
};

Game_Interpreter.prototype.updatepw2_Child_Child = function() {
    if (this._pw2_child_childInterpreter) {
        this._pw2_child_childInterpreter.update();
        if (this._pw2_child_childInterpreter.isRunning()) {
            return true;
        } else {
            this._pw2_child_childInterpreter = null;
        }
    }
    return false;
};
var Riru_picturewindow_Game_Interpreter_clear = Game_Interpreter.prototype.clear;
Game_Interpreter.prototype.clear = function() {
	Riru_picturewindow_Game_Interpreter_clear.call(this);
    this._pw_child_childInterpreter = null;
    this._pw2_child_childInterpreter = null;
};

//フレーム更新（再定義）
Game_Interpreter.prototype.update = function() {
    while (this.isRunning()) {
    if (this.updatepw_Child_Child() ) {//新規
            break;
        }
    if (this.updatepw2_Child_Child() ) {//新規
            break;
        }
        if (this.updateChild() || this.updateWait()) {//変更（this.updateChild() || this.updateWait()）
            break;
        }
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) {
            break;
        }
    }
};
//制御文字でスイッチ
riru_Window_Message_processEscapeCharacter =
		Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'SWON':
        $gameSwitches.setValue(this.obtainEscapeParam(textState), true);
      break;
    case 'SWOFF':
        $gameSwitches.setValue(this.obtainEscapeParam(textState), false);
      break;
    default:
      riru_Window_Message_processEscapeCharacter.call(this,
				code, textState);
      break;
    }
};
})();

