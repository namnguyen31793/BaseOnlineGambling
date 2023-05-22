

cc.Class({
    extends: cc.Component,
    ctor() {
        this.data = null;
        this.isGetReward = false;
        this.state = 0;
        this.idReward = 0;
    },

    properties: {
        ava : cc.Sprite,
        stateAva : cc.Button,
        btnPlay : cc.Button,
        btnGet : cc.Button,
        iconLock : cc.Node,
        iconChestLock : cc.Node,
        iconChestUnlock : cc.Node,
        tick : cc.Node,
        path : cc.Node,
        normal : cc.Node,
        chestTotal : sp.Skeleton,
        animBean : cc.Animation,
    },

    Init(data, isEnd = false) {
        this.path.active = !isEnd;
        this.data = data;
        if(data.MissionId == 0) {
            this.normal.active = false;
            this.chestTotal.node.active = true;
        } else {
            this.normal.active = true;
            this.chestTotal.node.active = false;
            Global.Helper.GetIconGame(this.ava, data.GameId);
        }
        
    },

    UpdateStatus() {
        this.iconChestLock.active = true;
        this.iconChestUnlock.active = false;
        this.btnPlay.node.active = true;
        this.btnGet.node.active = false;
        if(this.data.MissionId != 0) {
            if(this.state == 1) {
                this.btnPlay.interactable = true;
                this.stateAva.interactable = true;
                this.iconLock.active = false;
                this.tick.active = false;
            } else if(this.state == 2) {
                this.btnPlay.node.active = false;
                this.btnGet.node.active = true;
                this.stateAva.interactable = true;
                this.iconLock.active = false;
                this.tick.active = true;
            }
            if(this.isGetReward) {
                this.btnGet.interactable = false;
                this.iconChestLock.active = false;
                this.iconChestUnlock.active = true;
            }
        } else {
            if(this.idReward != 0) {
                this.btnGet.node.active = true;
                if(this.isGetReward) {
                    this.btnGet.interactable = false;
                    this.chestTotal.setAnimation(0, 'unactive', true);
                } else {
                    this.chestTotal.setAnimation(0, 'notification', true);
                }
            }
        }
        
        
    },

    ClickShowInfo() {
        if(this.state == 1)
            Global.TutorialPopup.ShowPopupInfo(this.data);
    },

    ClickPlay() {
        Global.AudioManager.ClickButton();
        let data = {};
        data[1] = this.data.GameId;
        data[2] = this.data.MissionId;
        data[3] = this.data.MissionGroupId;
        data[4] = Global.Enum.MISSION_TYPE.NEW_USER;
        Global.isTutorial = this.data.MissionId;
        require("SendRequest").getIns().MST_Client_Event_Mission_Account_Accept_Mission(data);
        require("ScreenManager").getIns().roomType = this.data.GameId;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
    },

    ClickTest() {
        this.chestTotal.setAnimation(0, 'active', false);
            this.isGetReward = true;
            this.btnGet.interactable = false;
            this.scheduleOnce(()=>{
                let data = {};
                data[1] = this.idReward;
          
                let posWorld = this.iconChestUnlock.parent.convertToWorldSpaceAR(this.iconChestUnlock);
                let posInGameView = Global.TutorialPopup.node.convertToNodeSpaceAR(posWorld);
                Global.TutorialPopup.ShowEffectGetReward(posInGameView, true);
                this.scheduleOnce(()=>{
                    this.animBean.node.active = true;
                    this.animBean.play();
                    this.scheduleOnce(()=>{
                        Global.TutorialPopup.animWhite.play();
                        this.scheduleOnce(()=>{
                            Global.TutorialPopup.node.active = false;
                            Global.UIManager.hideMark();
                            Global.UIManager.ShowBeanStackPopup(0);
                        } ,0.5);
                    } ,1);
                } , 2.5);
            } , 1);
    },

    ClickGetReward() {
        if(this.data.MissionId != 0) {
            this.iconChestLock.active = false;
            this.iconChestUnlock.active = true;
            let data = {};
            data[1] = this.idReward;
            require("SendRequest").getIns().MST_Client_Event_Mission_Get_Take_Account_Reward(data);
            this.isGetReward = true;
            
            this.btnGet.interactable = false;
            let posWorld = this.iconChestUnlock.parent.convertToWorldSpaceAR(this.iconChestUnlock);
            let posInGameView = Global.TutorialPopup.node.convertToNodeSpaceAR(posWorld);
            Global.TutorialPopup.ShowEffectGetReward(posInGameView);
        } else {
            this.chestTotal.setAnimation(0, 'active', false);
            this.isGetReward = true;
            this.btnGet.interactable = false;
            this.scheduleOnce(()=>{
                let data = {};
                data[1] = this.idReward;
                require("SendRequest").getIns().MST_Client_Event_Mission_Get_Take_Account_Reward(data);
                let posWorld = this.iconChestUnlock.parent.convertToWorldSpaceAR(this.iconChestUnlock);
                let posInGameView = Global.TutorialPopup.node.convertToNodeSpaceAR(posWorld);
                Global.TutorialPopup.ShowEffectGetReward(posInGameView, true);
                this.scheduleOnce(()=>{
                    this.animBean.node.active = true;
                    this.animBean.play();
                } , 2.5);
            } , 1);
        }
        
    },
});
