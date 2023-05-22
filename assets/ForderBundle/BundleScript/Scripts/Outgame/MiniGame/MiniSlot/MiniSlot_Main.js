var MiniSlot_Main = cc.Class({
    extends: cc.Component,

    statics: {
        scope: null,
    },

    properties: {
        // Jackpot
        labelJackpot: cc.Label,

        // Choose Lines
        labelLineCount: cc.Label,
        popupChooseLines: cc.Node,

        // Bet
        btnBet: {
            default: [],
            type: cc.Toggle
        },

        // Spin
        btnAuto: cc.Toggle,
        btnManual: cc.Node,
        btnFlash: cc.Toggle,
        // spriteSpinManual: {
        //     default: [],
        //     type: cc.SpriteFrame
        // },

        // Table
        listLargeItem: cc.Node,
        listLineEat: cc.Node,

        // Fx
        effectJackpot: cc.Node,
        effectGoldAdd: cc.Node,
        effectBet: cc.Node,

        // Stop anims
        nodeUse2ShowLineWin: cc.Node,

        // Popup notify
        popupNotify: cc.Node,
        popupWarmingChooseLine: cc.Node,

        labelSession: cc.Label,

        edtSpinResult: cc.EditBox,
        lblTotalBet: cc.Label,
        lblTotalWin: cc.Label,
    },

    intervalGetJackpot: null,
    arrBet: null,
    resSpin: null,
    delayTimeShowEachLine: null,
    delayTimeForShowEffect: null,
    offAutoSpin: null,
    moneyChange: null,

    arrLineSelected: null,
    betLineCount: null,

    isCloseGame: null,
    isMinimizeGame: null,

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.log("MiniSlot_Main onLoad");
        this.getComponent("DragMiniGame").gameType = GAME_TYPE.MINI_SLOT;

        MiniSlot_Main.scope = this;
        this.arrBet = [100, 1000, 5000, 10000];

        this.isCloseGame = true;
        this.isMinimizeGame = false;
    },

    startGame() {
        cc.log("MiniSlot_Main onEnable");

        if (this.isCloseGame) {
            // New
            this.spinBet = this.arrBet[0];
            this.spinRoom = 1;

            this.delayTimeShowEachLine = 0;
            this.delayTimeForShowEffect = 0;
            this.offAutoSpin = false;
            this.moneyChange = 0;
            this.lastJackpot = 0;

            this.betLineCount = 20;
            this.arrLineSelected = [];
            for (let index = 0; index < 20; index++) {
                this.arrLineSelected.push(index + 1);
            }

            this.labelLineCount.string = 20;

            MiniSlot_Main.scope.labelSession.string = "";

            this.resetSpinState();
            this.resetChooseBet();
            this.resetIcon();
            this.resetFx();
        } else {
            // Continue
        }

        cc.log("MiniSlot_Main spinBet : ", MiniSlot_Main.scope.spinBet);

        MiniSlot_Main.scope.requestGetJackpotInfo();

        MiniSlot_Main.scope.intervalGetJackpot = setInterval(function () {
            cc.log("MiniSlot_Main intervalGetJackpot");
            MiniSlot_Main.scope.requestGetJackpotInfo();
        }, 15 * 1000);
    },

    onDisable() {
        cc.log("MiniSlot_Main onDisable");
    },

    start() {
        cc.log("MiniSlot_Main start");
    },
    responseServer(code, packet) {
        // cc.log("MiniSlot_Main responseServer : " + "code = " + code + "packet = " + JSON.stringify(packet))
        switch (code) {
            case RESPONSE_CODE.MST_SERVER_MINISLOT_JACKPOT_INFO_NEW:
                MiniSlot_Main.scope.setupJackpot(packet);
                break;
            case RESPONSE_CODE.MST_SERVER_MINISLOT_SPIN:
                MiniSlot_Main.scope.setupSpin(packet);
                break;
            default:
                break;
        }
    },

    // Jackpot
    setupJackpot(packet) {
        // cc.log("MiniSlot_Main setupJackpot : ", JSON.stringify(packet));
        var arrData = packet[1];
        var newJackpot = 0;
        switch (MiniSlot_Main.scope.spinBet) {
            case MiniSlot_Main.scope.arrBet[0]:
                newJackpot = JSON.parse(arrData[0]).JackpotFund;
                break;
            case MiniSlot_Main.scope.arrBet[1]:
                newJackpot = JSON.parse(arrData[1]).JackpotFund;
                break;
            case MiniSlot_Main.scope.arrBet[2]:
                newJackpot = JSON.parse(arrData[2]).JackpotFund;
                break;
            case MiniSlot_Main.scope.arrBet[3]:
                newJackpot = JSON.parse(arrData[3]).JackpotFund;
                break;
            default:
                break;
        }
        MiniSlot_Main.scope.fxGoldChange(MiniSlot_Main.scope.lastJackpot, newJackpot, MiniSlot_Main.scope.labelJackpot.node);
        MiniSlot_Main.scope.lastJackpot = newJackpot;
    },

    // Spin
    setupSpin(packet) {
        cc.log("MiniSlot_Main setupSpin : ", JSON.stringify(packet));
        MiniSlot_Main.scope.resSpin = packet;

        var spinId = packet[1];
        var slotData = packet[2];
        var prizeData = packet[3];
        var totalBet = packet[4];
        var totalPrizeValue = packet[5];
        var isJackpot = packet[6];
        var currentJackpotValue = packet[7];
        var accountBalance = packet[8];

        // require("GameManager").getIns().pushDelayMoney(GAME_TYPE.MINI_SLOT, accountBalance);
        MiniSlot_Main.scope.effectBet.active = true;
        MiniSlot_Main.scope.effectBet.getComponent(cc.Label).string = MiniSlot_Main.scope.formatGold(-totalBet);
        MiniSlot_Main.scope.effectBet.getComponent(cc.Animation).play();
        // require("GameManager").getIns().userAg -= totalBet;
        // // MiniSlot_Main.scope.setUserGold(-totalBet);
        // MiniSlot_Main.scope.moneyChange = totalPrizeValue;

        require("WalletController").getIns().PushBalance(GAME_TYPE.MINI_SLOT, totalBet, totalPrizeValue, accountBalance);

        var arrItem = slotData.split(",");
        MiniSlot_Main.scope.SpinAnim(arrItem);
    },

    onClickClose() {
        actionEffectClose(this.node, () => {
            clearInterval(MiniSlot_Main.scope.intervalGetJackpot);
            this.isMinimizeGame = false;
            this.isCloseGame = true;
            this.node.removeFromParent(false);

            if (MiniSlot_Main.scope.isSpining) {
                // MiniPoker_Main.scope.setUserGold(MiniPoker_Main.scope.moneyChange);
                this.resetStateOffAuto();
            }
        })
    },

    onClickMinimize() {
        if (!this.isSpinAuto) {
            this.onClickClose();
        } else {
            this.isMinimizeGame = true;
            this.isCloseGame = false;
            Global.BtnMiniGame.hideGame(this, GAME_TYPE.MINI_SLOT);
        }
    },

    // Spin
    SpinAnim(arrItem) {
        cc.log("MiniSlot_Main arrItem : ", arrItem);

        var startPos = [[-165, 1500], [-37, 1500], [90, 1500]];
        var endPos = [[-165, 176], [-37, 176], [90, 176]];

        // Normal : timeColumnMove + timeDelay[4] = 2s
        // Flash : timeColumnMove + timeDelay[4] = 1s
        var timeColumnMove = 1; // 1.5
        var timeDelay = [0.1, 0.2, 0.3];
        if (this.isSpinFlash) {
            cc.log("isSpinFlash");
            timeColumnMove = 0.5; // 0.75
            timeDelay = [0.05, 0.1, 0.15];
        } else {
            cc.log("SPIN Other Mode ");
        }

        var timeInitItem = (timeDelay[2] + timeDelay[1]) * 1000;

        // init Icon result
        setTimeout(function () {
            for (let a = 0; a < 3; a++) {
                for (let b = 0; b < 3; b++) {
                    MiniSlot_Main.scope.listLargeItem.children[a].children[b].getComponent("MiniSlot_ItemLarge").initItem(arrItem[a + (3 * b)]);
                }
            }
        }, timeInitItem);

        // Scroll 5 Column : easeCircleActionOut
        for (let index = 0; index < 3; index++) {
            this.listLargeItem.children[index].runAction(
                cc.sequence(
                    cc.delayTime(timeDelay[index]),
                    cc.moveTo(0.075, endPos[index][0], endPos[index][1] + 20).easing(cc.easeSineOut(0.05)),
                    cc.moveTo(0, startPos[index][0], startPos[index][1]),
                    cc.moveTo(timeColumnMove - 0.15, endPos[index][0], endPos[index][1] - 20).easing(cc.easeSineOut()),
                    cc.moveTo(0.075, endPos[index][0], endPos[index][1]).easing(cc.easeSineIn()),
                ),
            );
        }

        // Show Result
        setTimeout(function () {
            cc.log("MiniSlot_Main Show Result");
            MiniSlot_Main.scope.showSpinResult();
        }, (timeDelay[2] + timeColumnMove + 0.25) * 1000);  // 0.25s delay tu khi quay xong
    },

    showSpinResult() {
        cc.log("MiniSlot_Main showSpinResult ");
        var spinId = MiniSlot_Main.scope.resSpin[1];
        var slotData = MiniSlot_Main.scope.resSpin[2];
        var prizeData = MiniSlot_Main.scope.resSpin[3];
        var totalBet = MiniSlot_Main.scope.resSpin[4];
        var totalPrizeValue = MiniSlot_Main.scope.resSpin[5];
        var isJackpot = MiniSlot_Main.scope.resSpin[6];
        var currentJackpotValue = MiniSlot_Main.scope.resSpin[7];
        var accountBalance = MiniSlot_Main.scope.resSpin[8];

        MiniSlot_Main.scope.labelSession.string = "#" + spinId;

        MiniSlot_Main.scope.fxGoldChange(MiniSlot_Main.scope.lastJackpot, currentJackpotValue, MiniSlot_Main.scope.labelJackpot.node);
        MiniSlot_Main.scope.lastJackpot = currentJackpotValue;

        cc.log("MiniSlot_Main isJackpot : ", isJackpot);
        cc.log("MiniSlot_Main totalPrizeValue : ", totalPrizeValue);

        MiniSlot_Main.scope.resetFx();
        MiniSlot_Main.scope.lblTotalBet.string = Global.formatNumber(totalBet);
        if (totalPrizeValue > 0)
            MiniSlot_Main.scope.fxGoldChange(0, totalPrizeValue, MiniSlot_Main.scope.lblTotalWin.node);
        else MiniSlot_Main.scope.lblTotalWin.string = "0";
        if (isJackpot == 0) {
            // Normal
            if (totalPrizeValue > 0) {
                MiniSlot_Main.scope.effectGoldAdd.active = true;
                MiniSlot_Main.scope.fxGoldChange(0, totalPrizeValue, MiniSlot_Main.scope.effectGoldAdd);
                MiniSlot_Main.scope.getLineWin();
            } else {
                // Thua sach
                cc.log("MiniSlot_Main Lose");
                MiniSlot_Main.scope.resetCanSpin();

                if (MiniSlot_Main.scope.isMinimizeGame) {
                    Global.BtnMiniGame.effectFlyMoneyMiniSize(MiniSlot_Main.scope.moneyChange, GAME_TYPE.MINI_SLOT);
                }
                // MiniSlot_Main.scope.setUserGold(MiniSlot_Main.scope.moneyChange);
                // MiniSlot_Main.scope.moneyChange = 0;

                require("WalletController").getIns().TakeBalance(GAME_TYPE.MINI_SLOT);

                if (MiniSlot_Main.scope.isSpinAuto) {
                    if (MiniSlot_Main.scope.offAutoSpin) {
                        MiniSlot_Main.scope.resetStateOffAuto();
                    } else {
                        if (MiniSlot_Main.scope.getUserGold() >= MiniSlot_Main.scope.spinBet * MiniSlot_Main.scope.betLineCount) {
                            MiniSlot_Main.scope.setCanSpinManual(false);
                            MiniSlot_Main.scope.setCanChooseBet(false);
                            MiniSlot_Main.scope.requestSpin();
                        } else {
                            cc.log("MiniSlot Khong du tien de quay !");
                            MiniSlot_Main.scope.resetSpinState();
                            MiniSlot_Main.scope.showPopupNotify();
                        }
                    }
                } else {
                    MiniSlot_Main.scope.isSpining = false;
                }
            }
        } else {
            // Jackpot
            cc.log("MiniSlot_Main Jackpot");
            MiniSlot_Main.scope.offAutoSpin = true;
            MiniSlot_Main.scope.effectJackpot.active = true;
            // MiniSlot_Main.scope.effectJackpot.children[0].getComponent("sp.Skeleton").setAnimation(0, 'animation', true);
            MiniSlot_Main.scope.fxGoldChange(0, totalPrizeValue, MiniSlot_Main.scope.effectJackpot.children[1]);
            MiniSlot_Main.scope.getLineWin();
        }
    },

    closeFxJackpot() {
        MiniSlot_Main.scope.effectJackpot.active = false;
    },

    getLineWin() {
        // Get line win
        var prizeData = MiniSlot_Main.scope.resSpin[3];
        cc.log("MiniSlot_Main prizeData : ", prizeData);
        if (prizeData.length > 0) {
            cc.log("MiniSlot_Main getLineWin prizeData > 0");
            var arrRaw = prizeData.split(";");
            var arrLineWin = [];
            cc.log("MiniSlot_Main arrRaw : ", arrRaw);
            for (let index = 0; index < arrRaw.length; index++) {
                var arrParam = arrRaw[index].split(",");
                cc.log("MiniSlot_Main arrParam : ", arrParam);
                arrLineWin.push(parseInt(arrParam[0]));
            }
            cc.log("MiniSlot_Main getLineWin arrLineWin : ", arrLineWin);

            if (arrLineWin.length > 0) {
                MiniSlot_Main.scope.showLineWin(arrLineWin);
                // if (MiniSlot_Main.scope.isSpinFlash || MiniSlot_Main.scope.isSpinAuto) {
                if (MiniSlot_Main.scope.isSpinAuto) {
                    // Show all line
                    MiniSlot_Main.scope.delayTimeShowEachLine = 0;
                } else {
                    // Show each line
                    MiniSlot_Main.scope.delayTimeShowEachLine = 1.2 / arrLineWin.length; // 0.5
                    // MiniSlot_Main.scope.delayTimeShowEachLine = 0;
                }
            } else {
                // Neu game co kieu An cac Item Bonus thi van co line an nhung prizeData lai = 0
            }
        } else {
            cc.log("MiniSlot_Main getLineWin prizeData <= 0 : Vo li, can check lai response vi gold change > 0 ma lai k co res line win");
            require("WalletController").getIns().TakeBalance(GAME_TYPE.MINI_SLOT);
            MiniSlot_Main.scope.resetCanSpin();
            if (MiniSlot_Main.scope.isSpinAuto) {
                if (MiniSlot_Main.scope.offAutoSpin) {
                    MiniSlot_Main.scope.resetStateOffAuto();
                } else {
                    if (MiniSlot_Main.scope.getUserGold() >= MiniSlot_Main.scope.spinBet * MiniSlot_Main.scope.betLineCount) {
                        MiniSlot_Main.scope.setCanSpinManual(false);
                        MiniSlot_Main.scope.setCanChooseBet(false);
                        MiniSlot_Main.scope.requestSpin();
                    } else {
                        cc.log("MiniSlot Khong du tien de quay !");
                        MiniSlot_Main.scope.resetSpinState();
                        MiniSlot_Main.scope.showPopupNotify();
                    }
                }
            }
        }
    },

    showLineWin(arrLineWin) {
        setTimeout(function () {
            // Hide all line
            MiniSlot_Main.scope.hideAllLineEat();

            // show each line eat and hide it if win
            cc.log(arrLineWin);
            let timeOut = 500 + (MiniSlot_Main.scope.delayTimeShowEachLine * arrLineWin.length * 1000);
            let timeShowLine = MiniSlot_Main.scope.delayTimeShowEachLine;
            if(MiniSlot_Main.scope.isSpinFlash){
                timeOut = timeOut/2;
                timeShowLine = timeShowLine / 2;
            }
            
            for (let index = 0; index < arrLineWin.length; index++) {
                cc.log("index:"+index);
                MiniSlot_Main.scope.nodeUse2ShowLineWin.runAction(
                    cc.sequence(
                        cc.delayTime(timeShowLine * index),
                        cc.callFunc(function () {
                            // if (!MiniSlot_Main.scope.isSpining) {
                            var lineId = arrLineWin[index];
                            cc.log("MiniSlot_Main lineId : ", lineId);
                            // if (MiniSlot_Main.scope.delayTimeShowEachLine !== 0) {
                            //     MiniSlot_Main.scope.hideAllLineEat();
                            // }
                            MiniSlot_Main.scope.listLineEat.children[lineId - 1].active = true;
                            // }
                        })
                    )
                );
            }

            

            //  show 12 icon after show all line eat
            setTimeout(function () {
                MiniSlot_Main.scope.resetCanSpin();

                if (MiniSlot_Main.scope.isMinimizeGame) {
                    Global.BtnMiniGame.effectFlyMoneyMiniSize(MiniSlot_Main.scope.moneyChange, GAME_TYPE.MINI_SLOT);
                }
                // MiniSlot_Main.scope.setUserGold(MiniSlot_Main.scope.moneyChange);
                // MiniSlot_Main.scope.moneyChange = 0;
                require("WalletController").getIns().TakeBalance(GAME_TYPE.MINI_SLOT);
                if (MiniSlot_Main.scope.isSpinAuto) {
                    if (MiniSlot_Main.scope.offAutoSpin) {
                        MiniSlot_Main.scope.resetStateOffAuto();
                    } else {
                        if (MiniSlot_Main.scope.getUserGold() >= MiniSlot_Main.scope.spinBet * MiniSlot_Main.scope.betLineCount) {
                            MiniSlot_Main.scope.setCanSpinManual(false);
                            MiniSlot_Main.scope.setCanChooseBet(false);
                            MiniSlot_Main.scope.requestSpin();
                        } else {
                            cc.log("MiniSlot Khong du tien de quay !");
                            MiniSlot_Main.scope.resetSpinState();
                            MiniSlot_Main.scope.showPopupNotify();
                        }
                    }
                }
            }, timeOut);
        }, MiniSlot_Main.scope.delayTimeForShowEffect);
    },

    hideAllLineEat() {
        for (let index = 0; index < 20; index++) {
            MiniSlot_Main.scope.listLineEat.children[index].active = false;
        }
    },

    chooseBet(toggle) {
        cc.log("MiniSlot_Main chooseBet");
        var index = this.btnBet.indexOf(toggle);
        this.spinBet = this.arrBet[index];
        this.spinRoom = index + 1;
        this.requestGetJackpotInfo();
        cc.log("MiniSlot_Main spinBet : ", this.spinBet);
        cc.log("MiniSlot_Main spinRoom : ", this.spinRoom);
    },

    setCanChooseBet(state) {
        for (let index = 0; index < 3; index++) {
            this.btnBet[index].interactable = state;
        }
    },

    setCanSpinManual(state) {
        MiniSlot_Main.scope.btnManual.getComponent(cc.Button).interactable = state;
        // MiniSlot_Main.scope.btnManual.children[0].getComponent(cc.Sprite).spriteFrame = MiniSlot_Main.scope.spriteSpinManual[state ? 0 : 1];
    },

    fxGoldChange(goldStart, goldEnd, node) {
        var goldAdd = goldEnd - goldStart;
        node.getComponent(cc.Label).string = MiniSlot_Main.scope.formatGold(goldStart);

        var steps = 10;
        var deltaGoldAdd = Math.floor(goldAdd / steps);

        var rep = cc.repeat(
            cc.sequence(
                cc.delayTime(0.05),
                cc.callFunc(function () {
                    goldStart += deltaGoldAdd;
                    node.getComponent(cc.Label).string = MiniSlot_Main.scope.formatGold(goldStart);
                }),
            ), steps);
        var seq = cc.sequence(rep, cc.callFunc(function () {
            goldStart = goldEnd;
            node.getComponent(cc.Label).string = MiniSlot_Main.scope.formatGold(goldStart);
        }));
        node.runAction(seq);
    },

    // Spin Manual
    GameSpinManual() {
        MiniSlot_Main.scope.resetFx();
        if (MiniSlot_Main.scope.betLineCount > 0) {
            cc.log("MiniSlot GameSpinManual betLineCount > 0");
            if (MiniSlot_Main.scope.getUserGold() >= MiniSlot_Main.scope.spinBet * MiniSlot_Main.scope.betLineCount) {
                MiniSlot_Main.scope.isSpinAuto = false;
                // MiniSlot_Main.scope.isSpinFlash = false;
                MiniSlot_Main.scope.setCanSpinManual(false);
                MiniSlot_Main.scope.setCanChooseBet(false);
                MiniSlot_Main.scope.requestSpin();
            } else {
                cc.log("MiniSlot Khong du tien de quay !");
                MiniSlot_Main.scope.showPopupNotify();
            }
        } else {
            cc.log("MiniSlot GameSpinManual betLineCount = 0");
            MiniSlot_Main.scope.showWarmingChooseLine();
        }
    },

    // Spin Auto 
    GameSpinAuto(toggle) {
        cc.log("check flash:"+MiniSlot_Main.scope.isSpinFlash);
        cc.log("MiniSlot_Main GameSpinAuto : ", toggle.isChecked);
        MiniSlot_Main.scope.isSpinAuto = toggle.isChecked;
        MiniSlot_Main.scope.resetFx();
        if (toggle.isChecked) {
            MiniSlot_Main.scope.setCanChooseBet(false);
            MiniSlot_Main.scope.setCanSpinManual(false);
            if (!MiniSlot_Main.scope.isSpining) {
                cc.log("MiniSlot_Main GameSpinAuto !isSpining");
                if (MiniSlot_Main.scope.getUserGold() >= MiniSlot_Main.scope.spinBet * MiniSlot_Main.scope.betLineCount) {
                    MiniSlot_Main.scope.requestSpin();
                } else {
                    cc.log("MiniSlot Khong du tien de quay !");
                    MiniSlot_Main.scope.resetSpinState();
                    MiniSlot_Main.scope.showPopupNotify();
                }
            } else {
                cc.log("MiniSlot_Main GameSpinAuto isSpining");
            }
        } else {
            if (!MiniSlot_Main.scope.isSpining) {
                MiniSlot_Main.scope.resetCanSpin();
            }
        }
    },

    GameSpinFlash(toggle) {
        cc.log("MiniSlot_Main GameSpinFlash : ", toggle.isChecked);
        MiniSlot_Main.scope.isSpinFlash = toggle.isChecked;
        MiniSlot_Main.scope.resetFx();
        if (toggle.isChecked) {
            MiniSlot_Main.scope.btnAuto.isChecked = true;
            MiniSlot_Main.scope.GameSpinAuto(MiniSlot_Main.scope.btnAuto);
        }
    },

    // ChooseLine
    showPopupChooseLines() {
        if (!MiniSlot_Main.scope.isSpining) {
            cc.log("MiniSlot_Main showPopupChooseLines ! isSpining");
            this.popupChooseLines.active = true;
            var listBet = this.popupChooseLines.children[4];
            for (let index = 0; index < 20; index++) {
                const child = listBet.children[index];
                if (this.arrLineSelected[index] > 0) {
                    cc.log("Show Line Bet : ", index);
                    child.children[1].active = false;
                } else {
                    child.children[1].active = true;
                }
            }
        } else {
            cc.log("MiniSlot_Main showPopupChooseLines isSpining");
        }
    },

    closePopupChooseLines() {
        this.popupChooseLines.active = false;
        this.labelLineCount.string = this.betLineCount;
    },

    chooseLine(event, index) {
        cc.log("MiniSlot chooseLine : ", index);
        var ID = parseInt(index);
        var line = this.popupChooseLines.children[4].children[ID - 1];
        if (line.children[1].active) {
            // Chon dong nay
            line.children[1].active = false;
            this.betLineCount += 1;
            this.arrLineSelected[ID - 1] = ID;
        } else {
            // Khong cho dong nay
            line.children[1].active = true;
            this.betLineCount -= 1;
            this.arrLineSelected[ID - 1] = -1;
        }
        cc.log(this.arrLineSelected);
    },

    chooseLineChan() {
        this.stateBetLineChan(false);
        this.stateBetLineLe(true);
        this.betLineCount = 10;
        for (let index = 0; index < 20; index++) {
            if ((index + 1) % 2 == 0) {
                this.arrLineSelected[index] = index + 1;
            } else {
                this.arrLineSelected[index] = -1;
            }
        }
    },

    chooseLineLe() {
        this.stateBetLineChan(true);
        this.stateBetLineLe(false);
        this.betLineCount = 10;
        for (let index = 0; index < 20; index++) {
            if ((index + 1) % 2 == 1) {
                this.arrLineSelected[index] = index + 1;
            } else {
                this.arrLineSelected[index] = -1;
            }
        }
    },

    chooseAllLine() {
        this.stateBetLineChan(false);
        this.stateBetLineLe(false);
        this.betLineCount = 20;
        for (let index = 0; index < 20; index++) {
            this.arrLineSelected[index] = index + 1;
        }
    },

    deleteAllLine() {
        this.stateBetLineChan(true);
        this.stateBetLineLe(true);
        this.betLineCount = 0;
        for (let index = 0; index < 20; index++) {
            this.arrLineSelected[index] = -1;
        }
    },

    stateBetLineChan(isVisible) {
        var listBet = this.popupChooseLines.children[4];
        for (let index = 0; index < 10; index++) {
            listBet.children[2 * index + 1].children[1].active = isVisible;
        }
    },

    stateBetLineLe(isVisible) {
        var listBet = this.popupChooseLines.children[4];
        for (let index = 0; index < 10; index++) {
            listBet.children[2 * index].children[1].active = isVisible;
        }
    },

    // Show popup
    showPopupHistory() {
        if (Global.HistoryMiniSlot) {
            Global.HistoryMiniSlot.getComponent("DragPopup").setFirtIndex();
            return;
        }

        Global.UIManager.showMiniLoading();
        cc.loader.loadRes("PopupMiniGame/MiniSlot/MS_PopupHistory", (err, prefab) => {
            if (err) return;
            Global.UIManager.hideMiniLoading();
            Global.UIManager.parentMiniGame.addChild(cc.instantiate(prefab));
        })
    },

    showPopupRank() {
        if (Global.RankMiniSlot) {
            Global.RankMiniSlot.getComponent("DragPopup").setFirtIndex();
            return;
        }

        Global.UIManager.showMiniLoading();
        cc.loader.loadRes("PopupMiniGame/MiniSlot/MS_PopupRank", (err, prefab) => {
            if (err) return;
            Global.UIManager.hideMiniLoading();
            Global.UIManager.parentMiniGame.addChild(cc.instantiate(prefab));
        })
    },

    showGuide(event) {
        if (Global.GuideMiniSlot) {
            Global.GuideMiniSlot.getComponent("DragPopup").setFirtIndex();
            return;
        }

        Global.UIManager.showMiniLoading();
        cc.loader.loadRes("PopupMiniGame/MiniSlot/MS_PopupGuide", (err, prefab) => {
            if (err) return;
            Global.UIManager.hideMiniLoading();
            Global.UIManager.parentMiniGame.addChild(cc.instantiate(prefab));
        })
    },

    showPopupNotify() {
        this.popupNotify.active = true;
    },

    closePopupNotify() {
        this.popupNotify.active = false;
    },

    showWarmingChooseLine() {
        MiniSlot_Main.scope.popupWarmingChooseLine.active = true;
        setTimeout(function () {
            MiniSlot_Main.scope.popupWarmingChooseLine.active = false;
        }, 1000);
    },

    // Reset state
    resetSpinState() {
        MiniSlot_Main.scope.resetCanSpin();
        MiniSlot_Main.scope.btnAuto.isChecked = false;
        MiniSlot_Main.scope.btnFlash.isChecked = false;
        MiniSlot_Main.scope.isSpinAuto = false;
        MiniSlot_Main.scope.isSpinFlash = false;
    },

    resetCanSpin() {
        MiniSlot_Main.scope.setCanChooseBet(true);
        MiniSlot_Main.scope.setCanSpinManual(true);
        MiniSlot_Main.scope.isSpining = false;
    },

    resetStateOffAuto() {
        MiniSlot_Main.scope.btnAuto.isChecked = false;
        MiniSlot_Main.scope.btnFlash.isChecked = false;
        MiniSlot_Main.scope.isSpining = false;
        MiniSlot_Main.scope.isSpinAuto = false;
        MiniSlot_Main.scope.isSpinFlash = false;
    },

    resetChooseBet() {
        this.btnBet[0].isChecked = true;
        this.btnBet[1].isChecked = false;
        this.btnBet[2].isChecked = false;
        this.btnBet[3].isChecked = false;
    },

    resetIcon() {
        for (let a = 0; a < 20; a++) {
            MiniSlot_Main.scope.listLineEat.children[a].active = false;
        }
    },

    resetFx() {
        MiniSlot_Main.scope.effectGoldAdd.active = false;
        MiniSlot_Main.scope.effectJackpot.active = false;
    },

    // Update Gold
    setUserGold(deltaGold) {
        require("GameManager").getIns().removeDelay(GAME_TYPE.MINI_SLOT, deltaGold);
    },

    getUserGold() {
        return MainPlayerInfo.ingameBalance;
    },

    // Request
    requestGetJackpotInfo() {
        cc.log("MiniSlot_Main requestGetJackpotInfo");
        require("SendRequest").getIns().MST_Client_MiniSlot_Get_Jackpot_Info();
    },

    requestSpin() {
        cc.log("MiniSlot_Main requestSpin");

        MiniSlot_Main.scope.hideAllLineEat();
        MiniSlot_Main.scope.isSpining = true;
        MiniSlot_Main.scope.offAutoSpin = false;

        let lineData = "";
        let arrReal = [];
        for (let index = 0; index < 20; index++) {
            if (MiniSlot_Main.scope.arrLineSelected[index] > -1) {
                arrReal.push(MiniSlot_Main.scope.arrLineSelected[index]);
            }
        }

        for (let index = 0; index < arrReal.length; index++) {
            lineData += arrReal[index];
            if (index < arrReal.length - 1) {
                lineData += ",";
            }
        }
        cc.log("MiniSlot_Main requestSpin lineData : ", lineData)

        let data = {};
        data[1] = MiniSlot_Main.scope.spinRoom;
        data[2] = lineData;
        cc.log("MiniSlot_Main data : ", JSON.stringify(data));
        require("SendRequest").getIns().MST_Client_MiniSlot_Spin(data);
    },

    // Utils
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    formatGold(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    sendConfig() {
        let data = {};
        data[1] = this.edtSpinResult.string;
        data[2] = 0;
        data[10] = GAME_TYPE.MINI_SLOT;
        cc.log("BoomSlot_Main sendConfig : ", JSON.stringify(data));

        this.edtSpinResult.string = "";
    }

    // update (dt) {},
});
