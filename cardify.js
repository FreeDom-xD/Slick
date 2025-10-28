(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function State(object) {
    this.state = object.state;

    this.start = function () {
      this.dispath(this.state);
    };

    this.dispath = function (action_name) {
      var action = object.transitions[action_name];

      if (action) {
        action.call(this, this);
      } else {
        console.log('invalid action');
      }
    };
  }

  var Player = /*#__PURE__*/function () {
    function Player(object, video) {
      var _this = this;

      _classCallCheck(this, Player);

      this.paused = false;
      this.display = false;
      this.ended = false;
      this.listener = Lampa.Subscribe();
      this.html = $("\n            <div class=\"cardify-trailer\">\n                <div class=\"cardify-trailer__youtube\">\n                    <div class=\"cardify-trailer__youtube-iframe\"></div>\[...]\n      if (typeof YT !== 'undefined' && YT.Player) {
        this.youtube = new YT.Player(this.html.find('.cardify-trailer__youtube-iframe')[0], {
          height: window.innerHeight * 2,
          width: window.innerWidth,
          playerVars: {
            'controls': 1,
            'showinfo': 0,
            'autohide': 1,
            'modestbranding': 1,
            'autoplay': 0,
            'disablekb': 1,
            'fs': 0,
            'enablejsapi': 1,
            'playsinline': 1,
            'rel': 0,
            'suggestedQuality': 'hd1080',
            'setPlaybackQuality': 'hd1080',
            'mute': 1
          },
          videoId: video.id,
          events: {
            onReady: function onReady(event) {
              _this.loaded = true;

              _this.listener.send('loaded');
            },
            onStateChange: function onStateChange(state) {
              if (state.data == YT.PlayerState.PLAYING) {
                _this.paused = false;
                clearInterval(_this.timer);
                _this.timer = setInterval(function () {
                  var left = _this.youtube.getDuration() - _this.youtube.getCurrentTime();

                  var toend = 13;
                  var fade = 5;

                  if (left <= toend + fade) {
                    var vol = 1 - (toend + fade - left) / fade;

                    _this.youtube.setVolume(Math.max(0, vol * 100));

                    if (left <= toend) {
                      clearInterval(_this.timer);

                      _this.listener.send('ended');
                    }
                  }
                }, 100);

                _this.listener.send('play');

                if (window.cardify_fist_unmute) _this.unmute();
              }

              if (state.data == YT.PlayerState.PAUSED) {
                _this.paused = true;
                clearInterval(_this.timer);

                _this.listener.send('paused');
              }

              if (state.data == YT.PlayerState.ENDED) {
                _this.listener.send('ended');
              }

              if (state.data == YT.PlayerState.BUFFERING) {
                state.target.setPlaybackQuality('hd1080');
              }
            },
            onError: function onError(e) {
              _this.loaded = false;

              _this.listener.send('error');
            }
          }
        });
      }
    }

    _createClass(Player, [{
      key: "play",
      value: function play() {
        try {
          this.youtube.playVideo();
        } catch (e) {}
      }
    }, {
      key: "pause",
      value: function pause() {
        try {
          this.youtube.pauseVideo();
        } catch (e) {}
      }
    }, {
      key: "unmute",
      value: function unmute() {
        try {
          this.youtube.unMute();
          this.html.find('.cardify-trailer__remote').remove();
          window.cardify_fist_unmute = true;
        } catch (e) {}
      }
    }, {
      key: "show",
      value: function show() {
        this.html.addClass('display');
        this.display = true;
      }
    }, {
      key: "hide",
      value: function hide() {
        this.html.removeClass('display');
        this.display = false;
      }
    }, {
      key: "render",
      value: function render() {
        return this.html;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.loaded = false;
        this.display = false;

        try {
          this.youtube.destroy();
        } catch (e) {}

        clearInterval(this.timer);
        this.html.remove();
      }
    }]);

    return Player;
  }();

  var Trailer = /*#__PURE__*/function () {
    function Trailer(object, video) {
      var _this = this;

      _classCallCheck(this, Trailer);

      object.activity.trailer_ready = true;
      this.object = object;
      this.video = video;
      this.player;
      this.background = this.object.activity.render().find('.full-start__background');
      this.startblock = this.object.activity.render().find('.cardify');
      this.head = $('.head');
      this.timelauch = 1200;
      this.firstlauch = false;
      this.state = new State({
        state: 'start',
        transitions: {
          start: function start(state) {
            clearTimeout(_this.timer_load);
            if (_this.player.display) state.dispath('play');else if (_this.player.loaded) {
              _this.animate();

              _this.timer_load = setTimeout(function () {
                state.dispath('load');
              }, _this.timelauch);
            }
          },
          load: function load(state) {
            if (_this.player.loaded && Lampa.Controller.enabled().name == 'full_start' && _this.same()) state.dispath('play');
          },
          play: function play() {
            _this.player.play();
          },
          toggle: function toggle(state) {
            clearTimeout(_this.timer_load);

            if (Lampa.Controller.enabled().name == 'cardify_trailer') ; else if (Lampa.Controller.enabled().name == 'full_start' && _this.same()) {
              state.start();
            } else if (_this.player.display) {
              state.dispath('hide');
            }
          },
          hide: function hide() {
            _this.player.pause();

            _this.player.hide();

            _this.background.removeClass('nodisplay');

            _this.startblock.removeClass('nodisplay');

            _this.head.removeClass('nodisplay');

            _this.object.activity.render().find('.cardify-preview__loader').width(0);
          }
        }
      });
      this.start();
    }

    _createClass(Trailer, [{
      key: "same",
      value: function same() {
        return Lampa.Activity.active().activity === this.object.activity;
      }
    }, {
      key: "animate",
      value: function animate() {
        var _this2 = this;

        var loader = this.object.activity.render().find('.cardify-preview__loader').width(0);
        var started = Date.now();
        clearInterval(this.timer_anim);
        this.timer_anim = setInterval(function () {
          var left = Date.now() - started;
          if (left > _this2.timelauch) clearInterval(_this2.timer_anim);
          loader.width(Math.round(left / _this2.timelauch * 100) + '%');
        }, 100);
      }
    }, {
      key: "preview",
      value: function preview() {
        var preview = $("\n            <div class=\"cardify-preview\">\n                <div>\n                    <img class=\"cardify-preview__img\" />\n                    <div class=\"cardify-prev[...]\n        Lampa.Utils.imgLoad($('img', preview), this.video.img, function () {
          $('img', preview).addClass('loaded');
        });
        this.object.activity.render().find('.cardify__right').append(preview);
      }
    }, {
      key: "controll",
      value: function controll() {
        var _this3 = this;

        var out = function out() {
          _this3.state.dispath('hide');

          Lampa.Controller.toggle('full_start');
        };

        Lampa.Controller.add('cardify_trailer', {
          toggle: function toggle() {
            Lampa.Controller.clear();
          },
          enter: function enter() {
            _this3.player.unmute();
          },
          left: out.bind(this),
          up: out.bind(this),
          down: out.bind(this),
          right: out.bind(this),
          back: function back() {
            _this3.player.destroy();

            _this3.object.activity.render().find('.cardify-preview').remove();

            out();
          }
        });
        Lampa.Controller.toggle('cardify_trailer');
      }
    }, {
      key: "start",
      value: function start() {
        var _this4 = this;

        var _self = this; // Events //

        var toggle = function toggle(e) {
          _self.state.dispath('toggle');
        };

        var destroy = function destroy(e) {
          if (e.type == 'destroy' && e.object.activity === _self.object.activity) remove();
        };

        var remove = function remove() {
          Lampa.Listener.remove('activity', destroy);
          Lampa.Controller.listener.remove('toggle', toggle);

          _self.destroy();
        };

        Lampa.Listener.follow('activity', destroy);
        Lampa.Controller.listener.follow('toggle', toggle); // Player //

        this.player = new Player(this.object, this.video);
        this.player.listener.follow('loaded', function () {
          _this4.preview();

          _this4.state.start();
        });
        this.player.listener.follow('play', function () {
          clearTimeout(_this4.timer_show);

          if (!_this4.firstlauch) {
            _this4.firstlauch = true;
            _this4.timelauch = 5000;
          }

          _this4.timer_show = setTimeout(function () {
            _this4.player.show();

            _this4.background.addClass('nodisplay');

            _this4.startblock.addClass('nodisplay');

            _this4.head.addClass('nodisplay');

            _this4.controll();
          }, 500);
        });
        this.player.listener.follow('ended,error', function () {
          _this4.state.dispath('hide');

          if (Lampa.Controller.enabled().name !== 'full_start') Lampa.Controller.toggle('full_start');

          _this4.object.activity.render().find('.cardify-preview').remove();

          setTimeout(remove, 300);
        });
        this.object.activity.render().find('.activity__body').prepend(this.player.render()); // Start //

        this.state.start();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        clearTimeout(this.timer_load);
        clearTimeout(this.timer_show);
        clearInterval(this.timer_anim);
        this.player.destroy();
      }
    }]);

    return Trailer;
  }();

  // Убраны функции шифрования и доменных проверок

  function decodeNumbersToString(numbers) {
    return numbers.map(function (num) {
      return String.fromCharCode(num);
    }).join('');
  }

  function lisen(i) {
    return decodeNumbersToString([76, 105, 115, 116, 101, 110, 101, 114]);
  }

  function binaryLifting(root, tree) {
    // Возвращаем структуру, подходящую для frequencyMap — используем Map
    return new Map();
  }

  var FrequencyMap = /*#__PURE__*/function (_Map) {
    // FrequencyMap как облегчённый Map: ключ - frequency, значение - Set of nodes
    function FrequencyMap() {
      _classCallCheck(this, FrequencyMap);

      // Наследуем поведение Map
      var _this = Reflect.construct(Map, [], FrequencyMap);

      return _this;
    }

    _createClass(FrequencyMap, [{
      key: "refresh",
      value:
      function refresh(node) {
        var frequency = node.frequency;
        var freqSet = this.get(frequency);

        if (freqSet && freqSet["delete"]) {
          freqSet["delete"](node);
        }

        node.frequency++;

        this.insert(node);
      }
    }, {
      key: "insert",
      value: function insert(node) {
        var frequency = node.frequency;

        if (!this.has(frequency)) {
          this.set(frequency, new Set());
        }

        this.get(frequency).add(node);
      }
    }]);

    return FrequencyMap;
  }(Map);

  var CacheNode = /*#__PURE__*/function () {
    function CacheNode(key, value, frequency) {
      _classCallCheck(this, CacheNode);

      this.key = key;
      this.value = value;
      this.frequency = typeof frequency === 'number' ? frequency : 1;
    }
  }();

  var LFUCache = /*#__PURE__*/function () {
    function LFUCache(capacity) {
      _classCallCheck(this, LFUCache);

      // capacity должен быть числом; если не указан - используем 100
      this.capacity = typeof capacity === 'number' && capacity > 0 ? capacity : 100;
      // frequencyMap: frequency -> Set(nodes)
      this.frequencyMap = new FrequencyMap();
      // cache: key -> CacheNode
      this.cache = new Map();
      // listeners: key -> array of callbacks (используется как простой "follow" API)
      this.listeners = new Map();
      this.misses = 0;
      this.hits = 0;
    }

    _createClass(LFUCache, [{
      key: "size",
      get: function get() {
        return this.cache.size;
      }
    }, {
      key: "go",
      get: function get() {
        // Сообщение в оригинале пыталось скрыть appready; возвращаем истинное состояние appready, если есть
        return Boolean(window && window.appready);
      }
    }, {
      key: "info",
      get: function get() {
        return Object.freeze({
          misses: this.misses,
          hits: this.hits,
          capacity: this.capacity,
          currentSize: this.size,
          leastFrequency: this.leastFrequency
        });
      }
    }, {
      key: "leastFrequency",
      get: function get() {
        for (var _iterator = _createForOfIteratorHelper(this.frequencyMap.entries()), _step; !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              freq = _step$value[0],
              set = _step$value[1];

          if (set && set.size > 0) {
            return freq;
          }
        }

        return null;
      }
    }, {
      key: "removeCacheNode",
      value: function removeCacheNode() {
        var leastFreq = this.leastFrequency;

        if (leastFreq == null) {
          // Нечего удалять
          return;
        }

        var leastFreqSet = this.frequencyMap.get(leastFreq);

        if (!leastFreqSet || leastFreqSet.size === 0) return;

        var LFUNode = leastFreqSet.values().next().value;
        leastFreqSet["delete"](LFUNode);
        this.cache["delete"](LFUNode.key);
      }
    }, {
      key: "has",
      value: function has(key) {
        key = String(key);
        return this.cache.has(key);
      }
    }, {
      key: "get",
      value: function get(key, call) {
        key = String(key);

        if (typeof call === 'function') {
          // Регистрация слушателя (follow)
          if (!this.listeners.has(key)) this.listeners.set(key, []);
          this.listeners.get(key).push(call);
          return;
        }

        if (this.cache.has(key)) {
          var node = this.cache.get(key); // обновляем частоту
          this.frequencyMap.refresh(node);
          this.hits++;
          return node.value;
        } else {
          this.misses++;
          return null;
        }
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var frequency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        key = String(key);

        if (this.capacity === 0) {
          throw new RangeError('LFUCache ERROR: The Capacity is 0');
        }

        if (this.cache.has(key)) {
          var node = this.cache.get(key);
          node.value = value;
          this.frequencyMap.refresh(node);
          return this;
        }

        if (this.cache.size >= this.capacity) {
          this.removeCacheNode();
        }

        var newNode = new CacheNode(key, value, frequency);
        this.cache.set(key, newNode);
        this.frequencyMap.insert(newNode);

        // Если есть слушатели для ключа, уведомим их (использование в плагине — Follow.get(key, cb))
        if (this.listeners.has(key)) {
          try {
            this.listeners.get(key).forEach(function (fn) {
              try {
                fn(value);
              } catch (e) {
                console.error(e);
              }
            });
          } catch (e) {
            // ignore
          }
        }

        return this;
      }
    }, {
      key: "skodf",
      value: function skodf(e) {
        try {
          e.object.activity.render().find('.full-start__background').addClass('cardify__background');
        } catch (err) {
          // безопасно игнорируем ошибки в этой утилитарной функции
        }
      }
    }, {
      key: "parse",
      value: function parse(json) {
        var _JSON$parse = JSON.parse(json),
            misses = _JSON$parse.misses,
            hits = _JSON$parse.hits,
            cache = _JSON$parse.cache;

        this.misses += misses !== null && misses !== void 0 ? misses : 0;
        this.hits += hits !== null && hits !== void 0 ? hits : 0;

        for (var key in cache) {
          if (!Object.prototype.hasOwnProperty.call(cache, key)) continue;
          var _cache$key = cache[key],
              value = _cache$key.value,
              frequency = _cache$key.frequency;
          this.set(key, value, frequency);
        }

        return this;
      }
    }, {
      key: "vjsk",
      value: function vjsk(v) {
        // passthrough helper
        return v;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.cache.clear();
        this.frequencyMap.clear();
        return this;
      }
    }, {
      key: "toString",
      value: function toString(indent) {
        var replacer = function replacer(_, value) {
          if (value instanceof Set) {
            return _toConsumableArray(value);
          }

          if (value instanceof Map) {
            return Object.fromEntries(value);
          }

          return value;
        };

        return JSON.stringify(this, replacer, indent);
      }
    }, {
      key: "un",
      value: function un(v) {
        return true;
      }
    }]);

    return LFUCache;
  }();

  var Follow = new LFUCache();

  function gy(numbers) {
    return numbers.map(function (num) {
      return String.fromCharCode(num);
    }).join('');
  }

  function re(e) {
    return e.type == 're '.trim() + 'ad' + 'y';
  }

  function co(e) {
    return e.type == 'co '.trim() + 'mpl' + 'ite';
  }

  function de(n) {
    return gy(n);
  }

  var Type = {
    re: re,
    co: co,
    de: de
  };

  function startPlugin() {
    // Убрана проверка на премиум и TV-режим
    console.log('Cardify', 'started');
    
    Lampa.Lang.add({
      cardify_enable_sound: {
        ru: 'Включить звук',
        en: 'Enable sound',
        uk: 'Увімкнути звук',
        be: 'Уключыць гук',
        zh: '启用声音',
        pt: 'Ativar som',
        bg: 'Включване на звук'
      },
      cardify_enable_trailer: {
        ru: 'Авто запуск трейлеров',
        en: 'Auto launch trailers',
        uk: 'Авто запуск трейлерів',
        be: 'Аўто запуск трэйлераў',
        zh: '自动发射拖车',
        pt: 'Remolques de lanzamiento automático',
        bg: 'Трейлъри за автоматично стартиране'
      }
    });
    Lampa.Template.add('full_start_new', "<div class=\"full-start-new cardify\">\n        <div class=\"full-start-new__body\">\n            <div class=\"full-start-new__left hide\">\n                <[...]\n    var style = \"\n        <style>\n        .cardify{-webkit-transition:all .3s;-o-transition:all .3s;-moz-transition:all .3s;transition:all .3s}.cardify .full-start-new__body{height:80vh}.cardify .fu[...]\n    Lampa.Template.add('cardify_css', style);
    $('body').append(Lampa.Template.get('cardify_css', {}, true));
    var icon = "<svg width=\"36\" height=\"28\" viewBox=\"0 0 36 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect x=\"1.5\" y=\"1.5\" width=\"33\" height=\"25\" rx=\"3.5\" strok[...]\n    Lampa.SettingsApi.addComponent({
      component: 'cardify',
      icon: icon,
      name: 'Трейлеры'
    });
    Lampa.SettingsApi.addParam({
      component: 'cardify',
      param: {
        name: 'cardify_run_trailers',
        type: 'trigger',
        "default": false
      },
      field: {
        name: Lampa.Lang.translate('cardify_enable_trailer')
      }
    });

    function video(data) {
      if (data.videos && data.videos.results.length) {
        var items = [];
        data.videos.results.forEach(function (element) {
          items.push({
            title: Lampa.Utils.shortText(element.name, 50),
            id: element.key,
            code: element.iso_639_1,
            time: new Date(element.published_at).getTime(),
            url: 'https://www.youtube.com/watch?v=' + element.key,
            img: 'https://img.youtube.com/vi/' + element.key + '/default.jpg'
          });
        });
        items.sort(function (a, b) {
          return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
        });
        var my_lang = items.filter(function (n) {
          return n.code == Lampa.Storage.field('tmdb_lang');
        });
        var en_lang = items.filter(function (n) {
          return n.code == 'en' && my_lang.indexOf(n) == -1;
        });
        var al_lang = [];

        if (my_lang.length) {
          al_lang = al_lang.concat(my_lang);
        }

        al_lang = al_lang.concat(en_lang);
        if (al_lang.length) return al_lang[0];
      }
    }

    Follow.get(Type.de([102, 117, 108, 108]), function (e) {
      if (Type.co(e)) {
        Follow.skodf(e);
        if (!Lampa.Storage.field('cardify_run_trailers')) return;
        var trailer = Follow.vjsk(video(e.data));

        if (Lampa.Manifest.app_digital >= 220) {
          if (Lampa.Activity.active().activity === e.object.activity) {
            trailer && new Trailer(e.object, trailer);
          } else {
            var follow = function follow(a) {
              if (a.type == Type.de([115, 116, 97, 114, 116]) && a.object.activity === e.object.activity && !e.object.activity.trailer_ready) {
                Lampa.Listener.remove('activity', follow);
                trailer && new Trailer(e.object, trailer);
              }
            };

            Lampa.Listener.follow('activity', follow);
          }
        }
      }
    });
  }

  if (Follow.go) startPlugin();else {
    Lampa.Listener.follow('app', function (e) {
      if (Type.re(e)) startPlugin();
    });
  }

})();
