//Global function for getting the mouse position relative to the canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
        clientX: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
        clientY: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
    };
}

//Define the Layer class
class Layer {
    constructor(width, height) {
        //Is it the active layer?
        this.active = true;

        //Create a canvas element
        this.el = document.createElement("canvas");
        
        //Some styles
        this.el.style.left = "10px;";
        this.el.style.top = "10px";
        this.el.style.width = "100%";
        this.el.style.height = "100%";
        this.el.style.background = "rgb(0,0,0,0)";

        //Set canvas width and height
        this.el.width = width;
        this.el.height = height;

        //Are we erasing?
        this.erasing = false;

        //Store our strokes
        this.strokes = [];

        //Store the strokes we have used the "undo" feature on
        this.undone = [];

        //Define a canvas context
        this.ctx = this.el.getContext("2d");

        //Get some variables for reference inside event listeners
        var ctx = this.ctx;
        var active = this.active;

        //A little trick I picked up
        var that = this;

        //Create the layer render (basically an image of everything on the layer canvas, in this case nothing)
        this.createRender();


        //On mouse down...
        this.el.addEventListener("mousedown", function(e) {
            //Get and store the mouse position relative to the canvas
            var E = getMousePos(that.el, e);

            if (active) {
                //If this is the active layer, start a stroke
                CURRENT_TOOL.startStroke(ctx, E);

                //If we're erasing, set some variables and add an action to the current stroke
                if (that.erasing) {
                    
                    CURRENT_TOOL.currentStroke.isEraser = true;

                    CURRENT_TOOL.currentStroke.actions.unshift({
                        func: ctx.setGlobalCompositeOperation,
                        params: ["destination-out"]
                    });
                }
            }
        });

        //On mouse up...
        this.el.addEventListener("mouseup", function(e) {
            //If this is the active layer...
            if (active) {
                //If we're erasing, append an action that stops the erasing
                if (that.erasing) {

                    CURRENT_TOOL.currentStroke.actions.push({
                        func: ctx.setGlobalCompositeOperation,
                        params: ["source-over"]
                    });

                }

                //Have the stroke render itself
                CURRENT_TOOL.currentStroke.createRender();

                //The endStroke method returns a stroke. Fetch that...
                var newStroke = CURRENT_TOOL.endStroke(ctx);
                
                //...and add it to the strokes list
                that.strokes.push(newStroke);

                //Update the render
                that.updateRender();
            }
        });

        //On mouse move...
        this.el.addEventListener("mousemove", function(e) {
            //Get the mouse position relative to the canvas...
            var E = getMousePos(that.el, e);

            //If this is the active layer...
            if (active) {
                //...continue the stroke
                CURRENT_TOOL.continueStroke(ctx, E);
            }
        });
    }

    createRender() {
        //Make sure we're not erasing
        this.ctx.globalCompositeOperation = "source-over";

        //Clear the canvas
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);

        //Draw all our strokes
        for (var i = 0; i < this.strokes.length; i++) {
            this.strokes[i].draw();
        }

        //Get the ImageData of the whole canvas
        this.render = this.ctx.getImageData(
            0,
            0,
            this.el.width,
            this.el.height
        );
        
        //If we're erasing, make sure our eraser is turned back on
        if (this.erasing) {
            this.eraserOn();
        }
    }

    updateRender() {
        //Clear the canvas
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);

        //Draw our render
        this.ctx.putImageData(this.render, 0, 0);

        //Draw our most recent stroke (the previous ones are all contained in the previous render)
        this.strokes[this.strokes.length - 1].draw();

        //Get the ImageData of the whole canvas
        this.render = this.ctx.getImageData(
            0,
            0,
            this.el.width,
            this.el.height
        );
    }

    undo() {
        //Get the last stroke
        var stroke = this.strokes.pop();

        //Add it to our "undone" list
        this.undone.unshift(stroke);

        //Recreate the render
        this.createRender();
    }
	
    redo() {
        //Get the last undone stroke
        var stroke = this.undone.shift();

        //Add it back to our drawing
        this.strokes.push(stroke);

        //Rerender the drawing
        this.createRender();
    }

    draw() {
        //Clear the canvas (Possibly unnecessary)
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);

        //Put the image data render
        this.ctx.putImageData(this.render, 0, 0);
    }

    eraserOn() {
        //Set the globalCompositeOperation
        this.ctx.globalCompositeOperation = "destination-out";

        //Tell everyone we're erasing
        this.erasing = true;
    }
    eraserOff() {
        //Reset the globalCompositeOperation
        this.ctx.globalCompositeOperation = "source-over";

        //Tell everyone we're not erasing
        this.erasing = false;
    }
}
