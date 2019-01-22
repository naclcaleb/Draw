//For finding the distance between two points
function dist(x1, y1, x2, y2){
    return Math.sqrt( Math.pow( (x2-x1), 2 ) + Math.pow( (y2-y1), 2 ) );
}

//For finding the angle between the specified line and the x-axis
function angleBetween(x1, y1, x2, y2) {
    return Math.atan2( x2 - x1, y2 - y1 );
}

//Define the Brush class
class Brush {
    constructor(drawer){
        //Keep track of the previous mouse position
        this.lastPoint = [];

        //Keep track of the points we've gone across
        this.points = [];

        //Define the current stroke
        this.currentStroke;

        //Is the brush on?
        this.on = false;

        //Get the drawer function from the constructor
        this.drawer = drawer.bind(this);
    }

    prepareContext(ctx){
        //Define some setter functions for the specified context
        ctx.setFillStyle = function(style){
            this.fillStyle = style;
        }
        ctx.setStrokeStyle = function(style){
            this.strokeStyle = style;
        }
        ctx.setLineWidth = function(width){
            this.lineWidth = width;
        }
        ctx.setGlobalAlpha = function(alpha){
            this.globalAlpha = alpha;
        }
        ctx.setGlobalCompositeOperation = function(operation){
            this.globalCompositeOperation = 'destination-out';
        }

        ctx.setLineCap = function(style){
            this.lineCap = style;
        }

        ctx.setLineJoin = function(style){
            this.lineJoin = style;
        }
        
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }

    startStroke(ctx, e){
        //Define a new stroke
        this.currentStroke = new Stroke(ctx);

        //Prepare the context
        this.prepareContext(ctx);

        //Update the last point
        this.lastPoint = [e.clientX, e.clientY];

        //Add the current point
        this.points.push([e.clientX, e.clientY]);

        //Turn the brush on
        this.on = true;

        //Continue the stroke
        this.continueStroke(ctx, e);
    }

    endStroke(ctx, e){
        //Undefine the last point
        this.lastPoint = [];

        //Clear the points
        this.points = [];

        //Turn the brush off
        this.on = false;

        //Return the stroke
        return this.currentStroke;
    
    }

    

    continueStroke(ctx, e){
        //If the brush is on..
        if (this.on){
            //Use the drawing function passed in the constructor
            this.drawer(ctx, e);

            //Add to the points
            this.points.push([e.clientX, e.clientY]);

            //Update the previous mouse point
            this.lastPoint = [e.clientX, e.clientY];
            
        }
    }
}
