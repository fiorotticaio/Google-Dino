import Phaser from '../lib/phaser.js'


export default class Game extends Phaser.Scene {

    constructor() {
        super('game');
    }


    init() {
        this.pontuation = 0;
    }


    preload() {
        /* fazendo o carregamento das imagens */
        this.load.image('background', './src/sprites/backgroundCastles.png');
        this.load.image('dino', './src/sprites/dino.png');
        this.load.image('dinoJump', './src/sprites/dinoJump.png');
        this.load.image('platform', './src/sprites/platform.png');

        /* incluindo os cursores */
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    

    create() {
        /* adding loaded images */
        this.add.image(512, 512, 'background').setScrollFactor(0); // não se move

        this.dino = this.physics.add.sprite(200, 680, 'dino').setScale(0.5);

        // this.physics.add.collider(this.platform, this.dino);

        /* the text of the pontuation */
        const style = { color: '#000', fontSize: 24 };
        this.textPontuation = this.add.text(800, 10, 'Pontuation: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0)
        ;


        /* group with all active platforms */
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform) {
                platform.scene.platformPool.add(platform);
            }
        });
 
        /* pool */
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform) {
                platform.scene.platformGroup.add(platform);
            }
        });

        /* adding a platform to the game, the arguments are platform width and x position */
        this.addPlatform(1024, 200);
    }

    
    update() {
        this.handlePontuation();
        
        /* dino is jumping */
        if(this.cursors.up.isDown && this.dino.body.position.y > 577 && this.dino.body.position.y < 584) {
            this.dino.setVelocityY(-500);
            this.dino.setTexture('dinoJump');
        } else {
            this.dino.setVelocityX(0);
        }
        

        /* cancels gravity of dino when it reaches platform height */ 
        if(this.dino.body.position.y > 583) {
            this.dino.setImmovable(true);
            this.dino.body.setAllowGravity(false);
            this.dino.setVelocityY(-100);
            this.dino.setTexture('dino');

        } else {
            this.dino.setImmovable(false);
            this.dino.body.setAllowGravity(true);
        }


        // recycling platforms
        let minDistance = 1024;
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
            let nextPlatformWidth = 1024;
            this.addPlatform(nextPlatformWidth, 1024 + nextPlatformWidth / 2);
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
            platform = this.physics.add.sprite(posX+1024, 830, "platform");
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