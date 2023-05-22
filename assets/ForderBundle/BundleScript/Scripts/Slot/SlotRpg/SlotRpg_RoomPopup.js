
cc.Class({
    extends: cc.Component,
    ctor() {
        this.listItem = [];
    },

    properties: {
        item : cc.Node,
    },

    start () {

    },

    Show(listConfigRoom) {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        Global.UIManager.hideMiniLoading();
		this.node.active = true;
        
        for(let i = 0; i < listConfigRoom.length; i++) {
            if(i >= this.listItem.length){
                let node = cc.instantiate(this.item);
                node.parent = this.item.parent;
                node.active = true;
                this.listItem[i] = node;
                node.getComponent('SlotRpg_RoomPopup_Button').Init(listConfigRoom[i]);
            }else{
                this.listItem[i].getComponent('SlotRpg_RoomPopup_Button').Init(listConfigRoom[i]);
            }
        }
    },

    Hide(){
		this.node.active = false;
		Global.UIManager.hideMark();
    },

    onDestroy(){
		Global.FindRoomRpgPopup = null;
	},
});
