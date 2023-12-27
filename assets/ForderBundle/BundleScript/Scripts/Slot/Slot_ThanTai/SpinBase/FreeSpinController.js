(function () {
    var FreeSpinController;
    FreeSpinController = (function () {

        var instance;

        function FreeSpinController() {
        }

        instance = void 0;

        FreeSpinController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        FreeSpinController.prototype.setFreeSpinView = function (freeSpinView) {
            return this.freeSpinView = freeSpinView;
        };

        FreeSpinController.prototype.activeFreeSpin = function (enable) {        
                //tat/bat chon dong
            cc.SpinController.getInstance().activeButtonSelectBetLines(!enable);  
            return this.freeSpinView.activeFreeSpin(enable);
        };

        FreeSpinController.prototype.setStateFreeSpin = function (isFreeSpin) {
            return this.isFreeSpin = isFreeSpin;
        };

        FreeSpinController.prototype.getStateFreeSpin = function () {
            return this.isFreeSpin;
        };

        return FreeSpinController;

    })();  
    cc.FreeSpinController = FreeSpinController;
}).call(this);

