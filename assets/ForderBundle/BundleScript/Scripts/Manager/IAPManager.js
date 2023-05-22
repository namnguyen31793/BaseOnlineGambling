cc.Class({
    extends: cc.Component,

    OnGooglePaySuccess(rs) {
        let index = 0;
        for(let i = 0; i < rs.length; i++) {
            if(rs[i] == '{') {
                index = i;
                break;
            }
        }
        var str = rs.substring(index);
        var dataJson = JSON.parse(str);
        console.log(str);
        var data = {
            ProductId : dataJson.productId,
            PackageName : dataJson.packageName,
            TransactionId : Global.IAPManager.TransId,
            Token : dataJson.purchaseToken,
            Cookie: Global.CookieValue,
        }
        console.log(JSON.stringify(data));
        Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"v1/Services-billing/ConfirmIapOrder", data, this.ConfirmSuccess);
        console.log(data.ProductId+"-"+data.PackageName+"-"+data.TransactionId+"-"+data.Token);
    },

    ConfirmSuccess(response) {
        console.log("confirm:"+response);
        Global.UIManager.hideMiniLoading();
        let dataJson = JSON.parse(response);
        if(dataJson.c >= 0) {
           let dataSuccess = dataJson.d;
           if (dataSuccess.ResponseCode == 0)
                    {
                        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("OnPaySuccess"));
                        // Mua thành công,sv tự cộng tiền
                        //var messSuccess = string.Format("Mua thành công gói [{0}], bạn được cộng {1} vàng", dataSuccess.ItemName, dataSuccess.GoldAdd);
                       
                        //MiniGameManager.Instance.ShowCommandPopup(Global.MyLocalization.GetText(messSuccess));
                    }
                    else
                    {
                        Global.UIManager.showCommandPopup(dataSuccess.Message);
                    }
        } else {
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText(dataJson.m));
        }
    },

    OnPayFail() {
        console.log("OnPayFail");
        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("OnPayFail"));
    },

    GetListProduct1(list) {
        console.log(list);
    },

    GetListProduct2(list) {
        console.log(list);
    },

    onLoad() {
        Global.IAPManager = this;
    },

    onDestroy(){
		Global.IAPManager = null;
	},
});
