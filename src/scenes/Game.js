import Phaser from '../lib/phaser.js'


export default class Game extends Phaser.Scene {
 
    constructor() {
        super('game');
    }

    
    
    init() {
        this.pontuation = 0;
        this.gameWidth = 1024;
    }


    preload() {
        /* loading images */
        this.load.image('background', './src/sprites/backgroundCastles.png');
        this.load.image('dino', './src/sprites/dino.png');
        this.load.image('dinoJump', './src/sprites/dinoJump.png');
        this.load.image('dinoDown', './src/sprites/dinoDown.png');
        this.load.image('platform', './src/sprites/platform.png');
        this.load.image('cactus', './src/sprites/cactus.png');
        this.load.image('cloud', './src/sprites/cloud.png');
        

        /* loading spritesheet */
        this.load.spritesheet('dino2', './src/sprites/running.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        /* including cursors */
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    

    create() {
        const { width, height } = this.scale;


        /* adding the background */
        // this.add.image(512, 512, 'background').setScrollFactor(0); // não se move
        this.background = this.add.tileSprite(512, 512, width, height, 'background').setScrollFactor(0, 0)
        

        /* adding dino (spritesheet) */
        this.dino2 = this.add.sprite(200, 400, 'dino2');
        // console.log(this.anims.generateFrameNumbers('dino2'));
        this.anims.create({
            key: 'dino2_anim',
            frames: this.anims.generateFrameNumbers('dino2'),
            frameRate: 20,
            repeat: -1
        })
        this.dino2.play('dino2_anim');

        /* adding normal dino */
        this.dino = this.physics.add.sprite(200, 680, 'dino').setScale(0.5);

        this.cameras.main.startFollow(this.dino);

    
        /* group with all active platforms */
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform) {
                platform.scene.platformPool.add(platform);
            }
        });
        
        this.physics.add.collider(this.platformGroup, this.dino);

        /* pool */
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform) {
                platform.scene.platformGroup.add(platform);
            }
        });

        /* adding a platform to the game, the arguments are platform width and x position */
        this.addPlatform(this.gameWidth*2, 200);


        /* the text of the pontuation */
        const style = { color: '#000', fontSize: 24 };
        this.textPontuation = this.add.text(800, 10, 'Pontuation: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);
    }

    
    update() {
        this.background.tilePositionX = this.cameras.main.scrollX * 3;

        this.dino.setVelocityX(250);

        this.handlePontuation();

        if(this.dino.body.velocity.y >= 0 && this.dino.texture.key !== 'dino') {
            this.dino.setTexture('dino');
        }

        if (this.cursors.up.isDown && this.dino.body.touching.down) {
            this.dino.setVelocityY(-500);
            this.dino.setTexture('dinoJump');
        } else if (this.cursors.down.isDown) {
            this.dino.setTexture('dinoDown');
            // this.dino.setVelocityY(0);
        } 
        
        

        /* cancels gravity of dino when it reaches platform height */ 
        // if(this.dino.body.position.y > 583) {
        //     this.dino.setImmovable(true);
        //     this.dino.body.setAllowGravity(false);
        //     this.dino.setVelocityY(-100);

        //     if (!(this.cursors.up.isDown) && !(this.cursors.down.isDown)) {
        //         this.dino.setTexture('dino');
        //     }

        // } else {
        //     this.dino.setImmovable(false);
        //     this.dino.body.setAllowGravity(true);
        // }


        // recycling platforms
        let minDistance = this.gameWidth;
        this.platformGroup.getChildren().forEach(function(platform) {
            let platformDistance = 1500 - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = this.gameWidth*2;
            this.addPlatform(nextPlatformWidth, this.gameWidth + nextPlatformWidth / 2);
        }
    }


    handlePontuation() {
        this.pontuation++;
        this.textPontuation.text = `Pontuação: ${this.pontuation}`;
    }


    addPlatform(platformWidth, posX){
        let platform;
        if(this.platformPool.getLength()) { // already have platforms
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);

        } else { // frist platform
            platform = this.physics.add.sprite(posX, 830, "platform");
            platform.setImmovable(true);
            platform.body.setAllowGravity(false);
            platform.setVelocityX(-200);
            this.platformGroup.add(platform);

            /* adding the second one */
            platform = this.physics.add.sprite(posX+this.gameWidth, 830, "platform");
            platform.setImmovable(true);
            platform.body.setAllowGravity(false);
            platform.setVelocityX(-200);
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = 0;
        // this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }
}