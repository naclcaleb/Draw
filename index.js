var type = document.getElementById("brush");

var BRUSHES = {
    "default": DEFAULT_BRUSH,
    "netted": NETTED,
    "bubbles": BUBBLES,
    "sketchy": SKETCHY,
    "calligraphy": CALLIGRAPHY_BRUSH
};

var FILENAME = document.getElementById("filename").value;

//Some event listeners
type.addEventListener("change", function(e){
    
    CURRENT_TOOL = BRUSHES[type.value];
    
});

document.getElementById("brushSize").addEventListener("change", function(e){
    BRUSH_SIZE = document.getElementById("brushSize").value;
});

function eraserToggle(cb){
    if (cb.checked) {
        canvas.eraserOn();
    }else {
        canvas.eraserOff();
    }
}


var colorPicker = new iro.ColorPicker("#color-picker", {
    width: 220, 
    height: 220,
    color: "#f00"
});

colorPicker.on("color:change", function(color){
    COLOR.red = color.rgb.r;
    COLOR.green = color.rgb.g;
    COLOR.blue = color.rgb.b;
});



var o = document.getElementById("opacity");
o.addEventListener("change", function(){
     COLOR.alpha = o.value/100;
});
//Globals
var CURRENT_TOOL = DEFAULT_BRUSH;
var BRUSH_SIZE = 10;
var COLOR = {
    red: 255,
    green: 0,
    blue: 0,
    alpha: 0.3
};

var ACTIVE_LAYER = 0;

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);

window.setInterval(function(){
    canvas.draw();
});

var CANVAS_LEFT = 0;
var CANVAS_TOP = 0;



CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px",""));


canvas.zoom(1);

document.getElementById("save").onclick = function(){
    canvas.save();
};

document.body.addEventListener("wheel", function(e){
    CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
    CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px",""));
    
    e.preventDefault();
    canvas.zoom(e.deltaY);
    
});

