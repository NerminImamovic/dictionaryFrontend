<template>
  <div class="list row">
      <div class="col-md-6">
        <h4>Words in dictionay:</h4>
        <li class="input-group mb-3">
        <input type="text" id="newSynonymWord" class="form-control" placeholder="Search word"
          v-model="search" @keyup="searchWord" />
        <div class="input-group-append">
          <button class="btn btn-primary" type="button"
            @click="searchWord"
          >
            Search Word
          </button>
        </div>
        </li>
        <ul class="list-group">
          <li class="list-group-item"
            :class="{ active: index == currentIndex }"
            v-for="(word, index) in words"
            :key="index"
            @click="setActiveWord(word, index)"
          >
            {{ word }}
          </li>
        </ul>
          <li class="list-group-item list-group-item-dark"
            :class="{ active : currentIndex == -1 }"
            @click="setNewWord()"
          >
            Add New Words
          </li>
      </div>
      <div class="col-md-6">
        <div v-if="currentWord">
          <br />
            <template v-if="synonyms.length">
              <p><b>{{ currentWord }}</b> synonyms:</p>
              <ul>
                <li 
                  v-for="(synonym, index) in synonyms"
                  :key="index"
                >
                  {{ synonym }}
                </li>
              </ul>
            </template>
            <template v-else>
              <p><b>{{ currentWord }}</b> doesn't have synonyms</p>
            </template>
              <p>Add synonyms for <b>{{ currentWord }}:</b></p>
        </div>
        <div v-else>
          <br />
          <p>Click on word or add new words:</p>
        </div>
      </div>
    <div class="col-md-12">
      <label for="newSynonymWord">Add synonyms separted by coma(,) - It is possible to connect with existing word writing with that word.</label>
      <div class="input-group mb-3">
        <input type="text" id="newSynonymWord" class="form-control" placeholder="Add synonyms separted by coma(,) - It is possible to connect with existing word writing with that word."
          v-model="newSynonymWord" @keyup.enter="addSynonymWords" />
        <div class="input-group-append">
          <button class="btn btn-primary" type="button"
            @click="addSynonymWords"
          >
            Add Synonym(s)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DictionaryService from "../services/dictionaryService";
import dictionaryService from '../services/dictionaryService';

export default {
  name: "dictionary",
  data() {
    return {
      words: [],
      synonyms: [],
      newSynonymWord: "",
      currentWord: null,
      currentIndex: -1,
      search: "",
    };
  },
  methods: {
    // retrieve all words
    async retireveWords() {
        try {
            const response = await DictionaryService.getAllWords();
            this.words = response.data;
        } catch (e) {
            console.log(e);
        }
    },
    // set new word
    setNewWord() {
      this.currentIndex = -1;
      this.currentWord = null;
    },
    // search word
    async searchWord() {
      await this.retireveWords();

      this.words = this.words.filter(word => { return word.includes(this.search) });
      this.currentWord = null;
      this.currentIndex = -1;
    },
    // retrieve synonyms
    async retrieveSynonyms() {
        try {
            const response = 
                await DictionaryService.getSynonyms(this.currentWord);
        
            this.synonyms = response.data;
        
        } catch(e) {
            console.log(e);
        }
    },
    // refresh words
    async refreshWords() {
        await this.retireveWords();
        this.synonyms = [];
        this.search = "";
        this.currentWord = null;
        this.currentIndex = -1;
    },
    // set active word
    async setActiveWord(word, index) {
        this.currentWord = word;
        this.currentIndex = index;
        await this.retrieveSynonyms();
    },
    // add synonym words
    async addSynonymWords() {

      if (this.newSynonymWord.trim() === "") {
        return;
      }

      let words = this.newSynonymWord.split(",");

      words = words.map(word => { return word.trim(); }).filter(word => { return word.trim() !== "" })

      if (this.currentWord) {
        words.unshift(this.currentWord);
      }

      try { 

        await dictionaryService.createSynonyms({ words });
        await this.retireveWords(); 

        const activeWord = words[0];
        const activeIndex = this.words.findIndex((word) => {return word === words[0]});

        await this.setActiveWord(activeWord, activeIndex);
        
      } catch(e) {
          console.log(e);
      }

      this.newSynonymWord = "";
    }
  },
  async mounted() {
    await this.retireveWords();
  }
};
</script>

<style>
.list-group {
  text-align: left;
  max-width: 750px;
  margin: auto;
  max-height: 300px;
  margin-bottom: 10px;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
}

</style>