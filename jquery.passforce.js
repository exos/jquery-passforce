(function(factory) {

  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function($) {
        return factory($);
    });
  } else if (typeof exports !== 'undefined') {
     $ = require('jquery');
     factory($);
  } else {
     factory((root.jQuery || root.Zepto || root.ender || root.$));
  }

})(function($) {

    var defOpts = {
        minlength: 6,
        objetive: 100,
        badScoreClass: 'pass-bad',
        mediumScoreClass: 'pass-medium',
        goodScoreClass: 'pass-god'
    };

    var passForce = function (el, options) {
        this._el = $(el);
        this._options = $.extend({},options,defOpts);

        this._subscribeEvents();

    };

    passForce.prototype._subscribeEvents = function () {
        
        var self = this;

        var testTimeout = null;

        this.score = 0;

        this._el.keyup(function () {
            clearTimeout(testTimeout);
            testTimeout = setTimeout(function () {
                self.check();
            }, 100);
        });

    };

    passForce.prototype.getScore = function () {
        var pass = this._el.val();

        if (pass.length < this._options.minlength) {
            if (this.score != 0) this._el.trigger('scorechange', 0,0);
            return 0;
        }

        var index = 0;
        var score = 0;
        var bonus = 0;

        var charsLength = pass.split('').reduce(function (far, c) {
            if (far.indexOf(c) === -1) far.push(c);
            return far;
        }, []).length;

        if (pass.match(/[0-9]/)) {
            index += 10;
            bonus += 0;
        }

        if (pass.match(/[a-z]/)) {
            index += 26;
            bonus += 0;
        }

        if (pass.match(/[A-Z]/)) {
            index += 26;
            bonus += 0.1;
        }

        if (pass.match(/[\W]/)) {
            index += 10;
            bonus += 0.2;
        }

        bonus += charsLength/10;
        score = Math.round(((index * pass.length)* (bonus+1)) /10);

        if (score !== this.score) {
            this.score = score;
            var persent = this._options.objetive / score*100;
            if (persent > 100) persent = 100;
            this._el.trigger('scorechange', score, Math.round(persent));
        }

        return score;

    };

    passForce.prototype.check = function () {
        
        var score = this.getScore();
        var objetive = this._options.objetive;

        this._el.removeClass(this._options.badScoreClass);
        this._el.removeClass(this._options.mediumScoreClass);
        this._el.removeClass(this._options.goodScoreClass);

        if (score >= objetive) {
            this._el.addClass(this._options.goodScoreClass);
        } else if (score > (objetive/2)) {
            this._el.addClass(this._options.mediumScoreClass);
        } else {
            this._el.addClass(this._options.badScoreClass);
        }

    };

    $.fn.extend({
    
        forcepass: function () {

            var args = arguments;

            this.each(function () {
            
                if ($(this).data('fore-pass-instace')) {
                    var forcePassInstance = $(this).data('fore-pass-instace');

                    if (!args.length) return;

                    var cmd = args.shift();

                    if (cmd.match(/^_/)) throw new Error("Private method");

                    if (typeof forcePassInstance[cmd]) {
                        forcePassInstance[cmd].apply(forcePassInstance, args);
                    }

                } else {
                    var options = args.length ? args.shift() : {};
                    $(this).data('fore-pass-instace', new passForce(this, options));
                }

            });

        }

    });

    return $;

});
