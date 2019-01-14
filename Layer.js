class Layer {
    constructor( width, height ){
        this.active = true;
        this.el = document.createElement("canvas");
        this.el.style.position = "absolute";
        this.el.style.left = "10px;"
        this.el.style.top = "10px";
        this.el.style.width = width + "px";
        this.el.style.height = height + "px";
        this.el.style.background = "rgb(0,0,0,0)";
        this.el.width = width;
        this.el.height = height;
        this.strokes = [];
        this.undone = [];
        
        this.ctx = this.el.getContext("2d");

        var ctx = this.ctx;
        var active = this.active;
        var that = this;

        this.createRender();

        this.el.addEventListener("mousedown", function(e){
            if (active){
                CURRENT_TOOL.startStroke(ctx, e);
            }
        });

        this.el.addEventListener("mouseup", function(e){
            if (active){
                var newStroke = CURRENT_TOOL.endStroke(ctx);

                that.strokes.push(newStroke);
                //Update the render
                that.updateRender(newStroke);
            }
        });

        this.el.addEventListener("mousemove", function(e){
            if (active){
                CURRENT_TOOL.continueStroke(ctx, e);
            }
        });


    }

    createRender(){
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
        for (var i = 0;i<this.strokes.length;i++){
            this.strokes[i].draw();
        }

        this.render = this.ctx.getImageData(0,0, this.el.width, this.el.height);
    }

    updateRender(stroke){
        this.ctx.putImageData(this.render, 0, 0);
        stroke.draw();

        this.render = this.ctx.getImageData(0,0, this.el.width, this.el.height);
    }

    undo(){
        var stroke = this.strokes.pop();
        this.undone.unshift(stroke);
        this.createRender();
    }

    draw(){
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
        this.ctx.putImageData(this.render, 0, 0);
    }
}