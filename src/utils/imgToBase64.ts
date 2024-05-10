import * as fs from 'fs';

function imageConvert(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const base64String = data.toString('base64');
                resolve(base64String);
            }
        });
    });
}