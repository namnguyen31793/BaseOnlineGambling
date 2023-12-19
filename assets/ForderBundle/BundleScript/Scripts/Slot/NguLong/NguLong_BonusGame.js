cc.Class({
    extends: cc.Component,

    ctor() {
        this.TOTAL_ITEM = 12;
        this.listEffect = [];
        this.cacheBonusTurn = 0;
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.bonusValue = 0;
        this.cachebonusValue = 0;
        this.bet = 0;
        this.waitEnd = false;
        this.callbackBonus = null;
        this.nameClassItem = "AKTV_BonusItem";
        this.listBtn = [];
        this.cacheIdWin = 0;
    },

    properties: {
        nodeButtonGame : cc.Node,
        imgButton: [cc.SpriteFrame],//0-none
        animnodeButtonGame : cc.Animation,
        parentListItem : cc.Node,
        nodeEffectEnd : cc.Node,
        EffectEndSprite : sp.Skeleton,
        lbReward : require("LbMonneyChange"),
        imgTitleJackpot: [cc.SpriteFrame],//0-none
        spriteTitleJackpot: cc.Sprite,
    },

    onLoad() {
        for(let i = 0; i < this.TOTAL_ITEM; i++)
        {
            this.listBtn[i] = cc.find("item"+(i+1).toString(), this.parentListItem).getComponent(this.nameClassItem);
            this.listBtn[i].Init();
        }
        this.EffectEndSprite.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'bay len') {
                this.EffectEndSprite.setAnimation(0,'tung canh',true);
             }
        });
    },

    ShowBonusGame(listBonus, bonusValue, callback, bet) {
        this.ResetUI();
        this.nodeButtonGame.active = true;
        this.nodeEffectEnd.active = false;
        //play anim show list button
        this.scheduleOnce(()=>{
            this.animnodeButtonGame.play("ShowBonus");
        } , 0.25)
        this.callbackBonus = callback;

        this.listBonus = listBonus;
        this.indexBonus = 0;
        this.time = 20;
        this.isCountTime = true;
        this.bonusValue = bonusValue;
        this.waitEnd = true;
        this.node.active = true;
        this.cacheIdWin = this.GetIdJackpot(listBonus);
        cc.log("Bonus "+this.cacheIdWin);
        this.spriteTitleJackpot.spriteFrame = this.imgTitleJackpot[this.cacheIdWin - 1];

    },
    
    GetIdJackpot(arr) {
        const dem = {};
        // Đếm số lần xuất hiện của từng phần tử
        for (let i = 0; i < arr.length; i++) {
            const phanTu = arr[i];
            dem[phanTu] = (dem[phanTu] || 0) + 1;
    
            // Kiểm tra số lần xuất hiện, trả về phần tử đầu tiên xuất hiện 3 lần
            if (dem[phanTu] === 3) {
                return phanTu;
            }
        }
        return 1; // Trả về 1 nếu không có số nào xuất hiện ba lần
    },
    
    ClickValueBonus(event, index){
        if(this.indexBonus == this.listBonus.length)
            return;
        // this.isCountTime = false;
        this.time = 20;
        //show win by index 
        cc.log(this.listBonus[this.indexBonus]);
        //show effect
        let id = parseInt(this.listBonus[this.indexBonus]);
        cc.log("ClickValueBonus "+id)
        this.listBtn[index].ShowEffect(this.imgButton[id], id);

        //index ++
        this.indexBonus++;
        //this.lbTurn.string = ( this.listBonus.length-this.indexBonus).toString();
        if(this.indexBonus == this.listBonus.length){
            this.scheduleOnce(()=>{
                this.ShowEffectEndItem();
            } , 1.5);
        }
    },

    ShowEffectEndItem(){
        for(let i = 0; i < this.listBtn.length; i++){
            this.listBtn[i].ShowEnd(this.cacheIdWin);
        }
        this.scheduleOnce(()=>{
            let callBack = ()=>{
                this.animnodeButtonGame.off("finished" , callBack);
                this.ShowRewardBonus();
           }
           this.animnodeButtonGame.on("finished" ,callBack );
           this.animnodeButtonGame.play("EndBonus");
        } , 0.5);
    },

    update (dt) {
        if(this.isCountTime ){
            this.time -= dt;
            this.UpdateLbTime();
        }
    },

    UpdateLbTime(){
        if(this.time < 0){
            this.time = 0;
            this.isCountTime = false;
            this.ShowRewardBonus();
        }
    },

    ShowRewardBonus(){
        this.nodeButtonGame.active = false;
        this.nodeEffectEnd.active = true;
        this.EffectEndSprite.setAnimation(0,'bay len',false);

        this.scheduleOnce(()=>{
            this.EndBonus(this.bonusValue)
        } , 2);
    },

    EndBonus(bonusValue) {
        cc.log("end Bonus "+bonusValue)
        this.lbReward.setMoney(bonusValue);
        //show wim all bonus
        if(!this.waitEnd )
            return;
        this.waitEnd = false;
        this.scheduleOnce(()=>{
            //show result 
            this.callbackBonus();
            this.Hide();
        } , 2.5);
    },

    Hide(){
        this.ResetUI();
        this.waitEnd = false;
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.bonusValue = 0;
        //this.lbBet.string = "";
        //this.lbTurn.string = "";
        this.node.active = false;
        this.nodeButtonGame.active = false;
        this.nodeEffectEnd.active = false;
    },

    ResetUI(){
        this.lbReward.reset();
        for(let i = 0; i < this.listBtn.length; i++){
            this.listBtn[i].Reset(this.imgButton[0]);
        }
    },
});
