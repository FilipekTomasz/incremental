import { Upgrades, Actions, Skills } from "./upgrades";
import { Resources, Timers, RankNames, State, Stats } from "./data";
import { buyUpgrade,useAction, buySkill } from "./userEvents";
import { canvasLoop } from "./canvas";
const manaProgressBarEl = document.getElementById("manaProgress");
// const manaCounterEl = document.getElementById("manaCounter");
const goldCounterEl = document.getElementById("goldCounter");
const knowledgeCounterEl = document.getElementById("knowledgeCounter");
const upgradeContaierEl = document.getElementById("upgrade-container");
const rankEl = document.getElementById("rankCounter");
const actionsEl = document.getElementById("actionsContainer");
const tabsContainerEl = document.getElementById("tabs-container");
const skillsEl = document.querySelector(".tab-left-skills");
const manaBarEl = document.getElementById("manaBar");
const tabRight = document.querySelector(".tab-right");
const tabMiddle = document.querySelector(".tab-middle");
const bodyCounterEl = document.getElementById("bodyCounter");
const mindCounterEl = document.getElementById("mindCounter");
const charismaCounterEl = document.getElementById("charismaCounter");
const bloodBarEl = document.getElementById("bloodBar");
const bloodProgressBarEl = document.getElementById("bloodProgress");

const Tabs = {
    Main:{
        name:"Actions",
        container: document.getElementById("mainTab"),
        currentlyVisible:false,
        show:true,
        requirement: () =>{
            return true;
        }
    },
    Skills:{
        name:"Skills",
        container: document.getElementById("skillsTab"),
        currentlyVisible:false,
        show:true,
        requirement: () =>{
            return Upgrades.UnlockSkills.bought;
        }
    },
    World:{
      name:"World",
      container: document.getElementById("mapTab"),
      currentlyVisible:false,
      show:true,
      requirement: () =>{
          return Upgrades.Adventurous.bought;
      }
  }
}

let currentTab = Tabs.Main;
let changedTab = false;
function draw() {
    // Draw the state of the world
    if(Timers.Mana.available){
      manaBarEl.style.display = "block"


      manaProgressBarEl.style.width = `${(Resources.Mana.amount/Resources.Mana.cap)*100}%`;
     // progressBarEl.parentElement.innerText = `${Math.floor(Resources.Mana.amount)}/${Math.floor(Resources.Mana.cap)}`;
     manaProgressBarEl.parentElement.querySelector('p').innerHTML = `${Math.floor(Resources.Mana.amount)}/${Math.floor(Resources.Mana.cap)}`;
     // manaCounterEl.innerHTML = `Mana: ${Math.floor(Resources.Mana.amount)}/${Math.floor(Resources.Mana.cap)}`;
    }
    if(Timers.Blood.available){
      bloodBarEl.style.display = "block"


      bloodProgressBarEl.style.width = `${(Math.floor(Resources.Blood.amount)/Math.floor(Resources.Blood.cap))*100}%`;
     bloodProgressBarEl.parentElement.querySelector('p').innerHTML = `${Math.floor(Resources.Blood.amount)}/${Math.floor(Resources.Blood.cap)}`;
    }



    if(Upgrades.UnlockStats.bought){
      bodyCounterEl.innerHTML = `Body: ${Stats.Body.amount}`;
      mindCounterEl.innerHTML = `Mind: ${Stats.Mind.amount}`;
      charismaCounterEl.innerHTML = `Charisma: ${Stats.Charisma.amount}`;

    }
  
    goldCounterEl.innerHTML = `Gold: ${Math.floor(Resources.Gold.amount)}/${Math.floor(Resources.Gold.cap)}`;
    

    if(Upgrades.ReadingLessons.bought)  knowledgeCounterEl.innerHTML = `Knowledge: ${Math.floor(Resources.Knowledge.amount)}`;

    
    
    checkUpgrades();
    drawActions();
    drawActionTimers();
    drawSkills();
    drawTabs();


    if(currentTab == Tabs.World){
      canvasLoop();
    }


}


function drawActionTimers(){
    const actionProgs = Array.from(document.querySelectorAll('.progress-action'))
    actionProgs.forEach(e =>{
      const actionsArr = Object.values(Actions);
      let act =  actionsArr.find(a => a.name == e.parentElement.querySelector("h3").innerText)
      e.style.width = `${(act.timer/act.cd)*100}%`
    })
}
  
  
  
function drawActions(){
    const actionsArr = Object.values(Actions);
  
    actionsArr.forEach(action => {
      


      if(!action.visible && !action.bought && action.requirement()){
        action.visible = true;
  
        const act = document.createElement("div");
        act.classList.add("action");
        
        act.innerHTML = `<h3>${action.name}</h3>`;
        act.dataset.id = `action${action.id}`;
        act.onclick = () => useAction(action);
        actionsEl.appendChild(act);
  
  
        const actProg = document.createElement("div");
        actProg.classList.add("progress-action");
        act.appendChild(actProg);

        
        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        if(typeof action.description == 'function'){
          tooltip.innerHTML = action.description();
        } else {
          tooltip.innerHTML = action.description;
        }
        
        act.appendChild(tooltip)
    } else if(typeof action.description == 'function' && action.visible){
      const div = document.querySelector(`[data-id="action${action.id}"]`);
      const tooltipp = div.querySelector(':scope > .tooltip');
      if(action.description() != tooltipp.innerHTML){
        tooltipp.innerHTML = action.description();
      } 
    }
    
  })
}



function checkUpgrades(){
    const upgradesArr = Object.values(Upgrades);
    upgradesArr.forEach(upgrade => {
      if(!upgrade.visible && !upgrade.bought && upgrade.requirement() && upgrade.tabName == currentTab.name || changedTab && upgrade.visible && upgrade.tabName == currentTab.name  && !upgrade.bought){
        State.visibleUpgrades.push(upgrade.id);
        drawUpgrade(upgrade.id);
        changedTab = false;
      }
    });
}

function deleteUpgrades(){
  State.visibleUpgrades.forEach(e => {
    console.log(e)
      Object.values(Upgrades).forEach((upgrade) => {
        if(e == upgrade.id && !upgrade.bought){
          const upgradeEl = document.querySelector(`[data-id="upgrade${upgrade.id}"]`);
          console.log(upgradeEl);
          console.log(upgrade)
          upgradeEl.remove();
          const index = State.visibleUpgrades.indexOf(upgrade.id);
          State.visibleUpgrades.splice(index, 1);
        }
       
      })
    }) 
}



function drawUpgrade(id){
  const upgradesArr = Object.values(Upgrades);
  let upgrade = upgradesArr.find(e => e.id == id);


  upgrade.visible = true;
  const btn = document.createElement("div");
  btn.classList.add("upgrade");
  btn.dataset.id = `upgrade${upgrade.id}`;
  let costText = "";
  let first = true;
  upgrade.cost.forEach(e =>{
    let t = first;
    first = false;
    if(t){
      if(typeof e.amount == 'function'){
        costText += `${e.amount()} ${e.type.name}`;
      } else {
        costText += `${e.amount} ${e.type.name}`;
      }
      
    } else {
      if(typeof e.amount == 'function'){
        costText += `, ${e.amount()} ${e.type.name}`;
      } else {
        costText += `, ${e.amount} ${e.type.name}`;
      }
    }
  });
    

  btn.innerHTML = `<h3>${upgrade.name}</h3><p>${upgrade.description}</p><p>Cost: ${costText}</p>`;
  btn.onclick = () => buyUpgrade(upgrade);
  upgradeContaierEl.appendChild(btn);


        
        //Description on hover

        // const tooltip = document.createElement("span");
        // tooltip.classList.add("tooltip");
        // tooltip.innerHTML = upgrade.description;
        // btn.appendChild(tooltip)

}


function drawTabs(){
    
  const tabsArr = Object.values(Tabs);
  tabsArr.forEach(t => {
    if(t.show && !t.currentlyVisible && t.requirement()){
        t.currentlyVisible = true;


        let d = document.createElement("div");
        d.classList.add("tabs");
        d.onclick = () => changeTab(t.name);
        d.innerHTML = t.name;
        tabsContainerEl.appendChild(d);
        
    }
  })
}

function drawSkills(){
  const skillsArr = Object.values(Skills);
  skillsArr.forEach(s => {
    if(!s.visible && s.requirement()){
      s.visible = true;
      let d = document.createElement("div");
      d.classList.add("skill");
      d.id=`skill${s.id}`;
      d.onclick = () => buySkill(s);
      skillsEl.appendChild(d);


      let costText = "";
      let first = true;
      s.cost.forEach(e =>{
        let t = first;
        first = false;
        if(t){
          if(typeof e.amount == 'function'){
            costText += `${e.amount()} ${e.type.name}`;
          } else {
            costText += `${e.amount} ${e.type.name}`;
          }
          
        } else {
          if(typeof e.amount == 'function'){
            costText += `, ${e.amount()} ${e.type.name}`;
          } else {
            costText += `, ${e.amount} ${e.type.name}`;
          }
        }
      });
        
      const tooltip = document.createElement("span");
      tooltip.classList.add("tooltip");
      tooltip.innerHTML = `<h3>${s.name}</h3><p>${s.description}</p><p>${costText}</p>`;
      d.appendChild(tooltip)
    }

    if(s.bought){
      const skillEl = document.getElementById(`skill${s.id}`)
  
      skillEl.style.backgroundColor = "#46cf6b";
    }

  })
}




function changeTab(tabName){
    const tabsArr = Object.values(Tabs);
    let tab = tabsArr.find(t => {
      return t.name === tabName;
    })
   

    //Hide upgrade section
    if(tab == Tabs.Skills){
      console.log("g")
      tabRight.style.display = "none";
      tabMiddle.style.width = "80%"
    } else {
      tabRight.style.display = "flex";
      tabMiddle.style.width = "40%"
    }





    currentTab.container.style.display = "none";
    tab.container.style.display = "flex";
    currentTab = tab;
    changedTab = true;
    document.getElementById("popup").style.visibility = "hidden";
    deleteUpgrades();
  }
  




function drawSetup(){
    currentTab.container.style.display = "flex";
    drawTabs();
}



  export {draw, drawSetup, drawUpgrade};