(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    }
    else {
        factory(jQuery);
    }
}(function ($) {

    "use strict";

    var SimpleTooltip = function (el, options) {
        this._options = $.extend(true, {}, this._options, options);
        this.$el = $(el);

        if (this._options.delegateSelector) {
            this.$el.on("mouseenter.SimpleTooltip", this._options.delegateSelector, $.proxy(this._handleMouseEnter, this));
        }
        else {
            this.$el.on("mouseenter.SimpleTooltip", $.proxy(this._handleMouseEnter, this));
        }
    };

    SimpleTooltip.prototype = {

        _options: {
            tooltipClassName: "tooltip",
            template: function () { return "<div class='" + this.tooltipClassName + "'></div>" },
            delegateSelector: undefined
        },

        destroy: function () {
            if (!this._options.delegateSelector) {
                this.$el.children("." + this._options.tooltipClassName).remove();
            }
            this.$el.off("mouseenter.SimpleTooltip");
            this.$el.off("mouseleave.SimpleTooltip");
            delete this.$el;
        },

        _handleMouseEnter: function (e) {
            var $el = $(e.currentTarget);
            var $tooltip = $el.children("." + this._options.tooltipClassName);
            var position = $el.attr("data-tooltip-position");

            this._elementHadStaticPositioningOnMouseEnter = $el.css("position") === "static";

            //Because tooltips are positioned absolutely, we need the element to have a position other than static
            if (this._elementHadStaticPositioningOnMouseEnter) {
                $el.css("position", "relative");
            }

            //Render tooltip if not already rendered
            if (!$tooltip.length) {
                $tooltip = $(this._options.template()).html($.trim($el.attr("data-tooltip-label")).replace(/\n+/g, "<br>"))
                                                    .addClass("ext-" + position) //Add tooltip position classes
                                                    .addClass($el.attr("data-tooltip-decorator")); //Add a custom class
                $tooltip.appendTo($el);

                if (position === "east" || position === "west") {
                    $tooltip.css("margin-top", -$tooltip.outerHeight() / 2);
                }
                else {
                    $tooltip.css("margin-left", -$tooltip.outerWidth() / 2);
                }
            }

            $tooltip.addClass("visible");

            if (this._options.delegateSelector) {
                this.$el.one("mouseleave.SimpleTooltip", this._options.delegateSelector, $.proxy(this._handleMouseLeave, this));
            }
            else {
                this.$el.one("mouseleave.SimpleTooltip", $.proxy(this._handleMouseLeave, this));
            }
        },

        _handleMouseLeave: function (e) {
            var $el = $(e.currentTarget);
            var $tooltip = $el.children("." + this._options.tooltipClassName);

            $tooltip.off("transitionend").one("transitionend", $.proxy(function () {
                //Reset to static
                if (this._elementHadStaticPositioningOnMouseEnter) {
                    $el.css("position", "static");
                }
            }, this));

            $tooltip.removeClass("visible");
        }
    };

    //Register as jQuery plugin
    $.fn.simpleTooltip = function (options) {
        return this.each(function () {
            if (!$.data(this, "simpleTooltip")) {
                $(this).data("simpleTooltip", new SimpleTooltip(this, options));
            }
        });
    };

    return window.SimpleTooltip = SimpleTooltip;
}));