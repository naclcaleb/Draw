class Stroke {
    constructor(context){
        /*
        An action looks like:
        {
            func: ctx.fillRect,
            params: [0,0,100,100]
        }
        */
        this.actions = [];
        this.ctx = context;
    }

    addAction(action){
        this.actions.push(action);
    }

    addActions(actions){
        for (var i = 0;i<actions.length;i++){
            this.addAction(actions[i]);
        }
    }

    draw(){
        for (var i = 0;i<this.actions.length;i++){
            this.actions[i].func.apply(this.ctx, this.actions[i].params);
        }
    }
}