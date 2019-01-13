document.getElementById("brushSize").addEventListener("change", function(e){
    BRUSH_SIZE = document.getElementById("brushSize").value;
});

var type = document.getElementById("brush");

var BRUSHES = {
    "default": DEFAULT_BRUSH,
    "netted": NETTED,
    "bubbles": BUBBLES,
    "sketchy": SKETCHY,
    "calligraphy": CALLIGRAPHY_BRUSH
};

type.addEventListener("change", function(e){
    
    CURRENT_TOOL = BRUSHES[type.value];
    
});
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

var CURRENT_TOOL = DEFAULT_BRUSH;
var BRUSH_SIZE = 10;
var COLOR = {
    red: 255,
    green: 0,
    blue: 0,
    alpha: 0.3
};

var canvas = new Canvas(800,600);

setInterval(function(){
    canvas.draw();
}, 60 / 1000);