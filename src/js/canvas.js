import { Tiles } from "./upgrades";
import {createBuyTilePopup, createBoughtTilePopup} from "./popup";

const canv = document.getElementById("mapCanvas");
const ctx = canv.getContext('2d');
canv.addEventListener("click", onClick);

const popup = document.getElementById("popup");

const tileSize = 40;
const questionMark = new Image(); 
let qMarkLoad = false; 
questionMark.src = "../public/images/questionMark.png";
questionMark.onload = () =>{
    qMarkLoad = true;
}



function canvasLoop(){




    drawTiles();
}

function drawTiles(){
    Object.values(Tiles).forEach((tile) =>{
        if(tile.bought){
            ctx.fillStyle = tile.color;
            ctx.fillRect(tile.pos.x*tileSize, tile.pos.y*tileSize, tileSize, tileSize);
        } else{
            ctx.fillStyle = "lightgray";
            ctx.fillRect(tile.pos.x*tileSize, tile.pos.y*tileSize, tileSize, tileSize);
            if(qMarkLoad){
                ctx.drawImage(questionMark,tile.pos.x*tileSize, tile.pos.y*tileSize);
            }
        }
    })
}

//Find clicked tile
function onClick(e){
    let mousePos = getMousePos(e);
    Object.values(Tiles).forEach((tile) =>{
        if(tile.pos.x*tileSize < mousePos.x && tile.pos.x*tileSize+tileSize > mousePos.x && tile.pos.y*tileSize < mousePos.y &&  tile.pos.y*tileSize+tileSize > mousePos.y){
            console.log(tile);
            if(tile.bought){
                createBoughtTilePopup(tile.name, tile.description);
            } else {
                createBuyTilePopup(tile.name, tile.description, tile.buyOptions);
            }
            
        }
    })
}





function  getMousePos(evt) {
    let rect = canv.getBoundingClientRect(), // abs. size of element
      scaleX = canv.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canv.height / rect.height;  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

export {canvasLoop};