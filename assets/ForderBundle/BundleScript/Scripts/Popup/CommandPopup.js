

cc.Class({
    extends: cc.Component,
	ctor() {
		this.isDisconnect = false;
	},

    properties: {
        // foo: {
        content:cc.Label,
    },

    onClickClose(){
		this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
		if(this.event != null)
			this.event();
		this.event = null;
		this.isDisconnect = false;
	},
	
	show(message, event){
		if(message == Global.MyLocalization.GetText("DISCONNECT")) {
			this.isDisconnect = true;
		}
		Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
		this.content.string = message;
		this.event = event;
	},

    Hide() {
		this.isDisconnect = false;
		this.node.active = false;
		Global.UIManager.hideMark();
		this.event = null;
	},
	
	onDestroy(){
		Global.CommandPopup = null;
	},

    // update (dt) {},
});
