// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor() {
        this.dataHistory = [];
        this.page = 0;
    },

    properties: {
        listItemHistorySlot : [require("ItemHistoryView")],
        btnNext : cc.Node,
        btnBack : cc.Node,
        lbPage : cc.Label,
    },

    Show(gameId){
        this.Clear();
        this.node.active = true;
        this.page = 0;
        //call link
        let msg = {};
        msg[1] = this.page+1;
        msg[2] = 50;
        msg[3] = gameId;
        msg[40] = gameId;
        require("SendRequest").getIns().MST_Client_Slot_Get_Game_Detail_History(msg);
        Global.UIManager.showMiniLoading();
    },
    
    responseServer(data){
        Global.UIManager.hideMiniLoading();
        this.SetDateRank(data[1]);

	},
    SetDateRank(data){
        cc.log(data)
        for(let i = 0; i < data.length; i++){
            this.dataHistory[i] = JSON.parse(data[i]);
        }
        cc.log(this.dataRan)
        this.ShowPage(this.page);
    },

    NextPage(){
        this.page += 1;
        this.ShowPage(this.page);
    },

    BackPage(){
        this.page -= 1;
        this.ShowPage(this.page);
    },

    ShowPage(page){
        this.lbPage.string = 'Trang '+(page+1);
        let lengthRow = this.listItemHistorySlot.length;
        //show row
        let isShowNext = true;
        for(let i = 0; i < lengthRow; i++){
            let index = i + page*lengthRow;
            if(index < this.dataHistory.length){
                this.listItemHistorySlot[i].initItem(this.dataHistory[index]);
            }else{
                this.listItemHistorySlot[i].Clear();
            }
            if(index >= (this.dataHistory.length-1)){
                isShowNext = false;
            }
        }
        if(isShowNext){
            this.btnNext.active = true;
        }else{
            this.btnNext.active = false;
        }
        if(this.page <= 0){
            this.btnBack.active = false;
        }else{
            this.btnBack.active = true;
        }
    },

    Clear(){
        this.dataHistory = [];
        for(let i = 0; i < this.listItemHistorySlot.length; i++){
            this.listItemHistorySlot[i].Clear();
        }
        this.lbPage.string = '';
    },

    onClickClose() {
        this.node.active = false;
    },
});
