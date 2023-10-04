import DropDown from "../../../Loading/Add-on/DropDown/Script/DropDown";
import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Tween from "../Script/common/Tween";
import Utils from "../Script/common/Utils";
import ItemGameLive from "./ItemGameLive";

const { ccclass, property } = cc._decorator;
var ListGame = ["Tài khoản chính", "Thể thao"];
var _this = null;
@ccclass
export default class GameLiveController extends cc.Component {

    @property(cc.Node)
    boxLeft: cc.Node = null;
    @property(cc.Node)
    boxRight: cc.Node = null;
    @property([ItemGameLive])
    arrItem: ItemGameLive[] = [];
    @property(DropDown)
    dropFrom: DropDown = null;
    @property(DropDown)
    dropTo: DropDown = null;
    @property(cc.EditBox)
    editMoney: cc.EditBox = null;
    @property(cc.Label)
    txtTotalMoney: cc.Label = null;


    private balanceEBET = 0;
    private totalMoney = 0;
    onLoad() {
        _this = this;
        ListGame = [App.instance.getTextLang("txt_main_account"), "Thể thao"];
    }
    show() {
        this.node.setSiblingIndex(this.node.parent.childrenCount);
        this.editMoney.tabIndex = -1;
        this.boxLeft.opacity = 0;
        this.boxLeft.position = new cc.Vec3(0, 200, 0);
        cc.Tween.stopAllByTarget(this.boxLeft);
        cc.tween(this.boxLeft)
            .to(0.5, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
            .start();

        this.boxRight.opacity = 0;
        this.boxRight.position = new cc.Vec3(0, -200, 0);
        cc.Tween.stopAllByTarget(this.boxRight);
        cc.tween(this.boxRight)
            .to(0.5, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
            .start();

        // this.dropFrom = this.dropFrom.getComponent("DropDown");
        this.dropTo = this.dropTo.getComponent("DropDown");
        this.editMoney.string = "";
        this.initDropFrom();
        this.initDropTo();
        this.totalMoney = Configs.Login.Coin;
        this.updateTotalMoney();
        this.node.active = true;

        for (var i = 0; i < this.arrItem.length; i++) {
            this.arrItem[i].show();
        }
        this.arrItem[0].updateData(Configs.Login.Coin);
        this.updateInfoEBET(true);
    }



    updateInfoEBET(isUpdateTotal = false) {
        Http.postz("https://server.suvip11.fun/InfoEBET", { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfo EBET:" + JSON.stringify(res));
            if (res["res"] == 0) {
                _this.arrItem[6].updateData(res["data"]["money"] * 100);
                _this.balanceEBET = res["data"]["money"] * 100;

                if (isUpdateTotal == true) {
                    _this.totalMoney += res["data"]["money"] * 100;
                    _this.updateTotalMoney();
                }
            }
            else {
                this.arrItem[6].maintain();
            }


        });
    }
    
    initDropFrom() {
        var datas = new Array();
        for (let i = 0; i < ListGame.length; i++) {
            datas.push({ optionString: ListGame[i] });
        }
        this.dropFrom.clearOptionDatas();
        this.dropFrom.addOptionDatas(datas);
        this.dropFrom.selectedIndex = 0;
    }

    initDropTo() {
        var datas = new Array();
        for (let i = 0; i < ListGame.length; i++) {
            datas.push({ optionString: ListGame[i] });
        }
        this.dropTo.clearOptionDatas();
        this.dropTo.addOptionDatas(datas);
        this.dropTo.selectedIndex = 1;
    }

    updateTotalMoney() {
        Tween.numberTo(this.txtTotalMoney, this.totalMoney, 1);
    }

    hide() {
        this.node.active = false;
    }

    onToggleDropTo() {

    }

    onToggleDropFrom() {

    }
    onBtnConfirm() {
         ////Utils.Log("vao day cai ne");
		//console.log(ListGame);
		 
        setTimeout(() => {
            if (this.dropFrom.labelCaption.string == ListGame[0]) {
                //nap
                var money = Utils.formatEditBox(this.editMoney.string) / 100;
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                }
                switch (this.dropTo.labelCaption.string) {
                    case ListGame[1]:
                        if (money * 100 > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[1].money + " : " + money);
                        App.instance.showLoading(true);
                        Http.get(App.API_AG, { t: "Deposit", a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                            if (res["res"] == 0) {
                                 ////Utils.Log("Nap AG res:" + JSON.stringify(res));
                                _this.updateInfoEBET();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money * 100);
                                Configs.Login.Coin -= money * 100;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
                    
                }
            }
            else if (this.dropTo.labelCaption.string == ListGame[0]) {
                //rut
                var money = Utils.formatEditBox(this.editMoney.string) / 100;
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                }
                switch (this.dropFrom.labelCaption.string) {
                    case ListGame[1]:
                         ////Utils.Log("Rut:" + this.balanceAG);
                        //ag
                        if (money * 100 > this.balanceEBET) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        App.instance.showLoading(true);
                        Http.get(App.API_AG, { t: "Withdraw", a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                            if (res["res"] == 0) {
                                _this.updateInfoAG();
                                _this.arrItem[0].updateData(_this.arrItem[0].money + money * 100);
                                Configs.Login.Coin += money * 100;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
                   
                }
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                return;
            }
        }, 300)
    }

}
