const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
var upload = multer()
app.use(bodyParser.json());
app.use(cors())
app.options('*', cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => console.log("listening to it 5000"));

app.get('/test', (req, res) => {
    client.invoke("test", function(err, _res, more) {
        console.log(_res);
    });
})

app.post('/api/v1/finetune', upload.any(), (req, res) => {
    // console.log(req.files);
    let id = genRanHex(6)
    req.files.map((file) => {
        const {fieldname, originalname, mimetype, buffer} = file;
        console.log(fieldname, originalname, mimetype)
        let fileType = getFileType(String(mimetype));
        fse.outputFile(`saves/${id}/raw/${fieldname}/${originalname}`, buffer)
            .then(() => {
                console.log("saved", `saves/${id}/raw/${fieldname}/${originalname.py}`)
                // trigger biofrost
                
            .catch(err => {
                console.log(err)
            })
        })

    
})

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const getFileType = (ft) => {
    return ft.substring(ft.indexOf("/"), ft.length-1);
}


const scheduler = 'https://scheduler-v3.distributed.computer';

async function main() {
  const compute = require('dcp/compute');
  let startTime;

  const job = compute.for(1,10,
    (colour) => {
      const result = n + 100;
      progress('50%');
      result = result * n;
      progress();
      return colour;
    },
  );

  job.on('accepted', (event) => {
    console.log(' - Job accepted by scheduler, waiting for results');
    console.log(` - Job has id ${job.id}`);
    startTime = Date.now();
  });

  job.on('complete', (event) => {
    console.log(
      `Job Finished, total runtime = ${
        Math.round((Date.now() - startTime) / 100) / 10
      }s`,
    );
  });

  job.on('readystatechange', (event) => {
    console.log(`New ready state: ${event}`);
  });
  job.on('status', (event) => {
    console.log('Received status update:', event);
  });
  job.on('console', ({ message }) => {
    console.log('Received console message:', message);
  });
  job.on('result', ({ result, sliceNumber }) => {
    console.log(
      ` - Received result for slice ${sliceNumber} at ${
        Math.round((Date.now() - startTime) / 100) / 10
      }s`,
    );
    console.log(` * Wow! ${result} is such a pretty colour!`);
  });
  job.on('error', (event) => {
    console.error('Received Error:', event);
  });

  job.public.name = 'Events Example - Nodejs';
  job.public.description = 'DCP-Client Example - examples/node/events.js';

  // This is the default behaviour - change if you have multiple bank accounts
  // const wallet = require('dcp/wallet');
  // const ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
  // job.setPaymentAccountKeystore(ks);

  const results = await job.exec(compute.marketValue);
  // OR
  // const results = await job.localExec();

  console.log('Results are: ', results.values());
}

// require('dcp-client')
//   .init(scheduler)
//   .then(main)
//   .finally(() => setImmediate(process.exit));