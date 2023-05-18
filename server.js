// Define 'require'
import module from 'module';
const require = module.createRequire(import.meta.url);

const fs = require('fs/promises');

var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'kaspichessdb',    
    port            : 3306
});

import { Chess } from 'chess.js';

const split = require('./lib/index.umd.cjs').split;

import path from 'path';
import {fileURLToPath} from 'url';
//import { finished } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// helpers
//const parseGames = (string) => parse(string, {startRule: 'games'})
const splitGames = (string) => split(string, {startRule: "games"});

const gamesFilePath = path.resolve(__dirname, './Games.pgn');
fs.readFile(gamesFilePath, 'utf-8')
    .then(async pgnFile=> {
        
        // Separo partidas y las cargos en el array games
        const games = splitGames(pgnFile);

        /*const players = []
        games.forEach((game) => {
            const tags = parse(game.tags, {startRule: 'tags'}).tags
            players.push(tags.White)
            players.push(tags.Black)
        })
        //console.log('Games: ', JSON.stringify(games, null, 2))
        //console.log('Players: ', JSON.stringify(players, null, 2))
        //console.log('Game: ', JSON.stringify(games[0].tags, null, 2))*/
        //console.log('Game: ', games[0].all)        
        
        // Recorro todo el array de partidas        
        for (let i = 0; i < games.length; i++) {

            // Valor del Nodo Padre para la posicion inicial
            let NodoPadre = 0;
            
            // Cargo la partida individual
            let BufferGame = JSON.stringify(games[i].all, null, 2);            

            try{
                const resultSaveGame = await SaveGame(BufferGame);

                //Number de la partida
                console.log('Numero de la partida: ' + resultSaveGame.insertId);

                // Cargo la partida como array
                let aBufferGame = games[i].all;

                const chess1 = new Chess();
                const chess2 = new Chess();
                const startPos = chess2.fen();
                
                chess1.loadPgn(aBufferGame);

                // Cargo las FENS de la partida
                let fens = chess1.history().map(move => {
                    chess2.move(move);
                    return chess2.fen();
                });

                //the above technique will not capture the fen of the starting position.  therefore:
                fens = [startPos, ...fens];

                // Movimientos en formato SAN
                let sans = [];
                for (let i = 0; i < chess1.history().length; i++){
                    sans.push(chess1.history()[i]);
                }

                sans = ['0', ...sans];

                //double checking everything
                //fens.forEach(fen => console.log(fen));  

                // Recorro el array de fens de la partida
                for (let i = 0; i < fens.length; i++) {
                    
                    // Solo las primeras jugadas de la partida se tratan
                    if (i == 5){
                        break;
                    }

                    //console.log(fens[i]);

                    const resultSelectFromTree = await SelectFromTree(fens[i]);

                    // Si no encuentra la FEN, la inserto
                    if (resultSelectFromTree.length == 0){              
                        
                        const resultInsertIntoTree = await InsertIntoTree(NodoPadre,fens[i],sans[i]);

                        // Nuevo Nodo Padre
                        NodoPadre = resultInsertIntoTree.insertId;
                        //console.log('Nodo nuevo' + resultInsertIntoTree.insertId);                                

                    }else{ // Si encuentra la FEN dentro del tree
                        NodoPadre = resultSelectFromTree[0].Nodo;
                        //console.log('Nodo Padre encontrado: ' + resultSelectFromTree[0].Nodo);
                    }

                    // Insertar la referencia de la partida en el nodo
                    await InsertIntoGameRef(resultSaveGame.insertId,NodoPadre);


                } // Fin de recorrer el array de (fens) de la partida

                // Importante Reset Nodo Padre 
                NodoPadre = 0;

            } catch(error){
                console.log(error)
            }

        } // Fin de recorrer todo el array de partidas (games)

    })
    .catch(console.error)

    // Funciones
    async function SelectFromTree(fen){
        return new Promise((resolve, reject)=>{
            pool.query("SELECT * FROM tree WHERE FEN = '" + fen + "'",  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };
    
    async function InsertIntoTree(NodoPadre,FEN,SAN){
        return new Promise((resolve, reject)=>{
            pool.query("INSERT INTO tree (NodoPadre,FEN,SAN) VALUES ('" + NodoPadre + "','" + FEN + "','" + SAN + "')",  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    async function SaveGame(BufferGame){
        return new Promise((resolve, reject)=>{
            pool.query('INSERT INTO games (PGNGame) VALUES (' + BufferGame + ')',  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    async function InsertIntoGameRef(IdGame,Nodo){
        return new Promise((resolve, reject)=>{
            pool.query("INSERT INTO gameref (IdGame,Nodo) VALUES ('" + IdGame + "','" + Nodo + "')",  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };