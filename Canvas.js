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
        this.el.style.left = (window.innerWidth - this.width)/2 + "px";
        this.el.style.top = (window.innerHeight - this.height)/2 + "px";
        this.el.style.width = width + "px";
        this.el.style.height = height + "px";
         
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

    zoom(n){
        n = -n;
        console.log(n);
        this.el.style.width = (this.width + n) + "px";
        this.el.style.height = (this.height + n) + "px";
        
        var originalLeft = this.el.style.left.replace("px", "");

        this.el.style.left = (originalLeft - n/2) + "px";
        

        this.layers[0].el.style.width = (this.width + n) + "px";
        this.layers[0].el.style.height = (this.height + n) + "px";
        this.layers[0].el.style.left = (originalLeft - n/2) + "px";

        this.width += n;
        this.height += n;
        
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

    save(){
        //Create a new canvas
        var newCanvas = document.createElement("canvas");
        newCanvas.style.display = "none";

        var context = newCanvas.getContext("2d");

        document.body.appendChild(newCanvas);

        //Get all the renderings and write them to the canvas
        for (var i = 0;i<this.layers.length;i++){
            //I'm going to render it again just in case
            this.layers[i].createRender();
            
           context.putImageData(this.layers[i].render);
        }
    }
}