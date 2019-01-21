//Define the Modal class
class Modal {
    constructor(title, body) {
        //Define our title and body vars
        this.title = title;
        this.body = body;

        //Create a unique modal id
        this.id = new Date().getTime();
        
        //Create an element and give it an HTML template
        this.el = document.createElement("div");
        this.el.innerHTML = `
            <div class="mdl-card mdl-shadow--2dp">
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">${this.title}</h2>
                </div>
                <div class="mdl-card__supporting-text">
                    ${this.body}
                </div>

                <div class="mdl-card__menu">
                    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="hideModal(${this.id})">
                        <i class="material-icons">close</i>
                    </button>
                </div>
            </div>
        `;

        //Define our styles
        var styles = {
            position: "absolute",
            width: "100%",
            height: "100%",
            left: "0px",
            top: window.innerHeight * 2 + "px",
            transition: "1s",
            background: "#000000AA",
            zIndex: "100000000000",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        };

        //Loop through and apply our styles
        for (var i in styles){
            this.el.style[i] = styles[i];
        }

        //Append it to the body
        document.body.appendChild(this.el);
    }

    show() {
        //Bring it to the top
        this.el.style.top = "0px";
    }

    hide() {
        //Hide it at the bottom
        this.el.style.top = window.innerHeight * 2 + "px";
    }
}