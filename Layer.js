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
        
        this.ctx = this.el.getContext("2d");

        var ctx = this.ctx;
        var active = this.active;
        var that = this;

        this.el.addEventListener("mousedown", function(e){
            if (active){
                CURRENT_TOOL.startStroke(ctx, e);
            }
        });

        this.el.addEventListener("mouseup", function(e){
            if (active){
                that.strokes.push( CURRENT_TOOL.endStroke(ctx) );
            }
        });

        this.el.addEventListener("mousemove", function(e){
            if (active){
                CURRENT_TOOL.continueStroke(ctx, e);
            }
        });


    }
}