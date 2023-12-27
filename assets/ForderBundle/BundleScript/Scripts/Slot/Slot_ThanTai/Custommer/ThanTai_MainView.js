// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Bonus_GameView_prefab : cc.Prefab,
        Free_GameView_prefab : cc.Prefab,
        X2_GameView_prefab : cc.Prefab,
        HelpView_prefab : cc.Prefab,
        SettingView_prefab : cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("ThanTaiSpinController").getIns();
        this.spinController.setMainView(this);
    },

    start () {

    },

    Create_BonusGameView()
    {
            const instance = cc.instantiate(this.Bonus_GameView_prefab);
       // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);   
            require("AudioController").getIns().playBonusBackgroundMusic();
    },

    Create_FreeGameView()
    {
            const instance = cc.instantiate(this.Free_GameView_prefab);
       // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);   
            require("AudioController").getIns().playSound(cc.AudioTypes.FREESPIN);
    },
    Create_X2GameView()
    {
            const instance = cc.instantiate(this.X2_GameView_prefab);
       // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);   
    },
    Create_HelpView()
    {
        if(this.HelpView != null)
            return;
        const instance = cc.instantiate(this.HelpView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
             this.node.addChild(instance);  
             
            this.HelpView =   instance;
    },
    Destroy_HelpView()
    {
        this.HelpView.destroy();
        this.HelpView = null;
    },
    Create_SettingView()
    {
        if(this.SettingView != null)
        return;
        const instance = cc.instantiate(this.SettingView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);  
            this.SettingView =   instance;
    },
    Destroy_SettingView()
    {
        if(this.SettingView == null)
        return;
        this.SettingView.destroy();
        this.SettingView = null;
    },




    // update (dt) {},
});
