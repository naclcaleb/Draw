var type = document.getElementById("brush");
var modals = [];

function hideModal(id){
    for (var i = 0;i<modals.length;i++){
        if (modals[i].id === id){
            modals[i].hide();
        }
    }
}

var BRUSHES = {
    default: DEFAULT_BRUSH,
    netted: NETTED,
    bubbles: BUBBLES,
    sketchy: SKETCHY,
    calligraphy: CALLIGRAPHY_BRUSH,
    solid: SOLID
};

var FILENAME = document.getElementById("filename").value;

var newBrushHTML = `
    <p>
        Choose a file with the button below, and we'll add it to your toolbox!
    </p>
    <input type="file" id="newbrushfile">
`;


var newBrushModal = new Modal("New Custom Brush", newBrushHTML);
modals.push(newBrushModal);

//Some event listeners

//Listen for a brush change
type.addEventListener("change", function(e) {
    if ( type.value !== "newBrush" ){
        CURRENT_TOOL = BRUSHES[type.value];
    } else {
        //If the user wants to make a new brush, we pop up a modal and ask them to upload an image for it
        newBrushModal.show();
    }
});

//Listen for a brush size change
document.getElementById("brushSize").addEventListener("change", function(e) {
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

var customBrushes = [];

//Listen for a new brush file change
document.getElementById("newbrushfile").addEventListener("change", function(e){
    var el = document.getElementById("newbrushfile");
    var file = el.files[0];
    
    var reader = new FileReader();
    var name = "CustomBrush";


    reader.addEventListener("load", function(e){
        var img = new Image();
        img.src = reader.result;
        var brush = new ImageBrush(img);
        customBrushes.push(brush);

        

        BRUSHES[name] = brush;
        
        newBrushModal.hide();
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

        var allowedExtensions = {
            "png": true, 
            "jpg": true
        };

        if (extension.toLowerCase() in allowedExtensions){
            reader.readAsDataURL(file);
        } else {
            alert("Unsupported file type. Please try again.");
        }
    }
});

var colorPicker = new iro.ColorPicker("#color-picker", {
    width: 220,
    height: 220,
    color: "#f00"
});

colorPicker.on("color:change", function(color) {
    COLOR.red = color.rgb.r;
    COLOR.green = color.rgb.g;
    COLOR.blue = color.rgb.b;
});

var o = document.getElementById("opacity");
o.addEventListener("change", function() {
    COLOR.alpha = o.value / 100;
});

//Load Brushes
function loadBrushes() {
    document.getElementById("brush").innerHTML = "";

    for (var i in BRUSHES) {
        var newEl = document.createElement("option");
        newEl.value = i;
        var str = i;
        var upCase = str.charAt(0).toUpperCase();
        str = upCase + str.substr(1, str.length);

        newEl.textContent = str;

        document.getElementById("brush").appendChild(newEl);
    }

    var newBrushOption = document.createElement("option");
    newBrushOption.value = 'newBrush';

    newBrushOption.textContent = "Upload Your Own";

    document.getElementById("brush").appendChild(newBrushOption);
}

loadBrushes();

//Globals
var CURRENT_TOOL = DEFAULT_BRUSH;
var BRUSH_SIZE = 10;
var COLOR = {
    red: 255,
    green: 0,
    blue: 0,
    alpha: 1
};

var ACTIVE_LAYER = 0;

var dimensions = prompt("Please enter dimensions for your drawing, in this format: WIDTHxHEIGHT");
dimensions = dimensions.split("x");
var CANVAS_WIDTH = Number( dimensions[0] );
var CANVAS_HEIGHT = Number( dimensions[1] );

var canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);

canvas.zoom( -(window.innerWidth - CANVAS_WIDTH)/4 );

window.setInterval(function() {
    canvas.draw();
});

var CANVAS_LEFT = 0;
var CANVAS_TOP = 0;

CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px", ""));



document.getElementById("save").onclick = function() {
    canvas.save();
};

document.getElementById("canvas").addEventListener("wheel", function(e) {
    CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
    CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px", ""));

    e.preventDefault();
    canvas.zoom(e.deltaY);
});

var controls = document.getElementById("controls");
var isDragging = false;

function getControlsPos() {
    var left = controls.style.left.replace("px", "");
    var top = controls.style.top.replace("px", "");

    return { x: left, y: top };
}

var xoff = 0;
var yoff = 0;

controls.addEventListener("mousedown", function(e) {
    var coords = getControlsPos();

    if (
        e.clientX > coords.x &&
        e.clientX < coords.x + 400 &&
        e.clientY > coords.y &&
        e.clientY < coords.y + 25
    ) {
        isDragging = true;
        xoff = e.clientX - coords.x;
        yoff = e.clientY - coords.y;
    }
});

document.body.onmouseup = function() {
    isDragging = false;
};

document.body.onmousemove = function(e) {
    if (isDragging) {
        controls.style.left = e.clientX - xoff + "px";
        controls.style.top = e.clientY - yoff + "px";
    }
};
