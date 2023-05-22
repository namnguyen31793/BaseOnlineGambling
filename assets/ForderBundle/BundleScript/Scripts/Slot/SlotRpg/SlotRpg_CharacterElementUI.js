cc.Class({
    extends: cc.Component,
    ctor() {
        this.speed = 0;
        this.time = 1;
        this.countTime = 0;
        this.currentHp = 0;
        this.countAttack = 0;
    },

    properties: {
        lbNickName : cc.Label,
        lbTurn : cc.Label,
        lbResult : cc.Label,
        hpBar : cc.Sprite,
        hpRun : cc.Sprite,
        lbDefense : cc.Label,
        lbCountAttack : cc.Label,
        anim : cc.Animation,
        effectHit : sp.Skeleton,
        effectHeal : sp.Skeleton,
        effectDef : sp.Skeleton,
        lbEHeal : cc.Label,
        lbEDef : cc.Label,
        lbEHit : cc.Label,
        animEHeal : cc.Animation,
        animEDef : cc.Animation,
        animEHit : cc.Animation,
        effectAttack : require("RpgAttackLine"),
    },

    Init(Info, maxHp){
        this.anim.play("IdleMelee");
        this.lbNickName.string = Info.Nickname;
        this.lbTurn.string = "Hp "+ maxHp;
        this.hpBar.fillRange = 1;
        this.hpRun.fillRange = 1;
        this.lbCountAttack.string = "0";
        this.currentHp = maxHp;
        this.countAttack = 0;
    },

    UpdateInfo(Info, maxHp){
        cc.log(Info);
        // this.lbNickName.string = Info.Nickname;
        if(Info.lastTurn != null) {
            this.lbDefense.string = Info.lastTurn.DF;//DA DF HE
        } else {
            this.lbDefense.string = "0";
        }
        this.currentHp = Info.Hp;
        this.lbTurn.string = "Hp "+ Info.Hp;
        this.hpBar.fillRange = Info.Hp/maxHp;
        if(this.hpBar.fillRange < this.hpRun.fillRange) {
            this.speed = (this.hpBar.fillRange - this.hpRun.fillRange)/this.time;
            this.countTime = 0;
        }
    },

    BuffDef(def) {
        this.effectDef.node.active = true;
        this.effectDef.setAnimation(0, 'animation', false);
        this.scheduleOnce(()=>{
            this.animEDef.node.active = true;
            this.animEDef.play();
            this.lbEDef.string = "+"+def;
            this.lbDefense.string = def;
            this.scheduleOnce(()=>{
                this.animEDef.node.active = false;
            }, 0.5);
        }, 0.5);
        this.scheduleOnce(()=>{
            this.effectDef.node.active = false;
        }, 0.85);
    },

    ResetDef() {
        this.lbDefense.string = 0;
    },

    Heal(Info, maxHp, waitTime) {
        this.scheduleOnce(()=>{
            this.effectHeal.node.active = true;
            this.effectHeal.setAnimation(0, 'animation', false);
            this.scheduleOnce(()=>{
                this.lbTurn.string = "Hp "+ Info.Hp;
                this.currentHp = Info.Hp;
                this.hpBar.fillRange = Info.Hp/maxHp;
                this.hpRun.fillRange = Info.Hp/maxHp;
                this.animEHeal.node.active = true;
                this.animEHeal.play();
                this.lbEHeal.string = "+"+Info.lastTurn.HE;
                this.scheduleOnce(()=>{
                    this.animEHeal.node.active = false;
                }, 0.5);
            }, 0.5);
            this.scheduleOnce(()=>{
                this.effectHeal.node.active = false;
            }, 0.45);
        }, waitTime);
    },

    Attack(animName, waitTime) {
        this.scheduleOnce(()=>{
            this.scheduleOnce(()=>{
                this.effectAttack.Play();
            }, 0.4);
            this.anim.play(animName);
            this.scheduleOnce(()=>{
                this.anim.play("IdleMelee");
            }, 0.5);
        }, waitTime);
    },

    OnHit(Info, maxHp, waitTime) {
        this.scheduleOnce(()=>{
            this.effectHit.node.active = true;
            this.effectHit.setAnimation(0, 'animation', false);
            this.anim.play("Hit");
            
            this.animEHit.node.active = true;
            this.animEHit.play();
            if(Info.Hp <= 0) {
                Info.Hp = 0;
                
                this.scheduleOnce(()=>{
                    Global.SlotNetWork.slotView.CheckEndBattle();
                }, 1.5);
            }
            this.scheduleOnce(()=>{
                if(Info.Hp <= 0) {
                    this.anim.play("DieBack");
                } else {
                    this.anim.play("IdleMelee");
                }
               
            }, 0.2);
            this.lbEHit.string = "-"+(this.currentHp-Info.Hp);
                this.currentHp = Info.Hp;
            this.scheduleOnce(()=>{
                this.animEHit.node.active = false;
            }, 0.5);
            this.lbTurn.string = "Hp "+ Info.Hp;
            this.hpBar.fillRange = Info.Hp/maxHp;
            if(this.hpBar.fillRange < this.hpRun.fillRange) {
                this.speed = (this.hpBar.fillRange - this.hpRun.fillRange)/this.time;
                this.countTime = 0;
            }
            this.scheduleOnce(()=>{
                this.effectHit.node.active = false;
                this.ResetDef();
            }, 0.5);
        }, waitTime+1);
    },

    UpdateCountAttack(countAttack) {
        this.countAttack = countAttack;
        this.lbCountAttack.string = countAttack.toString();
    },

    UpdateStatus(isGameOver){
        if(isGameOver){
            this.lbTurn.string = "Hp "+ 0;
            this.hpBar.fillRange = 0;
            //show effect die
        }
    },

    update(dt) {
        if(this.speed != 0) {
            this.countTime += dt;
            this.hpRun.fillRange += this.speed * dt;
            if(this.countTime >= this.time) {
                this.speed = 0;
                this.hpRun.fillRange = this.hpBar.fillRange;
            }
        }
    },
});
