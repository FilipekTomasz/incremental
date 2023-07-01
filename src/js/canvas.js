const canv = document.getElementById("mapCanvas");
const ctx = canv.getContext('2d');

const tileSize = 40;


function canvasLoop(){
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, canv.height - tileSize, tileSize, tileSize);
    console.log("www");
}




export {canvasLoop};