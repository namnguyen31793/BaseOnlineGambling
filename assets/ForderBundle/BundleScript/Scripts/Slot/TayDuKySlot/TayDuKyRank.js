cc.Class({
    extends: require("SlotRankView"),
    ctor() {
        this.dataRank = [];
        this.page = 0;
    },

    properties: {
        btnNext : cc.Node,
        btnBack : cc.Node,
        lbPage : cc.Label,
        nodeInfoTurn : cc.Node,
        lbTime : cc.Label, 
        lbName : cc.Label,
        lbSpinId : cc.Label,
        lbJackpot : cc.Label,
        listSkeleton : [sp.Skeleton],
    },

    Show(slotView){
        this._super(slotView);
        this.Clear();
        this.page = 0;
        //call link
        var self = this;
        //showloading
        ApiController.RequestGetHistoryJackpot( 33, (data) => {
            //hideloading
            self.HandlelHistoryRank(data);
        }, this.ErrorCallBack);
    },

	HandlelHistoryRank(data){
		//success call LoginSuccess
		if(data == "null" || data == ""){
        }else{
            this.SetDateRank(JSON.parse(data));
        }
	},

    SetDateRank(data){
        this.dataRank = data
        this.ShowPage(this.page);
    },

    ShowPage(page){
        this.lbPage.string = 'Trang '+(page+1);
        let lengthRow = this.listItemRankSlot.length;
        //show row
        let isShowNext = true;
        for(let i = 0; i < lengthRow; i++){
            let index = i + page*lengthRow;
            if(index < this.dataRank.length){
                this.listItemRankSlot[i].initItem(this.dataRank[index], this);
            }else{
                this.listItemRankSlot[i].Clear();
            }
            if(index >= (this.dataRank.length-1)){
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

    NextPage(){
        this.page += 1;
        this.ShowPage(this.page);
    },

    BackPage(){
        this.page -= 1;
        this.ShowPage(this.page);
    },

    Clear(){
        for(let i = 0; i < this.listItemRankSlot.length; i++){
            this.listItemRankSlot[i].Clear();
        }
        this.lbPage.string = '';
        this.lbTime.string = '';
        this.lbName.string = '';
        this.lbSpinId.string = '';
        this.lbJackpot.string = '';
        this.nodeInfoTurn.active = false;
    },

    HideDetailTurn(){
        this.nodeInfoTurn.active = false;
    },
    //showInfoTurn
    ShowDetailTurn(info){
        this.nodeInfoTurn.active = true;
        let date = new Date(info.ActionTime);
        this.lbTime.string = Global.Helper.GetStringFullYear(date);
        this.lbSpinId.string = "#"+date.getTime();;
        this.lbName.string = info.Nickname;
        this.lbJackpot.string = "Nổ Hũ: "+Global.Helper.formatNumber(info.RewardValue);
        //show matrix + line
        this.SetMatrix(info.RewardDecription);
        //this.SetMatrix(info.LineWin);
    },

    SetMatrix(matrix){
        let matrixInfo = this.ParseMatrix(matrix)
        for(let i = 0; i < matrixInfo.length; i++){
            let id = matrixInfo[i];
            let animationName = this.GetNameSpine(id);
            this.listSkeleton[i].skeletonData = this.slotView.itemManager.itemSpineData[id-1];
            this.listSkeleton[i].setAnimation(0, animationName, false);
        }
    },

    ParseMatrix(matrixData) {
        let matrixString = matrixData.split("|")
        let matrixStr = matrixString[0].split(",");
        let matrix = [];
        this.posData = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
        }
        return matrix;
    },

    GetNameSpine(id){
        let animationName = "";
        switch(id){
            case 1:
                animationName = "Jackpot";
                break;
            case 2:
                animationName = "wildmonkey";
                break;
            case 3:
                animationName = "bonus";
                break;
            case 4:
                animationName = "Free";
                break;
            case 5:
                animationName = "vongkimco";
                break;
            case 6:
                animationName = "batgioi";
                break;
            case 7:
                animationName = "satang";
                break;
            case 8:
                animationName = "quadao";
                break;
            case 9:
                animationName = "lotus";
                break;
            case 10:
                animationName = "itemAtayduky";
                break;
            case 11:
                animationName = "itemKtayduky";
                break;
            case 12:
                animationName = "itemQtayduky";
                break;
            case 13:
                animationName = "itemJtayduky";
                break;
            case 14:
                animationName = "item10tayduky";
                break;
        }
        return animationName;
    },
});
