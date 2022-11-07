

const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require("csv-parse");

const axios = require('axios');
const  MASTER_TOKEN = "f6958c9b-3184-4db0-9810-52762937fb5b"


require('dotenv').config();

const readline = require('readline');


const filePath = 'files/hsys.csv' //files/demodata.csv


read4()


async function read4() {
    const fileStream = fs.createReadStream(filePath, 'utf-8');

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
     // console.log(`Line from file: ${line}`);
      //console.log(`split: ${line.split(",").length}`);
      //console.log(line.split(","));
      const element = line.split(",");
      const f1 = element[0]
      const f2 = element[1]
      const f3 = element[2]
      const f4 = element[3]
      const f5 = element[4]
      const f6 = element[5]
      const f7 = element[6]
      const f8 = element[7]
      const f9 = element[8]
      const f10 = element[9]
      const f11 = element[10]
      const sendData =  {
          f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11
      };
      // console.log("sendData",sendData)
      await postInsertfList(sendData)
    
    }
 };


function read3() {
    const readStream = fs.createReadStream(filePath, 'utf-8');
    readStream.on('error', (error) => console.log("error",error));
    readStream.on('end', () => console.log('end','Reading complete'));
    readStream.on('data', (chunk) => {
        console.log("chunk",chunk)
    });
 };


function read2() {
    const readStream = fs.createReadStream('hsys-copy-all_0.csv', 'utf-8');
    readStream.pipe(parse({ delimiter: ",", from_line: 2 },async function name(err,succ) {
        if(!err && succ.length>0){
            for (let index = 0; index < succ.length; index++) {
                const element = succ[index];
                const f1 = element[0]
                const f2 = element[1]
                const f3 = element[2]
                const f4 = element[3]
                const f5 = element[4]
                const f6 = element[5]
                const f7 = element[6]
                const f8 = element[7]
                const f9 = element[8]
                const f10 = element[9]
                const f11 = element[10]
                const sendData =  {
                    f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11
                };
                // console.log("LOG"+index,element)
                // console.log("sendData",sendData)
                await postInsertfList(sendData)
            }

        }else{
            console.log("ERR read main :",err)
        }
    }))
    readStream.on('error', (error) => console.log("error",error.message));
    readStream.on('end', () => console.log('end','Reading complete'));
 };



 function testApi(params) {
    const sendData =  {
        f1: Date.now(),f2:"Test",f3:"test",f4:"test",f5:"test",f6:"test",f7:"test",f8:"test",f9:"test",f10:"test",f11:"test"
    };
     postInsertfList(sendData)
 }


function read() {
    let data = '';
    const readStream = fs.createReadStream('hsys-copy-all_0.csv', 'utf-8');
    readStream.on('error', (error) => console.log(error.message));
   //readStream.on('data', (chunk) => data += chunk);
    readStream.on('data', (chunk) => {
        console.log("ccssv:",csv(chunk))
    });
    readStream.on('end', () => console.log('Reading complete'));
 };
 


async function start() {
    try {
        let dataList = await rendCsvFile(`hsys-copy-all_0.csv`);

        for (let index = 1; index < dataList.length; index++) {
            const {
                f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11
            } = dataList[index];
          console.log("element",f1)
        }

    } catch (error) {
        console.log("ERR:",error)
    }
}

function postInsertfList(data) {
    const url = 'http://localhost:7102/admin/flist'
   return axios.post(url,data,{ headers: {
        'admintoken': MASTER_TOKEN, 
        'Content-Type': 'application/json'
      }})
}

function rendCsvFile(inputFilePath) {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                return resolve(results)
            });
    });
}