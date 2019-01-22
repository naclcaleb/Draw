//The ImageBrush class
class ImageBrush {
    constructor(img, smoothing) {
        //Keep track of the previous mouse point
        this.lastPoint = [];

        //Define the current stroke
        this.currentStroke;

        //The brush is not on
        this.on = false;

        //Smoothing
        this.smoothing = smoothing;

        //Get the image
        this.img = img;
    }

    prepareContext(ctx) {
        //Define some setter functions
        ctx.setFillStyle = function(style) {
            ctx.fillStyle = style;
        };
        ctx.setStrokeStyle = function(style) {
            ctx.strokeStyle = style;
        };
        ctx.setLineWidth = function(width) {
            ctx.lineWidth = width;
        };
        ctx.setGlobalAlpha = function(alpha) {
            ctx.globalAlpha = alpha;
        };
        ctx.setGlobalCompositeOperation = function(operation) {
            ctx.globalCompositeOperation = "destination-out";
        };

        ctx.setLineCap = function(style) {
            ctx.lineCap = style;
        };

        ctx.setLineJoin = function(style) {
            ctx.lineJoin = style;
        };

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }

    startStroke(ctx, e) {
        //Create a new stroke
        this.currentStroke = new Stroke(ctx);

        //Prepare the context
        this.prepareContext(ctx);

        //Define the last mouse point
        this.lastPoint = [e.clientX, e.clientY];

        //Turn the brush on
        this.on = true;

        //Continue the stroke
        this.continueStroke(ctx, e);
    }

    endStroke(ctx, e) {
        //Turn the brush off
        this.on = false;

        //Return the stroke
        return this.currentStroke;
    }

    continueStroke(ctx, e) {
        //If the brush is on...
        if (this.on) {
            //Define mouse vars
            var pmouseX = this.lastPoint[0],
                pmouseY = this.lastPoint[1],
                mouseX = e.clientX,
                mouseY = e.clientY;

            //If smoothing is on, make the smooth curve
            if (this.smoothing){
                //Get the distance between mouse and pmouse, and the angle between the pmouse-mouse line and the x-axis
                var d = dist(pmouseX, pmouseY, mouseX, mouseY);
                var angle = angleBetween(pmouseX, pmouseY, mouseX, mouseY);
                

                for (var i = 0; i < d; i++) {
                    var x = pmouseX + i * Math.sin(angle);
                    var y = pmouseY + i * Math.cos(angle);
                    
                    //Draw the image
                    var action = {
                        func: ctx.drawImage,
                        params: [this.img, x, y, BRUSH_SIZE, BRUSH_SIZE]
                    };

                    //Add the action to the current stroke
                    this.currentStroke.addAction(action);
                }
            } else {
                this.currentStroke.addAction({
                    func: ctx.drawImage,
                    params: [this.img, mouseX, mouseY, BRUSH_SIZE, BRUSH_SIZE]
                });
            }

            //Reset the last point
            this.lastPoint = [e.clientX, e.clientY];
        }
    }
}
