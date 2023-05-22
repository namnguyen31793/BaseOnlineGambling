var WalletController = cc.Class({
	statics: {
        getIns() {
            if (this.self == null){
                this.self = new WalletController();
                this.self.listEvent = {};
                this.self.money = 0;
                this.self.cacheSub = 0;
                this.self.deleagate = [];
                this.self.isGetMoney = true;
                this.self.walletBalance = 0;
            } 
            return this.self;
        }
    },

    properties: {
       
    },

    init(isGetMoney = true, moneyInit = 0){
        this.isGetMoney = isGetMoney;
        if(!isGetMoney)
            this.money = moneyInit;
        else this.money = Global.MainPlayerInfo.ingameBalance;
        this.deleagate = [];
    },

    SetBalance(balance) {
        if(this.isGetMoney) {
            Global.MainPlayerInfo.ingameBalance = balance;
        } else {
            this.walletBalance = balance;
        }
    },

    GetBalance() {
        if(this.isGetMoney) {
            return Global.MainPlayerInfo.ingameBalance;
        } else {
            return this.walletBalance;
        }
    },

    GetMoney() {
        return this.money;
    },

    PushBalance(id, betValue, prizeValue, accountBalance) {
        this.SetBalance(accountBalance);
        this.money = this.money - betValue;
        if (this.money < 0) {
            cc.log ("update PushBalance error:"+this.money+"    "+betValue);
            return;
        }
        let coin = {betValue, prizeValue};
        // if (this.listEvent[id]) {
        //     this.TakeBalance (id);
        // }
        this.listEvent[id] = coin;
        this.OnUpdateMoney();
    },

    TakeBalance(id)	{
        if (this.listEvent[id]) {
            var coin = this.listEvent [id];
            this.money += coin.prizeValue;
            if (this.money < 0) {
                cc.log ("update TakeBalance error:"+this.money+"    "+coin[1]);
                return;
            }
            this.OnUpdateMoney();
            delete this.listEvent[id];
        }
        if (this.getLengthObj(this.listEvent) == 0 && this.cacheSub == 0) {
            this.money = this.GetBalance();
            this.OnUpdateMoney();
        }
    },

    UpdateBalance(gold) {
        this.money += gold;
        this.SetBalance(this.GetBalance() + gold);
        if (this.money < 0) {
            cc.log ("update UpdateBalance error:"+this.money+"    "+gold);
            return;
        }
        this.OnUpdateMoney();
    },

    UpdateWallet(accountBalance) {
        var cache = accountBalance - this.GetBalance();
        this.SetBalance(accountBalance);
        this.money += cache;
        if (this.money < 0) {
            cc.log ("update UpdateWallet error:"+this.money+"    "+cache);
            return;
        }
        this.OnUpdateMoney();
    },

    UpdateTotal(accountBalance) {
        this.cacheSub = accountBalance - this.GetBalance() + this.cacheSub;
        this.SetBalance(accountBalance);
    },

    UpdateCache() {

        this.money += this.cacheSub;
        this.cacheSub = 0;
        if (this.money < 0) {
            cc.long ("update cache error:"+this.money+"    "+this.cacheSub);
            return;
        }
        this.OnUpdateMoney();
        if (this.getLengthObj(this.listEvent) == 0 && this.cacheSub == 0) {
            this.money = this.GetBalance();
            this.OnUpdateMoney();
        }
    },

    getLengthObj(obj){
        let size = 0;
        for(let temp in obj){
            if(obj.hasOwnProperty(temp))size++;
        }
        return size
    },

    OnUpdateMoney() {
        for(var i = 0; i < this.deleagate.length; i++)
        {
            if(this.deleagate[i]) 
                this.deleagate[i].OnUpdateMoney(this.money);
        }
    },

    AddListener(event) {
        this.deleagate[this.deleagate.length] = event;
    },

    RemoveListener(){
        this.deleagate = [];
    },

});
module.exports = WalletController;