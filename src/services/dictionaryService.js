import http from "../http-common";

class DictionaryService {

    // Get All words
    getAllWords() {
        return http.get("/dictionary/words");
    }

    // Get synonyms for certain word
    getSynonyms(word) {
        return http.get(`/dictionary/synonyms/${word}`);
    }

    // Create synonyms
    createSynonyms(data) {
        return http.post(`/dictionary/createSynonyms`, data);
    } 

}

export default new DictionaryService();