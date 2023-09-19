var personagem, personagemImg, morteImg
var fantasma, fantasmaImg
var esqueleto, esqueletoImg
var flecha, flechaImg, flechas
var pocao, pocaoImg, pocoes
var chaoImg
var proj, projImg, projs
var fantasmas=[]
var esqueletos=[]
var paredeE, paredeD, paredeC, paredeB, paredes
var vidas, zc, uc, dc, tc
var cd=1
var inv=0
var potionSpawned=true
var onda1fim=false
var onda2fim=false

var onda1 = 2
var onda2 = 0
var onda3 = 0

var countdown=5
var countdown2=5
var countdown3=5


var vida=3
var esq=false
var dir=false
var cim=false
var bai=false
var pos = [
    {x:420,y:300},
    {x:780,y:300},
    {x:420,y:1050},
    {x:780,y:1050},
    {x:150,y:600},
    {x:150,y:840},
    {x:1050,y:600},
    {x:1050,y:840},
]

console.log(vida)

function preload(){
    personagemImg=loadAnimation("wizard1.png","wizard2.png")
    morteImg=loadAnimation("deadwizard.png")
    fantasmaImg=loadAnimation("ghost1.png","ghost2.png")
    esqueletoImg=loadAnimation("skeleton1.png","skeleton2.png")
    flechaImg=loadImage("arrow.png")
    chaoImg=loadImage("floor.png")
    projImg=loadImage("proj.png")
    pocaoImg=loadImage("potion.png")
    zc=loadImage("0c.png")
    uc=loadImage("1c.png")
    dc=loadImage("2c.png")
    tc=loadImage("3c.png")
}
function setup() {
    createCanvas(1200,1200);
    personagem = createSprite(600,700)
    personagem.addAnimation("correndo",personagemImg)
    personagem.addAnimation("morte",morteImg)
    paredeC = createSprite(600,220,1200,140)
    paredeB = createSprite(600,1150,1200,140)
    paredeE = createSprite(60,600,120,1200)
    paredeD = createSprite(1140,600,120,1200)
    paredeC.visible=false
    paredeB.visible=false
    paredeE.visible=false
    paredeD.visible=false

    projs=new Group ()
    flechas=new Group()
    pocoes=new Group()

}

function draw() {
    background(chaoImg);
    //códigos que serão executados ao longo de todo o jogo
    controlar()

    if (vida>0){
        mostrarCooldown()
        atirar()
        spawnInimigos()
        moverFantasma()
        esqAtirar()
        endWave()
        handlePotion()
    }

    if(cd>1){
        cd--
    }
    if (inv>0){
        inv--
    }

    if(personagem.isTouching(pocoes)){
        if(vida<3){
            pocoes.destroyEach()
            vida++   
        }
    }

    personagem.overlap(fantasmas,(p,ghost)=>{
        if (vida>0){
            ghost.remove()
            if(inv==0){
            vida-- 
            inv=20
            }
            
        }

    }  
    )

    drawSprites();

    personagem.collide(paredeC)
    personagem.collide(paredeB)
    personagem.collide(paredeE)
    personagem.collide(paredeD)



    textAlign("center")
    stroke("black")
    strokeWeight(5)
    fill ("white")
    textSize(30)
    text ("setas para se mover, Espaço para atirar",600,50)
    textSize(20)
    text (onda2+potionSpawned+" x: "+mouseX + " y: "+mouseY, mouseX, mouseY-30)
    if(vida==3){
        vidas=image(tc,50,-90,300,300)
    }
    if(vida==2){
        vidas=image(dc,50,-90,300,300)
    }
    if(vida==1){
        vidas=image(uc,50,-90,300,300)
    }
    if(vida==0){
        vidas=image(zc,50,-90,300,300)
        personagem.changeAnimation("morte")
    }


}

function controlar(){
    if(vida>0){
        if(keyDown(UP_ARROW)){
            personagem.y-=10
            cim=true
            bai=false
            esq=false
            dir=false
        }
        if(keyDown(DOWN_ARROW)){
            personagem.y+=10 
            cim=false
            bai=true
            esq=false
            dir=false
        }
        if(keyDown(LEFT_ARROW)){
            personagem.x-=10 
            cim=false
            bai=false
            esq=true
            dir=false
        }
        if(keyDown(RIGHT_ARROW)){
            personagem.x+=10
            cim=false
            bai=false
            esq=false
            dir=true
        }
    }

}

function handlePotion(){
    if(potionSpawned==false){
        pocao=createSprite(random(170,1030),random(370,1060))
        pocao.addImage(pocaoImg)
        pocoes.add(pocao)
        potionSpawned=true
    }
}

function spawnInimigos(){
    if(onda1>0&&frameCount%100==0){
        spawnFantasma()
    }
    if(onda2>0&&frameCount%75==0){
        if(frameCount%75==0){
            spawnFantasma()
        }
        if(frameCount%200==0){
            spawnEsqueleto()
        }
        
    }
    if(onda3>0&&frameCount%75==0){
        spawnFantasma()
    }
}

function spawnFantasma(){
    var i = Math.round(random(0,7))
    var x = pos[i].x
    var y = pos[i].y
    fantasma=createSprite(x,y)
    fantasma.addAnimation("correndo",fantasmaImg)
    fantasmas.push(fantasma)

    onda1--
    onda2--
}



function moverFantasma(){

 if(frameCount%5){
     for(var i = 0; i<fantasmas.length; i++){
            if(personagem.x > fantasmas[i].x){
                fantasmas[i].velocityX = 3
            }else{
                fantasmas[i].velocityX=-3
            }
            if(personagem.y>fantasmas[i].y){
                fantasmas[i].velocityY=3
            }else{
                fantasmas[i].velocityY=-3
             }
        }
    }

}

function spawnEsqueleto(){
    var i = Math.round(random(0,7))
    var x = pos[i].x
    var y = pos[i].y
    esqueleto=createSprite(x,y)
    esqueleto.addAnimation("correndo",esqueletoImg)
    esqueletos.push(esqueleto)

    onda1--
    onda2--
}

function esqAtirar(){

    for(var i=0; i<esqueletos.length;i++){
        if(esqueletos[i]!=false){
            if (frameCount%150==0){
                flecha=createSprite(esqueletos[i].x,esqueletos[i].y)
                flecha.addImage(flechaImg)
        
                if(esqueletos[i].x==150){
                    flecha.velocityX=3
                    flecha.rotation=180
                }
                 if(esqueletos[i].x==1050){
                    flecha.velocityX=-3

                 }
                if(esqueletos[i].y==300){
                      flecha.velocityY=3
                      flecha.rotation=270
                }
                if(esqueletos[i].y==1050){
                    flecha.velocityY=-3
                    flecha.rotation=90
                }
                flechas.add(flecha)
            }

        }
    }

    personagem.overlap(flechas,(p,flecha)=>{
        flecha.destroy()
        vida--
    })
    
}

function atirar(){
    if(keyDown("space")&&cd==1){
        cd=70
        proj=createSprite(personagem.x,personagem.y)
        proj.addImage(projImg)
        if(dir){
            proj.velocityX=15
        }
        if(esq){
            proj.velocityX=-15
        }
        if(bai){
            proj.velocityY=15
        }
        if(cim){
            proj.velocityY=-15
        }
        if(!cim && !bai && !dir && !esq){
            proj.velocityX=15
        }
        projs.add(proj)
        projs.setLifetimeEach(100)
        
    }

    projs.overlap(fantasmas,(proj,ghost)=>{
        proj.remove()
        ghost.remove()
    })

    for(var i=0; i<esqueletos.length; i++){
        if(esqueletos[i]!=false && projs.isTouching(esqueletos[i])){
            esqueletos[i].destroy()
            esqueletos[i]=false
            projs.destroyEach()
        }
    }


}

function mostrarCooldown(){
    fill("cyan")
    rect(personagem.x-50,personagem.y-80,cd,10)
}

function endWave(){
    fill("red")
    textSize(50)
    strokeWeight(5)

    if (onda1<=0&&countdown>0){
        if(frameCount%50==0){
            countdown-- 
        }
        text("Onda 2 em: "+countdown,450,200)   
    }
    if (countdown==0){
        onda2=2
        countdown2=5 
        if(onda1fim==false){
            potionSpawned=false
        }
        onda1fim=true
    }
    if (onda2<=0&&countdown2>0&&onda1fim==true){
        if(frameCount%50==0){
            countdown2-- 
        }
        text("Onda 3 em: "+countdown2,450,200)
    }
    if (countdown2==0){
        onda3=2
        countdown3=5
        if(onda2fim==false){
            potionSpawned=false
            onda2fim=true
        }
    }
}