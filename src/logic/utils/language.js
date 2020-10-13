class Language {
    filterLanguageEN(arrayToMap) {
        let objEN = arrayToMap.find((res)=>res.language.prefix.toUpperCase()=="EN");
        let list = arrayToMap.map((obj)=>{
            return obj.useStandardLanguage == true ? objEN : obj ;
        });
        return list;
    }
}

let LanguageSingleton = new Language();

export {LanguageSingleton}