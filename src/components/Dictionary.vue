<template>
  <div class="list row">
      <div class="col-md-6">
        <h4>Words in dictionay:</h4>
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
            Add New Words...
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
        </div>
        <div v-else>
          <br />
          <p>Click on word or add new words...</p>
        </div>
      </div>
    <div class="col-md-12">
      <label for="newSynonymWord">Add new words separted by coma(,)</label>
      <div class="input-group mb-3">
        <input type="text" id="newSynonymWord" class="form-control" placeholder="Add new words separted by coma(,)"
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
      title: ""
    };
  },
  methods: {

    async retireveWords() {
        try {
            const response = await DictionaryService.getAllWords();
            this.words = response.data;
        } catch (e) {
            console.log(e);
        }
    },

    setNewWord() {
      this.currentIndex = -1;
      this.currentWord = null;
    },

    async retrieveSynonyms() {
        try {
            const response = 
                await DictionaryService.getSynonyms(this.currentWord);
        
            this.synonyms = response.data;

            console.log("Synonyms " + JSON.stringify(this.synonyms));
        
        } catch(e) {
            console.log(e);
        }
    },

    async refreshWords() {
        await this.retireveWords();
        this.synonyms = [];
        this.currentWord = null;
        this.currentIndex = -1;
    },

    async setActiveWord(word, index) {
        this.currentWord = word;
        this.currentIndex = index;
        await this.retrieveSynonyms();
    },

    async addSynonymWords() {

      if (this.newSynonymWord.trim() === "") {
        return;
      }

      let words = this.newSynonymWord.split(",");

      words = words.map(word => { return word.trim(); }).filter(word => { return word.trim() !== "" })

      if (this.currentWord) {
        words.unshift(this.currentWord);
      }

      console.log("Word " + JSON.stringify(words));

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
  mounted() {
    this.retireveWords();
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

@media only screen and (min-height: 800px) {
  .show {
    height: 500px;
  }
}

</style>