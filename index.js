;
(function($) {
    var Carousel = function(poster) {
        //保存单个旋转木马对象
        self = this;
        this.poster = poster;
        this.posterItemMain = poster.find("ul.img-list");
        this.next_btn = poster.find("div.next-btn");
        this.prev_btn = poster.find("div.prev-btn");
        this._btn=poster.find('div.btn');
        this.posterItems = poster.find("li.img-item");
        //偶数帧
        if ((this.posterItems.length) % 2 == 0) {
            this.posterItemMain.append(this.posterItems.eq(0).clone);
            this.posterItems = this.posterItemMain.children();
        };
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        //解决连续多次点击BUG
        this.rotateFlag = true;
        //默认配置参数
        this.setting = {
            "width": 800,
            "height": 320,
            "posterWidth": 480,
            "posterHeight": 320,
            "scale": 0.9,
            "speed": 500,
            "autoPlay": false,
            "delay": 2000,
            "verticalAlign": "mid"
        }
        this.w = (this.setting.width - this.setting.posterWidth) / 2;
        $.extend(this.setting, this.getSetting());
        // console.log(this.setting);
        //设置配置参数值
        this.setSettingValue();
        this.setPosterPos();
        //点击左右切换
        this.next_btn.click(function() {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouseRotate("left");
            }
        });
        this.prev_btn.click(function() {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouseRotate("right");
            }
        });
        //是否自动播放
        if (this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function() {
                window.clearInterval(self.timer);
            }, function() {
                self.autoPlay();
            });
        }
    };
    Carousel.prototype = {
        //设置自动播放
        autoPlay: function() {
            var self = this;
            this.timer = window.setInterval(function() {
                self.next_btn.click();
            }, this.setting.delay)
        },
        //设置配置参数值去控制基本的宽度高度
        setSettingValue: function() {
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height
            });
            this.posterItemMain.css({
                width: this.setting.width,
                height: this.setting.height
            });
            //计算上下切换按钮的宽度
            console.log(this.w);
            this._btn.css({
                width: this.w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.length / 2)
            });
            //第一帧
            this.posterFirstItem.css({
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                left: this.w,
                zIndex: Math.floor(this.posterItems.length / 2)
            });
        },
        setPosterPos: function() {
            var self = this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.length / 2,
                rightSlice = sliceItems.slice(0, sliceSize),
                leftSlice = sliceItems.slice(sliceSize),
                level = Math.floor(this.posterItems.length / 2);
            //设置右边帧的位置关系和宽高
            var rw = this.setting.posterWidth;
            var rh = this.setting.posterHeight;
            var gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;
            console.log(gap);
            var firstLeft = this.w;
            var fixOffsetLeft = firstLeft + rw;
            rightSlice.each(function(i) {
                level--;
                i++;
                rw = rw * self.setting.scale;
                rh = rh * self.setting.scale;
                $(this).css({
                    zIndex: level,
                    width: rw,
                    height: rh,
                    opacity: 1 / i,
                    left: fixOffsetLeft + gap * i - rw,
                    top: self.setVerticalAlign(rh)
                });
            });
            //设置左边的位置关系以及宽高
            var lw = rightSlice.last().width(),
                lh = rightSlice.last().height(),
                oloop = Math.floor(this.posterItems.length / 2);
            leftSlice.each(function(i) {
                $(this).css({
                    zIndex: level,
                    width: lw,
                    height: lh,
                    opacity: 1 / oloop,
                    left: i * gap,
                    top: self.setVerticalAlign(lh)
                });
                lw = lw / self.setting.scale;
                lh = lh / self.setting.scale;
                oloop--;
                level++;
            });

        },
        setVerticalAlign: function(height) {
            var verticalType = this.setting.verticalAlign;
            var top = 0;
            if (verticalType === "mid") {
                top = (this.setting.height - height) / 2;
            } else if (verticalType === "top") {
                top = 0;
            } else if (verticalType == "bottom") {
                top = this.setting.height - height;
            } else {
                top = (this.setting.height - height) / 2;
            }
            return top;
        },
        //设置按钮旋转
        carouseRotate: function(dir) {
            var _this_ = this;
            if (dir === "left") {
                this.posterItems.each(function() {
                    var self = $(this),
                        prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                        width = prev.width(),
                        height = prev.height(),
                        zIndex = prev.css("zIndex"),
                        opacity = prev.css("opacity"),
                        left = prev.css("left"),
                        top = prev.css("top");
                    self.animate({
                        zIndex: zIndex
                    }, 1, function() {
                        self.animate({
                            width: width,
                            height: height,
                            //zIndex:zIndex,
                            opacity: opacity,
                            left: left,
                            top: top
                        }, _this_.setting.speed, function() {
                            _this_.rotateFlag = true;
                        });
                    });
                });
            } else if (dir === "right") {
                this.posterItems.each(function() {
                    var self = $(this),
                        next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                        width = next.width(),
                        height = next.height(),
                        zIndex = next.css("zIndex"),
                        opacity = next.css("opacity"),
                        left = next.css("left"),
                        top = next.css("top");
                    self.animate({
                        zIndex: zIndex
                    }, 1, function() {
                        self.animate({
                            width: width,
                            height: height,
                            //zIndex:zIndex,
                            opacity: opacity,
                            left: left,
                            top: top
                        }, _this_.setting.speed, function() {
                            _this_.rotateFlag = true;
                        });
                    });
                });
            }
        },
        //获取人工配置参数
        getSetting: function() {
            var setting = this.poster.attr("data-setting");
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return {}
            };
        }
    };
    Carousel.init = function(posters) {
        var _this_ = this;
        posters.each(function() {
            new _this_($(this));
        });
    };
    window.Carousel = Carousel;
})(jQuery);