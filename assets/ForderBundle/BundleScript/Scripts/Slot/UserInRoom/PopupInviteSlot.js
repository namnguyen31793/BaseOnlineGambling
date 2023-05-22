

cc.Class({
    extends: cc.Component,
    ctor() {
        this.userInRoom = null;
    },

    properties: {
        listUser : [require("UserInviteSlot")],
    },

    show(userInRoom) {
        this.userInRoom = userInRoom;
        Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        this.GetListUser();
    },

    GetListUser() {
        for(let  i = 0; i < this.listUser.length; i++) {
            this.listUser[i].Init(this.userInRoom.GetUser(), this.userInRoom);
        }
    },

    ClickReFresh() {
        this.GetListUser();
    },

    hide() {
        this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
    },

    onDestroy() {
        Global.PopupInviteSlot = null;
    },
   
});
