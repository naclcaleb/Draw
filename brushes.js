function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var DEFAULT_BRUSH = new Brush(function(ctx, e) {
    var pmouseX = this.lastPoint[0],
        pmouseY = this.lastPoint[1],
        mouseX = e.clientX,
        mouseY = e.clientY;

    var d = dist(pmouseX, pmouseY, mouseX, mouseY);
    var angle = angleBetween(pmouseX, pmouseY, mouseX, mouseY);
    var lastX = pmouseX;
    var lastY = pmouseY;

    this.currentStroke.addAction({
        func: ctx.setGlobalAlpha,
        params: [1]
    });

    for (var i = 0; i < d; i += BRUSH_SIZE / 8) {
        var x = lastX + i * Math.sin(angle);
        var y = lastY + i * Math.cos(angle);

        let radgrad = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_SIZE / 2);

        radgrad.addColorStop(0, colorToString(COLOR));

        var pastColorAlpha = COLOR.alpha + 1;

        COLOR.alpha /= 2;
        radgrad.addColorStop(0.5, colorToString(COLOR));
        COLOR.alpha = 0;
        radgrad.addColorStop(1, colorToString(COLOR));
        COLOR.alpha = pastColorAlpha - 1;
        var actions = [
            {
                func: ctx.setFillStyle,
                params: [radgrad]
            },
            {
                func: ctx.fillRect,
                params: [
                    x - BRUSH_SIZE / 2,
                    y - BRUSH_SIZE / 2,
                    BRUSH_SIZE,
                    BRUSH_SIZE
                ]
            }
        ];

        this.currentStroke.addActions(actions);
    }
});

var SKETCHY = new Brush(function(ctx, e) {
    this.currentStroke.addAction({
        func: ctx.setGlobalAlpha,
        params: [1]
    });
    var lastPoint = this.lastPoint;

    for (var i = 0, len = this.points.length; i < len; i++) {
        dx = this.points[i][0] - lastPoint[0];
        dy = this.points[i][1] - lastPoint[1];
        d = dx * dx + dy * dy;

        if (d < BRUSH_SIZE * 40) {
            var actions = [
                {
                    func: ctx.setLineWidth,
                    params: [1]
                },
                {
                    func: ctx.beginPath,
                    params: []
                },
                {
                    func: ctx.setStrokeStyle,
                    params: [colorToString(COLOR)]
                },
                {
                    func: ctx.moveTo,
                    params: [lastPoint[0] + dx * 0.2, lastPoint[1] + dy * 0.2]
                },
                {
                    func: ctx.lineTo,
                    params: [
                        this.points[i][0] - dx * 0.2,
                        this.points[i][1] - dy * 0.2
                    ]
                },
                {
                    func: ctx.stroke,
                    params: []
                }
            ];

            this.currentStroke.addActions(actions);
        }
    }
});

var NETTED = new Brush(function(ctx, e) {
    var actions = [
        {
            func: ctx.setFillStyle,
            params: ["#000000"]
        },

        {
            func: ctx.setStrokeStyle,
            params: [colorToString(COLOR)]
        },
        {
            func: ctx.setLineWidth,
            params: [BRUSH_SIZE / 20]
        },
        {
            func: ctx.beginPath,
            params: []
        },
        {
            func: ctx.moveTo,
            params: [this.points[0][0], this.points[0][1]]
        }
    ];

    for (var i = 1; i < this.points.length; i++) {
        actions.push({
            func: ctx.lineTo,
            params: [this.points[i][0], this.points[i][1]]
        });

        var nearPoint = this.points[i - 5];
        if (nearPoint) {
            actions.push({
                func: ctx.moveTo,
                params: [nearPoint[0], nearPoint[1]]
            });
            actions.push({
                func: ctx.lineTo,
                params: [this.points[i][0], this.points[i][1]]
            });
        }
    }
    actions.push({
        func: ctx.stroke,
        params: []
    });

    this.currentStroke.addActions(actions);
});

var BUBBLES = new Brush(function(ctx, e) {
    var actions = [
        {
            func: ctx.setFillStyle,
            params: [colorToString(COLOR)]
        },
        {
            func: ctx.setLineWidth,
            params: [0]
        }
    ];
    //for (var i = 0; i < this.points.length; i++){
    var radius = randInt(2, BRUSH_SIZE / 2);
    var x = e.clientX + randInt(0, BRUSH_SIZE / 2);
    var y = e.clientY + randInt(0, BRUSH_SIZE / 2);
    var opacity = Math.random();
    var tmpColor = COLOR;
    tmpColor.alpha = opacity;

    actions.push({
        func: ctx.beginPath,
        params: []
    });
    actions.push({
        func: ctx.setGlobalAlpha,
        params: [opacity]
    });
    actions.push({
        func: ctx.arc,
        params: [x, y, radius, false, Math.PI * 2, false]
    });
    actions.push({
        func: ctx.fill,
        params: []
    });
    actions.push({
        func: ctx.setGlobalAlpha,
        params: [1]
    });

    //}

    this.currentStroke.addActions(actions);
});

var SOLID = new Brush(function(ctx, e) {
    var pmouseX = this.lastPoint[0],
        pmouseY = this.lastPoint[1],
        mouseX = e.clientX,
        mouseY = e.clientY;

    var d = dist(pmouseX, pmouseY, mouseX, mouseY);
    var angle = angleBetween(pmouseX, pmouseY, mouseX, mouseY);
    var lastX = pmouseX;
    var lastY = pmouseY;

    var pastAlpha = ctx.globalAlpha + 1 - 1;

    const setFillStyle = [
        {
            func: ctx.setFillStyle,
            params: [colorToString(COLOR)]
        },
        {
            func: ctx.setGlobalAlpha,
            params: [COLOR.alpha]
        }
    ];

    this.currentStroke.addActions(setFillStyle);

    for (var i = 0; i < d; i += BRUSH_SIZE / 4) {
        var x = lastX + i * Math.sin(angle);
        var y = lastY + i * Math.cos(angle);

        //Draw an ellipse

        let actions = [
            {
                func: ctx.beginPath,
                params: []
            },
            {
                func: ctx.arc,
                params: [x, y, BRUSH_SIZE, 0, 2 * Math.PI]
            },
            {
                func: ctx.fill,
                params: []
            }
        ];

        this.currentStroke.addActions(actions);
    }

    this.currentStroke.addAction({
        func: ctx.setGlobalAlpha,
        params: [pastAlpha]
    });
});

var callig_instance_img = new Image();
callig_instance_img.src = "calligraphy.png";
var CALLIGRAPHY_BRUSH = new ImageBrush(callig_instance_img);
