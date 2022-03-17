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
        
        /* loading spritesheet */
        this.load.spritesheet('dino', './src/sprites/spritesheet.png', {
            frameWidth: 430,
            frameHeight: 436
        });

        /* loading audios */
        this.load.audio('jump', './src/sounds/jump.mp3');

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
        this.dino = this.physics.add.sprite(200, 400, 'dino').setScale(0.5);

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dino', { start: 9, end: 12 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('dino', { start: 13, end: 16 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'getDown',
            frames: this.anims.generateFrameNumbers('dino', { start: 17, end: 20 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'stop',
            frames: [ { key: 'dino', frame: 0 } ],
            frameRate: 20,
        });

    
        /* group with all active obstacles */
        this.obstacleGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(obstacle) {
                obstacle.scene.obstaclePool.add(obstacle);
            }
        });
        
        /* pool */
        this.obstaclePool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(obstacle) {
                obstacle.scene.obstacleGroup.add(obstacle);
            }
        });
        
        /* adding a platform to the game, the arguments are platform width and x position */
        this.addObstacle(100, this.gameWidth / 2);
        
        /* adding collisions */
        this.physics.add.collider(this.dino, this.platform);
        this.physics.add.collider(this.dino, this.obstacleGroup);
        // this.physics.add.overlap(this.dino, this.obstacleGroup, this.finishGame(this.pontuation), undefined, this);


        /* the text of the pontuation */
        const style = { color: '#000', fontSize: 24 };
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
            this.dino.anims.play('jump', true);
            this.dino.setVelocityY(-700);
            this.sound.play('jump');
            
        } else if (this.dino.body.velocity.y <= 0 && !this.dino.body.touching.down) {
            this.dino.anims.play('fall', true);
            
        } else if (this.cursors.down.isDown) {
            this.dino.anims.play('getDown', true);
            
        } else if (this.dino.body.touching.down) {
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
            this.addObstacle(100, this.gameWidth + nextObstacleWidth / 2);
        }


        this.handlePontuation();
    }


    handlePontuation() {
        this.pontuation++;
        this.textPontuation.text = `Pontuation: ${this.pontuation}`;
    }


    addObstacle(obstacleWidth, posX){
        let obstacle;
        if(this.obstaclePool.getLength()) { // already have obstacles
            obstacle = this.obstaclePool.getFirst();
            obstacle.x = posX;
            obstacle.active = true;
            obstacle.visible = true;
            this.obstaclePool.remove(obstacle);

        } else { // frist obstacle

            let typeOfObstacle = Phaser.Math.Between(1, 2); // chose randomly a type of obstacle to add
            console.log(typeOfObstacle);

            if (typeOfObstacle == 1) {
                obstacle = this.physics.add.sprite(posX, 750, 'cactus');
                obstacle.setImmovable(true);
                obstacle.body.setAllowGravity(false);
                obstacle.setVelocityX(-500);
                this.obstacleGroup.add(obstacle);

            } else if (typeOfObstacle == 2) {
                obstacle = this.physics.add.sprite(posX, 500, 'cloud');
                obstacle.setImmovable(true);
                obstacle.body.setAllowGravity(false);
                obstacle.setVelocityX(-500);
                this.obstacleGroup.add(obstacle);
            }

        }
        obstacle.displayWidth = obstacleWidth;
        this.nextObstacleDistance = Phaser.Math.Between(700, 1000);
    }


    finishGame(pts) {
        this.dino.anims.play('getDown', true);
        this.sound.stopAll(); // stop music
        this.scene.start('gameOver', {pts: pts});
    }
}