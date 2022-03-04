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
        /* adcionando as imagens carregadas */
        this.add.image(512, 512, 'background').setScrollFactor(0); // não se move

        this.dino = this.physics.add.sprite(200, 680, 'dino').setScale(0.5);

        this.platform = this.physics.add.sprite(430, 830, 'platform').setImmovable(true);
        this.platform.body.setAllowGravity(false); // impedir que a plataforma caia

        // this.physics.add.collider(this.platform, this.dino);

        /* texto da pontuação */
        const style = { color: '#000', fontSize: 24 };
        this.textPontuation = this.add.text(800, 10, 'Pontuation: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0)
        ;
    }

    
    update() {
        this.handlePontuation();

        this.platform.setVelocityX(-200);
        
        if(this.cursors.up.isDown && this.dino.body.position.y > 577 && this.dino.body.position.y < 584) {
            this.dino.setVelocityY(-500);
            this.dino.setTexture('dinoJump');
        } else {
            this.dino.setVelocityX(0);
        }
        
        console.log(this.dino.body.position.y);
        
        /* cancela a gravidade quando chega na altura da plataforma */ 
        if(this.dino.body.position.y > 583) {
            this.dino.setImmovable(true);
            this.dino.body.setAllowGravity(false);
            this.dino.setVelocityY(-100);
            this.dino.setTexture('dino');

        } else {
            this.dino.setImmovable(false);
            this.dino.body.setAllowGravity(true);
        }
    }


    handlePontuation() {
        this.pontuation++;
        this.textPontuation.text = `Pontuação: ${this.pontuation}`;
    }
}