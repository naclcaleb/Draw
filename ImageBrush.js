class ImageBrush {
    constructor(img){
        this.lastPoint = [];
        this.currentStroke;
        this.on = false;
        this.img = img;
    }

    prepareContext(ctx){
        ctx.setFillStyle = function(style){
            ctx.fillStyle = style;
        }

        ctx.setLineCap("round");
        ctx.setLineJoin("round");
    }

    startStroke(ctx, e){
        this.currentStroke = new Stroke(ctx);
        this.prepareContext(ctx);
        this.lastPoint = [e.clientX, e.clientY];
        this.on = true;
        this.continueStroke(ctx, e);
    }

    endStroke(ctx, e){
        this.on = false;
        return this.currentStroke;
    
    }

    continueStroke(ctx, e){
        if (this.on){
            
            var pmouseX = this.lastPoint[0],
                pmouseY = this.lastPoint[1],
                mouseX = e.clientX,
                mouseY = e.clientY;
            
            var d = dist(pmouseX, pmouseY, mouseX, mouseY);
            var angle = angleBetween(pmouseX, pmouseY, mouseX, mouseY);
            var lastX = pmouseX;
            var lastY = pmouseY;
            
            for (var i = 0;i<d;i++){
                
                var x = lastX + (i * Math.sin(angle));
                var y = lastY + (i * Math.cos(angle));
                
                var action = {
                    func: ctx.drawImage,
                    params: [this.img, x, y, BRUSH_SIZE, BRUSH_SIZE]
                }

                this.currentStroke.addAction(action);
            }

            this.lastPoint = [e.clientX, e.clientY];   

           
        }
    }
}