cc.Class({
    extends:  require('SlotEffect'),
    ctor(){
        this.EffectBonus = null;
        this.BonusGame = null;
        this.EffectFree = null;
        this.EffectBigWin = null;
        this.EffectJackpot = null;
        this.countdownTime = 0; //s
        this.countdownInterval = 1;  //s
        this.onCountdownEndCallback = null;
        this.callbackBonus = null;
        this.callbackFree = null;
        this.callbackEfffect = null;
        this.cacheValueEfffect = 0;
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
        if(this.EffectBonus)
            this.EffectBonus.active = false;
        if(this.BonusGame)
            this.BonusGame.active = false;
    },

    /* FREE */
    ShowEffectStartFree(numberFree, callback){
        cc.log("ShowEffectStartFree");
        this.callbackFree = callback;
        if(this.EffectFree == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectFree", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectFree = effect;
                let spineObj = seft.EffectFree.getChildByName("Spine");
                let notifyObj = seft.EffectFree.getChildByName("Effect");
                spineObj.getComponent(sp.Skeleton).setCompleteListener((trackEntry) => {
                    if (trackEntry.animation.name === 'animation') {
                        seft.WaitEndFree();
                     }
                });
                seft.EffectFree.active = true;
                spineObj.active = false;
                notifyObj.active = true;
                spineObj.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
                notifyObj.getChildByName("txt").getComponent(cc.Label).string =  numberFree.toString()+" lượt chơi miễn phí";
                seft.scheduleOnce(()=>{
                    spineObj.active = true;
                    spineObj.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
                } , 1);
            });  
        }else{
            let spineObj = this.EffectFree.getChildByName("Spine");
            let notifyObj = this.EffectFree.getChildByName("Effect");
            this.EffectFree.active = true;
            notifyObj.active = true;
            spineObj.active = false;
            notifyObj.getChildByName("txt").getComponent(cc.Label).string =  numberFree.toString()+" lượt chơi miễn phí";
            this.scheduleOnce(()=>{
                spineObj.active = true;
                notifyObj.active = false;
                spineObj.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
            } , 1);
        }
    },

    ShowEffectEndFree(totalWinFree, callback){
        cc.log("ShowEffectEndFree");
        this.callbackFree = callback;
        if(this.EffectFree == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectFree", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectFree = effect;
                let spineObj = seft.EffectFree.getChildByName("Spine");
                let notifyObj = seft.EffectFree.getChildByName("Effect");
                spineObj.getComponent(sp.Skeleton).setCompleteListener((trackEntry) => {
                    if (trackEntry.animation.name === 'animation') {
                        seft.WaitEndFree();
                     }
                });
                seft.EffectFree.active = true;
                spineObj.active = false;
                notifyObj.active = true;
                notifyObj.getChildByName("txt").getComponent(cc.Label).string = "Bạn đã thắng "+ Global.Helper.formatNumber(parseInt(totalWinFree));
                seft.scheduleOnce(()=>{
                    spineObj.active = true;
                    notifyObj.active = false;
                    spineObj.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
                } , 1.5);
                
            });  
        }else{
            let spineObj = this.EffectFree.getChildByName("Spine");
            let notifyObj = this.EffectFree.getChildByName("Effect");
            this.EffectFree.active = true;
            spineObj.active = false;
            notifyObj.active = true;
            notifyObj.getChildByName("txt").getComponent(cc.Label).string = "Bạn đã thắng "+Global.Helper.formatNumber(parseInt(totalWinFree));
            spineObj.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
            this.scheduleOnce(()=>{
                spineObj.active = true;
                notifyObj.active = false;
                spineObj.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
            } , 1.5);
        }
    },

    WaitEndFree(){
        this.EffectFree.active = false;
        //show xong effect call callback
        this.callbackFree();
        this.callbackFree = null;
    },
    /* ---------------- */

    /* BONUS */
    ShowEffectStartBonus(callback){
        cc.log("ShowEffectStartBonus");
        this.callbackBonus = callback;
        if(this.EffectBonus == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectBonus", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                effect.setSiblingIndex(0);
                seft.EffectBonus = effect;
                //effect kéo dài biến mất, nếu đợi end anim sẽ cảm giác lỗi
                // seft.EffectBonus.getComponent(sp.Skeleton).setCompleteListener((trackEntry) => {
                //     if (trackEntry.animation.name === 'ThongBao') {
                //         seft.WaitEndStartBonus();
                //      }
                // });
                seft.EffectBonus.active = true;
                seft.EffectBonus.getComponent(sp.Skeleton).setAnimation(0,'ThongBao',false);
                seft.scheduleOnce(()=>{
                    seft.WaitEndStartBonus();
                } , 0.5);
            });  
        }else{
            this.EffectBonus.active = true;
            this.EffectBonus.getComponent(sp.Skeleton).setAnimation(0,'ThongBao',false);
            this.scheduleOnce(()=>{
                this.WaitEndStartBonus();
            } , 0.5);
        }
    },

    WaitEndStartBonus(){
        cc.log("WaitEndStartBonus ");
        this.EffectBonus.active = false;
        //show xong effect call callback
        this.callbackBonus();
        this.callbackBonus = null;
    },

    ShowBonusGame(listBonus, winBonusValue, callback){
        cc.log("ShowBonusGame "+winBonusValue);
        if(this.BonusGame == null){
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"PopupBonus", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.BonusGame = effect;
                seft.BonusGame.active = true;
                seft.BonusGame.getComponent("Sttt_BonusGame").ShowBonusGame(listBonus, winBonusValue, callback, this.slotController.GetBetValue());
            });  
        }else{
            this.BonusGame.active = true;
            this.BonusGame.getComponent("Sttt_BonusGame").ShowBonusGame(listBonus, winBonusValue, callback, this.slotController.GetBetValue());
        }
    },
    /* ---------------- */

    /* EFFECT */
    ShowBigWin(winValue, callback){
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
                seft.EffectBigWin.getChildByName("thanglon_eff").getComponent(sp.Skeleton).setCompleteListener((trackEntry) => {
                    if (trackEntry.animation.name === 'Start') {
                        seft.WaitBigWin();
                     }
                });
                seft.EffectBigWin.active = true;
                seft.EffectBigWin.getChildByName("thanglon_eff").getComponent(sp.Skeleton).setAnimation(0,'Start',false);
                seft.EffectBigWin.getChildByName("lblCash").getComponent("LbMonneyChange").reset();
                seft.EffectBigWin.getChildByName("lblCash").getComponent(cc.Label).string = "";
            });  
        }else{
            this.EffectBigWin.active = true;
            this.EffectBigWin.getChildByName("thanglon_eff").getComponent(sp.Skeleton).setAnimation(0,'Start',false);
            this.EffectBigWin.getChildByName("lblCash").getComponent("LbMonneyChange").reset();
            this.EffectBigWin.getChildByName("lblCash").getComponent(cc.Label).string = "";
        }
    },
    
    WaitBigWin(){
        this.EffectBigWin.getChildByName("thanglon_eff").getComponent(sp.Skeleton).setAnimation(0,'Loop', true);
        this.EffectBigWin.getChildByName("lblCash").getComponent("LbMonneyChange").setMoney(this.cacheValueEfffect);
        //chạy 2s effect xon
        this.scheduleOnce(()=>{
            this.EffectBigWin.active = false;
            this.callbackEfffect();
        } , 2);
    },

    ShowJackpot(winValue, callback){
        cc.log("ShowJackpot "+winValue);
        //show xong effect call callback
        this.callbackEfffect = callback;
        this.cacheValueEfffect = winValue;
        if(this.EffectJackpot == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectJackpot", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectJackpot = effect;
                seft.EffectJackpot.getChildByName("nohu_eff").getComponent(sp.Skeleton).setCompleteListener((trackEntry) => {
                    if (trackEntry.animation.name === 'start') {
                        seft.WaitJackpot();
                     }
                });
                seft.EffectJackpot.active = true;
                seft.EffectJackpot.getChildByName("nohu_eff").getComponent(sp.Skeleton).setAnimation(0,'start',false);
                seft.EffectJackpot.getChildByName("lblCash").getComponent("LbMonneyChange").reset();
                seft.EffectJackpot.getChildByName("lblCash").getComponent(cc.Label).string = "";
            });  
        }else{
            this.EffectJackpot.active = true;
            this.EffectJackpot.getChildByName("nohu_eff").getComponent(sp.Skeleton).setAnimation(0,'start',false);
            this.EffectJackpot.getChildByName("lblCash").getComponent("LbMonneyChange").reset();
            this.EffectJackpot.getChildByName("lblCash").getComponent(cc.Label).string = "";
        }
    },

    WaitJackpot(){
        this.EffectJackpot.getChildByName("nohu_eff").getComponent(sp.Skeleton).setAnimation(0,'loop', true);
        this.EffectJackpot.getChildByName("lblCash").getComponent("LbMonneyChange").setMoney(this.cacheValueEfffect);
        //chạy 2s effect xon
        this.scheduleOnce(()=>{
            this.EffectJackpot.active = false;
            this.callbackEfffect();
        } , 3);
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
