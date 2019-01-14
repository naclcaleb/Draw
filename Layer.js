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
        this.erasing = false;
        this.strokes = [];
        this.undone = [];
        
        
        this.ctx = this.el.getContext("2d");

        var ctx = this.ctx;
        var active = this.active;
        var that = this;

        this.createRender();

        this.el.addEventListener("mousedown", function(e){
            var rect = that.el.getBoundingClientRect();
            var E = {
                clientX: e.clientX - rect.left,
                clientY: e.clientY - rect.top
            }
            if (active){
                CURRENT_TOOL.startStroke(ctx, E);
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
            var rect = that.el.getBoundingClientRect();
            var E = {
                clientX: e.clientX - rect.left,
                clientY: e.clientY - rect.top
            }
            if (active){
                CURRENT_TOOL.continueStroke(ctx, E);
            }
        });


    }

    createRender(){
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
        for (var i = 0;i<this.strokes.length;i++){
            this.strokes[i].draw();
        }

        this.render = this.ctx.getImageData(0,0, this.el.width, this.el.height);

        if (this.erasing){
            this.eraserOn();
        }
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

    eraserOn(){
        this.ctx.globalCompositeOperation = "destination-out";
        this.erasing = true;
    }
    eraserOff(){
        this.ctx.globalCompositeOperation = "source-over";
        this.erasing = false;
    }
}