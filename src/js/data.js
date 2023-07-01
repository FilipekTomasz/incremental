const gainEffects = {
    gold: [],
    mana: [],
    knowledge: [],
    blood: [],
}


let rank = 0;

const Resources = {
    None:{
        name:"None",
        amount: 0,
        cap: "nocap",
    },
    Gold:{
        name: "Gold",
        amount: 0,
        cap: 10,
    },
    Mana:{
        name: "Mana",
        amount: 0,
        cap: 50,
    },
    Knowledge:{
        name:"Knowledge",
        amount: 0,
        cap: "nocap",
    },
    Blood:{
        name:"Blood",
        amount: 0,
        cap: 10,
    },
}

function gainGold(base){
    let gain = base;
    gainEffects.gold.forEach(e =>{
        if(e.bought) gain = e.effect(gain);
    })
    Resources.Gold.amount += gain;
}
function gainMana(base){
    let gain = base;
    gainEffects.mana.forEach(e =>{
        if(e.bought) gain = e.effect(gain);
    })
    Resources.Mana.amount += gain;
}
function gainKnowledge(base){
    let gain = base;
    gainEffects.knowledge.forEach(e =>{
        if(e.bought) gain = e.effect(gain);
    })
    Resources.Knowledge.amount += gain;
}
function gainBlood(base){
    let gain = base;
    gainEffects.blood.forEach(e =>{
        if(e.bought) gain = e.effect(gain);
    })
    Resources.Blood.amount += gain;
}

const Timers = {
    Mana:{
        timer: 0,
        cd: 5,
        effectValue: 1,
        available: false,
        effect(){
            gainMana(this.effectValue);
        },
    },
    Blood:{
        timer: 0,
        cd: 7,
        effectValue: 1,
        available: false,
        effect(){
            gainBlood(this.effectValue);
        },
    }
}

const RankNames = {
    0: "Novice",
    1: "Apprentice",
}

const Stats = {
    Body:{
        name:"Body",
        amount: 1,
        multi: 1,
        effect: 0.20,
        gain(gain, load=false){
            console.log(gain, "gain body")
            //Change blood cap based on body
            let bloodCap = Resources.Blood.cap;
            if(!load){
                console.log(bloodCap)
                bloodCap = Resources.Blood.cap/(1 + this.amount*this.effect);
                console.log(bloodCap)
            }
            this.amount += gain * this.multi;



            console.log(1 + this.amount*this.effect)
            Resources.Blood.cap = bloodCap * (1 + this.amount*this.effect);
        }
    },
    Mind:{
        name:"Mind",
        amount: 1,
        multi: 1,
        effect: 1.05,
        gain(gain, load=false){
            this.amount += gain * this.multi;
        }
    },
    Charisma:{
        name:"Charisma",
        amount: 1,
        multi: 1,
        effect: 1.05,
        gain(gain, load=false){
            this.amount += gain * this.multi;
        }
    }
}

const State = {
    upgrades: [
        //id
    ],
    skills: [
        //id
    ],
    visibleUpgrades: [
        //id
    ],
    resources: [
        //{name: name, amount: amount}
    ],
    stats:[
        {
            name: Stats.Body.name,
            amount: Stats.Body.amount,
        },
        {
            name: Stats.Mind.name,
            amount: Stats.Mind.amount,
        },
        {
            name: Stats.Charisma.name,
            amount: Stats.Charisma.amount,
        },
    ],
    actionsTimesUsed:[
        //{id: id, amount: amount}
    ],
}




export {Resources, rank, RankNames, Timers, gainGold, gainMana, gainKnowledge, gainBlood, State, gainEffects, Stats};
