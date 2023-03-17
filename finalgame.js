function setup(){
    createCanvas(400, 400); 
    Game.addCommonBalloon()
}

function draw(){
    background("LightSkyBlue");

    for (let balloon of Game.balloons) {
        balloon.dispLay();
        balloon.move(Game.score);
            if (balloon.y <= balloon.size / 2 && balloon.color != "slateblue") {
            noLoop()
            clearInterval(interval)
            Game.balloons.length = 0 
            background(130, 220, 170);
            let finalScore = Game.score
            Game.score = " "
            textSize(64);
            fill("ghostwhite");
            textAlign(CENTER, CENTER);
            text("FINISH", 200, 200);
            textSize(34);
            text("Score: " + finalScore, 200, 300);
            }
}
    textSize(32);
    fill("black");
    text(Game.score, 20, 40);

    if (frameCount % 55 === 0) {
        Game.addCommonBalloon ()
    }
    if (frameCount % 115 === 0) {
        Game.addUniqBalloon ()
    }
    if (frameCount % 105 === 0) {
        Game.addAngryBalloon ()
    }
}
function mousePressed(){
    if (!isLooping()) {
        loop()
        Game.score = 0
        Game.countOfBlack = 0
        Game.countOfBlue = 0
        Game.countOfClick = 0
        Game.countOfGrenn = 0

        interval = setInterval(() => {
            Game.sendStatistics();
        }, 5000);
    }
    Game.countOfClick += 1
    Game.checkIfBaloonBurst()
}

let interval = setInterval(() => {
    Game.sendStatistics();
}, 5000);

class Game {
    static balloons = []
    static score = 0
    static countOfGrenn = 0
    static countOfBlack = 0
    static countOfBlue = 0
    static countOfClick = 0

    static sendStatistics(){
        let stats = {
            score: this.score,
            countOfGrenn: this.countOfGrenn,
            countOfBlack: this.countOfBlack,
            countOfBlue: this.countOfBlue,
            countOfClick: this.countOfClick
        }

        fetch("/stats", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stats)
        });
    }

    static addCommonBalloon(){
        let commonBalloon = new CommonBalloon("greenyellow", 55, 1);
        this.balloons.push(commonBalloon);
    }
    static addUniqBalloon(){
        let uniqBalloon = new UniqBalloon("gold", 35, 1.25);
        this.balloons.push(uniqBalloon);
    }
    static addAngryBalloon(){
    let angryBalloon = new AngryBalloon("slateblue", 55, 0.85);
    this.balloons.push(angryBalloon);
    }
    static checkIfBaloonBurst(){
        this.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if (distance <= balloon.size / 2) {
                balloon.burst(index)
            }
        })
    }
}

class CommonBalloon {
    constructor(color, size, speed){
        this.x = random(width);
        this.y = random(height - 10, height + 50,);
        this.color = color;
        this.size = random(size - 8, size + 8);
        this.speed = speed

    }
    dispLay(){
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
    }
    move(score){
        if (score < 100) {
            this.y -= 0 + this.speed
        }
        else if (score >= 100 && score < 225) {
            this.y -= 0.4 + this.speed
        }
        else if (score >= 225 && score < 350) {
            this.y -= 0.8 + this.speed
        }
        else if (score >= 350 && score <= 500) {
            this.y -= 1.3 + this.speed
        }
        else {
            this.y -= 2 + this.speed
        }
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score += 1
        Game.countOfGrenn += 1
    }
}

class UniqBalloon extends CommonBalloon {
        constructor(color, size, speed){
        super(color, size, speed)
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score += 10
        Game.countOfBlue += 1
    }
}

class AngryBalloon extends CommonBalloon {
    constructor(color, size, speed){
        super(color, size, speed)
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score -= 20
        Game.countOfBlack += 1
    }
}