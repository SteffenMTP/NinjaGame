import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import Stage from './Stage';
import { Sprite } from 'pixi.js';
import { Howl } from 'howler';

class Jump {

constructor(){

    this.myStage = new Stage();
    this.scene = this.myStage.scene;
    this.scene.sortableChildren = true;
    this.background = this.myStage.bg;
    this.sI = this.myStage.stageInfo;
    
    this.ninjaArray = [];

    let randomSound = new Howl({
        src: ['./assets/sound/JumpSound_1.mp3'],
        src: ['./assets/sound/JumpSound_2.mp4'],
        src: ['./assets/sound/JumpSound_3.mp4'],
        src: ['./assets/sound/JumpSound_4.mp4'],
        src: ['./assets/sound/JumpSound_5.mp4'],
     });

    // let jumpS = new Howl({
    //     src: ['./assets/sound/JumpSound_1.mp3'],

    // })

    this.randomRotation = [0.5, -0.5, 0];

    let myBoxArray = [

        "./assets/images/left_box.png",
        "./assets/images/middle_box.png",
        "./assets/images/right_box.png"
    ];

    let posX = [

        this.sI.appWidth/2 -300, //Venstre for center
        this.sI.appWidth/2, // I center
        this.sI.appWidth/2 +300, //Højre for center
    ];

    let bgTexture = PIXI.Texture.from("../assets/images/background.jpg");
    let _bg = new Sprite(bgTexture);
    this.background.addChild(_bg);

    let ninjaJump = PIXI.Texture.from("../assets/images/ninja-jump.png");
    
    //LOOP FOR MUSIC

    for(let s = 0; s < randomSound.length;s++){

        this.hs = new Howl({randomSound});


    };


    //LOOP FOR NINJA

    for(let ii = 0; ii<3; ii++){

        let nj = new PIXI.Sprite(ninjaJump);
        nj.x = posX[ii] + 170;
        nj.y = 600;
        nj.anchor.set(.5);
        nj.scale.x = nj.scale.y = .8; 
        nj.zIndex = 0;
        this.scene.addChild(nj);
        this.ninjaArray.push(nj);

    }

    //LOOP FOR BOXES
    
    for(let i = 0;i<myBoxArray.length;i++){

        let box = PIXI.Texture.from(myBoxArray[i]);
        let _box = new PIXI.Sprite(box);
        _box.interactive=true; //Husk at sætte interactive, hvis objektet skal kunne bruges af eventlistener
        _box.isReady = true; //Hvis den er true skal man kunne trykke på den.
        _box.data = i;
        _box.x = posX[i];
        _box.y = 500;
        _box.zIndex = 1;
        this.scene.addChild(_box);

        _box.on("pointerdown", (event)=>{

            if(_box.isReady == true){
            this.jumpAndHide(
                this.ninjaArray[event.currentTarget.data],
                event.currentTarget
            );
            }
            
            console.log(this.hs);
            
            // jumpS.play();

        })

    };

    

}//END Constructor

    jumpAndHide(obj, e){

        e.isReady = false;

        let rr = this.randomRotation[
            Math.floor(Math.random() * this.randomRotation.length )
        ];

        gsap.to(obj, {
            
            duration: .5,
            rotation: rr,
            y: 100,
            ease: "Circ.easeOut",
            // repeat: 1,
            // yoyo:true,

            //Ved at tilføje repeat og yoyo, slipper man får koden nedenunder, derefter skal 
            // onComplete bare have indeholde e.isReady = true igen.

            onComplete: ()=>{
                
                // e.isReady = true;

                gsap.to(obj, {
                    duration: .5,
                    rotation: 0,
                    y: 600,
                    ease: "Circ.easeIn",
                    
                    onComplete: ()=>{
                        
                        e.isReady = true;
                    
                    }
                })

                
            }
        })


    };

}//END Class

export default Jump;