cc.Class({
    extends: cc.Component,
    ctor() {
        this.index = 0;
        this.listContent = null;
    },

    properties: {
        fishValueText1 : [cc.Label],
        fishValueText2 : [cc.Label],
        fish30Value : [cc.Label],
        fish31Value : [cc.Label],
        fish32Value : [cc.Label],
        listHelpRoom1 : [cc.Node],
        listHelpRoom2 : [cc.Node],
    },

    onClickPage() {
        this.index += 1;
        if(this.index >= this.listContent.length) 
            this.index = 0;
        this.SetInfoPage();
    },

    onPrevePage() {
        this.index -= 1;
        if(this.index < 0)
            this.index = this.listContent.length-1;
        this.SetInfoPage();
    },

    SetInfoPage() {
        for(let i = 0; i < this.listContent.length; i++) {
            if(i == this.index) {
                this.listContent[i].active = true;
            } else {
                this.listContent[i].active = false;
            }
        }
        if(this.index == 0){
            for(let i = 0; i < this.fishValueText1.length; i++){
                this.fishValueText1[i].string = "X" + Global.GameConfig.ListFishConfig [i].FishMultiMax;
            }
        }
        if(this.index == 1){
            for(let i = 0; i < this.fishValueText2.length; i++){
                this.fishValueText2[i].string = "X" + Global.GameConfig.ListFishConfig [i+this.fishValueText1.length].FishMultiMax;
            }
        }
        if(this.index == 5){
            for(let i = 0; i < Global.GameConfig.ListFishConfig.length; i++) {
                let minValue = Global.GameConfig.ListFishConfig[i].FishMultiMin;
                let maxValue = Global.GameConfig.ListFishConfig[i].FishMultiMax;
                if(Global.GameConfig.ListFishConfig[i].FishType == 30) {
                    for(let j = 0; j < this.fish30Value.length; j++) {
                        this.fish30Value[j].string = "X"+minValue + "-X"+maxValue;
                    }
                } else if(Global.GameConfig.ListFishConfig[i].FishType == 31) {
                    for(let j = 0; j < this.fish31Value.length; j++) {
                        this.fish31Value[j].string = "X"+minValue + "-X"+maxValue;
                    }
                } else if(Global.GameConfig.ListFishConfig[i].FishType == 32) {
                    for(let j = 0; j < this.fish32Value.length; j++) {
                        this.fish32Value[j].string = "X"+minValue + "-X"+maxValue;
                    }
                }
            }
        }
    },

    show() {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        if(require("ScreenManager").getIns().roomType == 1) {
            this.listContent = this.listHelpRoom1;
        } else {
            this.listContent = this.listHelpRoom2;
        }
        //this.node.getComponent(cc.Animation).play("ShowBigPopup");
        this.SetInfoPage();
    },

    Hide() {
        //this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
    },

    onDestroy(){
        Global.HelpPopup = null;
    },
    
});
