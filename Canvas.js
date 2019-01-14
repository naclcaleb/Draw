class Canvas {
    constructor(width, height) {
        this.scale = 1;
        this.width = width;
        this.height = height;
        this.layers = [new Layer(width, height)];
        this.activeLayer = ACTIVE_LAYER || 0;

        this.el = document.createElement("div");
        this.el.id = "canvas";
        this.el.style.boxShadow = "gray 5px 5px 10px";
        
        document.getElementById("viewport").appendChild(this.el);
        var that = this;
        //Append layers
        for (var i = 0;i<this.layers.length;i++){
            this.el.appendChild(this.layers[i].el);
        }

        document.addEventListener("keydown", function(e){
            if (e.key === "z" && e.ctrlKey){
                that.layers[that.activeLayer].undo();
                that.draw();
            }
        });
    }



    draw(){
        
        for (var i = this.activeLayer;i<this.layers.length;i++){
            this.layers[i].draw();
        }
        if (CURRENT_TOOL.on){
            CURRENT_TOOL.currentStroke.draw();
        }
    }

    eraserOn(){
        for (var i = 0;i<this.layers.length;i++){
            this.layers[i].eraserOn();
        }
    }

    eraserOff(){
        for (var i = 0;i<this.layers.length;i++){
            this.layers[i].eraserOff();
        }
    }
}