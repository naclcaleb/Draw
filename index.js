//Get the brush type select field
var type = document.getElementById("brush");

//Keep track of our modals
var modals = [];

//If we need to hide a modal...
function hideModal(id){
    //Find the correct id...
    for (var i = 0;i<modals.length;i++){

        if ( modals[i].id === id ){
            modals[i].hide(); //...then hide it.
        }

    }
}


//These are our brushes - these vars are imported from the ./brushes.js file
var BRUSHES = {
    default: DEFAULT_BRUSH,
    netted: NETTED,
    bubbles: BUBBLES,
    sketchy: SKETCHY,
    calligraphy: CALLIGRAPHY_BRUSH,
    solid: SOLID
};

//The filename for the drawing
var FILENAME = document.getElementById("filename").value;

//An HTML template for the new brush modal
var newBrushHTML = `
    <p>
        Choose a file with the button below, and we'll add it to your toolbox!
    </p>
    <input type="file" id="newbrushfile">
`;

//Defin the new brush modal and add it to our modals array
var newBrushModal = new Modal("New Custom Brush", newBrushHTML);
modals.push(newBrushModal);

//Some event listeners

//Listen for a brush change
type.addEventListener("change", function(e) {
    //If it's not a new brush, set the brush appropriately
    if ( type.value !== "newBrush" ){

        CURRENT_TOOL = BRUSHES[type.value];

    } else {
        //If the user wants to make a new brush, we pop up a modal and ask them to upload an image for it
        newBrushModal.show();
    }
});

//Listen for a brush size change
document.getElementById("brushSize").addEventListener("change", function(e) {
    //Set the brush size
    BRUSH_SIZE = document.getElementById("brushSize").value;
});

//For toggling the eraser
function eraserToggle(cb) {
    if (cb.checked) {
        canvas.eraserOn();
    } else {
        canvas.eraserOff();
    }
}

/*****************
 * 
 * Custom Brush Uploading code
 *  
 *****************/

//Listen for a new brush file change 
document.getElementById("newbrushfile").addEventListener("change", function(e){
    //Grap the new brush file input
    var el = document.getElementById("newbrushfile");

    //Get the file
    var file = el.files[0];
    
    //Define a file reader
    var reader = new FileReader();

    //Give a default name
    var name = "CustomBrush";

    //Run this function when the image is loaded
    reader.addEventListener("load", function(e){

        //Create a new image
        var img = new Image();

        //Define it's source
        img.src = reader.result;

        //Create a brush from the image
        var brush = new ImageBrush(img);
        
        //Add the brush to the brushes list and set the current tool
        BRUSHES[name] = brush;
        CURRENT_TOOL = brush;
        
        //Hide the modal
        newBrushModal.hide();

        //Reload the brushes
        loadBrushes();
    });

    //Does it have a file?
    if (file) {
        
        //Get the brush name
        name = file.name;

        //Remove the ".extension" at the end
        name = name.split(".");
        var extension = name.pop();
        name.join(".");

        //Which extensions are allowed?
        var allowedExtensions = {
            "png": true, 
            "jpg": true
        };

        //If the current extension is allowed...
        if (extension.toLowerCase() in allowedExtensions){
            reader.readAsDataURL(file);//Read the file into a data url
        } else {
            //Otherwise, let the user know it's unsupported
            alert("Unsupported file type. Please try again.");
        }
    }
});

//Define a color picker
var colorPicker = new iro.ColorPicker("#color-picker", {
    width: 220,
    height: 220,
    color: "#f00"
});

//Set the global COLOR var on change
colorPicker.on("color:change", function(color) {
    COLOR.red = color.rgb.r;
    COLOR.green = color.rgb.g;
    COLOR.blue = color.rgb.b;
});

//Set the COLOR.alpha whenever the opacity is changed.
var o = document.getElementById("opacity");
o.addEventListener("change", function() {
    COLOR.alpha = o.value / 100;
});

//Load Brushes
function loadBrushes() {
    //Reset the content of the brush select field
    document.getElementById("brush").innerHTML = "";

    //For every brush in our object...
    for (var i in BRUSHES) {
        //Create a new option element
        var newEl = document.createElement("option");

        //Set it's value to the name of the brush
        newEl.value = i;

        //Capitalize the first letter of its name for display
        var str = i;
        var upCase = str.charAt(0).toUpperCase();
        str = upCase + str.substr(1, str.length);

        //Set the option's textContent
        newEl.textContent = str;

        //Append the element
        document.getElementById("brush").appendChild(newEl);
    }

    //Create the "Upload Your Own" option and append it
    var newBrushOption = document.createElement("option");

    newBrushOption.value = 'newBrush';

    newBrushOption.textContent = "Upload Your Own";

    document.getElementById("brush").appendChild(newBrushOption);
}

//Load the brushes initially
loadBrushes();

//Globals
var CURRENT_TOOL = DEFAULT_BRUSH; //The current tool being used
var BRUSH_SIZE = 10; //The global brush size

//Our COLOR global
var COLOR = {
    red: 255,
    green: 0,
    blue: 0,
    alpha: 1
};

//The active layer
var ACTIVE_LAYER = 0;

//Get the dimensions with a prompt
var dimensions = prompt("Please enter dimensions for your drawing, in this format: WIDTHxHEIGHT");

//Split it
dimensions = dimensions.split("x");

//Define width and height
var CANVAS_WIDTH = Number( dimensions[0] );
var CANVAS_HEIGHT = Number( dimensions[1] );

//Create our canvas
var canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);

//Zoom it depending on the canvas size
canvas.zoom( -(window.innerWidth - CANVAS_WIDTH)/4 );

//Update the drawing on an interval
window.setInterval(function() {
    canvas.draw();
});

//Define the canvas left and top position (used for zooming)
var CANVAS_LEFT = 0;
var CANVAS_TOP = 0;

CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px", ""));


//When the save button is clicked, we save the image
document.getElementById("save").onclick = function() {
    canvas.save();
};

//Zoom on mousewheel
document.getElementById("canvas").addEventListener("wheel", function(e) {
    CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
    CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px", ""));

    e.preventDefault();

    //This is the most important line
    canvas.zoom(e.deltaY);
});

//Grab our controls
var controls = document.getElementById("controls");

//Are we dragging the controls?
var isDragging = false;

//Returns the x and y position of the controls
function getControlsPos() {
    var left = controls.style.left.replace("px", "");
    var top = controls.style.top.replace("px", "");

    return { x: left, y: top };
}

//Defines an x- and y-offset for when we click, to get a smoother drag
var xoff = 0;
var yoff = 0;

//On mouse down...
controls.addEventListener("mousedown", function(e) {
    //Get the control coordinates
    var coords = getControlsPos();

    //If the mouse is in the dragging area...
    if (
        e.clientX > coords.x &&
        e.clientX < coords.x + 400 &&
        e.clientY > coords.y &&
        e.clientY < coords.y + 25
    ) {
        //We are dragging
        isDragging = true;

        //Define our offsets
        xoff = e.clientX - coords.x;
        yoff = e.clientY - coords.y;
    }
});

//On mouse up...
document.body.onmouseup = function() {
    //We aren't dragging
    isDragging = false;
};

//On mouse move...
document.body.onmousemove = function(e) {
    //Set the controls x and y to be the mouse x and y minus our offsets
    if (isDragging) {
        controls.style.left = e.clientX - xoff + "px";
        controls.style.top = e.clientY - yoff + "px";
    }
};
