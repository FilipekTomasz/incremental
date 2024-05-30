import {Resources, Timers, gainGold, gainKnowledge, gainEffects, Stats, State} from "./data.js";
import { createBoughtTilePopup } from "./popup.js";

function saveActionsUsed(action){
    //Save the number of times this action was used
    let index =  State.actionsTimesUsed.findIndex(i => i.id == action.id);
    if(index == -1){
        State.actionsTimesUsed.push({id: action.id, amount: action.timesUsed})
    } else {
        State.actionsTimesUsed[index].amount++;
    }
}



const Upgrades = {
    PrettyFace: {
        id: 0,
        cost: [{type: Resources.Gold, amount: 6}],
        name: "Pretty face",
        description: "Begging is faster",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Actions.Beg.cd -= 1;
        },
        requirement: () =>{
            return true;
        }
    },
    TinyMoneyPouch: {
        id: 1,
        cost: [{type: Resources.Gold, amount: 10}],
        name: "Tiny money pouch",
        description: "Gold cap +20",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Resources.Gold.cap += 20;
        },
        requirement: () =>{
            return Resources.Gold.amount >= 6;
        }
    },
    SmallMoneyPouch: {
        id: 2,
        cost: [{type: Resources.Gold, amount: 25}],
        name: "Small Money pouch",
        description: "Gold cap +40",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Resources.Gold.cap += 40;
        },
        requirement: () =>{
            return Upgrades.TinyMoneyPouch.bought;
        }
    },
    MoneyPouch: {
        id: 3,
        cost: [{type: Resources.Gold, amount: 50}],
        name: "Money pouch",
        description: "Gold cap +80",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Resources.Gold.cap += 80;
        },
        requirement: () =>{
            return Upgrades.SmallMoneyPouch.bought;
        }
    },
    ReadingLessons: {
        id: 4,
        cost: [{type: Resources.Gold, amount: 20}],
        name: "Reading lessons",
        description: "Unlocks studying",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            //Unlocks library study action
            //Shows knowledge
        },
        requirement: () =>{
            return Upgrades.TinyMoneyPouch.bought;
        }
    },
    Glasses: {
        id: 5,
        cost: [{type: Resources.Gold, amount: 40}],
        name: "Glasses",
        description: "Studying is faster by 1s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Actions.LibraryStudy.cd -= 1;
        },
        requirement: () =>{
            return Upgrades.ReadingLessons.bought;
        }
    },
    UnlockSkills: {
        id: 6,
        cost: [{type: Resources.Gold, amount: 30}, {type:Resources.Knowledge, amount: 1}],
        name: "Unlock Skills",
        description: "Unlocks skills",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            //Unlocks skills
        },
        requirement: () =>{
            return Resources.Knowledge.amount >= 1 && Upgrades.ReadingLessons.bought;
        }
    },
    Meditation1: { 
        id: 7,
        cost: [{type: Resources.Mana, amount: 5}],
        name: "Meditation 1/5",
        description: "Mana gain is faster by 0.4s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.cd -= 0.4;
        },
        requirement: () =>{
            return Skills.Magic.bought;
        }
    },
    Meditation2: {
        id: 8,
        cost: [{type: Resources.Mana, amount: 8}],
        name: "Meditation 2/5",
        description: "Mana gain is faster by 0.4s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.cd -= 0.4;
        },
        requirement: () =>{
            return Upgrades.Meditation1.bought;
        }
    },
    Meditation3: {
        id: 9,
        cost: [{type: Resources.Mana, amount: 14}],
        name: "Meditation 3/5",
        description: "Mana gain is faster by 0.4s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.cd -= 0.4;
        },
        requirement: () =>{
            return Upgrades.Meditation2.bought
        }
    },
    Meditation4: {
        id: 10,
        cost: [{type: Resources.Mana, amount: 20}],
        name: "Meditation 4/5",
        description: "Mana gain is faster by 0.4s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.cd -= 0.4;
        },
        requirement: () =>{
            return Upgrades.Meditation3.bought
        }
    },
     Meditation5: {
        id: 11,
        cost: [{type: Resources.Mana, amount: 30}],
        name: "Meditation 5/5",
        description: "Mana gain is faster by 0.4s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.cd -= 0.4;
        },
        requirement: () =>{
            return Upgrades.Meditation4.bought
        }
    },
    ManaPlus: {
        id: 12,
        cost: [{type: Resources.Mana, amount: 15}],
        name: "Mana amount",
        description: "Base mana gain is increased by 1",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.effectValue += 1;
        },
        requirement: () =>{
            return Resources.Mana.amount >= 7;
        }
    },
    DeckOfCards: {
        id: 13,
        cost: [{type: Resources.Gold, amount: 30}, {type:Resources.Mana, amount: 20}],
        name: "Deck of cards",
        description: "Unlocks card tricks",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            //Unlocks card tricks action
        },
        requirement: () =>{
            return Skills.Magic.bought;
        }
    },
    ManaExpansionPotion: {
        id: 14,
        cost: [{type: Resources.Mana, amount: 50}, {type: Resources.Gold, amount: 100}],
        name: "Mana expansion potion",
        description: "Mana Cap +50",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Resources.Mana.cap += 50;
        },
        requirement: () =>{
            return Upgrades.ManaPlus.bought && Upgrades.Meditation2.bought;
        }
    },
    GrowGold: {
        id: 15,
        cost: [{type: Resources.Mana, amount: 70}, {type: Resources.Gold, amount: 100}],
        name: "Grow gold",
        description: "Gain 1 gold every time you gain mana",
        visible: false,
        bought: false,
        tabName: "Actions",
        effectValue: 1,
        effect(gain){
            gainGold(this.effectValue);
            return gain;
        },
        requirement: () =>{
            return Skills.MoreMagic.bought;
        }
    },
    CondenseMana: {
        id: 16,
        cost: [{type: Resources.Mana, amount: 100},{type: Resources.Knowledge, amount: 5} ],
        name: "Condense mana",
        description: "Mana Cap +100",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Resources.Mana.cap += 100;
        },
        requirement: () =>{
            return Skills.MoreMagic.bought;
        }
    },
    Orb: {
        id: 17,
        cost:[{type: Resources.Gold, amount: 50}],
        name: "Orb",
        description: "Base mana gain is increased by 1",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.effectValue += 1;
        },
        requirement: () =>{
            return Skills.Magic.bought;
        }
    },
    DeepMeditation: {
        id: 18,
        cost: [ {type: Resources.Mana, amount: 80} ],
        name: "Deep meditation",
        description: "Mana gain is faster by 0.6s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.cd -= 0.6;
        },
        requirement: () =>{
            return Skills.MoreMagic.bought && Upgrades.Meditation5.bought;
        }
    },
    EnchantCards: {
        id: 19,
        cost: [ {type: Resources.Mana, amount: 150} ],
        name: "Enchant cards",
        description: "Card tricks are faster by 1s and give +2 base gold",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Actions.CardTricks.cd -= 1;
            Actions.CardTricks.effectValue += 2;
        },
        requirement: () =>{
            return Skills.MoreMagic.bought && Upgrades.Meditation5.bought;
        }
    },
    NoteTaking: {
        id:20,
        cost: [ {type: Resources.Knowledge, amount: 5}, {type: Resources.Mana, amount: 50},  ],
        name: "Note taking",
        description: "Studying at library gives 1 more knowledge",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Actions.LibraryStudy.effectValue += 1;
        },
        requirement: () =>{
            return Skills.Knowledgeable.bought;
        }
    },
    LibraryPass: {
        id:21,
        cost: [ {type: Resources.Gold, amount: 100}, ],
        name: "Library pass",
        description: "Studying at library is free",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: (parameters) =>{
            let load = parameters.load || false;
            Actions.LibraryStudy.cost[0].amount = 0;
            Actions.LibraryStudy.description = "Study at library for knowledge";
            if(!load){
                document.querySelector(`[data-id="action${Actions.LibraryStudy.id}"]`).innerHTML = Actions.LibraryStudy.description;
            }

        },
        requirement: () =>{
            return Skills.Knowledgeable.bought;
        }
    },

    Adventurous: {
        id:22,
        cost: [ {type: Resources.Knowledge, amount: 20}, {type: Resources.Mana, amount: 50}, {type: Resources.Gold, amount: 100} ],
        name: "Adventurous",
        description: "Unlocks world map",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            //unlocks world map

        },
        requirement: () =>{
            //idk
            return Skills.Knowledgeable.bought;
        }
    },   
    SpeedReading: {
        id:23, 
        cost: [ {type: Resources.Knowledge, amount: 3} ],
        name: "Speed reading",
        description: "Studying at library is 1s faster",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Actions.LibraryStudy.cd -= 1;
        },
        requirement: () =>{
            return Upgrades.Glasses.bought && Skills.Magic.bought;
        }
    },
    UnlockStats: {
        id:24, 
        cost: [ {type: Resources.Gold, amount: 100}, ],
        name: "Body awarness potion",
        description: "Unlocks stats",
        visible: false,
        bought: false,
        tabName: "World",
        effect: () =>{
            //Unlocks stats
        },
        requirement: () =>{
            return Upgrades.Adventurous.bought;
        }
    },
    UnlockBlood: {
        id:25, 
        cost: [ {type: Resources.Knowledge, amount: 15}, {type: Resources.Gold, amount: 130},],
        name: "Sacrificial knife",
        description: "Unlocks blood",
        visible: false,
        bought: false,
        tabName: "World",
        effect: () =>{
            //Unlocks blood
            Timers.Blood.available = true;
        },
        requirement: () =>{
            return Upgrades.UnlockStats.bought;
        }
    },
    Training: {
        id:26, 
        cost: [ {type: Resources.Blood, amount: 8},],
        name: "Training",
        description: "Unlocks train action",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            //Unlocks train
        },
        requirement: () =>{
            return Upgrades.UnlockBlood.bought;
        }
    },
    Veggies: {
        id:27, 
        cost: [ {type: Resources.Gold, amount: 80},],
        name: "Veggies",
        description: "Blood gain is faster by 0.4s",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Blood.cd -= 0.4;
        },
        requirement: () =>{
            return Upgrades.UnlockBlood.bought;
        }
    },
    BigOrb: {
        id: 28,
        cost: [{type: Resources.Mana, amount: 30},{type: Resources.Gold, amount: 80} ],
        name: "Big Orb",
        description: "Base mana gain is increased by 1",
        visible: false,
        bought: false,
        tabName: "Actions",
        effect: () =>{
            Timers.Mana.effectValue += 1;
        },
        requirement: () =>{
            return Skills.MoreMagic.bought && Upgrades.Orb.bought;
        }
    },
}
const Actions = {
    Beg: {
        id: 0,
        cost: [{type: Resources.None, amount: 0}],
        name: "Beg",
        description: "Beg for gold",
        visible: false,
        active: false,
        timer: 0,
        cd: 4,
        effectValue: 2,
        effect() {
            gainGold(this.effectValue);
        },
        requirement: () =>{
            return true;
        }
    },
    LibraryStudy: {
        id: 1,
        cost: [{type: Resources.Gold, amount: 10}],
        name: "Study at library",
        description: "Study at library for knowledge, costs 10 gold",
        visible: false,
        active: false,
        timer: 0,
        cd: 10,
        effectValue: 1,
        effect() {
            gainKnowledge(this.effectValue);
        },
        requirement: () =>{
            return Upgrades.ReadingLessons.bought;
        }
    },
    CardTricks: {
        id: 2,
        cost: [{type: Resources.Mana, amount: 5}],
        name: "Card tricks",
        description: "Perform card tricks for gold, costs 5 mana",
        visible: false,
        active: false,
        timer: 0,
        cd: 4,
        effectValue: 5,
        effect() {
            gainGold(this.effectValue);
        },
        requirement: () =>{
            return Upgrades.DeckOfCards.bought;
        }
    },
    Train: {
        id: 3,
        cost: [{type: Resources.Blood, amount: () => 2 * (Math.pow(1.1, Actions.Train.timesUsed) + Actions.Train.timesUsed*2)}],
        name: "Train",
        description: () => `Increases body, costs ${Math.ceil(Actions.Train.cost[0].amount())} blood, increases cost every time`,
        visible: false,
        active: false,
        timer: 0,
        cd: 30,
        effectValue: 1,
        timesUsed: 0,
        effect() {
            this.timesUsed++;
            Stats.Body.gain(this.effectValue);

            saveActionsUsed(this);

        },
        requirement: () =>{
            return Upgrades.Training.bought;
        }
    },

}
const Skills = {
    Industrious: {
        id: 0,
        cost: [{type: Resources.Knowledge, amount: 3}],
        name: "Industrious",
        description: "Gold gain 1.5x",
        visible: false,
        bought: false,
        effect(gain = 0) {
            return gain*1.5;
        },
        requirement: () =>{
            return true;
        },
    },
    Magic: {
        id: 1,
        cost: [{type: Resources.Knowledge, amount: 5}, {type: Resources.Gold, amount: 50}],
        name: "Magic",
        description: "Unlocks mana",
        visible: false,
        bought: false,
        effect() {
            //Unlocks mana
            Timers.Mana.available = true;
        },
        requirement: () =>{
            return Skills.Industrious.bought;
        }
    },
    MoreMagic: {
        id: 2,
        cost: [{type: Resources.Knowledge, amount: 10}, {type: Resources.Mana, amount: 100}],
        name: "More magic",
        description: "Unlocks more mana upgrades",
        visible: false,
        bought: false,
        effect() {
            //Unlocks more mana upgrades
        },
        requirement: () =>{
            return Skills.Magic.bought;
        }
    },
    Knowledgeable: {
        id: 3,
        cost: [{type: Resources.Knowledge, amount: 15}, {type: Resources.Mana, amount: 50}],
        name: "Knowledgeable",
        description: "Knowledge gain 1.5x",
        visible: false,
        bought: false,
        effect(gain = 0) {
            return gain*1.5;
        },
        requirement: () =>{
            return Skills.Magic.bought;
        }
    },
}
const Tiles = {
    Village:{
        id: 0,
        name: "Village",
        description: "Starting point of an adventure",
        visible: false,
        bought: true,
        sprite: "",
        color: "#6ac482", // if no sprite
        pos: {x:0,y:0},
        effect() {
            //None
        },
        requirement: () =>{
            //none
        },
        buyOptions: [],
    },
    Tower:{
        id: 1,
        name: "Mysterious tower",
        description: "Looks like an abandoned tower",
        visible: false,
        bought: false,
        sprite: "",
        color: "#6ac482", // if no sprite
        pos: {x:0,y:1},
        effect() {
            //None
        },
        requirement: () =>{
            return Tiles.Village.bought;
        },
        buyOptions: [
            {
                name: "Buy and locpick the door",
                description: "Costs 60 gold",
                buy(){
                    console.log("lockpick")
                    if(Resources.Gold.amount >= 60){
                        Tiles.Tower.bought = true;
                        createBoughtTilePopup("You lockpick the door", "You enter and look around, after a while you find a spellbook", "<h2>Spells unlocked</h2>");
                        Resources.Gold.amount -= 60;
                    }
                },
            },
            {
                name: "Force the door open",
                description: "Requires  5 body",
                buy(){
                    console.log("force")
                    if(Stats.Body.amount >= 5){
                        Tiles.Tower.bought = true;
                        createBoughtTilePopup("You force open the door", "You enter and look around, after a while you find a spellbook", "<h2>Spells unlocked</h2>");
                    }

                },
            },
        ]
    },
    Forest:{
        id: 2,
        name: "Forest",
        description: "Forest",
        visible: false,
        bought: false,
        sprite: "",
        color: "#6ac482", // if no sprite
        pos: {x:1,y:0},
        effect() {
            //None
        },
        requirement: () =>{
            return Tiles.Village.bought;
        },
        buyOptions: []
    },

   
}

gainEffects.gold = [Skills.Industrious];
gainEffects.mana = [Upgrades.GrowGold];
gainEffects.knowledge = [Skills.Knowledgeable];
gainEffects.blood = [];


export {Upgrades, Actions, Skills, Tiles};