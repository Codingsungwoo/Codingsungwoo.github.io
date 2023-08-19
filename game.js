import { setMoneyCommon, getMoney,
    maxSpeed, speedPotionPrice, setSpeedLevelCommon, getSpeedLevel,
    maxPower, powerPotionPrice, setPowerLevelCommon, getPowerLevel,
    maxHealth, healthPotionPrice, setHealthLevelCommon, getHealthLevel,
    maxSword,swordPrice,setSwordLevelCommon,getSwordLevel,
} from './common/stats.js';
let times = 1;

class Resource {
    static #allPromises = [];
    #promise;
    constructor() {
        this.#promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
        Resource.#allPromises.push(this.#promise);
    }
    static async afterAllLoaded() {
        await Promise.all(Resource.#allPromises);
    }
    get promise() {
        return this.#promise;
    }
}

class ImageResource extends Resource {
    // private 필드는 먼저 선언되어야 생성자에서 자유롭게 쓸 수 있음
    #image;
    constructor(src) {
        super();
        this.#image = new Image();
        this.#image.onload = () => {console.log(`Loaded resource ${src}`);this.resolve();};
        this.#image.onerror = (event) => {console.log(`Error occured while loading resource ${src}`);this.reject(event);};
        this.#image.src = src;
    }
    get image() {
        return this.#image;
    }
}

class AudioResource extends Resource {
    static #soundList = [];
    static #allMuted = false;

    #audio;
    #originalVolume;
    #isMusic;

    constructor(src, volume, isMusic = false) {
        super();
        this.#audio = new Audio();
        this.#audio.onloadeddata = () => {console.log(`Loaded audio ${src}`); this.resolve();};
        this.#audio.onerror = (event) => {console.log(`Error occured while loading audio ${src}`); this.reject(event);};
        this.#audio.src = src;
        this.#audio.volume = volume;
        this.#originalVolume = volume;
        this.#isMusic = isMusic;
        AudioResource.#soundList.push(this);
    }

    get audio() {
        return this.#audio;
    }

    mute() {
        if (!this.#audio.volume) return;
        if (!this.#audio.paused)
            this.#audio.pause();
        this.#audio.volume = 0;
    }

    unmute() {
        if (this.#audio.volume) return;
        this.#audio.volume = this.#originalVolume;
        if (this.#isMusic)
            this.#audio.play();
    }

    static muteAll() {
        AudioResource.#soundList.forEach((audio) => {audio.mute();});
        AudioResource.#allMuted = true;
    }

    static unmuteAll() {
        AudioResource.#soundList.forEach((audio) => {audio.unmute();});
        AudioResource.#allMuted = false;
    }

    static toggleMuteAll() {
        if (AudioResource.#allMuted)
            AudioResource.unmuteAll();
        else
            AudioResource.muteAll();
    }

    static get isMuted() {
        return AudioResource.#allMuted;
    }
}

// constants regarding shot and enemy sizes
const shotW = 45;
const shotH = 40;
const twinShotW = 35;
const enemyW = 50;
const enemyH = 30;
const strongEnemyW = 60; // 강적 크기
// 우주선 관련
const spaceW = 120;
const spaceH = 120;
const spaceEffectiveW = 60;
const spaceEffectiveH = 60;

const stopX = 545;
const stopY = 0;
const stopW = 50;
const stopH = 50;
const soundX =545;
const soundY = 60;
const soundW = 50;
const soundH = 50;
const explosionH = 50;
const explosionW = 50;
const strongEnemyPeriod = 5;

// 난이도 관련
let enemyIntervalState = 0; // 0: normal, 1: hard, 2: extreme, 3: extremehard
function enemyGenerationPeriod() {
    switch (enemyIntervalState) {
        case 1:
            return hardInterval;
        case 2:
            return extermeInterval;
        case 3:
            return extremehardInterval;
        default:
            return normalInterval;
    }
}
let normalInterval = 2000; // 노멀 난이도
let hardInterval = 1000; // 하드 난이도
let extermeInterval = 500; // 익스트림 난이도
let extremehardInterval = 300;//익스트림하드 난이도

// 일반기 스탯
let weakEnemyDurability = 1;
let weakEnemyVelocity = 5;
let weakEnemyScore = 1;
let weakEnemyMoney = 1000;
let weakEnemyForce = 10;
// 중형기 스탯
let strongEnemyDurability = 5;
let strongEnemyVelocity = 3;
let strongEnemyScore = 3;
let strongEnemyMoney = 3000;
let strongEnemyForce = 25;

// 아군 스탯
let initialVitality = 100+getHealthLevel()*10;
let playerVitality = Math.ceil(initialVitality);
let spaceSpeed = 10; // 나중에 상점과 연동해서 바뀔 값.
let spacePower = 1; // 나중에 상점과 연동해서 바뀔 값.

// 사운드 관련
const itemSound = new AudioResource('sound/item.wav', 0.3).audio;
const loopMusic = new AudioResource('sound/loop.mp3', 0.2, true).audio;
const shotSound = new AudioResource('sound/shot.wav', 0.1).audio;
const explosionSound = new AudioResource('sound/explosion.wav', 0.08).audio;
const gameoverSound = new AudioResource('sound/gameover.mp3', 0.3).audio;
const clearSound = new AudioResource('sound/clear.wav', 0.5).audio;
const finalclearSound = new AudioResource('sound/finalclear.mp3', 0.4).audio;

// 이미지 변수들
const backgroundImage = new ImageResource('image/background.gif').image;
const spaceshipImage = new ImageResource('image/spaceship.png').image;
const bulletImage = new ImageResource('image/bullet.png').image;
const gameoverImage = new ImageResource('image/gameover.png').image;
const enemyImage = new ImageResource('image/enemy.jpg').image;
const strongEnemyImage = new ImageResource('image/enemy2.png').image;
const stopImage = new ImageResource('image/stop.png').image;
const explosionImage = new ImageResource('image/explosion.png').image;
const bossImage = new ImageResource('image/boss.png').image;
const potionImage = new ImageResource('image/heal.png').image;
const eliteMidbossImage = new ImageResource('image/middleboss.png').image;
const elite2MidbossImage = new ImageResource('image/secondmiddleboss.png').image;
const elite3MidbossImage = eliteMidbossImage; // 다른 이미지 쓸 경우 new ImageResource로 바꿔야함
const elite4MidbossImage = eliteMidbossImage; // 상동
const bombImage = new ImageResource('image/bomb.png').image;
const enemyBulletImage = new ImageResource('image/rocket.png').image;
const bulletPowerUpImage = new ImageResource('image/booster.png').image;
const soundOffImage = new ImageResource('image/soundoff.png').image;
const soundOnImage = new ImageResource('image/soundon.png').image;

// 체력 게이지 이미지들
const gaugeEncloseImage = new ImageResource('image/gauge/gauge-enclose.png').image;
const gaugeEncloseBGImage = new ImageResource('image/gauge/gauge-enclose-bg.png').image;
const rangeEight = [...Array(8).keys()];
const gaugeImages = rangeEight.map((i) => new ImageResource(`image/gauge/gauge-${i + 1}.png`).image);
const criticalGaugeImages = rangeEight.map((i) => new ImageResource(`image/gauge/gauge-critical-${i + 1}.png`).image);

// 타이머 관련 변수
let gameTimer = 0; // 실제 게임 진행에 영향을 미치는 타이머
let systemTimer = undefined; // requestAnimationFrame에서 반환한 값
let previousTimer = undefined; // gameTimer를 산출하기 위해, systemTimer의 이전 값을 저장

// 임시 효과
let explosionSpriteList = [];

// 게임 알림
let toastText = '';
let secondtoastText = '';
let toastTimer = undefined;

// 강적 출현 카운터
let strongEnemyCounter = strongEnemyPeriod;

// 스테이지 번호
let currentStageNumber = 0; // 0: tutorial, 1~: 정식 스테이지

let canvas;
let ctx;
let score = 0;
let newHeight = 0;
let scrollY = 0;
let paused = false; // 일시정지 여부
let nextEnemyGenerationTime = undefined;
let nextUnpauseHandler = undefined;
canvas = document.createElement("canvas");
canvas.id = 'gameScreen';
canvas.width = 600
canvas.height = 770
ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
let gameover = false
let spacex = canvas.width / 2; // 우주선의 중심을 처음에는 캔버스의 중심으로 정하기로 한다.
let spacey = canvas.height - Math.floor(spaceH / 2);
function spaceLeft() {
    return spacex - Math.floor(spaceW / 2);
}

function spaceTop() {
    return spacey - Math.floor(spaceH / 2);
}

function spaceBottom() {
    return spacey + Math.ceil(spaceH / 2);
}

function spaceRight() {
    return spacex + Math.ceil(spaceH / 2);
}

function spaceEffectiveLeft() {
    return spacex - Math.floor(spaceEffectiveW / 2);
}

function spaceEffectiveTop() {
    return spacey - Math.floor(spaceEffectiveH / 2);
}

function spaceEffectiveBottom() {
    return spacey + Math.ceil(spaceEffectiveH / 2);
}

function spaceEffectiveRight() {
    return spacex + Math.ceil(spaceEffectiveW / 2);
}

// 체력바 관련
let gaugeHeight = null;
let gaugeWidth = null;
const gaugeX = 5;
let gaugeY = null;
const gaugeOffsetX = 7;
const gaugeOffsetY = 12;
const gaugeInternalX = gaugeX + gaugeOffsetX;
//const gaugeInternalMaxY = gaugeY + gaugeOffsetY;
let gaugeInternalMaxY = null;
const criticalHealthBorder = initialVitality >> 2;
const maxGaugeFrame = 24;
let gaugeFrame = 0;

let bulletlist = [];

// 상점 관련 함수들
let moneyForDrawing = 0;
function setMoney(value) {
    const validatedValue = setMoneyCommon(value);
    moneyForDrawing = validatedValue;
}

// 매 프레임마다 스토리지 겟을 할 수는 없으니, 내부용 변수도 추가

// 총알 파워업 관련
let poweredUpShot = false;

class Shot {
    constructor(x, widthOverride, y) {
        if (!widthOverride) {
            this.width = shotW;
            this.height = shotH;
        } else {
            this.width = widthOverride;
            this.height = Math.floor(widthOverride * shotH / shotW);
        }
        if (!x)
            this.x = spacex;
        else
            this.x = x;
        if (!y)
            this.y = spaceTop() - shotH;
        else
            this.y = y;
        this.alive = true;
        bulletlist.push(this);
    }

    get left() {
        return this.x - Math.floor(this.width / 2);
    }

    get top() {
        return this.y - Math.floor(this.height / 2);
    }

    get bottom() {
        return this.y + Math.ceil(this.height / 2);
    }

    get right() {
        return this.x + Math.ceil(this.width / 2);
    }

    update() {
        if (!this.alive)
            return;
        this.y -= 7;
        if (this.bottom <= 0) {
            this.alive = false;
            return;
        }

        this.checkhit();
    }

    draw() {
        ctx.drawImage(bulletImage, this.left, this.top, this.width, this.height);
    }

    checkhit() {
        for (const enemy of enemylist) {
            if (enemy.right >= this.left && enemy.left <= this.right &&
                enemy.top <= this.bottom && enemy.bottom >= this.top) {
                this.alive = false;
                // 적에게 피탄 판정시킴
                enemy.hitByAttack(spacePower);
                return;
            }
        }
        
        if (eliteEnemy && eliteEnemy.alive &&
            (eliteEnemy.right >= this.left) &&
            (eliteEnemy.left <= this.right) &&
            (eliteEnemy.top <= this.bottom) &&
            (eliteEnemy.bottom >= this.top)) {
            this.alive = false;

            eliteEnemy.hitByAttack(spacePower);
        }
    }

    static reapBullets() {
        bulletlist = bulletlist.filter((bullet) => bullet.alive);
    }
}

class Sprite {
    constructor(x, y, expirationDelay = 500, image = explosionImage, widthOverride = undefined) {
        this.image = image;
        this.expirationTimestamp = gameTimer + expirationDelay;
        this.x = x;
        this.y = y;
        this.alive = true;
        if (widthOverride > 0) {
            this.width = widthOverride;
            this.height = Math.round((widthOverride / image.naturalWidth) * image.naturalHeight);
        } else {
            // set to natural width and height
            this.width = image.naturalWidth;
            this.height = image.naturalHeight;
        }
        //explosionSpriteList.push(this);
    }

    get left() {
        return this.x - Math.floor(this.width / 2);
    }

    get top() {
        return this.y - Math.floor(this.height / 2)
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
        }
    }

    update() {
        if (gameTimer > this.expirationTimestamp) {
            this.alive = false;
        }
    }

    static reapSprites() {
        for (let i = 0; i < explosionSpriteList.length; ++i) {
            if (!explosionSpriteList[i].alive) {
                explosionSpriteList.splice(i, 1);
                --i;
            }
        }
    }
}

// 체력상자 관련
let items = [];

class Item {
    constructor(image, benefitFunction, widthOverride = undefined, velocity = 3) {
        this.image = image;
        if (widthOverride) {
            this.width = widthOverride;
            this.height = Math.round((widthOverride / image.naturalWidth) * image.naturalHeight);
        } else {
            this.width = image.naturalWidth;
            this.height = image.naturalHeight;
        }
        this.velocity = velocity;

        this.benefitFunction = benefitFunction;

        this.y = 0;
        this.x = randomvalue(48 + Math.floor(this.width / 2), canvas.width - Math.floor(this.width / 2) - 48);

        this.alive = true;
        console.log('item constructor called');

        items.push(this);
    }

    get left() { return this.x - Math.floor(this.width / 2); }
    get top() { return this.y - Math.floor(this.height / 2); }
    get right() { return this.left + this.width; }
    get bottom() { return this.top + this.height; }

    update() {
        if (this.alive) {
            this.y += this.velocity;
            if (this.left <= spaceRight() &&
                this.right >= spaceLeft() &&
                this.bottom >= spaceTop()) {
                // give some benefit and die
                this.benefitFunction();
                this.alive = false;
            } else if (this.top > canvas.height) {
                // 혜택을 주지 않고 죽음
                this.alive = false;
            }
        }
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
        }
    }

    static reapItems() {
        for (let i = 0; i < items.length; ++i) {
            if (!items[i].alive) {
                items.splice(i, 1);
                --i;
            }
        }
    }
}

// 체력상자 관련
const itemInterval = 12500;
let nextItemTime = 0;

class HealthVial extends Item {
    constructor(healRate = 20) {
        super(potionImage, () => {
            const newVitality = playerVitality + healRate;
            playerVitality = Math.ceil(newVitality > initialVitality ? initialVitality : newVitality);

            // 소리 재생
            itemSound.currentTime = 0;
            itemSound.play();
        }, 40);
    }
}

// 전멸폭탄
class KillAllItem extends Item {
    constructor(namedDamage = 0) {
        super(bombImage, () => {
            enemylist.forEach((enemy) => {
                enemy.kill();
            });
            Enemy.reapEnemies();
            if (namedDamage > 0 && eliteEnemy && eliteEnemy.alive) {
                eliteEnemy.hitByAttack(namedDamage);
                explosionSpriteList.push(new Sprite(eliteEnemy.x, eliteEnemy.y, 300, explosionImage, 150));
            }
            // 폭발음 재생 (적이 있으면 어차피 재생된다지만)
            explosionSound.currentTime = 0;
            explosionSound.play();
        }, 60);
    }
}

// 총알 파워업
class PowerUpItem extends Item {
    constructor() {
        super(bulletPowerUpImage, () => {
            poweredUpShot = true;
            // 5000을 조작해서 파워업 시간 조정
            queueDelayedEventGame(() => {poweredUpShot = false;}, 5000);

            // 소리 재생
            itemSound.currentTime = 0;
            itemSound.play();
        }, 60);
    }
}

// 텍스트 안내문 표시
function showToast(text,secondtext,duration = 3000) {
    toastText = text;
    secondtoastText = secondtext;
    toastTimer = systemTimer + duration;
}

function randomvalue(min, max) {
    let number = Math.floor(Math.random() * (max - min + 1)) + min
    return number;
}
let enemylist = [];

class Enemy {
    constructor(widthOverride = enemyW, image = enemyImage, durability = 1, velocity = 5, killScore = 1, killMoney = 1000, damageToPlayer = 10) {
        if (widthOverride <= 0) {
            this.width = enemyW;
        } else {
            this.width = widthOverride;
        }
        this.image = image;
        this.height = Math.round((this.width / image.naturalWidth) * image.naturalHeight);

        this.x = randomvalue(48 + Math.floor(this.width / 2), canvas.width - Math.floor(this.width / 2) - 48);
        this.y = 0;

        this.alive = true;

        // 내구도 값
        this.durability = durability;

        // 속도 값
        this.velocity = velocity;

        // 격파 보상
        this.killScore = killScore;
        this.killMoney = killMoney;

        // 입히는 대미지
        this.damageToPlayer = damageToPlayer;

        enemylist.push(this);
    }

    get left() { return this.x - Math.floor(this.width / 2); }
    get top() { return this.y - Math.floor(this.height / 2); }
    get right() { return this.left + this.width; }
    get bottom() { return this.top + this.height; }

    update() {
        if (this.alive) {
            this.y += this.velocity;
            if (this.y > canvas.height - enemyH ||
                (this.y >= spaceEffectiveTop() &&
                this.x >= spaceEffectiveLeft() &&
                this.x <= spaceEffectiveRight() &&
                this.y <= spaceEffectiveBottom())) {
                damagePlayer(this.damageToPlayer);
                this.alive = false;
                explosionSound.play();
            }
        }
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
        }
    }

    kill(awardScore = true, explode = true) {
        if (this.alive) {
            this.alive = false;

            if (awardScore) {
                // 격파 보상
                score += this.killScore;
                setMoney(getMoney() + this.killMoney);

                // 격파에 따라 스테이지 변동 가능성
                changeStage();
            }

            if (explode) {
                // 적 소멸에 따라 효과음과 폭발 효과도 별개로 추가
                // 폭발 효과
                explosionSpriteList.push(new Sprite(this.x, this.y, 600, explosionImage, 80));
                // 효과음
                explosionSound.currentTime = 0; // 처음으로 돌아가기
                explosionSound.play();
            }
        }
    }

    hitByAttack(power = 1) {
        this.durability -= power;
        if (this.durability <= 0) {
            this.kill();
        }
    }

    static reapEnemies() {
        for (let i = 0; i < enemylist.length; ++i) {
            if (!enemylist[i].alive) {
                enemylist.splice(i, 1);
                --i;
            }
        }
    }
}
// 중간보스 등이 쏘는 총탄
const bulletW = 45;
class EnemyBullet {
    constructor(x, y, damageToPlayer = 1, velocity = 4, xVelocity = 0, widthOverride = bulletW, image = enemyBulletImage) {
        if (widthOverride <= 0) {
            this.width = enemyW;
        } else {
            this.width = widthOverride;
        }
        this.image = image;
        this.height = Math.round((this.width / image.naturalWidth) * image.naturalHeight);

        this.x = x;
        this.y = y;

        this.alive = true;

        // 속도 값
        this.velocity = velocity;
        this.xVelocity = xVelocity;

        // 입히는 대미지
        this.damageToPlayer = damageToPlayer;
        enemyBulletList.push(this);
    }

    get left() { return this.x - Math.floor(this.width / 2); }
    get top() { return this.y - Math.floor(this.height / 2); }
    get right() { return this.x + Math.ceil(this.width / 2); }
    get bottom() { return this.y + Math.ceil(this.height / 2); }

    update() {
        if (this.alive) {
            this.y += this.velocity;
            this.x += this.xVelocity;
            if (this.y >= spaceEffectiveTop() &&
                this.x >= spaceEffectiveLeft() &&
                this.x <= spaceEffectiveRight() &&
                this.y <= spaceEffectiveBottom()) {
                damagePlayer(this.damageToPlayer);
                this.alive = false;
                explosionSound.play();
            } else if (this.top > canvas.height ||
                this.left > canvas.width ||
                this.right < 0) {
                this.alive = false;
            }
        }
    }

    draw() {
        if (this.alive) {
            if (this.velocity < 0) {
                // ctx.setTransform(a, b, c, d, e, f): (x, y)를 입력하면 (ax+by+c, dx+ey+f)로 출력되게 된다.
                // drawImage에서, x, y -> (x + this.left, this.bottom - y) 로 변환된다
                ctx.setTransform(1, 0, 0, -1, this.left, this.bottom);
                ctx.drawImage(this.image, 0, 0, this.width, this.height);
                // 원래의 좌표계 x, y -> x, y로 다시 되돌린다
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            } else
                ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
        }
    }

    static reapEnemyBullets() {
        for (let i = 0; i < enemyBulletList.length; ++i) {
            if (!enemyBulletList[i].alive) {
                enemyBulletList.splice(i, 1);
                --i;
            }
        }
    }
}
let enemyBulletList = [];

// 3보스만 사용하는 튕기는 총탄
class RicochetEnemyBullet extends EnemyBullet {
    constructor(x, y, xVelocity, damageToPlayer = 1, yVelocity = 4, widthOverride = bulletW, image = enemyBulletImage) {
        super(x, y, damageToPlayer, yVelocity, xVelocity, widthOverride, image);
    }

    update() {
        if (this.alive && this.bottom >= canvas.height) {
            this.y = canvas.height - (this.bottom - canvas.height);
            this.velocity = -this.velocity;
        }

        super.update();
    }
}

// 중간보스 관련
const eliteData = {
    width: 120,
    yPosition: 120,
    autoFireDelay: 220,
    burstFirePause: 500,
    patternRepetitionDelay: 1000,
    attackPower: 10,
    initialVitality: 100,
    maxSpeed: 5,
    killScore: 50,
    killMoney: 50000,
    explosionWidth: 200,
    bulletYVelocity: 4,
};

class EliteEnemyMidboss {
    constructor(image = eliteMidbossImage, stats = eliteData) {
        // 같은 보스가 나중에 또 나온다면 constructor 변형 필요
        this.image = image;
        this.width = stats.width;
        this.height = Math.round((stats.width / image.naturalWidth) * image.naturalHeight);
        this.x = canvas.width / 2;
        this.y = stats.yPosition;

        this.alive = true;

        // 내구도 값
        this.durability = stats.initialVitality;

        // 참조값
        this.stats = stats;

        // 내부 상태
        this.remainingBurst = 3;
        this.currentState = 0; // 몇 번째 연사?
        this.nextActivityTimer = gameTimer + stats.autoFireDelay;
    }

    get left() { return this.x - Math.floor(this.width / 2); }
    get top() { return this.y - Math.floor(this.height / 2); }
    get right() { return this.left + this.width; }
    get bottom() { return this.top + this.height; }

    fire() {
        // 장전완료?
        if (this.remainingBurst == 0 && gameTimer >= this.nextActivityTimer) {
            this.currentState = (this.currentState + 1) % 3;
            this.remainingBurst = this.currentState == 2 ? 5 : 3; // 3번째 점사는 5번
        }
        if (this.remainingBurst > 0 && gameTimer >= this.nextActivityTimer) {
            const _ = new EnemyBullet(this.x, this.y + this.height, this.stats.attackPower, this.stats.bulletYVelocity);
            --this.remainingBurst;
            this.nextActivityTimer = gameTimer + (this.remainingBurst ? this.stats.autoFireDelay : (this.currentState == 2 ? this.stats.patternRepetitionDelay : this.stats.burstFirePause));
        }
    }

    chase() {
        if (spacex < this.x) {
            const deltaXThreshold = this.x - this.stats.maxSpeed;
            this.x = Math.max(deltaXThreshold, spacex);
        } else {
            const deltaXThreshold = this.x + this.stats.maxSpeed;
            this.x = Math.min(deltaXThreshold, spacex);
        }
    }

    update() {
        if (!this.alive) return;
        // 아직 쏠 수 있는 상태에서는 플레이어를 추적
        if (this.remainingBurst > 0) {
            this.chase();
        }

        this.fire();
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
        }
    }

    hitByAttack(power = 1) {
        this.durability -= power;
        if (this.durability <= 0) {
            this.alive = false;

            // 격파 보상
            score += this.stats.killScore;
            setMoney(getMoney() + this.stats.killMoney);

            // 격파에 따라 스테이지 변동 가능성
            changeStage();

            // 폭발 효과
            explosionSpriteList.push(new Sprite(this.x, this.y, 600, explosionImage, this.stats.explosionWidth));
            // 효과음
            explosionSound.currentTime = 0; // 처음으로 돌아가기
            explosionSound.play();
        }
    }
}
let eliteEnemy = null; // 중간보스가 살아있을 경우, 차지하는 변수
//두번째중간보스 관련
const elite2Data = {
    width: 150,
    yPosition: 120,
    autoFireDelay: 180,
    burstFirePause: 400,
    patternRepetitionDelay: 800,
    attackPower: 15, 
    initialVitality: 200,
    maxSpeed: 20,
    killScore: 100,
    killMoney: 100000,
    explosionWidth: 220,
    bulletYVelocity: 4,
    // elite2만 추가로 사용하는 값
    yDifference: 60,
    yVelocity: 5,
};

class EliteEnemy2Midboss extends EliteEnemyMidboss {
    constructor() {
        super(elite2MidbossImage, elite2Data);

        this.yVelocity = elite2Data.yVelocity;
        this.yMax = this.y + elite2Data.yDifference;
        this.yMin = this.y - elite2Data.yDifference;
    }

    update() {
        if (this.yVelocity > 0 && this.y > this.yMax) {
            this.yVelocity = -this.yVelocity;
            this.y = this.yMax;
        } else if (this.yVelocity < 0 && this.y < this.yMin) {
            this.yVelocity = -this.yVelocity;
            this.y = this.yMin;
        }
        this.y += this.yVelocity;

        super.update();
    }
}

const elite3Data = {
    width: 150,
    yPosition: 120,
    autoFireDelay: 180,
    burstFirePause: 180,
    patternRepetitionDelay: 180,
    attackPower: 10,
    initialVitality: 400,
    maxSpeed: 10,
    killScore: 100,
    killMoney: 100000,
    explosionWidth: 220,
    bulletYVelocity: 4,
};

class EliteEnemy3Midboss extends EliteEnemyMidboss {
    constructor() {
        super(elite3MidbossImage, elite3Data);
    }

    update() {
        if (!this.alive) return;

        this.chase();

        if (gameTimer >= this.nextActivityTimer) {

            new RicochetEnemyBullet(this.x, this.bottom, 0, this.stats.attackPower,
                this.stats.bulletYVelocity);

            this.nextActivityTimer = gameTimer + this.stats.autoFireDelay;
        }
    }
}

const elite4Data = {
    width: 150,
    yPosition: 120,
    autoFireDelay: 180,
    burstFirePause: 180,
    patternRepetitionDelay: 180,
    attackPower: 7,
    initialVitality: 400,
    maxSpeed: 10,
    killScore: 100,
    killMoney: 100000,
    explosionWidth: 220,
    bulletYVelocity: 6,
    // elite4만 추가로 사용하는 값
    bulletSpread: 1, // 한 발당 x축으로 프레임당 몇 px 퍼지는지
};
class EliteEnemy4Midboss extends EliteEnemyMidboss {
    constructor() {
        super(elite4MidbossImage, elite4Data);
    }

    update() {
        if (!this.alive) return;

        this.chase();

        if (gameTimer >= this.nextActivityTimer) {
            [-3, -1.5, 0, 1.5, 3].forEach((x) => {
                new EnemyBullet(this.x, this.bottom, this.stats.attackPower,
                    this.stats.bulletYVelocity, x * this.stats.bulletSpread)
            });

            this.nextActivityTimer = gameTimer + this.stats.autoFireDelay;
        }
    }
}
const elite5Data = {
    width: 150,
    yPosition: 120,
    autoFireDelay: 180,
    burstFirePause: 180,
    patternRepetitionDelay: 180,
    attackPower: 7,
    initialVitality: 600,
    maxSpeed: 10,
    killScore: 100,
    killMoney: 100000,
    explosionWidth: 220,
    bulletYVelocity: 2,
    // elite4,5만 추가로 사용하는 값
    bulletSpread: 0.03, // 한 발당 x축으로 프레임당 몇 px 퍼지는지
};
class EliteEnemyboss extends EliteEnemy4Midboss{
    constructor(){
        super(bossImage,elite5Data);
    }
}

function create() {
    enemyIntervalState = 0;
}
function hard() {
    enemyIntervalState = 1;
}
function extreme() {
    enemyIntervalState = 2;
}
function extremehard() {
    enemyIntervalState = 3;
}

function pause(nextUnpauseBehavior = undefined) {
    if (paused) {
        // 일시정지를 해제하면서, 일시정지 해제시 하기로 했던 것을 함
        paused = false;
        if (nextUnpauseHandler !== undefined) {
            nextUnpauseHandler();
        }
        if(!shotSound.volume==0)
        loopMusic.play();
    } else {
        // 일시정지
        paused = true;
    }
    // 다음 일시정지 해제시 할 행동 변경
    nextUnpauseHandler = nextUnpauseBehavior;
}

function killPlayer() {
    gameover = true;
    gameoverSound.play(); // game over 음향 재생
    loopMusic.pause(); // 완전 stop은 없는 듯
    loopMusic.currentTime = 0;
}

function damagePlayer(damageValue) {
    playerVitality = Math.floor(playerVitality - damageValue);
    if (playerVitality <= 0)
        killPlayer();
}


let keysdown = {};
function key() {
    document.addEventListener("keydown", function (event) {
        if (event.code == 'F12'||event.code == 'F11'||event.code == 'F10'||event.code == 'F1'||event.code == 'F2'||event.code == 'F3'||event.code == 'F4')
            return;
        event.preventDefault();
        if (event.repeat) {
            return;
        }
        switch (event.code) {
            case 'KeyI':
                // 설명
                if (!paused)
                    pause();
                Swal.fire("r 이 게임 재시작</br>오른쪽 이랑 왼쪽 키 가 움직이기</br>a 가 발사하기</br>s가 스타트</br>S 가 일시정지</br>d가 인트로로 가는키</br>n 이 노멀모드</br>h가 하드모드</br>e가 익스트림 모드</br>!가 익스트림하드 모드</br>o 가 배경음악on,off</br>i 가 플레이 하는법</br>j가 돈 과 물약레벨 초기화</br>p 가 총알스킨변경 입니다</br>ㅣ 이 능략치 보기</br>tab키 가 소리on/off 입니다");
                break;
            case 'KeyH':
                // invoke hard mode generator
                hard();
                break;
            case 'KeyE':
                // invoke extreme mode generator
                extreme();
                break;
            case 'Digit1':
                if (keysdown['ShiftLeft']||keysdown['ShiftLeft'])
                    extremehard();
                break;
            case 'KeyN':
                // revert to normal mode generator
                create();
                break;
            case 'KeyS':
                pause();
                break;
            case 'KeyD':
                // return to intro
                location.href = 'intro.html';
                break;
            case 'KeyR':
                // refresh
                location.reload();
                break;
            case 'KeyA':
                // shoot a bullet
                if (!paused)
                    bullet();
                break;
            case 'KeyO':
                // is music on?
                if (loopMusic.paused) {
                    loopMusic.play();
                } else {
                    loopMusic.currentTime = 0;
                    loopMusic.pause();
                }
            break;
            case 'KeyJ':
                //reset status
                Swal.fire({
                    title: '정말로 돈과 능력치 를 초기화 하실 껍니까?',
                    text: "한번지우면 복구 가 불가능 합니다",
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: '아니요',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '네'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire(
                        '지워졌습니다!',
                        '돈과 능력치 레벨 이 초기화 됐습니다',
                        'success'
                      )
                      setMoney(0);
                      setSwordLevel(0);
                      setHealthLevel(0);
                      setPowerLevel(0);
                      setSpeedLevel(0);
                    }
                  })    
            break;
            case 'KeyP':
                let wasPaused = true;
                if (!paused) {
                    pause();
                    wasPaused = false;
                }
                //skin change
                let arg = null;
                if(getSwordLevel()>maxSword){
                    arg = prompt("바꿀스킨의 이름을 적어주세요.(검, 총알이나 빛의검 을 입력해주세요)");
                } else {
                    arg = prompt("바꿀스킨의 이름을 적어주세요.(검이나 총알을 입력해주세요)");
                }
                switch (arg) {
                case '검':
                    if(getSwordLevel()>=1){
                        alert( '스킨이 검으로 변경됩니다' );
                        bulletImage.src="image/sword.png"
                    }else{
                        alert('검 레벨이 1이 되어야 스킨을 검으로 변경할수있습니다')
                    }
                    break;
                case '총알':
                    alert( '스킨이 총알로 변경됩니다' );
                    bulletImage.src="image/bullet.png"
                    break;
                case '빛의검':
                    if(getSwordLevel()>maxSword){
                        alert('스킨이 빛의검으로 변경됩니다')
                        bulletImage.src="image/lightsword.png";
                    }else{
                        alert('검 을 초월해야지 스킨을낄수있읍니다');
                    }
                    break;
                default:
                    alert( '알 수 없는 값을 입력하셨습니다.' );
                }
                if (!wasPaused)
                    pause();
                break;
            case 'Tab':
                AudioResource.toggleMuteAll();
                break;
            case 'KeyL':
                Swal.fire('체력:'+initialVitality+'('+playerVitality+')'+'</br>공격력:'+spacePower+'</br>스피드:'+ spaceSpeed);
                break;
            break;
            default:
                keysdown[event.code] = true;
                break;
    }});
    document.addEventListener('keyup', function (event) {
        delete keysdown[event.code];
    });
    canvas.addEventListener('click', function (event) {
        let x = event.pageX - (canvas.offsetLeft + canvas.clientLeft);
        let y = event.pageY - (canvas.offsetTop + canvas.clientTop);

        // 일시정지 버튼 내에 있는가
        if (x >= stopX && x <= (stopX + stopW) &&
            y >= stopY && y <= (stopY + stopH)) {
            // 일시정지 버튼을 눌렀음
            pause();
        }
    }, false);   
    canvas.addEventListener('click', function (event) {
        let x = event.pageX - (canvas.offsetLeft + canvas.clientLeft);
        let y = event.pageY - (canvas.offsetTop + canvas.clientTop);

        // 소리 끄기 버튼 내에 있는가
        if (x >= soundX && x <= (soundX + soundW) &&
            y >= soundY && y <= (soundY + soundH)) {
            // 소리 끄기 버튼을 눌렀음
            AudioResource.toggleMuteAll();
        }
    }, false); 
}
function up(time) {
    // 다른 곳에서 현재 타임을 편리하게 참조할 수 있도록 따로 gameTimer 변수를 업데이트
    if (previousTimer === undefined) {
        previousTimer = time;
        systemTimer = time;
    } else {
        previousTimer = systemTimer;
        systemTimer = time;
        let i;
        for (i = 0; i < queuedSystemEvents.length; ++i) {
            if (time >= queuedSystemEvents[i].timeAfter) {
                queuedSystemEvents[i].handler();
                queuedSystemEvents.splice(i--, 1);
            }
        }
        if (!paused) {
            gameTimer += time - previousTimer;
            for (i = 0; i < queuedGameEvents.length; ++i) {
                if (gameTimer >= queuedGameEvents[i].timeAfter) {
                    queuedGameEvents[i].handler();
                    queuedGameEvents.splice(i--, 1);
                }
            }
        }
    }

    // 이 이상은 일시정지 상태에서 로직을 처리하지 않음
    if (paused) return;

    switch(currentStageNumber) {
    case 5: // 중간보스 스테이지
    case 10: // 중간보스 2
    case 15: // 중간보스 3
    case 20: // 중간보스4
    case 25: // 보스
        if (eliteEnemy)
            eliteEnemy.update();
        break;
    default:
        // 시간에 따라 적이 생성되는 부분
        if (nextEnemyGenerationTime === undefined) {
            nextEnemyGenerationTime = gameTimer + enemyGenerationPeriod();
        } else if (gameTimer >= nextEnemyGenerationTime) {
            if (strongEnemyCounter == 0) {
                const _ = new Enemy(strongEnemyW, strongEnemyImage, strongEnemyDurability, strongEnemyVelocity, strongEnemyScore, strongEnemyMoney, strongEnemyForce);
                strongEnemyCounter = strongEnemyPeriod;
            } else {
                const _ = new Enemy(enemyW, enemyImage, weakEnemyDurability, weakEnemyVelocity, weakEnemyScore, weakEnemyMoney, weakEnemyForce);
                --strongEnemyCounter;
            }
            nextEnemyGenerationTime = gameTimer + enemyGenerationPeriod();
        }
        break;
    }

    // 시간에 따라 포션 생성
    if (nextItemTime == 0)
        nextItemTime = gameTimer + itemInterval;
    else if (gameTimer >= nextItemTime) {
        const itemKind = Math.floor(Math.random() * 3);
        switch (itemKind) {
        case 0:
            new HealthVial(20);
            break;
        case 1:
            new KillAllItem(1);
            break;
        default:
            new PowerUpItem();
            break;
        }
        nextItemTime = gameTimer + itemInterval;
    }

    // 키 처리
    if ('ArrowRight' in keysdown) {
        spacex += spaceSpeed;
    };
    if ('ArrowLeft' in keysdown) {
        spacex -= spaceSpeed;
    };

    if (spaceLeft() < 0) {
        spacex = Math.floor(spaceW / 2)
    }
    let maxX = canvas.width - Math.floor(spaceW / 2)
    if (spacex >= maxX) {
        spacex = maxX
    }

    bulletlist.forEach((bullet) => {
        bullet.update();
    });
    for (let enemy of enemylist) {
        enemy.update();
    }

    for (let spr of explosionSpriteList) {
        spr.update();
    }

    for (let item of items) {
        item.update();
    }

    for (const enemyBullet of enemyBulletList) {
        enemyBullet.update();
    }

    Enemy.reapEnemies();
    Sprite.reapSprites();
    Item.reapItems();
    EnemyBullet.reapEnemyBullets();
    if (eliteEnemy && !eliteEnemy.alive)
        eliteEnemy = null;
}

const poweredShotDisperse = 10;

function bullet() {
    if (poweredUpShot) {
        // 총알 두 발씩 쏘는 루틴
        new Shot(spacex - poweredShotDisperse, twinShotW);
        new Shot(spacex + poweredShotDisperse, twinShotW);
    } else new Shot(); // 한 발만 쏘기

    // 총알 발사음 재생
    shotSound.currentTime = 0; // 처음으로 돌아감
    shotSound.play();
}
function show() {
    //ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    for (let drawY = -scrollY; drawY < canvas.height; drawY += newHeight) {
        ctx.drawImage(backgroundImage, 0, drawY, canvas.width, newHeight)
    }


    ctx.drawImage(spaceshipImage, spaceLeft(), spaceTop(), spaceW, spaceH);

    for (const enemy of enemylist) {
        enemy.draw();
    }
    for (const enemyBullet of enemyBulletList) {
        enemyBullet.draw();
    }
    if (eliteEnemy && eliteEnemy.alive)
        eliteEnemy.draw();

    // 폭발 효과 그림
    for (const spr of explosionSpriteList) {
        spr.draw();
    }

    for (const item of items) {
        item.draw();
    }

    // TODO: UI를 최상단에 그리려면 레이어가 바뀌어야 함
    if (paused) {
        // if paused, show a text with "paused"
        ctx.fillstyle = 'white';
        ctx.font = '60px Arial';
        ctx.fillText('Paused!', 20, 170);
    } else {
        // if not paused, after frame completes, scroll
        scrollY -= 5;
        if (scrollY < 0) {
            scrollY += newHeight;
        }
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText('Score:' + score, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText('money:' + moneyForDrawing, 20, 50);

    // 스테이지 알림 등 toast 표시하는 자리
    if (toastText && systemTimer < toastTimer) { // toastText가 있고, toast가 아직 표시되어야 한다면
        ctx.font = "20px Arial";
        ctx.fillText(toastText, 20, 110);
    }
    // 스테이지 알림 등 toast 표시하는 자리
    if (secondtoastText && systemTimer < toastTimer) { // toastText가 있고, toast가 아직 표시되어야 한다면
        ctx.font = "20px Arial";
        ctx.fillText(secondtoastText, 130, 20);
    }

    // 체력 표시
    if (gaugeY === null) {
        gaugeY = canvas.height - gaugeEncloseImage.naturalHeight - 5;
        gaugeInternalMaxY = gaugeY + gaugeOffsetY;
    }
    if (gaugeWidth === null) {
        gaugeWidth = gaugeImages[0].naturalWidth;
        gaugeHeight = gaugeImages[0].naturalHeight;
    }
    ctx.drawImage(gaugeEncloseBGImage, gaugeX, gaugeY);
    const gaugeCurrentHeight = Math.ceil(playerVitality * gaugeHeight / initialVitality);
    const gaugeInternalY = gaugeInternalMaxY + gaugeHeight - gaugeCurrentHeight;
    ctx.drawImage(playerVitality <= criticalHealthBorder ? criticalGaugeImages[Math.floor(gaugeFrame / 3)] : gaugeImages[Math.floor(gaugeFrame / 3)], gaugeInternalX, gaugeInternalY, gaugeWidth, gaugeCurrentHeight);
    if (!paused) {
        gaugeFrame = (gaugeFrame + 1) % maxGaugeFrame;
    }
    ctx.drawImage(gaugeEncloseImage, gaugeX, gaugeY);
    
    ctx.font = "20px Arial";
    //ctx.fillText("Life: " + (playerVitality > 0 ? playerVitality.toString() : "Dead"), 20, 80);

    // 일시정지 여부 표시
    ctx.drawImage(stopImage, stopX, stopY, stopW, stopH);
    //음악켜짐 여부 표시
    ctx.drawImage(AudioResource.isMuted ? soundOffImage : soundOnImage, soundX, soundY, soundW, soundH);
    bulletlist.forEach((bullet) => {if (bullet.alive) bullet.draw(); });
}

// changeStage의 반복되는 구현을 생략하기 위한 헬퍼 함수
function stageTransition(nextStageNumber, borderScore, toastMessage, intervals, enemyParams,sound,secondtoastMessage) {
    if (score >= borderScore) {
        loopMusic.pause();
        pause(() => { if (loopMusic.paused&&shotSound.volume>0) loopMusic.play(); });
        showToast(toastMessage,secondtoastMessage);
        currentStageNumber = nextStageNumber;
        normalInterval = intervals[0];
        hardInterval = intervals[1];
        extermeInterval = intervals[2];
        extremehardInterval = intervals[3];
        sound.play();
        if ('weakEnemyDurability' in enemyParams)
            weakEnemyDurability = enemyParams.weakEnemyDurability;
        if ('weakEnemyVelocity' in enemyParams)
            weakEnemyVelocity = enemyParams.weakEnemyVelocity;
        if ('strongEnemyDurability' in enemyParams)
            strongEnemyDurability = enemyParams.strongEnemyDurability;
        if ('strongEnemyVelocity' in enemyParams)
            strongEnemyVelocity = enemyParams.strongEnemyVelocity;
        // FIXME: I don't think this is a good idea
        switch (nextStageNumber) {
        case 5:
            eliteEnemy = new EliteEnemyMidboss();
            break;
        case 10:
            eliteEnemy = new EliteEnemy2Midboss();
            break;
        case 15:
            eliteEnemy = new EliteEnemy3Midboss();
            break;
        case 20:
            eliteEnemy = new EliteEnemy4Midboss();
            break;
        case 25:
            eliteEnemy = new EliteEnemyboss();
            break;
        }
        playerVitality = Math.ceil(initialVitality);
    }
}

// 타임아웃 이벤트 관련
const queuedSystemEvents = [];
const queuedGameEvents = [];

function queueDelayedEventSystem(handler, timeAfter) {
    if (timeAfter <= 0)
        handler();
    else {
        const newElement = { handler: handler, timeAfter: systemTimer + timeAfter };
        console.log("Queued new system event");
        console.log(newElement);
        queuedSystemEvents.push(newElement);
    }
}

function queueDelayedEventGame(handler, timeAfter) {
    if (timeAfter <= 0)
        handler();
    else
        queuedGameEvents.push({ handler: handler, timeAfter: gameTimer + timeAfter });
}

function changeStage() {
    switch (currentStageNumber) {
        case 0: // 튜토리얼 -> 1
            stageTransition(1, 10, "튜토리얼스테이지 클리어 1-1스테이지시작", [1500, 750, 375, 225], {},clearSound,"Tip:s키 를 눌르세요");
            break;
        case 1: // 1 -> 2
            stageTransition(2, 30, "1-1스테이지 클리어 1-2스테이지시작", [1000, 700, 330, 200], {
                weakEnemyVelocity: 5.2,
                strongEnemyVelocity: 3.2,
            },clearSound,"Tip:제 1 구역 넵튠");
            break;
        case 2: // 2 -> 3
            stageTransition(3, 50, "1-2스테이지 클리어 1-3스테이지시작", [900, 650, 300, 180], {
                weakEnemyDurability: 2,
                strongEnemyDurability: 7,
            },clearSound,"Tip:인트로는d키를 누르면 갈수있습니다");
            break;
        case 3:
            stageTransition(4, 100, "1-3스테이지 클리어 1-4스테이지시작", [850, 630, 280, 160], {
                weakEnemyVelocity: 5.4,
                strongEnemyVelocity: 3.4,
            },clearSound,"Tip:게임 이 막히면 상점 으로 가세요.");
            break;
        case 4:
            stageTransition(5, 150, "1-4스테이지 클리어 보스스테이지시작", [850, 630, 280, 160], {},clearSound,"Tip:첫번째 보스는 총알 사이의 간격 으로 피하세요");
            break;
        case 5:
            backgroundImage.src = "image/spacesea.png";
            //enemyImage.src = "image"
            //strongEnemyImage.src = "image"
            stageTransition(6, 200, "보스스테이지 클리어 2-1스테이지시작", [850, 630, 280, 160], {
                weakEnemyDurability: 3,
                strongEnemyDurability: 9,
            },finalclearSound,"제 2 구역 플루토");
            break;
        case 6:
            stageTransition(7, 250, "2-1스테이지 클리어 2-2스테이지시작", [850, 630, 280, 160], {
                weakEnemyDurability: 4,
                strongEnemyDurability: 11,
            },clearSound,"Tip:검 은 초반에 강화 하지 않는게 좋습니다");
            break;
        case 7:
            stageTransition(8, 300, "2-2스테이지 클리어 2-3스테이지시작", [850, 630, 280, 160], {
                strongEnemyDurability: 12,
            },clearSound,"Tip:속도 의 물약 은 너무 많이 강화 하면 안됩니다");
            break;
        case 8:
            stageTransition(9, 350, "2-3스테이지 클리어 2-4스테이지시작", [850, 630, 280, 160], {
                weakEnemyDurability: 5,
                strongEnemyDurability: 15,
            },clearSound,"Tip:속도 의 물약 은 5렙 까지만 강화하는게좋습니다");
            break;
        case 9:
            stageTransition(10, 400, "2-4스테이지 클리어 보스스테이지시작", [850, 630, 280, 160], {
                strongEnemyDurability: 20,
            },clearSound,"Tip:이번 보스는 크게 움직여서 총알의  위치를 고정시키세요");
            break;
        case 10:
            stageTransition(11,450,"보스스테이지클리어 3-1스테이지시작",[840,625,278,159],{},finalclearSound,"제3구역 세턴");
            break;
        case 11:
            stageTransition(12, 550, "3-1스테이지 클리어 3-2스테이지시작", [840, 625, 278, 159], {
                weakEnemyVelocity: 5.6,
                strongEnemyDurability: 21,
            },clearSound,"Tip:S를 누르면 특별한게 나올지도?");
            break;
        case 12:
            stageTransition(13, 600, "3-2스테이지 클리어 3-3스테이지시작", [840, 625, 278, 159], {
                weakEnemyVelocity: 5.7,
                strongEnemyDurability: 23,
            },clearSound,"뎀지 는 (1+힘의물약렙)*(검렙+1)*초월 입니다");
            break;
        case 13:
            stageTransition(14, 650, "3-3스테이지 클리어 3-4스테이지시작", [840, 625, 278, 159], {
                weakEnemyVelocity: 5.8,
                strongEnemyDurability: 25,
            },clearSound,"Tip:p를 누르면스킨을 바꿀수있다");
            break;
        case 14:
            stageTransition(15, 700, "3-4스테이지 클리어 보스스테이지시작", [835, 620, 275, 157], {
            },clearSound,"Tip:이번 보스 는 튕겨지는 탄알 을 쏜다");
            break;
        case 15:
            stageTransition(16, 800, "보스스테이지 클리어 4-1스테이지시작", [835, 620, 275, 157], {
            },finalclearSound,"제4구역 마스");
            break;
        case 16:
            stageTransition(17, 850, "4-1스테이지 클리어 4-2스테이지시작", [830, 620, 270, 155], {
                weakEnemyVelocity: 5.9,
                strongEnemyDurability: 26,
            },clearSound,"Tip:상점은 인트로 에 있습니다");
            break;
        case 17:
            stageTransition(18, 900, "4-2스테이지 클리어 4-3스테이지시작", [830, 620, 270, 155], {
                weakEnemyVelocity: 6,
                strongEnemyDurability: 27,
            },clearSound,"Tip:i 를 누르면 조작방법 을 알수있다");
            break;
        case 18:
            stageTransition(19, 950, "4-3스테이지 클리어 4-4스테이지시작", [830, 620, 270, 155], {
                strongEnemyVelocity: 3.6,
                weakEnemyDurability: 6,
            },clearSound,"Tip:검은 힘의물약 이14렙일때 강화 하는게 효율이좋다");
            break;
        case 19:
            stageTransition(20, 1000, "4-4스테이지 클리어 보스스테이지시작", [830, 620, 270, 155], {
                strongEnemyVelocity:3.7,
            },clearSound,"Tip:이번 보스 는 사방으로 총알을쏜다");
            break;
        case 20:
            stageTransition(21, 1100, "보스스테이지 클리어 5-1스테이지시작", [830, 615, 270, 155], {
                weakEnemyDurability:6,
                strongEnemyDurability:30,
            },finalclearSound,"제5구역 주피터");
            break;
        case 21:
            stageTransition(22, 1150, "5-1스테이지 클리어 5-2스테이지시작", [830, 615, 270, 155], {
                weakEnemyDurability:7,
                strongEnemyDurability:33,
            },clearSound,"Tip:o 를 누르면 음악을 끌수있습니다");
            break;
        case 22:
            stageTransition(23, 1200, "5-2스테이지 클리어 5-3스테이지시작", [830, 615, 270, 155], {
                strongEnemyDurability:35,
            },clearSound,"Tip:음소거 버튼 을 눌러 모든 소리를 끄거나 켤수 있습니다");
            break;
        case 23:
            stageTransition(24, 1250, "5-3스테이지 클리어 5-4스테이지시작", [820, 600, 265, 150], {
                strongEnemyVelocity:4,
            },clearSound,"Tip:l 로 현재상태를 확인할수있습니다");
            break;
        case 24:
            stageTransition(25, 1300, "5-4스테이지 클리어 최종보스스테이지시작", [820, 600, 265, 150], {
            },clearSound,"Tip:이번 보스 는 움직임 을 크게 하면 안됩니다");
            break;
        case 25:
            stageTransition(26, 1400, "최종보스스테이지클리어 ", [], {
            },finalclearSound,"곳 엔딩이나옵니다");
            console.log('reached ending stage');
            queueDelayedEventSystem(() => {location.href="ending.html";}, 4000);
            break;
        case 26:
            break;
        default:
            break;
    }
}
function access(time) {
    if (!gameover) {
        show();
        up(time);
        requestAnimationFrame(access);
    }if(gameover){
        ctx.drawImage(gameoverImage, 25, 50, 550, 600);
    }
}

// MARK: 능력치 관련 함수
function setSpeedLevel(value) {
    setSpeedLevelCommon(value);
    updateSpaceData();
}

function setPowerLevel(value) {
    setPowerLevelCommon(value);
    updateSpaceData();
}

function setHealthLevel(value) {
    const oldHealthValue = initialVitality;
    const validatedValue = setHealthLevelCommon(value);
    updateSpaceData();
    if (validatedValue == 0) {
        // 디버그에 의한 리셋
        currenthealth = initialVitality;
    } else {
        // 현장에서 업그레이드
        currenthealth += initialVitality - oldHealthValue;
    }
}

function setSwordLevel(value) {
    setSwordLevelCommon(value);
    updateSpaceData();
 }
 if(getSwordLevel()>maxSword){
    times = getSwordLevel()-maxSword+1;
 }
function updateSpaceData() {
    spaceSpeed = 10 + 1.5 * getSpeedLevel();
    spacePower = (1 + getPowerLevel())*(getSwordLevel()+1)*times;
    initialVitality = 100 + getHealthLevel()*10;
}

create();
await Resource.afterAllLoaded();
console.log('All load finished!');
// newHeight 재계산
newHeight = Math.round(backgroundImage.naturalHeight * (canvas.width / backgroundImage.naturalWidth));
key();
moneyForDrawing = getMoney();
updateSpaceData();// 상점 데이터로부터 능력치를 업데이트
// 효과음 음량 조절
// 음악 연속 재생
loopMusic.loop = true;
    requestAnimationFrame(access);
    let playPromise = loopMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // autoplay success 
        })
        playPromise.catch((error) => {
            // 재생에 실패했을 때 예외 처리.
            // 게임을 일시정지 상태로 두고, 일시정지 해제됐을 때 배경음 재생 시작
            if (error.name === 'NotAllowedError') {
                // 일시정지 상태로 둠
                pause(_ => {
                    loopMusic.play();
                });
        }
        })
    }