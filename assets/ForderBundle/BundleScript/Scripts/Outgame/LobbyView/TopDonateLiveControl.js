// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        listTopDonate:{
			default : [],
			type : require("ItemTopDonateElement")
        }
    },
    // let data[1] = {
    //  AccountId : 0,
    // 	Nickname : "Vip123",
    // 	Gold : 1000,
    // }
    SetupTopDonate(data){
        for(let i = 0; i < this.listTopDonate.length; i++){
            if(i < data.length){
                this.listTopDonate[i].Setup(data[i]);
            }else{
                this.listTopDonate[i].Clear();
            }
        }
    }
});
