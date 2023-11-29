
cc.Class({
    extends: cc.Component,
    ctor(){
        this.START_POS_PHOENIX = cc.v2(1500, -350);
        this.END_POS_PHOENIX = cc.v2(-50, 50);
        this.MID_POS_PHOENIX = cc.v2(100, 150);
        this.isSend = false;
        this.slotController = null;
    },

    properties: {
        nodeSelect : cc.Node,
        listButton : [cc.Button],
        nodeAnim : cc.Node,
        animPhoenix : cc.Node,
    },

    Reset(){
        for(let i = 0; i < this.listButton.length; i++){
            this.listButton.interactable = true;
        }
    },

    Show(slotController){
        cc.log("ShowEffectSelectFree 2");
        this.slotController = slotController;
        this.nodeSelect.active = true;
        this.nodeAnim.active = false;
        
        for(let i = 0; i < this.listButton.length; i++){
            this.listButton.interactable = true;
        }
        this.isSend = false;
    },

    ClickSelectRooomFree(event, index){
        // for(let i = 0; i < this.listButton.length; i++){
        //     this.listButton.interactable = false;
        // }
        // if(this.isSend)
        //     return;
        this.isSend = true;
        this.listButton[index - 1].interactable = true;
        this.slotController.CallSelectRooomFree(index);
        this.animPhoenix.getComponent(sp.Skeleton).defaultSkin = "S"+index;
        this.animPhoenix.getComponent(sp.Skeleton).setSkin("S"+index);
    },

    HandleResponseSelectRoomFree(callback){
        cc.log("HandleResponseSelectRoomFree")
        this.nodeSelect.active = false;
        this.nodeAnim.active = true;
        this.animPhoenix.scale = 1;
        this.animPhoenix.setPosition(this.START_POS_PHOENIX);
        cc.tween(this.animPhoenix)
            .to(1, { position: this.MID_POS_PHOENIX }) // Di chuyển tới giữa trong 1 giây
            .call(() => {
                // Bắt đầu scale từ 1 về 0 khi đến giữa
                cc.tween(this.animPhoenix)
                    .to(1.5, { scale: 0 }) // Scale từ 1 về 0 trong 1 giây
                    .delay(0.5)
                    .call(() => {
                        // Gọi callback khi scale xong
                        callback();
                        this.Hide();
                    })
                    .start();
            })
            .to(1.5, { position: this.END_POS_PHOENIX }) // Di chuyển từ giữa đến B trong 1 giây
            .start();
    },

    Hide(){
        this.scheduleOnce(()=>{
            this.node.active = false;
        } , 0.5)
    },
});
