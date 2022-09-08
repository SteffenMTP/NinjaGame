import * as PIXI from 'pixi.js'
import { DisplayObject, Sprite } from 'pixi.js';
import Stage from './Stage.js';
import {gsap} from 'gsap';
import { Howl } from 'howler';
import Enemy from './Enemy.js';
import HitTest from './HitTest.js';

class Game {

  constructor() {

    this.enemy;
    
    this.myStage = new Stage();
    this.scene = this.myStage.scene;
    this.scene.sortableChildren = true;
    this.background = this.myStage.bg;
    this.sI = this.myStage.stageInfo;

    let assets = [

      '../assets/spritesheet/ninjarack.json',
      './assets/images/background.jpg',
      '../assets/images/ninja-jump.png',
      '../assets/images/play.png',
      '../assets/images/sun.png',

    ]

    const loader = PIXI.Loader.shared
    .add(assets)
    .add('alienspine', '../assets/spritesheet/alien-spine/alienboss.json')
    .load( (loader, res)=>{

      let bgTexture = PIXI.Texture.from('./assets/images/background.jpg');
      let _bg = new Sprite(bgTexture);
      this.background.addChild(_bg);


      let sheet = PIXI.Loader.shared.resources['../assets/spritesheet/ninjarack.json'].spritesheet;
      
      this.ninja = new PIXI.AnimatedSprite(sheet.animations['alien']);
      
      //Placering
      this.ninja.anchor.set(0.5);
      this.ninja.x = 512;
      this.ninja.y = 768 - 150;

      //Interraktion & Animation
      this.ninja.interactive = true;
      this.ninja.buttonMode = true;
      this.ninja.zIndex = 2;
      this.ninja.animationSpeed = 0.5;

      //Apply to scene
      this.ninja.play();
      this.scene.addChild(this.ninja);
    
      //-------------------------------------------------------------------------
      // Short assignment to make the ninja move using gsap
      // gsap.to(this.ninja,{        
      //     x: 10,
      //     duration: 2,
      //   })

      // gsap.to(this.ninja,{
      //   delay: 2.2,
      //   x: 1000,
      //   duration:2,
        
      // })

      // gsap.to(this.ninja,{
      //   delay: 4,
      //   duration: 2,
      //   x: 512,
      // })
      //---------------------------------------------------------------------------
      
      

      this.sI.app.stage.on('pointerdown', (event)=>{

        this.ninja.stop();
        this.ninja.texture = PIXI.Texture.from('../assets/images/ninja-jump.png');

        let newPosition = event.data.getLocalPosition(this.background);
        
        gsap.to(this.ninja,{

          duration: .2,
          x: newPosition.x-300,
          y: newPosition.y,
          ease: "Circ.easeOut",
          onComplete: ()=>{

            gsap.to(this.ninja, {

              duration: .2,
              x: 512,
              y: 768-150,
              ease: "Circ.easeOut",
              
            })

            this.ninja.play();

          }

        })
        
        let mX = event.data.global.x;
        
        mX > this.sI.appWidth/2 ? this.ninja.scale.x = -1 : this.ninja.scale.x = 1;

      })//END Eventlistener

      //PLAY BUTTON

      let playTexture = PIXI.Texture.from('../assets/images/play.png');

      let play = new PIXI.Sprite(playTexture);
      play.anchor.set(.5);
      play.x = 512;
      play.y = 250;
      play.interactive = true;
      this.scene.addChild(play);

      //SUN IN BACKGROUND

      let sunTexture = new PIXI.Texture.from('../assets/images/sun.png');
      let mySun = new PIXI.Sprite(sunTexture);
      // mySun.y = -200; //Til animation OBS Husk at slå til under eventlistener
      this.scene.addChild(mySun);

      //BOXES

      let props = {
        boxes: [
        '../assets/images/left_box.png',
        '../assets/images/middle_box.png',
        '../assets/images/right_box.png',
        ],
        PositionX: [100, 400, 660],
        PositionY: [450, 450, 450]
      };

      for(let i =0;i<props.boxes.length;i++){
        let box = PIXI.Texture.from(props.boxes[i]);
        let _box = new PIXI.Sprite(box);
        _box.x=props.PositionX[i];
        _box.y=props.PositionY[i];
        this.scene.addChild(_box);
      }

      //IDLE NIGHT

      // let idle = setTimeout(()=>{

      //   let _bg_night = PIXI.Texture.from('./assets/images/background_night.png');
      //   let _bgnight = new Sprite(_bg_night);
      //   _bgnight.x = -310;
      //   this.scene.addChild(_bgnight);
      //   console.log("kaffe")

      // },500 )



      play.on('pointerdown', (event)=>{

        event.stopPropagation();
        
        this.sI.app.stage.interactive = true;

        gsap.to(event.currentTarget, {
          duration: .5,
          delay: .2,
          y: play.y-350,
          ease: "Elastic.easeInOut",
        });

        let soundSwirp = new Howl({
          src: ['./assets/sound/effekt_swish.mp3'],
          volume: .2,
        });
        
        //Sun Animation comming down
        // gsap.to(mySun, {

        //   duration: .5,
        //   y: play.y-200,
        //   ease: "Elastic.easeInOut",
        // });

        let sound = new Howl({
          src: ['./assets/sound/musicloop.mp3'],
          autoplay: true,
          loop: true,
        })

        let timerid = setTimeout( ()=>{

          soundSwirp.play();

        },500 )

        this.enemy = new Enemy({
        
          name: res.alienspine,
          addTo: this.scene,

        });

        //bob the builder WIFI
        //alien-ninja2030
        

      }); //End Eventlistener

    } )//End loader

    this.ht = new HitTest();

    let ticker = PIXI.Ticker.shared;

    ticker.add( ()=>{

      if(this.enemy !=undefined){

        console.log("true")

      } else{
        console.log("undefined")
      }

    })

  } // END constructor
} // END class

export default Game;