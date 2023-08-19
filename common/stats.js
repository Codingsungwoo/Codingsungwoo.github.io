export function setMoneyCommon(value) {
    const validatedValue = (value < 0 ? 0 : value);
    window.localStorage.setItem('shootingMoney', validatedValue.toString());
    return validatedValue;
}

// condition ? true-value : false-value

export function getMoney() {
    if (window.localStorage.getItem('shootingMoney') == null) {
        // 돈 초기치를 0으로 설정
        setMoneyCommon(0);
    }
    return Number(window.localStorage.getItem('shootingMoney'));
}

// 속도 능력치
export const maxSpeed = 10;
export const speedPotionPrice = 90000;

export function setSpeedLevelCommon(value) {
    const validatedValue = (value > maxSpeed ? maxSpeed : (value < 0 ? 0 : value));
    window.localStorage.setItem('shootingSpeedLevel', validatedValue.toString());

    return validatedValue;
}

export function getSpeedLevel(value) {
    if (window.localStorage.getItem('shootingSpeedLevel') == null) {
        setSpeedLevelCommon(0);
    }
    return Number(window.localStorage.getItem('shootingSpeedLevel'));
}

// 공격력 능력치
export const maxPower = 30;
export const powerPotionPrice = 60000;

export function setPowerLevelCommon(value) {
    const validatedValue = (value > maxPower ? maxPower : (value < 0 ? 0 : value));
    window.localStorage.setItem('shootingPowerLevel', validatedValue.toString());
    return validatedValue;
}

export function getPowerLevel(value) {
    if (window.localStorage.getItem('shootingPowerLevel') == null) {
        setPowerLevelCommon(0);
    }
    return Number(window.localStorage.getItem('shootingPowerLevel'));
}

// 체력 능력치
export const maxHealth = 10;
export const healthPotionPrice = 60000;

export function setHealthLevelCommon(value) {
    const validatedValue = (value > maxHealth ? maxHealth : (value < 0 ? 0 : value));
    window.localStorage.setItem('shootingHealthLevel', value.toString());
    return validatedValue;
}

export function getHealthLevel(value) {
    if (window.localStorage.getItem('shootingHealthLevel') == null) {
        setHealthLevelCommon(0);
    }
    return Number(window.localStorage.getItem('shootingHealthLevel'));
}
// 무기 능력치
export const maxSword = 5;
export const swordPrice = 500000;

export function setSwordLevelCommon(value) {
    const validatedValue = (value > maxSword+1 ? maxSword+1 : (value < 0 ? 0 : value));
    window.localStorage.setItem('shootingSwordLevel', validatedValue.toString());
    return validatedValue;
}

export function getSwordLevel(value) {
    if (window.localStorage.getItem('shootingSwordLevel') == null) {
        setSwordLevelCommon(0);
    }
    return Number(window.localStorage.getItem('shootingSwordLevel'));
}