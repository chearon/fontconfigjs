const Vue = require("vue/dist/vue.common.dev.js");

const db = [
  "Arimo-Bold.ttf",
  "Arimo-BoldItalic.ttf",
  "Arimo-Italic.ttf",
  "Arimo-Regular.ttf",
  "Cousine-Bold.ttf",
  "Cousine-BoldItalic.ttf",
  "Cousine-Italic.ttf",
  "Cousine-Regular.ttf",
  "NotoSans-Bold.ttf",
  "NotoSans-BoldItalic.ttf",
  "NotoSans-Italic.ttf",
  "NotoSans-Regular.ttf",
  "NotoSansJP-Black.otf",
  "NotoSansJP-Bold.otf",
  "NotoSansJP-Light.otf",
  "NotoSansJP-Medium.otf",
  "NotoSansJP-Regular.otf",
  "NotoSansJP-Thin.otf",
  "Tinos-Bold.ttf",
  "Tinos-BoldItalic.ttf",
  "Tinos-Italic.ttf",
  "Tinos-Regular.ttf"
];

require("fontconfig")("lib.wasm").then(async FontConfigClass => {
  class FontConfig extends FontConfigClass {
    async loadBuffer(filename) {
      return Buffer.from(await fetch(`fonts/${filename}`).then(res => res.arrayBuffer()));
    }
  }

  const cfg = new FontConfig();

  const weights = {
    FC_WEIGHT_THIN: FontConfig.FC_WEIGHT_THIN,
    FC_WEIGHT_EXTRALIGHT: FontConfig.FC_WEIGHT_EXTRALIGHT,
    FC_WEIGHT_ULTRALIGHT: FontConfig.FC_WEIGHT_ULTRALIGHT,
    FC_WEIGHT_LIGHT: FontConfig.FC_WEIGHT_LIGHT,
    FC_WEIGHT_DEMILIGHT: FontConfig.FC_WEIGHT_DEMILIGHT,
    FC_WEIGHT_SEMILIGHT: FontConfig.FC_WEIGHT_SEMILIGHT,
    FC_WEIGHT_BOOK: FontConfig.FC_WEIGHT_BOOK,
    FC_WEIGHT_REGULAR: FontConfig.FC_WEIGHT_REGULAR,
    FC_WEIGHT_NORMAL: FontConfig.FC_WEIGHT_NORMAL,
    FC_WEIGHT_MEDIUM: FontConfig.FC_WEIGHT_MEDIUM,
    FC_WEIGHT_DEMIBOLD: FontConfig.FC_WEIGHT_DEMIBOLD,
    FC_WEIGHT_SEMIBOLD: FontConfig.FC_WEIGHT_SEMIBOLD,
    FC_WEIGHT_BOLD: FontConfig.FC_WEIGHT_BOLD,
    FC_WEIGHT_EXTRABOLD: FontConfig.FC_WEIGHT_EXTRABOLD,
    FC_WEIGHT_ULTRABOLD: FontConfig.FC_WEIGHT_ULTRABOLD,
    FC_WEIGHT_BLACK: FontConfig.FC_WEIGHT_BLACK,
    FC_WEIGHT_HEAVY: FontConfig.FC_WEIGHT_HEAVY,
    FC_WEIGHT_EXTRABLACK: FontConfig.FC_WEIGHT_EXTRABLACK,
    FC_WEIGHT_ULTRABLACK: FontConfig.FC_WEIGHT_ULTRABLACK
  };

  const widths = {
    FC_WIDTH_ULTRACONDENSED: FontConfig.FC_WIDTH_ULTRACONDENSED,
    FC_WIDTH_EXTRACONDENSED: FontConfig.FC_WIDTH_EXTRACONDENSED,
    FC_WIDTH_CONDENSED: FontConfig.FC_WIDTH_CONDENSED,
    FC_WIDTH_SEMICONDENSED: FontConfig.FC_WIDTH_SEMICONDENSED,
    FC_WIDTH_NORMAL: FontConfig.FC_WIDTH_NORMAL,
    FC_WIDTH_SEMIEXPANDED: FontConfig.FC_WIDTH_SEMIEXPANDED,
    FC_WIDTH_EXPANDED: FontConfig.FC_WIDTH_EXPANDED,
    FC_WIDTH_EXTRAEXPANDED: FontConfig.FC_WIDTH_EXTRAEXPANDED,
    FC_WIDTH_ULTRAEXPANDED: FontConfig.FC_WIDTH_ULTRAEXPANDED
  };

  const slants = {
    FC_SLANT_ROMAN: FontConfig.FC_SLANT_ROMAN,
    FC_SLANT_ITALIC: FontConfig.FC_SLANT_ITALIC,
    FC_SLANT_OBLIQUE: FontConfig.FC_SLANT_OBLIQUE
  };

  const vm = new Vue({
    template: `
      <div class="demo">
        <div class="fonts">
          <div class="fonts__font">
            <input
              type="checkbox"
              id="all"
              :disabled="nrqd === db.length"
              :checked="nhas === db.length"
              @input="onReqAll"
            >
            <label for="all">all</label>
          </div>
          <div class="fonts__font" v-for="font in db">
            <input
              type="checkbox"
              :id="font"
              :disabled="rqd[font]"
              :checked="has[font]"
              @input="onInput(font)"
            >
            <label :for="font">{{font}}</label>
          </div>
        </div>

        <p class="summarizer">{{nhas}} loaded into db</p>
        
        <div class="form">
          <label class="form__label">Families</label>
          <input class="form__field" type="text" @input="onSearch" v-model="family1" placeholder="Arimo">

          <label class="form__label"></label>
          <input class="form__field" type="text" @input="onSearch" v-model="family2">

          <label class="form__label"></label>
          <input class="form__field" type="text" @input="onSearch" v-model="family3">

          <label class="form__label">Weight</label>
          <select class="form__field" v-model.number="search.weight" @change="onSearch">
            <option :value="val" v-for="(val, label) in weights">{{label}}</option>
          </select>

          <label class="form__label">Width</label>
          <select class="form__field" v-model.number="search.width" @change="onSearch">
            <option :value="val" v-for="(val, label) in widths">{{label}}</option>
          </select>

          <label class="form__label">Slant</label>
          <select class="form__field" v-model.number="search.slant" @change="onSearch">
            <option :value="val" v-for="(val, label) in slants">{{label}}</option>
          </select>

          <label class="form__label">Language</label>
          <input class="form__field" type="text" @input="onSearch" v-model="search.lang" placeholder="zh-tw">

          <label class="form__label">Coverage</label>
          <input class="form__field" type="text" @input="onSearch" v-model="search.coverage" placeholder="65E5,6B03">
        </div>

        <p class="summarizer">{{results.length}} result{{results.length !== 1 ? 's' : ''}}</p>

        <ol class="results">
          <li v-for="r in results">{{r.file}} [{{r.index}}]</li>
          <li v-if="nhas === 0 && didTrySearch">Load some fonts first!</li>
        </ol>
      </div>
    `,
    created() {
      this.db = db;
      this.weights = weights;
      this.widths = widths;
      this.slants = slants;
    },
    data() {
      const rqd = {};
      const has = {};

      for (const font of db) rqd[font] = has[font] = false;

      return {
        has,
        rqd,
        results: [],
        search: {
          width: FontConfig.FC_WIDTH_NORMAL,
          weight: FontConfig.FC_WEIGHT_NORMAL,
          slant: FontConfig.FC_SLANT_ROMAN,
          lang: "",
          coverage: ""
        },
        didTrySearch: false,
        family1: "",
        family2: "",
        family3: ""
      };
    },
    computed: {
      nhas() {
        let n = 0;
        for (const file of db) if (this.has[file]) n += 1;
        return n;
      },
      nrqd() {
        let n = 0;
        for (const file of db) if (this.rqd[file]) n += 1;
        return n;
      }
    },
    methods: {
      async addFont(filename) {
        this.rqd[filename] = true;
        await cfg.addFont(filename);
        this.has[filename] = true;
      },
      async onInput(font) {
        await this.addFont(font);
        this.onSearch();
      },
      async onReqAll() {
        const fonts = db.slice();
        while (fonts.length) {
          const p = [];
          for (let i = 0; i < 5 && fonts.length; i += 1) {
            const filename = fonts.shift();
            if (!this.has[filename]) p.push(this.addFont(filename));
          }
          await Promise.all(p);
        }
        this.onSearch();
      },
      onSearch() {
        if (this.nhas > 0) {
          const search = Object.assign({}, this.search);
          const families = [this.family1];
          if (this.family2) families.push(this.family2);
          if (this.family3) families.push(this.family3);
          search.family = families;
          search.coverage = search.coverage.split(",").map(s => parseInt(s, 16)).filter(Number.isFinite);
          const cascade = cfg.sort(search);
          this.results = Object.freeze(cascade.matches.slice());
        } else {
          this.results = [];
          this.didTrySearch = true;
        }
      }
    }
  });

  vm.$mount();
  document.body.appendChild(vm.$el);

  window.FontConfig = FontConfig;
  window.cfg = cfg;

  document.addEventListener("dragover", e => {
    e.preventDefault();
  });

  document.addEventListener("drop", async e => {
    for (const file of e.dataTransfer.files) {
      try {
        await cfg.addFont(file);
        db.unshift(file.name);
        Vue.set(vm.rqd, file.name, true);
        Vue.set(vm.has, file.name, true);
      } catch (e) {
        console.error("couldn't load " + file.name, e);
      }
    }
    vm.onSearch();
  });
});

