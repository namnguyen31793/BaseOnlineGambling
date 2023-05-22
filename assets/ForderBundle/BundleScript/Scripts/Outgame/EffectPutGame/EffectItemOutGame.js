var TIME_SHOW_NOTIFY = 2.5;
var TIME_SHOW_WIN = 2;
cc.Class({
    extends: cc.Component,
    ctor(){
        this.toDoList = null;
        this.listDataTopWin = [];
    },

    properties: {
        lbTotalSpin : require("LbMonneyChange"),
        nodeTakeBigWin : cc.Node,
        nodeTakeJackpot : cc.Node,
        nodeStartJackpot : cc.Node,
        nodeNoteGame : cc.Node,
        bgMark : cc.Node,
        typeGame :{
            default : 0,
            type : cc.Integer
        }
    },

    onLoad() {
        this.dataShow = {
            timeShow : 0,
            data : null,
            type : Global.Enum.TYPE_NOTIFY.NOTE_GAME,
        };
        this.toDoList = this.node.addComponent("ToDoList");
        this.toDoList.CreateList();
        this.toDoList.Wait(0.8);
        this.toDoList.AddWork(()=>{
            this.CheckShowEffect();
        },true);
        this.toDoList.PlayRepeat();
    },
    
    UpdateTotalSpin(value) {
        this.lbTotalSpin.setMoney(value, true, false);
    },

    Setup(listData, typeNotify){
        //big win
        if(typeNotify == Global.Enum.TYPE_NOTIFY.TAKE_VALUE){
            this.listDataTopWin = listData;
        }
    },

    CheckShowEffect(){
        this.Reset();
        //luot truoc show notify thi doi sang show cai khac
        if(this.dataShow.type != Global.Enum.TYPE_NOTIFY.NOTE_GAME){
            let random = Global.RandomNumber(0, 100);
            if(random < 50){
                if(this.listDataTopWin.length > 0){
                    let data = this.listDataTopWin[this.listDataTopWin.length-1];
                    this.dataShow = {
                        timeShow : TIME_SHOW_WIN,
                        data : data,
                        type : Global.Enum.TYPE_NOTIFY.TAKE_VALUE,
                    };
                    //xoa dan tu cuoi len
                    this.listDataTopWin.splice(this.listDataTopWin.length-1,1);
                }
                //truong hop khong co thong bao nao
                else{
                    //this.toDoList.DoWork();
                    this.dataShow = {
                        timeShow : TIME_SHOW_NOTIFY,
                        data : null,
                        type : Global.Enum.TYPE_NOTIFY.NOTE_GAME,
                    };
                }
            }else{
                this.dataShow = {
                    timeShow : TIME_SHOW_NOTIFY,
                    data : null,
                    type : Global.Enum.TYPE_NOTIFY.NOTE_GAME,
                };
            }
        }else{
            if(this.listDataTopWin.length > 0){
                let data = this.listDataTopWin[this.listDataTopWin.length-1];
                this.dataShow = {
                    timeShow : TIME_SHOW_WIN,
                    data : data,
                    type : Global.Enum.TYPE_NOTIFY.TAKE_VALUE,
                };
                //xoa dan tu cuoi len
                this.listDataTopWin.splice(this.listDataTopWin.length-1,1);
            }
            else{
                this.dataShow = {
                    timeShow : TIME_SHOW_NOTIFY,
                    data : null,
                    type : Global.Enum.TYPE_NOTIFY.NOTE_GAME,
                };
            }
        }

        this.PlayAnimTopWin(this.dataShow);
    },

    PlayAnimTopWin(dataShow){
        this.bgMark.active = true;
        let data = dataShow.data;
        if(dataShow.type == Global.Enum.TYPE_NOTIFY.NOTE_GAME){
            if(this.nodeNoteGame == null)
                return;
            this.nodeNoteGame.active = true;
            this.SwithEffect(this.nodeNoteGame, dataShow.timeShow);
        } else{
            if(data.SpinType == Global.Enum.REWARD_SPIN_TYPE.JACKPOT_TURN){
                if(this.nodeTakeJackpot == null)
                    return;
                this.nodeTakeJackpot.active = true;
                this.nodeTakeJackpot.getChildByName("Money").getComponent(cc.Label).string =  Global.Helper.formatNumber(data.RewardBalance);
                this.nodeTakeJackpot.getChildByName("NickName").getComponent(cc.Label).string =  data.Nickname;
        
                this.SwithEffect(this.nodeTakeJackpot, dataShow.timeShow);
            } else{
                if(this.nodeTakeBigWin == null)
                    return;
                this.nodeTakeBigWin.active = true;
                let avata = this.nodeTakeBigWin.getChildByName("MaskAvata").getChildByName("Avata").getComponent(cc.Sprite);
                Global.Helper.GetAvataOtherById(avata, data.AccountId);
                this.nodeTakeBigWin.getChildByName("Money").getComponent(cc.Label).string =  Global.Helper.formatNumber(data.RewardBalance);
                this.nodeTakeBigWin.getChildByName("NickName").getComponent(cc.Label).string =  data.Nickname;
            
                this.SwithEffect(this.nodeTakeBigWin, dataShow.timeShow);
            }
            //call add value cho top player
            Global.LobbyView.topPlayerControl.AddListWinData(data);
        }
    },

    Reset(){
        if(this.nodeTakeBigWin)
            this.nodeTakeBigWin.active = false;
        if(this.nodeTakeJackpot)
            this.nodeTakeJackpot.active = false;
        if(this.nodeStartJackpot)
            this.nodeStartJackpot.active = false;
        if(this.nodeNoteGame)
            this.nodeNoteGame.active = false;
    },

    SwithEffect(nodeAnim, timeWait){
        let timeShow = Global.RandomNumber(3,5)*0.1;
        let timeShow2 = 0.1;
        let intType = Global.RandomNumber(0,3);

        if(intType == 0){
            this.PlayEffectScale(nodeAnim, timeShow, timeShow2, timeWait);
        }else {
            this.PlayEffectBlur(nodeAnim, timeShow, timeShow2, timeWait);
        }
    },

    PlayEffectScale(nodeAnim, timeShow, timeShow2, timeWait){
        nodeAnim.scale = 0;
        nodeAnim.opacity = 255;

        let acShow = cc.callFunc(() => {
            nodeAnim.runAction(cc.scaleTo(timeShow, 1.2).easing(cc.easeSineOut()));      
        });
        let acShow2 = cc.callFunc(() => {
            nodeAnim.runAction(cc.scaleTo(timeShow2, 0.9).easing(cc.easeSineOut()));      
        });
        let acShow3 = cc.callFunc(() => {
            nodeAnim.runAction(cc.scaleTo(timeShow2/2, 1).easing(cc.easeSineOut()));      
        });
        let acShow4 = cc.callFunc(() => {
            nodeAnim.runAction(cc.fadeTo(timeShow2, 0).easing(cc.easeSineOut()));   
            this.bgMark.active = false;    
            this.toDoList.DoWork();
        });
        nodeAnim.runAction(cc.sequence(acShow, cc.delayTime(timeShow), acShow2, cc.delayTime(timeShow2), acShow3, cc.delayTime(timeWait), acShow4));

    },

    PlayEffectBlur(nodeAnim, timeShow, timeShow2, timeWait){
        nodeAnim.scale = 1;
        nodeAnim.opacity = 0;

        let acShow = cc.callFunc(() => {
            nodeAnim.runAction(cc.fadeTo(timeShow*2, 255).easing(cc.easeSineOut()));      
        });
        let acShow4 = cc.callFunc(() => {
            nodeAnim.runAction(cc.fadeTo(timeShow2, 0).easing(cc.easeSineOut()));   
            this.bgMark.active = false    
            this.toDoList.DoWork();
        });
        nodeAnim.runAction(cc.sequence(acShow, cc.delayTime(timeWait+timeShow*2), acShow4));
    },

});


