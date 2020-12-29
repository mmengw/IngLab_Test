const fs = require("fs");
const PDFParser = require("pdf2json");

const files = fs.readdirSync("phoneBill");

let phoneBill = [];

(async () => {
    await Promise.all(files.map(async(file)=>{
        let pdfParser = new PDFParser(this,1);
        pdfParser.loadPDF(`phoneBill/${file}`);
        let phoneBills = await new Promise(async(resolve,reject)=>{
            pdfParser.on("pdfParser_dataReady",(pdfData)=>{
                const raw = pdfParser.getRawTextContent().replace(/\r\n/g," ");
                
                resolve({
                    sentNumber: /Sent\sNumber\s(.*?)Type/i.exec(raw)[1].trim().split(' ',1),
                    amount: /Amount\s(.*?)--/i.exec(raw)[1].trim().split(' ',1)
                });
            });
        });
        phoneBill.push(phoneBills);
    }));

    fs.writeFileSync("phoneBill.json",JSON.stringify(phoneBill,null,2));
})();