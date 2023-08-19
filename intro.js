import { setMoneyCommon, getMoney,
    maxSpeed, speedPotionPrice, setSpeedLevelCommon, getSpeedLevel,
    maxPower, powerPotionPrice, setPowerLevelCommon, getPowerLevel,
    maxHealth, healthPotionPrice, setHealthLevelCommon, getHealthLevel,
    maxSword, swordPrice,setSwordLevelCommon,getSwordLevel,
} from './common/stats.js';

let over = 0;
function changeDisplayMoney(value) {
    document.getElementById('current-money').textContent = value.toString();
}

function setMoney(value) {
    const validatedValue = setMoneyCommon(value);
    changeDisplayMoney(validatedValue);
}

// 신속의 물약
let currentSpeed = 0;

function changeDisplaySpeed(value) {
    document.getElementById('current-speed').textContent = value.toString();
}

function setSpeedLevel(value) {
    const validatedValue = setSpeedLevelCommon(value);
    currentSpeed = validatedValue;
    changeDisplaySpeed(validatedValue);
}

function buySpeed() {
    if (currentSpeed >= maxSpeed) {
        alert('속도가 이미 한계치에 도달했습니다.');
        return;
    }
    const currentMoney = getMoney();
    if (currentMoney < speedPotionPrice) {
        alert('돈이 부족합니다.');
        return;
    }
    setMoney(currentMoney - speedPotionPrice);
    setSpeedLevel(currentSpeed + 1);
    alert('구매 성공');
}

// 힘의 물약
let currentPower = 0;

function changeDisplayPower(value) {
    document.getElementById('current-power').textContent = value.toString();
}

function setPowerLevel(value) {
    const validatedValue = setPowerLevelCommon(value);
    currentPower = validatedValue;
    changeDisplayPower(validatedValue);
}

function buyPower() {
    if (currentPower >= maxPower) {
        alert('공격력이 이미 한계치에 도달했습니다.');
        return;
    }
    const currentMoney = getMoney();
    if (currentMoney < powerPotionPrice) {
        alert('돈이 부족합니다.');
        return;
    }
    setMoney(currentMoney - powerPotionPrice);
    setPowerLevel(currentPower + 1);
    alert('구매 성공');
}
// 체력의 물약
let currenthealth = 0;

function changeDisplayHealth(value) {
    document.getElementById('current-health').textContent = value.toString();
}

function setHealthLevel(value) {
    const validatedValue = setHealthLevelCommon(value);
    currenthealth = validatedValue;
    changeDisplayHealth(validatedValue);
}

function buyHealth() {
    if (currenthealth >= maxHealth) {
        alert('체력 이 한계치에 도달했습니다.');
        return;
    }
    const currentMoney = getMoney();
    if (currentMoney < healthPotionPrice) {
        alert('돈이 부족합니다.');
        return;
    }
    setMoney(currentMoney - healthPotionPrice);
    setHealthLevel(currenthealth + 1);
    alert('구매 성공');
}
// 검
let currentSword = 0; 
function changeDisplaySword(value) {
    document.getElementById('current-sword').textContent = value.toString();
}

function setSwordLevel(value) {
    const validatedValue = setSwordLevelCommon(value);
    currentSword = validatedValue;
    changeDisplaySword(validatedValue);
}

function buySword() {
    if (currentSword >= maxSword) {
        alert('검 레벨 이 이미 한계치에 도달했습니다.');
        let maxplus = prompt('한계돌파 를 진행하시 갰습니까?(네/아니요)')
        switch(maxplus){
            case '네':
                let needgold=prompt('한계돌파 하는데 300만 골드 가필요합니다,그래도 하시겠습니까?(네/아니오)');
            switch(needgold){
                case '네':
                    const currentMoney = getMoney();
                    if(currentMoney < 3000000){
                        alert('돈 이 부족 합니다');
                    }else if(currentSword>maxSword){
                        alert('초월이 이미 완료됬습니다');
                    }else if(over>=1&&currentSword==maxSword){
                        setMoney(currentMoney - 3000000);
                        document.getElementById('current-sword').style.color = "blue";
                        alert('초월 완료(초월은 한번만 할수 있습니다),초월의힘이깄듭니다(초월의힘은 공격력을 2배이상 올려줍니다)');
                        alert('초월석 소멸');
                        alert('스킨 빛의검 이 장착 가능 합니다');
                        setSwordLevel(currentSword+1);
                        --over;
                    }else{
                        alert('그럼 초월석을 찾아오세요');
                    }
                    break;
                case '아니요':
                    alert('한계돌파를하고싶을때 다시찾아와주세요');
                    break;
                default:
                    alert('알수없는 값을 입력 하셨습니다');
            }
            break;
            case '아니요':
                alert('한계돌파를하고싶을때 다시찾아와주세요');
            break;
            default:
                alert('알수없는 값을 입력 하셨습니다');
            break;
        }
        return;
    }
    const currentMoney = getMoney();
    if (currentMoney < swordPrice) {
        alert('돈이 부족합니다.');
        return;
    }
    setMoney(currentMoney - swordPrice);
    setSwordLevel(currentSword + 1);
    alert('구매 성공');
    if(getSwordLevel()==1){
    alert('스킨 을 검으로 변경이가능합니다(다시 총알로 변경하고싶으면 p 를 누르고 입력하세요[게임에서])')
    }
}
//이벤트1

function toggleStore() {
    let container = document.getElementById('shop-content-container');
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

window.onload = function() {
    changeDisplayMoney(getMoney());

    currentSpeed = getSpeedLevel();
    currentPower = getPowerLevel();
    currenthealth = getHealthLevel();
    currentSword = getSwordLevel();

    // 신속 관련 HTML
    changeDisplaySpeed(currentSpeed);
    document.getElementById('max-speed').textContent = maxSpeed.toString();
    document.getElementById('speed-price').textContent = speedPotionPrice.toString();

    // 힘 관련 HTML
    changeDisplayPower(currentPower);
    document.getElementById('max-power').textContent = maxPower.toString();
    document.getElementById('power-price').textContent = powerPotionPrice.toString();

    // 체력 관련 HTML
    changeDisplayHealth(currenthealth);
    document.getElementById('max-health').textContent = maxHealth.toString();
    document.getElementById('health-price').textContent = healthPotionPrice.toString();

    // 검 관련 HTML
    changeDisplaySword(currentSword);
    document.getElementById('max-sword').textContent = maxSword.toString();
    document.getElementById('sword-price').textContent = swordPrice.toString();

    // 이벤트 핸들러 바인딩
    document.getElementById('shop-button').addEventListener('click', toggleStore);
    document.getElementById('buy-speed-button').addEventListener('click', buySpeed);
    document.getElementById('buy-power-button').addEventListener('click', buyPower);
    document.getElementById('buy-health-button').addEventListener('click', buyHealth);
    document.getElementById('buy-sword-button').addEventListener('click', buySword);
    window.addEventListener('keydown', (event) => {
        if (event.key == 'j' || event.key == 'J') {
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
    
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key == 'ㅗ') {
            this.alert('시크릿 키를 입력했습니다');
            this.alert('초월석 을 얻을려면 S를 눌러 칸막이 상점 으로 들어가 초월석을구입하시면됩니다.');
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key == 'S') {
            let overstone= prompt('칸막이 상점에 오신걸 환영홥니다,물건을구매하시겠습니까?(네/아니요)');
            switch(overstone){
                case '네':
                    alert('값은 공짜입니다');
                    over += 1;
                    alert('구매완료');
                    alert('초월석의양을 알고싶으면 o 를 눌르세요');
                break;
                case'아니요':
                    alert('사고싶을때 다시와주세요');
                break;
                default:
                    alert('알수없는 값을 입력하셨습니다');
                break;
            }
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key == 'o') {
            alert(over);
        }
    });
}