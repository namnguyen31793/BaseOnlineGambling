
var GameLogic = require("GameLogic");
var FishNetworkManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new FishNetworkManager();
            return this.self;
        }
    },

    properties: {
        gamelogic: null,
    },

    HandleResponse(operationResponse) {
        var data = operationResponse;
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        // cc.log("fish:"+responseCode);
        switch (responseCode) {
            //201 - nổ jackpot
            case Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT:
                this.HandleTakeJackpot(packet);
                break;
            //202 - xóa cá jackpot trong bàn
            case Global.Enum.RESPONSE_CODE.MST_SERVER_REMOVE_JACKPOT:
                this.HandleRemoveJackpot(packet);
                break;
            //203 - danh sách cá mới
            case Global.Enum.RESPONSE_CODE.MST_SERVER_CREATE_FISH:
                this.HandleCreateFish(packet);
                break;
            //204 - lắng nghe bắn đạn
            case Global.Enum.RESPONSE_CODE.MST_SERVER_SHOOTING:
                this.HandleShooting(packet);
                break;
            //205 - không tìm thấy con cá này
            case Global.Enum.RESPONSE_CODE.MST_SERVER_NOT_FIND_FISH:
                this.HandleNotFindFish(packet);
                break;
            //206 - chết cá
            case Global.Enum.RESPONSE_CODE.MST_SERVER_FISH_DEATH:
                this.HandleFishDeath(packet);
                break;
            //207 - đổi súng
            case Global.Enum.RESPONSE_CODE.MST_SERVER_CHANGE_GUN:
                this.HandleChangeGun(packet);
                break;
            //208 - clear đi 1 con cá type đặc biệt
            case Global.Enum.RESPONSE_CODE.MST_SERVER_SEND_CLEAR_SPECIAL_FISH:
                this.HandleClearSpecialFish(packet);
                break;
            //209 - nhận được vật phẩm
            case Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_ITEM:
                this.HandleTakeItemInfo(packet);
                break;
            //210 - sử dụng vật phẩm
            case Global.Enum.RESPONSE_CODE.MST_SERVER_USING_ITEM:
                this.HandleUsingItem(packet);
                break;
            //211 - lấy thông tin về item(số lượng)
            case Global.Enum.RESPONSE_CODE.MST_SERVER_GET_ITEM_INFO:
                this.HandleGetItemInfo(packet);
                break;
            //213 - xóa toàn bộ cá thường trong bàn
            case Global.Enum.RESPONSE_CODE.MST_SERVER_CLEAR_ALL_NORMAL_FISH:
                this.HandleClearAllNormalFish(packet);
                break;
            //221 - đóng băng cá trong bàn
            case Global.Enum.RESPONSE_CODE.MST_SERVER_ICE_ITEM:
                this.HandleItemIce(packet);
                break;
            //222 - đánh dấu cá điện đã chết, client truyền lên list những con cá xung quanh cá điện
            case Global.Enum.RESPONSE_CODE.MST_SERVER_KILL_ELECTRIC_FISH_AFFECT:
                this.HandleElectricFishAffect(packet);
                break;
            //223 - chết cá điện (bao gồm 1 số con xung quanh)
            case Global.Enum.RESPONSE_CODE.MST_SERVER_KILL_ELECTRIC_FISH:
                this.HandleKillElectricFish(packet);
                break;
            //224 - chết cá mang quà
            case Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_REWARD_BOX_FISH:
                this.HandleTakeRewardBoxFish(packet);
                break;
            //225 - sử dụng súng đặc biệt (chuyển trạng thái)
            case Global.Enum.RESPONSE_CODE.MST_SERVER_USING_SPECIAL_BULLET:
                this.HandleUseSpecialGun(packet);
                break;
            //226 - bắn súng đặc biệt
            case Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_REWARD_SPECIAL_BULLET:
                this.HandleSpecialGunKillFish(packet);
                break;
            //228 - lấy thông tin về vật phẩm sử dụng bằng kim cương
            case Global.Enum.RESPONSE_CODE.MST_SERVER_GET_USER_ITEM_INFO:
                this.HandleGetCurrentItemInfo(packet);
                break;
            //229 - xóa cá theo id
            case Global.Enum.RESPONSE_CODE.MST_SERVER_REMOVE_FISH_BY_ID:
                this.HandleNotFindFish(packet);
                break;
            //230 - lấy thông tin về grand jackpot
            case Global.Enum.RESPONSE_CODE.MST_SERVER_GRAND_JACKPOT_INFO:
                this.HandleGrandJackpotInfo(packet);
                break;
            //231 - nổ grand jackpot
            case Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_GRAND_JACKPOT:
                this.HandleTakeGrandJackpot(packet);
                break;
            //233 - người chơi vào phòng
            case Global.Enum.RESPONSE_CODE.MST_SERVER_PLAYER_JOIN_ROOM:
                this.HandleJoinGameNormal(packet);
                break;
            //234 - người khác vào phòng
            case Global.Enum.RESPONSE_CODE.MST_SERVER_ANOTHER_PLAYER_JOIN_ROOM:
                this.HandleOtherJoinGameNormal(packet);
                break;
            //235 - người chơi thoát phòng
                case Global.Enum.RESPONSE_CODE.MST_SERVER_PLAYER_LEAVE_ROOM:
                this.HandleLeaveRoom(packet);
                break;
            //236 - người khác thoát phòng
                case Global.Enum.RESPONSE_CODE.MST_SERVER_PLAYER_ANOTHER_LEAVEROOM:
                this.HandleOtherExitRoom(packet);
                break;
            //238 - lấy thông tin cá đặc biệt đang chơi
            case Global.Enum.RESPONSE_CODE.MST_SERVER_SPECIAL_FISH_GET_INFO:
                this.HandleGetInfoSpecialTurn(packet);
                break;
            //239 - chơi trong turn cá đặc biệt
            case Global.Enum.RESPONSE_CODE.MST_SERVER_SPECIAL_FISH_PLAY:
                this.HandlePlaySpecialTurn(packet);
                break;
            //240 - other bắn chết cá
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_BOT_FISH_COLLISION:
                this.HandleOtherKillFish(packet);
                break;
            //241 - đạt đặc biệt
            case Global.Enum.RESPONSE_CODE.MST_SERVER_SPECIAL_GUN_GET_INFO:
                this.HandleGetSpecialGunInfo(packet);
                break;
            //242 - dùng súng đặc biệt
            case Global.Enum.RESPONSE_CODE.MST_SERVER_SPECIAL_GUN_PLAY:
                this.HandlePlaySpecialGunTurn(packet);
                break;
            //243 - lấy giá trị jackpot
            case Global.Enum.RESPONSE_CODE.MST_SERVER_JACKPOT_GET_INFO:
                this.HandleGetJackpotInfo(packet);
                break;
            //244 - lấy thông tin mission
            case Global.Enum.RESPONSE_CODE.MST_SERVER_FISH_MISSION_GET_CURRENT_MISSION_INFO:
                this.HandleGetCurrentMissionInfo(packet);
                break;
            //245 - trả về thông tin thưởng mission
            case Global.Enum.RESPONSE_CODE.MST_SERVER_FISH_MISSION_GET_ACCOUNT_REWARD:
                this.HandleGetAccountRewardMission(packet);
                break;
            //246 - 
            case Global.Enum.RESPONSE_CODE.MST_SERVER_FISH_MISSION_TAKE_ACCOUNT_REWARD:
                this.HandleGetTakeRewardMission(packet);
                break;
            //246 - 
            case Global.Enum.RESPONSE_CODE.MST_SERVER_FISH_MISSION_GET_MISSION_CONFIG:
                this.HandleGetMissionConfig(packet);
                break;
            //248 - 
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_DEATH_MULTI_FISH:
                this.HandleDeathMultiFish(packet);
                break;
            default:
                break;
        }
    },

    //normal game
    HandleCreateFish(packet) {
        // return
        let fishPropertiesData = packet[1];
        let lishFishProperties = [];
        for (let i = 0; i < fishPropertiesData.length; i++) {
            lishFishProperties[i] = JSON.parse(fishPropertiesData[i]);
        }
        cc.log(lishFishProperties);
        this.gamelogic.CreateFish(lishFishProperties);
    },

    HandleShooting(packet) {
        let shotInfo = packet[1];
        // let playerMoney = packet[2];
        // Global.GameLogic.mainActor.maxBalance = playerMoney;
        // let jackpotValue = packet[3];
        // let freeBulletAmount = packet[4];
        this.gamelogic.Shooting(shotInfo);
    },

    HandleFishDeath(packet) {
        // console.log(packet);
        // cc.log(packet);
        let fishInfo = packet[1].split(",");
        let playerId = packet[2];
        let playerMoney = packet[3];
        let fishValue = packet[4];
        let jackpotValue = packet[5];
        let normalValue = packet[6];
        let specialValue = packet[7];
        let heso = packet[8];
        let rewardDescription = packet[9];

        if(playerId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = playerMoney;

        let fishType = parseInt(fishInfo[3]);
      
        if(fishType == CONFIG.ELECTRIC_FISH_TYPE){
            Global.ServerBot.modulePlayEffect.PlayEffectKillElectricFish(fishInfo[0], playerId, fishValue, normalValue, specialValue);
        } else if(fishType == CONFIG.FISH_BOOM_TYPE){
            Global.ServerBot.modulePlayEffect.PlayEffectKillBoomFish(fishInfo[0], playerId, fishValue, normalValue, specialValue);
        } else if(fishType == CONFIG.DRILL_FISH_TYPE || fishType == CONFIG.LAZE_FISH_TYPE){
            this.gamelogic.KillGunFish(playerId, fishInfo[0], fishValue);
        } else {
          
             this.gamelogic.KillFish(fishInfo[0], playerId, fishValue, heso,rewardDescription);
        }
        if(rewardDescription != '') {
            // console.log(rewardDescription);
            // if(rewardDescription.length > 7) {
            //     let itemInfo = JSON.parse(rewardDescription);
            //     console.log(itemInfo);
            //     this.gamelogic.TakeItemInfo(itemInfo, fishInfo[0], playerId);
            // } else {
            //     let multi = parseInt(rewardDescription);
            //     Global.SammuraiController.multi = multi;
            // }
            let descriptionModel =  JSON.parse(rewardDescription);
            if(descriptionModel.Description_Type == 1)
            { 
                let descriptionString = descriptionModel.Description_String;
                let itemInfo = JSON.parse(descriptionString);
                cc.log(itemInfo);
                this.gamelogic.TakeItemInfo(itemInfo, fishInfo[0], playerId);
            }
            else if(descriptionModel.Description_Type == 2 && (fishType == CONFIG.SAMMURAI_LEVEL_1 || fishType == CONFIG.SAMMURAI_LEVEL_2 || fishType == CONFIG.SAMMURAI_LEVEL_3))
            {
                let multi = parseInt(descriptionModel.Description_String);
                Global.SammuraiController.multi = multi;
            }
        }
        
    },

    HandleOtherKillFish(packet) {
        let fishInfo = packet[1].split(",");
        let fishValue = packet[2];
        let jackpotValue = packet[3];
        let normalValue = packet[4];
        let specialValue = packet[5];
        let heso = packet[6];
        let rewardDescription = packet[7];

        let fishType = parseInt(fishInfo[3]);
        if(fishType == CONFIG.ELECTRIC_FISH_TYPE){
            Global.ServerBot.modulePlayEffect.PlayEffectKillElectricFish(fishInfo[0], fishInfo[4], fishValue, normalValue, specialValue);
        } else if(fishType == CONFIG.FISH_BOOM_TYPE){
            Global.ServerBot.modulePlayEffect.PlayEffectKillBoomFish(fishInfo[0], fishInfo[4], fishValue, normalValue, specialValue);
        } else if(fishType == CONFIG.DRILL_FISH_TYPE || fishType == CONFIG.LAZE_FISH_TYPE){
            this.gamelogic.KillGunFish(fishInfo[4], fishInfo[0], fishValue);
        } else if(fishType == CONFIG.CARD_TYPE || fishType == CONFIG.LUCKY_BOX_TYPE || fishType == CONFIG.WHEEL_TYPE || fishType == CONFIG.SAMMURAI_LEVEL_1
            || fishType == CONFIG.SAMMURAI_LEVEL_2 || fishType == CONFIG.SAMMURAI_LEVEL_3|| fishType == CONFIG.TYPE_FISH_FROG_1M|| fishType == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_BLACK_DRAGON
            || fishType == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_PHOENIX      
            || fishType == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_BUDDHA){
            this.gamelogic.BotKillSpecialFish(fishType, fishInfo[4], fishInfo[0], fishValue);
        } else {          
            this.gamelogic.KillFish(fishInfo[0], fishInfo[4], fishValue, heso,rewardDescription);
        }
    },

    HandleChangeGun(packet) {
        let newGunId = packet[1];
        let playerId = packet[2];
        this.gamelogic.ChangeGun (newGunId, playerId);
    },
    //end normal game

    //jackpot fish
    HandleTakeJackpot(packet) {
        // cc.log(packet);
        let playerId = packet[1];
        let shootingActorBalance = packet[2];
        let fishId = packet[3];
        let jackpotPrizeValue = packet[4];
        let totalJackpotValue = packet[5];
        let accountVipBonusValue = packet[6];
        let newTakeJackpotValue = packet[7];
        this.gamelogic.TakeJackpot(playerId, shootingActorBalance, fishId, jackpotPrizeValue, totalJackpotValue, accountVipBonusValue, newTakeJackpotValue);
    },

    HandleRemoveJackpot(packet) {
        let fishType = packet[1];
        this.gamelogic.ClearSpecialFish(fishType);
    },
    //end jackpot fish

    //clear fish
    HandleClearSpecialFish(packet) {
        let fishType = packet[1];
        this.gamelogic.ClearSpecialFish(fishType);
    },

    HandleClearAllNormalFish(packet) {
        this.gamelogic.ClearAllNormalFish();
    },

    HandleNotFindFish(packet) {
        let fishId = packet[1];
        cc.log("not find fish:"+fishId);
        this.gamelogic.NotFindFish (fishId);
    },
    //end clear fish

    //item
    HandleGetItemInfo(packet) {
        cc.log(packet);
        let itemModel = JSON.parse(packet[1]);
        this.gamelogic.GetItemInfo(itemModel);
    },

    HandleItemIce(packet) {
        let UnTimeSkipDate = packet[1];
        this.gamelogic.UseItemIce (UnTimeSkipDate);
    },

    HandleUsingItem(packet) {
        let playerId = packet[1];
        let typeItem = packet[2];
        this.gamelogic.UsingItem(playerId, typeItem);
        let itemModel = JSON.parse(packet[3]);
        this.gamelogic.GetItemInfo(itemModel);
    },

    HandleTakeItemInfo(packet) {
        cc.log("take item")
        cc.log(packet);
        let itemModel = JSON.parse(packet[1]);
        let itemId = packet[2];
        this.gamelogic.TakeItemInfo (itemModel, itemId);
    },
    //end item

    //special gun
    HandleUseSpecialGun(packet) {
        let specialGunKey = packet[1];
        let gunSpecialType = packet[2];
        let currentFreeAmout = packet[3];
        let accountId = packet[4];
        this.gamelogic.SetKey (specialGunKey, accountId, gunSpecialType, currentFreeAmout);
    },

    HandleSpecialGunKillFish(packet) {
        let accountId = packet[1];
        let totalReward = packet[2];
        let deathFishIds = packet[3];
        let deathFishRewards = packet[4];
        let accountBalance = packet[5];
        if(accountId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        this.gamelogic.SpeicalGunKillFish (accountId, totalReward, deathFishIds, deathFishRewards, accountBalance);
    },

    HandleStartShootSpecialGun(packet) {
        let data = packet[1];
        this.gamelogic.StartShootSpecialGun (data);
    },
    //end special gun

    //electric fish
    HandleElectricFishAffect(packet) {
        let fishId = packet[1];
        let  electricDeathKey = packet[2];
        this.gamelogic.GetAffectElectricFish (fishId, electricDeathKey);
    },

	HandleKillElectricFish(packet) {
        let accountId = packet[1];
        let totalReward = packet[2];
        let deathFishIds = packet[3];
        let deathFishRewards = packet[4];
        let accountBalance = packet[5];
        let accumulationFreeNormalRation = packet[6];
        let electricFishId = packet[7];
        if(accountId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        this.gamelogic.KillElectricFish (accountId, totalReward, deathFishIds, deathFishRewards, accountBalance, accumulationFreeNormalRation, electricFishId);
    },
    //end electric fish

    //reward fish
    HandleTakeRewardBoxFish(packet) {
        let accountId = packet[1];
        let accountBalance = packet[2];
        let fishId = packet[3];
        let reward = JSON.parse(packet[4]);
        if(accountId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        this.gamelogic.KillFishReward (fishId, accountId, accountBalance, reward);
    },
    //end reward fish

    //join room
    HandleJoinGameNormal(packet) {
        cc.log("handle join game");
        let actorPropertiesStringArray = packet[1];
        let roomStringProperties = packet[2];
        let currentJackporValue = packet[3];
        let mainActorPropertiesString = packet[4];
        let accountBalance = packet[5];
        this.gamelogic = new GameLogic();
        Global.GameLogic = this.gamelogic;
        let actorPropertiesArray = [];
        for (let i = 0; i < actorPropertiesStringArray.length; i++) {
            actorPropertiesArray[i] = JSON.parse(actorPropertiesStringArray[i]);
        }
        let mainActor = JSON.parse(mainActorPropertiesString);
        mainActor.AccountBalance = accountBalance;
        let roomProperties = JSON.parse(roomStringProperties);
        this.gamelogic.CreateIngameNormal(mainActor, actorPropertiesArray, currentJackporValue, roomProperties);
        
        Global.UIManager.hideLoading();
        if(CONFIG.MULTI_PLAYER) {
            Global.UIManager.hideLoading();
            let rand = Global.RandomNumber(0, 100);
            if(rand < 50)
                Global.InGameView.ChangeBackground(false, 8);
            else
                Global.InGameView.ChangeBackground(false, 9);
        } else {
            Global.ServerBot.StartServer();
        }
    },

    HandleOtherJoinGameNormal(packet) {
        console.log(packet);
        let otherActor = JSON.parse(packet[1]);
        this.gamelogic.CreateOtherJoinRoom(otherActor);
    },
    //end join room

    //quit room
    HandleLeaveRoom(packet) {
        cc.log(packet);
        let accountBalance = packet[1];
        this.gamelogic.LeaveRoom(accountBalance);
    },

    HandleOtherExitRoom(packet) {
        let otherActorProperties = JSON.parse(packet[1]);
        this.gamelogic.OtherExitRoom(otherActorProperties);
    },
    //end quit room

    //diamond
    HandleGetCurrentItemInfo(packet) {
        let data = packet[1];
        let listItemDiamond = [];
        for (let i = 0; i < data.length; i++) {
            listItemDiamond[i] = JSON.parse(data[i]);
        }
        // this.gamelogic.UpdateItemDiamond(listItemDiamond);
    },
    //end diamond

    //grand jackpot
    HandleGrandJackpotInfo(packet) {
        this.gamelogic.UpdateGrandJackpotInfo(packet);
    },

    HandleTakeGrandJackpot(packet) {
        let accountId = packet[1];
        let jackpotValue = packet[2];
        let accountBalance = packet[3];
        let newJackpot = packet[4];
        if(accountId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        this.gamelogic.TakeGrandJackpot(accountId, jackpotValue, accountBalance, newJackpot);
    },
    //end grand jackpot

    //special turn
    HandleGetInfoSpecialTurn(packet) {
        cc.log(packet);
        let accountId = packet[1];
        let specialTurn = packet[2];
        let data = [];
        for(let i = 0; i < specialTurn.length; i++) {
            data[i] = JSON.parse(specialTurn[i]);
        }
        this.gamelogic.ShowSpecialGame(data[0].fishType, data[0].AccountId, data[0].NexTurnInfoDescription);
    },

    HandlePlaySpecialTurn(packet) {
        cc.log(packet);
        let accountId = packet[1];
        let gunType = packet[2];
        let fishType = packet[3];
        let reward = packet[5];
        let result = packet[6];
        let nextTurnInfo = packet[7];
        let accountBalance = packet[8];
        if(accountId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        this.gamelogic.PlaySpecialGame(accountId, reward, result, nextTurnInfo, accountBalance, fishType);
    },
    //end special turn

    //special gun
    HandleGetSpecialGunInfo(packet) {
        cc.log(packet);
        let accountId = packet[1];
        let specialTurn = packet[2];
        let data = [];
        for(let i = 0; i < specialTurn.length; i++) {
            data[i] = JSON.parse(specialTurn[i]);
        }
        this.gamelogic.ShowSpecialGun(data[0].fishType, data[0].AccountId, data[0].fishValue, data[0].ModelInfoTurnString);
    },

    HandlePlaySpecialGunTurn(packet) {
        cc.log(packet);
        let accountId = packet[1];
        let gunType = packet[2];
        let fishType = packet[3];
        let reward = packet[5];
        let result = packet[6];
        let nextTurnInfo = packet[7];
        let accountBalance = packet[8];
        if(accountId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        this.gamelogic.PlaySpecialGun(accountId, fishType, reward, result, nextTurnInfo, accountBalance);
    },

    //mision
    HandleGetCurrentMissionInfo(packet) {
        let userInfo = JSON.parse(packet[1]);
        let missionInfo = JSON.parse(packet[2]);
        // Global.InGameView.questView.UpdateMission(userInfo, missionInfo);
    },

    HandleGetAccountRewardMission(packet) {
        cc.log(packet);
        let dataString = packet[1];
        let info = [];
        for(let i = 0; i < dataString.length; i++) {
            info[i] = JSON.parse(dataString[i]);
        }
        Global.InGameView.questView.MissionSuccess(info);
    },

    HandleGetTakeRewardMission(packet) {
        let reward = packet[1];
        let accountBalance = packet[2];
        Global.GameLogic.mainActor.maxBalance = accountBalance;
        Global.InGameManager.creatCoint(this.gamelogic.mainActor, Global.InGameView.questView.contentBigObj.getPosition(), 4, reward);
        // this.gamelogic.mainActor.UpdateBalance(reward,true);
    },

    HandleGetMissionConfig(packet) {
        cc.log(packet);
    },

    //jackpot
    HandleGetJackpotInfo(packet) {
        let mini = packet[1];
        let minor = packet[2];
        let major = packet[3];
        let grand = packet[4];
        this.gamelogic.UpdateJackpotInfo(mini, minor, major, grand);
    },

    //multi fish
    HandleDeathMultiFish(packet) {
        cc.log("---------------death multi fish-------------");
        cc.log(packet);
        let playerId = packet[1];
        let listFishId = packet[2];
        let totalReward = packet[3];
        let gunType = packet[4];
        let fishId = packet[5];
        let accountBalance = packet[6];
        let fishType = packet[7];

        if(playerId == Global.GameLogic.mainActor.actorPropertis.AccountId)
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        this.gamelogic.KillMultiFish(playerId, listFishId, totalReward, gunType, fishId, accountBalance, fishType);
        
    },

});
module.exports = FishNetworkManager;