cc.Class({
    extends: cc.Component,
    ctor() {
        this.dataRank = [];
        this.page = 0;
        this.slotControler = null;
    },

    properties: {
        listItemRankSlot : [require("ItemRankSlot")],
        btnNext : cc.Node,
        btnBack : cc.Node,
        lbPage : cc.Label,
        nodeInfoTurn : cc.Node,
        lbTime : cc.Label, 
        lbName : cc.Label,
        lbSpinId : cc.Label,
        lbJackpot : cc.Label,
        listItem : [cc.Node], 
    },

    Show(slotControler){
        this.Clear();
        this.node.active = true;
        this.slotControler = slotControler;
        this.page = 0;
        //call link
        var self = this;
        //showloading
        ApiController.RequestGetHistoryJackpot( 33, (data) => {
            //hideloading
            self.HandlelHistoryRank(data);
        }, this.ErrorCallBack);
    },

    onClickClose() {
        this.node.active = false;
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
            this.SetImageItem(id, this.listItem[i],true);
        }
    },

    SetImageItem(id, itemView, loop = false) {
        if(this.slotControler.slotUI.CheckIconSpineById(id)){
            let anim = this.slotControler.slotUI.GetNameSpinById(id)
            itemView.getComponent(this.slotControler.slotUI.nameClassItem).SetImageSpine(id, this.slotControler.slotUI.itemSpineData[id-1], anim, loop);  
        }
        else
            itemView.getComponent(this.slotControler.slotUI.nameClassItem).SetImageImg(id, this.slotControler.slotUI.itemImgData[id-1]);  
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

    GetNameSpinById(id){
        let animationName = '';
        switch(id){
            case 6:
                animationName = "voi9";
                break;
            case 7:
                animationName = "Ngua9";
                break;
            case 8:
                animationName = "Ga9";
                break;
            default:
                animationName = "animation";
                break;
        }
        return animationName;
    },
    CheckIconSpineById(id){
        let useSpine = false;
        switch(id){
            case 1:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                useSpine = true
                break;
        }
        return useSpine;
    },
});
