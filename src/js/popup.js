function createBuyTilePopup(name, description, buyOptions){
    popup.style.visibility = "visible";
    popup.querySelector("#topPopup").innerHTML = `<h2>${name}</h2>`;
    popup.querySelector("#middlePopup").innerHTML = `${description}`;
    const popupBot = popup.querySelector("#bottomPopup");
    popupBot.innerHTML = "";
    buyOptions.forEach((buy) =>{
        let d = document.createElement("div");
        d.innerHTML = buy.name;
        d.onclick = () => buy.buy();
        d.classList.add("tileBuy");
        popupBot.appendChild(d);

        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        tooltip.innerHTML = buy.description;

        d.appendChild(tooltip);
    });
}

function createBoughtTilePopup(top, mid, bot="bought"){
    popup.style.visibility = "visible";
    popup.querySelector("#topPopup").innerHTML = `<h2>${top}</h2>`;
    popup.querySelector("#middlePopup").innerHTML = `${mid}`;
    popup.querySelector("#bottomPopup").innerHTML = `${bot}`;

}


export {createBuyTilePopup, createBoughtTilePopup}