//Define the Canvas class
class Canvas {
    constructor(width, height) {
        //Define the beginning width and height
        this._width = width;
        this._height = height;

        //Define the active width and height
        this.width = width;
        this.height = height;

        //Keep track of all the canvas' layers
        this.layers = [new Layer(width, height)];

        //Define the active layer
        this.activeLayer = ACTIVE_LAYER || 0;

        //Create an element and give it an id
        this.el = document.createElement("div");
        this.el.id = "canvas";

        //Some styling
        this.el.style.boxShadow = "gray 5px 5px 10px";
        this.el.style.left = (window.innerWidth - this.width) / 2 + "px";
        this.el.style.top = (window.innerHeight - this.height) / 2 + "px";
        this.el.style.width = width + "px";
        this.el.style.height = height + "px";

        //Add the element to the viewport
        document.getElementById("viewport").appendChild(this.el);

        //A little trick I picked up...
        var that = this;

        //Append layers
        for (var i = 0; i < this.layers.length; i++) {
            this.el.appendChild(this.layers[i].el);
        }

        //Listen for Ctrl+Z to undo and Ctrl+Y to redo
        document.addEventListener("keydown", function(e) {
            if( e.ctrlKey ){
                if ( e.key === "z" ) {
                    //Call the active layer's undo function
                    that.layers[that.activeLayer].undo();

                    //Redraw
                    that.draw();
                }else if( e.key === "y" ){
                    //Call the active layer's redo function
                    that.layers[that.activeLayer].redo();

                    //Redraw
                    that.draw();
                }
            }
        });
    }

    zoom(n) {
        //The direction was backwards, so we need to negate it
        n = -n;
        
        //Add "n" to our width
        this.el.style.width = this.width + n + "px";
        this.el.style.height = this.height + n + "px";

        //Get the previous left and top values of the canvas
        var originalLeft = this.el.style.left.replace("px", "");
        var originalTop = this.el.style.top.replace("px", "");

        //Set a new left and top value
        this.el.style.left = originalLeft - n / 2 + "px";
        this.el.style.top = originalTop - n / 2 + "px";

        //Do the same with each layer
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].el.style.width = this.width + n + "px";
            this.layers[i].el.style.height = this.height + n + "px";
            this.layers[i].el.style.left = originalLeft - n / 2 + "px";
            this.layers[i].el.style.top = originalTop - n/2 + "px";
        }

        //Update the width and height
        this.width += n;
        this.height += n;
    }

    draw() {
        //For each layer after the active layer...
        for (var i = this.activeLayer; i < this.layers.length; i++) {
            //Draw it
            this.layers[i].draw();
        }

        if (CURRENT_TOOL.on) {
            //Draw the current stroke
            CURRENT_TOOL.currentStroke.draw();
        }
    }

    eraserOn() {
        //For each layer...
        for (var i = 0; i < this.layers.length; i++) {
            //Turn its eraser on
            this.layers[i].eraserOn();
        }
    }

    eraserOff() {
        //For each layer...
        for (var i = 0; i < this.layers.length; i++) {
            //Turn its eraser on
            this.layers[i].eraserOff();
        }
    }

    save() {
        //Create a new canvas
        var newCanvas = document.createElement("canvas");

        //Get a context
        var context = newCanvas.getContext("2d");

        //Some styling
        newCanvas.style.position = "relative";

        //NOTE: (This is why we had to store the original width and height values in the constructor)
        newCanvas.width = this._width;
        newCanvas.height = this._height;

        //Get all the renderings and write them to the canvas
        for (var i = 0; i < this.layers.length; i++) {
            //I'm going create the render again just in case
            this.layers[i].createRender();

            //Put the image data from the render
            context.putImageData(this.layers[i].render, 0, 0);
        }

        //Automatically download it
        //Get a DataURL
        var url = newCanvas.toDataURL();

        //Make sure the filename is updated
        FILENAME = document.getElementById("filename").value;

        //Create an "a" tag
        var link = $("<a>");

        //Give it the appropriate attributes and append it to the body
        link.attr("href", url)
            .attr("download", FILENAME)
            .appendTo("body");

        //Click the link
        link[0].click();

        //Remove the link
        link.remove();
    }
}
