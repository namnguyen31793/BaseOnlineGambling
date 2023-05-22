

cc.Class({
    extends: cc.Component,
    ctor() {
        this.isPlayEffect = false;
    },

    properties: {
        imgAva : [cc.Sprite],
        lbName : [cc.Label],
        lbPoint : [require("TextJackpot")],
        lbWin : [require("TextJackpot")],
        anim : cc.Animation,
    },

    onClickClose(){
        if(!this.isPlayEffect) {
            this.anim.play("HidePopup");
            this.scheduleOnce(()=>{
                this.node.active = false;
                Global.UIManager.hideMark();
            } , 0.2);
        }
		
	},

    show(data){
        this.isPlayEffect = true;
		Global.UIManager.hideMiniLoading();
        if(Global.SlotNetWork.slotView.isAuto) {
            Global.SlotNetWork.slotView.menuView.toggleAuto.isChecked = false;
            Global.SlotNetWork.slotView.isAuto = false;
        }
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
        for(let i = 0; i < data.length; i++) {
            this.lbName[i].string = data[i].Nickname;
            this.lbPoint[i].StartIncreaseTo(data[i].Score);
            this.lbWin[i].StartIncreaseTo(data[i].RewardMoney);
            Global.Helper.GetAvataOther(this.imgAva[i], data[i].Nickname);
        }
        this.anim.play();
        this.scheduleOnce(()=>{
			require("SendRequest").getIns().MST_Client_Event_Tournament_Get_Account_Reward();
            this.isPlayEffect = false;
		} , 2);  
        
	},

    onDestroy(){
		Global.TournamentPopup = null;
	},
});
