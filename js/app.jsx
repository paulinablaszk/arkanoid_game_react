import React from 'react';
import ReactDOM from 'react-dom';
import { Router,
    Route,
    Link,
    IndexLink,
    IndexRoute,
    hashHistory
} from 'react-router';



class Game extends React.Component {

    state = {
        gameOver: false,
        score: 0,
        scoreAfterLevel: 0,
        level: 1,
        lives: 3,
        paddleWidth: 75,
        dx: -2,
        dy: -2,
        background: "#CBBECD",
        startGame: false,
        startInfo: "CLICK OR PRESS SPACE TO START",
        bonus: false,

    }


    componentDidMount() {
        this.drawGame();
    }

    componentWillUnmount() {
        clearInterval(this.int);
    }

    newBall() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 20;


    }

    newBricks() {
        this.bricks = [];
        for(let i=0; i<this.brickColumns; i++) {
            this.bricks[i] = [];
            for(let j=0; j<this.brickRows; j++) {
                this.bricks[i][j] = { x: 0, y: 0, visible: true };
            }
        }

    }

    drawBackground(){
        this.ctx.beginPath();
        this.ctx.rect(0, 0, 600, 300);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.closePath();

    }

    drawGame() {

        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ballRadius = 10;
        this.rightKey = false;
        this.leftKey = false;
        this.paddleHeight = 10;
        this.paddleXPos = (this.canvas.width - this.state.paddleWidth) / 2;
        this.brickRows = 3;
        this.brickColumns = 7;
        this.brickWidth = 80;
        this.brickHeight = 30;
        this.brickPadding = 5;
        this.brickOffsetLeft = 5;
        this.brickOffsetTop = 0;
        this.newBall();
        this.newBricks();
        this.drawBall();
        this.drawPaddle();
        this.drawBricks();

        this.int = setInterval(() => this.draw(), 10);

        document.addEventListener("keydown", this.handleKeyDown, false);
        document.addEventListener("keyup", this.handleKeyUp, false);
        document.addEventListener("mousemove", this.handleMouseMove, false);
        document.addEventListener("click", this.handleStartClick, false);
    }




    handleKeyDown = (e) => {
        if (e.keyCode == 39) {
            this.rightKey = true
        }
        if (e.keyCode == 37) {
            this.leftKey = true;

        }

        if (e.keyCode == 32) {
            this.setState({
                startGame: true,
                startInfo: ""
            })
        }
    }


    handleKeyUp = (e) => {
        if(e.keyCode == 39) {
            this.rightKey = false
        }
        if(e.keyCode == 37) {
            this.leftKey = false
        }

    }

    handleMouseMove = (e) => {
        var relativeX = e.clientX - this.canvas.offsetLeft;
        if(relativeX  > this.state.paddleWidth/2 && relativeX < this.canvas.width - this.state.paddleWidth/2 ) {
            this.paddleXPos = relativeX - this.state.paddleWidth/2;
        }
    }

    handleStartClick = (e) => {
    this.setState({
        startGame: true,
        startInfo: ""
    })
    }



    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawPaddle() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleXPos, this.canvas.height - this.paddleHeight, this.state.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBricks() {

        for (let i = 0; i < this.brickColumns; i++) {
            for (let j = 0; j < this.brickRows; j++) {
                if (this.bricks[i][j].visible === true) {
                    this.brickX = (i * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                    this.brickY = (j * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                    this.bricks[i][j].x = this.brickX;
                    this.bricks[i][j].y = this.brickY;
                    this.ctx.beginPath();
                    this.ctx.rect(this.brickX, this.brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fillStyle = "black";
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }


    collisionDetection() {
        for (let i = 0; i < this.brickColumns; i++) {
            for (let j = 0; j < this.brickRows; j++) {
                this.brk = this.bricks[i][j];
                if (this.brk.visible === true) {
                    if (this.x > this.brk.x && this.x < this.brk.x + this.brickWidth &&
                        this.y > this.brk.y && this.y < this.brk.y + this.brickHeight) {
                        this.setState({
                            dy: -this.state.dy
                        });
                        this.brk.visible = 0;
                        var points = this.state.score + 1;
                        if (this.state.bonus === false) {
                            var num =  Math.random();
                            console.log(num);
                            if (num > 0.5 && num < 1) {
                                this.setState({
                                    bonus: true,
                                });
                                this.drawBonusBrick(this.brk.x, this.brk.y);

                            }
                        }

                        // new level
                        var newColor = this.getRandomColor();
                        if (points === this.brickColumns * this.brickRows + this.state.scoreAfterLevel) {
                            this.drawBackground();
                            this.newBall();
                            this.drawBall();
                            this.paddleXPos = (this.canvas.width - this.state.paddleWidth) / 2;
                            this.drawPaddle();
                            this.newBricks();
                            this.drawBricks();
                            this.setState({
                                level: this.state.level + 1,
                                scoreAfterLevel: points,
                                score: points,
                                dx: -2 - (0.25* (this.state.level-1)),
                                dy: -2 - (0.25* (this.state.level-1)),
                                background: newColor,
                                startGame: false,
                                startInfo: "CLICK OR PRESS SPACE TO START",
                                bonus: false
                            });

                        }
                        this.setState({
                            score: points
                        });


                    }
                }

            }
        }
    }

    drawBonusBrick(x,y){

        this.bonusBrickX = x;
        this.bonusBrickY = y;
        let bonusColor = this.getRandomColor();
        this.ctx.beginPath();
        this.ctx.rect(this.bonusBrickX, this.bonusBrickY, this.brickWidth, this.brickHeight);
        this.ctx.fillStyle = bonusColor;
        this.ctx.fill();
        this.ctx.closePath();


    }

    bounceWalls() {
        //from left and right
        this.x + this.state.dx > this.canvas.width - this.ballRadius || this.x + this.state.dx < this.ballRadius ? this.setState({ dx: -this.state.dx}) : this.setState({ dx: this.state.dx});
        //from top
        if (this.y + this.state.dy < this.ballRadius) {
            this.setState({
                dy: -this.state.dy
            })
        }
    }


    draw() {
        if (this.state.startGame === true) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawBall();
            this.drawPaddle();
            this.drawBricks();
            this.collisionDetection();
            this.x += this.state.dx;
            this.y += this.state.dy;
            this.bounceWalls();
            if (this.state.bonus === true) {
                this.drawBonusBrick(this.bonusBrickX, this.bonusBrickY +2);
                if(this.bonusBrickY >= this.canvas.height){
                    this.setState({
                        bonus: false,
                    })
                    if ((this.paddleXPos > this.bonusBrickX && this.paddleXPos < this.bonusBrickX + this.brickWidth) ||
                        (this.paddleXPos + this.state.paddleWidth >  this.bonusBrickX && this.paddleXPos + this.state.paddleWidth < this.bonusBrickX + this.brickWidth))
                    {
                        console.log("BONUS");
                        let randomBonus =  Math.floor(Math.random() * 5);
                        console.log(randomBonus);
                        switch(randomBonus) {
                            case 0:
                                this.setState({
                                    paddleWidth: this.state.paddleWidth -25
                                });
                                setTimeout(() => {
                                    this.setState({
                                        paddleWidth: this.state.paddleWidth +25,

                                    })
                                }, 5000);
                                break;

                            case 1:
                                this.setState({
                                    paddleWidth: this.state.paddleWidth +30
                                });
                                setTimeout(() => {
                                    this.setState({
                                        paddleWidth: this.state.paddleWidth -30,
                                    })
                                }, 5000);
                                break;
                            case 3:
                                this.setState({
                                    dx: this.state.dx < 0 ? this.state.dx -1 : this.state.dx + 1,
                                    dy: this.state.dy < 0 ? this.state.dy -1 : this.state.dy + 1,
                                });
                                setTimeout(() => {
                                    this.setState({
                                        dx: this.state.dx < 0 ? this.state.dx +1 : this.state.dx - 1,
                                        dy: this.state.dy < 0 ? this.state.dy +1 : this.state.dy - 1,
                                    })
                                }, 5000);
                                break;

                            case 4:
                                this.setState({
                                    dx: this.state.dx < 0 ? this.state.dx +1 : this.state.dx - 1,
                                    dy: this.state.dy < 0 ? this.state.dy +1 : this.state.dy - 1,
                                });
                                setTimeout(() => {
                                    this.setState({
                                        dx: this.state.dx < 0 ? this.state.dx -1 : this.state.dx + 1,
                                        dy: this.state.dy < 0 ? this.state.dy -1 : this.state.dy + 1,
                                    })
                                }, 5000);
                                break;

                            case 5:
                                this.setState({
                                    lives: this.state.lives +1,
                                });

                                break;
                        }
                    }
                }
            }

            //from paddle and bottom (game over)
            if (this.y + this.state.dy > this.canvas.height - this.ballRadius) {
                if (this.x >= this.paddleXPos && this.x <= this.paddleXPos + this.state.paddleWidth) {
                    this.setState({
                        dy: -this.state.dy
                    })


                } else {
                    if (this.state.lives > 1) {
                        this.setState({
                            lives: this.state.lives - 1,
                            startGame: false,
                            startInfo: "CLICK OR PRESS SPACE TO START",
                            bonus: false
                        })
                        this.drawBackground();
                        this.newBall();
                        this.drawBall();
                        this.paddleXPos = (this.canvas.width - this.state.paddleWidth) / 2;
                        this.drawPaddle();
                        this.drawBricks();



                    } else {
                        clearInterval(this.int);
                        this.setState({
                            gameOver: true
                        })
                    }
                }
            }
            this.rightKey && this.paddleXPos  < this.canvas.width - this.state.paddleWidth ? this.paddleXPos += 5 : this.paddleXPos;
            this.leftKey && this.paddleXPos > 0 ? this.paddleXPos -= 5 : this.paddleXPos;
//
        }
    }


    getRandomColor() {
        this.letters = '0123456789ABCDEF'.split('');
        this.color = '#';
        for (var i = 0; i < 6; i++ ) {
            this.color += this.letters[Math.floor(Math.random() * 16)];
        }
        return this.color;
    }



    render() {
        if (this.state.gameOver === true) {
            return <div id="game_over">
                <h1 className="blink">GAME OVER</h1>
                <h3> Score: {this.state.score}  </h3>
                <div className="play">
                    <Link to="/">Play again</Link>
                </div>
            </div>
        } else if (this.state.level === 11) {
            return <div id="win">
                <h1>Congratulations!</h1>
                <h3> Score: {this.state.score}  </h3>
                <div className="play">
                    <Link to="/">Play again</Link>
                </div>
            </div>
        }


        else {

            return (
                <div className="game">
                    <h1> BREAK THE WALL </h1>
                    <div className="results">
                        <h3> Score: {this.state.score}  </h3>
                        <h3> Lives: {this.state.lives}  </h3>
                    </div>
                    <canvas id="canvas" width="600" height="300" style={{background: this.state.background}}></canvas>
                    <h2 id="level"> Level: {this.state.level} </h2>
                    <h2 className="blink">{this.state.startInfo}</h2>
                </div>
            )
        }
    }
}

class Main extends React.Component {
    render() {
        return (
            <div id="main">
                <div className="words words-1">
                    <span>B</span>
                    <span>R</span>
                    <span>E</span>
                    <span>A</span>
                    <span>K</span>
                </div>
                <div className="words words-1">
                    <span>T</span>
                    <span>H</span>
                    <span>E</span>
                </div>
                <div className="words words-1">
                    <span>W</span>
                    <span>A</span>
                    <span>L</span>
                    <span>L</span>
                </div>
                <div className="play">
                    <Link to="/game">START GAME</Link>
                </div>
            </div>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
            <Route path='/' component={Main} />
            <Route path='/game' component={Game} />
            </Router>
    )}
}

document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(
        <App />,
        document.getElementById("app")
    )
});