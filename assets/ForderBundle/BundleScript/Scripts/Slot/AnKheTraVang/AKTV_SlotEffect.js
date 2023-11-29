cc.Class({
    extends:  require('SlotEffect'),
    ctor(){
        this.BonusGame = null;
        this.EffectFree = null;
        this.EffectBigWin = null;
        this.countdownTime = 0; //s
        this.countdownInterval = 1;  //s
        this.onCountdownEndCallback = null;
        this.callbackFree = null;
        this.callbackEfffect = null;
        this.cacheValueEfffect = 0;
        this.nameClassFree = "AKTV_SelectFree";
        this.nameClassBonus = "AKTV_BonusGame";
    },

    properties: {
    },
    
    
    Show(){
        cc.log("show SlotEffect")
    },

    Hide(){

    },

    Clear(){
        //clear effect bigwin, jackpot, bonus, free
        if(this.EffectFree)
            this.EffectFree.active = false;
        if(this.BonusGame)
            this.BonusGame.active = false;
    },

    /* FREE */
    ShowEffectSelectFree(){
        cc.log("ShowEffectSelectFree");
        if(this.EffectFree == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectStartFree", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectFree = effect.getComponent(this.nameClassFree);
                seft.EffectFree.node.active = true;
                seft.EffectFree.Show(seft.slotController);
            });  
        }else{
            this.EffectFree.node.active = true;
            this.EffectFree.Show(this.slotController);
        }
    },
    //đang chơi dở vào lại, thì show chim bay luôn rồi show Ui, chứ k show chọn nữa
    HandleInputFreeGame(callBack){

        if(this.EffectFree == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectStartFree", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectFree = effect.getComponent(this.nameClassFree);
                seft.EffectFree.node.active = true;
                seft.EffectFree.HandleResponseSelectRoomFree(callBack);
            });  
        }else{
            this.EffectFree.node.active = true;
            this.EffectFree.HandleResponseSelectRoomFree(callBack);
        }
    },
    /* ---------------- */

    /* BONUS */
    ShowBonusGame(listBonus, winBonusValue, callback){
        cc.log("ShowBonusGame "+winBonusValue);
        if(this.BonusGame == null){
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"PopupBonus", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.BonusGame = effect;
                seft.BonusGame.active = true;
                seft.BonusGame.getComponent(this.nameClassBonus).ShowBonusGame(listBonus, winBonusValue, callback, this.slotController.GetBetValue());
            });  
        }else{
            this.BonusGame.active = true;
            this.BonusGame.getComponent(this.nameClassBonus).ShowBonusGame(listBonus, winBonusValue, callback, this.slotController.GetBetValue());
        }
    },
    /* ---------------- */

    /* EFFECT */
    ShowBigWin(winValue, type, callback){
        cc.log("ShowBigWin "+winValue);
        this.callbackEfffect = callback;
        this.cacheValueEfffect = winValue;
        if(this.EffectBigWin == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectBigWin", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectBigWin = effect;
                seft.WaitBigWin(type, winValue);
            });  
        }else{
            this.WaitBigWin(type, winValue);
        }
    },
    
    WaitBigWin(type, winValue){
        var nameAnim = "AnimBigWin";
        if(type ==  2){
            nameAnim = "AnimSuperWin";
        }else if(type ==  3){
            nameAnim = "AnimMegaWin";
        }
        this.EffectBigWin.active = true;
        let anim = this.EffectBigWin.getComponent(cc.Animation);
        let callBack = ()=>{
            anim.off("finished" , callBack);
            this.callbackEfffect();
            this.EffectBigWin.active = false;
        }
        anim.on("finished" ,callBack );
        anim.play(nameAnim);
        this.EffectBigWin.getChildByName("lblCash").getComponent("LbMonneyChange").reset();
        this.EffectBigWin.getChildByName("lblCash").getComponent("LbMonneyChange").setMoney(winValue);
    },
    /* ---------------- */

    Init_CountDown(countdownTime,countdownInterval,onCountdownEndCallback)
    {
        this.unscheduleAllCallbacks(); // Dừng tất cả các lịch trình
        this.countdownTime = countdownTime;
        this.countdownInterval = countdownInterval;
        this.onCountdownEndCallback = onCountdownEndCallback;
        this.schedule(() => {
            if (this.countdownTime > 0) {
                this.countdownTime--;
            } else {
                this.unscheduleAllCallbacks(); // Dừng tất cả các lịch trình
                this.node.emit("countdown_end"); // Kích hoạt sự kiện khi hết thời gian
                this.onCountdownEnd(); // Gọi hàm onCountdownEnd
            }
        }, this.countdownInterval);
    },

    CancelCountDown()
    {
        this.countdownLabel.node.active = false;  
        this.unscheduleAllCallbacks(); // Dừng tất cả các lịch trình
    },    
    onCountdownEnd() {
        // Xử lý khi hết thời gian
        console.log("Countdown Ended");
    
        // Kiểm tra xem có hàm được truyền vào không
        if (typeof this.onCountdownEndCallback === "function") {
            // Gọi hàm được truyền vào để xử lý sự kiện khi kết thúc đếm ngược
            this.onCountdownEndCallback();
        }    
    },
    onDestroy() {
        // Hủy đăng ký sự kiện khi đối tượng bị hủy
        this.node.off("custom_event_in_onCountdownEnd", this.onCustomEventInCountdownEnd, this);
    },
});
