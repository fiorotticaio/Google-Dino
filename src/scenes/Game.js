import Phaser from '../lib/phaser.js'


export default class Game extends Phaser.Scene {
 
    constructor() {
        super('game');
    }

    
    init() {
        this.pontuation = 0;
        this.gameWidth = 1700;
    }


    preload() {
        /* loading images */
        this.load.image('background', './src/sprites/backgroundCastles.png');
        this.load.image('platform', './src/sprites/platform.png');
        this.load.image('cactus', './src/sprites/cactus.png');
        this.load.image('cloud', './src/sprites/cloud.png');
        this.load.image('bird', './src/sprites/bird.png');
        
        /* loading spritesheet */
        this.load.spritesheet('dino', './src/sprites/spritesheet.png', {
            frameWidth: 460,
            frameHeight: 410
        });

        /* loading audios */
        this.load.audio('jumpAudio', './src/sounds/jump.mp3');

        /* including cursors */
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    
    create() {
        const { width, height } = this.scale;
        
        /* adding the background */
        this.background = this.add.tileSprite(850, 512, width, height, 'background').setScrollFactor(0, 0)

        /* adding the platform */
        this.platform = this.add.tileSprite(850, 870, 1700, 106, 'platform').setScrollFactor(0, 0);
        this.physics.add.existing(this.platform, true);
    
        
        /* adding dino (spritesheet ) */
        this.dino = this.physics.add.sprite(200, 700, 'dino').setScale(0.5); 

        /* creating dino animations */
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dino', { start: 8, end: 19 }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'getDown',
            frames: this.anims.generateFrameNumbers('dino', { start: 20, end: 27 }),
            frameRate: 10,
            repeat: 1
        });


    
        /* group with all active obstacles */
        this.obstacleGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(obstacle) {
                obstacle.scene.obstaclePool.add(obstacle);
            }
        });
        
        /* pool of obstacles */
        this.obstaclePool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(obstacle) {
                obstacle.scene.obstacleGroup.add(obstacle);
            }
        });
        
        /* adding a platform to the game, the arguments are platform width and x position */
        this.addObstacle(150, this.gameWidth / 2);
        
        /* adding collisions */
        this.physics.add.collider(this.dino, this.platform);
        this.physics.add.collider(this.dino, this.obstacleGroup);


        /* the text of the pontuation */
        const style = { color: '#000', fontSize: 40 };
        this.textPontuation = this.add.text(800, 10, 'Pontuation: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);
    }

    
    update(time) {
        /* "moving" the background */
        this.background.tilePositionX = time * 0.3;

        /* "moving" the platform */
        this.platform.tilePositionX = time * 0.4;

        /* handling spritesheet */
        if (this.cursors.up.isDown && this.dino.body.touching.down) {
            this.dino.setScale(0.5);
            this.dino.anims.play('jump');
            this.dino.setVelocityY(-700);
            this.sound.play('jumpAudio');
            
        } else if (this.cursors.down.isDown) {
            this.dino.anims.play('getDown', true);
            this.dino.setScale(0.49); // so he can scape from the bird
            
        } else if (this.dino.body.touching.down) {
            this.dino.setScale(0.5);
            this.dino.anims.play('run', true);
        }


        // recycling obstacles
        let minDistance = this.gameWidth;
        this.obstacleGroup.getChildren().forEach(function(obstacle) {
            /* checking if the obstacle can be destroyed  */
            let obstacleDistance = this.gameWidth - obstacle.x - obstacle.displayWidth / 2;
            minDistance = Math.min(minDistance, obstacleDistance);
            if(obstacle.x < - obstacle.displayWidth / 2){
                this.obstacleGroup.killAndHide(obstacle);
                this.obstacleGroup.remove(obstacle);
            }

            /* checking if dino collided with some obstacle */
            if (this.dino.body.touching.up) {
                this.finishGame(this.pontuation);
            } else if (this.dino.body.touching.right) {
                this.finishGame(this.pontuation);
            } else if (this.dino.body.touching.down && obstacle.body.touching.up) {
                this.finishGame(this.pontuation);
            }
        }, this);
 
        // adding new obstacles
        if(minDistance > this.nextObstacleDistance){
            let nextObstacleWidth = 100;
            this.addObstacle(150, this.gameWidth + nextObstacleWidth / 2);
        }   


        this.handlePontuation();
    }


    handlePontuation() {
        this.pontuation++;
        this.textPontuation.text = `Pontuation: ${this.pontuation}`;
    }


    addObstacle(obstacleWidth, posX){
        let obstacle;
        if(this.obstaclePool.getLength()) { // if have obstacles in the pool
            obstacle = this.obstaclePool.getFirst();
            obstacle.x = posX;
            obstacle.active = true;
            obstacle.visible = true;
            this.obstaclePool.remove(obstacle);

        } else { 

            let typeOfObstacle = Phaser.Math.Between(1, 2); // chose randomly a type of obstacle to add
            console.log(typeOfObstacle);

            if (typeOfObstacle == 1) {
                obstacle = this.physics.add.sprite(posX, 750, 'cactus');
                obstacle.setImmovable(true);
                obstacle.body.setAllowGravity(false);
                obstacle.setVelocityX(-500);
                this.obstacleGroup.add(obstacle);
                obstacle.displayWidth = 100;


            } else if (typeOfObstacle == 2) {
                obstacle = this.physics.add.sprite(posX, 527, 'bird').setScale(0.3);
                obstacle.setImmovable(true);
                obstacle.body.setAllowGravity(false);
                obstacle.setVelocityX(-500);
                this.obstacleGroup.add(obstacle);
                obstacle.displayWidth = 200;

            }

        }
        this.nextObstacleDistance = Phaser.Math.Between(700, 1000);
    }


    finishGame(pts) {
        this.dino.anims.play('getDown', true);
        this.sound.stopAll(); // stop music
        this.scene.start('gameOver', {pts: pts});
    }
}