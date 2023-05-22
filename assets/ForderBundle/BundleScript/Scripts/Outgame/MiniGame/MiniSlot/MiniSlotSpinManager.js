
cc.Class({
    extends: require("SpinManager"),

    ctor(){
        this.NumberEffect = 3;
        this.NUMBER_COLUMN = 3;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 10;
        this.NUMBER_ITEM_BELOW = 3;
        this.cacheMulti = 1;
        this.toDoList = null;
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    properties: {
        listNodeMulti: {
            default: [],
            type: cc.Node
        },

    },

    UpdateMulti(multi) {
        this.cacheMulti = multi;
    },

    PlayEffectSpin() {
        this._super();
        this.resetListMulti();
    },

    OnCheckUpdateMatrix() {
        this.stateSpin += 1;
        if(this.stateSpin == 2) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i]);
            }
            //this.ShowEffectMulti();
        }
    },

    ShowEffectMulti(){
        //chay ngau nhien
        let index = this.NumberEffect*4;
        this.toDoList.CreateList();
        for(let i = 0; i < index; i++){
            let id = 0;
            if(i == index -1)
                id = this.cacheMulti - 1;
            else if(i == index -2){
                if(this.cacheMulti == 3)
                    id = 0;
                else 
                    id = 2;
            }
            else
                id = this.getRanNum(0,3);

            this.toDoList.AddWork(()=>{
                this.resetListMulti();
                this.listNodeMulti[id].active = true;
            }, false);
            this.toDoList.Wait(0.15 - 0.001*i);
            if(i == (index-1)){
                this.toDoList.AddWork(()=>{
                    let actionSpawn = cc.sequence(cc.scaleTo(0.05 ,1.1),cc.delayTime(0.05),cc.scaleTo(0.05 ,1),cc.delayTime(0.05),cc.scaleTo(0.05 ,1.1),cc.delayTime(0.05),cc.scaleTo(0.05 ,1),
                    cc.delayTime(0.05),cc.scaleTo(0.05 ,1.1),cc.delayTime(0.05),cc.scaleTo(0.05 ,1),cc.delayTime(0.05),cc.scaleTo(0.05 ,1.1),cc.delayTime(0.05),cc.scaleTo(0.05 ,1));
                    this.listNodeMulti[id].stopAllActions();
                    this.listNodeMulti[id].runAction(actionSpawn);
                    this.slotView.toDoList.DoWork();
                }, false);
            }
        }
        this.toDoList.Play();
    },

    resetListMulti(){
        for(let i = 0; i < this.listNodeMulti.length; i++){
            this.listNodeMulti[i].active = false;
        }
    },

    getRanNum(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },

});
