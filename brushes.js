//For creating a random integer - helpful for adding randomness to our brushes
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//The default brush
var DEFAULT_BRUSH = new Brush(function(ctx, e) {
    //Define the mouse and pmouse x and y 
    var pmouseX = this.lastPoint[0],
        pmouseY = this.lastPoint[1],
        mouseX = e.clientX,
        mouseY = e.clientY;

    //Get the distance between pmouse and mouse
    var d = dist(pmouseX, pmouseY, mouseX, mouseY);

    //Get the angle between the pmouse-mosue line and the x axis
    var angle = angleBetween(pmouseX, pmouseY, mouseX, mouseY);

    //Set the global alpha to 1
    this.currentStroke.addAction({
        func: ctx.setGlobalAlpha,
        params: [1]
    });

    //This for loop keeps the brush from splitting up. Refer to this blog post: http://perfectionkills.com/exploring-canvas-drawing-techniques/
    for (var i = 0; i < d; i += BRUSH_SIZE / 8) {
        //Get the x and y coords of the spot we're about to add.
        //If you don't understand these equations, you may want to google "polar coordinates" and read up on them
        var x = pmouseX + i * Math.sin(angle);
        var y = pmouseY + i * Math.cos(angle);

        //Create a radial gradient
        let radgrad = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_SIZE / 2);

        //Add a color stop 
        radgrad.addColorStop(0, colorToString(COLOR));

        //Get the original alpha (the +1 allows us to make this variable separate from the COLOR variable, rather than just referencing it) (possibly unnecessary)
        var pastColorAlpha = COLOR.alpha + 1;

        //Half the alpha
        COLOR.alpha /= 2;
        //Another color stop
        radgrad.addColorStop(0.5, colorToString(COLOR));

        //Alpha goes to zero
        COLOR.alpha = 0;
        //Last color stop
        radgrad.addColorStop(1, colorToString(COLOR));
        
        //Reset the color alpha (the -1 offsets the +1 from when we defined it)
        COLOR.alpha = pastColorAlpha - 1;

        //Draw the gradient
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

        //Add the actions to the current stroke
        this.currentStroke.addActions(actions);
    }
});

//The sketchy brush
var SKETCHY = new Brush(function(ctx, e) {
    //Set the global alpha to 1
    this.currentStroke.addAction({
        func: ctx.setGlobalAlpha,
        params: [1]
    });

    //Get the last point (stored by the brush object)
    var lastPoint = this.lastPoint;

    //Loop through all the points this stroke has covered
    for (var i = 0, len = this.points.length; i < len; i++) {
        //Get the difference in x and y
        dx = this.points[i][0] - lastPoint[0];
        dy = this.points[i][1] - lastPoint[1];

        //This is getting the distance between them, but saving processing power by not taking the square root
        d = dx * dx + dy * dy;

        //If d is within the specified range...
        if (d < BRUSH_SIZE * 40) {
            //Draw a line
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

            //Add the actions to the current stroke
            this.currentStroke.addActions(actions);
        }
    }
});

//The netted brush
var NETTED = new Brush(function(ctx, e) {
    //Set up the styling
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

    //Loop through the points
    for (var i = 1; i < this.points.length; i++) {
        //Draw a line
        actions.push({
            func: ctx.lineTo,
            params: [this.points[i][0], this.points[i][1]]
        });

        //Draw a line to each of the 5 points behind it
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

    //Stroke it
    actions.push({
        func: ctx.stroke,
        params: []
    });

    //Add the actions to the current stroke
    this.currentStroke.addActions(actions);
});

//The bubbles brush
var BUBBLES = new Brush(function(ctx, e) {
    //Set fill style and line width
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

   //Set some parameters
    var radius = randInt(2, BRUSH_SIZE / 2);
    var x = e.clientX + randInt(0, BRUSH_SIZE / 2);
    var y = e.clientY + randInt(0, BRUSH_SIZE / 2);
    var opacity = Math.random();

    //Set the alpha
    var tmpColor = COLOR;
    tmpColor.alpha = opacity;


    //Draw the circles
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

    
    //Add the actions to the current stroke
    this.currentStroke.addActions(actions);
});

//The solid brush
var SOLID = new Brush(function(ctx, e) {
    //Define the mouse variables
    var pmouseX = this.lastPoint[0],
        pmouseY = this.lastPoint[1],
        mouseX = e.clientX,
        mouseY = e.clientY;

    //Get distance and angle
    var d = dist(pmouseX, pmouseY, mouseX, mouseY);
    var angle = angleBetween(pmouseX, pmouseY, mouseX, mouseY);
    
    //Get the past alpha
    var pastAlpha = ctx.globalAlpha + 1 - 1;

    //Set the fill style
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

    //Add the action to the current stroke
    this.currentStroke.addActions(setFillStyle);

    //For each point along the line...
    for (var i = 0; i < d; i += BRUSH_SIZE / 4) {
        //Define the x and y
        var x = pmouseX + i * Math.sin(angle);
        var y = pmouseY + i * Math.cos(angle);

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

        //Add the actions to the current stroke
        this.currentStroke.addActions(actions);
    }

    //Reset the global alpha
    this.currentStroke.addAction({
        func: ctx.setGlobalAlpha,
        params: [pastAlpha]
    });
});

//Calligraphy brush
//Make an image
var callig_instance_img = new Image();
//Get the calligraphy image
callig_instance_img.src = "calligraphy.png";
//Create a new imagebrush
var CALLIGRAPHY_BRUSH = new ImageBrush(callig_instance_img);
