cc.Class({
    extends: require("SlotGameEffect"),

    ClickCloseFree() {
        if(this.freeObj.active) {
            this.freeObj.active = false;
            this.slotView.freeManager.ActionShowFreeUI();
        }
        
    },
   
});
