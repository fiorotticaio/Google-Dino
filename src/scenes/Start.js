import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {

    constructor() {
        super('start');
    }

    preload() {
        /* fazendo o carregamento das imagens */
        this.load.image('dinoRun', './src/sprites/images/dinoRun.png');
        this.load.image('spaceButton', './src/sprites/images/spaceRed.png');
        this.load.image('background','./src/sprites/images/background2.png');
        
        /* fazendo o carregamento dos sons */
        this.load.audio('startMusic', './src/sprites/sounds/startMusic.mp3');
    }

    create() {
        const width = this.scale.width; // largura do jogo
        const height = this.scale.height; // altura do jogo
        const style = {
            color: '#000000',
            fontSize: 24
        };

        /* adcionando as imagens carregadas */
        this.add.image(500, 250, 'background');
        this.add.image(500, 300, 'dinoRun').setScale(0.5);
        this.button = this.add.image(500, 125 , 'spaceButton')
        .setScale(0.5); 

        /* adicionando a musica inicial */
        this.sound.play('startMusic');

        /* adicionando a frase na tela */
        this.add.text(500, 50, 'Pressione ESPAÇO para iniciar', style)
            .setOrigin(0.5);

        /* se apertar espaço inicia a cena principal (Game) */
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.stopAll(); // parar a música inicial
            this.scene.start('game');
        })

        setInterval(()=>{

            if(this.button.scale == (0.45)) this.button.setScale(0.4);
            else this.button.setScale(0.45);
        },500);
    }

    update(){};
}