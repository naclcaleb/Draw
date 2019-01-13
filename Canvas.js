class Canvas {
    constructor(width, height) {
        this.scale = 1;
        this.width = width;
        this.height = height;
        this.layers = [new Layer(width, height)];
        this.activeLayer = 0;

        this.el = document.createElement("div");
        this.el.id = "canvas";
        this.el.style.boxShadow = "gray 5px 5px 10px";
        
        document.getElementById("viewport").appendChild(this.el);

        //Append layers
        for (var i = 0;i<this.layers.length;i++){
            this.el.appendChild(this.layers[i].el);
        }
    }

    draw(){
        
        for (var i = 0;i<this.layers.length;i++){
            this.layers[i].ctx.clearRect(0,0,this.width, this.height);
            for (var j = 0;j<this.layers[i].strokes.length;j++){
                this.layers[i].strokes[j].draw();
            }
        }
        if (CURRENT_TOOL.on){
            CURRENT_TOOL.currentStroke.draw();
        }
    }
}