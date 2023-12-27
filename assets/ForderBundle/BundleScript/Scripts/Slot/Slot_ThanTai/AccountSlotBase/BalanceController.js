var BalanceController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                 this.self = new BalanceController();
                 this.self.balanceViews = [];
            }
            return this.self;
        }
    },

    setBalanceTryView(balanceTryView)
    {
        this.balanceTryView = balanceTryView;
    },
    addBalanceView(balanceView)
    {
        this.balanceViews.push(balanceView);
    },
    removeBalanceView(balanceView) {
        if (this.balanceViews.length === 0) return;
        var index = this.balanceViews.indexOf(balanceView);
        if (index > -1) {
            this.balanceViews.splice(index, 1);
        }
    },
    getBalance()
    {
        return this.balance;
    },
    getTryBalance() {
        return this.tryBalance;
    },
    updateRealBalance(balance) {      
        this.balance = balance;
    },
    updateBalance(balance) {
        cc.log(">>>> UpdateBalance: "+balance);
        this.balanceViews.forEach(function (balanceView) {
            balanceView.updateBalance(balance);
        });
    },
    subtractBalanceUI(amount)
    {
        if(amount <= 0)
            return;
        this.balance -= amount;
        this.updateBalance(this.balance);
    },
    addBalanceUI(amount)
    {
        if(amount <= 0)
        return;
        this.balance += amount;
        this.updateBalance(this.balance);
    },
    updateTryBalance(balance) {
        this.tryBalance = balance;
        if (this.balanceTryView === null) return;
        this.balanceTryView.updateTryBalance(balance);
    },

    subTryBalance(balance) {
        if (this.balanceTryView === null) return;
        this.balanceTryView.subTryBalance(balance);
    },
    addTryBalance(balance)
    {
        if (this.balanceTryView === null) return;
        balance = balance * -1;
        this.balanceTryView.subTryBalance(balance);
    }




});

module.exports = BalanceController;
