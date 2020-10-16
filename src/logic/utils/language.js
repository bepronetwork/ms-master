class Language {
    filterLanguageEN(arrayToMap) {
        let objEN = arrayToMap.find((res)=>res.language.prefix.toUpperCase()=="EN");
        let list = arrayToMap.map((obj)=>{
            let res = (obj.useStandardLanguage == true) ? objEN : obj ;
            return {...res, language: obj.language};
        });
        return list;
    }
}

let LanguageSingleton = new Language();

export {LanguageSingleton}