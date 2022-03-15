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
        this.load.image('dino', './src/sprites/dino.png');
        this.load.image('dinoJump', './src/sprites/dinoJump.png');
        this.load.image('dinoDown', './src/sprites/Dead.png');
        this.load.image('platform', './src/sprites/platform.png');
        this.load.image('cactus', './src/sprites/cactus.png');
        this.load.image('cloud', './src/sprites/cloud.png');
        

        /* loading spritesheet */
        // * fazer daquele jeito do star cacther 
        // * no spritesheet.png são 8 correndo - 4 pulando - 4 caindo - 4 abaixando */
        // this.load.spritesheet('dino2', './src/sprites/running.png', {
        //     frameWidth: 430,
        //     frameHeight: 436
        // });

        
        /* including cursors */
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    
    create() {
        const { width, height } = this.scale;
        
        /* adding the background */
        this.background = this.add.tileSprite(850, 512, width, height, 'background').setScrollFactor(0, 0)

        /* adding the platform */
        this.platform = this.add.tileSprite(850, 870, 1700, 106, 'platform').setScrollFactor(0, 0);
        
        
        /* adding dino (spritesheet ) */
        // this.dino2 = this.add.sprite(200, 400, 'dino2');        
        // this.anims.create({
        //     key: 'dino2_anim',
        //     frames: 8,
        //     frameRate: 20,
        //     repeat: -1
        // });
        // this.dino2.play('dino2_anim');

        /* adding normal dino */
        this.dino = this.physics.add.sprite(200, 600, 'dino').setScale(0.5);

        // this.cameras.main.startFollow(this.dino);

    
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
        
        this.physics.add.collider(this.dino, this.platform, this.obstacleGroup);


        /* the text of the pontuation */
        const style = { color: '#000', fontSize: 24 };
        this.textPontuation = this.add.text(800, 10, 'Pontuation: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);
    }

    
    update() {
        /* "moving" the background */
        this.background.tilePositionX = this.cameras.main.scrollX * 1;

        /* "moving" the platform */
        this.platform.tilePositionX = this.cameras.main.scrollX * 2;

        this.dino.setVelocityX(50); // não vai precisar (apenas vai rodar a animação e dar a impressao de estar correndo)
        this.dino.setImmovable(true);
        this.dino.body.setAllowGravity(false);

  
        // recycling obstacles
        let minDistance = this.gameWidth;
        this.obstacleGroup.getChildren().forEach(function(obstacle) {
            let obstacleDistance = this.gameWidth - obstacle.x - obstacle.displayWidth / 2;
            minDistance = Math.min(minDistance, obstacleDistance);
            if(obstacle.x < - obstacle.displayWidth / 2){
                this.obstacleGroup.killAndHide(obstacle);
                this.obstacleGroup.remove(obstacle);
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
        console.log()
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
                obstacle.setVelocityX(-200);
                this.obstacleGroup.add(obstacle);

            } else if (typeOfObstacle == 2) {
                obstacle = this.physics.add.sprite(posX, 500, 'cloud');
                obstacle.setImmovable(true);
                obstacle.body.setAllowGravity(false);
                obstacle.setVelocityX(-200);
                this.obstacleGroup.add(obstacle);
            }

        }
        obstacle.displayWidth = obstacleWidth;
        this.nextObstacleDistance = Phaser.Math.Between(700, 1000);
    }
}