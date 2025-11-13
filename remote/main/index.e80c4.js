System.register("chunks:///_virtual/AudioManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _createForOfIteratorHelperLoose, _createClass, cclegacy, _decorator, director, AudioSource, Node, resources, AudioClip, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      director = module.director;
      AudioSource = module.AudioSource;
      Node = module.Node;
      resources = module.resources;
      AudioClip = module.AudioClip;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "8f57aVVskBMMKCmeX07suR/", "AudioManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var AudioManager = exports('AudioManager', (_dec = ccclass('AudioManager'), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(AudioManager, _Component);
        function AudioManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.audioSource = null;
          _this.soundPool = [];
          _this.soundCache = new Map();
          _this.musicVolume = 1.0;
          _this.soundVolume = 1.0;
          _this.isMusicMuted = false;
          _this.isSoundMuted = false;
          return _this;
        }
        var _proto = AudioManager.prototype;
        // 使用 onLoad 确保正确初始化
        _proto.onLoad = function onLoad() {
          if (AudioManager._instance && AudioManager._instance !== this) {
            this.destroy();
            return;
          }
          AudioManager._instance = this;
          director.addPersistRootNode(this.node);
          this.initializeAudio();
        };
        _proto.initializeAudio = function initializeAudio() {
          // 初始化主音频源
          this.audioSource = this.getComponent(AudioSource);
          if (!this.audioSource) {
            this.audioSource = this.addComponent(AudioSource);
          }
          this.audioSource.volume = this.musicVolume;

          // 创建音效池
          this.createSoundPool();
          console.log('AudioManager initialized');
        };
        _proto.createSoundPool = function createSoundPool() {
          for (var i = 0; i < 10; i++) {
            var node = new Node("SoundSource_" + i);
            node.parent = this.node;
            var audioSource = node.addComponent(AudioSource);
            audioSource.volume = this.soundVolume;
            this.soundPool.push(audioSource);
          }
        };
        // 预加载音效
        _proto.preloadSound = function preloadSound(soundName, callback) {
          var _this2 = this;
          if (this.soundCache.has(soundName)) {
            callback && callback();
            return;
          }
          resources.load("sounds/voice/" + soundName, AudioClip, function (err, clip) {
            if (err) {
              console.error("Failed to load sound: " + soundName, err);
              return;
            }
            _this2.soundCache.set(soundName, clip);
            callback && callback();
          });
        }

        // 播放背景音乐
        ;

        _proto.playMusic = function playMusic(musicName, loop, volume) {
          var _this3 = this;
          if (loop === void 0) {
            loop = true;
          }
          if (volume === void 0) {
            volume = 1.0;
          }
          if (this.isMusicMuted) return;
          resources.load("sounds/music/" + musicName, AudioClip, function (err, clip) {
            if (err) {
              console.error("Failed to load music: " + musicName, err);
              return;
            }
            _this3.audioSource.stop();
            _this3.audioSource.clip = clip;
            _this3.audioSource.loop = loop;
            _this3.audioSource.volume = volume * _this3.musicVolume;
            _this3.audioSource.play();
          });
        }

        // 播放音效
        ;

        _proto.playSound = function playSound(soundName, volume) {
          var _this4 = this;
          if (volume === void 0) {
            volume = 1.0;
          }
          if (this.isSoundMuted) return false;
          var clip = this.soundCache.get(soundName);
          if (clip) {
            return this.playSoundClip(clip, volume);
          }

          // 如果音效未缓存，动态加载
          this.preloadSound(soundName, function () {
            var cachedClip = _this4.soundCache.get(soundName);
            if (cachedClip) {
              _this4.playSoundClip(cachedClip, volume);
            }
          });
          return true;
        };
        _proto.playSoundClip = function playSoundClip(clip, volume) {
          if (volume === void 0) {
            volume = 1.0;
          }
          for (var _iterator = _createForOfIteratorHelperLoose(this.soundPool), _step; !(_step = _iterator()).done;) {
            var source = _step.value;
            if (!source.playing) {
              source.stop();
              source.clip = clip;
              source.volume = volume * this.soundVolume;
              source.play();
              return true;
            }
          }
          console.warn('No available audio source in pool');
          return false;
        }

        // 停止背景音乐
        ;

        _proto.stopMusic = function stopMusic() {
          this.audioSource.stop();
        }

        // 暂停背景音乐
        ;

        _proto.pauseMusic = function pauseMusic() {
          this.audioSource.pause();
        }

        // 恢复背景音乐
        ;

        _proto.resumeMusic = function resumeMusic() {
          if (!this.isMusicMuted) {
            this.audioSource.play();
          }
        }

        // 设置音乐音量
        ;

        _proto.setMusicVolume = function setMusicVolume(volume) {
          this.musicVolume = Math.max(0, Math.min(1, volume));
          this.audioSource.volume = this.musicVolume;
        }

        // 设置音效音量
        ;

        _proto.setSoundVolume = function setSoundVolume(volume) {
          var _this5 = this;
          this.soundVolume = Math.max(0, Math.min(1, volume));
          this.soundPool.forEach(function (source) {
            source.volume = _this5.soundVolume;
          });
        }

        // 静音/取消静音音乐
        ;

        _proto.toggleMusicMute = function toggleMusicMute() {
          this.isMusicMuted = !this.isMusicMuted;
          if (this.isMusicMuted) {
            this.audioSource.pause();
          } else {
            this.audioSource.play();
          }
          return this.isMusicMuted;
        }

        // 静音/取消静音音效
        ;

        _proto.toggleSoundMute = function toggleSoundMute() {
          this.isSoundMuted = !this.isSoundMuted;
          return this.isSoundMuted;
        }

        // 停止所有音效
        ;

        _proto.stopAllSounds = function stopAllSounds() {
          this.soundPool.forEach(function (source) {
            source.stop();
          });
        }

        // 清理缓存
        ;

        _proto.clearCache = function clearCache() {
          this.soundCache.clear();
        }

        // 正确的销毁方法
        ;

        _proto.onDestroy = function onDestroy() {
          console.log('AudioManager onDestroy called');

          // 执行清理逻辑
          this.stopAllSounds();
          this.stopMusic();
          this.clearCache();

          // 清空单例引用
          AudioManager._instance = null;

          // 必须调用父类的 onDestroy
          _Component.prototype.onDestroy.call(this);
        };
        _createClass(AudioManager, null, [{
          key: "instance",
          get: function get() {
            if (!this._instance) {
              var scene = director.getScene();
              if (!scene) {
                console.error('No active scene found for AudioManager');
                return null;
              }

              // 查找现有的 AudioManager
              var existingManager = scene.getComponentInChildren(AudioManager);
              if (existingManager) {
                this._instance = existingManager;
                return this._instance;
              }
              console.error('AudioManager not found in scene. Please add AudioManager to the scene.');
            }
            return this._instance;
          }
        }]);
        return AudioManager;
      }(Component), _class2._instance = null, _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BackgroundScroller.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Sprite, Vec2, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Vec2 = module.Vec2;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "08be51rydBOUrxr0XdgNMFO", "BackgroundScroller", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var BackgroundScroller = exports('BackgroundScroller', (_dec = ccclass('BackgroundScroller'), _dec2 = property(Sprite), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BackgroundScroller, _Component);
        function BackgroundScroller() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "backgroundSprite", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "scrollSpeedMultiplier", _descriptor2, _assertThisInitialized(_this));
          _this.material = null;
          _this.currentOffset = new Vec2(0, 0);
          return _this;
        }
        var _proto = BackgroundScroller.prototype;
        _proto.onLoad = function onLoad() {
          if (this.backgroundSprite) {
            this.material = this.backgroundSprite.getMaterial(0);
          }
        };
        _proto.update = function update(deltaTime) {
          // if (!GameManager.instance.isInBattle && this.material) {
          //     // 根据游戏进度计算背景偏移
          //     const offsetX = GameManager.instance.totalProgress *
          //         GameManager.instance.backgroundScrollSpeed *
          //         this.scrollSpeedMultiplier;
          //
          //     this.currentOffset = new Vec2(offsetX, 0);
          //
          //     // 设置材质偏移
          //     this.material.setProperty('mainTexture_off', this.currentOffset);
          // }
          // const layer = this.backgroundLayers[layerIndex];
          // if (!layer) return;
          //
          // const speed = this.layerSpeeds[layerIndex] || 1.0;
          // const initialX = this.initialPositions[layerIndex] || 0;
          // const offsetX = this.currentProgress * this.globalScrollSpeed * speed;
          //
          // // 简单的循环滚动（假设所有背景纹理宽度为960）
          // const newX = initialX - (offsetX % 960);
          //
          // const currentPos = layer.position;
          // layer.setPosition(newX, currentPos.y, currentPos.z);
        }

        // 静态方法：更新所有背景
        ;

        BackgroundScroller.updateAllBackgrounds = function updateAllBackgrounds() {
          var backgrounds = find('canvas').getComponentsInChildren(BackgroundScroller);
          backgrounds.forEach(function (bg) {
            return bg.update(0);
          });
        };
        return BackgroundScroller;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "backgroundSprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scrollSpeedMultiplier", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DebugComponent.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Graphics, Label, Vec3, Color, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Graphics = module.Graphics;
      Label = module.Label;
      Vec3 = module.Vec3;
      Color = module.Color;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "48150JF1qlGhZEhxAtssYgX", "DebugComponent", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var DebugComponent = exports('DebugComponent', (_dec = ccclass('DebugComponent'), _dec2 = property({
        type: Graphics
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(DebugComponent, _Component);
        function DebugComponent() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "graphics", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "debugLabel", _descriptor2, _assertThisInitialized(_this));
          _this._targetPosition = new Vec3();
          _this._detectionRadius = 0;
          _this._attackRadius = 0;
          return _this;
        }
        var _proto = DebugComponent.prototype;
        _proto.onLoad = function onLoad() {
          if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
          }
        };
        _proto.setDebugInfo = function setDebugInfo(target, detectionRange, attackRange) {
          this._targetPosition.set(target);
          this._detectionRadius = detectionRange;
          this._attackRadius = attackRange;
        };
        _proto.updateDebugText = function updateDebugText(text) {
          if (this.debugLabel) {
            this.debugLabel.string = text;
          }
        };
        _proto.update = function update() {
          if (!this.graphics) return;
          this.graphics.clear();

          // 绘制检测范围（黄色）
          this.graphics.circle(0, 0, this._detectionRadius);
          this.graphics.strokeColor = Color.YELLOW;
          this.graphics.stroke();

          // 绘制攻击范围（红色）
          this.graphics.circle(0, 0, this._attackRadius);
          this.graphics.strokeColor = Color.RED;
          this.graphics.stroke();

          // 绘制目标方向线（绿色）
          var currentPos = this.node.worldPosition;
          var direction = new Vec3();
          Vec3.subtract(direction, this._targetPosition, currentPos);
          if (direction.length() > 0) {
            direction.normalize().multiplyScalar(50); // 缩放方向线长度
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(direction.x, direction.z);
            this.graphics.strokeColor = Color.GREEN;
            this.graphics.stroke();
          }
        };
        return DebugComponent;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "graphics", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "debugLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EnemySpawner.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "b02cfdDLmZMyqwG1m6Txr4k", "EnemySpawner", undefined);
      // Spawner.ts
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var Spawner = exports('default', (_dec = property(cc.Prefab), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(Spawner, _cc$Component);
        function Spawner() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "monsterPrefab", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spawnInterval", _descriptor2, _assertThisInitialized(_this));
          // 生成间隔
          _initializerDefineProperty(_this, "spawnX", _descriptor3, _assertThisInitialized(_this));
          // 生成位置x，屏幕右侧外
          _initializerDefineProperty(_this, "spawnY", _descriptor4, _assertThisInitialized(_this));
          // 生成位置y
          _this.canSpawn = true;
          return _this;
        }
        var _proto = Spawner.prototype;
        _proto.start = function start() {
          this.schedule(this.spawnMonster, this.spawnInterval);
        };
        _proto.spawnMonster = function spawnMonster() {
          if (!this.canSpawn) return;
          var monster = cc.instantiate(this.monsterPrefab);
          monster.setPosition(this.spawnX, this.spawnY);
          this.node.addChild(monster);
          this.canSpawn = false; // 等待怪物死亡后再生成下一个
        };

        _proto.onMonsterDied = function onMonsterDied() {
          var _this2 = this;
          this.canSpawn = true;
          // 这里我们使用调度，等待几秒后生成，但因为我们已经在start中使用了调度，所以这里只需要重置canSpawn，然后由调度器自动生成
          // 但是注意，我们不想在怪物死亡后立即生成，而是等待几秒，所以可以在onMonsterDied中设置一个延迟调度
          // 但是我们的生成器原本是定时生成，这里我们改变逻辑：当怪物死亡后，等待spawnInterval秒再生成下一个
          // 所以我们可以在这里重新启动调度
          this.scheduleOnce(function () {
            _this2.canSpawn = true;
          }, this.spawnInterval);
        };
        return Spawner;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "monsterPrefab", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spawnX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 500;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "spawnY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EquipManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "de08exMo3FPEaA5kC5AKcr2", "EquipManager", undefined); // GameManager.ts - 修复版
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;

      // 定义装备类型
      var EquipmentType = /*#__PURE__*/function (EquipmentType) {
        EquipmentType[EquipmentType["WEAPON"] = 0] = "WEAPON";
        EquipmentType[EquipmentType["HELMET"] = 1] = "HELMET";
        EquipmentType[EquipmentType["ARMOR"] = 2] = "ARMOR";
        EquipmentType[EquipmentType["BOOTS"] = 3] = "BOOTS";
        EquipmentType[EquipmentType["GLOVES"] = 4] = "GLOVES";
        EquipmentType[EquipmentType["RING"] = 5] = "RING";
        EquipmentType[EquipmentType["NECKLACE"] = 6] = "NECKLACE";
        EquipmentType[EquipmentType["BELT"] = 7] = "BELT";
        EquipmentType[EquipmentType["SHIELD"] = 8] = "SHIELD";
        EquipmentType[EquipmentType["CLOAK"] = 9] = "CLOAK";
        EquipmentType[EquipmentType["AMULET"] = 10] = "AMULET";
        EquipmentType[EquipmentType["BRACERS"] = 11] = "BRACERS";
        EquipmentType[EquipmentType["EARRING"] = 12] = "EARRING";
        return EquipmentType;
      }(EquipmentType || {});
      var GameManager = exports('default', (_dec = property(cc.Node), _dec2 = property(cc.Node), _dec3 = property(cc.Prefab), _dec4 = property(cc.Node), _dec5 = property([cc.SpriteFrame]), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(GameManager, _cc$Component);
        function GameManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "equipmentContainer", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "slotsContainer", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "equipmentPrefab", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "playerNode", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "equipmentSprites", _descriptor5, _assertThisInitialized(_this));
          _this._equipmentSlots = [];
          _this.equipmentItems = [];
          _this.equipmentSlots = [];
          _this._currentEquipments = new Map();
          _this._isMovingAll = false;
          _this._slotsWithNewEquipment = new Set();
          // 装备类型对应的内容大小映射
          _this.equipmentSizeMap = new Map();
          _this.equipBgSizeMap = new Map();
          _this.equipmentIconPaths = ['equip1/1', 'equip1/2', 'equip1/3', 'equip1/4', 'equip1/5', 'equip1/6', 'equip1/7', 'equip1/8', 'equip1/9', 'equip1/10', 'equip1/11', 'equip1/12', 'equip1/13'];
          _this.cachedSpriteFrames = new Map();
          _this.loadFailedPaths = [];
          return _this;
        }
        var _proto = GameManager.prototype;
        _proto.onLoad = function onLoad() {
          // 确保数组正确初始化
          this.equipmentItems = [];
          this.equipmentSlots = [];
          this._equipmentSlots = [];
          console.log('GameManager onLoad, equipmentItems 初始化:', this.equipmentItems);
          this.preloadSpriteFrames();
          this.safeInitialize();
          this.initializeSizeMap();
          this.initEqiupBgSizeMap();
        }

        // 初始化装备bg与大小的映射
        ;

        _proto.initEqiupBgSizeMap = function initEqiupBgSizeMap() {
          this.equipBgSizeMap.set(EquipmentType.WEAPON, new cc.Size(110, 200)); // 武器 - 长条形
          this.equipBgSizeMap.set(EquipmentType.HELMET, new cc.Size(110, 145)); // 头盔 - 方形
          this.equipBgSizeMap.set(EquipmentType.ARMOR, new cc.Size(110, 54)); // 盔甲 - 长方形
          this.equipBgSizeMap.set(EquipmentType.BOOTS, new cc.Size(110, 95)); // 靴子 - 方形
          this.equipBgSizeMap.set(EquipmentType.GLOVES, new cc.Size(50, 93)); // 手套 - 方形
          this.equipBgSizeMap.set(EquipmentType.RING, new cc.Size(50, 93)); // 戒指 - 小圆形
          this.equipBgSizeMap.set(EquipmentType.NECKLACE, new cc.Size(110, 95)); // 项链 - 横条形
          this.equipBgSizeMap.set(EquipmentType.BELT, new cc.Size(110, 95)); // 腰带 - 横条形
          this.equipBgSizeMap.set(EquipmentType.SHIELD, new cc.Size(110, 95)); // 盾牌 - 长方形
          this.equipBgSizeMap.set(EquipmentType.CLOAK, new cc.Size(110, 45)); // 披风 - 长方形
          this.equipBgSizeMap.set(EquipmentType.AMULET, new cc.Size(53, 45)); // 护身符 - 方形
          this.equipBgSizeMap.set(EquipmentType.BRACERS, new cc.Size(53, 45)); // 护腕 - 横条形
          this.equipBgSizeMap.set(EquipmentType.EARRING, new cc.Size(225, 95)); // 耳环 - 小方形
        }

        // 初始化装备类型与大小的映射
        ;

        _proto.initializeSizeMap = function initializeSizeMap() {
          this.equipmentSizeMap.set(EquipmentType.WEAPON, new cc.Size(90, 150)); // 武器 - 长条形
          this.equipmentSizeMap.set(EquipmentType.HELMET, new cc.Size(90, 90)); // 头盔 - 方形
          this.equipmentSizeMap.set(EquipmentType.ARMOR, new cc.Size(45, 45)); // 盔甲 - 长方形
          this.equipmentSizeMap.set(EquipmentType.BOOTS, new cc.Size(60, 60)); // 靴子 - 方形
          this.equipmentSizeMap.set(EquipmentType.GLOVES, new cc.Size(30, 30)); // 手套 - 方形
          this.equipmentSizeMap.set(EquipmentType.RING, new cc.Size(30, 30)); // 戒指 - 小圆形
          this.equipmentSizeMap.set(EquipmentType.NECKLACE, new cc.Size(45, 45)); // 项链 - 横条形
          this.equipmentSizeMap.set(EquipmentType.BELT, new cc.Size(45, 45)); // 腰带 - 横条形
          this.equipmentSizeMap.set(EquipmentType.SHIELD, new cc.Size(45, 45)); // 盾牌 - 长方形
          this.equipmentSizeMap.set(EquipmentType.CLOAK, new cc.Size(30, 30)); // 披风 - 长方形
          this.equipmentSizeMap.set(EquipmentType.AMULET, new cc.Size(25, 25)); // 护身符 - 方形
          this.equipmentSizeMap.set(EquipmentType.BRACERS, new cc.Size(25, 25)); // 护腕 - 横条形
          this.equipmentSizeMap.set(EquipmentType.EARRING, new cc.Size(60, 60)); // 耳环 - 小方形
        }

        // 预加载 SpriteFrame
        ;

        _proto.preloadSpriteFrames = function preloadSpriteFrames() {
          console.log('开始预加载 SpriteFrame...');

          // 延迟生成装备
          // this.scheduleOnce(() => {
          //     //this.spawnRandomEquipments();
          // }, 0.1);
        }

        // 安全的初始化方法
        ;

        _proto.safeInitialize = function safeInitialize() {
          var _this2 = this;
          this.scheduleOnce(function () {
            _this2.initializeSlots();
          }, 0);
        }

        // 初始化装备格子
        ;

        _proto.initializeSlots = function initializeSlots() {
          try {
            this._equipmentSlots = [];
            if (!this.slotsContainer) {
              console.error('slotsContainer 未设置！');
              return;
            }
            var slotNodes = this.slotsContainer.children;
            console.log("\u627E\u5230 " + slotNodes.length + " \u4E2A\u88C5\u5907\u683C\u5B50");
            for (var i = 0; i < slotNodes.length; i++) {
              if (i >= 13) break;
              var slot = slotNodes[i].getComponent("EquipmentSlot");
              if (slot) {
                var slotType = i;
                slot.setSlotType(slotType);
                this._equipmentSlots[slotType] = slot;
                console.log("\u521D\u59CB\u5316\u683C\u5B50 " + i + ": " + slotNodes[i].name + ", \u7C7B\u578B: " + slotType);
              } else {
                console.warn("\u683C\u5B50 " + i + " \u4E0A\u672A\u627E\u5230 EquipmentSlot \u7EC4\u4EF6");
              }
            }
            console.log("\u88C5\u5907\u683C\u5B50\u521D\u59CB\u5316\u5B8C\u6210\uFF0C\u5171 " + this._equipmentSlots.length + " \u4E2A\u683C\u5B50");
          } catch (error) {
            console.error('初始化装备格子时出错:', error);
          }
        }

        // 生成随机装备 - 修复版
        ;

        _proto.spawnRandomEquipments = function spawnRandomEquipments() {
          var _this3 = this;
          console.log('开始生成随机装备...');
          if (!this.equipmentPrefab) {
            console.error('equipmentPrefab 未设置！');
            return;
          }
          if (!this.equipmentContainer) {
            console.error('equipmentContainer 未设置！');
            return;
          }

          // 确保 equipmentItems 数组已初始化
          if (!this.equipmentItems) {
            this.equipmentItems = [];
            console.log('重新初始化 equipmentItems 数组');
          }

          // 生成2-4个随机装备
          var count;
          console.log("\u8BA1\u5212\u751F\u6210 " + count + " \u4E2A\u88C5\u5907");
          var canvas = cc.find('Canvas');
          if (canvas) {
            var gameManager = canvas.getComponent('GameManager');
            if (gameManager && typeof gameManager.getCurrentLevel === 'function') {
              var currentLevel = gameManager.getCurrentLevel();
              if (currentLevel == 4) {
                count = 10;
              } else {
                count = 2 + Math.floor(Math.random() * 3);
              }
            }
          }
          var createdCount = 0;
          for (var i = 0; i < count; i++) {
            var equipment = this.createRandomEquipment(i);
            if (equipment) {
              createdCount++;
            }
          }
          console.log("\u6210\u529F\u751F\u6210 " + createdCount + " \u4E2A\u88C5\u5907\uFF0CequipmentItems \u957F\u5EA6: " + this.equipmentItems.length);
          this.scheduleOnce(function () {
            _this3.moveAllEquipmentsToSlots();
          }, 2);
        }

        // 创建随机装备 - 修复版
        ;

        _proto.createRandomEquipment = function createRandomEquipment(index) {
          try {
            console.log("\u521B\u5EFA\u7B2C " + index + " \u4E2A\u88C5\u5907");
            if (!this.equipmentPrefab) {
              console.error('equipmentPrefab 未设置！');
              return null;
            }
            var equipmentNode = cc.instantiate(this.equipmentPrefab);
            if (!this.equipmentContainer) {
              console.error('equipmentContainer 未设置！');
              equipmentNode.destroy();
              return null;
            }
            this.equipmentContainer.addChild(equipmentNode);

            // 随机位置
            var randomX = 10 + 80 * index;
            var randomY = 0;
            equipmentNode.setPosition(randomX, randomY);

            // 随机装备数据
            var randomType = Math.floor(Math.random() * 13);
            var equipmentInfo = {
              id: Date.now() + index,
              type: randomType,
              name: this.getEquipmentNameByType(randomType),
              icon: "equip_" + randomType,
              attack: Math.floor(Math.random() * 3000) + 1,
              defense: Math.floor(Math.random() * 3000) + 1
            };

            //通知玩家增加装备属性
            if (this.playerNode && this.playerNode.isValid) {
              var playerComp = this.playerNode.getComponent('PlayerController');
              if (playerComp && playerComp.setEquipData) {
                playerComp.setEquipData(equipmentInfo);
              }
            }
            var equipment = equipmentNode.getComponent("EquipmentItem");
            if (equipment && equipment.init) {
              equipment.init(equipmentInfo);

              // 设置装备图标
              this.setEquipmentIcon(equipmentNode, equipmentInfo);

              // 关键修复：将装备添加到 equipmentItems 数组
              this.equipmentItems.push(equipment);
              console.log("\u88C5\u5907 " + equipmentInfo.name + " \u5DF2\u6DFB\u52A0\u5230 equipmentItems, \u5F53\u524D\u957F\u5EA6: " + this.equipmentItems.length);
              return equipment;
            } else {
              console.error('装备预制体没有 EquipmentItem 组件或 init 方法');
              equipmentNode.destroy();
              return null;
            }
          } catch (error) {
            console.error('创建装备时出错:', error);
            return null;
          }
        }

        // 设置装备图标
        ;

        _proto.setEquipmentIcon = function setEquipmentIcon(equipmentNode, equipmentInfo) {
          try {
            var spriteFrame = this.equipmentSprites[equipmentInfo.type];
            if (spriteFrame) {
              // 查找装备图标节点
              var spriteNode = equipmentNode.getChildByName('spriteFrame') || equipmentNode;
              var spriteComp = spriteNode.getComponent(cc.Sprite);
              if (spriteComp) {
                spriteComp.spriteFrame = spriteFrame;
                console.log("\u8BBE\u7F6E\u88C5\u5907 " + equipmentInfo.name + " \u7684\u56FE\u6807\u6210\u529F");
              } else {
                console.warn("\u88C5\u5907\u8282\u70B9\u6CA1\u6709 Sprite \u7EC4\u4EF6: " + equipmentInfo.name);
              }
            } else {
              console.warn("\u6CA1\u6709\u627E\u5230\u7C7B\u578B " + equipmentInfo.type + " \u7684\u88C5\u5907\u56FE\u6807");
            }
          } catch (error) {
            console.error('设置装备图标时出错:', error);
          }
        };
        _proto.getEquipmentNameByType = function getEquipmentNameByType(type) {
          var names = ["青铜剑", "铁头盔", "锁子甲", "皮靴", "皮手套", "银戒指", "金项链", "皮腰带", "木盾", "斗篷", "护身符", "铁护腕", "银耳环"];
          return names[type] || "\u88C5\u5907" + type;
        }

        // 在 GameManager.ts 中修改所有可能访问数组 length 的地方

        // 修改 moveAllEquipmentsToSlots 方法中的数组检查
        ;

        _proto.moveAllEquipmentsToSlots = function moveAllEquipmentsToSlots() {
          var _this4 = this;
          if (this._isMovingAll) {
            console.log('正在移动所有装备，请稍候...');
            //return;
          }

          this._isMovingAll = true;
          this._slotsWithNewEquipment.clear();
          console.log('开始移动所有装备到对应格子');

          // 修复：更安全的数组检查
          if (!this.equipmentItems) {
            console.warn('equipmentItems 为 null');
            this._isMovingAll = false;
            return;
          }
          if (this.equipmentItems.length === 0) {
            console.warn('equipmentItems 为空数组，没有装备可移动');
            this._isMovingAll = false;
            return;
          }
          console.log("\u5171\u6709 " + this.equipmentItems.length + " \u4E2A\u88C5\u5907\u9700\u8981\u79FB\u52A8");
          var movedCount = 0;
          var totalCount = this.equipmentItems.length;

          // 使用 for 循环替代 forEach，更容易控制
          var _loop = function _loop(i) {
            var equipment = _this4.equipmentItems[i];
            if (!equipment) {
              console.warn("\u7B2C " + i + " \u4E2A\u88C5\u5907\u9879\u4E3A null\uFF0C\u8DF3\u8FC7");
              movedCount++;
              return 1; // continue
            }

            // 延迟执行每个装备的移动
            _this4.scheduleOnce(function () {
              _this4.processSingleEquipmentMove(equipment, i, movedCount, totalCount, _this4.equipmentSizeMap, _this4.equipBgSizeMap);
            }, i * 0.1);
          };
          for (var i = 0; i < this.equipmentItems.length; i++) {
            if (_loop(i)) continue;
          }
        }

        // 单独处理单个装备的移动
        ;

        _proto.processSingleEquipmentMove = function processSingleEquipmentMove(equipment, index, movedCount, totalCount, equipmentSizeMap, equipBgSizeMap) {
          try {
            if (!equipment || !equipment.node || !equipment.node.isValid) {
              console.warn("\u88C5\u5907 " + index + " \u65E0\u6548\uFF0C\u8DF3\u8FC7");
              return;
            }
            if (equipment.hasMoved && equipment.hasMoved()) {
              console.log("\u88C5\u5907 " + index + " \u5DF2\u7ECF\u79FB\u52A8\u8FC7\uFF0C\u8DF3\u8FC7");
              return;
            }
            var equipmentInfo = equipment.getEquipmentInfo();
            if (!equipmentInfo) {
              console.warn("\u88C5\u5907 " + index + " \u6CA1\u6709\u88C5\u5907\u4FE1\u606F\uFF0C\u8DF3\u8FC7");
              return;
            }

            // 修复：安全的数组访问
            if (!this._equipmentSlots) {
              console.warn('_equipmentSlots 为 null');
              return;
            }
            var targetSlot = this._equipmentSlots[equipmentInfo.type];
            if (!targetSlot) {
              console.warn("\u672A\u627E\u5230\u7C7B\u578B " + equipmentInfo.type + " \u7684\u88C5\u5907\u683C\u5B50");
              return;
            }

            // 记录有新装备的格子
            this._slotsWithNewEquipment.add(equipmentInfo.type);

            // 使用安全的移动方法
            this.safeMoveEquipment(equipment, equipmentInfo, targetSlot, equipmentSizeMap, equipBgSizeMap, function () {
              var newMovedCount = movedCount + 1;
              console.log("\u88C5\u5907\u79FB\u52A8\u5B8C\u6210: " + equipmentInfo.name + " (" + newMovedCount + "/" + totalCount + ")");
            });
          } catch (error) {
            console.error("\u5904\u7406\u88C5\u5907 " + index + " \u79FB\u52A8\u65F6\u51FA\u9519:", error);
          }
        }

        // 处理装备穿戴 - 修复版
        ;

        _proto.handleEquipmentEquip = function handleEquipmentEquip(equipmentInfo, targetSlot, equipmentNode) {
          // 如果该位置已有装备，先处理旧装备
          var oldEquipment = this._currentEquipments.get(equipmentInfo.type);
          if (oldEquipment) {
            console.log("\u66FF\u6362\u65E7\u88C5\u5907: " + oldEquipment.name);
          }

          // 穿戴新装备
          if (targetSlot.equip) {
            targetSlot.equip(equipmentInfo, equipmentNode);
          } else {
            console.error('targetSlot 没有 equip 方法');
          }
          this._currentEquipments.set(equipmentInfo.type, equipmentInfo);
          console.log("\u88C5\u5907 " + equipmentInfo.name + " \u5DF2\u7A7F\u6234\u5230\u683C\u5B50 " + equipmentInfo.type);
        }

        // 重新开始游戏 - 修复版
        ;

        _proto.restartGame = function restartGame() {
          console.log('重新开始游戏...');

          // 清空格子
          if (this._equipmentSlots) {
            this._equipmentSlots.forEach(function (slot) {
              if (slot && slot.clearSlot) {
                slot.clearSlot();
              }
            });
          }

          // 清空装备记录
          this._currentEquipments.clear();

          // 清空装备容器
          if (this.equipmentContainer) {
            this.equipmentContainer.removeAllChildren();
          }

          // 清空 equipmentItems 数组
          this.equipmentItems = [];
          console.log('清空 equipmentItems 数组');

          // 重新生成装备
          this.spawnRandomEquipments();

          // 重置移动状态
          this._isMovingAll = false;
          console.log('游戏已重新开始');
        }

        // 修改 safeMoveEquipment 方法，添加更详细的错误信息
        // 在 GameManager.ts 中修改 safeMoveEquipment 方法
        ;

        _proto.safeMoveEquipment = function safeMoveEquipment(equipment, equipmentInfo, targetSlot, equipmentSizeMap, equipBgSizeMap, callback) {
          var _this5 = this;
          if (!equipment) {
            console.error('安全移动: 装备为 null');
            callback();
            return;
          }
          if (!equipment.node || !equipment.node.isValid) {
            console.error('安全移动: 装备节点无效');
            callback();
            return;
          }
          if (!targetSlot) {
            console.error('安全移动: 目标格子为 null');
            callback();
            return;
          }
          if (!targetSlot.node || !targetSlot.node.isValid) {
            console.error('安全移动: 目标格子节点无效');
            callback();
            return;
          }
          console.log("\u5B89\u5168\u79FB\u52A8: \u5F00\u59CB\u79FB\u52A8\u88C5\u5907 " + (equipmentInfo ? equipmentInfo.name : '未知') + " \u5230\u683C\u5B50 " + targetSlot.node.name);

          // 记录装备的原始父节点，用于调试
          var originalParent = equipment.node.parent;
          console.log("\u88C5\u5907\u539F\u59CB\u7236\u8282\u70B9: " + (originalParent ? originalParent.name : 'null'));

          // 方法2: 直接移动
          console.log('降级到直接移动方法');
          if (equipment.directMoveToSlot) {
            try {
              equipment.directMoveToSlot(targetSlot.node, equipmentSizeMap, equipBgSizeMap, function () {
                // 移动完成后检查
                if (equipment.node && equipment.node.isValid) {
                  console.log("\u76F4\u63A5\u79FB\u52A8\u540E\u88C5\u5907\u7236\u8282\u70B9: " + (equipment.node.parent ? equipment.node.parent.name : 'null'));
                }
                _this5.handleEquipmentEquip(equipmentInfo, targetSlot, equipment.node);
                callback();
              });
            } catch (error) {
              console.error('直接移动方法出错:', error);
              // 最后的手段
              this.fallbackMove(equipment, equipmentInfo, targetSlot, callback);
            }
          } else {
            this.fallbackMove(equipment, equipmentInfo, targetSlot, callback);
          }
        }

        // 添加最终的备选移动方法
        ;

        _proto.fallbackMove = function fallbackMove(equipment, equipmentInfo, targetSlot, callback) {
          try {
            console.log('使用最终备选移动方法');
            equipment.node.parent = targetSlot.node;
            equipment.node.position = cc.Vec3.ZERO;
            equipment.node.scale = cc.Vec3.ONE;

            // 直接设置移动状态
            if (equipment._hasMoved !== undefined) {
              equipment._hasMoved = true;
            }
            this.handleEquipmentEquip(equipmentInfo, targetSlot, equipment.node);
          } catch (error) {
            console.error('最终备选移动方法也出错:', error);
          } finally {
            callback();
          }
        };
        return GameManager;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "equipmentContainer", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "slotsContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "equipmentPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playerNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "equipmentSprites", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EquipmentData.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1865c2hevtAR7r+oFgqmZ4d", "EquipmentData", undefined);
      // EquipmentData.ts
      var EquipmentType = exports('EquipmentType', /*#__PURE__*/function (EquipmentType) {
        EquipmentType[EquipmentType["WEAPON"] = 0] = "WEAPON";
        EquipmentType[EquipmentType["HELMET"] = 1] = "HELMET";
        EquipmentType[EquipmentType["ARMOR"] = 2] = "ARMOR";
        EquipmentType[EquipmentType["BOOTS"] = 3] = "BOOTS";
        EquipmentType[EquipmentType["GLOVES"] = 4] = "GLOVES";
        EquipmentType[EquipmentType["RING"] = 5] = "RING";
        EquipmentType[EquipmentType["NECKLACE"] = 6] = "NECKLACE";
        EquipmentType[EquipmentType["BELT"] = 7] = "BELT";
        EquipmentType[EquipmentType["SHIELD"] = 8] = "SHIELD";
        EquipmentType[EquipmentType["CLOAK"] = 9] = "CLOAK";
        EquipmentType[EquipmentType["AMULET"] = 10] = "AMULET";
        EquipmentType[EquipmentType["BRACERS"] = 11] = "BRACERS";
        EquipmentType[EquipmentType["EARRING"] = 12] = "EARRING";
        return EquipmentType;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EquipmentDetailPopup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "3b7f1WZ+BpFHLGypZ59ayF8", "EquipmentDetailPopup", undefined);
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var EquipmentDetailPopup = exports('default', (_dec = property(cc.Label), _dec2 = property(cc.Label), _dec3 = property(cc.Label), _dec4 = property(cc.Label), _dec5 = property(cc.Label), _dec6 = property(cc.Label), _dec7 = property(cc.Sprite), _dec8 = property([cc.SpriteFrame]), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(EquipmentDetailPopup, _cc$Component);
        function EquipmentDetailPopup() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "nameLabel", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "levelLabel", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "typeLabel", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "descriptionLabel", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackLabel", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "defLabel", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "iconSprite", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "equipmentSprites", _descriptor8, _assertThisInitialized(_this));
          _this._equipmentInfo = null;
          return _this;
        }
        var _proto = EquipmentDetailPopup.prototype;
        _proto.onLoad = function onLoad() {
          console.log('EquipmentDetailPopup onLoad');
        };
        _proto.init = function init(equipmentInfo) {
          this._equipmentInfo = equipmentInfo;
          this.updateUI();
        };
        _proto.updateUI = function updateUI() {
          if (!this._equipmentInfo) return;

          // 更新UI显示
          if (this.nameLabel) {
            this.nameLabel.string = this._equipmentInfo.name || "未知装备";
          }
          if (this.levelLabel) {
            this.levelLabel.string = "等级: " + (this._equipmentInfo.level || "1");
          }
          if (this.typeLabel) {
            var typeNames = ["武器", "头盔", "盔甲", "靴子", "手套", "戒指", "项链", "腰带", "盾牌", "披风", "护身符", "护腕", "耳环"];
            var typeIndex = this._equipmentInfo.type || 0;
            this.typeLabel.string = "类型: " + (typeNames[typeIndex] || "未知");
          }
          if (this.descriptionLabel) {
            this.descriptionLabel.string = this._equipmentInfo.description || "暂无描述";
          }
          this.attackLabel.string = this._equipmentInfo.attack;
          this.defLabel.string = this._equipmentInfo.defense;

          // 设置装备图标
          if (this.iconSprite && cc.isValid(this.iconSprite.node)) {
            this.iconSprite.node.active = true;

            // 加载装备图标
            //this.loadEquipmentIcon();

            var spriteFrame = this.equipmentSprites[this._equipmentInfo.type];
            if (spriteFrame) {
              // 查找装备图标节点
              var spriteNode = this.iconSprite;
              var spriteComp = spriteNode.getComponent(cc.Sprite);
              if (spriteComp) {
                spriteComp.spriteFrame = spriteFrame;
                var iconTransf = spriteComp.getComponent('cc.UITransform');
                iconTransf.setContentSize(cc.size(60, 60));
                console.log("\u8BBE\u7F6E\u88C5\u5907 " + this._equipmentInfo.name + " \u7684\u56FE\u6807\u6210\u529F");
              } else {
                console.warn("\u88C5\u5907\u8282\u70B9\u6CA1\u6709 Sprite \u7EC4\u4EF6: " + this._equipmentInfo.name);
              }
            } else {
              console.warn("\u6CA1\u6709\u627E\u5230\u7C7B\u578B " + this._equipmentInfo.type + " \u7684\u88C5\u5907\u56FE\u6807");
            }
            console.log('装备图标颜色已设置');
          } else {
            console.warn('装备图标组件未找到');
          }
        };
        _proto.loadEquipmentIcon = function loadEquipmentIcon() {
          var _this2 = this;
          var type = this._equipmentInfo.type || 0;
          var iconName = this._equipmentInfo.icon;
          var iconPath = "equipment/" + iconName;
          cc.resources.load(iconPath, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
              console.error('加载备用图标也失败:', err);
              return;
            }
            if (_this2.iconSprite && cc.isValid(_this2.iconSprite)) {
              _this2.iconSprite.spriteFrame = spriteFrame;
              console.log('备用图标加载成功');
            }
          });
        }

        // 关闭弹窗
        ;

        _proto.onCloseClick = function onCloseClick() {
          this.node.destroy();
        };
        _proto.onDestroy = function onDestroy() {
          console.log('EquipmentDetailPopup destroyed');
        };
        return EquipmentDetailPopup;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nameLabel", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "typeLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "descriptionLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "attackLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "defLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "iconSprite", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "equipmentSprites", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EquipmentItem.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts'], function (exports) {
  var _inheritsLoose, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy, AudioManager;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "40acfAT9n9ExoMccUPciJoz", "EquipmentItem", undefined);
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var EquipmentItem = exports('default', (_dec = property(cc.Sprite), _dec2 = property(cc.Label), _dec3 = property(cc.Node), _dec4 = property(cc.Node), _dec5 = property(cc.Node), _dec6 = property(cc.Node), _dec7 = property(cc.Sprite), _dec8 = property(cc.Prefab), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(EquipmentItem, _cc$Component);
        function EquipmentItem() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "icon", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "nameLabel", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "background", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "qualityFrame", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "red_eff", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "gold_eff", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "equipmentSprite", _descriptor7, _assertThisInitialized(_this));
          // 添加弹窗相关属性
          _initializerDefineProperty(_this, "equipmentDetailPrefab", _descriptor8, _assertThisInitialized(_this));
          // 装备详情弹窗预制体
          _this._equipmentInfo = null;
          _this._hasMoved = false;
          _this._originalParent = null;
          _this._originalPosition = cc.Vec3.ZERO;
          _this._originalScale = cc.Vec3.ZERO;
          // 添加移动状态跟踪
          _this._isMoving = false;
          _this._detailPopup = null;
          // 当前详情弹窗实例
          _this.equipShowNode = null;
          return _this;
        }
        var _proto = EquipmentItem.prototype;
        // 添加layer的父节点
        _proto.onLoad = function onLoad() {
          console.log('EquipmentItem onLoad, 节点:', this.node.name);

          // // 记录原始父节点、位置和缩放
          this._originalParent = this.node.parent;
          this._originalPosition = this.node.position.clone();
          this._originalScale = this.node.scale.clone();
          //
          // // 确保节点属性正确
          this.node.active = true;
          this.node.opacity = 255;

          // 初始化时隐藏品质框
          if (this.qualityFrame && cc.isValid(this.qualityFrame)) {
            this.qualityFrame.active = false;
            console.log('初始化隐藏品质框');
          }

          // 初始化
          if (this.gold_eff && cc.isValid(this.gold_eff)) {
            this.gold_eff.active = true;
            var animation = this.gold_eff.getComponent(cc.Animation);
            // animation.play();

            setTimeout(function () {
              animation.play();
            }, 0);
            console.log('初始化显示光效');
          }

          // 添加按钮组件以确保点击事件正常工作
          var button = this.getComponent(cc.Button) || this.node.addComponent(cc.Button);
          if (button) {
            button.interactable = true;
          }

          // 添加触摸事件
          this.addTouchListener();
          console.log('EquipmentItem 初始化完成');
        };
        _proto.onDestroy = function onDestroy() {
          // 安全地移除事件监听
          if (this.node && this.node.isValid) {
            this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
          }

          // 重置移动状态
          this._isMoving = false;
        }

        // 添加触摸事件监听的方法
        ;

        _proto.addTouchListener = function addTouchListener() {
          // 先安全移除可能存在的监听
          if (this.node && this.node.isValid) {
            this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
          }

          // 检查节点是否有效
          if (!this.node || !this.node.isValid) {
            console.warn('无法添加触摸事件：节点无效');
            return;
          }

          // 添加新的监听
          this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);

          // 确保节点可交互
          this.node.active = true;
          this.node.opacity = 255;
        };
        _proto.init = function init(equipmentInfo) {
          if (!equipmentInfo) {
            console.error('EquipmentItem.init: equipmentInfo 为空');
            return;
          }
          console.log('初始化装备:', equipmentInfo);
          this._equipmentInfo = equipmentInfo;
          this._hasMoved = false;

          // 重置节点状态
          this.node.scale = this._originalScale;
          this.node.opacity = 255;
          this.node.active = true;

          // 设置装备图标
          if (this.equipmentSprite && cc.isValid(this.equipmentSprite.node)) {
            this.equipmentSprite.node.color = this.getColorByType(equipmentInfo.type);
            this.equipmentSprite.node.active = true;
            console.log('装备图标颜色已设置');
          } else {
            console.warn('装备图标组件未找到');
          }

          // 设置名称标签
          if (this.nameLabel && cc.isValid(this.nameLabel.node)) {
            var displayName = equipmentInfo.name || "未知装备";
            this.nameLabel.string = "Lv.20";
            this.nameLabel.node.active = true;
            console.log('名称标签已设置:', displayName);
          } else {
            console.warn('名称标签未找到');
          }

          // 确保品质框是隐藏的
          if (this.qualityFrame && cc.isValid(this.qualityFrame)) {
            this.qualityFrame.active = false;
          }

          // 确保触摸事件已添加
          this.addTouchListener();
          console.log('装备初始化完成，品质框已隐藏');
        };
        _proto.getColorByType = function getColorByType(type) {
          var safeType = type !== undefined && type !== null ? type : 0;
          var colors = [cc.Color.RED,
          // 武器
          cc.Color.BLUE,
          // 头盔
          cc.Color.GREEN,
          // 盔甲
          cc.Color.YELLOW,
          // 靴子
          cc.Color.ORANGE,
          // 手套
          cc.Color.MAGENTA,
          // 戒指
          cc.Color.CYAN,
          // 项链
          cc.Color.GRAY,
          // 腰带
          cc.Color.BROWN,
          // 盾牌
          cc.Color.BLACK,
          // 披风
          cc.Color.WHITE,
          // 护身符
          cc.Color.ORANGE,
          // 护腕
          cc.Color.MAGENTA // 耳环
          ];

          var index = Math.max(0, Math.min(safeType, colors.length - 1));
          return colors[index] || cc.Color.WHITE;
        }

        // 点击事件
        ;

        _proto.onClick = function onClick(event) {
          console.log('装备被点击, 通知移动所有装备');
          if (!this._hasMoved) {
            // 查找GameManager
            var gameManagerNode = cc.find("Canvas/equipLayer");
            if (gameManagerNode && gameManagerNode.isValid) {
              var gameManager = gameManagerNode.getComponent("EquipManager");
              if (gameManager && typeof gameManager.moveAllEquipmentsToSlots === 'function') {
                gameManager.moveAllEquipmentsToSlots();
              } else {
                console.error("GameManager 组件未找到或 moveAllEquipmentsToSlots 方法不存在");
              }
            } else {
              console.error("GameManager 节点未找到或无效");
            }
          } else {
            // 如果已经移动，弹出详情窗口
            console.log('弹出装备详情窗口');
            this.showEquipmentDetail();
          }
        }

        // 显示装备详情弹窗
        ;

        _proto.showEquipmentDetail = function showEquipmentDetail() {
          if (!this.equipmentDetailPrefab) {
            console.error('装备详情弹窗预制体未设置');
            return;
          }

          // 如果已经存在弹窗，先关闭
          if (this._detailPopup && cc.isValid(this._detailPopup)) {
            this._detailPopup.destroy();
          }

          // 创建弹窗实例
          this._detailPopup = cc.instantiate(this.equipmentDetailPrefab);
          this.equipShowNode = this.node.parent.parent.parent.getChildByName("equipShowLayer");
          // 添加到Canvas
          var canvas = this.equipShowNode;
          if (canvas && canvas.isValid) {
            canvas.addChild(this._detailPopup);

            // 设置弹窗位置（屏幕中央）
            this._detailPopup.setPosition(cc.Vec3.ZERO);

            // 初始化弹窗内容
            var detailScript = this._detailPopup.getComponent("EquipmentDetailPopup");
            if (detailScript && typeof detailScript.init === 'function') {
              detailScript.init(this._equipmentInfo);
            }

            // 添加关闭按钮监听
            this.setupPopupCloseListener();
            console.log('装备详情弹窗已显示');
          } else {
            console.error('Canvas节点未找到');
          }
        }

        // 设置弹窗关闭监听
        ;

        _proto.setupPopupCloseListener = function setupPopupCloseListener() {
          var _this2 = this;
          if (!this._detailPopup || !this._detailPopup.isValid) return;

          // 查找关闭按钮
          var closeButton = this._detailPopup.getChildByName('closeButton');
          if (closeButton && closeButton.isValid) {
            closeButton.on(cc.Node.EventType.TOUCH_END, function () {
              _this2.closeDetailPopup();
            }, this);
          }

          // 添加背景点击关闭（可选）
          var background = this._detailPopup.getChildByName('Layout');
          if (background && background.isValid) {
            background.on(cc.Node.EventType.TOUCH_END, function () {
              _this2.closeDetailPopup();
            }, this);
          }
        }

        // 关闭详情弹窗
        ;

        _proto.closeDetailPopup = function closeDetailPopup() {
          if (this._detailPopup && cc.isValid(this._detailPopup)) {
            this._detailPopup.destroy();
            this._detailPopup = null;
            console.log('装备详情弹窗已关闭');
          }
        }

        // 直接移动到装备格（无动画）- 修复版
        ;

        _proto.directMoveToSlot = function directMoveToSlot(slotNode, equipmentSizeMap, equipBgSizeMap, callback) {
          var _this3 = this;
          if (!this.node || !this.node.isValid) {
            console.error('节点无效');
            if (callback) callback();
            return;
          }
          if (this._hasMoved) {
            console.log('已经移动过');
            if (callback) callback();
            return;
          }
          if (!slotNode || !slotNode.isValid) {
            console.error('目标节点无效');
            if (callback) callback();
            return;
          }
          console.log('使用直接移动方法到:', slotNode.name);
          this._hasMoved = true;

          // 移除事件监听
          this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);

          // 重新添加点击监听，用于显示详情
          setTimeout(function () {
            _this3.addTouchListener();
          }, 100); // 延迟一点时间确保移动完成

          // 禁用交互
          var button = this.getComponent(cc.Button);
          if (button) {
            button.interactable = false;
          }
          var size = equipmentSizeMap.get(this._equipmentInfo.type);
          var sizeBg = equipBgSizeMap.get(this._equipmentInfo.type);

          // 显示品质框
          if (this.qualityFrame && cc.isValid(this.qualityFrame)) {
            this.qualityFrame.active = true;
            if (size && sizeBg) {
              // 设置UI组件的大小（如果有UITransform组件）
              var uiTransform_bg = this.qualityFrame.getComponent('cc.UITransform');
              var uiTransform_sp = this.equipmentSprite.getComponent('cc.UITransform');
              if (uiTransform_bg && uiTransform_sp) {
                uiTransform_bg.setContentSize(sizeBg);
                uiTransform_sp.setContentSize(size);
              }
            }
          }

          //隐藏特效 柱子
          if (this.gold_eff && cc.isValid(this.gold_eff)) {
            this.gold_eff.active = false;
          }
          this.startMove(slotNode);
          console.log('装备已直接放置到装备格:', slotNode.name);
          console.log('最终位置:', this.node.position.toString());
          if (callback) callback();
        };
        _proto.startMove = function startMove(slotNode) {
          // 停止所有正在进行的动画
          cc.Tween.stopAllByTarget(this.node);

          // 记录起始位置
          var startPosition = this.node.position.clone();

          // 创建动画序列
          cc.tween(this.node)
          // 第一阶段：放大
          .to(0.2, {
            scale: new cc.Vec3(1.3, 1.3, 1.3)
          })
          // 第二阶段：缩小回原始大小
          .to(0.2, {
            scale: new cc.Vec3(1, 1, 1)
          })
          // 第三阶段：移动到目标位置 (0,0)
          .call(function () {
            // 这里可以添加回调，比如播放音效等
            console.log('开始移动到中心位置');
          }).to(0.2, {
            position: cc.Vec3.ZERO
          })
          // 第四阶段：移动到槽位位置
          .call(function () {
            console.log('开始移动到槽位位置');
            AudioManager.instance.playSound("euqip_fly");
          }).to(0.1, {
            position: slotNode.position.clone()
          }, {
            easing: 'cubicOut'
          })
          // 第五阶段：按压效果 - 快速缩小
          .to(0.4, {
            scale: new cc.Vec3(0.9, 0.9, 0.9)
          }, {
            easing: 'sineIn'
          })
          // 第六阶段：恢复原始大小
          .to(0.4, {
            scale: new cc.Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          })
          // 动画完成回调
          .call(function () {
            //this.onAnimationComplete();
          }).start();
        }

        // 重置装备状态
        ;

        _proto.reset = function reset() {
          this._hasMoved = false;
          this._isMoving = false;

          // 安全检查
          if (this.node && this.node.isValid) {
            this.node.scale = this._originalScale;
            this.node.opacity = 255;
          }

          // 隐藏品质框
          if (this.qualityFrame && cc.isValid(this.qualityFrame)) {
            this.qualityFrame.active = false;
          }

          // 重新添加触摸监听（移动逻辑）
          this.addTouchListener();

          // 关闭可能存在的弹窗
          this.closeDetailPopup();
        }

        // 获取装备信息
        ;

        _proto.getEquipmentInfo = function getEquipmentInfo() {
          return this._equipmentInfo;
        }

        // 检查是否已经移动过
        ;

        _proto.hasMoved = function hasMoved() {
          return this._hasMoved;
        }

        // 获取品质框节点
        ;

        _proto.getQualityFrame = function getQualityFrame() {
          return this.qualityFrame;
        }

        // 调试坐标系统
        ;

        _proto.debugCoordinateSystem = function debugCoordinateSystem(slotNode) {
          if (!this.node || !slotNode) return;
          console.log('=== 坐标系统调试 ===');
          console.log(this.node);
          //console.log(this.node.convertToWorldSpaceAR);
          console.log('装备世界坐标:', this.node.worldPosition.toString());
          console.log('装备本地坐标:', this.node.position.toString());
          console.log('装备格世界坐标:', slotNode.worldPosition.toString());
          console.log('装备格本地坐标:', slotNode.position.toString());
          console.log('装备当前父节点:', this.node.parent ? this.node.parent.name : 'null');
          console.log('目标父节点:', slotNode.name);
          console.log('==================');
        };
        return EquipmentItem;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nameLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "background", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "qualityFrame", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "red_eff", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "gold_eff", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "equipmentSprite", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "equipmentDetailPrefab", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EquipmentSlot.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "e1d2fCvIyVEcKIVNOk2YFCZ", "EquipmentSlot", undefined);
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var EquipmentSlot = exports('default', (_dec = property(cc.Sprite), _dec2 = property(cc.Label), _dec3 = property(cc.Node), _dec4 = property(cc.Label), _dec5 = property(cc.Node), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(EquipmentSlot, _cc$Component);
        function EquipmentSlot() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "icon", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "nameLabel", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "emptyHint", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "typeLabel", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "equipmentContainer", _descriptor5, _assertThisInitialized(_this));
          _this._equipmentId = -1;
          _this._slotType = 0;
          _this._currentEquipment = null;
          // 添加动画状态跟踪
          _this._isPlayingEffect = false;
          _this._effectStartTime = 0;
          _this._effectDuration = 0;
          _this._originalScale = cc.Vec3.ONE;
          _this._originalColor = new cc.Color(255, 255, 255);
          return _this;
        }
        var _proto = EquipmentSlot.prototype;
        _proto.onLoad = function onLoad() {
          console.log('EquipmentSlot onLoad:', this.node.name);

          // 记录原始状态
          this._originalScale = this.node.scale.clone();
          this._originalColor = this.node.color ? this.node.color.clone() : new cc.Color(255, 255, 255);
          this.safeClearSlot();

          // 如果没有指定装备容器，默认使用当前节点
          if (!this.equipmentContainer) {
            this.equipmentContainer = this.node;
          }
        };
        _proto.update = function update(dt) {
          this.updateEffectAnimation();
        }

        // 更新特效动画
        ;

        _proto.updateEffectAnimation = function updateEffectAnimation() {
          if (!this._isPlayingEffect || !this.node || !this.node.isValid) {
            return;
          }
          var currentTime = Date.now();
          var elapsed = (currentTime - this._effectStartTime) / 1000;
          var progress = Math.min(elapsed / this._effectDuration, 1);
          if (progress < 1) {
            // 缩放动画序列
            if (progress < 0.25) {
              // 第一阶段：缩小到0.8
              var scaleProgress = progress / 0.25;
              var scale = 1 - 0.2 * scaleProgress; // 1.0 -> 0.8
              this.node.scale = new cc.Vec3(scale, scale, 1);
            } else if (progress < 0.5) {
              // 第二阶段：放大到1.1
              var _scaleProgress = (progress - 0.25) / 0.25;
              var _scale = 0.8 + 0.3 * _scaleProgress; // 0.8 -> 1.1
              this.node.scale = new cc.Vec3(_scale, _scale, 1);
            } else {
              // 第三阶段：恢复到1.0
              var _scaleProgress2 = (progress - 0.5) / 0.5;
              var _scale2 = 1.1 - 0.1 * _scaleProgress2; // 1.1 -> 1.0
              this.node.scale = new cc.Vec3(_scale2, _scale2, 1);
            }

            // 颜色闪烁效果
            if (progress < 0.33) {
              // 第一阶段：变绿色
              var colorProgress = progress / 0.33;
              var r = Math.floor(255 - 155 * colorProgress); // 255 -> 100
              var g = 255;
              var b = Math.floor(255 - 155 * colorProgress); // 255 -> 100
              this.node.color = new cc.Color(r, g, b);
            } else {
              // 第二阶段：恢复原色
              var _colorProgress = (progress - 0.33) / 0.67;
              var _r = Math.floor(100 + 155 * _colorProgress); // 100 -> 255
              var _g = 255;
              var _b = Math.floor(100 + 155 * _colorProgress); // 100 -> 255
              this.node.color = new cc.Color(_r, _g, _b);
            }
          } else {
            // 动画完成，确保恢复原始状态
            this.node.scale = this._originalScale;
            this.node.color = this._originalColor;
            this._isPlayingEffect = false;
          }
        }

        // 安全的清空格子方法
        ;

        _proto.safeClearSlot = function safeClearSlot() {
          this._equipmentId = -1;

          // 移除当前装备节点
          if (this._currentEquipment && cc.isValid(this._currentEquipment)) {
            this._currentEquipment.destroy();
            this._currentEquipment = null;
          }

          // 安全检查 icon 和 emptyHint
          if (this.icon && cc.isValid(this.icon.node)) {
            this.icon.node.active = false;
          }
          if (this.nameLabel && cc.isValid(this.nameLabel.node)) {
            this.nameLabel.string = "";
          }
          if (this.emptyHint && cc.isValid(this.emptyHint)) {
            this.emptyHint.active = true;
          }
          this.updateTypeLabel();
        }

        // 设置格子类型
        ;

        _proto.setSlotType = function setSlotType(type) {
          // 添加类型检查
          var safeType = type !== undefined && type !== null ? type : 0;
          this._slotType = safeType;
          this.updateTypeLabel();
        }

        // 更新类型显示
        ;

        _proto.updateTypeLabel = function updateTypeLabel() {
          if (this.typeLabel && cc.isValid(this.typeLabel.node)) {
            var typeNames = ["武器", "头盔", "盔甲", "靴子", "手套", "戒指", "项链", "腰带", "盾牌", "披风", "护身符", "护腕", "耳环"];

            // 确保类型在数组范围内
            var index = Math.max(0, Math.min(this._slotType, typeNames.length - 1));
            this.typeLabel.string = typeNames[index] || "\u7C7B\u578B" + this._slotType;
          }
        }

        // 获取格子类型
        ;

        _proto.getSlotType = function getSlotType() {
          return this._slotType;
        }

        // 装备穿戴到格子 - 增强版，支持装备节点传入
        ;

        _proto.equip = function equip(equipmentInfo, equipmentNode) {
          // 添加空值检查
          if (!equipmentInfo) {
            console.error('equip 方法接收到空的装备信息');
            return;
          }
          this._equipmentId = equipmentInfo.id || -1;

          // 如果有传入装备节点，则处理节点
          if (equipmentNode && cc.isValid(equipmentNode)) {
            this.handleEquipmentNode(equipmentNode, equipmentInfo);
          } else {
            // 否则使用默认的图标显示
            this.showDefaultIcon(equipmentInfo);
          }

          // 更新界面显示
          this.updateSlotDisplay(equipmentInfo);

          // 穿戴时的按压效果
          this.playEquipEffect();
          console.log("\u88C5\u5907 " + equipmentInfo.name + " \u5DF2\u6210\u529F\u7A7F\u6234\u5230\u683C\u5B50");
        }

        // 处理装备节点 - 增强版
        ;

        _proto.handleEquipmentNode = function handleEquipmentNode(equipmentNode, equipmentInfo) {
          // 移除旧的装备节点
          if (this._currentEquipment && cc.isValid(this._currentEquipment)) {
            this._currentEquipment.destroy();
          }

          // 设置新的装备节点
          this._currentEquipment = equipmentNode;

          // 将装备节点放入容器
          if (this.equipmentContainer && cc.isValid(this.equipmentContainer)) {
            equipmentNode.parent = this.equipmentContainer;
          } else {
            equipmentNode.parent = this.node;
          }
          equipmentNode.setPosition(cc.Vec3.ZERO);

          // 调整装备节点的最终状态
          equipmentNode.scale = cc.Vec3.ONE;
          equipmentNode.opacity = 255;

          // 确保装备的品质框正确显示
          var equipmentItem = equipmentNode.getComponent("EquipmentItem");
          if (equipmentItem && equipmentItem.getQualityFrame) {
            var qualityFrame = equipmentItem.getQualityFrame();
            if (qualityFrame && cc.isValid(qualityFrame)) {
              qualityFrame.active = true;
              qualityFrame.scale = cc.Vec3.ONE;
            }
          }
          console.log('装备节点已成功放置到装备格容器');
        }

        // 显示默认图标
        ;

        _proto.showDefaultIcon = function showDefaultIcon(equipmentInfo) {
          if (this.icon && cc.isValid(this.icon.node)) {
            this.icon.node.color = this.getColorByType(equipmentInfo.type);
            this.icon.node.active = true;
          }
        }

        // 更新格子显示
        ;

        _proto.updateSlotDisplay = function updateSlotDisplay(equipmentInfo) {
          if (this.nameLabel && cc.isValid(this.nameLabel.node)) {
            this.nameLabel.string = equipmentInfo.name || "未知装备";
          }
          if (this.emptyHint && cc.isValid(this.emptyHint)) {
            this.emptyHint.active = false;
          }
        }

        // 根据装备类型获取颜色
        ;

        _proto.getColorByType = function getColorByType(type) {
          // 添加类型范围检查
          var safeType = type !== undefined && type !== null ? type : 0;
          var colors = [cc.Color.RED,
          // 武器 - 红色
          cc.Color.BLUE,
          // 头盔 - 蓝色
          cc.Color.GREEN,
          // 盔甲 - 绿色
          cc.Color.YELLOW,
          // 靴子 - 黄色
          cc.Color.ORANGE,
          // 手套 - 橙色
          cc.Color.MAGENTA,
          // 戒指 - 紫色
          cc.Color.CYAN,
          // 项链 - 青色
          cc.Color.GRAY,
          // 腰带 - 灰色
          cc.Color.BROWN,
          // 盾牌 - 棕色
          cc.Color.BLACK,
          // 披风 - 黑色
          cc.Color.WHITE,
          // 护身符 - 白色
          cc.Color.ORANGE,
          // 护腕 - 橙色
          cc.Color.MAGENTA // 耳环 - 紫色
          ];

          // 确保类型在数组范围内
          var index = Math.max(0, Math.min(safeType, colors.length - 1));
          return colors[index] || cc.Color.WHITE;
        }

        // 清空格子
        ;

        _proto.clearSlot = function clearSlot() {
          this.safeClearSlot();
        }

        // 按压效果动画 - 修复版，避免使用 Tween
        ;

        _proto.playEquipEffect = function playEquipEffect() {
          if (!cc.isValid(this.node)) return;

          // 如果正在播放动画，先停止
          if (this._isPlayingEffect) {
            // 重置到原始状态
            this.node.scale = this._originalScale;
            this.node.color = this._originalColor;
          }

          // 开始新的动画
          this._isPlayingEffect = true;
          this._effectStartTime = Date.now();
          this._effectDuration = 0.4; // 总持续时间0.4秒

          console.log('开始播放装备穿戴特效');
        }

        // 简化的按压效果（无动画版本）
        ;

        _proto.playSimpleEquipEffect = function playSimpleEquipEffect() {
          var _this2 = this;
          if (!cc.isValid(this.node)) return;
          console.log('播放简化装备穿戴特效');

          // 直接设置一个闪烁效果，然后恢复
          var originalColor = this.node.color ? this.node.color.clone() : new cc.Color(255, 255, 255);

          // 立即设置为绿色
          this.node.color = new cc.Color(100, 255, 100);

          // 0.3秒后恢复原色
          this.scheduleOnce(function () {
            if (_this2.node && _this2.node.isValid) {
              _this2.node.color = originalColor;
            }
          }, 0.3);
        }

        // 获取装备ID
        ;

        _proto.getEquipmentId = function getEquipmentId() {
          return this._equipmentId;
        }

        // 检查是否为空
        ;

        _proto.isEmpty = function isEmpty() {
          return this._equipmentId === -1;
        }

        // 获取当前装备节点
        ;

        _proto.getCurrentEquipment = function getCurrentEquipment() {
          return this._currentEquipment;
        }

        // 新增：获取装备容器节点
        ;

        _proto.getEquipmentContainer = function getEquipmentContainer() {
          return this.equipmentContainer || this.node;
        };
        _proto.onDestroy = function onDestroy() {
          // 重置动画状态
          this._isPlayingEffect = false;
        };
        return EquipmentSlot;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nameLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "emptyHint", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "typeLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "equipmentContainer", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ExperienceManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _createClass, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3;
      cclegacy._RF.push({}, "e5362cBNolH3IpTnKi7Jjpc", "ExperienceManager", undefined);
      // ExperienceManager.ts
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var ExperienceManager = exports('default', (_dec = property(cc.ProgressBar), _dec2 = property(cc.Label), _dec3 = property(cc.Label), _dec4 = property(cc.Node), ccclass(_class = (_class2 = (_class3 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(ExperienceManager, _cc$Component);
        function ExperienceManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          // 当前经验值和等级
          _this._currentExp = 0;
          _this._currentLevel = 1;
          // 升级所需经验公式
          _this._baseExpRequired = 100;
          _this._expMultiplier = 1.5;
          // UI组件
          _initializerDefineProperty(_this, "expProgressBar", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "levelLabel", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "expLabel", _descriptor3, _assertThisInitialized(_this));
          // 直接引用 GameManager
          _initializerDefineProperty(_this, "gameManagerNode", _descriptor4, _assertThisInitialized(_this));
          _this.gameManager = null;
          return _this;
        }
        var _proto = ExperienceManager.prototype;
        _proto.onLoad = function onLoad() {
          if (ExperienceManager._instance === null) {
            ExperienceManager._instance = this;
            cc.game.addPersistRootNode(this.node);
            console.log('ExperienceManager 初始化完成');
          } else {
            this.destroy();
            return;
          }

          // 获取 GameManager 引用
          if (this.gameManagerNode) {
            this.gameManager = this.gameManagerNode.getComponent('GameManager');
          }

          // 如果没找到，尝试自动查找
          if (!this.gameManager) {
            var gameManagerNodes = cc.director.getScene().getComponentsInChildren('GameManager');
            if (gameManagerNodes.length > 0) {
              this.gameManager = gameManagerNodes[0];
            }
          }
          if (this.gameManager) {
            console.log('找到 GameManager 引用');
          } else {
            console.warn('未找到 GameManager 引用');
          }
          this.updateUI();
        };
        _proto.onDestroy = function onDestroy() {
          if (ExperienceManager._instance === this) {
            ExperienceManager._instance = null;
          }
        }

        // 获取当前等级升级所需的总经验
        ;

        _proto.getExpRequiredForLevel = function getExpRequiredForLevel(level) {
          return Math.floor(this._baseExpRequired * level * this._expMultiplier);
        }

        // 添加经验值
        ;

        _proto.addExp = function addExp(exp) {
          console.log("\u83B7\u5F97 " + exp + " \u70B9\u7ECF\u9A8C\u503C");
          this._currentExp += exp;

          // 检查是否升级
          var expRequired = this.getExpRequiredForLevel(this._currentLevel);
          var levelUps = 0;
          while (this._currentExp >= expRequired && expRequired > 0) {
            // 升级
            this._currentExp -= expRequired;
            this._currentLevel++;
            levelUps++;
            console.log("\u5347\u7EA7\u5230 " + this._currentLevel + " \u7EA7!");

            // 直接调用 GameManager 的方法
            if (this.gameManager && this.gameManager.onPlayerLevelUp) {
              this.gameManager.onPlayerLevelUp(this._currentLevel);
            } else {
              console.warn('无法调用 GameManager 的升级方法');
            }

            // 获取下一级所需经验
            expRequired = this.getExpRequiredForLevel(this._currentLevel);
          }
          if (levelUps > 0) {
            console.log("\u672C\u6B21\u5171\u5347\u7EA7 " + levelUps + " \u6B21");
          }
          this.updateUI();
        }

        // 更新UI显示
        ;

        _proto.updateUI = function updateUI() {
          if (this.expProgressBar) {
            var expRequired = this.getExpRequiredForLevel(this._currentLevel);
            var progress = expRequired > 0 ? this._currentExp / expRequired : 1;
            this.expProgressBar.progress = progress;
          }
          if (this.levelLabel) {
            this.levelLabel.string = "Lv." + this._currentLevel;
          }
          if (this.expLabel) {
            var _expRequired = this.getExpRequiredForLevel(this._currentLevel);
            this.expLabel.string = this._currentExp + "/" + _expRequired;
          }
        }

        // 显示获得经验提示（可选）
        ;

        _proto.showExpGain = function showExpGain(exp) {
          // 可以在这里实现获得经验的飘字效果
          console.log("\u83B7\u5F97 " + exp + " \u70B9\u7ECF\u9A8C\u503C");
        }

        // 获取当前等级
        ;

        _proto.getCurrentLevel = function getCurrentLevel() {
          return this._currentLevel;
        }

        // 获取当前经验
        ;

        _proto.getCurrentExp = function getCurrentExp() {
          return this._currentExp;
        }

        // 重置经验系统（用于重新开始游戏）
        ;

        _proto.reset = function reset() {
          this._currentExp = 0;
          this._currentLevel = 1;
          this.updateUI();
        };
        _createClass(ExperienceManager, null, [{
          key: "instance",
          get: function get() {
            return ExperienceManager._instance;
          }
        }]);
        return ExperienceManager;
      }(cc.Component), _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "expProgressBar", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "expLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gameManagerNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ExperienceManager.ts', './HealthBar.ts', './AudioManager.ts'], function (exports) {
  var _inheritsLoose, _createForOfIteratorHelperLoose, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy, ExperienceManager, HealthBar, AudioManager;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ExperienceManager = module.default;
    }, function (module) {
      HealthBar = module.HealthBar;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15;
      cclegacy._RF.push({}, "dc560cqUAhFRINbjgKiI3Ae", "GameManager", undefined);
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var GameManager = exports('default', (_dec = property(cc.Node), _dec2 = property(cc.Prefab), _dec3 = property(cc.Prefab), _dec4 = property(cc.Node), _dec5 = property(cc.Node), _dec6 = property(cc.Node), _dec7 = property(cc.Label), _dec8 = property(cc.Label), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(GameManager, _cc$Component);
        function GameManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "startLayerNode", _descriptor, _assertThisInitialized(_this));
          // 在编辑器中拖拽选人界面节点到这里
          _initializerDefineProperty(_this, "monsterPrefab", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "monsterBossPrefab", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "playerNode", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "playerNode1", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "monsterContainer", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "levelLabel", _descriptor7, _assertThisInitialized(_this));
          // 显示当前关卡的UI
          _initializerDefineProperty(_this, "countdownLabel", _descriptor8, _assertThisInitialized(_this));
          // 显示倒计时的UI
          _initializerDefineProperty(_this, "spawnDelay", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spawnX", _descriptor10, _assertThisInitialized(_this));
          // 屏幕右侧外
          _initializerDefineProperty(_this, "spawnY", _descriptor11, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "expPerMonster", _descriptor12, _assertThisInitialized(_this));
          // 每只怪物提供的经验值
          _initializerDefineProperty(_this, "healthIncreasePerKill", _descriptor13, _assertThisInitialized(_this));
          // 每击杀一个怪物增加的血量
          _initializerDefineProperty(_this, "baseCountdown", _descriptor14, _assertThisInitialized(_this));
          // 基础倒计时10秒
          _initializerDefineProperty(_this, "countdownIncreasePerKill", _descriptor15, _assertThisInitialized(_this));
          // 每击杀一个怪增加0.1秒
          _this.healthBar = null;
          _this.monsters = [];
          _this.isSpawning = false;
          _this.currentMonsterHealth = 0;
          // 当前怪物血量
          _this.currentLevel = 1;
          // 当前关卡
          _this.currentCountdown = 0;
          // 当前倒计时
          _this.isCountingDown = false;
          // 是否正在倒计时
          _this.killCount = 0;
          // 当前关卡击杀数量
          _this.currentMonster = null;
          // 当前关卡的怪物
          _this.monstersKilledThisLevel = 0;
          // 当前关卡已击杀怪物数量
          _this.totalMonstersThisLevel = 0;
          // 当前关卡总怪物数量
          _this.selectedCharacter = 0;
          _this.startLayer = null;
          return _this;
        }
        var _proto = GameManager.prototype;
        _proto.onLoad = function onLoad() {
          // 检查必要的节点是否已赋值
          if (!this.playerNode) {
            cc.error("PlayerNode is not assigned in GameManager!");
            return;
          }
          if (!this.monsterPrefab) {
            cc.error("MonsterPrefab is not assigned in GameManager!");
            return;
          }
          if (!this.monsterContainer) {
            cc.error("MonsterContainer is not assigned in GameManager!");
            return;
          }

          // 确保GameManager在场景切换时不被销毁
          cc.director.addPersistRootNode(this.node);
          AudioManager.instance.preloadSound('voc_click');
          AudioManager.instance.preloadSound('voc_lvup');
          AudioManager.instance.preloadSound('voc_warn');
          AudioManager.instance.playMusic("bgm0");

          // 初始化监听
          this.initEventListeners();

          // 初始化怪物血量
          this.currentMonsterHealth = 100;

          // 开始第一关
          //this.startLevel(1);

          // 监听升级事件
          if (ExperienceManager.instance) {
            ExperienceManager.instance.onLevelUp = this.onPlayerLevelUp.bind(this);
          }
          this.node.on('character-selected', this.getCurrentCharater, this);
          this.setupErrorHandling();
        };
        _proto.initEventListeners = function initEventListeners() {
          if (this.startLayerNode) {
            // 监听选人界面的选择完成事件
            this.startLayerNode.on('character-selected', this.onCharacterSelected, this);

            // 获取startLayer组件
            this.startLayer = this.startLayerNode.getComponent('startLayer');
          }
        };
        _proto.onCharacterSelected = function onCharacterSelected(characterId) {
          this.selectedCharacter = characterId;
          console.log("GameManager: \u73A9\u5BB6\u9009\u62E9\u4E86\u89D2\u8272 " + characterId);

          // 在这里执行GameManager需要处理的逻辑
          this.handleCharacterSelection(characterId);
        };
        _proto.handleCharacterSelection = function handleCharacterSelection(characterId) {
          // 根据选择的角色执行不同的逻辑
          switch (characterId) {
            case 1:
              console.log("执行角色1的相关逻辑");
              this.playerNode.active = true;
              this.playerNode1.active = false;
              // 例如：加载角色1的资源、设置游戏参数等
              break;
            case 2:
              console.log("执行角色2的相关逻辑");
              this.playerNode.active = false;
              this.playerNode1.active = true;
              // 例如：加载角色2的资源、设置游戏参数等
              break;
          }

          // 可以在这里进行游戏初始化
          //this.startLevel(1);
        }

        // 设置错误处理
        ;

        _proto.setupErrorHandling = function setupErrorHandling() {
          // 捕获未处理的 Promise 错误
          window.addEventListener('unhandledrejection', function (event) {
            console.error('未处理的 Promise 错误:', event.reason);
            event.preventDefault();
          });

          // 捕获其他运行时错误
          window.addEventListener('error', function (event) {
            console.error('运行时错误:', event.error);
          });

          // 重写 console.error 以捕获更多信息
          var originalError = console.error;
          console.error = function () {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            originalError.apply(console, args);
            // 可以在这里添加错误上报逻辑
          };
        };

        _proto.update = function update(dt) {
          // 更新倒计时
          if (this.isCountingDown && this.onCharacterSelected != 0) {
            if (this.currentLevel !== 4) {
              this.currentCountdown -= dt;
              this.updateCountdownDisplay();
              if (this.currentCountdown <= 0) {
                this.currentCountdown = 0;
                this.isCountingDown = false;
                this.onCountdownFinished();
              }
              this.updateMonstersDepth();
            }
          }
        }

        // 更新怪物层级
        ;

        _proto.updateMonstersDepth = function updateMonstersDepth() {
          // 根据x坐标排序，x越小（越靠前）的怪物应该渲染在更上层
          this.monsters.sort(function (a, b) {
            return b.position.x - a.position.x; // 升序排序，x小的在前
          });

          // 设置siblingIndex，索引越大渲染越靠上
          for (var i = 0; i < this.monsters.length; i++) {
            this.monsters[i].setSiblingIndex(i);
          }
        }

        // 开始新关卡
        ;

        _proto.startLevel = function startLevel(level) {
          this.currentLevel = level;
          this.killCount = 0;
          this.monstersKilledThisLevel = 0;
          this.totalMonstersThisLevel = this.getMonstersCountByLevel();

          // 计算当前关卡的倒计时时间
          this.currentCountdown = this.baseCountdown + (level - 1) * this.countdownIncreasePerKill;
          this.isCountingDown = true;

          // 更新UI显示
          this.updateLevelDisplay();
          if (this.currentLevel == 4) {
            //boss关卡
            console.log("boss\u5173\u5361 \u4E0D\u9700\u8981\u8BA1\u65F6");
            this.isCountingDown = false;
          } else {
            this.updateCountdownDisplay();
            console.log("\uD83C\uDFAE \u5F00\u59CB\u7B2C " + level + " \u5173\uFF0C\u5012\u8BA1\u65F6: " + this.currentCountdown.toFixed(1) + "\u79D2");
          }

          // 立即生成怪物
          this.spawnMonster();
        }

        // 进入下一关
        ;

        _proto.nextLevel = function nextLevel() {
          var nextLevel = this.currentLevel + 1;
          this.startLevel(nextLevel);
        }

        // 更新关卡显示
        ;

        _proto.updateLevelDisplay = function updateLevelDisplay() {
          if (this.currentLevel == 4) {
            this.levelLabel.node.active = false;
          }
          if (this.levelLabel && this.levelLabel.isValid) {
            this.levelLabel.string = "\u7B2C " + this.currentLevel + " \u5173";
          }
        }

        // 更新倒计时显示
        ;

        _proto.updateCountdownDisplay = function updateCountdownDisplay() {
          if (this.countdownLabel && this.countdownLabel.isValid) {
            this.countdownLabel.string = this.currentCountdown.toFixed(1) + "\u79D2";

            // 倒计时少于3秒时显示红色警告
            if (this.currentCountdown <= 3) {
              this.countdownLabel.node.color = cc.Color.RED;
            } else {
              this.countdownLabel.node.color = cc.Color.WHITE;
            }
          }
        }

        // 倒计时结束的处理（未能在时间内击杀怪物）
        ;

        _proto.onCountdownFinished = function onCountdownFinished() {
          console.log("\u23F0 \u7B2C " + this.currentLevel + " \u5173\u5012\u8BA1\u65F6\u7ED3\u675F\uFF0C\u672A\u80FD\u51FB\u6740\u602A\u7269\uFF01");

          // 处理倒计时结束的逻辑
          this.onLevelFailed();
        }

        // 关卡失败
        ;

        _proto.onLevelFailed = function onLevelFailed() {
          var _this2 = this;
          console.log("\u274C \u7B2C " + this.currentLevel + " \u5173\u5931\u8D25\uFF01");

          // 先停止玩家攻击，避免继续访问怪物
          this.stopPlayerAttack();

          // 销毁当前怪物
          this.destroyAllMonsters();
          // if (this.currentMonster && this.currentMonster.isValid) {
          //     // 从数组中移除
          //     let index = this.monsters.indexOf(this.currentMonster);
          //     if (index !== -1) {
          //         this.monsters.splice(index, 1);
          //     }
          //
          //     // 安全销毁怪物
          //     this.currentMonster.destroy();
          //     this.currentMonster = null;
          // }

          // 重置倒计时显示
          this.updateCountdownDisplay();

          // 可以在这里添加失败惩罚，比如扣血、重新开始当前关卡等
          // 暂时设计为重新开始当前关卡
          this.scheduleOnce(function () {
            _this2.startLevel(_this2.currentLevel);
          }, 2);
        }

        // 停止玩家攻击
        ;

        _proto.stopPlayerAttack = function stopPlayerAttack() {
          if (this.playerNode && this.playerNode.isValid) {
            var playerComp = this.playerNode.getComponent('PlayerController');
            if (playerComp && playerComp.stopAttack) {
              playerComp.stopAttack();
            }
          }
          if (this.playerNode1 && this.playerNode1.isValid) {
            var playerComp1 = this.playerNode1.getComponent('PlayerController');
            if (playerComp1 && playerComp1.stopAttack) {
              playerComp1.stopAttack();
            }
          }
        }

        // 销毁所有怪物
        ;

        _proto.destroyAllMonsters = function destroyAllMonsters() {
          for (var _iterator = _createForOfIteratorHelperLoose(this.monsters), _step; !(_step = _iterator()).done;) {
            var monster = _step.value;
            if (monster && monster.isValid) {
              monster.destroy();
            }
          }
          this.monsters = [];
        };
        _proto.spawnMonster = function spawnMonster() {
          var _this3 = this;
          if (!this.monsterPrefab) {
            cc.error("Cannot spawn monster: monsterPrefab is null!");
            return;
          }
          //====================================================================start
          // 定义每波怪物的数量，可以根据需要调整
          var monstersPerWave = this.getMonstersCountByLevel();
          var _loop = function _loop() {
              var monster;
              if (_this3.currentLevel === 4) {
                monster = cc.instantiate(_this3.monsterBossPrefab);
              } else {
                monster = cc.instantiate(_this3.monsterPrefab);
              }

              // 设置怪物的生成位置，可以稍微随机偏移避免重叠
              var offsetX = (i - (monstersPerWave - 1) / 2) * 80; // 水平间隔80像素
              monster.setPosition(_this3.spawnX + offsetX, _this3.spawnY);
              if (_this3.monsterContainer && _this3.monsterContainer.isValid) {
                _this3.monsterContainer.addChild(monster);
              } else {
                cc.error("Cannot add monster: monsterContainer is null or invalid!");
                return {
                  v: void 0
                };
              }

              // 获取怪物脚本，并设置gameManager引用
              var monsterScript = monster.getComponent('Monster');
              if (monsterScript) {
                if (monsterScript.setGameManager) {
                  monsterScript.setGameManager(_this3);
                } else {
                  cc.warn("Monster script does not have setGameManager method!");
                }
              } else {
                cc.warn("Monster script not found on monster prefab!");
              }
              if (monsterScript) {
                // 设置怪物血量 - 根据关卡增加血量
                var levelHealthMultiplier = 1 + (_this3.currentLevel - 1) * 0.2; // 每关增加20%血量
                var monsterHealth = Math.floor(_this3.currentMonsterHealth * levelHealthMultiplier);
                if (monsterScript.setMaxHealth) {
                  if (_this3.currentLevel == 4) {
                    AudioManager.instance.playSound("skill_boss_enter");
                    var callback = function callback() {
                      var playerComp = this.playerNode.getComponent('PlayerController');
                      var playerAlive = playerComp.isAlive();
                      if (this.monsters.length == 0 || !playerAlive) {
                        this.unschedule(callback);
                      } else {
                        monsterScript.bossSkillAnimation1();
                        this.scheduleOnce(function () {
                          monsterScript.bossSkillAnimation3();
                        }, 0.2);
                        this.scheduleOnce(function () {
                          monsterScript.bossSkillAnimation4();
                        }, 0.3);
                        this.scheduleOnce(function () {
                          monsterScript.bossSkillAnimation5();
                        }, 0.4);
                      }
                    };
                    _this3.schedule(callback, 0.8, 10, 3);
                    monsterHealth = 500000;
                  } else {
                    monsterHealth = 100000;
                  }
                  monsterScript.setMaxHealth(monsterHealth);
                } else {
                  cc.warn("Monster script does not have setMaxHealth method!");
                }
              }
              _this3.monsters.push(monster);
            },
            _ret;
          for (var i = 0; i < monstersPerWave; i++) {
            _ret = _loop();
            if (_ret) return _ret.v;
          }
          //====================================================================end

          //this.monsters.push(monster);
          this.isSpawning = false;

          // 开始倒计时
          this.isCountingDown = true;
        }

        // 根据关卡获取怪物数量
        ;

        _proto.getMonstersCountByLevel = function getMonstersCountByLevel() {
          // 这里可以根据关卡设置不同的怪物数量
          switch (this.currentLevel) {
            case 1:
              return 3;
            // 第一波3个
            case 2:
              return 5;
            // 第二波5个
            case 3:
              return 7;
            // 第三波7个
            case 4:
              return 1;
            // 第四波是BOSS，只生成1个
            default:
              return 3 + (this.currentLevel - 1) * 2;
            // 后续关卡每关增加2个
          }
        };

        _proto.onMonsterDied = function onMonsterDied(monster) {
          // 停止倒计时
          this.isCountingDown = false;

          // 增加击杀计数
          this.killCount++;

          // 增加下一个怪物的基础血量
          this.currentMonsterHealth += this.healthIncreasePerKill;

          // 从数组中移除
          var index = this.monsters.indexOf(monster);
          if (index !== -1) {
            this.monsters.splice(index, 1);
          }

          // // 清除当前怪物引用
          // if (this.currentMonster === monster) {
          //     this.currentMonster = null;
          // }

          // 奖励经验值
          if (ExperienceManager.instance) {
            ExperienceManager.instance.addExp(this.expPerMonster);
          }

          // // 玩家继续前进
          // if (this.playerNode && this.playerNode.isValid) {
          //     let playerComp = this.playerNode.getComponent('PlayerController');
          //     if (playerComp && playerComp.stopAttack) {
          //         playerComp.stopAttack();
          //     }
          // }
          //
          // if (this.playerNode1 && this.playerNode1.isValid) {
          //     let playerComp1 = this.playerNode1.getComponent('PlayerController');
          //     if (playerComp1 && playerComp1.stopAttack) {
          //         playerComp1.stopAttack();
          //     }
          // }

          // 怪物死亡掉落装备
          // if (this.monsterPrefab && this.monsterPrefab.isValid) {
          //     let equipNode = this.node.getChildByName('equipLayer');
          //     let equipManager = equipNode.getComponent('EquipManager');
          //     if (equipManager && equipManager.spawnRandomEquipments) {
          //         equipManager.spawnRandomEquipments(this.currentLevel);
          //     }
          // }

          this.healthBar = this.getComponentInChildren(HealthBar);
          if (this.healthBar) {
            this.healthBar.setoffPosX();
          }

          // 检查是否所有怪物都被击杀
          var playerComp = this.playerNode.getComponent('PlayerController');
          var playerAlive = playerComp.isAlive();
          if (this.monsters.length === 0 || !playerAlive) {
            // 停止倒计时
            this.isCountingDown = false;

            // 当前关卡完成
            this.onLevelCompleted();
          }
        };
        _proto.onPlayerDied = function onPlayerDied(monster) {
          // 停止倒计时
          this.isCountingDown = false;
          this.onLevelCompleted();
        }

        // 关卡完成
        ;

        _proto.onLevelCompleted = function onLevelCompleted() {
          console.log("\u2705 \u7B2C " + this.currentLevel + " \u5173\u5B8C\u6210\uFF01\u5269\u4F59\u65F6\u95F4: " + this.currentCountdown.toFixed(1) + "\u79D2");

          // 显示剩余时间
          if (this.countdownLabel && this.countdownLabel.isValid) {
            this.countdownLabel.string = " " + this.currentCountdown.toFixed(1) + "\u79D2";
            this.countdownLabel.node.color = cc.Color.GREEN;
          }

          // 停止玩家攻击
          this.stopPlayerAttack();

          // 关卡结束掉落装备
          var playerComp = this.playerNode.getComponent('PlayerController');
          var playerAlive = playerComp.isAlive();
          if (playerAlive) {
            this.spawnEquipmentAtLevelEnd();
          }

          // 检测是否需要触发特殊界面
          this.checkAndShowSpecialInterface();

          // 延迟进入下一关
          // this.scheduleOnce(() => {
          //     this.nextLevel();
          // }, 2); // 2秒后进入下一关
        }

        // 关卡结束掉落装备
        ;

        _proto.spawnEquipmentAtLevelEnd = function spawnEquipmentAtLevelEnd() {
          var equipNode = this.node.getChildByName('equipLayer');
          if (equipNode) {
            var equipManager = equipNode.getComponent('EquipManager');
            if (equipManager && equipManager.spawnRandomEquipments) {
              // 根据关卡和击杀数量决定掉落装备的数量和质量
              var dropCount = this.calculateDropCount();
              equipManager.spawnRandomEquipments(this.currentLevel, dropCount);
              console.log("\uD83C\uDF81 \u7B2C " + this.currentLevel + " \u5173\u7ED3\u675F\uFF0C\u6389\u843D " + dropCount + " \u4EF6\u88C5\u5907");
            }
          }
        }

        /**
         * 检测并显示特殊界面
         */;
        _proto.checkAndShowSpecialInterface = function checkAndShowSpecialInterface() {
          // 定义关卡与特殊界面的映射关系
          var levelSpecialMap = {
            1: 'slotMachine',
            // 第一关结束显示老虎机
            3: 'slotMachine',
            // 第三关结束显示奖励界面
            4: 'overToOtherGame' // 第4关结束跳转链接
            // 可以继续添加其他关卡的映射
          };

          var specialInterface = levelSpecialMap[this.currentLevel];
          if (specialInterface) {
            console.log("\uD83C\uDFB0 \u7B2C " + this.currentLevel + " \u5173\u89E6\u53D1\u7279\u6B8A\u754C\u9762: " + specialInterface);

            // 根据类型显示不同的特殊界面
            switch (specialInterface) {
              case 'slotMachine':
                this.showSlotMachineInterface();
                break;
              case 'reward':
                this.showRewardInterface();
                break;
              case 'overToOtherGame':
                this.gotoWeb();
                break;
              default:
                // 如果没有匹配的类型，直接进入下一关
                this.delayedNextLevel();
                break;
            }
          } else {
            // 没有特殊界面，直接延迟进入下一关
            this.delayedNextLevel();
          }
        }

        // 计算掉落装备数量
        ;

        _proto.calculateDropCount = function calculateDropCount() {
          var baseCount = 1;

          // 根据关卡增加基础掉落
          baseCount += Math.floor(this.currentLevel / 2);

          // 根据击杀率增加掉落（如果击杀了所有怪物，额外奖励）
          var killRate = this.monstersKilledThisLevel / this.totalMonstersThisLevel;
          if (killRate >= 1) {
            baseCount += 1; // 完美通关额外奖励
          } else if (killRate >= 0.7) {
            baseCount += 0; // 良好通关，正常掉落
          }

          return Math.min(baseCount, 3); // 最多掉落3件装备
        }

        /**
         * 显示老虎机界面
         */;
        _proto.showSlotMachineInterface = function showSlotMachineInterface() {
          var _this4 = this;
          //捡装备需要时间
          this.scheduleOnce(function () {
            // 2. 创建或显示老虎机界面
            var slotMachineLayer = _this4.node.getChildByName('slotMachineLayer');
            if (slotMachineLayer) {
              slotMachineLayer.active = true;
            }
            var slotsMachine = slotMachineLayer.getComponent('SlotMachine');
            if (slotsMachine && slotsMachine.active) ;

            // 3. 监听老虎机完成事件
            slotMachineLayer.once('slot-machine-completed', _this4.onSlotMachineCompleted, _this4);
            console.log("🐯 老虎机界面已显示，等待抽奖完成...");
          }, 4);
        }

        /**
         * 老虎机完成回调
         */;
        _proto.onSlotMachineCompleted = function onSlotMachineCompleted(rewards) {
          console.log("🎉 老虎机抽奖完成，获得奖励:", rewards);

          // 处理获得的奖励
          //this.processSlotMachineRewards(rewards);
          if (this.currentLevel === 1) {
            if (this.selectedCharacter == 1) {
              this.node.getChildByName("characterLayer").emit('player-skill-upgraded', 'atk3f', 0.8);
              this.node.getChildByName("characterLayer").emit('player-skill-upgraded', 'atk3g', 0.8);
              this.node.getChildByName("characterLayer").emit('player-skill-upgraded', 'atk2', 0.8);
            } else {
              this.node.getChildByName("characterLayer1").emit('player-skill-upgraded', 'atk2', 0.8);
            }
          } else if (this.currentLevel === 3) {
            if (this.selectedCharacter == 1) {
              this.node.getChildByName("characterLayer").emit('player-skill-upgraded', 'ult', 2);
            } else {
              this.node.getChildByName("characterLayer1").emit('player-skill-upgraded', 'ult', 2);
            }
            this.node.getChildByName("UILayer").getChildByName("bossEnter").active = true;
            AudioManager.instance.playSound('voc_warn', 1);
          }

          // 恢复游戏UI并进入下一关
          this.delayedNextLevel();
        };
        _proto.gotoWeb = function gotoWeb() {
          var _this5 = this;
          this.scheduleOnce(function () {
            _this5.node.getChildByName("webLayer").active = true;
          }, 2.5);
        }

        /**
         * 延迟进入下一关（原来的逻辑）
         */;
        _proto.delayedNextLevel = function delayedNextLevel() {
          var _this6 = this;
          this.scheduleOnce(function () {
            _this6.node.getChildByName("UILayer").getChildByName("bossEnter").active = false;
            _this6.nextLevel();
          }, 1.5); // 1秒后进入下一关
        }

        // 玩家升级时的回调
        ;

        _proto.onPlayerLevelUp = function onPlayerLevelUp(newLevel) {
          console.log("\uD83C\uDF89 GameManager: \u73A9\u5BB6\u5347\u7EA7\u5230 " + newLevel + " \u7EA7!");

          // 播放升级特效
          //this.playLevelUpEffect();

          // 通知玩家脚本升级
          if (this.playerNode && this.playerNode.isValid) {
            var playerComp = this.playerNode.getComponent('PlayerController');
            if (playerComp && playerComp.onLevelUp) {
              playerComp.onLevelUp(newLevel);
            }
          }
          if (this.playerNode1 && this.playerNode1.isValid) {
            var playerComp1 = this.playerNode1.getComponent('PlayerController');
            if (playerComp1 && playerComp1.onLevelUp) {
              playerComp1.onLevelUp(newLevel);
            }
          }
        };
        _proto.getMonsters = function getMonsters() {
          return this.monsters;
        }

        // 获取当前怪物血量（用于UI显示等）
        ;

        _proto.getCurrentMonsterHealth = function getCurrentMonsterHealth() {
          return this.currentMonsterHealth;
        }

        // 获取当前关卡
        ;

        _proto.getCurrentLevel = function getCurrentLevel() {
          return this.currentLevel;
        }

        // 获取当前倒计时
        ;

        _proto.getCurrentCountdown = function getCurrentCountdown() {
          return this.currentCountdown;
        }

        // 获取当前击杀数
        ;

        _proto.getKillCount = function getKillCount() {
          return this.killCount;
        }

        // 获取当前怪物
        ;

        _proto.getCurrentMonster = function getCurrentMonster() {
          return this.currentMonster;
        }

        // 添加一个安全的方法来获取玩家位置
        ;

        _proto.getPlayerPosition = function getPlayerPosition() {
          if (this.playerNode && this.playerNode.isValid) {
            return this.playerNode.position;
          }
          return cc.Vec2.ZERO;
        }

        // 安全地获取怪物位置
        ;

        _proto.getMonsterPosition = function getMonsterPosition() {
          if (this.currentMonster && this.currentMonster.isValid) {
            return this.currentMonster.position;
          }
          return new cc.Vec2(this.spawnX, this.spawnY); // 返回默认位置
        };

        return GameManager;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "startLayerNode", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "monsterPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "monsterBossPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playerNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "playerNode1", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "monsterContainer", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "countdownLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "spawnDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "spawnX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 800;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "spawnY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "expPerMonster", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "healthIncreasePerKill", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "baseCountdown", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "countdownIncreasePerKill", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameMode.ts", ['cc'], function (exports) {
  var cclegacy, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "ce9babIucBMwoD+SyQGUp6m", "GameMode", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var GameMode = exports('GameMode', (_dec = ccclass('GameMode'), _dec(_class = /*#__PURE__*/function () {
        function GameMode() {}
        var _proto = GameMode.prototype;
        _proto.init = function init() {};
        _proto.initCharacters = function initCharacters() {};
        _proto.update = function update(deltaTime) {};
        return GameMode;
      }()) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HealthBar.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, _createClass, cclegacy, _decorator, ProgressBar, Label, Color, SpriteFrame, tween, Vec3, UIOpacity, Vec2, Sprite, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      ProgressBar = module.ProgressBar;
      Label = module.Label;
      Color = module.Color;
      SpriteFrame = module.SpriteFrame;
      tween = module.tween;
      Vec3 = module.Vec3;
      UIOpacity = module.UIOpacity;
      Vec2 = module.Vec2;
      Sprite = module.Sprite;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20;
      cclegacy._RF.push({}, "c19249Px7BAPq2gztW9qOgL", "HealthBar", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var HealthBar = exports('HealthBar', (_dec = ccclass('HealthBar'), _dec2 = property(ProgressBar), _dec3 = property(Label), _dec4 = property(ProgressBar), _dec5 = property({
        type: Color,
        tooltip: "普通伤害颜色"
      }), _dec6 = property({
        type: Color,
        tooltip: "暴击伤害颜色"
      }), _dec7 = property({
        type: Color,
        tooltip: "治疗颜色"
      }), _dec8 = property({
        type: Color,
        tooltip: "AOE伤害颜色"
      }), _dec9 = property({
        type: Number,
        tooltip: "暴击字体大小"
      }), _dec10 = property({
        type: Number,
        tooltip: "普通字体大小"
      }), _dec11 = property({
        type: Number,
        tooltip: "AOE字体大小"
      }), _dec12 = property({
        type: SpriteFrame,
        tooltip: "暴击特效图片"
      }), _dec13 = property({
        type: Number,
        tooltip: "伤害数字显示区域宽度"
      }), _dec14 = property({
        type: Number,
        tooltip: "伤害数字显示区域高度"
      }), _dec15 = property({
        type: Number,
        tooltip: "伤害数字显示持续时间(秒)"
      }), _dec16 = property({
        type: Number,
        tooltip: "伤害数字垂直间距"
      }), _dec17 = property({
        type: Number,
        tooltip: "伤害数字最大显示数量"
      }), _dec18 = property({
        type: Number,
        tooltip: "水平分散范围"
      }), _dec19 = property({
        type: Number,
        tooltip: "垂直分散范围"
      }), _dec20 = property({
        type: Number,
        tooltip: "基础垂直位置"
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(HealthBar, _Component);
        function HealthBar() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "healthBar", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "healthText", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "damageEffectBar", _descriptor3, _assertThisInitialized(_this));
          // 伤害效果延迟条
          _initializerDefineProperty(_this, "animationDuration", _descriptor4, _assertThisInitialized(_this));
          // 血条变化动画时长
          // === 新增属性 ===
          _initializerDefineProperty(_this, "normalDamageColor", _descriptor5, _assertThisInitialized(_this));
          // 黄色
          _initializerDefineProperty(_this, "critDamageColor", _descriptor6, _assertThisInitialized(_this));
          // 红色
          _initializerDefineProperty(_this, "healColor", _descriptor7, _assertThisInitialized(_this));
          // 绿色
          _initializerDefineProperty(_this, "aoeDamageColor", _descriptor8, _assertThisInitialized(_this));
          // 橙色
          _initializerDefineProperty(_this, "critFontSize", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "normalFontSize", _descriptor10, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "aoeFontSize", _descriptor11, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "critEffectSprite", _descriptor12, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "damageAreaWidth", _descriptor13, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "damageAreaHeight", _descriptor14, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "damageDisplayDuration", _descriptor15, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "damageVerticalSpacing", _descriptor16, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "maxDamageNumbers", _descriptor17, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "horizontalSpread", _descriptor18, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "verticalSpread", _descriptor19, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "baseVerticalPosition", _descriptor20, _assertThisInitialized(_this));
          _this._maxHealth = 100;
          _this._currentHealth = 100;
          _this._damageEffectHealth = 100;
          _this._targetNode = null;
          // 血条跟随的目标节点
          // === 伤害显示管理 ===
          _this._activeDamageNumbers = new Map();
          _this._damageNumberId = 0;
          _this._lastDamagePositions = [];
          _this._verticalOffset = 0;
          // 垂直偏移量，用于实现"往上顶"的效果
          _this._activeTweens = [];
          // 存储活跃的tween引用
          _this._damageNumberQueue = [];
          // 伤害数字队列
          _this.offPosX = 0;
          // 伤害数字队列
          // === 新增私有变量 ===
          _this._isShowingAoeEffect = false;
          _this._aoeEffectTimer = null;
          return _this;
        }
        var _proto = HealthBar.prototype;
        _proto.onLoad = function onLoad() {
          // 初始化血条
          if (this.healthBar) {
            this.healthBar.progress = 1;
          }
          if (this.damageEffectBar) {
            this.damageEffectBar.progress = 1;
          }
          this.updateHealthText();
        };
        _proto.onDestroy = function onDestroy() {
          // 清理所有活跃的tween
          this.clearAllTweens();
          this.clearAllDamageNumbers();
        }

        // 初始化血条
        ;

        _proto.init = function init(maxHealth, currentHealth) {
          this._maxHealth = maxHealth;
          this._currentHealth = currentHealth !== undefined ? currentHealth : maxHealth;
          this._damageEffectHealth = this._currentHealth;
          this.offPosX = 0;
          this.updateHealthBarImmediately();
          this.updateHealthText();
        }

        // 设置血量
        ;

        _proto.setHealth = function setHealth(currentHealth) {
          this._currentHealth = Math.max(0, Math.min(currentHealth, this._maxHealth));
          this.updateHealthBar();
          this.updateHealthText();
        }

        // 造成伤害
        ;

        _proto.takeDamage = function takeDamage(damage, isCrit, isAoe) {
          if (isCrit === void 0) {
            isCrit = false;
          }
          if (isAoe === void 0) {
            isAoe = false;
          }
          var newHealth = Math.max(0, this._currentHealth - damage);
          this.setHealth(newHealth);

          // 显示伤害数字
          this.showDamageEffect(damage, isCrit, isAoe);

          // 如果受到AOE伤害，播放特殊效果
          if (isAoe) {
            this.showAoeDamageEffect();
          }
        }

        // 治疗
        ;

        _proto.heal = function heal(amount) {
          var newHealth = Math.min(this._maxHealth, this._currentHealth + amount);
          this.setHealth(newHealth);

          // 显示治疗数字
          this.showHealEffect(amount);
        }

        // 更新血条（带动画）
        ;

        _proto.updateHealthBar = function updateHealthBar() {
          var _this2 = this;
          var targetProgress = this._currentHealth / this._maxHealth;

          // 主血条立即变化
          if (this.healthBar) {
            tween(this.healthBar).to(this.animationDuration, {
              progress: targetProgress
            }).start();
          }

          // 伤害效果延迟条稍后变化
          if (this.damageEffectBar) {
            this.scheduleOnce(function () {
              tween(_this2.damageEffectBar).to(_this2.animationDuration * 1.5, {
                progress: targetProgress
              }).start();
            }, this.animationDuration / 2);
          }
        }

        // 立即更新血条（无动画）
        ;

        _proto.updateHealthBarImmediately = function updateHealthBarImmediately() {
          var progress = this._currentHealth / this._maxHealth;
          if (this.healthBar) {
            this.healthBar.progress = progress;
          }
          if (this.damageEffectBar) {
            this.damageEffectBar.progress = progress;
          }
        }

        // 更新血量文本
        ;

        _proto.updateHealthText = function updateHealthText() {
          if (this.healthText) {
            this.healthText.string = Math.ceil(this._currentHealth) + "/" + this._maxHealth;

            // 根据血量比例改变文本颜色
            var healthRatio = this._currentHealth / this._maxHealth;
            if (healthRatio <= 0.3) {
              this.healthText.color = new Color(255, 50, 50); // 红色
            } else if (healthRatio <= 0.6) {
              this.healthText.color = new Color(255, 255, 0); // 黄色
            } else {
              this.healthText.color = new Color(255, 255, 255); // 白色
            }
          }
        }

        // 显示伤害效果
        ;

        _proto.showDamageEffect = function showDamageEffect(damage, isCrit, isAoe) {
          if (isCrit === void 0) {
            isCrit = false;
          }
          if (isAoe === void 0) {
            isAoe = false;
          }
          var text;
          var color;
          var fontSize;
          if (isCrit) {
            text = "-" + damage;
            color = this.critDamageColor;
            fontSize = this.critFontSize;
            this.playCritEffect(); // 播放暴击特效
          } else if (isAoe) {
            text = "\u8303\u56F4 -" + damage;
            color = this.aoeDamageColor;
            fontSize = this.aoeFontSize;
          } else {
            text = "-" + damage;
            color = this.normalDamageColor;
            fontSize = this.normalFontSize;
          }
          // 创建伤害数字
          //this.createFloatingText(text, color, fontSize, isCrit);
          this.createStackingFloatingText(text, color, fontSize, isCrit);
          //this.createScatteredFloatingText(text, color, fontSize, isCrit);
        }

        // === 新增：播放暴击特效 ===
        ;

        _proto.playCritEffect = function playCritEffect() {
          // 可以在这里添加暴击时的屏幕震动、粒子效果等
          if (this.healthBar && this.healthBar.node && this.isValidTarget(this.healthBar)) {
            var critTween = tween(this.healthBar.node).to(0.05, {
              scale: new Vec3(1.2, 1.2, 1)
            }).to(0.05, {
              scale: new Vec3(0.9, 0.9, 1)
            }).to(0.05, {
              scale: new Vec3(1.1, 1.1, 1)
            }).to(0.05, {
              scale: new Vec3(1, 1, 1)
            }).start();
            this._activeTweens.push(critTween);
          }
        }

        // === 新增：显示AOE伤害效果 ===
        ;

        _proto.showAoeDamageEffect = function showAoeDamageEffect() {
          var _this3 = this;
          if (this._isShowingAoeEffect) return;
          this._isShowingAoeEffect = true;

          // AOE伤害时的特殊效果（比如血条边框闪烁）
          if (this.node) {
            var originalScale = this.node.scale.clone();
            tween(this.node).to(0.1, {
              scale: new Vec3(1.05, 1.05, 1)
            }).to(0.1, {
              scale: originalScale
            }).call(function () {
              _this3._isShowingAoeEffect = false;
            }).start();
          }

          // 设置定时器清除状态（防止动画中断导致状态卡住）
          if (this._aoeEffectTimer) {
            clearTimeout(this._aoeEffectTimer);
          }
          this._aoeEffectTimer = setTimeout(function () {
            _this3._isShowingAoeEffect = false;
          }, 1000);
        }

        // 显示治疗效果
        ;

        _proto.showHealEffect = function showHealEffect(amount) {
          // 创建治疗数字
          this.createFloatingText("+" + amount, this.healColor, this.normalFontSize);

          // 治疗时的绿色闪烁效果
          if (this.healthBar && this.healthBar.node) {
            var _this$healthBar$node$;
            var originalColor = ((_this$healthBar$node$ = this.healthBar.node.color) == null ? void 0 : _this$healthBar$node$.clone()) || new Color(255, 255, 255);
            tween(this.healthBar.node).to(0.2, {
              color: new Color(100, 255, 100)
            }).to(0.2, {
              color: originalColor
            }).start();
          }
        }

        // 创建浮动文字效果
        ;

        _proto.createFloatingText = function createFloatingText(text, color, fontSize, isCrit) {
          if (fontSize === void 0) {
            fontSize = 40;
          }
          if (isCrit === void 0) {
            isCrit = false;
          }
          var id = this._damageNumberId++;
          var labelNode = new cc.Node('FloatingText');
          var label = labelNode.addComponent(Label);
          var opacity = labelNode.addComponent(UIOpacity);
          label.string = text;
          label.color = color;
          label.fontSize = fontSize;
          label.isBold = isCrit;
          label.lineHeight = fontSize;

          // 为暴击添加阴影效果
          if (isCrit) {
            label.shadowColor = new Color(100, 0, 0, 150);
            label.shadowOffset = new Vec2(2, -2);
            label.shadowBlur = 2;
          }

          // 计算不重叠的位置
          var position = this.calculateNonOverlapPosition();
          labelNode.setPosition(position);
          this.node.addChild(labelNode);

          // 暴击特效
          if (isCrit && this.critEffectSprite) {
            this.createCritEffect(labelNode);
          }

          // 动画序列
          this.playDamageNumberAnimation(labelNode, opacity, id, isCrit);
        }

        // === 计算不重叠的位置 ===
        ;

        _proto.calculateNonOverlapPosition = function calculateNonOverlapPosition() {
          var maxAttempts = 10;
          var attempt = 0;
          var position;
          do {
            // 在伤害区域内随机位置
            var x = (Math.random() - 0.5) * this.damageAreaWidth;
            var y = 50 + Math.random() * this.damageAreaHeight * 0.5; // 主要在上半部分
            position = new Vec3(x, y, 0);
            attempt++;
          } while (this.isPositionOverlapping(position) && attempt < maxAttempts);

          // 记录位置
          this._lastDamagePositions.push(position.clone());
          if (this._lastDamagePositions.length > 5) {
            this._lastDamagePositions.shift();
          }
          return position;
        };
        _proto.isPositionOverlapping = function isPositionOverlapping(position) {
          var minDistance = 40; // 最小间距
          for (var _iterator = _createForOfIteratorHelperLoose(this._lastDamagePositions), _step; !(_step = _iterator()).done;) {
            var existingPos = _step.value;
            var distance = Vec3.distance(position, existingPos);
            if (distance < minDistance) {
              return true;
            }
          }
          return false;
        }

        // === 暴击特效 ===
        ;

        _proto.createCritEffect = function createCritEffect(parentNode) {
          var critEffectNode = new cc.Node('CritEffect');
          var sprite = critEffectNode.addComponent(Sprite);
          var opacity = critEffectNode.addComponent(UIOpacity);
          sprite.spriteFrame = this.critEffectSprite;
          critEffectNode.setScale(0, 0, 0);
          opacity.opacity = 200;
          critEffectNode.x = critEffectNode.x - 100;
          parentNode.addChild(critEffectNode);
          var critTween = tween(critEffectNode).to(0.1, {
            scale: new Vec3(1.5, 1.5, 1)
          }).to(0.2, {
            scale: new Vec3(1, 1, 1)
          }).delay(0.2).to(0.2, {
            scale: new Vec3(0.5, 0.5, 1)
          }).call(function () {
            if (critEffectNode && critEffectNode.isValid) {
              tween(opacity).to(0.2, {
                opacity: 0
              }).call(function () {
                if (critEffectNode && critEffectNode.isValid) {
                  critEffectNode.destroy();
                }
              }).start();
            }
          }).start();
          this._activeTweens.push(critTween);
        }

        // === 伤害数字动画 ===
        ;

        _proto.playDamageNumberAnimation = function playDamageNumberAnimation(node, opacity, id, isCrit) {
          var _this4 = this;
          if (!this.isValidTarget(node)) return;
          var originalScale = node.scale.clone();

          // 记录活跃的伤害数字
          this._activeDamageNumbers.set(id, {
            node: node,
            position: node.position.clone()
          });

          // 基础动画
          var baseAnimation = tween(node).parallel(tween().by(1.2, {
            position: new Vec3(0, 100, 0)
          }), tween(opacity).delay(0.4).to(0.8, {
            opacity: 0
          }));
          var damageTween;

          // 暴击的特殊动画
          if (isCrit) {
            damageTween = tween(node).to(0.1, {
              scale: new Vec3(1.8, 1.8, 1)
            }) // 快速放大
            .to(0.1, {
              scale: new Vec3(1.2, 1.2, 1)
            }) // 回弹
            .to(0.1, {
              scale: new Vec3(1.5, 1.5, 1)
            }) // 再次放大
            .to(0.1, {
              scale: new Vec3(1, 1, 1)
            }) // 恢复正常
            .then(baseAnimation).call(function () {
              _this4._activeDamageNumbers["delete"](id);
              if (node && node.isValid) {
                node.destroy();
              }
            }).start();
          } else {
            // 普通伤害的动画
            damageTween = tween(node).to(0.1, {
              scale: new Vec3(1.3, 1.3, 1)
            }).to(0.1, {
              scale: originalScale
            }).then(baseAnimation).call(function () {
              _this4._activeDamageNumbers["delete"](id);
              if (node && node.isValid) {
                node.destroy();
              }
            }).start();
          }
          this._activeTweens.push(damageTween);

          // 轻微的水平漂移，使效果更自然
          var horizontalDrift = (Math.random() - 0.5) * 30;
          tween(node).by(1.2, {
            position: new Vec3(horizontalDrift, 0, 0)
          }).start();
        };
        _proto.setoffPosX = function setoffPosX() {
          this.offPosX = 0;
        }

        // === 堆叠式浮动文字创建方法 ===
        ;

        _proto.createStackingFloatingText = function createStackingFloatingText(text, color, fontSize, isCrit) {
          var _this5 = this;
          if (isCrit === void 0) {
            isCrit = false;
          }
          var id = this._damageNumberId++;
          var labelNode = new cc.Node('FloatingText');
          var label = labelNode.addComponent(Label);
          var opacity = labelNode.addComponent(UIOpacity);
          // 添加描边组件
          var outline = labelNode.addComponent(cc.LabelOutline);
          label.string = text;
          label.color = color;
          label.fontSize = fontSize;
          label.isBold = isCrit;
          label.lineHeight = fontSize;

          // 为暴击添加阴影效果
          if (isCrit) {
            label.shadowColor = new Color(100, 0, 0, 150);
            label.shadowOffset = new Vec3(2, -2, 0);
            label.shadowBlur = 2;
            outline.color = cc.Color.BLACK; // 设置描边颜色为黑色
            outline.width = 2; // 设置描边宽度
          }

          // 计算位置 - 往上堆叠
          var position = this.calculateStackingPosition();
          labelNode.setPosition(position);
          if (this.node && this.node.isValid) {
            this.node.addChild(labelNode);
          } else {
            labelNode.destroy();
            return;
          }

          // 暴击特效
          if (isCrit && this.critEffectSprite) {
            this.createCritEffect(labelNode);
          }

          // 动画序列
          this.playStackingDamageAnimation(labelNode, opacity, id, isCrit);

          // 更新垂直偏移量，为下一个伤害数字准备位置
          this._verticalOffset += this.damageVerticalSpacing;

          // 1.5秒后重置垂直偏移（模拟数字消失后位置回收）
          this.scheduleOnce(function () {
            _this5._verticalOffset = Math.max(0, _this5._verticalOffset - _this5.damageVerticalSpacing);
          }, this.damageDisplayDuration);
        }

        // === 计算堆叠位置 ===
        ;

        _proto.calculateStackingPosition = function calculateStackingPosition() {
          // 水平方向轻微随机偏移，避免完全对齐显得呆板
          //const horizontalOffset = (Math.random() - 0.5) * 30;
          this.offPosX -= 5;
          if (this.offPosX <= 100) {
            this.offPosX = 0;
          }
          // 垂直方向使用当前偏移量
          var verticalPosition = 50 + this._verticalOffset;
          if (verticalPosition > 320) {
            this._verticalOffset = 0;
          }
          return new Vec3(this.offPosX, verticalPosition, 0);
        }

        // === 堆叠式伤害数字动画 ===
        ;

        _proto.playStackingDamageAnimation = function playStackingDamageAnimation(node, opacity, id, isCrit) {
          var _this6 = this;
          var originalScale = node.scale.clone();
          this._activeDamageNumbers.set(id, {
            node: node,
            position: node.position.clone()
          });

          // 基础动画参数
          var displayDuration = this.damageDisplayDuration;
          var fadeStartTime = displayDuration * 0.6; // 60%时间后开始淡出
          var fadeDuration = displayDuration - fadeStartTime;
          var damageTween;
          if (isCrit) {
            // 暴击动画 - 更强烈的效果
            damageTween = tween(node)
            // 第一阶段：爆发式出现
            .to(0.1, {
              scale: new Vec3(1.8, 1.8, 1)
            }).to(0.1, {
              scale: new Vec3(1.2, 1.2, 1)
            }).to(0.1, {
              scale: new Vec3(1.5, 1.5, 1)
            }).to(0.1, {
              scale: new Vec3(1, 1, 1)
            })
            // 第二阶段：持续显示和轻微浮动
            .parallel(tween().by(displayDuration * 0.8, {
              position: new Vec3(0, 30, 0)
            }),
            // 缓慢上浮
            tween(opacity).delay(fadeStartTime).to(fadeDuration, {
              opacity: 0
            }) // 延迟淡出
            ).call(function () {
              _this6._activeDamageNumbers["delete"](id);
              if (node && node.isValid) {
                node.destroy();
              }
              // tween(opacity).to(0.2, { opacity: 0 }).call(() => {
              //     if (node && node.isValid) {
              //         node.destroy();
              //     }
              // }).start();
            }).start();
          } else {
            // 普通伤害动画
            damageTween = tween(node)
            // 出现动画
            .to(0.1, {
              scale: new Vec3(1.3, 1.3, 1)
            }).to(0.1, {
              scale: originalScale
            })
            //持续显示和上浮
            // .parallel(
            //     tween().by(displayDuration * 0.8, { position: new Vec3(0, 20, 0) }), // 缓慢上浮
            //     tween(opacity).delay(fadeStartTime).to(fadeDuration, { opacity: 0 }) // 延迟淡出
            // )
            .call(function () {
              _this6._activeDamageNumbers["delete"](id);
              tween(opacity).to(0.2, {
                opacity: 0
              }).call(function () {
                if (node && node.isValid) {
                  node.destroy();
                }
              }).start();
            }).start();
          }

          // 设置一个安全定时器，确保即使动画异常也能清理
          this.scheduleOnce(function () {
            if (_this6._activeDamageNumbers.has(id)) {
              _this6.removeDamageNumber(id);
            }
          }, displayDuration + 1.0);
          this._activeTweens.push(damageTween);
        }

        // === 移除伤害数字 ===
        ;

        _proto.removeDamageNumber = function removeDamageNumber(id) {
          var data = this._activeDamageNumbers.get(id);
          if (data) {
            if (data.node && data.node.isValid) {
              data.node.destroy();
            }
            this._activeDamageNumbers["delete"](id);
          }
        }

        // === 分散式浮动文字创建方法 ===
        ;

        _proto.createScatteredFloatingText = function createScatteredFloatingText(text, color, fontSize, isCrit) {
          if (isCrit === void 0) {
            isCrit = false;
          }
          // 如果超过最大显示数量，移除最早的一个
          if (this._activeDamageNumbers.size >= this.maxDamageNumbers) {
            var firstId = Array.from(this._activeDamageNumbers.keys())[0];
            this.removeDamageNumber(firstId);
          }
          var id = this._damageNumberId++;
          var labelNode = new cc.Node('FloatingText');
          var label = labelNode.addComponent(Label);
          var opacity = labelNode.addComponent(UIOpacity);
          label.string = text;
          label.color = color;
          label.fontSize = fontSize;
          label.isBold = isCrit;
          label.lineHeight = fontSize;

          // 为暴击添加阴影效果
          if (isCrit) {
            label.shadowColor = new Color(100, 0, 0, 150);
            label.shadowOffset = new Vec3(2, -2, 0);
            label.shadowBlur = 2;
          }

          // 计算分散位置
          var position = this.calculateScatteredPosition();
          labelNode.setPosition(position);
          if (this.node && this.node.isValid) {
            this.node.addChild(labelNode);
          } else {
            labelNode.destroy();
            return;
          }

          // 暴击特效
          if (isCrit && this.critEffectSprite) {
            this.createCritEffect(labelNode);
          }

          // 记录伤害数字信息
          this._activeDamageNumbers.set(id, {
            node: labelNode,
            opacity: opacity,
            startTime: Date.now(),
            displayDuration: this.damageDisplayDuration,
            isCrit: isCrit
          });

          // 启动独立动画
          this.playScatteredDamageAnimation(id);
        }

        // === 移除伤害数字 ===
        ;

        _proto.removeDamageNumber = function removeDamageNumber(id) {
          var data = this._activeDamageNumbers.get(id);
          if (data) {
            if (data.node && data.node.isValid) {
              data.node.destroy();
            }
            this._activeDamageNumbers["delete"](id);
          }
        }

        // === 计算分散位置 ===
        ;

        _proto.calculateScatteredPosition = function calculateScatteredPosition() {
          // 在水平和垂直范围内随机分布
          var x = (Math.random() - 0.5) * this.horizontalSpread;
          var y = this.baseVerticalPosition + Math.random() * this.verticalSpread;
          return new Vec3(x, y, 0);
        }

        // === 分散式伤害数字动画 ===
        ;

        _proto.playScatteredDamageAnimation = function playScatteredDamageAnimation(id) {
          var _this7 = this;
          var data = this._activeDamageNumbers.get(id);
          if (!data || !this.isValidTarget(data.node)) {
            this._activeDamageNumbers["delete"](id);
            return;
          }
          var node = data.node,
            opacity = data.opacity,
            displayDuration = data.displayDuration,
            isCrit = data.isCrit;
          var startPosition = node.position.clone();

          // 随机动画参数
          var finalYOffset = 60 + Math.random() * 40;
          var horizontalDrift = (Math.random() - 0.5) * 80;
          var rotation = (Math.random() - 0.5) * 15;

          // 动画时间参数
          var fadeStartTime = displayDuration * 0.6;
          var fadeDuration = displayDuration - fadeStartTime;
          var damageTween;
          if (isCrit) {
            // 暴击动画
            damageTween = tween(node).to(0.1, {
              scale: new Vec3(2.0, 2.0, 1)
            }).to(0.1, {
              scale: new Vec3(1.3, 1.3, 1)
            }).to(0.1, {
              scale: new Vec3(1.8, 1.8, 1)
            }).to(0.1, {
              scale: new Vec3(1.5, 1.5, 1)
            }).parallel(tween().by(displayDuration * 0.8, {
              position: new Vec3(horizontalDrift, finalYOffset, 0)
            }), tween().by(displayDuration * 0.5, {
              angle: rotation
            }), tween(opacity).delay(fadeStartTime).to(fadeDuration, {
              opacity: 0
            })).call(function () {
              _this7.removeDamageNumber(id);
            }).start();
          } else {
            // 普通伤害动画
            damageTween = tween(node).to(0.1, {
              scale: new Vec3(1.5, 1.5, 1)
            }).to(0.1, {
              scale: new Vec3(1.0, 1.0, 1)
            }).parallel(tween().by(displayDuration * 0.8, {
              position: new Vec3(horizontalDrift * 0.7, finalYOffset * 0.7, 0)
            }), tween().by(displayDuration * 0.3, {
              angle: rotation * 0.5
            }), tween(opacity).delay(fadeStartTime).to(fadeDuration, {
              opacity: 0
            })).call(function () {
              _this7.removeDamageNumber(id);
            }).start();
          }
          this._activeTweens.push(damageTween);

          // 设置独立销毁定时器（作为备份，防止动画异常）
          this.scheduleOnce(function () {
            if (_this7._activeDamageNumbers.has(id)) {
              _this7.removeDamageNumber(id);
            }
          }, displayDuration + 0.5); // 比动画时间长一点作为安全保障
        }

        // === 新增：显示多段伤害 ===
        ;

        _proto.showMultiHitDamage = function showMultiHitDamage(damage, hitCount, totalHits) {
          var text = "\u8FDE\u51FB" + hitCount + "/" + totalHits + " -" + damage;
          var color = new Color(200, 100, 255); // 紫色表示连击
          this.createFloatingText(text, color, this.normalFontSize);
        }

        // === 新增：显示技能伤害 ===
        ;

        _proto.showSkillDamage = function showSkillDamage(damage, skillName) {
          var text = skillName + " -" + damage;
          var color = new Color(0, 200, 255); // 蓝色表示技能
          this.createFloatingText(text, color, this.aoeFontSize);
        }

        // 清理所有伤害数字（在角色死亡或场景切换时调用）
        ;

        _proto.clearAllDamageNumbers = function clearAllDamageNumbers() {
          for (var _iterator2 = _createForOfIteratorHelperLoose(this._activeDamageNumbers), _step2; !(_step2 = _iterator2()).done;) {
            var _step2$value = _step2.value,
              id = _step2$value[0],
              data = _step2$value[1];
            if (data.node && cc.isValid(data.node)) {
              data.node.destroy();
            }
          }
          this._activeDamageNumbers.clear();
          this._lastDamagePositions = [];
        }

        // 获取当前血量
        ;
        // 检查是否死亡
        _proto.isDead = function isDead() {
          return this._currentHealth <= 0;
        }

        // === 新增：设置目标节点（用于血条跟随）===
        ;

        _proto.setTargetNode = function setTargetNode(node) {
          this._targetNode = node;
        }

        // === 安全检查方法 ===
        ;

        _proto.isValidTarget = function isValidTarget(target) {
          return target && target.node && target.node.isValid;
        }

        // === 清理方法 ===
        ;

        _proto.clearAllTweens = function clearAllTweens() {
          // 停止所有活跃的tween
          for (var _iterator3 = _createForOfIteratorHelperLoose(this._activeTweens), _step3; !(_step3 = _iterator3()).done;) {
            var tweenRef = _step3.value;
            try {
              if (tweenRef && tweenRef.stop) {
                tweenRef.stop();
              }
            } catch (e) {
              // 忽略停止tween时的错误
            }
          }
          this._activeTweens = [];
        };
        _createClass(HealthBar, [{
          key: "currentHealth",
          get: function get() {
            return this._currentHealth;
          }

          // 获取最大血量
        }, {
          key: "maxHealth",
          get: function get() {
            return this._maxHealth;
          }
        }]);
        return HealthBar;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "healthBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "healthText", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damageEffectBar", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "animationDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.3;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "normalDamageColor", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 255, 0);
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "critDamageColor", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 50, 50);
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "healColor", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(50, 255, 50);
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "aoeDamageColor", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 165, 0);
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "critFontSize", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 32;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "normalFontSize", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 40;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "aoeFontSize", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 28;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "critEffectSprite", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "damageAreaWidth", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "damageAreaHeight", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "damageDisplayDuration", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "damageVerticalSpacing", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 45;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "maxDamageNumbers", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "horizontalSpread", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "verticalSpread", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "baseVerticalPosition", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 80;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./AudioManager.ts', './BackgroundScroller.ts', './EnemySpawner.ts', './EquipManager.ts', './ExperienceManager.ts', './GameManager.ts', './DebugComponent.ts', './GameMode.ts', './UnitSpawnedRouter.ts', './UnitSpawner.ts', './HealthBar.ts', './Monster.ts', './OpenURL.ts', './PlayerController.ts', './ProgressTrigger.ts', './SimpleParallaxTest.ts', './SlotsMachine.ts', './SpriteAnimation.ts', './EquipmentData.ts', './EquipmentDetailPopup.ts', './EquipmentItem.ts', './EquipmentSlot.ts', './popRewardWin.ts', './startLayer.ts', './SafeAnimationHelper.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/Monster.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts', './HealthBar.ts'], function (exports) {
  var _inheritsLoose, _createClass, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy, BoxCollider2D, Prefab, sp, instantiate, Node, Contact2DType, AudioManager, HealthBar;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      BoxCollider2D = module.BoxCollider2D;
      Prefab = module.Prefab;
      sp = module.sp;
      instantiate = module.instantiate;
      Node = module.Node;
      Contact2DType = module.Contact2DType;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      HealthBar = module.HealthBar;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22;
      cclegacy._RF.push({}, "b0b87niMBxH9b3PJJvUu1qv", "Monster", undefined);
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var Monster = exports('default', (_dec = property(cc.Component), _dec2 = property(cc.Component), _dec3 = property(cc.Component), _dec4 = property(cc.Node), _dec5 = property(BoxCollider2D), _dec6 = property({
        type: cc.Float
      }), _dec7 = property({
        type: cc.Float
      }), _dec8 = property({
        type: cc.Float
      }), _dec9 = property(cc.Size), _dec10 = property(cc.Vec2), _dec11 = property({
        type: cc.Float,
        tooltip: "攻击检测范围"
      }), _dec12 = property({
        type: cc.Float,
        tooltip: "停止移动的距离"
      }), _dec13 = property({
        type: cc.Float,
        tooltip: "攻击间隔（秒）"
      }), _dec14 = property(Prefab), _dec15 = property(sp.SkeletonData), _dec16 = property(sp.SkeletonData), _dec17 = property(sp.SkeletonData), _dec18 = property(sp.SkeletonData), _dec19 = property(sp.SkeletonData), _dec20 = property({
        type: cc.Boolean
      }), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(Monster, _cc$Component);
        function Monster() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "spineComponent", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spineComponent1", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spineComponent2", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spineNode", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "boxCollider", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "moveSpeed", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "health", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackDamage", _descriptor8, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "colliderSize", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "colliderOffset", _descriptor10, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackRange", _descriptor11, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "stopDistance", _descriptor12, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackInterval", _descriptor13, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "maxHealth", _descriptor14, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "healthBarPrefab", _descriptor15, _assertThisInitialized(_this));
          // 血条预制体
          _initializerDefineProperty(_this, "healthBarOffset", _descriptor16, _assertThisInitialized(_this));
          // 血条在怪物头顶的垂直偏移量（局部坐标）
          _initializerDefineProperty(_this, "bossSkillComponent1", _descriptor17, _assertThisInitialized(_this));
          // 在编辑器中将 Spine 资源拖到这里
          _initializerDefineProperty(_this, "bossSkillComponent2", _descriptor18, _assertThisInitialized(_this));
          // 在编辑器中将 Spine 资源拖到这里
          _initializerDefineProperty(_this, "bossSkillComponent3", _descriptor19, _assertThisInitialized(_this));
          // 在编辑器中将 Spine 资源拖到这里
          _initializerDefineProperty(_this, "bossSkillComponent4", _descriptor20, _assertThisInitialized(_this));
          // 在编辑器中将 Spine 资源拖到这里
          _initializerDefineProperty(_this, "bossSkillComponent5", _descriptor21, _assertThisInitialized(_this));
          // 在编辑器中将 Spine 资源拖到这里
          _this.skillSpine1 = null;
          _this.skillSpine2 = null;
          _this.skillSpine3 = null;
          _this.skillSpine4 = null;
          _this.skillSpine5 = null;
          _this.isMoving = true;
          _this.isAttacking = false;
          _this.isTakingHit = false;
          _this.targetPlayer = null;
          _this.screenCenter = 0;
          _this.currentHealth = 0;
          _this.spineAvailable = false;
          _this.lastAttackTime = 0;
          _this.isInCombat = false;
          _this.healthBar = null;
          _this.httEffArr = [];
          _this.doDamageNum = 0;
          _this.randomX1 = 0;
          _this.randomX2 = 0;
          _this.randomX3 = 0;
          _this.randomX4 = 0;
          // 调试模式
          _initializerDefineProperty(_this, "debugMode", _descriptor22, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = Monster.prototype;
        _proto.onLoad = function onLoad() {
          this.screenCenter = 0;
          this.currentHealth = this.health;
          this.initSpineComponent();
          this.initCollider();
          this.initHealthBar();
          this.log("Monster 加载完成，初始位置:", this.node.position);
        };
        _proto.initHealthBar = function initHealthBar() {
          if (!this.healthBarPrefab) {
            console.error('HealthBar prefab is not assigned!');
            return;
          }

          // 实例化血条预制体，并作为怪物的子节点
          var healthBarNode = instantiate(this.healthBarPrefab);
          this.node.addChild(healthBarNode);

          // 设置血条位置（局部坐标，位于怪物头顶）
          healthBarNode.setPosition(0, this.healthBarOffset, 0);

          // 获取HealthBar组件
          this.healthBar = healthBarNode.getComponentInChildren(HealthBar);
          if (this.healthBar) {
            // 初始化血条，不需要传入targetNode，因为已经是子节点，会跟随移动
            this.healthBar.init(this.maxHealth, this.currentHealth);
            console.log('血条初始化成功');
          } else {
            console.error('HealthBar component not found on prefab!');
            healthBarNode.destroy();
          }
        };
        _proto.initSpineComponent = function initSpineComponent() {
          var _this2 = this;
          // 方法2: 如果设置了 spineNode，从该节点获取 Spine 组件
          if (this.spineNode) {
            this.spineComponent = this.spineComponent.getComponent('sp.Skeleton');
            this.spineComponent1 = this.spineComponent1.getComponent('sp.Skeleton');
            this.spineComponent2 = this.spineComponent2.getComponent('sp.Skeleton');

            // 创建 Spine 节点
            var spineNode1 = new Node('SpineCharacter1');
            this.skillSpine1 = spineNode1.addComponent(sp.Skeleton);
            spineNode1.setParent(this.node); // 设置为当前节点的子节点
            var spineNode2 = new Node('SpineCharacter2');
            this.skillSpine2 = spineNode2.addComponent(sp.Skeleton);
            spineNode2.setParent(this.node); // 设置为当前节点的子节点
            var spineNode3 = new Node('SpineCharacter3');
            this.skillSpine3 = spineNode3.addComponent(sp.Skeleton);
            spineNode3.setParent(this.node); // 设置为当前节点的子节点
            var spineNode4 = new Node('SpineCharacter4');
            this.skillSpine4 = spineNode4.addComponent(sp.Skeleton);
            spineNode4.setParent(this.node); // 设置为当前节点的子节点
            var spineNode5 = new Node('SpineCharacter4');
            this.skillSpine5 = spineNode5.addComponent(sp.Skeleton);
            spineNode5.setParent(this.node); // 设置为当前节点的子节点

            spineNode1.active = false;
            spineNode2.active = false;
            spineNode3.active = false;
            spineNode4.active = false;
            spineNode5.active = false;
            spineNode1.scale = new cc.Vec3(0.8, 0.8, 0.8);
            spineNode3.scale = new cc.Vec3(0.8, 0.8, 0.8);
            spineNode4.scale = new cc.Vec3(0.8, 0.8, 0.8);
            spineNode5.scale = new cc.Vec3(0.8, 0.8, 0.8);

            // 设置 Spine 数据
            this.skillSpine1.skeletonData = this.bossSkillComponent1;
            this.skillSpine2.skeletonData = this.bossSkillComponent2;
            this.skillSpine3.skeletonData = this.bossSkillComponent3;
            this.skillSpine4.skeletonData = this.bossSkillComponent4;
            this.skillSpine5.skeletonData = this.bossSkillComponent5;
            this.skillSpine1.setCompleteListener(function (trackEntry) {
              AudioManager.instance.playSound("skill_firecircle_ground");
              console.log('动画结束:', trackEntry.animation.name);
              _this2.skillSpine2.node.active = true;
              _this2.skillSpine2.setAnimation(0, "action", false);
              _this2.skillSpine2.node.x = _this2.randomX1;
            });
            this.skillSpine3.setCompleteListener(function (trackEntry) {
              AudioManager.instance.playSound("skill_firecircle_ground");
              console.log('动画结束:', trackEntry.animation.name);
              _this2.skillSpine2.node.active = true;
              _this2.skillSpine2.setAnimation(0, "action", false);
              _this2.skillSpine2.node.x = _this2.randomX2;
            });
            this.skillSpine4.setCompleteListener(function (trackEntry) {
              AudioManager.instance.playSound("skill_firecircle_ground");
              console.log('动画结束:', trackEntry.animation.name);
              _this2.skillSpine2.node.active = true;
              _this2.skillSpine2.setAnimation(0, "action", false);
              _this2.skillSpine2.node.x = _this2.randomX3;
            });
            this.skillSpine5.setCompleteListener(function (trackEntry) {
              AudioManager.instance.playSound("skill_firecircle_ground");
              console.log('动画结束:', trackEntry.animation.name);
              _this2.skillSpine2.node.active = true;
              _this2.skillSpine2.setAnimation(0, "action", false);
              _this2.skillSpine2.node.x = _this2.randomX4;
            });
            this.httEffArr.push(this.spineComponent1);
            this.httEffArr.push(this.spineComponent2);
            if (this.spineComponent) {
              this.log("从 spineNode 找到 Spine 组件");
              this.spineAvailable = true;
              return;
            }
          }
          this.log("Spine 组件未找到，将使用基础逻辑");
          this.spineAvailable = false;
        };
        _proto.initCollider = function initCollider() {
          // 首先检查是否已手动设置了碰撞体
          if (this.boxCollider) {
            this.log("使用手动设置的碰撞体");
          } else {
            // 尝试获取当前节点的碰撞体
            this.boxCollider = this.getComponent(BoxCollider2D);
            if (!this.boxCollider) {
              // 在子节点中查找碰撞体
              var children = this.node.children;
              for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var childCollider = child.getComponent(BoxCollider2D);
                if (childCollider) {
                  this.log("在子节点找到碰撞体:", child.name);
                  this.boxCollider = childCollider;
                  break;
                }
              }
            }
          }

          // 如果都没找到，自动添加一个碰撞体
          if (!this.boxCollider) {
            this.log("未找到碰撞体，自动添加 BoxCollider");
            this.boxCollider = this.addComponent(BoxCollider2D);
          }
          this.setupCollider();
        };
        _proto.setupCollider = function setupCollider() {
          if (!this.boxCollider) return;

          // 设置碰撞体大小和偏移
          if (this.colliderSize.width > 0 && this.colliderSize.height > 0) {
            this.boxCollider.size = this.colliderSize;
          }
          if (this.colliderOffset) {
            this.boxCollider.offset = this.colliderOffset;
          }

          // 设置为传感器（不产生物理效果，只检测碰撞）
          this.boxCollider.sensor = true;
          this.log("碰撞体设置完成，大小:", this.boxCollider.size);

          // 启用碰撞检测
          this.boxCollider.enabled = true;

          // 注册碰撞回调
          if (this.boxCollider) {
            this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.boxCollider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
          }
        }

        // 设置游戏管理器引用
        ;

        _proto.setGameManager = function setGameManager(gameManager) {
          this.gameManager = gameManager;
        };
        _proto.start = function start() {
          //this.log("Monster start, 初始状态 - 移动:", this.isMoving, "攻击:", this.isAttacking);

          if (this.spineAvailable) {
            this.playMoveAnimation();
          } else {
            this.log("Spine 不可用，使用基础移动");
          }

          // 查找玩家
          this.findPlayer();
          if (!this.healthBar) {
            this.initHealthBar();
          }

          // 初始化攻击计时器
          this.lastAttackTime = Date.now();
        };
        _proto.update = function update(dt) {
          if (!this.isAlive()) return;

          // this.log(`状态 - 移动:${this.isMoving}, 攻击:${this.isAttacking}, 受击:${this.isTakingHit}, 战斗:${this.isInCombat}`, false);

          if (this.isMoving) {
            this.moveTowardsCenter(dt);
          } else if (this.isAttacking && this.targetPlayer) {
            this.faceTarget();
          }

          // 如果在战斗中且可以攻击，执行攻击
          if (this.isInCombat && this.canAttack()) {
            this.executeAttack();
          }

          // 如果正在移动但没有目标，检查是否可以攻击
          if (!this.isAttacking && this.targetPlayer) {
            this.checkAttackRange();
          }
        };
        _proto.moveTowardsCenter = function moveTowardsCenter(dt) {
          var targetX = this.screenCenter - this.stopDistance;
          if (this.node.position.x > targetX) {
            var newX = this.node.position.x - this.moveSpeed * dt;
            this.node.setPosition(newX, this.node.position.y);

            // 面向移动方向
            this.node.scaleX = Math.abs(this.node.scaleX);

            //this.log(`移动中: ${this.node.position.x} -> ${targetX}`, false);

            // 检查是否到达目标位置
            if (this.node.position.x <= targetX) {
              this.node.setPosition(targetX, this.node.position.y);
              this.stopMoving();
              this.log("到达目标位置，停止移动");
            }
          } else {
            this.stopMoving();
          }
        };
        _proto.checkAttackRange = function checkAttackRange() {
          if (!this.targetPlayer || !this.targetPlayer.isValid) return;
          var distance = Math.abs(this.node.position.x - this.targetPlayer.position.x);
          if (distance <= this.attackRange) {
            this.log("\u73A9\u5BB6\u5728\u653B\u51FB\u8303\u56F4\u5185\uFF0C\u8DDD\u79BB: " + distance);
            this.enterCombat(this.targetPlayer);
          }
        };
        _proto.playMoveAnimation = function playMoveAnimation() {
          this.log("播放移动动画");
          if (!this.safeSpineCall('setAnimation', 0, 'Move', true)) {
            this.log("移动动画播放失败");
          }
        };
        _proto.playIdleAnimation = function playIdleAnimation() {
          this.log("播放待机动画");
          if (!this.safeSpineCall('setAnimation', 0, 'Idle', true)) {
            this.log("待机动画播放失败");
          }
        };
        _proto.playAttackAnimation = function playAttackAnimation() {
          var _this3 = this;
          this.log("播放攻击动画");
          var atkArr = ["atk", "atkb", "atk2", "atkc"];
          var atkName = atkArr[Math.floor(Math.random() * 4)];
          if (this.safeSpineCall('setAnimation', 0, atkName, false)) {
            if (this.spine.setCompleteListener) {
              this.spine.setCompleteListener(this.onSpineAnimationComplete.bind(this));
            }
          } else {
            this.log("攻击动画播放失败，使用定时器");
            this.scheduleOnce(function () {
              return _this3.onAttackFinished();
            }, 0.5);
          }
        };
        _proto.playHitAnimation = function playHitAnimation() {
          var _this4 = this;
          this.log("播放受击动画");
          if (this.safeSpineCall('setAnimation', 0, 'Hurt', false)) {
            if (this.httEffArr) {
              for (var i = 0; i < this.httEffArr.length; i++) {
                this.httEffArr[i].node.active = false;
              }
              var randomCom = this.httEffArr[Math.floor(Math.random() * this.httEffArr.length)];
              randomCom.node.active = true;
              randomCom.setAnimation(0, "Hit", false); // 播放一次
            }

            if (this.spine.setCompleteListener) {
              this.spine.setCompleteListener(this.onSpineAnimationComplete.bind(this));
            }
          } else {
            this.scheduleOnce(function () {
              return _this4.onHitFinished();
            }, 0.3);
          }
        };
        _proto.playDeathAnimation = function playDeathAnimation() {
          this.log("播放死亡动画");
          this.safeSpineCall('setAnimation', 0, 'Death', false);
        };
        _proto.bossSkillAnimation1 = function bossSkillAnimation1() {
          this.log("播放boss攻击动画");
          AudioManager.instance.playSound("skill_firecircle_fly");
          this.skillSpine1.node.active = true;
          this.skillSpine1.setAnimation(0, "action", false);
          var scale = this.skillSpine1.node.scale;
          this.skillSpine1.node.setScale(-1, scale.y, scale.z);
          var randomX1 = Math.floor(Math.random() * 300) - 300;
          this.skillSpine1.node.x = randomX1;
          this.randomX1 = randomX1;
        };
        _proto.bossSkillAnimation3 = function bossSkillAnimation3() {
          this.log("播放boss攻击动画");
          AudioManager.instance.playSound("skill_firecircle_fly");
          this.skillSpine3.node.active = true;
          this.skillSpine3.setAnimation(0, "action", false);
          var scale = this.skillSpine1.node.scale;
          this.skillSpine3.node.setScale(-1, scale.y, scale.z);
          var randomX2 = Math.floor(Math.random() * 300) - 300;
          this.skillSpine3.node.x = randomX2;
          this.randomX2 = randomX2;
        };
        _proto.bossSkillAnimation4 = function bossSkillAnimation4() {
          this.log("播放boss攻击动画");
          AudioManager.instance.playSound("skill_firecircle_fly");
          this.skillSpine4.node.active = true;
          this.skillSpine4.setAnimation(0, "action", false);
          var scale = this.skillSpine1.node.scale;
          this.skillSpine4.node.setScale(-1, scale.y, scale.z);
          var randomX3 = Math.floor(Math.random() * 300);
          this.skillSpine4.node.x = randomX3;
          this.randomX3 = randomX3;
        };
        _proto.bossSkillAnimation5 = function bossSkillAnimation5() {
          this.log("播放boss攻击动画");
          AudioManager.instance.playSound("skill_firecircle_fly");
          this.skillSpine5.node.active = true;
          this.skillSpine5.setAnimation(0, "action", false);
          var scale = this.skillSpine1.node.scale;
          this.skillSpine5.node.setScale(-1, scale.y, scale.z);
          var randomX4 = Math.floor(Math.random() * 300);
          this.skillSpine5.node.x = randomX4;
          this.randomX4 = randomX4;
        };
        _proto.onSpineAnimationComplete = function onSpineAnimationComplete(trackEntry) {
          if (!trackEntry || !trackEntry.animation) return;
          var animationName = trackEntry.animation.name;
          this.log("Spine \u52A8\u753B\u5B8C\u6210: " + animationName);
          if (animationName === 'atk') {
            this.onAttackFinished();
          } else if (animationName === 'Hurt') {
            this.onHitFinished();
          } else if (animationName === 'action') {
            this.onBossHitFinished();
          }
        };
        _proto.stopMoving = function stopMoving() {
          this.isMoving = false;
          this.playIdleAnimation();
        };
        _proto.findPlayer = function findPlayer() {
          // 查找玩家节点
          this.targetPlayer = cc.find('Canvas/characterLayer') || cc.find('characterLayer') || cc.find('characterLayer1');
          if (this.targetPlayer) {
            this.log("找到玩家:", this.targetPlayer.name);
          } else {
            this.log("未找到玩家节点");
          }
        };
        _proto.enterCombat = function enterCombat(player) {
          if (this.isTakingHit || !this.isAlive()) {
            this.log("无法进入战斗，条件不满足");
            this.isMoving = false;
            return;
          }
          this.isInCombat = true;
          this.isMoving = false;
          this.isAttacking = true;
          this.targetPlayer = player;
          this.log("进入战斗状态");
          this.playIdleAnimation();

          // 立即执行一次攻击
          this.executeAttack();
        };
        _proto.exitCombat = function exitCombat() {
          this.isInCombat = false;
          this.isAttacking = false;
          this.log("退出战斗状态");

          // 清除动画监听
          if (this.hasSpine() && this.spine.setCompleteListener) {
            this.spine.setCompleteListener(null);
          }

          // 如果没有死亡且不受击，回到移动状态
          if (this.isAlive() && !this.isTakingHit) {
            this.isMoving = true;
            this.playMoveAnimation();
          }
        };
        _proto.canAttack = function canAttack() {
          var currentTime = Date.now();
          return currentTime - this.lastAttackTime >= this.attackInterval * 1000;
        };
        _proto.executeAttack = function executeAttack() {
          if (!this.canAttack() || !this.isInCombat || !this.targetPlayer || !this.targetPlayer.isValid) {
            return;
          }
          this.log("执行攻击");
          this.lastAttackTime = Date.now();
          var playerComp = this.targetPlayer.getComponent('PlayerController');
          var playerAlive = playerComp.isAlive();
          if (playerAlive) {
            this.playAttackAnimation();
          }

          // 对玩家造成伤害
          if (this.isAlive()) {
            if (playerComp && typeof playerComp.takeDamage === 'function') {
              playerComp.takeDamage(this.attackDamage);
              this.log("\u5BF9\u73A9\u5BB6\u9020\u6210 " + this.attackDamage + " \u4F24\u5BB3");
            }
          }
        };
        _proto.onAttackFinished = function onAttackFinished() {
          this.log("攻击动画完成");
          // 攻击完成后不需要特殊处理，因为攻击是由计时器控制的
        };

        _proto.takeDamage = function takeDamage(damage, isCrit, isAoe) {
          if (isCrit === void 0) {
            isCrit = false;
          }
          if (isAoe === void 0) {
            isAoe = false;
          }
          if (!this.isAlive()) return;
          this.currentHealth -= damage;
          this.log("\u53D7\u5230 " + damage + " \u4F24\u5BB3\uFF0C\u5269\u4F59\u751F\u547D: " + this.currentHealth);

          // 播放受击动画并中断攻击
          this.isTakingHit = true;
          this.exitCombat();

          //这里判断boss逻辑根据关卡

          var canvas = cc.find('Canvas');
          if (canvas) {
            var gameManager = canvas.getComponent('GameManager');
            if (gameManager && typeof gameManager.getCurrentLevel === 'function') {
              var currentLevel = gameManager.getCurrentLevel();
              if (currentLevel == 4) {
                this.executeAttack();
                this.doDamageNum++;
                if (this.doDamageNum >= 2) {
                  this.isTakingHit = false;
                  this.doDamageNum = 0;
                  this.executeAttack();
                }
                if (this.httEffArr) {
                  for (var i = 0; i < this.httEffArr.length; i++) {
                    this.httEffArr[i].node.active = false;
                  }
                  var randomCom = this.httEffArr[Math.floor(Math.random() * this.httEffArr.length)];
                  randomCom.node.active = true;
                  //randomCom.setAnimation(0, "Hit", false); // 播放一次
                }
              } else {
                this.playHitAnimation();
              }
            }
          }
          if (this.healthBar) {
            this.healthBar.takeDamage(damage, isCrit, isAoe);
          }
          if (this.currentHealth <= 0) {
            this.die();
          }
        };
        _proto.onHitFinished = function onHitFinished() {
          this.log("受击完成");
          this.isTakingHit = false;
          if (this.isAlive()) {
            // 如果还活着且玩家在攻击范围内，继续战斗
            if (this.targetPlayer && this.targetPlayer.isValid) {
              var distance = Math.abs(this.node.position.x - this.targetPlayer.position.x);
              if (distance <= this.attackRange) {
                this.enterCombat(this.targetPlayer);
              } else {
                // 否则继续移动
                this.isMoving = true;
                this.playMoveAnimation();
              }
            } else {
              // 继续移动
              this.isMoving = true;
              this.playMoveAnimation();
            }
          }
        };
        _proto.onBossHitFinished = function onBossHitFinished() {
          this.log("boss特效完成");
          this.isTakingHit = false;
          this.bossSkillComponent2.getComponent('sp.Skeleton').setAnimation(0, "action", false);
          if (this.isAlive()) {
            // 如果还活着且玩家在攻击范围内，继续战斗
            // 对玩家造成伤害
            var playerComp = this.targetPlayer.getComponent('PlayerController');
            if (playerComp && typeof playerComp.takeDamage === 'function') {
              playerComp.takeDamage(this.attackDamage);
              this.log("\u5BF9\u73A9\u5BB6\u9020\u6210 " + this.attackDamage + " \u4F24\u5BB3");
            }
          }
        };
        _proto.die = function die() {
          var _this5 = this;
          this.log("怪物死亡");
          this.exitCombat();
          this.isMoving = false;
          this.playDeathAnimation();
          AudioManager.instance.playSound("monster_hurt");

          // 禁用碰撞体
          if (this.boxCollider) {
            this.boxCollider.enabled = false;
          }

          // 通知游戏管理器怪物死亡
          this.notifyGameManager();

          // 延迟销毁节点
          this.scheduleOnce(function () {
            if (_this5.node && _this5.node.isValid) {
              _this5.node.destroy();
            }
          }, 1.0);
        };
        _proto.notifyGameManager = function notifyGameManager() {
          try {
            var canvas = cc.find('Canvas');
            if (canvas) {
              var gameManager = canvas.getComponent('GameManager');
              if (gameManager && typeof gameManager.onMonsterDied === 'function') {
                gameManager.onMonsterDied(this.node);
              }
            }
          } catch (e) {
            this.log("通知 GameManager 失败: " + e);
          }
        };
        _proto.faceTarget = function faceTarget() {
          if (this.targetPlayer && this.targetPlayer.isValid) {
            var scaleX = Math.abs(this.node.scaleX);
            this.node.scaleX = this.targetPlayer.position.x < this.node.position.x ? scaleX : -scaleX;
          }
        }

        // 碰撞检测 - 开始接触
        ;

        _proto.onBeginContact = function onBeginContact(selfCollider, otherCollider) {
          this.log("\u78B0\u649E\u5F00\u59CB: " + otherCollider.node.name);
          if (otherCollider.node.group === 'player' || otherCollider.node.name === 'Player') {
            var player = otherCollider.node;
            var playerComp = player.getComponent('Player');
            if (playerComp && this.isAlive()) {
              this.log("与玩家碰撞，进入战斗");
              this.enterCombat(player);
            }
          }
        }

        // 碰撞检测 - 结束接触
        ;

        _proto.onEndContact = function onEndContact(selfCollider, otherCollider) {
          this.log("\u78B0\u649E\u7ED3\u675F: " + otherCollider.node.name);
          if (otherCollider.node.group === 'player' || otherCollider.node.name === 'Player') {
            this.log("与玩家分离，退出战斗");
            this.exitCombat();
          }
        }

        // 安全的 Spine 访问方法
        ;

        _proto.hasSpine = function hasSpine() {
          return this.spineAvailable && this.spineComponent && this.spineComponent.isValid;
        };
        _proto.hasBossSpine1 = function hasBossSpine1() {
          return this.bossSkillComponent1 && this.bossSkillComponent1.isValid;
        };
        _proto.safeSpineCall = function safeSpineCall(method) {
          if (!this.hasSpine()) return false;
          try {
            if (this.spine[method] && typeof this.spine[method] === 'function') {
              var _this$spine;
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              (_this$spine = this.spine)[method].apply(_this$spine, args);
              return true;
            }
          } catch (e) {
            this.log("\u8C03\u7528 Spine \u65B9\u6CD5 " + method + " \u5931\u8D25: " + e);
          }
          return false;
        };
        _proto.safeBossSpineCall = function safeBossSpineCall(method) {
          if (!this.hasBossSpine1()) return false;
          try {
            if (this.spineBoss[method] && typeof this.spineBoss[method] === 'function') {
              var _this$spineBoss;
              for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
              }
              (_this$spineBoss = this.spineBoss)[method].apply(_this$spineBoss, args);
              return true;
            }
          } catch (e) {
            this.log("\u8C03\u7528 Spine \u65B9\u6CD5 " + method + " \u5931\u8D25: " + e);
          }
          return false;
        }

        // 设置最大血量（由GameManager调用）
        ;

        _proto.setMaxHealth = function setMaxHealth(health) {
          this.maxHealth = health;
          this.currentHealth = this.maxHealth;
          this.healthBar.init(this.maxHealth, this.currentHealth);
          console.log("\u602A\u7269\u8840\u91CF\u8BBE\u7F6E\u4E3A: " + this.maxHealth);
        };
        _proto.isAlive = function isAlive() {
          return this.currentHealth > 0;
        };
        _proto.log = function log(message, alwaysShow) {
          if (alwaysShow === void 0) {
            alwaysShow = true;
          }
          if (this.debugMode || alwaysShow) {
            console.log("[Monster] " + message);
          }
        };
        _proto.onDestroy = function onDestroy() {
          if (this.hasSpine() && this.spine.setCompleteListener) {
            this.spine.setCompleteListener(null);
          }
          if (this.hasBossSpine1() && this.spineBoss.setCompleteListener) {
            this.spineBoss.setCompleteListener(null);
          }

          // 清理所有定时器
          this.unscheduleAllCallbacks();

          // 移除碰撞监听
          if (this.boxCollider) {
            this.boxCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.boxCollider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
          }
        };
        _createClass(Monster, [{
          key: "spine",
          get: function get() {
            return this.spineComponent;
          }
        }, {
          key: "spineBoss",
          get: function get() {
            return this.bossSkillComponent1;
          }

          // 安全的 Spine1 访问方法
        }, {
          key: "spine1",
          get: function get() {
            return this.spineComponent1;
          }
        }]);
        return Monster;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spineComponent", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spineComponent1", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spineComponent2", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "spineNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "boxCollider", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 80;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "health", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100000;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "attackDamage", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "colliderSize", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return cc.size(100, 100);
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "colliderOffset", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return cc.v2(0, 0);
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "stopDistance", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "attackInterval", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100000;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "healthBarPrefab", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "healthBarOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "bossSkillComponent1", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "bossSkillComponent2", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "bossSkillComponent3", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "bossSkillComponent4", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "bossSkillComponent5", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "debugMode", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/OpenURL.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Button, Component, AudioManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Button = module.Button;
      Component = module.Component;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "26fc8ak0n5PUYOH7Koz47nE", "OpenURL", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var OpenURL = exports('OpenURL', (_dec = ccclass('OpenURL'), _dec2 = property(String), _dec3 = property(Node), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(OpenURL, _Component);
        function OpenURL() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "url", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "button", _descriptor2, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = OpenURL.prototype;
        // 下一步按钮
        _proto.start = function start() {
          // 获取按钮组件并添加点击事件
          if (this.button) {
            this.button.on(Button.EventType.CLICK, this.openURL, this);
          }
        };
        _proto.openURL = function openURL() {
          // 跳转到外部链接
          if (this.url && this.url !== "") {
            AudioManager.instance.playSound('voc_click', 0.8);
            window.open(this.url, '_blank');
          }
        };
        return OpenURL;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "url", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "https://www.baidu.com";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "button", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PlayerController.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SimpleParallaxTest.ts', './HealthBar.ts', './AudioManager.ts'], function (exports) {
  var _inheritsLoose, _createClass, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy, BoxCollider2D, Contact2DType, ProgressBar, SimpleParallaxTest, HealthBar, AudioManager;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      BoxCollider2D = module.BoxCollider2D;
      Contact2DType = module.Contact2DType;
      ProgressBar = module.ProgressBar;
    }, function (module) {
      SimpleParallaxTest = module.SimpleParallaxTest;
    }, function (module) {
      HealthBar = module.HealthBar;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29;
      cclegacy._RF.push({}, "2c4e19/Bu9MKLC8FdqJsmq3", "PlayerController", undefined);
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var PlayerController = exports('default', (_dec = property(cc.Component), _dec2 = property(cc.Node), _dec3 = property(BoxCollider2D), _dec4 = property({
        type: cc.Float
      }), _dec5 = property({
        type: cc.Float
      }), _dec6 = property({
        type: cc.Float
      }), _dec7 = property(cc.Size), _dec8 = property(cc.Vec2), _dec9 = property({
        type: cc.Float,
        tooltip: "攻击检测范围"
      }), _dec10 = property({
        type: cc.Float,
        tooltip: "攻击间隔（秒）"
      }), _dec11 = property({
        type: cc.String,
        tooltip: "移动动画名称"
      }), _dec12 = property({
        type: cc.String,
        tooltip: "待机动画名称"
      }), _dec13 = property({
        type: cc.String,
        tooltip: "攻击动画名称"
      }), _dec14 = property({
        type: cc.String,
        tooltip: "受击动画名称"
      }), _dec15 = property({
        type: cc.String,
        tooltip: "死亡动画名称"
      }), _dec16 = property(cc.Node), _dec17 = property(cc.Node), _dec18 = property({
        type: cc.Float,
        tooltip: "每次移动的距离"
      }), _dec19 = property(cc.Node), _dec20 = property({
        type: cc.Float,
        tooltip: "AOE攻击范围"
      }), _dec21 = property({
        type: cc.Float,
        tooltip: "暴击率 (0-1)"
      }), _dec22 = property({
        type: cc.Float,
        tooltip: "暴击伤害倍数"
      }), _dec23 = property({
        type: cc.Boolean,
        tooltip: "是否启用多段伤害"
      }), _dec24 = property({
        type: cc.Integer,
        tooltip: "多段伤害次数"
      }), _dec25 = property({
        type: cc.Float,
        tooltip: "多段伤害间隔(秒)"
      }), _dec26 = property({
        type: cc.Float,
        tooltip: "多段伤害递减比例"
      }), _dec27 = property(cc.Node), _dec28 = property({
        type: cc.Boolean
      }), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(PlayerController, _cc$Component);
        function PlayerController() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "spineComponent", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spineNode", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "boxCollider", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "moveSpeed", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "maxHealth", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "health", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackDamage", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "colliderSize", _descriptor8, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "colliderOffset", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackRange", _descriptor10, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackInterval", _descriptor11, _assertThisInitialized(_this));
          // 动画名称属性
          _initializerDefineProperty(_this, "moveAnimationName", _descriptor12, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "idleAnimationName", _descriptor13, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "attackAnimationName", _descriptor14, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "hurtAnimationName", _descriptor15, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "deathAnimationName", _descriptor16, _assertThisInitialized(_this));
          // 移动按钮
          _initializerDefineProperty(_this, "moveButton", _descriptor17, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "autoEffNode", _descriptor18, _assertThisInitialized(_this));
          // 移动目标位置
          _initializerDefineProperty(_this, "moveDistance", _descriptor19, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "levelUpSpine", _descriptor20, _assertThisInitialized(_this));
          // === 新增属性 ===
          _initializerDefineProperty(_this, "aoeRange", _descriptor21, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "critRate", _descriptor22, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "critMultiplier", _descriptor23, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "enableMultiHit", _descriptor24, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "multiHitCount", _descriptor25, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "multiHitInterval", _descriptor26, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "multiHitDamageReduction", _descriptor27, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "healthBarNode", _descriptor28, _assertThisInitialized(_this));
          _this.isMoving = false;
          _this.isAttacking = false;
          _this.isTakingHit = false;
          _this.targetMonster = null;
          _this.currentHealth = 0;
          _this.spineAvailable = false;
          _this.lastAttackTime = 0;
          _this.isInCombat = false;
          _this.targetPosition = null;
          _this.moveTween = null;
          _this.healthBar = null;
          // 玩家属性（可根据等级提升）
          _this._attackPower = 10;
          _this._maxHealth = 100;
          _this._currentHealth = 100;
          _this.firstEnter = true;
          _this.attackAnimationNameArr = [];
          // === 新增私有变量 ===
          _this.multiHitTimer = null;
          _this.currentHitCount = 0;
          _this.isMultiHitActive = false;
          _this.currentAttackAnimation = "";
          _this.doDamageNum = 0;
          // 调试模式
          _initializerDefineProperty(_this, "debugMode", _descriptor29, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = PlayerController.prototype;
        _proto.getParallaxTest = function getParallaxTest() {
          var _this$node$parent;
          // 根据你的节点结构调整查找路径
          var node = (_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getChildByName('test');
          return (node == null ? void 0 : node.getComponent(SimpleParallaxTest)) || null;
        };
        _proto.onLoad = function onLoad() {
          this.currentHealth = this.health;
          this.healthBar = this.getComponentInChildren(HealthBar);
          if (this.healthBar) {
            this.healthBar.init(this.maxHealth, this.currentHealth);
          }

          // 如果预先设置了levelUpSpine，则初始化隐藏
          if (this.levelUpSpine) {
            this.levelUpSpine.active = false;
          }
          var gameManagerNode = cc.find("Canvas");
          if (gameManagerNode) {
            this.gameManager = gameManagerNode.getComponent("GameManager");
          }
          this.initSpineComponent();
          this.initCollider();
          this.setupButtonEvents();
          this.node.on('player-skill-upgraded', this.onSkillUpgraded, this);
          this.log("Player 加载完成");
          this.attackAnimationNameArr.push(this.attackAnimationName);
          this.attackAnimationNameArr.push("atk3g");
          this.attackAnimationNameArr.push("atk2");
        };
        _proto.onSkillUpgraded = function onSkillUpgraded(newEffect, delay) {
          this.attackAnimationName = newEffect;
          this.attackAnimationNameArr.push(newEffect);
          this.attackInterval = delay;
        };
        _proto.initSpineComponent = function initSpineComponent() {
          // 方法1: 如果已经手动设置了 spineComponent
          if (this.spineComponent) {
            this.log("使用手动设置的 Spine 组件");
            this.spineAvailable = true;
            this.debugSpineInfo();
            return;
          }

          // 方法2: 如果设置了 spineNode，从该节点获取 Spine 组件
          if (this.spineNode) {
            this.spineComponent = this.spineNode.getComponent('sp.Skeleton');
            if (this.spineComponent) {
              this.log("从 spineNode 找到 Spine 组件");
              this.spineAvailable = true;
              this.debugSpineInfo();
              return;
            }
          }

          // 方法3: 在当前节点查找 Spine 组件
          this.spineComponent = this.node.getComponent('sp.Skeleton');
          if (this.spineComponent) {
            this.log("在当前节点找到 Spine 组件");
            this.spineAvailable = true;
            this.debugSpineInfo();
            return;
          }

          // 方法4: 在子节点中查找 Spine 组件
          var children = this.node.children;
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var spineComp = child.getComponent('sp.Skeleton');
            if (spineComp) {
              this.spineComponent = spineComp;
              this.log("在子节点找到 Spine 组件:", child.name);
              this.spineAvailable = true;
              this.debugSpineInfo();
              return;
            }
          }
          this.log("Spine 组件未找到，将使用基础逻辑");
          this.spineAvailable = false;
        };
        _proto.debugSpineInfo = function debugSpineInfo() {
          if (!this.hasSpine()) return;
          try {
            // 获取 Spine 资源信息
            var skeletonData = this.spine.skeletonData;
            if (skeletonData) {
              this.log("Spine \u8D44\u6E90: " + skeletonData.name);

              // 获取所有动画名称
              if (skeletonData.anims) {
                var animNames = [];
                for (var i = 0; i < skeletonData.anims.length; i++) {
                  animNames.push(skeletonData.anims[i].name);
                }
                this.log("\u53EF\u7528\u52A8\u753B: " + animNames.join(', '));
              }
            }
          } catch (e) {
            this.log("\u8C03\u8BD5Spine\u4FE1\u606F\u65F6\u51FA\u9519: " + e);
          }
        };
        _proto.initCollider = function initCollider() {
          // 首先检查是否已手动设置了碰撞体
          if (this.boxCollider) {
            this.log("使用手动设置的碰撞体");
          } else {
            // 尝试获取当前节点的碰撞体
            this.boxCollider = this.getComponent(BoxCollider2D);
            if (!this.boxCollider) {
              // 在子节点中查找碰撞体
              var children = this.node.children;
              for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var childCollider = child.getComponent(BoxCollider2D);
                if (childCollider) {
                  this.log("在子节点找到碰撞体:", child.name);
                  this.boxCollider = childCollider;
                  break;
                }
              }
            }
          }

          // 如果都没找到，自动添加一个碰撞体
          if (!this.boxCollider) {
            this.log("未找到碰撞体，自动添加 BoxCollider");
            this.boxCollider = this.addComponent(BoxCollider2D);
          }
          this.setupCollider();
        };
        _proto.setupCollider = function setupCollider() {
          if (!this.boxCollider) return;

          // 设置碰撞体大小和偏移
          if (this.colliderSize.width > 0 && this.colliderSize.height > 0) {
            this.boxCollider.size = this.colliderSize;
          }
          if (this.colliderOffset) {
            this.boxCollider.offset = this.colliderOffset;
          }

          // 设置为传感器（不产生物理效果，只检测碰撞）
          this.boxCollider.sensor = true;
          this.log("碰撞体设置完成，大小:", this.boxCollider.size);

          // 启用碰撞检测
          this.boxCollider.enabled = true;

          // 注册碰撞回调
          if (this.boxCollider) {
            this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.boxCollider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
          }
        };
        _proto.setupButtonEvents = function setupButtonEvents() {
          if (this.moveButton) {
            // 添加按钮点击事件
            this.moveButton.on(cc.Node.EventType.TOUCH_START, this.onMoveButtonClick, this);
            this.log("移动按钮事件注册完成");
          } else {
            this.log("未找到移动按钮");
          }
        };
        _proto.start = function start() {
          //this.log("Player start, 初始状态 - 移动:", this.isMoving, "攻击:", this.isAttacking);

          if (this.spineAvailable) {
            this.playIdleAnimation();
          } else {
            this.log("Spine 不可用，使用基础逻辑");
          }
          // 查找怪物
          this.findMonster();

          // 初始化攻击计时器
          this.lastAttackTime = Date.now();
        };
        _proto.update = function update(dt) {
          if (!this.isAlive()) return;

          //this.log(`状态 - 移动:${this.isMoving}, 攻击:${this.isAttacking}, 受击:${this.isTakingHit}, 战斗:${this.isInCombat}`, false);

          // 定期更新目标怪物
          if (!this.targetMonster || !this.targetMonster.isValid) {
            this.findMonster();
          }

          // 如果在战斗中且可以攻击，执行攻击
          if (this.isInCombat && this.canAttack() && this.targetMonster) {
            //this.executeAttack();
            this.checkAttackRange();
          }

          // 如果正在移动但没有目标，检查是否可以攻击
          if (this.targetMonster && this.isMoving && !this.isAttacking && this.targetMonster) {
            this.checkAttackRange();
          }
        };
        _proto.checkAttackRange = function checkAttackRange() {
          var _this2 = this;
          if (!this.targetMonster || !this.targetMonster.isValid) return;
          var canvas = cc.find('Canvas');
          var gameManager = canvas.getComponent('GameManager');
          if (canvas && gameManager && typeof gameManager.getCurrentLevel === 'function') {
            var currentLevel = gameManager.getCurrentLevel();
            if (currentLevel == 4) {
              //技能升级 攻击距离提升
              this.attackRange = 270;
            }
            var distance = Math.abs(this.node.position.x - this.targetMonster.position.x);
            if (distance <= this.attackRange) {
              this.log("\u73A9\u5BB6\u5728\u653B\u51FB\u8303\u56F4\u5185\uFF0C\u8DDD\u79BB: " + distance);
              if (currentLevel == 4 && this.firstEnter) {
                this.firstEnter = false;
                this.scheduleOnce(function () {
                  _this2.playHitAnimation();
                  _this2.node.x = _this2.node.x - 50;
                  _this2.enterCombat(_this2.targetMonster);
                }, 0.1);
              } else {
                this.enterCombat(this.targetMonster);
              }
            } else {
              if (!this.isMoving) {
                this.playMoveAnimation();
              }
            }
          }
        }

        // 移动按钮点击
        ;

        _proto.onMoveButtonClick = function onMoveButtonClick() {
          if (this.isAttacking || this.isTakingHit || this.isInCombat || !this.isAlive()) {
            this.log("当前状态无法移动");
            return;
          }
          AudioManager.instance.playSound('voc_click', 0.8);
          if (this.autoEffNode.active == true) {
            this.gameManager.startLevel(1);
          }
          this.log("移动按钮点击，开始移动");
          this.startMove();
        }

        // 开始移动
        ;

        _proto.startMove = function startMove() {
          var _this3 = this;
          if (this.isMoving) {
            this.log("已经在移动中");
            return;
          }
          this.autoEffNode.active = false;
          this.isMoving = true;

          // 计算目标位置
          this.targetPosition = cc.v3(this.node.position.x + this.moveDistance, this.node.position.y, this.node.position.z);
          this.log("\u5F00\u59CB\u79FB\u52A8\u5230\u4F4D\u7F6E: " + this.targetPosition);

          // 播放移动动画
          this.playMoveAnimation();

          // 使用Tween进行平滑移动
          if (this.moveTween) {
            this.moveTween.stop();
          }
          var moveDuration = this.moveDistance / this.moveSpeed;
          this.moveTween = cc.tween(this.node).to(moveDuration, {
            position: this.targetPosition
          }).call(function () {
            _this3.log("移动完成");
            _this3.finishMove();
          }).start();
        }

        // 完成移动
        ;

        _proto.finishMove = function finishMove() {
          this.isMoving = false;
          this.moveTween = null;

          // 播放待机动画
          this.playIdleAnimation();
          this.log("移动结束，回到待机状态");
        }

        // 停止移动（被中断时调用）
        ;

        _proto.stopMove = function stopMove() {
          if (this.moveTween) {
            this.moveTween.stop();
            this.moveTween = null;
          }
          this.isMoving = false;
          this.log("移动被中断");
        };
        _proto.findMonster = function findMonster() {
          if (!this.gameManager) {
            this.log("GameManager未找到");
            return;
          }
          var monsters = this.gameManager.getMonsters();
          if (monsters.length === 0) {
            this.targetMonster = null;
            this.log("没有怪物");
            return;
          }

          // 选择距离最近的怪物
          var playerPos = this.node.getPosition();
          //let minDistance = Number.MAX_VALUE;

          var nearestMonster = monsters[0];
          var minDistance = cc.Vec2.distance(playerPos, nearestMonster.getPosition());
          for (var i = 1; i < monsters.length; i++) {
            var distance = cc.Vec2.distance(playerPos, monsters[i].getPosition());
            if (distance < minDistance) {
              minDistance = distance;
              nearestMonster = monsters[i];
            }
          }
          this.targetMonster = nearestMonster;
          this.log("找到最近怪物:", this.targetMonster.name);
        };
        _proto.playMoveAnimation = function playMoveAnimation() {
          this.log("播放移动动画");
          this.isMoving = true;

          // 使用节点查找的方式
          var parallaxComp = this.getParallaxTest();
          if (parallaxComp) {
            parallaxComp.setIsScrolling(true);
          }
          if (!this.tryPlayAnimation(this.moveAnimationName, true)) {
            this.log("移动动画播放失败，使用待机动画");
            // this.safeSpineCall('setAnimation', 0, this.idleAnimationName, true);
          }
        };

        _proto.playIdleAnimation = function playIdleAnimation() {
          this.log("播放待机动画");
          this.isMoving = false;

          // 使用节点查找的方式
          var parallaxComp = this.getParallaxTest();
          if (parallaxComp) {
            parallaxComp.setIsScrolling(false);
          }
          if (!this.tryPlayAnimation(this.idleAnimationName, true)) {
            this.log("待机动画播放失败");
          }
        };
        _proto.playAttackAnimation = function playAttackAnimation() {
          var _this4 = this;
          this.log("播放攻击动画");
          this.isMoving = false;

          // 使用节点查找的方式
          var parallaxComp = this.getParallaxTest();
          if (parallaxComp) {
            parallaxComp.setIsScrolling(false);
          }
          var randomAtkName = this.attackAnimationNameArr[Math.floor(Math.random() * this.attackAnimationNameArr.length)];
          this.currentAttackAnimation = randomAtkName; // 记录当前攻击动画

          if (randomAtkName == "atk") {
            AudioManager.instance.playSound("atk_1");
            this.attackInterval = 0.2;
          } else if (randomAtkName == "atk2") {
            AudioManager.instance.playSound("atk_2");
            this.attackInterval = 0.7;
          } else if (randomAtkName == "atk3e") {
            AudioManager.instance.playSound("atk_2");
            this.attackInterval = 0.5;
          } else if (randomAtkName == "atk3g") {
            AudioManager.instance.playSound("atk_2");
            this.attackInterval = 0.5;
          } else if (randomAtkName == "ult") {
            AudioManager.instance.playSound("atk_2");
            this.attackInterval = 0.5;
          }
          if (this.tryPlayAnimation(randomAtkName)) {
            this.log("攻击动画播放成功");
            if (this.spine.setCompleteListener) {
              this.spine.setCompleteListener(this.onSpineAnimationComplete.bind(this));
            }
          } else {
            this.log("攻击动画播放失败，使用定时器");
            // 尝试备选动画名称
            var alternativeNames = ['idle', 'Idle', 'atk', 'Atk', 'hurt', 'Hurt'];
            var played = false;
            for (var _i = 0, _alternativeNames = alternativeNames; _i < _alternativeNames.length; _i++) {
              var name = _alternativeNames[_i];
              if (this.tryPlayAnimation(name)) {
                played = true;
                if (this.spine.setCompleteListener) {
                  this.spine.setCompleteListener(this.onSpineAnimationComplete.bind(this));
                }
                break;
              }
            }
            if (!played) {
              this.safeSpineCall('setAnimation', 0, this.idleAnimationName, true);
              this.scheduleOnce(function () {
                return _this4.onAttackFinished();
              }, 1.5);
            }
          }
        };
        _proto.playHitAnimation = function playHitAnimation() {
          var _this5 = this;
          this.log("播放受击动画");
          this.isMoving = false;
          if (this.tryPlayAnimation(this.hurtAnimationName, false)) {
            if (this.spine.setCompleteListener) {
              this.spine.setCompleteListener(this.onSpineAnimationComplete.bind(this));
            }
          } else {
            // 尝试备选动画名称
            var alternativeNames = ['hurt', 'Hurt', 'hit', 'Hit'];
            var played = false;
            for (var _i2 = 0, _alternativeNames2 = alternativeNames; _i2 < _alternativeNames2.length; _i2++) {
              var name = _alternativeNames2[_i2];
              if (this.tryPlayAnimation(name, false)) {
                played = true;
                if (this.spine.setCompleteListener) {
                  this.spine.setCompleteListener(this.onSpineAnimationComplete.bind(this));
                }
                break;
              }
            }
            if (!played) {
              this.scheduleOnce(function () {
                return _this5.onHitFinished();
              }, 0.2);
            }
          }
        };
        _proto.playDeathAnimation = function playDeathAnimation() {
          this.log("播放死亡动画");
          this.isMoving = false;
          if (!this.tryPlayAnimation(this.deathAnimationName)) {
            this.log("死亡动画播放失败，使用待机动画");
            this.safeSpineCall('setAnimation', 0, this.idleAnimationName, true);
          }
        }

        // 尝试播放动画的通用方法
        ;

        _proto.tryPlayAnimation = function tryPlayAnimation(animationName, isLoop) {
          if (!this.hasSpine()) return false;
          try {
            // 检查动画是否存在
            if (this.spine.findAnimation) {
              var animation = this.spine.findAnimation(animationName);
              if (!animation) {
                this.log("\u52A8\u753B " + animationName + " \u4E0D\u5B58\u5728");
                return false;
              }
            }

            // 播放动画
            isLoop = isLoop === null ? false : isLoop;
            return this.safeSpineCall('setAnimation', 0, animationName, isLoop);
          } catch (e) {
            this.log("\u5C1D\u8BD5\u64AD\u653E\u52A8\u753B " + animationName + " \u65F6\u51FA\u9519: " + e);
            return false;
          }
        };
        _proto.onSpineAnimationComplete = function onSpineAnimationComplete(trackEntry) {
          if (!trackEntry || !trackEntry.animation) return;
          var animationName = trackEntry.animation.name;
          this.log("Spine \u52A8\u753B\u5B8C\u6210: " + animationName);

          // 判断是否为攻击动画
          var isAttackAnim = this.attackAnimationNameArr.includes(animationName) || animationName === 'atk' || animationName === 'atk2' || animationName === 'atk3f' || animationName === 'atk3g' || animationName === 'ult';
          if (isAttackAnim) {
            this.isAttacking = false;

            // 如果是多段攻击，确保停止
            if (this.isMultiHitActive) {
              this.stopMultiHitAttack();
            }
            this.onAttackFinished();
          } else if (animationName === this.hurtAnimationName || animationName === 'hurt' || animationName === 'Hurt') {
            this.onHitFinished();
          }
        };
        _proto.enterCombat = function enterCombat(monster) {
          if (this.isTakingHit || !this.isAlive()) {
            this.log("无法进入战斗，条件不满足");
            return;
          }

          // 停止移动
          this.stopMove();
          this.isInCombat = true;
          this.isMoving = false;
          this.isAttacking = true;
          this.targetMonster = monster;
          this.log("进入战斗状态");
          this.playIdleAnimation();

          // 立即执行一次攻击
          this.executeAttack();
        };
        _proto.exitCombat = function exitCombat() {
          this.isInCombat = false;

          // 停止多段攻击
          if (this.isMultiHitActive) {
            this.stopMultiHitAttack();
          }
          this.log("退出战斗状态");

          // 清除动画监听
          if (this.hasSpine() && this.spine.setCompleteListener) {
            this.spine.setCompleteListener(null);
          }

          // 如果没有死亡且不受击，回到待机状态
          if (this.isAlive() && !this.isTakingHit) {
            this.playIdleAnimation();
          }
        };
        _proto.canAttack = function canAttack() {
          var currentTime = Date.now();
          return currentTime - this.lastAttackTime >= this.attackInterval * 1000;
        };
        _proto.executeAttack = function executeAttack() {
          if (!this.canAttack() || !this.isInCombat || !this.targetMonster || !this.targetMonster.isValid) {
            return;
          }
          this.log("执行攻击");
          this.lastAttackTime = Date.now();

          // 播放攻击动画
          this.playAttackAnimation();

          // 判断是否为特殊技能（多段伤害）
          var isSpecialSkill = this.isSpecialSkillAnimation(this.currentAttackAnimation);
          if (isSpecialSkill && this.enableMultiHit) {
            this.startMultiHitAttack();
          } else {
            // 普通攻击：AOE伤害
            this.doAoeDamage(false);
          }

          // // 对怪物造成伤害
          // const monsterComp = this.targetMonster.getComponent('Monster');
          // if (monsterComp && typeof monsterComp.takeDamage === 'function') {
          //     this.playAttackAnimation();
          //     monsterComp.takeDamage(this.attackDamage);
          //     this.log(`对怪物造成 ${this.attackDamage} 伤害`);
          //}
        }

        // === 新增方法：AOE伤害 ===
        ;

        _proto.doAoeDamage = function doAoeDamage(isCritHit) {
          var _this6 = this;
          if (isCritHit === void 0) {
            isCritHit = false;
          }
          if (!this.gameManager) return;
          var monsters = this.gameManager.getMonsters();
          if (monsters.length === 0) return;
          var playerPos = this.node.getPosition();
          var hitCount = 0;
          monsters.forEach(function (monster) {
            if (!monster.isValid) return;
            var distance = cc.Vec2.distance(playerPos, monster.getPosition());
            if (distance <= _this6.aoeRange) {
              var damage = _this6.calculateDamage(isCritHit);
              var monsterComp = monster.getComponent('Monster');
              if (monsterComp && typeof monsterComp.takeDamage === 'function') {
                // 传递是否暴击的信息给怪物
                monsterComp.takeDamage(damage.damage, damage.isCrit);
                hitCount++;
                _this6.log("\u5BF9\u602A\u7269 " + monster.name + " \u9020\u6210 " + damage.damage + " \u4F24\u5BB3" + (damage.isCrit ? ' (暴击!)' : ''));
              }
            }
          });
          if (hitCount > 0) {
            this.log("AOE\u653B\u51FB\u547D\u4E2D " + hitCount + " \u4E2A\u602A\u7269");
          }
        }

        // === 新增方法：计算伤害（包含暴击） ===
        ;

        _proto.calculateDamage = function calculateDamage(isForceCrit) {
          if (isForceCrit === void 0) {
            isForceCrit = false;
          }
          var isCrit = isForceCrit || Math.random() < this.critRate;
          var damage = this.attackDamage;
          if (isCrit) {
            damage = Math.floor(damage * this.critMultiplier);
          }
          return {
            damage: damage,
            isCrit: isCrit
          };
        }

        // === 新增方法：开始多段伤害 ===
        ;

        _proto.startMultiHitAttack = function startMultiHitAttack() {
          var _this7 = this;
          this.isMultiHitActive = true;
          this.currentHitCount = 0;

          // 清除之前的定时器
          if (this.multiHitTimer) {
            clearInterval(this.multiHitTimer);
          }

          // 立即执行第一次伤害
          this.doMultiHitDamage();

          // 设置多段伤害定时器
          this.multiHitTimer = setInterval(function () {
            _this7.doMultiHitDamage();
          }, this.multiHitInterval * 1000);
        }

        // === 新增方法：执行多段伤害 ===
        ;

        _proto.doMultiHitDamage = function doMultiHitDamage() {
          if (this.currentHitCount >= this.multiHitCount || !this.isMultiHitActive) {
            this.stopMultiHitAttack();
            return;
          }

          // 计算递减伤害
          var damageReduction = 1 - this.currentHitCount * this.multiHitDamageReduction;
          var currentDamage = Math.floor(this.attackDamage * Math.max(damageReduction, 0.2)); // 最低保留20%伤害

          // 临时修改攻击力用于这次伤害计算
          var originalDamage = this.attackDamage;
          this.attackDamage = currentDamage;

          // 执行AOE伤害，最后一击可能暴击
          var isLastHit = this.currentHitCount === this.multiHitCount - 1;
          this.doAoeDamage(isLastHit);

          // 恢复原始攻击力
          this.attackDamage = originalDamage;
          this.currentHitCount++;
          this.log("\u591A\u6BB5\u653B\u51FB\u7B2C " + this.currentHitCount + " \u6BB5\uFF0C\u4F24\u5BB3: " + currentDamage);
        }

        // === 新增方法：停止多段伤害 ===
        ;

        _proto.stopMultiHitAttack = function stopMultiHitAttack() {
          if (this.multiHitTimer) {
            clearInterval(this.multiHitTimer);
            this.multiHitTimer = null;
          }
          this.isMultiHitActive = false;
          this.currentHitCount = 0;
          this.log("多段攻击结束");
        }

        // === 新增方法：判断是否为特殊技能动画 ===
        ;

        _proto.isSpecialSkillAnimation = function isSpecialSkillAnimation(animationName) {
          // 这里可以根据动画名称判断是否为特殊技能
          // 例如：包含特定关键词的动画视为特殊技能
          var specialKeywords = ['ult', 'atk2', 'atk3g'];
          return specialKeywords.some(function (keyword) {
            return animationName.toLowerCase().includes(keyword.toLowerCase());
          });
        };
        _proto.onAttackFinished = function onAttackFinished() {
          this.log("攻击动画完成");
          // 攻击完成后不需要特殊处理，因为攻击是由计时器控制的
        };

        _proto.takeDamage = function takeDamage(damage) {
          if (!this.isAlive()) return;
          this.currentHealth -= damage;
          this.log("\u53D7\u5230 " + damage + " \u4F24\u5BB3\uFF0C\u5269\u4F59\u751F\u547D: " + this.currentHealth);

          // 停止移动
          this.stopMove();

          // 播放受击动画并中断攻击
          this.isTakingHit = true;
          // this.exitCombat();
          // this.playHitAnimation();
          this.doDamageNum++;
          var canvas = cc.find('Canvas');
          var gameManager = canvas.getComponent('GameManager');
          if (canvas && gameManager && typeof gameManager.getCurrentLevel === 'function') {
            var currentLevel = gameManager.getCurrentLevel();
            if (currentLevel == 4) {
              //this.onHitFinished()
              this.isTakingHit = false;
            } else {
              this.exitCombat();
              this.playHitAnimation();
              if (this.doDamageNum >= 2) {
                this.isTakingHit = false;
                this.doDamageNum = 0;
                this.onHitFinished();
              }
            }
          }

          //人物掉血
          // 获取HealthBar组件
          var progressCom = this.healthBarNode.getComponent(ProgressBar);
          if (this.healthBarNode) {
            // 初始化血条
            var progress = this.currentHealth / this.maxHealth;
            if (progressCom) {
              progressCom.progress = progress;
            }
          } else {
            this.healthBarNode.destroy();
          }
          if (this.currentHealth <= 0) {
            this.die();
          }
        };
        _proto.onHitFinished = function onHitFinished() {
          this.log("受击完成");
          this.isTakingHit = false;

          // 停止多段攻击
          if (this.isMultiHitActive) {
            this.stopMultiHitAttack();
          }
          if (this.isAlive()) {
            // 如果还活着且怪物在攻击范围内，继续战斗
            if (this.targetMonster && this.targetMonster.isValid) {
              this.enterCombat(this.targetMonster);
            } else {
              // 否则回到待机状态
              this.playIdleAnimation();
            }
          }
        };
        _proto.die = function die() {
          var _this8 = this;
          this.log("玩家死亡");
          this.exitCombat();
          this.isMoving = false;

          // 停止多段攻击
          if (this.isMultiHitActive) {
            this.stopMultiHitAttack();
          }

          // 停止移动
          this.stopMove();
          this.playDeathAnimation();

          // 禁用碰撞体
          if (this.boxCollider) {
            this.boxCollider.enabled = false;
          }

          // 禁用移动按钮
          if (this.moveButton) {
            this.moveButton.active = false;
          }

          // 游戏结束逻辑
          this.scheduleOnce(function () {
            _this8.log("游戏结束");
            // 这里可以触发游戏结束界面
            try {
              var canvas = cc.find('Canvas');
              if (canvas) {
                var gameManager = canvas.getComponent('GameManager');
                if (gameManager && typeof gameManager.onPlayerDied === 'function') {
                  gameManager.onPlayerDied(_this8.node);
                }
              }
            } catch (e) {
              _this8.log("通知 GameManager 失败: " + e);
            }
          }, 1.0);
        }

        // 碰撞检测 - 开始接触
        ;

        _proto.onBeginContact = function onBeginContact(selfCollider, otherCollider) {
          this.log("\u78B0\u649E\u5F00\u59CB: " + otherCollider.node.name);
          if (otherCollider.node.group === 'monster' || otherCollider.node.name.includes('Monster')) {
            var monster = otherCollider.node;
            var monsterComp = monster.getComponent('Monster');
            if (monsterComp && this.isAlive()) {
              this.log("与怪物碰撞，进入战斗");
              this.enterCombat(monster);
            }
          }
        }

        // 碰撞检测 - 结束接触
        ;

        _proto.onEndContact = function onEndContact(selfCollider, otherCollider) {
          this.log("\u78B0\u649E\u7ED3\u675F: " + otherCollider.node.name);
          if (otherCollider.node.group === 'monster' || otherCollider.node.name.includes('Monster')) {
            this.log("与怪物分离，退出战斗");
            this.exitCombat();
          }
        }

        // 安全的 Spine 访问方法
        ;

        _proto.hasSpine = function hasSpine() {
          return this.spineAvailable && this.spineComponent && this.spineComponent.isValid;
        };
        _proto.safeSpineCall = function safeSpineCall(method) {
          if (!this.hasSpine()) return false;
          try {
            if (this.spine[method] && typeof this.spine[method] === 'function') {
              var _this$spine;
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              (_this$spine = this.spine)[method].apply(_this$spine, args);
              return true;
            }
          } catch (e) {
            this.log("\u8C03\u7528 Spine \u65B9\u6CD5 " + method + " \u5931\u8D25: " + e);
          }
          return false;
        };
        _proto.isAlive = function isAlive() {
          return this.currentHealth > 0;
        };
        _proto.log = function log(message, alwaysShow) {
          if (alwaysShow === void 0) {
            alwaysShow = true;
          }
          if (this.debugMode || alwaysShow) {
            console.log("[Player] " + message);
          }
        }

        // 升级回调
        ;

        _proto.onLevelUp = function onLevelUp(newLevel) {
          console.log("\u73A9\u5BB6\u5347\u7EA7\u5230 " + newLevel + " \u7EA7\uFF0C\u5C5E\u6027\u63D0\u5347!");

          // 提升玩家属性
          this._attackPower += 5;
          this._maxHealth += 20;
          this._currentHealth = this._maxHealth; // 升级时恢复满血

          this.attackDamage += this._attackPower;

          // 播放升级特效
          this.playLevelUpEffect();

          // 更新UI（如果有血条等）
          this.updatePlayerUI();
        }

        // 播放升级特效
        ;

        _proto.playLevelUpEffect = function playLevelUpEffect() {
          // 这里可以播放粒子效果、动画等
          console.log("✨ 播放升级特效!");
          AudioManager.instance.playSound('voc_lvup', 0.8);

          // 使用预创建的Label节点
          if (this.levelUpSpine) {
            this.levelUpSpine.active = true;
            this.levelUpSpine.getComponent('sp.Skeleton').setAnimation(0, "action", false);
          } else {
            console.warn("未找到预创建的升级文本节点");
          }
        }

        //装备属性生效
        ;

        _proto.setEquipData = function setEquipData(data) {
          this.attackDamage += data.attack;
        }

        // 更新玩家UI
        ;

        _proto.updatePlayerUI = function updatePlayerUI() {
          // 如果有血条等UI，在这里更新
        }

        // 获取攻击力（考虑等级加成）
        ;

        _proto.getAttackPower = function getAttackPower() {
          return this._attackPower;
        }

        // 停止攻击（被 GameManager 调用）
        ;

        _proto.stopAttack = function stopAttack() {
          console.log("玩家停止攻击");
          this.isAttacking = false;
          this.targetMonster = null;

          // 停止攻击动画，回到待机状态
          this.playIdleAnimation();

          // 恢复移动能力
          // this.resumeMovement();
        };

        _proto.onDestroy = function onDestroy() {
          // 停止多段攻击定时器
          if (this.multiHitTimer) {
            clearInterval(this.multiHitTimer);
          }
          if (this.hasSpine() && this.spine.setCompleteListener) {
            this.spine.setCompleteListener(null);
          }

          // 清理所有定时器
          this.unscheduleAllCallbacks();

          // 停止移动Tween
          if (this.moveTween) {
            this.moveTween.stop();
          }

          // 移除碰撞监听
          if (this.boxCollider) {
            this.boxCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.boxCollider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
          }

          // 移除按钮事件监听
          if (this.moveButton) {
            this.moveButton.off(cc.Node.EventType.TOUCH_START, this.onMoveButtonClick, this);
          }
        };
        _createClass(PlayerController, [{
          key: "spine",
          get: function get() {
            return this.spineComponent;
          }
        }]);
        return PlayerController;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spineComponent", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spineNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "boxCollider", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10000;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "health", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10000;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "attackDamage", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "colliderSize", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return cc.size(80, 120);
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "colliderOffset", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return cc.v2(0, 0);
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "attackInterval", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "moveAnimationName", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "Move";
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "idleAnimationName", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "Idle";
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "attackAnimationName", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "hurtAnimationName", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "Hurt";
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "deathAnimationName", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "Death";
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "moveButton", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "autoEffNode", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "moveDistance", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "levelUpSpine", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "aoeRange", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 170;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "critRate", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.4;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "critMultiplier", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "enableMultiHit", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "multiHitCount", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "multiHitInterval", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "multiHitDamageReduction", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "healthBarNode", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "debugMode", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/popRewardWin.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Component, AudioManager;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "f950eowtLJDl5O1rb+0lQqb", "popRewardWin", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var popRewardWin = exports('popRewardWin', (_dec = ccclass('popRewardWin'), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(popRewardWin, _Component);
        function popRewardWin() {
          return _Component.apply(this, arguments) || this;
        }
        var _proto = popRewardWin.prototype;
        _proto.onLoad = function onLoad() {
          var _this = this;
          // 添加背景点击关闭（可选）
          var background = this.node.getChildByName('Layout');
          if (background && background.isValid) {
            background.on(cc.Node.EventType.TOUCH_END, function () {
              AudioManager.instance.playSound('voc_click', 0.8);
              _this.closeDetailPopup();
            }, this);
          }
          if (popRewardWin.instance === null) {
            popRewardWin.instance = this;
          } else {
            this.destroy();
            return;
          }
        };
        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {};
        _proto.initInfo = function initInfo(level) {
          if (level == 1) {
            this.node.getChildByName("good3").active = true;
            this.node.getChildByName("good4").active = false;
          } else {
            this.node.getChildByName("good3").active = false;
            this.node.getChildByName("good4").active = true;
          }
        }

        // 关闭详情弹窗
        ;

        _proto.closeDetailPopup = function closeDetailPopup() {
          if (this.node && cc.isValid(this.node)) {
            this.node.active = false;
            console.log('弹窗已隐藏');
          }
        };
        return popRewardWin;
      }(Component), _class2.instance = null, _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ProgressTrigger.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "48814qNrYVFqI61+aI1maV8", "ProgressTrigger", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var ProgressTrigger = exports('ProgressTrigger', (_dec = ccclass('ProgressTrigger'), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(ProgressTrigger, _Component);
        function ProgressTrigger() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "triggerProgress", _descriptor, _assertThisInitialized(_this));
          _this.hasTriggered = false;
          return _this;
        }
        var _proto = ProgressTrigger.prototype;
        _proto.update = function update(deltaTime) {
          // if (!this.hasTriggered && GameManager.instance.totalProgress >= this.triggerProgress) {
          //     this.triggerEvent();
          //     this.hasTriggered = true;
          // }
        };
        _proto.triggerEvent = function triggerEvent() {
          console.log("Progress reached " + this.triggerProgress + ", triggering event!");

          // 让玩家重新开始跑步
          var player = find('canvas/Player').getComponent('PlayerController');
          if (player) {
            player.resumeRunning();
          }
        };
        return ProgressTrigger;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "triggerProgress", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10.0;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SafeAnimationHelper.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7590bAI8GFJ6LTlHOSGcNjO", "SafeAnimationHelper", undefined);
      // SafeAnimationHelper.ts - 安全的动画工具类
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var SafeAnimationHelper = exports('SafeAnimationHelper', /*#__PURE__*/function () {
        function SafeAnimationHelper() {}
        /**
         * 安全的移动节点到指定位置
         */
        SafeAnimationHelper.moveTo = function moveTo(node, targetPos, duration, callback) {
          if (!node || !node.isValid) {
            console.warn('节点无效，无法执行移动动画');
            if (callback) callback();
            return;
          }

          // 确保目标位置有效
          if (!targetPos) {
            console.warn('目标位置无效，无法执行移动动画');
            if (callback) callback();
            return;
          }

          // 尝试使用 cc.tween
          if (typeof cc.tween !== 'undefined') {
            cc.tween(node).to(duration, {
              position: targetPos
            }).call(function () {
              if (callback) callback();
            }).start();
          } else {
            // 如果没有 Tween 系统，直接设置位置
            console.warn('Tween 系统不可用，直接设置位置');
            node.position = targetPos;
            if (callback) callback();
          }
        }

        /**
         * 安全的缩放节点
         */;
        SafeAnimationHelper.scaleTo = function scaleTo(node, targetScale, duration, callback) {
          if (!node || !node.isValid) {
            console.warn('节点无效，无法执行缩放动画');
            if (callback) callback();
            return;
          }

          // 尝试使用 cc.tween
          if (typeof cc.tween !== 'undefined') {
            cc.tween(node).to(duration, {
              scale: new cc.Vec3(targetScale, targetScale, 1)
            }).call(function () {
              if (callback) callback();
            }).start();
          } else {
            // 如果没有 Tween 系统，直接设置缩放
            console.warn('Tween 系统不可用，直接设置缩放');
            node.scale = targetScale;
            if (callback) callback();
          }
        }

        /**
         * 安全的同时执行移动和缩放
         */;
        SafeAnimationHelper.moveAndScale = function moveAndScale(node, targetPos, targetScale, duration, callback) {
          if (!node || !node.isValid) {
            console.warn('节点无效，无法执行移动和缩放动画');
            if (callback) callback();
            return;
          }

          // 确保目标位置有效
          if (!targetPos) {
            console.warn('目标位置无效，无法执行移动和缩放动画');
            if (callback) callback();
            return;
          }

          // 尝试使用 cc.tween
          if (typeof cc.tween !== 'undefined') {
            cc.tween(node).to(duration, {
              position: targetPos,
              scale: new cc.Vec3(targetScale, targetScale, 1)
            }).call(function () {
              if (callback) callback();
            }).start();
          } else {
            // 如果没有 Tween 系统，直接设置位置和缩放
            console.warn('Tween 系统不可用，直接设置位置和缩放');
            node.position = targetPos;
            node.scale = targetScale;
            if (callback) callback();
          }
        }

        /**
         * 创建安全的颜色闪烁效果
         */;
        SafeAnimationHelper.createColorFlash = function createColorFlash(node, flashColor, duration, callback) {
          if (duration === void 0) {
            duration = 0.3;
          }
          if (!node || !node.isValid) {
            console.warn('节点无效，无法执行颜色闪烁动画');
            if (callback) callback();
            return;
          }

          // 确保节点有颜色
          if (!node.color) {
            node.color = cc.Color.WHITE;
          }

          // 安全的获取原始颜色
          var originalColor = node.color ? node.color.clone() : cc.Color.WHITE;

          // 尝试使用 cc.tween
          if (typeof cc.tween !== 'undefined') {
            cc.tween(node).to(duration / 2, {
              color: flashColor
            }).to(duration / 2, {
              color: originalColor
            }).call(function () {
              if (callback) callback();
            }).start();
          } else {
            // 如果没有 Tween 系统，直接设置最终颜色
            console.warn('Tween 系统不可用，直接设置最终颜色');
            node.color = originalColor;
            if (callback) callback();
          }
        }

        /**
         * 创建安全的缩放动画序列（按压效果）
         */;
        SafeAnimationHelper.createPressEffect = function createPressEffect(node, callback) {
          if (!node || !node.isValid) {
            console.warn('节点无效，无法执行按压效果动画');
            if (callback) callback();
            return;
          }

          // 尝试使用 cc.tween
          if (typeof cc.tween !== 'undefined') {
            cc.tween(node).to(0.1, {
              scale: new cc.Vec3(0.8, 0.8, 1)
            }).to(0.1, {
              scale: new cc.Vec3(1.1, 1.1, 1)
            }).to(0.1, {
              scale: new cc.Vec3(1.0, 1.0, 1)
            }).call(function () {
              if (callback) callback();
            }).start();
          } else {
            // 如果没有 Tween 系统，直接设置最终状态
            console.warn('Tween 系统不可用，直接设置最终状态');
            node.scale = 1.0;
            if (callback) callback();
          }
        };
        return SafeAnimationHelper;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SimpleParallaxTest.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, LabelComponent, Button, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      LabelComponent = module.LabelComponent;
      Button = module.Button;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "630db3xh/JBE5SGKzrCLZQn", "SimpleParallaxTest", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var SimpleParallaxTest = exports('SimpleParallaxTest', (_dec = ccclass('SimpleParallaxTest'), _dec2 = property([Node]), _dec3 = property(LabelComponent), _dec4 = property(Button), _dec5 = property(Button), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(SimpleParallaxTest, _Component);
        function SimpleParallaxTest() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          // 背景节点数组（按顺序：远景、中景、近景、地面）
          _initializerDefineProperty(_this, "backgroundLayers", _descriptor, _assertThisInitialized(_this));
          // 对应的滚动速度（建议：远景0.3，中景0.6，近景0.8，地面1.0）
          _initializerDefineProperty(_this, "layerSpeeds", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "globalScrollSpeed", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "infoLabel", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "toggleButton", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "resetButton", _descriptor6, _assertThisInitialized(_this));
          _this.isScrolling = true;
          _this.currentProgress = 0;
          _this.initialPositions = [];
          return _this;
        }
        var _proto = SimpleParallaxTest.prototype;
        _proto.onLoad = function onLoad() {
          console.log("简单视差背景测试开始");

          // 记录所有背景图层的初始位置
          for (var i = 0; i < this.backgroundLayers.length; i++) {
            if (this.backgroundLayers[i]) {
              this.initialPositions[i] = this.backgroundLayers[i].position.x;
              console.log("\u56FE\u5C42" + i + "\u521D\u59CB\u4F4D\u7F6E: " + this.initialPositions[i]);
            }
          }

          // 设置按钮事件
          if (this.toggleButton) ;
          if (this.resetButton) {
            this.resetButton.node.on('click', this.resetScrolling, this);
          }
        };
        _proto.start = function start() {
          this.schedule(this.updateUI, 0.1);
        };
        _proto.update = function update(deltaTime) {
          if (this.isScrolling) {
            this.currentProgress += deltaTime;
            this.updateAllLayers();
          }
        };
        _proto.getIsScrolling = function getIsScrolling() {
          return this.isScrolling;
        };
        _proto.setIsScrolling = function setIsScrolling(value) {
          this.isScrolling = value;
          // 这里可以添加一些设置后需要执行的逻辑，比如更新UI等
          console.log("设置滚动状态为:", this.isScrolling);
        };
        _proto.updateAllLayers = function updateAllLayers() {
          for (var i = 0; i < this.backgroundLayers.length; i++) {
            this.updateLayer(i);
          }
        };
        _proto.updateLayer = function updateLayer(layerIndex) {
          var layer = this.backgroundLayers[layerIndex];
          if (!layer) return;
          var speed = this.layerSpeeds[layerIndex] || 1.0;
          var initialX = this.initialPositions[layerIndex] || 0;
          var offsetX = this.currentProgress * this.globalScrollSpeed * speed;

          // 简单的循环滚动（假设所有背景纹理宽度为960）
          var newX = initialX - offsetX % 3000;
          var currentPos = layer.position;
          layer.setPosition(newX, currentPos.y, currentPos.z);
        };
        _proto.updateUI = function updateUI() {
          if (this.infoLabel) {
            var status = this.isScrolling ? "滚动中" : "已停止";
            var speedText = "";
            for (var i = 0; i < this.layerSpeeds.length; i++) {
              speedText += "\u56FE\u5C42" + i + ":" + this.layerSpeeds[i] + " ";
            }
            this.infoLabel.string = "\u8FDB\u5EA6: " + this.currentProgress.toFixed(1) + "\u79D2\n\u72B6\u6001: " + status + "\n" + speedText;
          }
        };
        _proto.toggleScrolling = function toggleScrolling() {
          //this.isScrolling = !this.isScrolling;
          this.setIsScrolling(!this.isScrolling);
          console.log("切换滚动状态:", this.isScrolling);
        };
        _proto.resetScrolling = function resetScrolling() {
          this.currentProgress = 0;
          console.log("重置滚动进度");

          // 重置所有图层位置
          for (var i = 0; i < this.backgroundLayers.length; i++) {
            this.resetLayer(i);
          }
        };
        _proto.resetLayer = function resetLayer(layerIndex) {
          var layer = this.backgroundLayers[layerIndex];
          if (!layer) return;
          var initialX = this.initialPositions[layerIndex] || 0;
          var currentPos = layer.position;
          layer.setPosition(initialX, currentPos.y, currentPos.z);
        };
        return SimpleParallaxTest;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "backgroundLayers", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "layerSpeeds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [0.3, 0.6, 0.8, 1.0];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "globalScrollSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50.0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "infoLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "toggleButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "resetButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SlotsMachine.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './popRewardWin.ts', './AudioManager.ts'], function (exports) {
  var _inheritsLoose, _applyDecoratedDescriptor, _initializerDefineProperty, _assertThisInitialized, cclegacy, popRewardWin, AudioManager;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      popRewardWin = module.popRewardWin;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "c533esLQf9Ov7XmbYE9URi/", "SlotsMachine", undefined);
      var _cc$_decorator = cc._decorator,
        ccclass = _cc$_decorator.ccclass,
        property = _cc$_decorator.property;
      var SlotsMachine = exports('default', (_dec = property([cc.Node]), _dec2 = property(cc.Button), _dec3 = property([cc.SpriteFrame]), _dec4 = property([cc.Float]), _dec5 = property(cc.Label), ccclass(_class = (_class2 = /*#__PURE__*/function (_cc$Component) {
        _inheritsLoose(SlotsMachine, _cc$Component);
        function SlotsMachine() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "reelParentNodes", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "btnAction", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "rewardSprites", _descriptor3, _assertThisInitialized(_this));
          // @property(cc.ParticleSystem)
          // winParticle: cc.ParticleSystem = null;
          _initializerDefineProperty(_this, "rollSpeed", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "reelSpeeds", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "btnLabel", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "iconHeight", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "visibleIcons", _descriptor8, _assertThisInitialized(_this));
          _this.reelContainers = [];
          _this.isRolling = [false, false, false];
          _this.finalResults = [-1, -1, -1];
          _this.isInitialized = false;
          _this.currentReelPositions = [0, 0, 0];
          _this.isStopping = [false, false, false];
          // 新增：标记正在停止的转子
          _this.isProcessingAction = false;
          // 防止重复点击
          _this.guanqiaNum = 1;
          return _this;
        }
        var _proto = SlotsMachine.prototype;
        //控制后面转盘具体奖励
        _proto.onLoad = function onLoad() {
          this.initializeGame();
        };
        _proto.start = function start() {
          var _this2 = this;
          this.scheduleOnce(function () {
            _this2.finalizeInitialization();
          }, 0.1);
        };
        _proto.initializeGame = function initializeGame() {
          if (!this.checkRequiredComponents()) {
            cc.error('游戏初始化失败：缺少必要组件');
            return;
          }
          this.setupReelStructure();
          this.createReelContainers();
          this.resetGameState();
          this.bindButtonEvents();
          cc.log('老虎机游戏初始化完成');
        };
        _proto.setupReelStructure = function setupReelStructure() {
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            var parentNode = this.reelParentNodes[i];
            var mask = parentNode.getComponent(cc.Mask);
            if (!mask) {
              mask = parentNode.addComponent(cc.Mask);
            }
            mask.type = cc.Mask.Type.RECT;
            mask.alphaThreshold = 0.1;
            parentNode.getComponent("cc.UITransform").setContentSize(cc.size(100, this.iconHeight));
            parentNode.setScale(1, 1);
            var containerParent = new cc.Node('ContainerParent');
            containerParent.parent = parentNode;
            containerParent.setPosition(0, 0);
            containerParent.setScale(1, 1);
            this.reelContainers[i] = containerParent;
          }
        };
        _proto.createReelContainers = function createReelContainers() {
          // 确保 rewardSprites 数组有效
          if (!this.rewardSprites || this.rewardSprites.length === 0) {
            cc.error('rewardSprites 数组为空或未定义');
            return;
          }
          for (var i = 0; i < this.reelContainers.length; i++) {
            var containerParent = this.reelContainers[i];
            if (!containerParent || !cc.isValid(containerParent)) {
              cc.error("\u5BB9\u5668\u7236\u8282\u70B9 " + i + " \u65E0\u6548");
              continue;
            }
            containerParent.removeAllChildren();
            containerParent.setScale(1, 1);
            var totalIcons = this.visibleIcons + 2;
            for (var j = 0; j < totalIcons; j++) {
              var iconNode = new cc.Node('Icon');
              var sprite = iconNode.addComponent(cc.Sprite);
              var spriteIndex = j % this.rewardSprites.length;
              if (this.rewardSprites[spriteIndex]) {
                sprite.spriteFrame = this.rewardSprites[spriteIndex];
              }
              iconNode.parent = containerParent;
              iconNode.y = (j - 1) * this.iconHeight;
              iconNode.getComponent("cc.UITransform").setContentSize(cc.size(80, 80));
              iconNode.setScale(1, 1);
              iconNode.getComponent("cc.UITransform").setAnchorPoint(0.5, 0.5);
            }
          }
        };
        _proto.checkRequiredComponents = function checkRequiredComponents() {
          if (!this.btnAction) {
            cc.error('操作按钮未绑定');
            return false;
          }

          // 检查 reelParentNodes 数组
          if (!this.reelParentNodes || this.reelParentNodes.length !== 3) {
            cc.error('需要 exactly 3 个转子父节点');
            return false;
          }
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            if (!this.reelParentNodes[i] || !cc.isValid(this.reelParentNodes[i])) {
              cc.error("\u8F6C\u5B50\u7236\u8282\u70B9 " + i + " \u672A\u7ED1\u5B9A\u6216\u65E0\u6548");
              return false;
            }
          }

          // 检查 rewardSprites 数组
          if (!this.rewardSprites || this.rewardSprites.length === 0) {
            cc.error('奖励图标数组为空或未定义');
            return false;
          }
          return true;
        };
        _proto.finalizeInitialization = function finalizeInitialization() {
          this.isInitialized = true;
          this.updateButtonState();
          cc.log('游戏准备就绪');
        };
        _proto.resetGameState = function resetGameState() {
          this.isRolling = [false, false, false];
          this.isStopping = [false, false, false];
          this.isProcessingAction = false;
          this.finalResults = [-1, -1, -1];
          this.currentReelPositions = [0, 0, 0];
          for (var i = 0; i < this.reelContainers.length; i++) {
            if (this.reelContainers[i] && cc.isValid(this.reelContainers[i])) {
              this.reelContainers[i].y = 0;
            }
          }
        };
        _proto.bindButtonEvents = function bindButtonEvents() {
          this.btnAction.node.off('click', this.onActionButtonClick, this);
          this.btnAction.node.on('click', this.onActionButtonClick, this);
          cc.log('按钮事件绑定完成');
        };
        _proto.onActionButtonClick = function onActionButtonClick() {
          // 防止重复点击
          if (this.isProcessingAction) {
            cc.log('操作正在进行中，请等待');
            return;
          }
          AudioManager.instance.playSound('voc_click', 0.8);
          if (!this.isInitialized) {
            cc.warn('游戏未初始化完成');
            return;
          }
          this.isProcessingAction = true;
          try {
            if (this.isRolling.some(function (rolling) {
              return rolling;
            })) {
              this.stopRolling();
            } else {
              this.startRolling();
            }
          } catch (error) {
            cc.error('按钮点击处理出错:', error);
            this.isProcessingAction = false;
          }
        };
        _proto.startRolling = function startRolling() {
          cc.log('开始滚动!');
          if (!this.finalResults) this.finalResults = [-1, -1, -1];
          if (!this.isRolling) this.isRolling = [false, false, false];
          if (!this.isStopping) this.isStopping = [false, false, false];
          if (!this.currentReelPositions) this.currentReelPositions = [0, 0, 0];
          this.finalResults = [-1, -1, -1];
          this.isStopping = [false, false, false];
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            this.isRolling[i] = true;
            this.currentReelPositions[i] = 0;
          }
          this.updateButtonState();
          this.isProcessingAction = false;
        };
        _proto.stopRolling = function stopRolling() {
          var _this3 = this;
          cc.log('停止滚动!');
          this.btnAction.interactable = false;
          this.generateRandomResults();
          this.scheduleOnce(function () {
            return _this3.stopSingleReel(0);
          }, 0.5);
          this.scheduleOnce(function () {
            return _this3.stopSingleReel(1);
          }, 1.0);
          this.scheduleOnce(function () {
            return _this3.stopSingleReel(2);
          }, 1.5);
          this.isProcessingAction = false;
        };
        _proto.generateRandomResults = function generateRandomResults() {
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            this.finalResults[i] = Math.floor(Math.random() * this.rewardSprites.length);
            //这边奖励直接写死
            var canvas = cc.find('Canvas');
            if (canvas) {
              var gameManager = canvas.getComponent('GameManager');
              if (gameManager && typeof gameManager.getCurrentLevel === 'function') {
                var currentLevel = gameManager.getCurrentLevel();
                if (currentLevel == 3) {
                  this.finalResults[i] = 4;
                  this.guanqiaNum = 3;
                } else {
                  this.guanqiaNum = 1;
                  this.finalResults[i] = 3;
                }
              }
            }
          }
          cc.log("\u751F\u6210\u7684\u7ED3\u679C: [" + this.finalResults.join(', ') + "]");
        };
        _proto.stopSingleReel = function stopSingleReel(index) {
          var _this4 = this;
          if (index < 0 || index >= this.reelParentNodes.length) {
            cc.error("\u65E0\u6548\u7684\u8F6C\u5B50\u7D22\u5F15: " + index);
            return;
          }
          this.isRolling[index] = false;
          this.isStopping[index] = true; // 标记为正在停止

          var targetPosition = -this.finalResults[index] * this.iconHeight;
          var container = this.reelContainers[index];

          // 先确保所有图标显示正确
          this.forceUpdateReelIcons(index);
          try {
            cc.tween(container).to(1.0, {
              y: targetPosition
            }, {
              easing: 'backOut',
              onUpdate: function onUpdate(target, ratio) {
                if (!target || !cc.isValid(target)) return;
                target.setScale(1, 1);
                _this4.updateReelIcons(index);
              }
            }).call(function () {
              if (!container || !cc.isValid(container)) return;
              cc.log("\u8F6C\u5B50 " + index + " \u505C\u6B62\uFF0C\u663E\u793A: " + _this4.finalResults[index]);
              _this4.fixReelDisplay(index);
              _this4.isStopping[index] = false;
              if (_this4.isAllReelsStopped()) {
                _this4.onAllReelsStopped();
              }
            }).start();
          } catch (error) {
            cc.error("\u8F6C\u5B50 " + index + " \u505C\u6B62\u52A8\u753B\u51FA\u9519:", error);
            this.isStopping[index] = false;
            this.fixReelDisplay(index);
            if (this.isAllReelsStopped()) {
              this.onAllReelsStopped();
            }
          }
        }

        // 强制更新转子图标显示（确保所有图标都正确显示）
        ;

        _proto.forceUpdateReelIcons = function forceUpdateReelIcons(reelIndex) {
          var container = this.reelContainers[reelIndex];
          if (!container) return;
          var children = container.children;
          var targetResult = this.finalResults[reelIndex];
          for (var i = 0; i < children.length; i++) {
            var iconNode = children[i];
            var sprite = iconNode.getComponent(cc.Sprite);
            if (sprite) {
              // 计算这个图标应该显示的图案索引
              var iconIndex = (targetResult + i - 1 + this.rewardSprites.length) % this.rewardSprites.length;
              sprite.spriteFrame = this.rewardSprites[iconIndex];
            }

            // 强制保持图标大小和缩放
            iconNode.getComponent("cc.UITransform").setContentSize(cc.size(80, 80));
            iconNode.setScale(1, 1);
          }
        };
        _proto.updateReelIcons = function updateReelIcons(reelIndex) {
          var container = this.reelContainers[reelIndex];
          if (!container) return;
          var children = container.children;
          var containerY = container.y;
          for (var i = 0; i < children.length; i++) {
            var iconNode = children[i];
            var worldY = iconNode.y + containerY;

            // 强制保持图标大小和缩放
            iconNode.getComponent("cc.UITransform").setContentSize(cc.size(80, 80));
            iconNode.setScale(1, 1);

            // 循环逻辑
            if (worldY > this.iconHeight * 1.5) {
              iconNode.y -= children.length * this.iconHeight;

              // 只有在滚动状态才更新图标内容
              if (this.isRolling[reelIndex]) {
                var sprite = iconNode.getComponent(cc.Sprite);
                if (sprite) {
                  var randomIndex = Math.floor(Math.random() * this.rewardSprites.length);
                  sprite.spriteFrame = this.rewardSprites[randomIndex];
                }
              }
            } else if (worldY < -this.iconHeight * 1.5) {
              iconNode.y += children.length * this.iconHeight;

              // 只有在滚动状态才更新图标内容
              if (this.isRolling[reelIndex]) {
                var _sprite = iconNode.getComponent(cc.Sprite);
                if (_sprite) {
                  var _randomIndex = Math.floor(Math.random() * this.rewardSprites.length);
                  _sprite.spriteFrame = this.rewardSprites[_randomIndex];
                }
              }
            }

            // 如果是停止状态，确保显示正确的图标
            if (this.isStopping[reelIndex] || !this.isRolling[reelIndex]) {
              var _sprite2 = iconNode.getComponent(cc.Sprite);
              if (_sprite2) {
                var targetResult = this.finalResults[reelIndex];
                var iconIndex = (targetResult + i - 1 + this.rewardSprites.length) % this.rewardSprites.length;
                _sprite2.spriteFrame = this.rewardSprites[1]; //这里奖励写死
              }
            }
          }
        };

        _proto.fixReelDisplay = function fixReelDisplay(reelIndex) {
          var container = this.reelContainers[reelIndex];
          if (!container) return;
          var targetResult = this.finalResults[reelIndex];

          // 精确设置容器位置
          container.y = -targetResult * this.iconHeight;

          // 强制更新所有图标显示
          this.forceUpdateReelIcons(reelIndex);
          cc.log("\u8F6C\u5B50 " + reelIndex + " \u4FEE\u590D\u5B8C\u6210\uFF0C\u4F4D\u7F6E: " + container.y + ", \u7ED3\u679C: " + targetResult);
        };
        _proto.isAllReelsStopped = function isAllReelsStopped() {
          return this.isRolling.every(function (rolling) {
            return !rolling;
          }) && this.isStopping.every(function (stopping) {
            return !stopping;
          });
        };
        _proto.onAllReelsStopped = function onAllReelsStopped() {
          cc.log('所有转子已停止!');

          // 最终检查所有转子显示
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            this.fixReelDisplay(i);
          }
          this.checkReward();
          this.updateButtonState();
          this.showResult();
        };
        _proto.updateButtonState = function updateButtonState() {
          var isAnyRolling = this.isRolling.some(function (rolling) {
            return rolling;
          });
          this.btnAction.interactable = true;
          if (this.btnLabel) ;
          cc.log("\u6309\u94AE\u72B6\u6001\u66F4\u65B0: " + (isAnyRolling ? "停止" : "开始"));
        };
        _proto.update = function update(dt) {
          if (!this.isInitialized) return;
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            if (this.isRolling[i] && !this.isStopping[i]) {
              var speed = this.reelSpeeds[i] || this.rollSpeed;
              var container = this.reelContainers[i];
              container.y -= speed * dt;
              container.setScale(1, 1);
              this.updateReelIcons(i);
              this.currentReelPositions[i] = container.y;
            }
          }
        };
        _proto.checkReward = function checkReward() {
          var _this5 = this;
          this.scheduleOnce(function () {
            var _this5$finalResults = _this5.finalResults,
              a = _this5$finalResults[0],
              b = _this5$finalResults[1],
              c = _this5$finalResults[2];
            AudioManager.instance.playSound('voc_reward_get');
            if (a === b && b === c) {
              cc.log('🎉 大奖! 三个图案相同!');
              _this5.onBigWin();
            } else if (a === b || a === c || b === c) {
              cc.log('🎊 小奖! 两个图案相同!');
              _this5.onSmallWin();
            } else {
              cc.log('😢 未中奖');
              _this5.onNoWin();
            }
          }, 0.5);
        };
        _proto.showResult = function showResult() {
          var _this6 = this;
          var resultString = this.finalResults.map(function (idx) {
            return _this6.rewardSprites[idx] ? _this6.rewardSprites[idx].name : '未知';
          }).join(' - ');
          cc.log("\u6700\u7EC8\u7ED3\u679C: " + resultString);
        };
        _proto.onBigWin = function onBigWin() {
          // if (this.winParticle) {
          //     this.winParticle.resetSystem();
          // }

          this.node.active = false;
          this.node.parent.getChildByName("popRewardWin").active = true;
          if (popRewardWin.instance) {
            popRewardWin.instance.initInfo(this.guanqiaNum);
          }

          // 触发老虎机完成事件
          this.node.emit('slot-machine-completed');

          // this.playFoldAnimation(0.5,function (){
          //
          // })
        };

        _proto.onSmallWin = function onSmallWin() {
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            if (!this.reelParentNodes[i] || !cc.isValid(this.reelParentNodes[i])) continue;
            var originalColor = this.reelParentNodes[i].color;

            // cc.tween(this.reelParentNodes[i])
            //     .to(0.1, { color: cc.Color.GREEN })
            //     .to(0.1, { color: originalColor })
            //     .start();
          }
        };

        _proto.onNoWin = function onNoWin() {
          // 未中奖逻辑
        };
        _proto.showGetRewardsWin = function showGetRewardsWin() {
          console.log("恭喜获得");
        }

        /**
         * 折叠隐藏动画
         */;
        _proto.playFoldAnimation = function playFoldAnimation(duration, onComplete) {
          var _this7 = this;
          // 转子向中心折叠
          for (var i = 0; i < this.reelParentNodes.length; i++) {
            var reel = this.reelParentNodes[i];
            if (reel && cc.isValid(reel)) {
              var targetX = this.node.width / 2; // 中心点
              cc.tween(reel).parallel(cc.tween().to(duration, {
                x: targetX
              }, {
                easing: 'sineIn'
              }), cc.tween().to(duration, {
                scaleX: 0
              }, {
                easing: 'sineIn'
              }), cc.tween().to(duration, {
                opacity: 0
              }, {
                easing: 'sineIn'
              })).start();
            }
          }

          // 按钮消失
          if (this.btnAction && this.btnAction.node) {
            cc.tween(this.btnAction.node).to(duration * 0.5, {
              opacity: 0
            }).start();
          }
          this.scheduleOnce(function () {
            _this7.isHidden = true;
            _this7.node.active = false;

            // 恢复状态
            for (var _i = 0; _i < _this7.reelParentNodes.length; _i++) {
              var _reel = _this7.reelParentNodes[_i];
              if (_reel && cc.isValid(_reel)) {
                _reel.scaleX = 1;
                _reel.opacity = 255;
              }
            }
            if (_this7.btnAction && _this7.btnAction.node) {
              _this7.btnAction.node.opacity = 255;
            }
            if (onComplete) onComplete();
          }, duration);
        };
        _proto.onDestroy = function onDestroy() {
          if (this.btnAction && this.btnAction.node) {
            this.btnAction.node.off('click', this.onActionButtonClick, this);
          }
        };
        return SlotsMachine;
      }(cc.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "reelParentNodes", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnAction", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rewardSprites", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rollSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 800;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "reelSpeeds", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [800, 820, 780];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "btnLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "iconHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "visibleIcons", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SpriteAnimation.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, SpriteFrame, Sprite, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "38976U0yvxLY7TOohNRyz3x", "SpriteAnimation", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var SpriteAnimation = exports('SpriteAnimation', (_dec = ccclass('SpriteAnimation'), _dec2 = property([SpriteFrame]), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(SpriteAnimation, _Component);
        function SpriteAnimation() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "frames", _descriptor, _assertThisInitialized(_this));
          // 序列帧数组
          _initializerDefineProperty(_this, "frameRate", _descriptor2, _assertThisInitialized(_this));
          // 帧率，每秒播放的帧数
          _this.currentFrame = 0;
          _this.accumulator = 0;
          return _this;
        }
        var _proto = SpriteAnimation.prototype;
        _proto.start = function start() {
          // 如果没有设置Sprite组件，则获取当前节点的Sprite组件
          if (!this.frames || this.frames.length === 0) {
            console.error('Frames are not set!');
            return;
          }
        };
        _proto.update = function update(deltaTime) {
          // 累加时间
          this.accumulator += deltaTime;
          // 计算当前应该显示哪一帧
          var frameTime = 1 / this.frameRate;
          while (this.accumulator >= frameTime) {
            this.accumulator -= frameTime;
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
          }
          // 更新SpriteFrame
          var sprite = this.node.getComponent(Sprite);
          if (sprite) {
            sprite.spriteFrame = this.frames[this.currentFrame];
          }
        };
        return SpriteAnimation;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "frames", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "frameRate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/startLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Button, Component, AudioManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Button = module.Button;
      Component = module.Component;
    }, function (module) {
      AudioManager = module.AudioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3;
      cclegacy._RF.push({}, "ccfbdt1ZrFEOLkvliWcdTis", "startLayer", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var startLayer = exports('startLayer', (_dec = ccclass('startLayer'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(startLayer, _Component);
        function startLayer() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "nextButton", _descriptor, _assertThisInitialized(_this));
          // 下一步按钮
          _initializerDefineProperty(_this, "character1Btn", _descriptor2, _assertThisInitialized(_this));
          // 角色1按钮
          _initializerDefineProperty(_this, "character2Btn", _descriptor3, _assertThisInitialized(_this));
          // 角色2按钮
          _initializerDefineProperty(_this, "nextLayer", _descriptor4, _assertThisInitialized(_this));
          // 下一个界面的节点
          _this.selectedCharacter = 0;
          return _this;
        }
        var _proto = startLayer.prototype;
        _proto.start = function start() {
          this.initButtons();
          this.hideNextLayer(); // 确保下一个界面初始时隐藏
        };

        _proto.initButtons = function initButtons() {
          // 角色1按钮点击事件
          var char1Btn = this.character1Btn.getComponent(Button);
          if (char1Btn) {
            char1Btn.node.on(Button.EventType.CLICK, this.onCharacter1Selected, this);
          }

          // 角色2按钮点击事件
          var char2Btn = this.character2Btn.getComponent(Button);
          if (char2Btn) {
            char2Btn.node.on(Button.EventType.CLICK, this.onCharacter2Selected, this);
          }

          // 下一步按钮点击事件
          var nextBtn = this.nextButton.getComponent(Button);
          if (nextBtn) {
            nextBtn.node.on(Button.EventType.CLICK, this.onNextButtonClick, this);
            // 初始时禁用下一步按钮，直到选择了角色
            nextBtn.interactable = false;
          }
        };
        _proto.onCharacter1Selected = function onCharacter1Selected() {
          var audioManager = AudioManager.instance;
          audioManager.playSound('voc_click', 0.8);
          this.selectedCharacter = 1;
          this.updateButtonStates();
          this.enableNextButton();
          console.log("选择了角色1");
          this.node.getChildByName('Node1').active = true;
          this.node.getChildByName('Node2').active = false;
        };
        _proto.onCharacter2Selected = function onCharacter2Selected() {
          var audioManager = AudioManager.instance;
          audioManager.playSound('voc_click', 0.8);
          this.selectedCharacter = 2;
          this.updateButtonStates();
          this.enableNextButton();
          console.log("选择了角色2");
          this.node.getChildByName('Node1').active = false;
          this.node.getChildByName('Node2').active = true;
        };
        _proto.updateButtonStates = function updateButtonStates() {
          // 更新按钮状态，可以在这里添加选中效果
          var char1Btn = this.character1Btn.getComponent(Button);
          var char2Btn = this.character2Btn.getComponent(Button);
        };
        _proto.enableNextButton = function enableNextButton() {
          var nextBtn = this.nextButton.getComponent(Button);
          if (nextBtn) {
            nextBtn.interactable = true;
          }
        };
        _proto.onNextButtonClick = function onNextButtonClick() {
          if (this.selectedCharacter === 0) {
            console.warn("请先选择一个角色");
            return;
          }
          AudioManager.instance.playSound('voc_click', 0.8);
          AudioManager.instance.stopMusic();
          AudioManager.instance.playMusic("bgm1");

          // 发出选择完成事件，携带选中的角色信息
          this.node.emit(startLayer.EVENT_CHARACTER_SELECTED, this.selectedCharacter);

          // 隐藏当前界面
          this.node.active = false;

          // 显示下一个界面
          if (this.nextLayer) {
            this.nextLayer.active = true;
          }
          console.log("\u8FDB\u5165\u4E0B\u4E00\u4E2A\u754C\u9762\uFF0C\u5DF2\u9009\u62E9\u89D2\u8272: " + this.selectedCharacter);
        };
        _proto.hideNextLayer = function hideNextLayer() {
          if (this.nextLayer) {
            this.nextLayer.active = false;
          }
        }

        // 公共方法：获取选中的角色
        ;

        _proto.getSelectedCharacter = function getSelectedCharacter() {
          return this.selectedCharacter;
        }

        // 公共方法：重置选择（如果需要重复使用）
        ;

        _proto.resetSelection = function resetSelection() {
          this.selectedCharacter = 0;
          var nextBtn = this.nextButton.getComponent(Button);
          if (nextBtn) {
            nextBtn.interactable = false;
          }
          this.updateButtonStates();
        }

        // 公共方法：显示当前界面
        ;

        _proto.showLayer = function showLayer() {
          this.node.active = true;
          this.resetSelection();
        };
        _proto.update = function update(deltaTime) {
          // 可以在这里添加更新逻辑
        };
        return startLayer;
      }(Component), _class3.EVENT_CHARACTER_SELECTED = 'character-selected', _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nextButton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "character1Btn", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "character2Btn", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "nextLayer", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UnitSpawnedRouter.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "4036elyMVlGiY8ozDOerJgV", "UnitSpawnedRouter", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 给生成的单位打一个“来源”标签，便于单位在自己死亡时回收：
       * const spawner = this.getComponent(SpawnedTag)?.spawner;
       * spawner?.release(this.node);
       */
      var UnitSpawnedRouter = exports('UnitSpawnedRouter', (_dec = ccclass('UnitSpawnedRouter'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(UnitSpawnedRouter, _Component);
        function UnitSpawnedRouter() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.spawner = null;
          return _this;
        }
        return UnitSpawnedRouter;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UnitSpawner.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UnitSpawnedRouter.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Prefab, Node, Enum, KeyCode, NodePool, instantiate, input, Input, Vec3, Component, UnitSpawnedRouter;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      Node = module.Node;
      Enum = module.Enum;
      KeyCode = module.KeyCode;
      NodePool = module.NodePool;
      instantiate = module.instantiate;
      input = module.input;
      Input = module.Input;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      UnitSpawnedRouter = module.UnitSpawnedRouter;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;
      cclegacy._RF.push({}, "bdf06hQOr1KcZcoUh/kemf3", "UnitSpawner", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * UnitSpawner
       * - 自动按速率刷怪（单位/秒），也可手动按键刷怪
       * - 支持多个出生点（随机或顺序），可设置随机半径抖动
       * - 可选择对象池复用，限制最大在场数量
       * - 提供 release() 主动回收接口，供怪物死亡时调用
       *
       * 使用：
       * 1) 将本脚本挂到一个空节点（建议命名 Spawner）
       * 2) 在 Inspector：
       *    - Unit Prefab：拖入要刷的怪物预制体
       *    - Parent：留空则默认挂到本节点；也可指定容器节点
       *    - Spawn Points：可选的多个出生点节点（不填则以本节点为基准）
       *    - Auto Spawn / Spawn Rate / Initial Delay / Random Radius 等按需设置
       * 3) 运行时按下 Manual Key（默认空格）即可手动刷一只
       * 4) 怪物死亡时：在怪物脚本中调用 spawner.release(this.node) 回收
       */

      var UnitSpawner = exports('UnitSpawner', (_dec = ccclass('UnitSpawner'), _dec2 = property({
        type: Prefab,
        tooltip: '要刷新的单位（怪物）预制体'
      }), _dec3 = property({
        type: Node,
        tooltip: '生成后放入的父节点；为空则使用 Spawner 自身'
      }), _dec4 = property({
        type: [Node],
        tooltip: '可选：多个出生点。如果不填，则以 Spawner 自身为出生点'
      }), _dec5 = property({
        tooltip: '是否自动按速率刷怪'
      }), _dec6 = property({
        tooltip: '每秒生成多少个（单位/秒）。可为小数，例如 0.5 = 2 秒一个'
      }), _dec7 = property({
        tooltip: '自动刷怪前的延迟（秒）'
      }), _dec8 = property({
        tooltip: '同屏最大存活数量。0 表示不限制'
      }), _dec9 = property({
        tooltip: '在出生点周围随机半径（米/像素，根据你的坐标系）'
      }), _dec10 = property({
        tooltip: '多个出生点时是否随机选择；否则顺序轮询'
      }), _dec11 = property({
        type: Enum(KeyCode),
        tooltip: '手动刷怪热键'
      }), _dec12 = property({
        tooltip: '是否启用对象池（推荐）'
      }), _dec13 = property({
        tooltip: '对象池预热数量（仅 usePooling=true 生效）'
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(UnitSpawner, _Component);
        function UnitSpawner() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "unitPrefab", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "parent", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spawnPoints", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "autoSpawn", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spawnRate", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "initialDelay", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "maxAlive", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "randomRadius", _descriptor8, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "randomizePoints", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "manualKey", _descriptor10, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "usePooling", _descriptor11, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "poolWarmCount", _descriptor12, _assertThisInitialized(_this));
          // —— 运行时状态 ——
          _this._pool = null;
          _this._accum = 0;
          // 计时器（用于按速率生成）
          _this._delayLeft = 0;
          // 初始延迟计时
          _this._pointIndex = 0;
          // 顺序轮询索引
          _this._alive = new Set();
          return _this;
        }
        var _proto = UnitSpawner.prototype;
        _proto.onLoad = function onLoad() {
          if (!this.parent) this.parent = this.node;
          this._delayLeft = Math.max(0, this.initialDelay);
          if (this.usePooling) {
            this._pool = new NodePool();
            if (this.unitPrefab && this.poolWarmCount > 0) {
              for (var i = 0; i < this.poolWarmCount; i++) {
                var n = instantiate(this.unitPrefab);
                n.active = false;
                this._pool.put(n);
              }
            }
          }
        };
        _proto.onEnable = function onEnable() {
          input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        };
        _proto.onDisable = function onDisable() {
          input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        };
        _proto.update = function update(dt) {
          if (!this.autoSpawn) return;
          if (this._delayLeft > 0) {
            this._delayLeft -= dt;
            return;
          }

          // 以累加器实现任意速率（包括小于 1 的速率）
          this._accum += dt;
          var interval = this.interval;
          while (this._accum >= interval) {
            this._accum -= interval;
            this.spawnOne();
            // 若达上限则不再继续本帧生成
            if (this.maxAlive > 0 && this._alive.size >= this.maxAlive) break;
          }
        }

        /** 外部可调用：开始/停止自动刷 */;
        _proto.startAuto = function startAuto(delay) {
          if (delay === void 0) {
            delay = 0;
          }
          this.autoSpawn = true;
          this._delayLeft = delay;
        };
        _proto.stopAuto = function stopAuto() {
          this.autoSpawn = false;
          this._accum = 0;
        }

        /** 外部可调用：修改速率（单位/秒） */;
        _proto.setRate = function setRate(r) {
          this.spawnRate = Math.max(0, r);
        }

        /** 外部可调用：手动刷 N 个 */;
        _proto.spawn = function spawn(count) {
          if (count === void 0) {
            count = 1;
          }
          for (var i = 0; i < count; i++) this.spawnOne();
        }

        /** 手动释放（怪物死亡时调用）。开启对象池时放回池，否则 destroy */;
        _proto.release = function release(node) {
          if (!node || !node.isValid) return;
          this._alive["delete"](node);
          if (this._pool && this.usePooling) {
            node.removeFromParent();
            node.active = false;
            this._pool.put(node);
          } else {
            node.destroy();
          }
        }

        /** 核心：生成 1 个单位 */;
        _proto.spawnOne = function spawnOne() {
          if (!this.unitPrefab) return null;
          if (this.maxAlive > 0 && this._alive.size >= this.maxAlive) return null;

          // 从池里取或新建
          var node;
          if (this._pool && this.usePooling && this._pool.size() > 0) {
            node = this._pool.get();
          } else {
            node = instantiate(this.unitPrefab);
          }

          // 安放到父节点
          var parent = this.parent || this.node;
          parent.addChild(node);
          node.active = true;

          // 计算生成位置（世界坐标）
          var worldPos = this._calcSpawnWorldPos();
          node.setWorldPosition(worldPos);

          // 记录存活
          this._alive.add(node);

          // 打上标签，便于单位自己找到 spawner（可选）
          var tag = node.getComponent(UnitSpawnedRouter) || node.addComponent(UnitSpawnedRouter);
          tag.spawner = this;
          return node;
        };
        _proto._onKeyDown = function _onKeyDown(e) {
          if (e.keyCode === this.manualKey) this.spawnOne();
        }

        /** 计算一个出生点的世界坐标（带随机半径抖动） */;
        _proto._calcSpawnWorldPos = function _calcSpawnWorldPos() {
          var base = new Vec3();
          if (this.spawnPoints && this.spawnPoints.length > 0) {
            // 选择一个出生点
            var idx = 0;
            if (this.randomizePoints) {
              idx = Math.floor(Math.random() * this.spawnPoints.length);
            } else {
              idx = this._pointIndex % this.spawnPoints.length;
              this._pointIndex++;
            }
            var p = this.spawnPoints[idx];
            p.getWorldPosition(base);
          } else {
            this.node.getWorldPosition(base);
          }
          if (this.randomRadius > 0) {
            // 在圆盘内取随机点（均匀分布）
            var r = this.randomRadius * Math.sqrt(Math.random());
            var theta = Math.random() * Math.PI * 2;
            base.x += r * Math.cos(theta);
            base.y += r * Math.sin(theta);
          }
          return base;
        };
        _createClass(UnitSpawner, [{
          key: "interval",
          get: /** 当前自动刷怪的时间间隔（秒） */
          function get() {
            if (this.spawnRate <= 0) return Number.POSITIVE_INFINITY;
            return 1 / this.spawnRate;
          }
        }]);
        return UnitSpawner;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "parent", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spawnPoints", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "autoSpawn", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "spawnRate", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "initialDelay", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maxAlive", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "randomRadius", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "randomizePoints", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "manualKey", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return KeyCode.SPACE;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "usePooling", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "poolWarmCount", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});