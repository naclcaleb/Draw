
    
   

class Stroke {
    constructor(context){
        /*
        An action looks like:
        {
            func: ctx.fillRect,
            params: [0,0,100,100]
        }
        */
        this.actions = [];
        this.ctx = context;
        this.render = undefined;
        this.renderOn = false;
    }

    addAction(action){
        this.actions.push(action);
    }

    addActions(actions){
        for (var i = 0;i<actions.length;i++){
            this.addAction(actions[i]);
        }
    }

    createRender(){
        var canvas = document.createElement("canvas");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        var ctx = canvas.getContext("2d");

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
        

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0;i<this.actions.length;i++){
            this.actions[i].func.apply(ctx, this.actions[i].params);
        }

        this.render = canvas.toDataURL("image/png");

        
    }

    draw(){
        if (!this.render){
            for (var i = 0;i<this.actions.length;i++){
                this.actions[i].func.apply(this.ctx, this.actions[i].params);
            }
        }
        else {
            
            
            let render = new Image();

            render.src = this.render;
            
            //Draw the render
            this.ctx.drawImage(render, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
           
        }
    }
}