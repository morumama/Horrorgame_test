//=============================================================================
// keyRepeatOption.js
//=============================================================================
//Copyright (c) 2016 Trb
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
//twitter https://twitter.com/Trb_surasura
/*:
 * @plugindesc 自動連打機能の設定変更プラグイン
 * @author Trb
 * @version 1.00 2016/5/7 初版
 * 
 * @help ボタンを長押しした時の自動連打機能(keyRepeat)の設定を変更するプラグインです。
 * 
 * 
 * ・できること
 * 
 * パラメータ keyRepeatWait で、連打状態になるまでの時間を変更できます。
 * パラメータ keyRepeatInterval で、連打状態時の連打間隔を変更できます。
 * 
 * この2つのどちらかを0にすると、連打機能自体が完全になくなります。
 * 
 * 
 * パラメータ useOption で、オプションメニューの項目に自動連打機能を追加できます。
 * (上のパラメータで連打機能を無くしている場合はこちらの設定は無効になります)
 * パラメータ commandName で、オプションに表示させる項目名を設定できます。
 * 
 * @param keyRepeatWait
 * @desc 自動連打状態になるまでの時間(フレーム数)
 * @default 24
 * 
 * @param keyRepeatInterval
 * @desc 自動連打時の連打間隔(フレーム数)
 * @default 6
 * 
 * @param ========================
 * @desc 
 * @default 
 * 
 * 
 * @param useOption
 * @desc オプションにオンオフ設定を追加するか
 * 1･･･追加する　0･･･追加しない
 * @default 1
 * 
 * @param commandName
 * @desc オプションに追加する時のコマンド名
 * @default 自動連打
 * 
 */



(function () {

//パラメータの読み込み	
	var parameter = PluginManager.parameters('keyRepeatOption');
	var keyRepeatName =String(parameter['commandName']);
    var wait = Number(parameter['keyRepeatWait']);
    var interval = Number(parameter['keyRepeatInterval']);
    var option = Number(parameter['useOption']);


//オプションメニューに自動連打の項目を追加する
    var WO_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        WO_addGeneralOptions.call(this);
        if(option == 1 && wait > 0 && interval > 0)this.addCommand(keyRepeatName, 'keyRepeat');
    };
    
    

//オプションのセーブデータに自動連打を追加する    
    ConfigManager.keyRepeat = true;

    ConfigManager.makeData = function() {
        var config = {};
        config.alwaysDash = this.alwaysDash;
        config.commandRemember = this.commandRemember;
        config.bgmVolume = this.bgmVolume;
        config.bgsVolume = this.bgsVolume;
        config.meVolume = this.meVolume;
        config.seVolume = this.seVolume;
        config.keyRepeat = this.keyRepeat;
        return config;
    };

    ConfigManager.applyData = function(config) {
        this.alwaysDash = this.readFlag(config, 'alwaysDash');
        this.commandRemember = this.readFlag(config, 'commandRemember');
        this.bgmVolume = this.readVolume(config, 'bgmVolume');
        this.bgsVolume = this.readVolume(config, 'bgsVolume');
        this.meVolume = this.readVolume(config, 'meVolume');
        this.seVolume = this.readVolume(config, 'seVolume');
        this.keyRepeat = this.readFlag(config, 'keyRepeat');
    };




//連打状態になるまでのフレーム数と連打間隔を変更する
    Input.keyRepeatWait = wait;
    Input.keyRepeatInterval = interval;

//連打機能のオンオフ判定を追加する
    Input.isRepeated = function(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isRepeated('escape')) {
            return true;
        } else {
            return (this._latestButton === keyName &&
                    (this._pressedTime === 0 ||
                    (this._pressedTime >= this.keyRepeatWait &&
                    this._pressedTime % this.keyRepeatInterval === 0 &&
                    ConfigManager.keyRepeat  == true &&
                    this.keyRepeatWait > 0)));
        }
    };



})();