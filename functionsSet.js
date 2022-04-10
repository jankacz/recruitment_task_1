const withoutArguments = (jsonFile) => {
    let new_data = JSON.parse(jsonFile);
    let dlugosc = new_data["movies"].length;
    let losowa = Math.floor(Math.random() * dlugosc + 1);
    let losowy_film = new_data.movies[losowa];
    return losowy_film;
}

const withOnlyFirstArgument = (jsonFile, argument) => {
    let firstArgument = parseInt(argument);
    //Podany argument jest liczba
    if (firstArgument) {
        let new_data = JSON.parse(jsonFile);
        let duration = firstArgument;
        let afterFilterList = new_data.movies.filter((current) => {
            return (current.runtime > duration - 10) && (current.runtime < duration + 10)
        });
        return afterFilterList;
    } else {
        return false;
    }
}

const withOnlySecondArgument = (jsonFile, allArguments) => {
    let new_data = JSON.parse(jsonFile);
    let arrFilms = allArguments.slice(1, allArguments.length);
    let counter = 0;
    let genresCount = {};
    new_data.movies.forEach(element => {
        arrFilms.forEach(current => {
            if (element.genres.includes(current)) {
                counter++;
            }
        });
        if (counter !== 0) {
            if (!(counter.toString() in genresCount)) {
                genresCount[counter.toString()] = [];
            }
            genresCount[counter.toString()].push(element);
        }
        counter = 0;
    });
    let klucze = Object.keys(genresCount);
    let kluczeLiczby = [];
    klucze.forEach(element => {
        kluczeLiczby.push(parseInt(element));
    });
    kluczeLiczby = kluczeLiczby.sort((left, right) => {
        return right - left;
    });
    sortedFilms = [];
    kluczeLiczby.map((currentValue, index, array) => {
        sortedFilms.push(genresCount[currentValue]);
    });
    return sortedFilms;

}

const withTwoArguments = (jsonFile, allArguments) => {
    let newObject = {};
    newObject["movies"] = withOnlyFirstArgument(jsonFile, allArguments[0]);
    return withOnlySecondArgument(JSON.stringify(newObject), allArguments);
}

module.exports = { withoutArguments, withOnlyFirstArgument, withOnlySecondArgument, withTwoArguments };
