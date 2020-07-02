import http from "../http-common";

class DictionaryService {

    getAllWords() {
        return http.get("/dictionary/words");
    }

    getSynonyms(word) {
        return http.get(`/dictionary/synonyms/${word}`);
    }

    createSynonyms(data) {

        // console.log("Data " + JSON.stringify(data));

        console.log("data" + JSON.stringify(data));

        return http.post(`/dictionary/createSynonyms`, data);
    } 

}

export default new DictionaryService();