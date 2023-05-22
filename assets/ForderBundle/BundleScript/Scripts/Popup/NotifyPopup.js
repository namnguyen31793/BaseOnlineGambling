

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        content:cc.Label,
		icon : cc.Sprite,
		listImg : [cc.SpriteFrame],
        anim : cc.Animation,
    },

    onClickClose(){
		if(this.event != null)
			this.event();
        this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
		this.event = null;
	},
	
	show(gameId, event){
		this.node.active = true;
        this.anim.play();
		this.event = event;
		let index = gameId - 19;
		if(index < 0 || index >= 5) {
			index = 0;
		}
		this.icon.spriteFrame = this.listImg[index];
		if(gameId == 0) {
            this.content.string = Global.MyLocalization.GetText("RANK_GAME");
        } else if(gameId == 19) {
            this.content.string = Global.MyLocalization.GetText("DRAGON_GAME");
        } else if(gameId == 20) {
            this.content.string = Global.MyLocalization.GetText("MAYA_GAME");
        } else if(gameId == 21) {
            this.content.string = Global.MyLocalization.GetText("QUEEN_GAME");
        } else if(gameId == 22) {
            this.content.string = Global.MyLocalization.GetText("ZEUS_GAME");
        } else if(gameId == 23) {
            this.content.string = Global.MyLocalization.GetText("HADES_GAME");
        }
	},

    start () {

    },
	
	onDestroy(){
		Global.NotifyPopup = null;
	},

    // update (dt) {},
});
