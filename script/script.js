"use strict";
import { addBlueBorderOnClick, addClickEvent, deleteBlueBorderOnExternalClick, exitDropdownOnClick,renderOnBurgerClick } from "./navFonctions.js"



let navElements = document.querySelectorAll("#nav-left > li");
let navDropdowns = document.getElementsByClassName("nav-dropdown");
let headerBottomSelect = document.querySelector('select[name="cell_type" ]');
let grayVariant1 = getComputedStyle(document.querySelector("hr")).getPropertyValue("border-right-color");
let HeaderBottomSelectborderStyle = getComputedStyle(headerBottomSelect).getPropertyValue("border");
let HeaderBottomSelectBoxShadow = getComputedStyle(headerBottomSelect).getPropertyValue("box-shadow");
let currentDropdownObj = {currentDropdown : -1 };
let isFisrtClickObj = {isFirstClick:0};
let currentCellTypeObj = {currentCellType:0}; // Ceci me participe au respecter du comportement front du select(bordure blue), c'est plutot une
// valeur en rapport avec la valeur du select
let burderIcon = document.getElementById("burger-icon");
let navLeft = document.getElementById("nav-left");
let divEditorList = {}; // div avec l'id de la forme cell1 , cell2 ...
divEditorList["div1"] = document.querySelector("#cell1");
let cell1Clone = divEditorList["div1"].cloneNode(true); 
let numberOfCell = 1; // le nombre de cellule creer depuis le debut 
let currentCell = divEditorList["div1"];
let moveSelectedCellsUpBtn = document.querySelector('button[title="move selected cells up"]');
let moveSelectedCellsDownBtn = document.querySelector('button[title="move selected cells down"]');
let runBtn = document.querySelector('button[title="run cell, select below"]');
let insertCellBelowBtn = document.querySelector('button[title="insert cell below"');
let menuInsertOption = document.querySelector("#menuInsert .nav-dropdown").children;
let menuEditMoveOptions = Array.from(document.querySelector("#menuEdit .nav-dropdown").children).slice(12,14);
let menuEditDeleteOption = document.querySelector("#menuEdit .nav-dropdown").children[5];
let menuCellOptions = Array.from(document.querySelector("#menuCell .nav-dropdown").children).slice(0,4);
let dbclDiv = document.getElementById("dbclToAddCell"); // C'est la div qu'on double clique pour ajouter une nouvelle cellule
let outputCodeList = {}; // contient les cellules d'output , obtenu apres execution d'une cellule de type code
let outputMarkdownList = {}; // contient les cellules d'output, obtenu apres execution d'une cellule de type markdown
let renameBoxCloseBtn = document.querySelector("#renameBox div:first-child button");
let renameBoxContainer = document.querySelector("#renameBoxContainer");
let renameBoxCancelBtn = document.querySelector("#renameBox div:last-child button:first-child");
let renameBoxRenameBtn = document.querySelector("#renameBox div:last-child button:last-child");;
let renameMenuItem = document.getElementById("renameMenuItem");
let renameBoxInput = document.querySelector('input[ name="notebookName"]');
let renameBoxP = document.querySelector("#renameBox p");
let pythonBrandOtherH1 = document.querySelector("#jupyterBrand-others h1");

let outputMarkdownCellTemplate = document.createElement("DIV");
outputMarkdownCellTemplate.id = "outputMarkdown";
outputMarkdownCellTemplate.classList.add("markdown");
outputMarkdownCellTemplate.innerHTML = `<div class="cell-div">
                                                <pre>In [<span class="numberOfRun"> </span>]:</pre>
                                                <pre class="markdownPre"></pre>
                                        </div>`;

//  Ajout de l'evement click aux elements du navbar
addClickEvent(navElements,navDropdowns,currentDropdownObj,grayVariant1,isFisrtClickObj,navLeft);
// gestion de la disparition du current navDropdowns au click sur un element
exitDropdownOnClick(currentDropdownObj,navDropdowns,navElements,isFisrtClickObj);
// bodure et ombre blue au click sur le select de header bottom et suppression de ces styles au click a l'exterieur
addBlueBorderOnClick(headerBottomSelect);
deleteBlueBorderOnExternalClick(headerBottomSelect,HeaderBottomSelectborderStyle,HeaderBottomSelectBoxShadow,currentCellTypeObj);
// pour les tailles <= 540px nous avons le menu burger cette fonction est relatif au fonctionnement de cette derniere
renderOnBurgerClick(burderIcon,navLeft);


// Utilisation de Ace.js pour le coloration syntaxique...
let editorList = {};
editorList["editor1"] = ace.edit("editor1");
// evenement permettant de definir la cellule comme celle avec focus et lui donne la classe focused-cell
// Chaque cellule aura cette evenement
divEditorList["div1"].addEventListener("click", e =>{
    currentCell.classList.remove("focused-cell");
    currentCell = divEditorList["div1"];
    currentCell.classList.add("focused-cell");
    if(currentCell.classList.contains("code"))
        headerBottomSelect.value = "Code";
    else
        headerBottomSelect.value = "Markdown";

});

editorList["editor1"].setOptions({
    maxLines: Infinity,
    highlightActiveLine: false,
    showGutter: false,
    cursorStyle: "slim",
    fontFamily: "monospace, sans-serif",
    fontSize: "14px",
    showPrintMargin: false,
    displayIndentGuides: false,
    mode: "ace/mode/html",
    theme: "ace/theme/cloud_editor"
});



// ajout d'une nouvelle cellule
function addNewCell(position){
    numberOfCell++;
    const newCell = cell1Clone.cloneNode(true);
    newCell.id = "cell" + numberOfCell;
    newCell.children[0].children[1].id = "editor" + numberOfCell;

    if(position == "default")
        currentCell.parentElement.appendChild(newCell);
    else if(position == "aboveCurrent")
        currentCell.parentElement.insertBefore(newCell,currentCell);
    else
        currentCell.parentElement.insertBefore(newCell,currentCell.nextElementSibling);

    headerBottomSelect.value = "Code";
    divEditorList["div" + numberOfCell] = newCell;
    currentCell.classList.remove("focused-cell");
    currentCell = divEditorList["div" + numberOfCell];
    currentCell.classList.add("focused-cell");
    let strDivId = `div${numberOfCell}`;

    divEditorList["div" + numberOfCell].addEventListener("click", e =>{
        e.stopPropagation()
        currentCell.classList.remove("focused-cell");
        currentCell = divEditorList[strDivId];
        currentCell.classList.add("focused-cell");
        if(currentCell.classList.contains("code"))
            headerBottomSelect.value = "Code";
        else
            headerBottomSelect.value = "Markdown";

    });

    editorList["editor" + numberOfCell] = ace.edit("editor" + numberOfCell);
    editorList["editor" + numberOfCell].setValue("");
    editorList["editor" + numberOfCell].setOptions({
        maxLines: Infinity,
        highlightActiveLine: false,
        showGutter: false,
        cursorStyle: "slim",
        fontFamily: "monospace, sans-serif",
        fontSize: "14px",
        showPrintMargin: false,
        displayIndentGuides: false,
        mode: "ace/mode/html",
        theme: "ace/theme/cloud_editor"
    });

}

insertCellBelowBtn.addEventListener("click", function(){
    addNewCell("belowCurrent");
});
dbclDiv.addEventListener("dblclick", function(){
    addNewCell("default");
});

menuInsertOption[0].addEventListener("click",function(){
    addNewCell("aboveCurrent");
});

menuInsertOption[1].addEventListener("click",function(){
    addNewCell("belowCurrent");
});

document.addEventListener("keyup",event =>{
    if(document.activeElement.tagName == "TEXTAREA") return;
    if(event.code == "KeyA")
        addNewCell("aboveCurrent");
    else if (event.code == "KeyB")
        addNewCell("belowCurrent");
});


// Fonctionalite move selected cell 
function moveSelectedCell(direction){
    if(direction == "up"){
        if(!currentCell.previousElementSibling) return;
        currentCell.parentElement.insertBefore(currentCell,currentCell.previousElementSibling);
    }else{
        if(!currentCell.nextElementSibling) return;
        currentCell.parentElement.insertBefore(currentCell,currentCell.nextElementSibling.nextElementSibling);
    }
    
}

moveSelectedCellsUpBtn.addEventListener("click",function(){
    moveSelectedCell("up");
});
moveSelectedCellsDownBtn.addEventListener("click", function(){
    moveSelectedCell("down");
});

menuEditMoveOptions[0].addEventListener("click",function(){
    moveSelectedCell("up");
});

menuEditMoveOptions[1].addEventListener("click", function(){
    moveSelectedCell("down");
});

// Changer le type d'une cellule
document.addEventListener("keyup", e =>{
    if(e.code == "KeyM" && document.activeElement.tagName != "TEXTAREA"){
        if(currentCell.classList.contains("markdown")) return;
        headerBottomSelect.value = "Markdown";
        currentCell.classList.remove("code");
        currentCell.classList.add("markdown");
        outputCodeList["output" + currentCell.id.slice(4,currentCell.id.length)].remove()
        outputCodeList["output" + currentCell.id.slice(4,currentCell.id.length)] = undefined;
    }else if(e.code == "KeyY" && document.activeElement.tagName != "TEXTAREA"){
        if(currentCell.classList.contains("code")) return;
        headerBottomSelect.value = "Code";
        currentCell.classList.remove("markdown");
        currentCell.classList.add("code");
        let spanElements = document.querySelectorAll("#" + currentCell.id + " " + ".numberOfRun");
        for(let span of spanElements){
                span.innerText = " ";
        }
            
    }
});
headerBottomSelect.addEventListener("change", e =>{
    if(currentCell.classList.contains(headerBottomSelect.value.toLowerCase())) return;

    
    if(headerBottomSelect.value == "Code" && currentCell.id.slice(0,14) != "outputMarkdown"){
        currentCell.classList.remove("markdown");
        currentCell.classList.add("code");
    }else if(headerBottomSelect.value == "Code" && currentCell.id.slice(0,14) == "outputMarkdown"){
        let idElement = currentCell.id;
        currentCell.parentElement.insertBefore(divEditorList["div" + idElement.slice(14,idElement.length)],currentCell);
        outputMarkdownList[idElement].remove();
        currentCell = divEditorList["div" + idElement.slice(14,idElement.length)];
        currentCell.classList.remove("markdown");
        currentCell.classList.add("code");
    }else{
        currentCell.classList.remove("code");
        currentCell.classList.add("markdown");
        let outputCellId = "output" + currentCell.id.slice(4,currentCell.id.length);
        if(outputCodeList.hasOwnProperty(outputCellId) && outputCodeList[outputCellId] != undefined){
            let firstSpanElement = document.querySelector("#" + currentCell.id + " " + ".numberOfRun");
            firstSpanElement.innerText = " ";
            outputCodeList[outputCellId].remove()
            outputCodeList[outputCellId] = undefined;
        }
    }
});

// Executer une cellule
let runCount = 0;
function runCell(){
        
        if(currentCell.classList.contains("code")){
    
            let outputCellId = "output" + currentCell.id.slice(4,currentCell.id.length);
            let isSomething = Boolean(editorList[`editor${currentCell.id.slice(4,currentCell.id.length)}`].getValue().trim());// booleean qui vaut true s'il y'a du texte dans
            // le textarea  ou false sinon
            if(!isSomething && outputCodeList[outputCellId] != undefined){
            
                let firstSpanElement = document.querySelector("#" + currentCell.id + " " + ".numberOfRun");
                firstSpanElement.innerText = " ";
                outputCodeList[outputCellId].remove()
                outputCodeList[outputCellId] = undefined;
                return;
            }else if(!isSomething && outputCodeList[outputCellId] == undefined)
                return;
            
            

            if(!outputCodeList.hasOwnProperty(outputCellId) || outputCodeList[outputCellId] == undefined){
                let newOutputCell = document.createElement("DIV");
                newOutputCell.classList.add("cell-div");
                newOutputCell.classList.add("output");
                newOutputCell.id = outputCellId;
                newOutputCell.innerHTML = '<pre>Out [<span class="numberOfRun"></span>]:</pre><div class="content"></div>';
                outputCodeList[outputCellId] = newOutputCell;
                currentCell.appendChild(newOutputCell);
            }
    
            outputCodeList[outputCellId].children[1].innerHTML = editorList["editor" + currentCell.id.slice(4,currentCell.id.length)].getValue();
            let spanElements = document.querySelectorAll("#" + currentCell.id + " " + ".numberOfRun");
            runCount++;
            for(let span of spanElements){
                span.innerText = `${runCount}`;
            }
            
        }else{
            let outputMarkdownElementId = "outputMarkdown" + currentCell.id.slice(4,currentCell.id.length);
            if(outputMarkdownList[outputMarkdownElementId] == undefined){
                let outputCell = outputMarkdownCellTemplate.cloneNode(true);
                outputCell.id = outputMarkdownElementId;
                outputMarkdownList[outputMarkdownElementId] = outputCell;
                outputMarkdownList[outputMarkdownElementId].children[0].children[1].innerText = (editorList["editor" + currentCell.id.slice(4,currentCell.id.length)].getValue().trim()) ? editorList["editor" + currentCell.id.slice(4,currentCell.id.length)].getValue() :"Type Markdown and LaTeX:  𝛼2";
                currentCell.parentElement.insertBefore(outputCell,currentCell);
                divEditorList["div" + currentCell.id.slice(4,currentCell.id.length)].remove();
                currentCell = outputMarkdownList[outputMarkdownElementId];
                currentCell.classList.add("focused-cell");
                //---------------------- Event-------------------------------------------//
                outputMarkdownList[outputMarkdownElementId].addEventListener("click", e =>{
                    e.stopPropagation()
                    currentCell.classList.remove("focused-cell");
                    currentCell = outputMarkdownList[outputMarkdownElementId];
                    currentCell.classList.add("focused-cell");
                    headerBottomSelect.value = "Markdown";
        
                });
    
                outputMarkdownList[outputMarkdownElementId].addEventListener("dblclick", function(){
                    
                    currentCell.parentElement.insertBefore(divEditorList["div" + outputMarkdownElementId.slice(14,outputMarkdownElementId.length)],currentCell);
                    outputMarkdownList[outputMarkdownElementId].remove();
                    currentCell = divEditorList["div" + outputMarkdownElementId.slice(14,outputMarkdownElementId.length)];
                });
                //-------------------------------------------------------------------------//
                
            }else{
                
                outputMarkdownList[outputMarkdownElementId].children[0].children[1].innerText = (editorList["editor" + currentCell.id.slice(4,currentCell.id.length)].getValue().trim()) ? editorList["editor" + currentCell.id.slice(4,currentCell.id.length)].getValue() :"Type Markdown and LaTeX:  𝛼2";
                currentCell.parentElement.insertBefore(outputMarkdownList[outputMarkdownElementId],currentCell);
                divEditorList["div" + currentCell.id.slice(4,currentCell.id.length)].remove();
                currentCell = outputMarkdownList[outputMarkdownElementId];
                currentCell.classList.add("focused-cell");
                
            }
            
        }
}
runBtn.addEventListener("click", e =>{
    runCell();
        if(currentCell.nextElementSibling){
                currentCell.classList.remove("focused-cell");
                currentCell = currentCell.nextElementSibling;
                currentCell.classList.add("focused-cell");
        }else{
            addNewCell("default");
        }
} ); // run and select below

document.addEventListener("keydown", e =>{
    if (e.shiftKey && e.code == 'Enter'){
        e.preventDefault();
        runCell();
        if(currentCell.nextElementSibling){
                currentCell.classList.remove("focused-cell");
                currentCell = currentCell.nextElementSibling;
                currentCell.classList.add("focused-cell");
        }else{
            addNewCell("default");
        }
        
    }else if(e.ctrlKey && e.code == 'Enter'){
        runCell();
    }else if(e.altKey && e.code == 'Enter'){
        runCell();
        addNewCell("belowCurrent");
    }
});

menuCellOptions[0].addEventListener("click", e =>{
    runCell();
});

menuCellOptions[1].addEventListener("click", e =>{
    runCell();
        if(currentCell.nextElementSibling){
                currentCell.classList.remove("focused-cell");
                currentCell = currentCell.nextElementSibling;
                currentCell.classList.add("focused-cell");
        }else{
            addNewCell("default");
        }
});

menuCellOptions[2].addEventListener("click", e =>{
    runCell();
    addNewCell("belowCurrent");
});


// Suppresion d'element
function deleteCell(){
    if(currentCell.nextElementSibling){
        let newCurrentCells = currentCell.nextElementSibling;
        currentCell.remove();
        currentCell = newCurrentCells;
        currentCell.classList.add("focused-cell");
    }else if(currentCell.previousElementSibling){
        let newCurrentCells = currentCell.previousElementSibling;
        currentCell.remove();
        currentCell = newCurrentCells;
        currentCell.classList.add("focused-cell");
    }else{
        editorList["editor" + currentCell.id.slice(4,currentCell.id.length)].setValue("");
        let outputCellId = "output" + currentCell.id.slice(4,currentCell.id.length);
        if(outputCodeList.hasOwnProperty(outputCellId) && outputCodeList[outputCellId] != undefined){
            let firstSpanElement = document.querySelector("#" + currentCell.id + " " + ".numberOfRun");
            firstSpanElement.innerText = " ";
            outputCodeList[outputCellId].remove()
            outputCodeList[outputCellId] = undefined;
        }
        return;
    }
}

menuEditDeleteOption.addEventListener("click", e =>{
    deleteCell();
});

let suppKeyPressCount = 0;
let timeoutID;
document.addEventListener("keyup", e =>{
    
    if(e.code == "KeyD" && document.activeElement.tagName != "TEXTAREA"){

        suppKeyPressCount++;
        if(suppKeyPressCount == 1){
            timeoutID = setTimeout(() =>{suppKeyPressCount = 0;}, 500);
        }else if (suppKeyPressCount >= 2){
            deleteCell();
            clearTimeout(timeoutID);
            suppKeyPressCount = 0;
        }
    }   
});

// Renommer le notebook

renameBoxCloseBtn.addEventListener("click", (e) =>{
    renameBoxContainer.classList.add("renameBox-hidden");
});

renameBoxCancelBtn.addEventListener("click", e =>{
    renameBoxContainer.classList.add("renameBox-hidden");
});

renameMenuItem.addEventListener("click", e =>{
    renameBoxP.innerText = "Enter a new notebook name :";
    renameBoxContainer.classList.remove("renameBox-hidden");
});

renameBoxRenameBtn.addEventListener("click", e =>{
    let newName = renameBoxInput.value.trim();
    if(newName == ""){
        renameBoxP.innerText = "Invalid notebook name. Notebook names must have 1 or more characters and can contain any characters except :/\. Please enter a new notebook name:";
    }else{
        document.title = newName + "- jupyter Notebook";
        pythonBrandOtherH1.innerText = newName;
        renameBoxContainer.classList.add("renameBox-hidden");
    }
});