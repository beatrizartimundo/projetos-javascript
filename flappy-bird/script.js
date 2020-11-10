//função para criar os elementos
function newElement(tagName,className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

//função construtora
function block(reverse = false){
    this.element = newElement('div','barreira')

    const border = newElement('div','borda')
    const body = newElement('div','corpo')
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = altura => body.style.height = `${altura}px`

}

// const b = new block(true)
// b.setHeight(200)
// document.querySelector('[wm-flappy]').appendChild(b.element)

//função que cria os objetos com base na função construtora
function blockPair(height,open,x){
    this.element = newElement('div' , 'par-de-barreiras')

    this.up = new block(true)
    this.down = new block(false)

    this.element.appendChild(this.up.element)
    this.element.appendChild(this.down.element)

    this.openSort = () =>{
        const upHeight = Math.random() * (height - open)
        const downHeight = height - open - upHeight
        this.up.setHeight(upHeight)
        this.down.setHeight(downHeight)
    }

    this.getX = () =>parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.openSort()
    this.setX(x)
}

// const b = new blockPair(600,200,400)
// // b.setHeight(200)
// document.querySelector('[wm-flappy]').appendChild(b.element)
function blocks(height,width,open,space,notifyPoint){
    this.pairs = [
        //cria cada barreira que ira aparecer no jogo
        new blockPair(height,open,width),
        new blockPair(height,open,width + space),
        new blockPair(height,open,width + space * 2),
        new blockPair(height,open,width + space * 3)
    ]
//deslocamento das barreiras
    const displacement  = 3
    this.animation = () => {
        this.pairs.forEach(par =>{
            par.setX(par.getX() - displacement)

            //quando o elemento sair da area do jogo
            if(par.getX() < -par.getWidth()){
                par.setX(par.getX() + space * this.pairs.length)
                //faz com que venha barreira diferentes quando chegar no x = 0 
                par.openSort()
            }

            const middle = width / 2
            const middlePass = par.getX() + displacement >= middle
            && par.getX() < middle
            if(middlePass) notifyPoint()
        })
    }
}
//  const b = new blocks(600,1023,300,300)
//  const areadojogo = document.querySelector('[wm-flappy]')
//  b.pairs.forEach(par => areadojogo.appendChild(par.element))
//  setInterval(()=>{
//      b.animation()
//  },20)

function bird(heightofPlay){
    let fly = false

    this.element = newElement('img','passaro')
    this.element.src = './assets/img/passaro.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom =`${y}px`

    window.onkeydown = e => fly = true
    window.onkeyup = e => fly = false

    this.animation = () => {
        const newY = this.getY() + (fly ? 8 : -5)
        //altura maxima do passaro
        const maxHeight = heightofPlay - this.element.clientHeight

        if( newY <= 0){
            this.setY(0)
        }else if(newY >= maxHeight){
            this.setY(maxHeight)
        }else{
            this.setY(newY)
        }
    }

    this.setY(heightofPlay/2)
}
//  const b = new blocks(600,1023,300,300)
//  const passaro = new bird(600)
//  const areadojogo = document.querySelector('[wm-flappy]')
//  areadojogo.appendChild(passaro.element)
//  b.pairs.forEach(par => areadojogo.appendChild(par.element))
//  setInterval(()=>{
//      b.animation()
//      passaro.animation()
//  },20)

function progress() {
    this.element = newElement('span', 'progresso')
    this.checkPoints = points => {
        this.element.innerHTML = points
    }
    this.checkPoints(0)
}

//  const b = new blocks(600,1023,300,300)
//  const passaro = new bird(600)
//  const areadojogo = document.querySelector('[wm-flappy]')
//  areadojogo.appendChild(passaro.element)
//  areadojogo.appendChild(new progress().element)
//  b.pairs.forEach(par => areadojogo.appendChild(par.element))
//  setInterval(()=>{
//      b.animation()
//      passaro.animation()
//  },20)

function overlay(elementA , elementB){
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical

}

function crash(bird,blocks){
    let crash = false
    blocks.pairs.forEach(blockPair =>{
        if(!crash){
            const up = blockPair.up.element
            const down = blockPair.down.element
            crash = overlay(bird.element,up)
            || overlay(bird.element,down)
        }
    })
    return crash
}

function flappyBird(){
    let points = 0

    const playArea = document.querySelector('[wm-flappy]')
    const height = playArea.clientHeight
    const width = playArea.clientWidth


    const progress2 = new progress()
    const blocks2 = new blocks(height,width, 300,400,
        () => progress2.checkPoints(++points))
        const bird2 = new bird(height)
    
    

        playArea.appendChild(progress2.element)
        playArea.appendChild(bird2.element)
        blocks2.pairs.forEach(par=> playArea.appendChild(par.element))
    
    this.start = () => {
        //loop do jogo
        const time = setInterval(() =>{
            blocks2.animation()
            bird2.animation()

            if(crash(bird2, blocks2)){
                clearInterval(time)
               //refresh automatico provisorio 
                window.location.reload();
            }
        },20)
    }
}


function clickBotao(){
    new flappyBird().start()
    var btn = document.getElementById("botao")
    btn.style.display = "none"
    
  
}
//new flappyBird().start()

