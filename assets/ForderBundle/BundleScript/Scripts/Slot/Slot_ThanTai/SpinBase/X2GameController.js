var X2GameController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new X2GameController();
                this.self.Setup();
            }
            return this.self;
        }
    },

    Setup()
    {

    },
    setX2GameView(x2GameView)
    {
        return this.x2GameView = x2GameView;
    },

    getBaseValue()
    {
        return this.baseValue;
    },

    setBaseValue(baseValue)
    {
        return this.baseValue = baseValue;
    },
    Handle_X2Game_Response(responseData)
    {
       
        this.x2GameView.SetupRewardValue(responseData);
    }


});
module.exports = X2GameController;
