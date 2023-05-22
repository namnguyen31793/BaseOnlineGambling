

cc.Class({
    extends: cc.Component,
    ctor() {
    },

    properties: {
        src : cc.ScrollView,
        srcListView: require("BaseScrollViewNgang"),
    },

    start () {
        let list = [];
        for(let i = 0; i < 100000; i++) {
            list[i] = i;
        }
        this.srcListView.init(list, (list.length * 300), 300); 
        this.scheduleOnce(()=>{
            this.srcListView.Test(50001);
            this.srcListView.Test2(false);
            cc.log(this.src.content);
        } , 0.01);  
        this.scheduleOnce(()=>{
            cc.log(this.src.content);
        } , 1);
    },

    UpdateJackpot() {
        for(let i = 0; i < this.src.content.children.length; i++) {
            this.src.content.children[i].getComponent("ItemLobby").UpdateJackpot();
        }
    },

});
