function dist(x1, y1, x2, y2){
    return Math.sqrt( Math.pow( (x2-x1), 2 ) + Math.pow( (y2-y1), 2 ) );
}

function angleBetween(x1, y1, x2, y2) {
    return Math.atan2( x2 - x1, y2 - y1 );
}

class Brush {
    constructor(drawer){
        this.lastPoint = [];
        this.points = [];
        this.currentStroke;
        this.on = false;
        this.drawer = drawer.bind(this);
    }

    prepareContext(ctx){
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
        this.currentStroke = new Stroke(ctx);
        this.prepareContext(ctx);
        this.lastPoint = [e.clientX, e.clientY];
        this.points.push([e.clientX, e.clientY]);
        this.on = true;
        this.continueStroke(ctx, e);
    }

    endStroke(ctx, e){
        this.lastPoint = [];
        this.points = [];
        this.on = false;
        return this.currentStroke;
    
    }

    

    continueStroke(ctx, e){
        console.log();
        if (this.on){
            
            this.drawer(ctx, e);

           this.points.push([e.clientX, e.clientY]);
           this.lastPoint = [e.clientX, e.clientY];
        }
    }
}