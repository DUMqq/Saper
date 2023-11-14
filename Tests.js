let body = document.querySelector('body')
let field = document.querySelector('table')
let restartButton = document.querySelector('#restart')
let minesTxt = document.querySelector('#mines-count')
let timeTxt = document.querySelector('#time')
let difficultyVal = document.querySelector('#difficulty')
let sizeVal = document.querySelector('#size')
let modeChanger = document.querySelector('#cusore-mode')

// Открывает ближайшие ячейки возле пустой
function openClosest(pos){
    let i = Math.trunc(pos / size)
    let j = pos % size

    for(let g = i - 1; g < i + 2; g++){
        for(let r = j - 1; r < j + 2; r++){

            if (field.children[g] !== undefined){
                if (field.children[g].children[r] !== undefined){
                    
                   if(!field.children[g].children[r].opened && !field.children[g].children[r].isFlag) {

                        if(field.children[g].children[r].minesArond === 0){
                            freePosLeft--
                            field.children[g].children[r].style.backgroundColor = 'white'
                            field.children[g].children[r].opened = true
                            openClosest(g * size + r)
                        } else if(field.children[g].children[r].minesArond < 9){
                            freePosLeft--
                            field.children[g].children[r].opened = true
                            field.children[g].children[r].style.color = 'grey'
                            field.children[g].children[r].style.backgroundColor = 'white'
                            field.children[g].children[r].textContent = field.children[g].children[r].minesArond
                        }else if(field.children[g].children[r].minesArond >= 9 && !field.children[g].children[r].isFlag){
                            field.parentElement.classList.toggle('lose')
                            clearInterval(timer)
                            clearAll()
                        }
                    }
                    
                }
            }
        }
    }
}
// Открывает ближайшие по нажатию на цыфру, если достаточно мин помечено флажками
function countFlags(pos){
    let i = Math.trunc(pos / size)
    let j = pos % size
    let flags = 0

    for(let g = i - 1; g < i + 2; g++){
        for(let r = j - 1; r < j + 2; r++){

            if (field.children[g] !== undefined){
                if (field.children[g].children[r] !== undefined){                    
                    if(field.children[g].children[r].isFlag){
                        flags++
                    }
                }
            }
        }
    }
    if(flags === Number(field.children[i].children[j].textContent)) openClosest(pos)
}
// Создание таблицы
function createField(size){
    for(let i = 0; i < size; i++){
        let newTr = document.createElement('tr')
        for(let j = 0; j < size; j++){
            let newTd = document.createElement('td')
            newTd.id = (i * size + j)
            newTd.minesArond = 0
            newTd.opened = false
            newTd.isFlag = false
            newTd.style.width = (440 / size) + 'px'
            newTd.style.height = (440 / size) + 'px'
            
            newTd.addEventListener('click', function(e){
                // Поставить флаг
                if(modeFlag && !this.opened){
                        if(!this.isFlag){
                            this.innerHTML = '<td id="0" style="width: 55px; height: 55px;"><img src="img/flag.png" class="img-in-td"></td>'
                            minesLeft--
                        } else {
                            this.innerHTML = '<td id="0" style="width: 55px; height: 55px;"></td>'
                            minesLeft++
                        }
                    this.isFlag = !this.isFlag
                }
                else if(!this.isFlag){    //Обработать обычное нажание
                    if(this.opened) countFlags(this.id) // По открытой клетке

                    if(!modeFlag){ // По закрытой 
                        if(this.minesArond >= 9){ // В клетке мина
                            field.parentElement.classList.toggle('lose')
                            clearInterval(timer)
                            clearAll()
                        } else if(this.minesArond === 0){ // Вокруг клетки нет мин
                            openClosest(this.id)
                        } else if(this.minesArond < 9){ // вокруг клетки есть мины
                            if(!this.opened)freePosLeft--
                            this.opened = true
                            this.style.color = 'grey'
                            this.style.backgroundColor = 'white'
                            this.textContent = this.minesArond
                        }
                    }
                }
                if(freePosLeft === 0) {
                    field.parentElement.classList.toggle('won')
                    clearInterval(timer)
                }
                minesTxt.textContent = minesLeft
            })

            newTr.append(newTd)
        }
        field.append(newTr)
    }
}

// Розставление мин
function plantMines(mines){

    let minePos = []
    while (minePos.length < mines){
        let newPos = Math.trunc(Math.random() * Math.pow(size, 2))
        if(!(minePos.includes(newPos))) minePos.push(newPos)
    }

    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(minePos.includes(i * size + j)) {
                for(let g = i - 1; g < i + 2; g++){
                    for(let r = j - 1; r < j + 2; r++){
                        if (field.children[g] !== undefined){
                            if (field.children[g].children[r] !== undefined) field.children[g].children[r].minesArond += 1
                        }
                    }
                }
                field.children[i].children[j].minesArond = 9
            }
        }
    }
}

function startGame(){
    size = Number(sizeVal.value)
    mines = Math.trunc(Number(difficultyVal.value) * size)
    minesLeft = mines
    freePosLeft = Math.pow(size, 2) - mines 
    sureToRestart = false

    createField(size)
    plantMines(mines)
    minesTxt.textContent = minesLeft
    time = 0
    timer = setInterval(() => {
        let sec = time % 60
        if(time % 60 < 10) sec = '0' + sec
        timeTxt.textContent = Math.trunc(time / 60) + ':' + sec
        time++
    }, 1000);
}
startGame()



sizeVal.addEventListener('change', function(){
    size = Number(sizeVal.value)
    mines = Math.trunc(Number(difficultyVal.value) * size)
})
difficultyVal.addEventListener('change', function(){
    mines = Math.trunc(Number(difficultyVal.value) * size)
})
restartButton.addEventListener('click', function(){
    if(sureToRestart || field.parentElement.className !== ''){

        while(field.children.length !== 0){
            field.firstChild.remove()
        }
        if(field.parentElement.classList.contains('lose')) field.parentElement.classList.toggle('lose')
        if(field.parentElement.classList.contains('won')) field.parentElement.classList.toggle('won')
        freePosLeft = Math.pow(size, 2) - mines

        createField(size)
        plantMines(mines)
        minesLeft = mines
        minesTxt.textContent = minesLeft
        clearInterval(timer)
        time = 0
        timer = setInterval(() => {
            let sec = time % 60
            if(time % 60 < 10) sec = '0' + sec
            timeTxt.textContent = Math.trunc(time / 60) + ':' + sec
            time++
        }, 1000);

        sureToRestart = !sureToRestart
        this.value = 'restart'
    } else{
        sureToRestart = !sureToRestart
        this.value = 'sure?'
    }
})

let modeFlag = false
modeChanger.addEventListener('click', function(){
    if(modeFlag) this.src = 'img/mine.png'
    else this.src = 'img/flag.png'
    modeFlag = !modeFlag
})
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        if(modeFlag) modeChanger.src = 'img/mine.png'
        else modeChanger.src = 'img/flag.png'
        modeFlag = !modeFlag
    }
});  
  
function clearAll(){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(field.children[i].children[j].minesArond >= 9 && !field.children[i].children[j].isFlag){
                field.children[i].children[j].style.backgroundColor = 'white'
                field.children[i].children[j].innerHTML = '<td id="0" style="width: 55px; height: 55px;"><img src="img/mine.png" class="img-in-td"></td>'
            }
        }
    }
}
  
  
  