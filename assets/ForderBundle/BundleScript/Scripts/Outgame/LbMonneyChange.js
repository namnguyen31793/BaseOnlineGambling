cc.Class({
    extends: cc.Component,

    properties: {
        time: {
            default: 0.5,
            type: cc.Float,
        },

        _currentMonney: 0,
        _monney: 0,
        _deltaMonney: 0,
        _state: false,
        _label: null,
        _startX: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.lb = this.getComponent(cc.Label);
        this.motion = 0;
        this.timeMotion = 0;
    },

    start() {

    },

    onDisable() {
        this._state = false;
        if(this.lb)
            this.lb.string = Global.Helper.formatMoney(parseInt(this._monney));
    },

    reset() {
        this._monney = 0;
        this._currentMonney = 0;
        if(this.lb)
                this.lb.string = "0";
    },

    setMoney(monney, formatMoney = false) {
        if(this.node.activeInHierarchy) {
            this.formatMoney = formatMoney;
            this._monney = monney;
            this.monneyChange = monney - this._currentMonney;
            // cc.log("___ TX time : ", this.time);
            this.motion = (2 * this.monneyChange) / (this.time * this.time);
            this._startX = this._currentMonney;
            this.timeMotion = 0;
            this._state = true;
        } else {
            if(this.lb)
                this.lb.string = Global.Helper.formatNumber(parseInt(monney));
        }
    },

    setMoney(monney, fakeRun = true, formatMoney = false) {
        if(this.node.activeInHierarchy) {
            this.formatMoney = formatMoney;
            if(fakeRun && this._currentMonney == 0)
                this._currentMonney = monney * 0.6;
            this._monney = monney;
            this.monneyChange = monney - this._currentMonney;
            // cc.log("___ TX time : ", this.time);
            this.motion = (2 * this.monneyChange) / (this.time * this.time);
            this._startX = this._currentMonney;
            this.timeMotion = 0;
            this._state = true;
        } else {
            if(this.lb)
                this.lb.string = Global.Helper.formatNumber(parseInt(monney));
        }
    },

    EndRun() {
        this._state = false;
        this.lb.string = Global.Helper.formatNumber(parseInt(this._monney));
    },

    update(dt) {
        if (this._state) {
            this._currentMonney = this._startX + (0.5 * this.timeMotion * this.timeMotion * this.motion);
            if (this._currentMonney >= this._monney) {
                this._currentMonney = this._monney;
                this._state = false;
            }
            this.timeMotion += dt;

            if (this.formatMoney) {
                this.lb.string = Global.Helper.formatMoney(parseInt(this._currentMonney));
            } else {
                this.lb.string = Global.Helper.formatNumber(parseInt(this._currentMonney));
            }
        }
    },
});
