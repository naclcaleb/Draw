var type = document.getElementById("brush");

var BRUSHES = {
    "default": DEFAULT_BRUSH,
    "netted": NETTED,
    "bubbles": BUBBLES,
    "sketchy": SKETCHY,
    "calligraphy": CALLIGRAPHY_BRUSH
};

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


var colorPicker = document.querySelector(".jscolor");

function update(picker){
    COLOR = {
        red: picker.rgb[0],
        green: picker.rgb[1],
        blue: picker.rgb[2],
        alpha: COLOR.alpha
    }
}

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

var canvas = new Canvas(800,600);

document.body.addEventListener("mousemove", function(){
    canvas.draw();
});

var CANVAS_LEFT = 0;
var CANVAS_TOP = 0;
CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px",""));
CANVAS_WIDTH = parseFloat(canvas.el.style.width.replace("px", ""));
CANVAS_HEIGHT = parseFloat(canvas.el.style.height.replace("px", ""));

canvas.zoom(1);

document.body.addEventListener("wheel", function(e){
    CANVAS_LEFT = parseFloat(canvas.el.style.left.replace("px", ""));
    CANVAS_TOP = parseFloat(canvas.el.style.top.replace("px",""));
    
    e.preventDefault();
    canvas.zoom(e.deltaY);
    
});