//=============================================================================
// Vitsuno_MessageLayout.js
//=============================================================================
// [更新情報]
// Ver 1.80 : メッセージを高速で開く機能を追加。
//          : 顔グラフィックの位置が保存されない問題を修正。
// Ver 1.70 : バトルメッセージ背景の変更機能を追加。
// Ver 1.60 : 選択肢ウィンドウの位置を調整。
// Ver 1.50 : 顔グラフィック用の画像表示を追加。
// Ver 1.01 : 顔グラフィックと名前のちらつきを解消。
// Ver 1.00 : プラグインの完成。
//-----------------------------------------------------------------------------
// Copyright (c) 2017 Tsuno Ozumi
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------
// Site : https://vitsuno.net/
//=============================================================================

/*:
 * @plugindesc 画像式メッセージレイアウトに変更するプラグインです。
 * @author 尾角 つの (Tsuno Ozumi)
 *
 * 
 * @param (Basic Settings)
 *
 * @param Face X
 * @desc 顔グラフィックのX座標
 * @default 96
 *
 * @param Face Y
 * @desc 顔グラフィックのY座標
 * @default 256
 *
 * @param System Background
 * @desc
 * バトル中のシステムメッセージの背景タイプ
 * 0:通常 1:暗くする 2:透明
 * @default 1
 *
 * @param
 *
 * @param (Advanced Settings)
 *
 * @param Fast Message Open
 * @desc メッセージウィンドウを高速で開く (true/false)
 * @default true
 *
 * @param Message Width
 * @desc メッセージの幅 (背景画像の幅)
 * @default 580
 *
 * @param Message Height
 * @desc メッセージの高さ (背景画像の高さ)
 * @default 180
 *
 * @param Message Line
 * @desc メッセージの行数
 * @default 3
 *
 * @param Message Size
 * @desc メッセージの文字サイズ (デフォルト:22/ツクール標準:28)
 * @default 22
 *
 * @param Message Text X
 * @desc メッセージの文字のX座標 (背景画像の左上原点)
 * @default 90
 *
 * @param Message Text Y
 * @desc メッセージの文字のY座標 (背景画像の左上原点)
 * @default 45
 *
 * @param Message Text Width
 * @desc メッセージの文字の最大表示幅
 * @default 400
 *
 * @param Name X
 * @desc 名前の背景画像のX座標 (メッセージ背景の左上原点)
 * @default 60
 *
 * @param Name Y
 * @desc 名前の背景画像のY座標 (メッセージ背景の左上原点)
 * @default 2
 *
 * @param Name Width
 * @desc 名前の背景画像の幅
 * @default 180
 *
 * @param Name Height
 * @desc 名前の背景画像の高さ
 * @default 40
 *
 * @param Name Size
 * @desc 名前の文字サイズ (デフォルト:22/ツクール標準:28)
 * @default 20
 *
 * @param Name Text X
 * @desc 名前の文字のX座標 (名前の背景画像の左上原点)
 * @default 20
 *
 * @param Name Text Y
 * @desc 名前の文字のY座標 (名前の背景画像の左上原点)
 * @default 6
 *
 * @param Name Text Width
 * @desc 名前の文字の最大表示幅
 * @default 140
 *
 * @param Choice Margin
 * @desc 選択肢ウィンドウの周囲の余白
 * @default 18
 *
 * @requiredAssets img/system/MessageBack
 * @requiredAssets img/system/MessageDark
 * @requiredAssets img/system/MessageName
 * @requiredAssets img/system/MessageFace
 *
 * @help
 *
 * 背景画像を使用したメッセージを表示するプラグインです。
 * セリフを話すキャラクターの名前を表示する機能もあります。
 *
 * ＜必要画像＞
 * 　以下の画像を img/system フォルダに入れて下さい。
 *
 * 　MessageBack.png       # メッセージ背景用の画像 (通情)
 * 　MessageDark.png       # メッセージ背景用の画像 (暗い)
 * 　MessageName.png       # 名前背景用の画像
 * 　MessageFace.png       # 顔グラフィック背景・枠の画像
 * 
 * ＜名前の表示＞
 * 　メッセージ中に以下を書き込むと名前を表示することができます。
 *
 * 　<name:名前>
 *
 * ＜プラグインコマンド＞
 * 　Message Face x y      # 顔グラフィックの座標 (x,y:座標)
 *
 * ＜詳細と注意点＞
 * ・顔グラフィックの座標は保持されるため、戻し忘れに注意！
 * ・顔グラフィック座標の変更は、コモンイベントで行う事をおすすめします。
 * ・一行の高さは 文字サイズ + 8 になります。
 *
 */

var Vitsuno = Vitsuno || {};

(function ($) {
    'use strict';

    // バージョン情報
    $.MESSAGE_LAYOUT_VERSION = 1.80;

    // システム画像
    var _imgMessageBack = 'MessageBack';
    var _imgMessageDark = 'MessageDark';
    var _imgMessageName = 'MessageName';
    var _imgMessageFace = 'MessageFace';

    // プラグインの設定値を取得
    var _parameters = PluginManager.parameters('Vitsuno_MessageLayout');

    var _speakerX = Number(_parameters['Face X']);
    var _speakerY = Number(_parameters['Face Y']);
    var _systemBack = Number(_parameters['System Background']);

    var _fastMsgOpen = _parameters['Fast Message Open'];
    var _msgWidth = Number(_parameters['Message Width']);
    var _msgHeight = Number(_parameters['Message Height']);
    var _msgLine = Number(_parameters['Message Line']);
    var _msgSize = Number(_parameters['Message Size']);
    var _msgTextX = Number(_parameters['Message Text X']);
    var _msgTextY = Number(_parameters['Message Text Y']);
    var _msgTextWidth = Number(_parameters['Message Text Width']);

    var _nameX = Number(_parameters['Name X']);
    var _nameY = Number(_parameters['Name Y']);
    var _nameWidth = Number(_parameters['Name Width']);
    var _nameHeight = Number(_parameters['Name Height']);
    var _nameSize = Number(_parameters['Name Size']);
    var _nameTextX = Number(_parameters['Name Text X']);
    var _nameTextY = Number(_parameters['Name Text Y']);
    var _nameTextWidth = Number(_parameters['Name Text Width']);

    var _choiceMargin = Number(_parameters['Choice Margin']);

    //=========================================================================
    // 追加機能
    //=========================================================================

    // ウィンドウコンテンツ位置 (Window_Base 継承クラス用)
    var _windowContentsPosition = function (_class, _super) {
        // 描画するコンテンツビットマップの位置を変更できるようにします。

        // ● コンテンツのX座標の取得
        _class.prototype.contentsX = function () {
            return this.padding;
        };

        // ● コンテンツのY座標の取得
        _class.prototype.contentsY = function () {
            return this.padding;
        };

        // ★ コンテンツのリフレッシュ (再定義)
        _class.prototype._refreshContents = function () {
            _super.prototype._refreshContents.call(this);
            this._windowContentsSprite.move(this.contentsX(), this.contentsY());
        };

        // ★ 矢印のリフレッシュ (再定義)
        _class.prototype._refreshArrows = function () {
            _super.prototype._refreshArrows.call(this);
            var x = this.contentsX();
            var y = this.contentsY();
            var w = this.contentsWidth();
            var h = this.contentsHeight();
            var q = 12;
            this._downArrowSprite.move(x + w / 2, y + h + q);
            this._upArrowSprite.move(x + w / 2, y - q);
        };

        // ★ ポーズサインのリフレッシュ (再定義)
        _class.prototype._refreshPauseSign = function () {
            _super.prototype._refreshPauseSign.call(this);
            var x = this.contentsX();
            var y = this.contentsY();
            var w = this.contentsWidth();
            var h = this.contentsHeight();
            this._windowPauseSignSprite.anchor.y = 0;
            this._windowPauseSignSprite.move(x + w / 2, y + h);
        };

        // ★ コンテンツの更新 (再定義)
        _class.prototype._updateContents = function () {
            var w = this.contentsWidth();
            var h = this.contentsHeight();
            if (w > 0 && h > 0) {
                this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
                this._windowContentsSprite.visible = this.isOpen();
            } else {
                this._windowContentsSprite.visible = false;
            }
        };
    };

    //=========================================================================
    // BattleManager
    //=========================================================================

    (function (_class, _super) {

        // ● システム背景タイプ
        _class.systemMessageBackground = function () {
            return _systemBack;
        };

        // ● 開始時のメッセージの表示
        var _displayStartMessages = _class.displayStartMessages;
        _class.displayStartMessages = function () {
            $gameMessage.setBackground(this.systemMessageBackground());
            _displayStartMessages.call(this);
        };

        // ● 勝利時のメッセージの表示
        var _displayVictoryMessage = _class.displayVictoryMessage;
        _class.displayVictoryMessage = function () {
            $gameMessage.setBackground(this.systemMessageBackground());
            _displayVictoryMessage.call(this);
        };

        // ● 敗北時のメッセージの表示
        var _displayDefeatMessage = _class.displayDefeatMessage;
        _class.displayDefeatMessage = function () {
            $gameMessage.setBackground(this.systemMessageBackground());
            _displayDefeatMessage.call(this);
        };

        // ● 逃走成功時のメッセージの表示
        var _displayEscapeSuccessMessage = _class.displayEscapeSuccessMessage;
        _class.displayEscapeSuccessMessage = function () {
            $gameMessage.setBackground(this.systemMessageBackground());
            _displayEscapeSuccessMessage.call(this);
        };

        // ● 逃走失敗時のメッセージの表示
        var _displayEscapeFailureMessage = _class.displayEscapeFailureMessage;
        _class.displayEscapeFailureMessage = function () {
            $gameMessage.setBackground(this.systemMessageBackground());
            _displayEscapeFailureMessage.call(this);
        };

        // ● 報酬の表示
        var _displayRewards = _class.displayRewards;
        _class.displayRewards = function () {
            $gameMessage.setBackground(this.systemMessageBackground());
            _displayRewards.call(this);
        };

    })(BattleManager, null);

    //=========================================================================
    // Game_System
    //=========================================================================

    (function (_class, _super) {

        // ● 初期化
        var _initialize = _class.prototype.initialize;
        _class.prototype.initialize = function () {
            _initialize.call(this);
            this._speakerX = _speakerX;
            this._speakerY = _speakerY;
        };

        // ● グラフィックのX座標の取得
        _class.prototype.speakerX = function () {
            if (this._speakerX === undefined) {
                this._speakerX = _speakerX;
            }
            return this._speakerX;
        };

        // ● グラフィックのY座標の取得
        _class.prototype.speakerY = function () {
            if (this._speakerY === undefined) {
                this._speakerY = _speakerY;
            }
            return this._speakerY;
        };

        // ● グラフィック座標の設定
        _class.prototype.setSpeakerPosition = function (x, y) {
            this._speakerX = x;
            this._speakerY = y;
        };

    })(Game_System, null);

    //=========================================================================
    // Game_Interpreter
    //=========================================================================

    (function (_class, _super) {

        // ● プラグインコマンドの処理
        var _pluginCommand = _class.prototype.pluginCommand;
        _class.prototype.pluginCommand = function (command, args) {
            _pluginCommand.call(this, command, args);
            if (command === 'Message') {
                // 顔グラフィックの座標設定
                if (args[0] === 'Face') {
                    $gameSystem.setSpeakerPosition(Number(args[1]), Number(args[2]));
                }
            }
        };

    })(Game_Interpreter, null);

    //=========================================================================
    // Sprite_MessageSpeaker
    //   メッセージの話し手のグラフィックを表示するスプライトのクラスです。
    //=========================================================================

    (function () {

        //---------------------------------------------------------------------
        // クラス処理
        //---------------------------------------------------------------------

        // ● クラスの生成
        var _class = function Sprite_MessageSpeaker() {
            this.initialize.apply(this, arguments);
        };

        // ● スーパークラス
        var _super = Sprite_Base;

        // ● クラスの継承
        _class.prototype = Object.create(_super.prototype);
        _class.prototype.constructor = _class;

        // ● モジュールクラス化
        $.Sprite_MessageSpeaker = _class;

        //---------------------------------------------------------------------
        // 基本処理
        //---------------------------------------------------------------------

        // ● 初期化
        _class.prototype.initialize = function (messageWindow) {
            this._messageWindow = messageWindow;
            _super.prototype.initialize.call(this);
        };

        // ● 表示の更新
        _class.prototype.updateVisibility = function () {
            _super.prototype.updateVisibility.call(this);
            if (!this._messageWindow.visible || this._messageWindow.isClosed()) {
                this.visible = false;
            }
        };

        // ● 画像のクリア
        _class.prototype.clear = function () {
            if (this.bitmap) {
                this.bitmap.clear();
            }
        };

        // ● ビットマップのリフレッシュ
        _class.prototype.refreshBitmap = function (width, height) {
            if (!this.bitmap) {
                this.bitmap = new Bitmap(width, height);
            } else {
                this.bitmap.resize(width, height);
            }
            this.bitmap.clear();
        };

        // ● 顔グラフィックの設定
        _class.prototype.setFace = function (faceName, faceIndex) {
            var frameBitmap = ImageManager.loadSystem(_imgMessageFace);
            var fw = Window_Base._faceWidth;
            var fh = Window_Base._faceHeight;
            this.refreshBitmap(fw, fh);
            this.bitmap.blt(frameBitmap, 0, 0, fw, fh, 0, 0);
            if (faceName !== '') {
                var faceBitmap = ImageManager.loadFace(faceName);
                var fx = faceIndex % 4 * fw;
                var fy = Math.floor(faceIndex / 4) * fh;
                this.bitmap.blt(faceBitmap, fx, fy, fw, fh, 0, 0);
            }
            this.bitmap.blt(frameBitmap, fw, 0, fw, fh, 0, 0);
        };

    })();

    //=========================================================================
    // Window_ChoiceList
    //=========================================================================

    (function (_class, _super) {

        // ★ 位置の更新 (再定義)
        _class.prototype.updatePlacement = function () {
            var positionType = $gameMessage.choicePositionType();
            var messageX = this._messageWindow.x;
            var messageY = this._messageWindow.y;
            var messageWidth = this._messageWindow.width;
            var messageHeight = this._messageWindow.height;
            var margin = _choiceMargin;
            this.width = this.windowWidth();
            this.height = this.windowHeight();
            switch (positionType) {
                case 0:
                    this.x = messageX + margin;
                    break;
                case 1:
                    this.x = (Graphics.boxWidth - this.width) / 2;
                    break;
                case 2:
                    this.x = messageX + messageWidth - this.width - margin;
                    break;
            }
            if (messageY >= Graphics.boxHeight / 2) {
                this.y = messageY - this.height - margin;
            } else {
                this.y = messageY + messageHeight + margin;
            }
        };

    })(Window_ChoiceList, Window_Command);

    //=========================================================================
    // Window_Message
    //=========================================================================

    (function (_class, _super) {

        //---------------------------------------------------------------------
        // 基本処理
        //---------------------------------------------------------------------

        // ● 機能拡張
        _windowContentsPosition(_class, _super);

        // ● 初期化
        var _initialize = _class.prototype.initialize;
        _class.prototype.initialize = function () {
            _initialize.call(this);
            this.createBackSprites();
            this.createNameWindow();
            this.createSpeakerSprites();
            this.opacity = 0;
        };

        // ● メッセージの開始
        var _startMessage = _class.prototype.startMessage;
        _class.prototype.startMessage = function () {
            _startMessage.call(this);
            this.updateSpeaker();
        };

        // ● 新しいページの処理
        var _newPage = _class.prototype.newPage;
        _class.prototype.newPage = function (textState) {
            this.clearSpeaker();
            this.clearName();
            this.loadMessageName(textState);
            _newPage.call(this, textState);
        };

        // ● ウィンドウを開く
        var _open = _class.prototype.open;
        _class.prototype.open = function () {
            _open.call(this);
            if (_fastMsgOpen === 'true') {
                this.openness = 255;
                this._opening = false;
            }
        };

        //---------------------------------------------------------------------
        // 背景処理
        //---------------------------------------------------------------------

        // ● 背景画像の作成
        _class.prototype.createBackSprites = function () {
            this._backSprite = new Sprite();
            this._backSprite.bitmap = ImageManager.loadSystem(_imgMessageBack);
            this.addChildToBack(this._backSprite);
            this._darkSprite = new Sprite();
            this._darkSprite.bitmap = ImageManager.loadSystem(_imgMessageDark);
            this.addChildToBack(this._darkSprite);
        };

        // ● 背景の更新
        var _updateBackground = _class.prototype.updateBackground;
        _class.prototype.updateBackground = function () {
            _updateBackground.call(this);
            this._nameWindow.setBackgroundType(this._background);
        };

        // ★ 背景タイプの設定 (再定義)
        _class.prototype.setBackgroundType = function (type) {
            if (type === 0) {
                this._backSprite.visible = true;
            } else {
                this._backSprite.visible = false;
            }
            if (type === 1) {
                this._darkSprite.visible = true;
            } else {
                this._darkSprite.visible = false;
            }
        };

        //---------------------------------------------------------------------
        // 名前処理
        //---------------------------------------------------------------------

        // ● 名前ウィンドウの作成
        _class.prototype.createNameWindow = function () {
            this._nameWindow = new $.Window_MessageName();
            this.addChild(this._nameWindow);
        };

        // ● 名前のクリア
        _class.prototype.clearName = function () {
            this._nameWindow.clear();
        };

        // ● 名前の読み込み
        _class.prototype.loadMessageName = function (textState) {
            var re = /<name:(.+?)>\n?/;
            textState.text = textState.text.replace(re, function () {
                this._nameWindow.setText(arguments[1]);
                return '';
            }.bind(this));
        };

        //---------------------------------------------------------------------
        // 画像処理
        //---------------------------------------------------------------------

        // ● 話し手の画像の取得
        _class.prototype.speakerSprites = function () {
            return [this._speakerSprite];
        };

        // ● 話し手の画像の作成
        _class.prototype.createSpeakerSprites = function () {
            this._speakerSprite = new $.Sprite_MessageSpeaker(this);
        };

        // ● 話し手の更新
        _class.prototype.updateSpeaker = function () {
            this._speakerSprite.x = $gameSystem.speakerX();
            this._speakerSprite.y = $gameSystem.speakerY();
            if ($gameMessage.faceName() !== '') {
                this._speakerSprite.setFace('', 0);
            }
        };

        // ● 話し手のクリア
        _class.prototype.clearSpeaker = function () {
            this._speakerSprite.clear();
        };

        // ★ 顔グラフィックの描画 (再定義)
        _class.prototype.drawMessageFace = function () {
            var faceName = $gameMessage.faceName();
            var faceIndex = $gameMessage.faceIndex();
            if (faceName !== '') {
                this._speakerSprite.setFace(faceName, faceIndex);
            }
            ImageManager.releaseReservation(this._imageReservationId);
        };

        //---------------------------------------------------------------------
        // 座標処理
        //---------------------------------------------------------------------

        // ★ ライン高さの取得 (再定義)
        _class.prototype.lineHeight = function () {
            return _msgSize + 8;
        };

        // ★ 基本の文字サイズの取得 (再定義)
        _class.prototype.standardFontSize = function () {
            return _msgSize;
        };

        // ★ 行数の取得 (再定義)
        _class.prototype.numVisibleRows = function () {
            return _msgLine;
        };

        // ★ ウィンドウ幅の取得 (再定義)
        _class.prototype.windowWidth = function () {
            return _msgWidth;
        };

        // ★ ウィンドウ高さの取得 (再定義)
        _class.prototype.windowHeight = function () {
            return _msgHeight;
        };

        // ● コンテンツのX座標の取得
        _class.prototype.contentsX = function () {
            return _msgTextX;
        };

        // ● コンテンツのY座標の取得
        _class.prototype.contentsY = function () {
            return _msgTextY;
        };

        // ★ コンテンツの幅の取得 (再定義)
        _class.prototype.contentsWidth = function () {
            return _msgTextWidth;
        };

        // ★ コンテンツの高さの取得 (再定義)
        _class.prototype.contentsHeight = function () {
            return this.numVisibleRows() * this.lineHeight();
        };

        // ★ 新しい行のX座標 (再定義)
        _class.prototype.newLineX = function () {
            return 0;
        };

    })(Window_Message, Window_Base);

    //=========================================================================
    // Window_MessageName
    //   メッセージの名前を表示するウィンドウのクラスです。
    //=========================================================================

    (function () {

        //---------------------------------------------------------------------
        // クラス処理
        //---------------------------------------------------------------------

        // ● クラスの生成
        var _class = function Window_MessageName() {
            this.initialize.apply(this, arguments);
        };

        // ● スーパークラス
        var _super = Window_Base;

        // ● クラスの継承
        _class.prototype = Object.create(_super.prototype);
        _class.prototype.constructor = _class;

        // ● モジュールクラス化
        $.Window_MessageName = _class;

        //---------------------------------------------------------------------
        // 基本処理
        //---------------------------------------------------------------------

        // ● 機能拡張
        _windowContentsPosition(_class, _super);

        // ● 初期化
        _class.prototype.initialize = function () {
            var x = this.windowX();
            var y = this.windowY();
            var width = this.windowWidth();
            var height = this.windowHeight();
            _super.prototype.initialize.call(this, x, y, width, height);
            this.createBackSprite();
            this._text = '';
            this.opacity = 0;
            this.hide();
        };

        // ● 背景画像の作成
        _class.prototype.createBackSprite = function () {
            this._backSprite = new Sprite();
            this._backSprite.bitmap = ImageManager.loadSystem(_imgMessageName);
            this.addChildToBack(this._backSprite);
        };

        // ● テキストの設定
        _class.prototype.setText = function (text) {
            if (this._text !== text) {
                this._text = text;
                this.refresh();
            }
        };

        // ● テキストのクリア
        _class.prototype.clear = function () {
            this.setText('');
        };

        // ● リフレッシュ
        _class.prototype.refresh = function () {
            this.contents.clear();
            this.drawText(this._text, 0, 0, this.contentsWidth());
            this.updateVisibility();
        };

        // ● 表示の更新
        _class.prototype.updateVisibility = function () {
            if (this._text === '') {
                this.hide();
            } else {
                this.show();
            }
        };

        // ● 背景タイプの設定
        _class.prototype.setBackgroundType = function (type) {
            if (type < 2) {
                this._backSprite.visible = true;
            } else {
                this._backSprite.visible = false;
            }
        };

        //---------------------------------------------------------------------
        // 座標処理
        //---------------------------------------------------------------------

        // ● ライン高さの取得
        _class.prototype.lineHeight = function () {
            return _nameSize + 8;
        };

        // ● 基本の文字サイズの取得
        _class.prototype.standardFontSize = function () {
            return _nameSize;
        };

        // ● 行数の取得
        _class.prototype.numVisibleRows = function () {
            return 1;
        };

        // ● ウィンドウX座標の取得
        _class.prototype.windowX = function () {
            return _nameX;
        };

        // ● ウィンドウY座標の取得
        _class.prototype.windowY = function () {
            return _nameY;
        };

        // ● ウィンドウ幅の取得
        _class.prototype.windowWidth = function () {
            return _nameWidth;
        };

        // ● ウィンドウ高さの取得
        _class.prototype.windowHeight = function () {
            return _nameHeight;
        };

        // ● コンテンツのX座標の取得
        _class.prototype.contentsX = function () {
            return _nameTextX;
        };

        // ● コンテンツのY座標の取得
        _class.prototype.contentsY = function () {
            return _nameTextY;
        };

        // ● コンテンツの幅の取得
        _class.prototype.contentsWidth = function () {
            return _nameTextWidth;
        };

        // ● コンテンツの高さの取得
        _class.prototype.contentsHeight = function () {
            return this.numVisibleRows() * this.lineHeight();
        };

    })();

    //=========================================================================
    // Scene_Boot
    //=========================================================================

    (function (_class, _super) {

        // ● システム画像の読み込み
        var _loadSystemImages = _class.loadSystemImages;
        _class.loadSystemImages = function () {
            _loadSystemImages.call(this);
            ImageManager.reserveSystem(_imgMessageBack);
            ImageManager.reserveSystem(_imgMessageDark);
            ImageManager.reserveSystem(_imgMessageName);
            ImageManager.reserveSystem(_imgMessageFace);
        };

    })(Scene_Boot, Scene_Base);

    //=========================================================================
    // Scene_Map
    //=========================================================================

    (function (_class, _super) {

        // ● メッセージウィンドウの作成
        var _createMessageWindow = _class.prototype.createMessageWindow;
        _class.prototype.createMessageWindow = function () {
            _createMessageWindow.call(this);
            this._messageWindow.speakerSprites().forEach(function (sprite) {
                this.addChild(sprite);
            }, this);
        };

    })(Scene_Map, Scene_Base);

    //=========================================================================
    // Scene_Battle
    //=========================================================================

    (function (_class, _super) {

        // ● メッセージウィンドウの作成
        var _createMessageWindow = _class.prototype.createMessageWindow;
        _class.prototype.createMessageWindow = function () {
            _createMessageWindow.call(this);
            this._messageWindow.speakerSprites().forEach(function (sprite) {
                this.addChild(sprite);
            }, this);
        };

    })(Scene_Battle, Scene_Base);

})(Vitsuno);
