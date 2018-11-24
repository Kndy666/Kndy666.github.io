var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//背景图片
var bg = new Image();
bg.src = "images/bg.jpg";
//热狗图片
var hd = new Image();
hd.src = "images/hotdog.png";
//英雄图片
var h = new Image();
h.src = "images/hero.png";
//游戏结束图片
var end = new Image();
end.src = "images/end.jpg";
//计数板图片
var tip = new Image();
tip.src = "images/bullet_tip.png";
//计时板图片
var time_tip = new Image();
time_tip.src = "images/time_tip.png";

window.onload = function () {
    var hds = [];
    var x = 500;
    var y = 200;
    var lastTime = 0;
    var interval = 500;
    var time = 3000;
    var time2 = 31;
    var score = 0;
    var hero = new hero(450, 450, 80, 133, h);

    function hero(x, y, width, height, img) {
        dropObjects.call(this, x, y, width, height, img);
        this.x = 450;
        this.y = 450;
    }

    function dropObjects(x, y, width, height, img) {
        this.x = Math.random() * (1000 - 30);
        this.y = -height;
        this.width = width;
        this.height = height;
        this.img = img;

        this.paint = function (ctx) {
            ctx.drawImage(this.img, this.x, this.y);

        }

        this.step = function () {
            this.y++;
        }

        this.hit = function (component) {
            var c = component;
            return c.x > this.x - c.width && c.x < this.x + this.width && c.y > this.y - c.height && c.y < this.y + this.height;

        }

        this.boom = function () {
            score++;
            this.canDelete = true;
        }

        this.outOfBounds = function () {
            return this.y >= 600;
        }
    }

    function checkHit() {
        for (var i = 0; i < hds.length; i++) {
            var hd_1 = hds[i];
            if (hero.hit(hd_1)) {
                hd_1.boom();
            }
        }
    }

    function deleteComponent() {
        var ary = [];
        for (var i = 0; i < hds.length; i++) {
            if (!(hds[i].canDelete || hds[i].outOfBounds())) {
                ary[ary.length] = hds[i];
            }
        }
        hds = ary;
    }

    function component() {
        if (!isActionTime(lastTime, interval)) {
            return;
        }
        lastTime = new Date().getTime();
        hds[hds.length] = new dropObjects(x, y, 30, 55, hd);
    }

    function paintComponent() {
        for (var i = 0; i < hds.length; i++) {
            hds[i].paint(ctx);
        }

    }

    function stepComponent() {
        for (var i = 0; i < hds.length; i++) {
            hds[i].step();
        }
    }

    function isNumber(number) {
        var i = 10;
        var count = 1;
        while (i <= number) {
            i *= 10;
            count++;
        }
        return count;
    }

    function writeDown(number, x1, y1, x2, y2, font, color) {
        var receive = isNumber(number);
        ctx.font = font;
        ctx.fillStyle = color;
        if (receive == 1) {
            ctx.fillText(number, x1, y1);
        } else {
            ctx.fillText(number, x2, y2);
        }
    }

    function resetTime() {
        if (time % 100 == 0) {
            writeDown(time2, 45, 65, 37, 65, "30px 微软雅黑", "white");
            time2--;
        } else {
            writeDown(time2, 45, 65, 37, 65, "30px 微软雅黑", "white");
        }
        if (time2 == 0) {
            clearInterval(ctrl);
            ctx.drawImage(end, 0, 0);
            writeDown(score, 483, 435, 465, 432, "50px 微软雅黑", "white");
        }
        time--;

    }

    function isActionTime(lastTime, interval) {
        if (lastTime == 0) {
            return true;
        }
        var currentTime = new Date().getTime();
        return currentTime - lastTime >= interval;
    }

    var ctrl = setInterval(function () {
        ctx.drawImage(bg, 0, 0);
        component();
        paintComponent();
        stepComponent();
        checkHit();
        deleteComponent();
        hero.paint(ctx);
        ctx.drawImage(tip, 800, 5);
        ctx.drawImage(time_tip, 25, 25);
        writeDown(score, 888, 63, 878, 63, "30px 微软雅黑", "white");
        resetTime();

    }, 10)

    document.onkeydown = function (ev) {
		if (time2 >= 1) {
			if (ev.keyCode == 37) {
            hero.x -= 10;
            hero.paint(ctx);
			}
        if (ev.keyCode == 39) {
            hero.x += 10;
            hero.paint(ctx);
			}
		}
        
    }
}