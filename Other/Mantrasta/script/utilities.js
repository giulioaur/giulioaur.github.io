export function shuffle(array) {
    let shuffledArray = array.map(a => {return {...a}})
    for (let i = shuffledArray.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

export function minIndex(array, minFunctor) {
    if (array.length <= 0)  return -1;

    let minIndex = 0;
    let minElem = minFunctor(array[0]);
    for (let i = 1; i < array.length; ++i) {
        const elem = minFunctor(array[i]);
        if (elem < minElem) {
            minIndex = i;
            minElem = elem;
        }
    }
    return minIndex;
}

export function maxIndex(array, maxFunctor) {
    return minIndex(array, val => -maxFunctor(val));
}

export function makeKebab(str) { 
    return str ? str.toLowerCase().replace(/(\r\n|\n|\r| |;)/gm, "-") : "";
}

export function makeRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}