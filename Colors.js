//A funtion to turn the color object into a string
function colorToString(color) {
    var str = "rgba(";
    str += color.red + ", ";
    str += color.green + ", ";
    str += color.blue + ", ";
    str += color.alpha + ")";

    return str;
}

