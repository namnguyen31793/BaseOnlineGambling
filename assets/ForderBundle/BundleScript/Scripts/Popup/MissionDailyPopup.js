cc.Class({
    extends: cc.Component,
    ctor() {
        this.useKeyPass = false;
    },

    properties: {
        
        lbProgress : cc.Label,
        imgProgress : cc.Sprite,
        listLbRewardNor : [cc.Label],
        listLbRewardAds : [cc.Label],
        lbIndex : [cc.Label],
        listTick : [cc.Node],
        lbBigReward : cc.Label,
        listStar : [cc.Node],
        listMineStone : [cc.Toggle],
        btnRewardNor : cc.Button,
        btnRewardAds : cc.Button,
        btnRewardAdsGray : cc.Node,
        listSkeBtnAds : [sp.Skeleton],
        skeBigReward : sp.Skeleton,
        skeBtnGetRewardAds : sp.Skeleton,
    },

    show(gameId, listReward) {
        cc.log("show mission daily popup");
        Global.UIManager.hideMiniLoading();
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        let listMission = [];
        for(let i = 0; i < Global.listMissionDaily.length; i++) {
            if(Global.listMissionDaily[i].GameId == gameId) {
                listMission[listMission.length] = Global.listMissionDaily[i];
            }
        }
        for(let i = 0; i < listMission.length; i++) {
            if(listMission[i].MissionId != 0) {
                this.listLbRewardNor[listMission[i].MissionId-1].string = Global.Helper.formatNumberLong(listMission[i].MissionReward);
                this.listLbRewardAds[listMission[i].MissionId-1].string = Global.Helper.formatNumberLong(listMission[i].KeyPassMissionReward);
            } else {
                this.lbBigReward.string = Global.Helper.formatNumberLong(listMission[i].MissionReward);
            }
        }
        if(listReward != null) {
            let indexMission = 3;
            this.lbProgress.string = "3/3";
            this.imgProgress.fillRange = 1;
            this.btnRewardAdsGray.active = false;
            this.btnRewardNor.interactable = true;
            for(let i = 0; i < this.listSkeBtnAds.length; i++) {
                this.listSkeBtnAds[i].setAnimation(0, 'waiting', true);
            }
            for(let i = 0; i < indexMission; i++) {
                this.listMineStone[i].isChecked = true;
                this.listTick[i].active = true;
                this.listStar[i].active = true;
                this.lbIndex[i].node.active = false;
            }
            this.skeBigReward.setAnimation(0, 'active', true);
            this.dailyMissionId = 0;
        } else {
            if(Global.MissionDaily && Global.MissionDaily.node.active) {
                let indexMission = Global.MissionDaily.cacheInfoMission.CurrentMissionId;
                this.dailyMissionId = Global.MissionDaily.cacheInfoMission.CurrentMissionId;
                if(Global.MissionDaily.cacheState != 1)
                    indexMission -= 1;
                this.lbProgress.string = indexMission+"/3";
                
                if(indexMission == 1) {
                    this.imgProgress.fillRange = 0.2;
                } else if(indexMission == 2) {
                    this.imgProgress.fillRange = 0.5;
                } else if(indexMission == 3) {
                    this.imgProgress.fillRange = 0.8;
                } else if(indexMission == 0) {
                    
                    this.imgProgress.fillRange = 0;
                }
                if(indexMission == 0 || Global.MissionDaily.cacheState != 1) {
                    this.btnRewardAdsGray.active = true;
                    this.btnRewardNor.interactable = false;
                } else {
                    this.btnRewardAdsGray.active = false;
                    this.btnRewardNor.interactable = true;
                }
                for(let i = 0; i < this.listSkeBtnAds.length; i++) {
                    this.listSkeBtnAds[i].setAnimation(0, 'waiting', true);
                }
                for(let i = 0; i < indexMission; i++) {
                    this.listMineStone[i].isChecked = true;
                    if(i < indexMission - 1) {
                        this.listTick[i].active = true;
                        this.listStar[i].active = true;
                        this.lbIndex[i].node.active = false;
                    } else {
                        if(Global.MissionDaily.cacheState == 1) {
                            this.listSkeBtnAds[Global.MissionDaily.cacheInfoMission.CurrentMissionId-1].setAnimation(0, 'active', true);
                        } else {
                            this.listTick[i].active = true;
                            this.lbIndex[i].node.active = false;
                        }
                    }
                }
            }
        }
        
    },

    ClickGetRewardNormal() {
        Global.Helper.LogAction("Click get daily reward");
        let data = {};
		data[1] = Global.Enum.MISSION_TYPE.DAILY;
        require("SendRequest").getIns().MST_Client_Event_Mission_Get_List_Reward_Account(data);
        // this.Hide();
        if(Global.MissionDaily)
            Global.MissionDaily.ResetUI();
    },

    ClickGetRewardAds() {
        
    },

    onClickClose(){
		this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
	},

    UpdateStatusReward(list) {
        cc.log(list);
        this.Hide();
        for(let j = 0; j < list.length; j++) {
            if(list[j].MissionId == this.dailyMissionId) {
                if(!this.useKeyPass) {
                    let data = {};
                    data[1] = list[j].Id;
                    require("SendRequest").getIns().MST_Client_Event_Mission_Get_Take_Account_Reward(data);
                } else {
                    this.useKeyPass = false;
                    let data = {};
                    data[1] = list[j].Id;
                    data[2] = list[j].MissionGroupId;
                    data[3] = list[j].MissionId;
                    data[4] = list[j].MissionType;
                    require("SendRequest").getIns().MST_Client_Event_Mission_Using_KeyPass(data);
                }
                break;
            }
        }
    },

    UsingKeyPass(rewardId, rewardMoney) {
        let data = {};
        data[1] = rewardId;
        require("SendRequest").getIns().MST_Client_Event_Mission_Get_Take_Account_Reward(data);
    },

    UpdateBalance(accountBalance, goldReward) {
        let data2 = {
            RewardItemId : 0,
            Amount : goldReward,
        };
        Global.UIManager.showNotifyRewardPopup(0, JSON.stringify(data2), accountBalance);
    },

    Hide() {
		this.node.active = false;
		Global.UIManager.hideMark();
	},

    onLoad() {
        Global.MissionDailyPopup = this;
    },
	
	onDestroy(){
		Global.MissionDailyPopup = null;
	},
});
