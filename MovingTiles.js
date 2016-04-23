$(document).ready(function() {
    $('.moving-tiles .tile').each(function() {
        if ($(this).children('.tile-slide').length > 0) {
            $(this).data('MovingTiles', new TileSlide({ target: this }))
        }
    })
});

function TileSlide(args) {
    if (!args) args = {};
    this.wait = parseInt(args.Wait) || 3000;
    this.Speed = parseInt(args.Speed) || 800;
    this.direction = (args.Direction || "right").toLowerCase();
    this.pause = false;
    this.slides = $(args.target).find('.tile-wrapper');
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
    $(args.target).mouseenter(function() {
        that.Pause() 
    });
    $(args.target).mouseleave(function()  {
        that.Resume()
    });
    
    if (this.slides.filter('[data-slide="1"]').length == 1) this.slides.filter('[data-slide="1"]').addClass('active');
    else                                                    this.slides.filter(':first-child').addClass('active');
    
    if (args.start != false) this.Start();
}
TileSlide.prototype = {
    Next: function() {
        this.Animate(this.direction);
    },
    Prev: function() {
        var direction = "left"
        if      (this.direction == "down")  direction = "up";
        else if (this.direction == "up")    direction = "down";
        else if (this.direction == "left")  direction = "right";
        
        this.Animate(direction);
    },
    Animate: function(direction) {
        var that = this;
        
        if (this.block) return;
        this.block = true;
        var block = 0;
        
        var active;
        if (this.slides.filter('.active').length > 0)               active = this.slides.filter('.active');
        else if (this.slides.filter('[data-slide="1"]').length > 0) active = this.slides.filter('[data-slide="1"]');
        else                                                        active = this.slides.filter(':first-child');
        
        var next;
        if (this.slides.filter('[data-slide="' + parseInt(active.attr('[data-slide="')) + 1 + '"]').length > 0) next = this.slides.filter('[data-slide="' + parseInt(active.attr('[data-slide="')) + 1 + '"]');
        else if (active.next().length > 0)                                                                      next = active.next();
        else                                                                                                    next = this.slides.filter(':first-child');
        
        this.Load(next, next.attr('data-direction') || direction);
        active.animate(this.animation[next.attr('data-direction') || direction], {
            duration:   this.speed, 
            queue:      false,
            complete:   function() {
                active.removeClass('active').css({ top: '', bottom: '', left: '', right: '' });
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
                "top": "0"
            },
            "left": {
                "left": "-" + this.slides.first().width() + "px",
                "top": "0"
            },
            "up": {
                "top": "-" + this.slides.first().height() + "px",
                "left": "0"
            },
            "down": {
                "top": this.slides.first().height() + "px",
                "left": "0"
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