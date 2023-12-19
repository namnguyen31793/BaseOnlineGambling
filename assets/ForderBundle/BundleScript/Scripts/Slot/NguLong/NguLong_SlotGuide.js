// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('SlotGuide'),

    properties: {
        listPointPage : [cc.Node],
        listTitle : [cc.Node],
    },

    ChangeImage(){
        this._super();
        this.listPointPage[this.indexHelp].active = true;
        this.listTitle[this.indexHelp].active = true;
    },

    Clear(){
        for(let i = 0; i < this.listPointPage.length; i++){
            this.listPointPage[i].active = false;
        }
        for(let i = 0; i < this.listTitle.length; i++){
            this.listTitle[i].active = false;
        }
    },
});
