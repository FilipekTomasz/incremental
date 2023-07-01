import { Resources, State } from "./data";
import { Actions, Skills, Upgrades } from "./upgrades";




function useAction(action){
    if(action.active) return;
  
    let canAfford = true;
    action.cost.forEach(e =>{
      if(typeof e.amount == 'function'){
        if(Resources[e.type.name].amount < e.amount()){
          canAfford = false;
        }
      } else {
        if(Resources[e.type.name].amount < e.amount){
          canAfford = false;
        }
      }
     
    })
  
    if(canAfford){
      action.cost.forEach(e =>{
        if(typeof e.amount == 'function'){
          Resources[e.type.name].amount -= e.amount();
        } else {
          Resources[e.type.name].amount -= e.amount;
        }
      })
      action.active = true;
    }
  }
  
  
  
  function buyUpgrade(upgrade){
    console.log("Buy",upgrade)
    let canAfford = true;
    upgrade.cost.forEach(e =>{
      if(typeof e.amount == 'function'){
        if(Resources[e.type.name].amount < e.amount()){
          canAfford = false;
          
        }
      } else {
        if(Resources[e.type.name].amount < e.amount){
          canAfford = false;
        }
      }
    })
    
  
  
    if(canAfford){
      upgrade.cost.forEach(e =>{
        if(typeof e.amount == 'function'){
          Resources[e.type.name].amount -= e.amount();
        } else {
          Resources[e.type.name].amount -= e.amount;
        }
      })
  
      State.upgrades.push(upgrade.id);
      applyUpgrade(upgrade.id, false);
      
  
  
      //Delete upgrade div
   
      
  
    }
  }

  function applyUpgrade(upgradeid, load=false){
    const upgradesArr = Object.values(Upgrades);
    let upgrade = upgradesArr.find(obj => {
      return obj.id == upgradeid
    });
    upgrade.bought = true;
    const parameters = {
      load: load,
    }
    upgrade.effect(parameters);
    if(!load){
      const upgradeEl = document.querySelector(`[data-id="upgrade${upgrade.id}"]`);
  
      upgradeEl.remove();
    }

  }
  
function buySkill(skill){
  if(skill.bought) return;


  let canAfford = true;
  skill.cost.forEach(e =>{
    if(typeof e.amount == 'function'){
      if(Resources[e.type.name].amount < e.amount()){
        canAfford = false;
      }
    } else {
      if(Resources[e.type.name].amount < e.amount){
        canAfford = false;
      }
    }
  })

  if(canAfford){
    skill.cost.forEach(e =>{
      if(typeof e.amount == 'function'){
        Resources[e.type.name].amount -= e.amount();
      } else {
        Resources[e.type.name].amount -= e.amount;
      }
    })
    State.skills.push(skill.id);
    applySkill(skill.id);
  }
}

function applySkill(skillid, load=false){
  const skillsArr = Object.values(Skills);
  let skill = skillsArr.find(obj => {
    return obj.id == skillid
  });


  skill.bought = true;
  skill.effect();

}

function hardReset(){
  if(confirm("Are you sure? This will delete your save")){
    localStorage.removeItem('save');
    location.reload();
  }
}


  export {useAction, buyUpgrade,applyUpgrade, buySkill, applySkill, hardReset}