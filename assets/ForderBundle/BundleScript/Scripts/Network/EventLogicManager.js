const DailyGameManager = require("DailyGameManager");

var EventLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new EventLogicManager();
            return this.self;
        }
    },

    HandleResponse(operationResponse) {
        var data = operationResponse;
        
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        //console.log("event:"+responseCode);
        // cc.log(packet);
        switch (responseCode) {
            //daily game
            case Global.Enum.RESPONSE_CODE.MST_SERVER_SHOW_EVENT_GAME:
                DailyGameManager.getIns().DailyGameHandleResponse (operationResponse);
                break;
            case Global.Enum.RESPONSE_CODE.MST_SERVER_PLAY_DAILY_GAME:
                DailyGameManager.getIns().DailyGameHandleResponse (operationResponse);
                break;
            case Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_REWARD_LIST:
                DailyGameManager.getIns().DailyGameHandleResponse (operationResponse);
                break;
            case Global.Enum.RESPONSE_CODE.MST_SERVER_DAILYGAME_SLOT_BASIC_PLAY:
                DailyGameManager.getIns().DailyGameHandleResponse (operationResponse);
                break;
            //collection
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_RESPONSE_GET_MY_COLLECTION:
                this.HandleGetMyCollection(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_RESPONSE_TAKE_COLLECTION_ITEM:
                this.HandleTakeCollectionItem(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_RESPONSE_TAKE_COLLECTION_ACOUNT_REWARD:
                this.HandleTakeCollectionReward(packet);
                break;
            //road map
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_ROAD_MAP_TAKE_REWARD:
                this.HandleTakeRoadmapReward(packet);
                break;
            //fish tournament
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_FISH_TOURNAMENT_GET_ACCOUNT_REWARD:
                this.HandleTournamentGetAccountReward(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_FISH_TOURNAMENT_TAKE_ACCOUNT_REWARD:
                this.HandleTournamentTakeAccountReward(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_FISH_TOURNAMENT_GET_TOURNAMENT_INFO:
                this.HandleTournamentGetTournamentInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_FISH_TOURNAMENT_GET_RANKING:
                this.HandleTournamentGetRanking(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_FISH_TOURNAMENT_GET_TOP_SCORE:
                this.HandleTournamentGetTopScore(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_FISH_TOURNAMENT_GET_SCORE:
                this.HandleTournamentGetScore(packet);
                break;
            //item
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ACCOUNT_BAG_GET_SELL_CONFIG:
                this.HandleGetConfigBag(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ACCOUNT_BAG_GET_ACCOUNT_INFO:
                this.HandleGetBagInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_ACCOUNT_BAG_SELL_ITEM:
                this.HandleGetSellItem(packet);
                break;
            //gaccha
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENTGAME_LOOTBOX_GET_ROOM_CONFIG:
                this.HandleLootBoxGetRoomInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENTGAME_LOOTBOX_SPIN:
                this.HandleLootBoxSpin(packet);
                break;
            //online
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_ONLINE_ACCOUNT_INFO:
                this.MissionOnlineAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_ONLINE_GET_REWARD:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_ONLINE_TAKE_REWARD:
                this.MissionOnlineTakeReward(packet);
                break;
            //quest
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_GET_LIST_REWARD_ACCOUNT:
                this.HandleEventMissionGetListRewardAccound(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_GET_TAKE_ACCOUNT_REWARD:
                this.HandleEventMissionGetTakeAccountReward(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_GET_MISSION_CONFIG:
                this.HandleEventMissionGetMissionConfig(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_GET_ACCOUNT_INFO:
                if(Global.SlotNetWork) Global.SlotNetWork.GetMissionInfo(packet);
                break;
            //level
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_LEVEL_GET_LEVEL_ACCOUNT_REWARD:
                this.HandleGetLevelReward(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_LEVEL_TAKE_LEVEL_ACCOUNT_REWARD:
                this.HandleTakeLevelReward(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_SCORE_GET_CURRENT_SCORE_INFO:
                this.HandleGetCurrentScoreInfo(packet);
                break;
            //top
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_SCORE_GET_TOP_PLAYER_BY_GAME:
                this.HandleGetTopPlayerGame(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_SCORE_GET_TOP_PLAYER:
                this.HandleGetTopPlayerWorld(packet);
                break;
            //not enought money
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_POPUP_NOT_ENOUGHT_MONEY_REWARD:
                this.HandleNotEnoughMoney(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_POPUP_TAKE_ENOUGHT_MONEY_REWARD:
                this.HandleTakeNotEnoughMoney(packet);
                break;
            //random mission
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_CHARACTOR_MISSION_GET_ACCOUNT_INFO:
                this.HandleGetEventCharactorAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_CHARACTOR_MISSION_GET_MISSION_CONFIG:
                this.HandleGetEventCharactorMissionConfig(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_CHARACTOR_GET_RANDOM_MISSION:
                this.HandleGetEventCharactorRandomMission(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_CHARACTOR_GET_MISSION_BY_ID:
                this.HandleGetEventCharactorGetMissionById(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_CHARACTOR_MISSION_GET_LIST_REWARD_ACCOUNT:
                this.HandleEventCharactorGetListReward(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_CHARACTOR_MISSION_GET_TAKE_ACCOUNT_REWARD:
                this.HandleGetEventCharactorTakeReward(packet);
                break;
            //bean
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_BEAN_STACK_MISSION_GET_ACCOUNT_INFO:
                this.HandleBeanStackGetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_BEAN_STACK_MISSION_GET_MISSION_CONFIG_BY_GROUP:
                this.HandleBeanStackGetConfigByGroup(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_BEAN_STACK_MISSION_GET_LIST_REWARD_ACCOUNT:
                this.HandleBeanStackGetListRewardAccount(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_BEAN_STACK_MISSION_TAKE_REWARD_ACCOUNT:
                this.HandleBeanStackTakeRewardAccount(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_BEAN_STACK_MISSION_GET_ALL_MISSION_CONFIG:
                this.HandleBeanStackGetAllConfig(packet);
                break;
            //gift card
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GIFT_CARD_GET_INFO:
                this.HandleGiftCardGetInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GIFTCARD_GET_JACKPOT_FUND:
                this.HandleGiftCardGetJackpot(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GIFTCARD_PLAY_TAKE_CARD:
                this.HandleGiftCardPlay(packet);
                break;
            //ads
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_ADS_VIEW_MISSION_GET_CONFIG:
                this.HandleAdsGetConfig(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_ADS_VIEW_MISSION_GET_ACCOUNT_INFO:
                this.HandleAdsGetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_ADS_VIEW_MISSION_ACCEPT_MISSION:
                this.HandleAdsAcceptMission(packet);
                break;
            //share money
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_SHARE_MONEY_GET_REWARD:
                this.HandleShareMoneyGetReward(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_SHARE_MONEY_TAKE_REWARD:
                this.HandleShareMoneyTakeReward(packet);
                break;
            //ads view
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_ADS_REWARD_CONFIG:
                this.HandleAdsRewardConfig(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_ADS_REWARD_VIEW_COMPLETED:
                this.HandleAdsRewardViewComplete(packet);
                break;
            //keypass mission daily
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVNET_MISSION_USING_KEY_PASS:
                this.HandleMissionUsingKeyPass(packet);
                break;
            //free bonus
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_FREEREWARD_SHOW_BANNER:
                this.HandleFreeRewardShowBanner(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_FREEREWARD_TAKE_REWARD:
                this.HandleFreeRewardTakeReward(packet);
                break;
            //event
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GAMES_GET_ACCOUNT_INFO:
                this.HandleEventGetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GAMES_PLAYGAME:
                this.HandleEventPlayGame(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_GAMES_GET_HIGH_SCORE:
                this.HandleEventGetHighScore(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TRI_AN_GET_INFO:
                this.HandleEventGetReferenceInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_TRI_AN_SET_REFERENCE_ID:
                this.HandleEventSetReferenceId(packet);
                break;
            default:
                break;
        }
    },

    //collection
    HandleGetMyCollection(packet) {
        cc.log(packet);
        let infoItem = packet[1];
        let rewardList = packet[2];
        let missionList = packet[3];
        if(Global.CollectionPopup && Global.CollectionPopup.node.active == true) {
            Global.CollectionPopup.UpdateInfo(infoItem, rewardList, missionList);
        }
        if(Global.ButtonCollection) {
            Global.ButtonCollection.UpdateInfo(infoItem, rewardList, missionList);
        }
    },

    HandleTakeCollectionItem(packet) {
        let info = JSON.parse(packet[1]);
        let data = JSON.parse(info.CollectionDescription);
        if(Global.ButtonCollection == null)
            return;
        Global.DownloadManager.LoadPrefab("Collection","Pic", (prefab)=>{
            let node = cc.instantiate(prefab);
            Global.UIManager.node.addChild(node);
            node.scale = 0;
            let link = "Img/Collection/picture/"+data.GameId+"/pic"+data.PictureIndex+"/0"+info.CollectionItemId;
            cc.resources.load(link , cc.SpriteFrame , (err , spFrame)=>{ 
                node.children[1].getComponent(cc.Sprite).spriteFrame = spFrame;
            });
            let pos = Global.ButtonCollection.node.getPosition();
            
            node.runAction(cc.sequence(cc.scaleTo(0.4,1), cc.delayTime(0.3), cc.moveTo(0.5, pos), cc.scaleTo(0.2,0), cc.callFunc(()=>{
                node.destroy();
            })));
        });
        let current = JSON.parse(packet[2]);
        if(current.Status) {
            require("SendRequest").getIns().MST_Client_Get_My_Collection();
        }
    },

    HandleTakeCollectionReward(packet) {
        cc.log(packet);
        let reward = packet[1];
        let accountBalance = packet[3];
        if(Global.CollectionPopup) {
            Global.CollectionPopup.GetReward(reward, accountBalance);
        }
    },

    HandleTakeRoadmapReward(packet) {
        cc.log(packet);
    },

    //tournament
    HandleTournamentGetAccountReward(packet) {
        let listDataString = packet[1];
        for (let i = 0; i < listDataString.length; i++) {
            let data = JSON.parse(listDataString[i]);
            if(data.Status == false) {
                Global.UIManager.showRewardTournamentPopup(data.TournamentID, data.Ranking, data.RewardMoney,-1, data.RewardId);
                break;
            }
        }
    },

    HandleTournamentTakeAccountReward(packet) {
        let accountBalance = packet[1];
        let reward = packet[2];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.UpdateBalance(reward,true);
            Global.RewardTourPopup.Hide();
        } else {
            Global.RewardTourPopup.ShowEffect(accountBalance);
        }
    },

    HandleTournamentGetTournamentInfo(packet) {
        cc.log(packet);
    },

    HandleTournamentGetRanking(packet) {
        // cc.log(packet);
        let tourData = JSON.parse(packet[1]);
        let rank = packet[2];
        let userInfo = JSON.parse(packet[3]);
        let currentFund = packet[5];
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            if(Global.LobbyView != null)
                Global.LobbyView.SetDataTournament(tourData);
        } else if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
            if(Global.InGameView != null)
                Global.InGameView.SetDataTournament(tourData, rank, userInfo, currentFund);
        }
    },

    HandleTournamentGetTopScore(packet) {
        // cc.log(packet);
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] =  JSON.parse(listDataString[i]);
        }
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            
        } else if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
            Global.InGameView.SetTopTournament(listData);
        }
    },

    HandleTournamentGetScore(packet) {
        // cc.log(packet);
    },

    //item
    HandleGetConfigBag(packet) {
        cc.log(packet);
    },

    HandleGetBagInfo(packet) {
         cc.log(packet);
        let listDataString = packet[1];
        let listItemFreeString = packet[2];
        let listDataItem = [];
        for (let i = 0; i < listDataString.length; i++) {
            listDataItem[i] = JSON.parse(listDataString[i]);
        }
        let listDataFree = [];
        for (let i = 0; i < listItemFreeString.length; i++) {
            listDataFree[i] = JSON.parse(listItemFreeString[i]);
        }
        require("BagController").getIns().UpdateBagInfo(listDataItem, listDataFree);
    },

    HandleGetSellItem(packet) {
        cc.log(packet);
        let itemId = packet[1];
        let listDataString = packet[2];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] = JSON.parse(listDataString[i]);
        }
        require("BagController").getIns().UseItem(itemId, listData);
    },

    HandleUpdateItem(packet) {
        cc.log(packet);
    },

    //gaccha
    HandleLootBoxGetRoomInfo(packet) {
        cc.log(packet);
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] = JSON.parse(listDataString[i]);
        }
        Global.UIManager.SetInfoGacha(listData);
    },

    HandleLootBoxSpin(packet) {
        cc.log(packet);
        let rewardType = packet[1];
        let total = packet[2];
        let extendDescription = packet[3];
        let ingameBalance = packet[4];
        let accountBagList = packet[5];
        Global.Gacha.ShowSpinGacha(total, extendDescription, ingameBalance, accountBagList);
    },

    //online
    MissionOnlineAccountInfo(packet) {
        cc.log(packet);
        let model = packet[1];
        let data =  JSON.parse(model);
        require("OnlineControl").getIns().InsertData(data);
    },

    MissionOnlineTakeReward(packet) {
        cc.log(packet);
        let missionReward = packet[1];
        let MissionRewardDescription = packet[2];
        let CurrentAccountBalance = packet[3];
        let model = packet[4];
        let data =  JSON.parse(model);
        //show popup reward
        require("OnlineControl").getIns().InsertData(data);
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = CurrentAccountBalance;
        }
        Global.UIManager.showNotifyRewardPopup(missionReward, MissionRewardDescription, CurrentAccountBalance);
    },

     //quest
     HandleEventMissionGetListRewardAccound(packet) {
        cc.log(packet);
        let data = [];
        for(let i = 0; i < packet[1].length; i++) {
            data[i] = JSON.parse(packet[1][i]);
        }
        if(Global.TutorialPopup) {
            Global.TutorialPopup.UpdateStatusReward(data);
        }
        if(data.length > 0) {
            if(data[0].MissionType == Global.Enum.MISSION_TYPE.DAILY) {
                // if(Global.MissionDailyPopup && Global.MissionDailyPopup.node.active) {
                //     Global.MissionDailyPopup.UpdateStatusReward(data);
                if(Global.MissionDaily) {
                    Global.MissionDaily.UpdateStatusReward(data);
                } else {
                    cc.log(data);
                    for(let i = 0; i < data.length; i++) {
                        if(data[i].MissionId == 0 && data[i].IsReaded == 0) {
                            // Global.UIManager.ShowMissionDailyPopup(Global.SlotNetWork.slotView.slotType, data);
                            break;
                        }
                    }
                    
                }
            }
        }
    },

    HandleEventMissionGetTakeAccountReward(packet) {
        cc.log(packet);
        let goldValue = packet[1];
        let accountBalance = packet[2];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        }
        if(Global.TutorialPopup) {
            Global.TutorialPopup.UpdateBalance(accountBalance, goldValue);
        }
        if(Global.MissionDaily) {
            Global.MissionDaily.UpdateBalance(accountBalance, goldValue);
        } else {
            // if(Global.MissionDailyPopup) {
            //     Global.MissionDailyPopup.UpdateBalance(accountBalance, goldValue);
            // }
        }
    },

    HandleEventMissionGetMissionConfig(packet) {
        cc.log(packet);
        let listMission = [];
        if(packet[1].length > 0) {
            let missionCheck = JSON.parse(packet[1][0]);
            if(missionCheck.MissionType == Global.Enum.MISSION_TYPE.DAILY) {
                for(let i = 0; i < packet[1].length; i++) {
                    listMission[i] = JSON.parse(packet[1][i]);
                }
                Global.listMissionDaily = listMission;
            } else {
                let index = 0;
                let missionTotal = null;
                for(let i = 0; i < packet[1].length; i++) {
                    let mission = JSON.parse(packet[1][i]);
                    if(mission.MissionId == 0) {
                        missionTotal = mission;
                    } else {
                        listMission[index++] = mission;
                    }
                }
                listMission[index] = missionTotal;
                cc.log(listMission);
                let listAccept = [];
                for(let i = 0; i < packet[2].length; i++) {
                    listAccept[i] = JSON.parse(packet[2][i]);
                }
                if(listMission.length > 0) {
                    if(listMission[0].MissionType == Global.Enum.MISSION_TYPE.NEW_USER) {
                        cc.log("show new user");
                        if(Global.TutorialPopup != null) {
                            Global.TutorialPopup.UpdateInfo(listMission, listAccept);
                        }
                    } else {
                        if(Global.SlotTutorialView != null) {
                            Global.SlotTutorialView.UpdateInfo(listMission, listAccept);
                        }
                    }
                }
            }
        }
        
    },

    //level
    HandleGetLevelReward(packet) {
        let listReward = packet[1];
        if(Global.LevelManager)
            Global.LevelManager.UpdateRewardInfo(listReward);
    },

    HandleTakeLevelReward(packet) {
        let levelReward = packet[1];
        let reward = packet[2];
        let accountBalance = packet[3];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        }
        Global.LevelPopup.ShowEffect(reward, accountBalance);
    },

    HandleGetCurrentScoreInfo(packet) {
        let currentExp = packet[1];
        let totalExp = packet[2];
        let currentLevel = packet[3];
        if(Global.LevelManager)
            Global.LevelManager.UpdateInfo(currentExp, totalExp, currentLevel);
    },

    //top
    HandleGetTopPlayerWorld(packet) {
        let data = [];
        for(let i = 0; i < packet[1].length; i++) {
            data[i] = JSON.parse(packet[1][i]);
        }
        
        if(Global.RankPopup) {
            Global.RankPopup.GetTopPlayerWorld(data);
        } 
    },

    HandleGetTopPlayerGame(packet) {
        cc.log(packet);
        let gameType = packet[1];
        let data = [];
        for(let i = 0; i < packet[2].length; i++) {
            data[i] = JSON.parse(packet[2][i]);
        }
        if(Global.RankPopup) {
            Global.RankPopup.GetTopPlayerGame(gameType, data);
        } 
    },

    //not enought money
    HandleNotEnoughMoney(packet) {
        cc.log(packet);
        let rewardId = packet[1];
        let rewardMoney = packet[2];
    },

    HandleTakeNotEnoughMoney(packet) {
        cc.log(packet);
        let rewardMoney = packet[1];
        let accountBalance = packet[2];
    },

    //random mission
    HandleGetEventCharactorAccountInfo(packet) {
        cc.log(packet);
        let currentMissionInfo = JSON.parse(packet[1]);
        let currentTargetMission = JSON.parse(packet[2]);
        if(Global.RandomMissionPopup && Global.RandomMissionPopup.node.activeInHierarchy) {
            Global.RandomMissionPopup.AcceptMission(currentMissionInfo, currentTargetMission);
        }
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
            if(Global.SlotNetWork) 
                Global.SlotNetWork.GetMissionRandomInfo(packet);
        }
    },

    HandleGetEventCharactorMissionConfig(packet) {
        cc.log(packet);
           
    },

    HandleGetEventCharactorRandomMission(packet) {
        cc.log(packet);
        let data = [];
        for(let i = 0; i < packet[1].length; i++) {
            data[i] = JSON.parse(packet[1][i]);
        }
        if(Global.RandomMissionPopup)
            Global.RandomMissionPopup.GetListRandomMission(data, true);     
    },

    HandleGetEventCharactorGetMissionById(packet) {
        cc.log(packet);
        let data = [];
        for(let i = 0; i < packet[1].length; i++) {
            data[i] = JSON.parse(packet[1][i]);
        }
        if(Global.RandomMissionPopup)
            Global.RandomMissionPopup.GetListRandomMission(data, false);  
    },

    HandleEventCharactorGetListReward(packet) {
        cc.log(packet);
        let data = [];
        for(let i = 0; i < packet[1].length; i++) {
            data[i] = JSON.parse(packet[1][i]);
        }
        cc.log(data);
        if(Global.RandomMissionPopup && Global.RandomMissionPopup.node.activeInHierarchy) {
            Global.RandomMissionPopup.UpdateStatusReward(data);
        } else {
            if(Global.MissionRandom) {
                Global.MissionRandom.UpdateStatusReward(data);
            }
        }
    },

    HandleGetEventCharactorTakeReward(packet) {
        cc.log(packet);
        let goldValue = packet[1];
        let accountBalance = packet[3];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        }
        if(Global.MissionRandom && Global.MissionRandom.node.activeInHierarchy) {
            Global.MissionRandom.UpdateBalance(accountBalance, goldValue);
        } else if(Global.RandomMissionPopup && Global.RandomMissionPopup.node.activeInHierarchy) {
            Global.RandomMissionPopup.UpdateBalance(accountBalance, goldValue);
        }
    },

    //bean
    HandleBeanStackGetAccountInfo(packet) {
        cc.log(packet);
        let currentMissionInfo = JSON.parse(packet[1]);
        let currentTargetMission = JSON.parse(packet[2]);
        if(Global.BeanStackPopup) {
            Global.BeanStackPopup.AcceptMission(currentMissionInfo, currentTargetMission);
            //show effect accept
        }
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
            if(Global.SlotNetWork) 
                Global.SlotNetWork.GetMissionBeanInfo(packet);
        }
    },

    HandleBeanStackGetConfigByGroup(packet) {
        cc.log(packet);
        let dataConfig = packet[1];
        let currentMission = packet[2];
        let config = [];
        for(let i =0; i < dataConfig.length; i++) {
            config.push(JSON.parse(dataConfig[i]));
        }
        let current = [];
        for(let i =0; i < currentMission.length; i++) {
            current.push(JSON.parse(currentMission[i]));
        }
        if(Global.BeanStackPopup) {
            Global.BeanStackPopup.GetListConfig(config, current);
        }
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            if(config.length != 0) {
                Global.currentFloor = config[0].MissionGroupId;
            } else {
                require("SendRequest").getIns().MST_Client_Bean_Stack_Get_All_Mission_Config();
            }
        }
        
    },

    HandleBeanStackGetListRewardAccount(packet) {
        let listReward = [];
        for(let i =0; i < packet[1].length; i++) {
            listReward.push(JSON.parse(packet[1][i]));
        }
        if(Global.BeanStackPopup) {
            Global.BeanStackPopup.GetListReward(listReward);
        }
    },

    HandleBeanStackTakeRewardAccount(packet) {
        cc.log(packet);
        let reward = packet[1];
        let accountbalance = packet[3];
        if(Global.BeanStackPopup) {
            Global.BeanStackPopup.TakeReward(reward,accountbalance);
        }
    },

    HandleBeanStackGetAllConfig(packet) {
        let data = [];
        for(let i =0; i < packet[1].length; i++) {
            data.push(JSON.parse(packet[1][i]));
        }
        cc.log(data);
        let max = 0;
        for(let i = 0; i < data.length; i++) {
            if(max < data[i].MissionGroupId)
                max = data[i].MissionGroupId;
        }
        Global.currentFloor = max+1;
        // Global.LobbyView.UnLockFunction();
    },
    
    //gift card
    HandleGiftCardGetInfo(packet) {
        cc.log(packet);
        let turnPlay = packet[1];
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            if(Global.BtnOnline)
                Global.BtnOnline.itemOnline.UpdateNumbOfScratch(turnPlay);
        }
        if(Global.LuckyCardPopup) {
            Global.LuckyCardPopup.UpdateNumbOfScratch(turnPlay);
        }
    },

    HandleGiftCardGetJackpot(packet) {
        cc.log(packet);
        let jackptoValue = packet[1];
        if(Global.LuckyCardPopup) {
            Global.LuckyCardPopup.UpdateJackpotValue(jackptoValue);
        }
    },

    HandleGiftCardPlay(packet) {
        cc.log(packet);
        let cardMoney = packet[1];
        let isJackpot = packet[2];
        let accountBalance = packet[3];
        let jackpotValue = packet[4];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        }
        if(Global.LuckyCardPopup) {
            Global.LuckyCardPopup.OnPlayScratch(cardMoney, isJackpot, accountBalance, jackpotValue);
        }
    },

    //ads
    HandleAdsGetConfig(packet) {
        cc.log(packet);
    },

    HandleAdsGetAccountInfo(packet) {
        let config = [];
        for(let i =0; i < packet[1].length; i++) {
            config.push(JSON.parse(packet[1][i]));
        }
        let current = [];
        for(let i =0; i < packet[2].length; i++) {
            current.push(JSON.parse(packet[2][i]));
        }
        Global.indexAdsReward = current.length;
        if(Global.AdsPopup) {
            Global.AdsPopup.UpdateInfoAds(config, current);
        }
        if(Global.AdsButtonView) {
            Global.AdsButtonView.UpdateInfoAds(config, current);
        }
    },

    HandleAdsAcceptMission(packet) {
    },

    //share money
    HandleShareMoneyGetReward(packet) {
        cc.log(packet);
        let shareRewardId = packet[1];
        let gameId = packet[2];
        let bigWinMoney = packet[3];
        let shareMoney = packet[4];
        let rewardInfo = packet[5];
        let data = JSON.parse(rewardInfo);
        if(Global.ShareMoney) {
            Global.ShareMoney.GetReward(data.RewardId, gameId, shareMoney);
        }
    },

    HandleShareMoneyTakeReward(packet) {
        cc.log(packet);
        let rewardValue = packet[1];
        let accountBalance = packet[2];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = accountBalance;
        }
        if(Global.ShareMoney) {
            Global.ShareMoney.ShowEffect(accountBalance);
        }
    },
    //ads
    HandleAdsRewardConfig(packet) {
    },

    HandleAdsRewardViewComplete(packet) {
    },

    //keypass mission daily
    HandleMissionUsingKeyPass(packet) {
        cc.log(packet);
        let rewardId = packet[1];
        let rewardMoney = packet[2];
        if(Global.MissionDailyPopup) {
            Global.MissionDailyPopup.UsingKeyPass(rewardId, rewardMoney);
        }
    },

    //free bonus
    HandleFreeRewardShowBanner(packet) {
        cc.log(packet);
        let isShow = packet[1];
        let privateKey = packet[2];
        let config = JSON.parse(packet[3]);
        config.Reward = JSON.parse(config.RewardDecription);
        if(isShow) {
            Global.isShowFreeBonus = true;
            Global.UIManager.ShowFreeBonusPopup(privateKey, config);
        } else {
            if(Global.showLuckyBonus) {
                Global.showLuckyBonus = false;
                Global.UIManager.showLuckyCardPopup();
            }
        }
        Global.privateKey = privateKey;
    },

    HandleFreeRewardTakeReward(packet) {
        console.log(packet[1]);
        cc.log(packet);
        let config = JSON.parse(packet[1]);
        let info = JSON.parse(config.RewardDecription);
        require("ScreenManager").getIns().roomType = info.GameID;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
        Global.UIManager.showMiniLoading();
    },

    //event
    HandleEventGetAccountInfo(packet) {
        cc.log(packet);
        let smallSpin = packet[1];
        let bigSpin = packet[2];
        if(smallSpin > 0 || bigSpin > 0) {
            Global.InGameView.objGacha.active = true;
        } else {
            Global.InGameView.objGacha.active = false;
        }
        if(Global.GachaEvent) {
            Global.GachaEvent.UpdateAmount(smallSpin, bigSpin);
        }
    },

    HandleEventPlayGame(packet) {
        cc.log(packet);
        // let rewardType = packet[1];
        let total = packet[3];
        let extendDescription = packet[4];
        let ingameBalance = packet[5];
        let accountBagList = packet[6];
        if(Global.InGameView != null) {
            Global.GameLogic.mainActor.maxBalance = ingameBalance;
        }
        Global.GachaEvent.ShowSpinGacha(total, extendDescription, ingameBalance, accountBagList);
    },

    HandleEventGetHighScore(packet) {
        cc.log(packet);
        let listData1 = [];
        let listData2 = [];
        for(let i = 0; i < packet[1].length; i++) {
            listData1.push(JSON.parse(packet[1][i]));
        }
        for(let i = 0; i < packet[2].length; i++) {
            listData2.push(JSON.parse(packet[2][i]));
        }
        cc.log(listData1);
        cc.log(listData2);
        if(Global.GachaEvent) {
            Global.GachaEvent.InitInfoTop(listData1, listData2);
        }
    },

    //tri an
    HandleEventGetReferenceInfo(packet)
    {
       cc.log(packet);
        let currentTriAnModel = JSON.parse(packet[1]);
        let countReference = packet[2].length;
        let coinTotal = packet[3];
        let coinReference = packet[4];
        let sendTime = packet[5];
        Global.FriendId = currentTriAnModel.FriendId;
        if(Global.GratefulPopup != null && Global.GratefulPopup.node != null && Global.GratefulPopup.node.active == true) 
            Global.GratefulPopup.UpdateInfo(currentTriAnModel, countReference, coinTotal, coinReference, sendTime);
        // Global.UIManager.showReferencePopup(currentTriAnModel.FriendId,currentTriAnModel.AccountId,_TotalMoney,_TotalRefenceMoney,_SendMoneyTime);
    },

    HandleEventSetReferenceId(packet) {
        cc.log(packet);
        let friendId = packet[1];
        if(Global.GratefulPopup) 
            Global.GratefulPopup.SetReference(friendId);
    },

});
module.exports = EventLogicManager;
