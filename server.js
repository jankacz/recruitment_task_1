const fs = require("fs");
const express = require("express");
const { withoutArguments, withOnlyFirstArgument, withOnlySecondArgument, withTwoArguments } = require("./functionsSet");

const app = express();

app.listen(3000);

//bez podawania argumentu
app.get("/movies", (req, res) => {
    fs.readFile("./data/db.json", "utf-8", (err, data) => {
        res.send(withoutArguments(data));
    });
});

//po podaniu jakiegokolwiek parametru
app.get("/movies/:arr", (req, res) => {
    let arr = req.params.arr;
    arr = arr.split(',');
    fs.readFile("./data/db.json", "utf-8", (err, data) => {
        if (arr.length == 1) {
            res.send(withOnlyFirstArgument(data, arr[0]));
        } else if (arr.length > 1) {
            if (arr[0] == "") {
                res.send(withOnlySecondArgument(data, arr));
            } else {
                res.send(withTwoArguments(data, arr));
            }
        }
    });
});

//dodawanie nowego filmu
app.post("/movies", (req, res) => {
    fs.readFile("./data/db.json", "utf-8", (err, data) => {
        let query = req.query;
        let flag = true;

        let newMovieObject = {};
        ///////////////////Początek Dodawanie ID//////////////////
        let dataJS = JSON.parse(data);
        let max = 0;
        dataJS.movies.forEach(element => {
            if (max < element.id) max = element.id;
        });
        newMovieObject["id"] = ++max;
        ////////////////////Koniec Dodawanie ID//////////////////

        ///////////Walidacja Danych Required Początek///////////////
        if ("title" in query) {
            if (query.title.length > 255) {
                flag = false;
            } else newMovieObject["title"] = query.title;
        } else flag = false;

        if ("year" in query) {
            let year = query.year;
            if (!(parseInt(year))) {
                flag = false;
            } else newMovieObject["year"] = parseInt(query.year);
        } else flag = false;

        if ("runtime" in query) {
            let runtime = query.runtime;
            if (!(parseInt(runtime))) {
                flag = false;
            } else newMovieObject["runtime"] = parseInt(query.runtime);
        } else flag = false;

        if ("genres" in query) {
            let genresList = query.genres.split(',');
            genresList = genresList.map((currentGenre) => {
                return capitalize(currentGenre);
            });
            if (readGenresFile(data, genresList).length == 0) {
                flag = false;
            } else newMovieObject["genres"] = readGenresFile(data, genresList);
        } else flag = false;

        if ("director" in query) {
            if (query.director.length > 255) {
                flag = false;
            } else newMovieObject["director"] = query.director;
        } else flag = false;
        ///////////Walidacja Danych Required Koniec///////////////

        ///////////Walidacja Danych Optional Początek///////////////
        if ("actors" in query) {
            newMovieObject["actors"] = query.actors;
        }
        if ("plot" in query) {
            newMovieObject["plot"] = query.plot;
        }
        if ("posterUrl" in query) {
            newMovieObject["posterUrl"] = query.posterUrl;
        }
        ///////////Walidacja Danych Optional Koniec///////////////

        ///////////Początek -> Czy dodajemy do bazy?//////////////
        if (flag) {

            let dataJS = JSON.parse(data);
            dataJS.movies.push(newMovieObject);
            fs.writeFile("./data/db.json", JSON.stringify(dataJS), () => {
                res.send(newMovieObject);
            });
        } else {
            res.send("Fail...");
        }
        ///////////Koniec -> Czy dodajemy do bazy?////////////////
    });
});

const readGenresFile = (jsonFile, checkingGenres) => {
    let data = JSON.parse(jsonFile);
    let genres = data.genres;
    let listOfGenres = checkingGenres.filter(currentGenres => {
        return genres.includes(currentGenres);
    });
    listOfGenres = new Set(listOfGenres);
    uniqueListOfGenres = [];
    listOfGenres.forEach(element => {
        uniqueListOfGenres.push(element);
    });
    return uniqueListOfGenres;
}

const capitalize = (word) => {
    let lowLetters = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lowLetters.slice(1);
}

