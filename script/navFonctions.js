"use strict";

/**
 * Attache des gestionnaires d'événements de clic aux éléments de navigation et gère l'affichage des menus déroulants.
 *
 * @param {Array} navElements - Tableau d'éléments de navigation.
 * @param {Array} navDropdowns - Tableau des menus déroulants associés.
 * @param {Object} currentObj - Objet contenant la propriété 'currentDropdown' pour suivre l'index du menu déroulant actuellement affiché.
 * @param {string} bgColor - Couleur de fond à appliquer lorsqu'un élément de navigation est cliqué.
 * @param {Object} isFirstObj - Objet contenant la propriété 'isFirstClick' intervenant dans la gestion de la fermeture du menu deroulant
 * au second clic sur l'element de navigation
 */
export function addClickEvent(navElements,navDropdowns,currentObj,bgColor,isFirstObj){
    for(let i = 0; i < navElements.length;i++){
        navElements[i].addEventListener("click", e =>{
            if(currentObj.currentDropdown == i){
                isFirstObj.isFirstClick++
                return;
            }
            if(currentObj.currentDropdown != -1){
                navElements[currentObj.currentDropdown].style.backgroundColor = "transparent";
                navDropdowns[currentObj.currentDropdown].style.display ="none";
                isFirstObj.isFirstClick = 0;
            }

            isFirstObj.isFirstClick++;
            navElements[i].style.backgroundColor = `${bgColor}`;
            navDropdowns[i].style.display ="block";
            currentObj.currentDropdown = i;
        });
    }
}

export function exitDropdownOnClick(currentObj,navDropdowns,navElements,isFirstObj){
    document.addEventListener("click",e =>{
        if(window.innerWidth <= 540 && e.target.closest("#nav-left") && e.target != navElements[currentObj.currentDropdown].firstElementChild && e.target != navElements[currentObj.currentDropdown])
            return;
        else if(e.target.closest("#nav-left") && !(e.target.closest(".nav-dropdown")) && e.target != navElements[currentObj.currentDropdown].firstElementChild && e.target != navElements[currentObj.currentDropdown])
            return;
        else if(!e.target.closest("#nav-left"))
            isFirstObj.isFirstClick = 0;

        if(currentObj.currentDropdown != -1 && isFirstObj.isFirstClick != 1){
            navElements[currentObj.currentDropdown].style.backgroundColor = "transparent";
            navDropdowns[currentObj.currentDropdown].style.display = "none";
            currentObj.currentDropdown = -1;
            isFirstObj.isFirstClick = 0;
        }
    });
}

export function addBlueBorderOnClick(element){
    element.addEventListener("click", e =>{
        e.target.style.border = "1px solid rgb(133, 184, 224)";
        e.target.style.boxShadow ="0 0 5px 1px rgb(133, 184, 224)";
    });
}

export function deleteBlueBorderOnExternalClick(element,defaultBorder,defaultBoxShadow,currentOption){
    document.addEventListener("click", e =>{
        if(e.target.closest('select[name="cell_type" ]') && currentOption.currentCellType == e.target.selectedIndex) return;
        if(e.target.closest('select[name="cell_type" ]')) currentOption.currentCellType = e.target.selectedIndex;
        element.style.border = `${defaultBorder}`;
        element.style.boxShadow = `${defaultBoxShadow}`;
    });
}

export function renderOnBurgerClick(burgerElement,toRender){
    burgerElement.addEventListener("click", e =>{
        toRender.classList.toggle("nav-left-visible");
    });
}