import '../scss/main.scss'; //Get scss for webpack
import { Resources, Timers, State, Stats} from './data.js'
import { Actions } from './upgrades.js';
import { draw, drawSetup, drawUpgrade } from "./draw.js"
import { applyUpgrade, applySkill, hardReset } from './userEvents';

let lastRender = 0;



let reset = document.getElementById("reset");
reset.onclick = hardReset;

function update(progress) {
    // Update the state of the world for the elapsed time since last render
    handleTimers(progress);



    capResources();
  }
  

  
  function loop(timestamp) {
    let progress = (timestamp - lastRender)/1000;
    update(progress);
    draw();
  
    lastRender = timestamp
    window.requestAnimationFrame(loop)
  }


function actionsTimer(progress){
  const actionsArr = Object.values(Actions);
  actionsArr.forEach(e =>{
    if(e.active){
      e.timer += progress;
    }
   
    if(e.timer > e.cd){
      e.timer = 0;
      e.effect();
      e.active = false;
    }
  })
}



function capResources(){
  const resourcesArr = Object.values(Resources);
  resourcesArr.forEach(res => {
    if(res.cap != "nocap"){
      if(res.amount > res.cap){
        res.amount = res.cap;
      }
    }
  })
}




function handleTimers(progress){
  actionsTimer(progress);

  const timesArr = Object.values(Timers);
  timesArr.forEach(t => {
    if(t.available){
      t.timer += progress;
      if(t.timer > t.cd){

        t.timer = 0;
        t.effect();
      }
    }
  })

}


function saveGame(){
  let s = State;
  //Save resourecs
  const resourecsArr = Object.values(Resources);
  resourecsArr.forEach(r => {
    let index = s.resources.findIndex(i => i.name == r.name);
    if(index != null){
      s.resources[index].amount = r.amount
    }

  })



  

  //Save stats
  s.stats[0].amount = Stats.Body.amount;
  s.stats[1].amount = Stats.Mind.amount;
  s.stats[2].amount = Stats.Charisma.amount;


  console.log("Saved:", s);
  localStorage.setItem("save", JSON.stringify(s));
}

window.setInterval(function(){
  saveGame();
}, 5000);
//window.onbeforeunload = saveGame;

function loadGame(){
  const save = JSON.parse(localStorage.getItem("save"));
  if(save == null) return;
  console.log("Load:", save);
  //Load resources
  const resourecsArr = Object.values(Resources);
  resourecsArr.forEach(s => {
    save.resources.forEach(r => {
      if(r.name == s.name){

        s.amount = r.amount;
      }
    })
  })

  Object.assign(State, save);
  initState();

  if(save.upgrades == null) return;

  save.upgrades.forEach(e => {
    applyUpgrade(e, true);
  })

  if(save.skills == null) return;

  save.skills.forEach(e => {
    applySkill(e);
  })


  if(save.visibleUpgrades == null) return;
  //Check if reqs met before that not longer apply and not bought
  save.visibleUpgrades.forEach(e => {
    let u = save.upgrades.find(i => i == e);
    if(u == null){
      console.log("upgrade", e)
      drawUpgrade(e);
    }
  })

  if(save.stats == null) return;

  save.stats.forEach(e => {
    Object.keys(Stats).forEach((stat) => {
      if(Stats[stat].name == e.name){
        Stats[stat].amount = e.amount;
        Stats[stat].gain(0, true);
      }
    })   
  })

  if(save.actionsTimesUsed == null) return;

  save.actionsTimesUsed.forEach(e => {
    Object.keys(Actions).forEach((action) => {
      if(Actions[action].id == e.id){
        Actions[action].timesUsed = e.amount;
      }
    })   
  })



}

function initState(){
  const resourecsArr = Object.values(Resources);
  resourecsArr.forEach(r => {
    let index = State.resources.findIndex(i => i.name == r.name);
    if(index == -1){
      State.resources.push({name: r.name, amount: r.amount});
    }
  })
}




function setup(){
  loadGame();
  drawSetup();
  
}


setup();



window.requestAnimationFrame(loop)
  