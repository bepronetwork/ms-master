import fs from 'fs';
import { IS_LOCAL_DEV, IS_TEST } from '../../config';

console.log(IS_LOCAL_DEV)
console.log(IS_TEST)

const FOLDER_NAME = 'test/outputs';

export const writeFile = ({functionName, content}) => {
    /* To output the information to confirm no information leaks happen passphrases and passwords */
    if(IS_LOCAL_DEV && IS_TEST){
        fs.writeFileSync(`${FOLDER_NAME}/${functionName}.json`, JSON.stringify(content));
    }else{
        // To not write in production
    }

}