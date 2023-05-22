
cc.Class({
    extends: cc.Component,
    ctor() {
        this.currentGroup = 0;
        this.info = null;
        this.state = 0;
        this.levelCheck = 5;
        this.btnGetReward = null;
        this.idRewardTotal = 0;
        this.isUnlock = false;
    },

    properties: {
        listImgIconGame : [cc.SpriteFrame],
        listTextNumber : [cc.SpriteFrame],
        listIconFunc : [cc.SpriteFrame],
        listBtnGetReward : [cc.Node],
        iconGame : cc.Sprite,
        iconLevel : cc.Sprite,
        iconFunc : [cc.Sprite],
        iconLock : cc.Node,
        showObj : cc.Node,
        listChest : [sp.Skeleton],
        listIcon : [sp.Skeleton],
        listQuest : [require("QuestBeanView")],
        lbIndexQuest : cc.Label,
        lbFinalReward : cc.Label,
        materials : [cc.Material],
        cloud : [cc.Node],
        contentCloudHide : [cc.Node],
        cloudHide : [cc.Node],
        lbLvLock : cc.Label,
        animLock : sp.Skeleton,
        iconQuest : [cc.Node],
        btnPlay : cc.Node,
        contentInfoMission : cc.Node,
        animCage : cc.Animation,
    },

    initItem(info) {
        this.btnPlay.active =  false;
        this.animLock.node.active = true;
        this.isUnlock = false;
        this.animLock.setAnimation(0, 'waiting', true);
        for(let i = 0; i < this.listBtnGetReward.length; i++) {
            this.listBtnGetReward[i].active = false;
        }
        if(info.GameId != null && info.GameId != 0) {
            let dataSaveString = cc.sys.localStorage.getItem(CONFIG.KEY_CURRENT_FLOOR) || "";
            // if(dataSaveString.length > 10 && !Global.BeanStackPopup.isChangeFloor) {
            //     this.animCage.play("EndLockFeatureBean");
            //     this.scheduleOnce(()=>{
            //         Global.BeanStackPopup.ChangeFloor();
            //     } ,1);
            // } else {
                
            // }
            this.animCage.play("DefaultLockFeatureBean");
            this.contentInfoMission.active = true;
            Global.CurrentFloorBean = this;
            this.state = 2;
            // this.iconLock.active = true;
            this.cloud[0].active = true;
            this.cloud[1].active = true;
            this.cloud[2].active = true;
            this.GameId = info.GameId;
            this.info = info;
            this.lbFinalReward.string = Global.Helper.formatNumber(info.config[0].MissionReward)+" +";
            this.iconGame.node.active = true;
            this.iconLevel.node.x = -31;
            this.iconGame.spriteFrame = this.listImgIconGame[info.GameId-19];
            for(let i = 0; i < this.listIcon.length; i++) {
                this.listIcon[i].node.active = false;
            }
            for(let i = 0; i < this.listChest.length; i++) {
                this.listChest[i].setSkin(info.GameId.toString());
                this.listChest[i].setAnimation(0, 'waiting', true);
                this.listChest[i].setMaterial(0,this.materials[1]);
            }
            cc.log("---------"+info.currentMission.length +"    "+info.state+"    "+Global.BeanStackPopup.isChangeFloor);
            if(info.currentMission.length == 0 && info.state > 1 && !Global.BeanStackPopup.isChangeFloor) {
                this.AcceptMission(info.config[1]);
            } else {
                let checkIndex = -1;
                let maxId = -1;
                cc.log(info.currentMission);
                for(let i = 0; i < info.currentMission.length; i++) {
                    if(info.currentMission[i].CurrentMissionId == 0) {
                        this.contentInfoMission.active = false;
                        this.scheduleOnce(()=>{
                            if(dataSaveString.length < 10) {
                                this.OpenChestTotal();
                            } 
                        } ,1);
                    } else {
                        this.listChest[info.currentMission[i].CurrentMissionId-1].setMaterial(0,this.materials[0]);
                        if(info.currentMission[i].IsTakeReward) {
                            if(maxId > info.currentMission[i].CurrentMissionId)
                                maxId = info.currentMission[i].CurrentMissionId;
                            this.listChest[info.currentMission[i].CurrentMissionId-1].setAnimation(0, 'open', false);
                        } else {
                            checkIndex = info.currentMission[i].CurrentMissionId;
                            if(checkIndex != 0) {
                                this.listIcon[info.currentMission[i].CurrentMissionId-1].node.active = true;
                                this.listIcon[info.currentMission[i].CurrentMissionId-1].setAnimation(0, 'doing', true);
                                this.lbIndexQuest.string = info.currentMission[i].CurrentMissionId+"/"+(info.config.length-1);
                                this.listChest[info.currentMission[i].CurrentMissionId-1].setAnimation(0, 'waiting', true);
                                this.UpdateProgress(info.config[info.currentMission[i].CurrentMissionId], info.currentMission[i]);
                                this.btnPlay.active = true;
                                this.btnPlay.x = this.iconQuest[info.currentMission[i].CurrentMissionId-1].x;
                            }
                        }
                    }
                }
                if(checkIndex == -1) {
                    if(maxId < 4 && info.state > 1 && !Global.BeanStackPopup.isChangeFloor) {
                        this.AcceptMission(info.config[maxId+1]);
                    }
                }
            }
            
            cc.log(info.reward);
            for(let i = 0; i < info.reward.length; i++) {
                if(info.reward[i].IsReaded == 0) {
                    this.currentGroup = info.reward[i].MissionGroupId;
                    if(info.reward[i].MissionId != 0) {
                        this.listIcon[info.reward[i].MissionId-1].setAnimation(0, 'receive gifts', true);
                        this.listBtnGetReward[info.reward[i].MissionId-1].active = true;
                    } else {
                        this.idRewardTotal = info.reward[i].RewardId;
                        cc.log("id reward total:"+this.idRewardTotal);
                    }
                    
                    this.btnPlay.active = false;
                }
            }
        } else {
            cc.log(info);
            
            if(info.Index == 0) {
                if(info.State == 0) {
                    this.state = 0;
                    this.cloud[0].active = false;
                    this.cloud[1].active = false;
                    this.cloud[2].active = false;
                } else {
                    this.state = 1;
                    this.cloud[0].active = false;
                    this.cloud[1].active = false;
                    this.cloud[2].active = false;
                }
                
            } else {
                this.state = 2;
                cc.log(info.Index +"      "+ Global.BeanStackPopup.list.length);
                if(info.Index == Global.BeanStackPopup.list.length - 1) {
                    this.cloud[0].active = true;
                } else {
                    this.cloud[0].active = false;
                }
                
                // this.cloud[1].active = false;
                this.cloud[2].active = false;
                this.iconGame.node.active = false;
                this.iconLevel.node.x = 0;
            }
            
        }
        cc.log("---------info-------"+ Global.BeanStackPopup.state);
        cc.log(info);
        if(info.Index != null) {
            if(info.Index < Global.BeanStackPopup.currentFloor && Global.BeanStackPopup.state > 1) {
                this.animLock.node.active = false;
            }
            
            this.iconLevel.spriteFrame = this.listTextNumber[info.Index-1];
            this.lbLvLock.string = "LV"+(info.Index+1)*5;
            this.levelCheck = (info.Index+1)*5;
            cc.log(info.Index+"    "+Global.BeanStackPopup.isChangeFloor+"    "+(info.Index == Global.BeanStackPopup.currentFloor-1)+"   "+this.CheckLevel());
            if(((info.Index == 0 && Global.BeanStackPopup.currentFloor == 1 && Global.BeanStackPopup.state <= 1) || (Global.BeanStackPopup.isChangeFloor && info.Index == Global.BeanStackPopup.currentFloor-1)) &&  this.CheckLevel()) {
                this.animLock.setAnimation(0, 'ready unlock', true);
                this.animLock.node.active = true;
            }
            // for(let i = 0; i < this.iconFunc.length; i++) {
            //     this.iconFunc[i].spriteFrame = this.listIconFunc[info.Index-1];
            // }
        } else {
            cc.log(Global.BeanStackPopup.currentFloor+"    "+this.state);
            if(Global.BeanStackPopup.currentFloor != 0 && this.state > 1)
                this.animLock.node.active = false;
            this.lbLvLock.string = "LV5";
            this.levelCheck = 5;
        }
        
        //
        this.scheduleOnce(()=>{
            for(let i = 0; i < this.cloudHide.length; i++) {
                if(this.cloudHide[i].activeInHierarchy)
                {
                    this.contentCloudHide[i] = this.cloudHide[i].parent;
                    Global.changeParent(this.cloudHide[i], Global.BeanStackPopup.cloudContent);
                }
            }
        }, 0.3);
        
    },

    CheckLevel() {
        if(Global.LevelManager.currentLevel >= this.levelCheck) {
            return true;
        }
        return false;
    },

    ClickUnLock() {
        Global.Helper.LogAction("Click Unlock Bean:"+this.levelCheck);
        cc.log(this.state);
        if(!this.CheckLevel() || (this.state == 0 && this.CheckLevel())) {
            return;
        }
        this.animLock.node.active = true;
        this.animLock.setAnimation(0, 'active', false);
        if(this.state == 1) {
            Global.BeanStackPopup.GrowFull(()=>{
                this.AcceptMission(Global.CurrentFloorBean.info.config[1]);
            });
        } else if(this.state == 2) {
            Global.BeanStackPopup.UpFloor(()=>{
                this.AcceptMission(Global.CurrentFloorBean.info.config[1]);
            });
        }
    },

    UpdateProgress(configMission, currentMission) {
        cc.log(configMission);
        cc.log(currentMission);
        for(let i = 0; i < this.listQuest.length; i++) {
            this.listQuest[i].node.active = false;
        }
        let count = 0;
        if(configMission.BigwinTurn > 0) {
            this.listQuest[count].InitQuestBean(0, currentMission.BigwinTurn, configMission.BigwinTurn);
            count += 1;
        }
        if(configMission.MissTurn > 0) {
            this.listQuest[count].InitQuestBean(1, currentMission.MissTurn, configMission.MissTurn);
            count += 1;
        }
        if(configMission.SpecialSpin > 0) {
            this.listQuest[count].InitQuestBean(2, currentMission.SpecialSpin, configMission.SpecialSpin);
            count += 1;
        }
        if(configMission.SpecialTurnReward > 0) {
            this.listQuest[count].InitQuestBean(3, currentMission.SpecialTurnReward, configMission.SpecialTurnReward);
            count += 1;
        }
        if(configMission.SpinSlotTurn > 0) {
            this.listQuest[count].InitQuestBean(4, currentMission.SpinSlotTurn, configMission.SpinSlotTurn);
            count += 1;
        }
        if(configMission.TotalBet > 0) {
            this.listQuest[count].InitQuestBean(5, currentMission.TotalBet, configMission.TotalBet);
            count += 1;
        }
        if(configMission.TotalReward > 0) {
            this.listQuest[count].InitQuestBean(6, currentMission.TotalReward, configMission.TotalReward);
            count += 1;
        }
    },

    AcceptMission(configMission) {
        let data = {};
		data[1] = configMission.MissionId;
		data[2] = configMission.MissionType;
		data[3] = configMission.MissionGroupId;
        require("SendRequest").getIns().MST_Client_Bean_Stack_Accept_Mission(data);
        
    },

    ClickPlay() {
        if (!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SlotGame))
			return;
        Global.Helper.LogAction("Click play from Bean:"+this.GameId);
		// Global.SendTrackerLogView("Play Slot "+this.GameId);
		require("ScreenManager").getIns().roomType = this.GameId;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
    },

    ClickGetReward(event, index) {
        
        cc.log("get reward:"+index);
        
        this.selectIndex = parseInt(index);
        this.listBtnGetReward[this.selectIndex-1].active = false;
        this.btnGetReward = this.listBtnGetReward[this.selectIndex-1];
        this.listIcon[this.selectIndex-1].node.active = false;
        this.listChest[this.selectIndex-1].setAnimation(0, 'active', false);
        for(let i = 0; i < this.info.reward.length; i++) {
            if(this.info.reward[i].MissionId == this.selectIndex && this.info.reward[i].MissionGroupId == this.currentGroup) {
                let data = {};
                data[1] = this.info.reward[i].RewardId;
                require("SendRequest").getIns().MST_Client_Bean_Stack_Take_Account_Reward(data);
                if(this.selectIndex == 4) {
                    data[1] = this.info.config[0].MissionId;
                    data[2] = this.info.config[0].MissionType;
                    data[3] = this.info.config[0].MissionGroupId;
                    require("SendRequest").getIns().MST_Client_Bean_Stack_Accept_Mission(data);
                    Global.Helper.LogAction("Click get reward Bean:"+this.info.config[0].MissionId+"-"+this.info.config[0].MissionType+"-"+this.info.config[0].MissionGroupId);
                }
                return;
            }
        }
    },

    actionAccept() {
        if(this.selectIndex < 4) {
            let data = {};
            let newIndex = this.selectIndex + 1;
            data[1] = this.info.config[newIndex].MissionId;
            data[2] = this.info.config[newIndex].MissionType;
            data[3] = this.info.config[newIndex].MissionGroupId;
            this.scheduleOnce(()=>{
                require("SendRequest").getIns().MST_Client_Bean_Stack_Accept_Mission(data);
            } ,2);
        } else {
           
            this.scheduleOnce(()=>{
                this.OpenChestTotal();
            } ,2);
        }
    },

    OpenChestTotal() {
        Global.BeanStackPopup.isGetTotalReward = true;
        this.scheduleOnce(()=>{
            let data = {};
            data[1] = this.idRewardTotal;
            require("SendRequest").getIns().MST_Client_Bean_Stack_Take_Account_Reward(data);
        } ,0.8);
        this.animCage.play("UnLockFeatureBean");
        Global.BeanStackPopup.PlayAnimUnlock();
    },

    AcceptQuest(current, target) {
        cc.log(current);
        cc.log(target);
        if(target.MissionId != 0) {
            this.listChest[target.MissionId-1].setMaterial(0,this.materials[0]);
            this.listChest[target.MissionId-1].setAnimation(0, 'notification', false);
            this.scheduleOnce(()=>{
                this.listIcon[target.MissionId-1].node.active = true;
                this.listIcon[target.MissionId-1].setAnimation(0, 'doing', true);
                this.listChest[target.MissionId-1].setAnimation(0, 'waiting', true);
                this.btnPlay.active = true;
                this.btnPlay.x = this.iconQuest[target.MissionId-1].x;
                cc.log("accept:"+(target.MissionId-1)+"    "+this.btnPlay.x);
                this.lbIndexQuest.string = current.CurrentMissionId+"/"+(this.info.config.length-1);
                this.UpdateProgress(target, current);
            } ,1.9);
        }
        
        
    },

    onDestroy() {
        Global.CurrentFloorBean = null;
    },

    onDisable() {
        if(Global.CurrentFloorBean != null) {
            for(let i = 0; i < this.cloudHide.length; i++) {
                if(this.cloudHide[i]!=null && this.contentCloudHide[i] != null)
                    Global.changeParent(this.cloudHide[i], this.contentCloudHide[i]);
            }
        }
    },
    
});
