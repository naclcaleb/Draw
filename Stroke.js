class Stroke {
    constructor(context) {
        /*
        An action looks like:
        {
            func: ctx.fillRect,
            params: [0,0,100,100]
        }
        */
        //Keep track of our actions
        this.actions = [];

        //Get the canvas context
        this.ctx = context;

        //We don't have a render just yet
        this.render = undefined;

        //We're not erasing
        this.isEraser = false;
    }

    addAction(action) {
        //Push the action
        this.actions.push(action);
    }

    addActions(actions) {
        //Push all the actions
        for (var i = 0; i < actions.length; i++) {
            this.addAction(actions[i]);
        }
    }

    createRender() {
        //Create a canvas with WIDTH and HEIGHT of master canvas
        var canvas = document.createElement("canvas");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        //Get a context
        var ctx = canvas.getContext("2d");

        //Define setter functions
        ctx.setFillStyle = function(style) {
            this.fillStyle = style;
        };
        ctx.setStrokeStyle = function(style) {
            this.strokeStyle = style;
        };
        ctx.setLineWidth = function(width) {
            this.lineWidth = width;
        };
        ctx.setGlobalAlpha = function(alpha) {
            this.globalAlpha = alpha;
        };
        ctx.setGlobalCompositeOperation = function(operation) {
            this.globalCompositeOperation = operation;
        };

        ctx.setLineCap = function(style) {
            this.lineCap = style;
        };

        ctx.setLineJoin = function(style) {
            this.lineJoin = style;
        };

        //Set line cap and join
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        //Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Apply all the actions, binding them to the context
        for (var i = 0; i < this.actions.length; i++) {
            this.actions[i].func.apply(ctx, this.actions[i].params);
        }

        //The render is the canvas
        this.render = canvas;
    }

    draw() {
        //If we don't have a render OR we're an eraser...
        if (this.render === undefined || this.isEraser) {
            //Loop through and draw the actions
            for (var i = 0; i < this.actions.length; i++) {
                this.actions[i].func.apply(this.ctx, this.actions[i].params);
            }
        } else {
            //Draw the render
            this.ctx.drawImage(this.render, 0, 0);
        }
    }
}
