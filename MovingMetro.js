function TileSlide(args) {
    if (!args) args = {};
    this.wait = parseInt(args.Wait) || 3000;
    this.speed = parseInt(args.Speed) || 800;
    this.direction = (args.Direction || "right").toLowerCase();
    this.pause = false;
    this.slides = $(args.Target).find('.tile-wrapper');
    this.animation = {
        "right": {
            "left": "-=" + this.slides.first().width() + "px",
            "top": "0"
        },
        "left": {
            "left": "+=" + this.slides.first().width() + "px",
            "top": "0"
        },
        "up": {
            "top": "+=" + this.slides.first().height() + "px",
            "left": "0"
        },
        "down": {
            "top": "-=" + this.slides.first().height() + "px",
            "left": "0"
        }
    };
    this.block = false;
    var that = this;
    $(args.Target).mouseenter(function() {
        that.Pause() 
    });
    $(args.Target).mouseleave(function()  {
        that.Resume()
    });
    
    if (this.slides.filter('[data-slide="1"]').length == 1) this.slides.filter('[data-slide="1"]').addClass('active');
    else                                                    this.slides.filter(':first-child').addClass('active');
    
    if (args.start != false) this.Start();
}
TileSlide.prototype = {
    Next: function() {
        
        var active;
        if (this.slides.filter('.active').length > 0)               active = this.slides.filter('.active');
        else if (this.slides.filter('[data-slide="1"]').length > 0) active = this.slides.filter('[data-slide="1"]');
        else                                                        active = this.slides.filter(':first-child');
        
        var next;
        if (this.slides.filter('[data-slide="' + parseInt(active.attr('[data-slide="')) + 1 + '"]').length > 0) {
            next = this.slides.filter('[data-slide="' + parseInt(active.attr('[data-slide="')) + 1 + '"]');
        }
        else if (active.next().length > 0)  next = active.next();
        else                                next = this.slides.filter(':first-child');
        
        this.Animate(active, next, this.direction);
    },
    Prev: function() {
        var direction = "left"
        if      (this.direction == "down")  direction = "up";
        else if (this.direction == "up")    direction = "down";
        else if (this.direction == "left")  direction = "right";
        
        var active;
        if (this.slides.filter('.active').length > 0)               active = this.slides.filter('.active');
        else if (this.slides.filter('[data-slide="1"]').length > 0) active = this.slides.filter('[data-slide="1"]');
        else                                                        active = this.slides.filter(':first-child');
        
        var prev;
        if (this.slides.filter('[data-slide="' + parseInt(active.attr('[data-slide="')) - 1 + '"]').length > 0) {
            prev = this.slides.filter('[data-slide="' + parseInt(active.attr('[data-slide="')) - 1 + '"]');
        }
        else if (active.prev().length > 0)  prev = active.next();
        else                                prev = this.slides.filter(':last-child');
        
        this.Animate(active, prev, direction);
    },
    Animate: function(active, next, direction) {
        var that = this;
        
        if (this.block) return;
        this.block = true;
        var block = 0;
        
        this.Load(next, next.attr('data-direction') || direction);
        this.slides.first().closest('.tile-slide').addClass('M2-Animating');
        active.animate(this.animation[next.attr('data-direction') || direction], {
            duration:   this.speed, 
            queue:      false,
            complete:   function() {
                active.removeClass('active').css({ top: '', bottom: '', left: '', right: '', "z-index": "" });
                checkDone();
            }
        });
        next.animate(this.animation[next.attr('data-direction') || direction], {
            duration:   this.speed,
            queue:      false,
            complete:   function() {
                next.addClass('active')
                checkDone()
            }
        });
        
        function checkDone() {
            block++
            if (block == 2) {
                that.block = false;
                that.slides.first().closest('.tile-slide').removeClass('M2-Animating');
            }
        }
    },
    Start: function() {
        var that = this;
        
        if (!this.s && !this.pause) {
            this.s = setInterval(function() {
                if (that.pause) {
                    clearInterval(that.s);
                    that.s = false;
                }
                else that.Next();
            }, this.wait);
        }
    },
    Load: function(elm, direction) {
        var complete = {
            "right": {
                "left": this.slides.first().width() + "px",
                "top": "0",
                "z-index": 10
            },
            "left": {
                "left": "-" + this.slides.first().width() + "px",
                "top": "0",
                "z-index": 10
            },
            "up": {
                "top": "-" + this.slides.first().height() + "px",
                "left": "0",
                "z-index": 10
            },
            "down": {
                "top": this.slides.first().height() + "px",
                "left": "0",
                "z-index": 10
            }
        }
        elm.css(complete[direction]);
        
    },
    Pause: function() {
        this.pause = true;
    },
    Resume: function() {
        this.pause = false;
        this.Start();
    }
    
}