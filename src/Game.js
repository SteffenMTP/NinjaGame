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
    
    this.SoundArray = ["ia1", "ia2", "JumpSound_1"]

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
      
      this.hitareaNinja = new PIXI.Graphics();
      this.hitareaNinja.beginFill(0xDE3249);
      this.hitareaNinja.drawRect(500-150, 550, 300, 200);
      this.hitareaNinja.alpha= .5;
      this.hitareaNinja.endFill();
      this.scene.addChild(this.hitareaNinja);

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


        let getFromSoundArray = this.SoundArray[Math.floor(Math.random()* this.SoundArray.length)];

        this.ia = new Howl({
          src: ['./assets/sound/' + getFromSoundArray + '.mp3'],
          volume: .1,
        })
        this.ia.play();

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
          fade:(0,1, 1000),
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

        this.enemy.enemies.forEach( _enemy => {

          if(this.ht.checkme(this.ninja, _enemy.getChildAt(1)) && _enemy.alive == true) {
            
            const currentEnemySpriteSheet = _enemy.getChildAt(0);

            currentEnemySpriteSheet.state.setAnimation(0, "die", true);

            if(_enemy.alive){
              this.hitSound = new Howl({

                src: ['./assets/sound/effekt_hit.mp3'],
                volume: .2,

              })

              this.hitSound.play();
            }

            let enemyDieTimeline = gsap.timeline({

              onComplete: ()=>{
  
                this.scene.removeChild(_enemy);
  
              }//END Complete
  
            });
  
            //Start Timeline
            enemyDieTimeline.to(_enemy, {y: 300, duration: .7, ease: "Circ.easeOut"});
            enemyDieTimeline.to(_enemy, {y: 1200, duration: .5, ease: "Circ.easeIn"});

            _enemy.alive = false;
            _enemy.attack = false;

          }//END Checkme


          //Hittest
          if(this.ht.checkme(this.hitareaNinja, _enemy.getChildAt(1)) && _enemy.attack == true) {
            
            const currentEnemySpriteSheetAttack = _enemy.getChildAt(0);
            currentEnemySpriteSheetAttack.state.setAnimation(0, 'attack', true);

            let timeToNinjaIsHurt = setTimeout(()=>{

              this.ninja.stop();
              this.ninja.texture = PIXI.Texture.from('../assets/images/ninja-hurt.png');

              gsap.to(this.ninja, {
                duration:.7,
                y: 550,
                ease: "Circ.easeOut", 
                  onComplete: ()=>{
                    this.ninja.play();
                  
                    gsap.to(this.ninja, {
                      duration: .4,
                      y: 768-150,
                    })

                  }

              })

            },300)

            _enemy.alive = false;
            _enemy.attack = false;

            gsap.to(_enemy, {
              duration:.7,
              y: 550,
              ease: "Circ.easeOut",
                onComplete: ()=>{
                
                  gsap.to(_enemy, {
                  duration: .5,
                  y: 768-50,
                  ease: "Circ.easeOut"
                })

                currentEnemySpriteSheetAttack.state.setAnimation(0, 'walk', true);
                
                

              }//End onComplete
            }) //End gsap

          }//END Hittest

        });//END forEach

      }//END if       

    })//END Ticker

  } // END constructor
} // END class

export default Game;