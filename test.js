

const fs = require('fs');
const csv = require('csv-parser');

const axios = require('axios');
const { MASTER_TOKEN } = require('./main/config');


require('dotenv').config();


start()

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