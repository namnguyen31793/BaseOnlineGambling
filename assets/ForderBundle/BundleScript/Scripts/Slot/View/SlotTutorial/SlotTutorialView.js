cc.Class({
    extends: require("BaseMissionView"),
    ctor() {
        this.slotView = null;
        this.state = 0;//0-hide, 1-show
        this.xHide = 0;
        this.xShow = 0;
        this.missionType = 0;
        this.dailyMissionId = 0;
        this.isFirst = true;
    },

    properties: {
        questView : require("QuestGameView"),
        listAnim : [cc.Animation],
        btnMove : cc.Button,
      
    },

    Init(slotView) {
        this.slotView = slotView;
        this.node.parent = slotView.node;
        this.xShow = -580 - (cc.winSize.width-1344)/2;
        this.xHide = this.xShow - 150;
        this.node.x = this.xHide;
        cc.log(this.node);
        // this.node.runAction();
        this.Move();
        this.scheduleOnce(()=>{
            this.ClickShowInfo(null,0);
        } ,  0.5);
        this.scheduleOnce(()=>{
            this.ClickShowInfo(null,1);
        } ,  0.8);
        this.scheduleOnce(()=>{
            this.ClickShowInfo(null,2);
        } ,  1.1);
    },

    Move() {
        this.btnMove.interactable = false;
        if(this.state == 0) {
            this.btnMove.node.scaleX = -1;
            this.node.runAction(cc.sequence( 
                cc.moveTo(0.5 , cc.v2(this.xShow, 0)),
                // cc.delayTime(0.5),
                cc.callFunc(()=>{
                    this.state = 1;
                    this.btnMove.interactable = true;
                })
            ));
        } else {
            this.btnMove.node.scaleX = 1;
            this.node.runAction(cc.sequence( 
                cc.moveTo(0.5 , cc.v2(this.xHide, 0)),
                // cc.delayTime(0.5),
                cc.callFunc(()=>{
                    this.state = 0;
                    this.btnMove.interactable = true;
                })
            ));
        }
    },

    SetInfo(currentMissionInfo, currentTargetMission) {
        cc.log("-----------set info");
        this.cacheCurrent = currentMissionInfo;
        this.cacheTarget = currentTargetMission;
        this.node.active = true;
        if(this.isFirst) {
            this.isFirst = false;
            this.ProcessInfo();
        } else {
            
        }
       
    },

    ProcessInfo() {
        if(this.cacheCurrent == null)
            return; 
        this.missionType = this.cacheTarget.MissionType;
        this.questView.SetInfo(this.cacheCurrent, this.cacheTarget);
       
        this.cacheCurrent = null;
        this.cacheTarget = null;
    },

   


    ClickShowInfo(event, index) {
        let select = parseInt(index);
        this.listAnim[select].play();
        this.scheduleOnce(()=>{
            this.questView.listNote[select].width = this.questView.listDescription[select].node.width + 71;
        } ,  0.01);
    },

    ClickTest() {

		require("SendRequest").getIns().MST_Client_Slot_Mission_Get_Current_Mission();
    },

    onLoad() {
        Global.SlotTutorialView = this;
    },

    onDestroy() {
        Global.SlotTutorialView = null;
    },
    
});
