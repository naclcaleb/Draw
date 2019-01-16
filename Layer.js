function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
      clientX: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      clientY: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}
class Layer {
    constructor( width, height ){
        this.active = true;
        this.el = document.createElement("canvas");
        //this.el.style.position = "relative";
        this.el.style.left = "10px;"
        this.el.style.top = "10px";
        this.el.style.width = "100%";
        this.el.style.height = "100%";

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
            var E = getMousePos(that.el, e);
            if (active){
                CURRENT_TOOL.startStroke(ctx, E);

                if (that.erasing){
                    CURRENT_TOOL.currentStroke.actions.unshift({
                        func: ctx.setGlobalCompositeOperation,
                        params: ["destination-out"]
                    });
                }
            }
        });

        this.el.addEventListener("mouseup", function(e){
            if (active){

                if (that.erasing){
                    CURRENT_TOOL.currentStroke.actions.push({
                        func: ctx.setGlobalCompositeOperation,
                        params: ["source-over"]
                    });
                }

                CURRENT_TOOL.currentStroke.createRender();

                var newStroke = CURRENT_TOOL.endStroke(ctx);

                

                that.strokes.push(newStroke);
                //Update the render
                that.updateRender(newStroke);
            }
        });

        this.el.addEventListener("mousemove", function(e){
            var E = getMousePos(that.el, e);
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

        this.render = this.el.toDataURL();

        if (this.erasing){
            this.eraserOn();
        }
    }

    updateRender(stroke){
        var newImage = new Image();
        newImage.src = this.render;
        this.ctx.drawImage(newImage, 0, 0);
        this.strokes[this.strokes.length-1].draw();

        this.render = this.el.toDataURL();
    }

    undo(){
        var stroke = this.strokes.pop();
        this.undone.unshift(stroke);
        this.createRender();
        
    }

    draw(){
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);

        var newImage = new Image();
        newImage.src = this.render;
        this.ctx.drawImage(newImage, 0, 0);
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