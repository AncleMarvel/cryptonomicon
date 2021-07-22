<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex flex-col">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                @keydown.enter="add"
                type="text"
                @input="ticker = $event.target.value.toUpperCase()"
                name="wallet"
                id="wallet"
                class="
                  block
                  w-full
                  pr-10
                  border-gray-300
                  text-gray-900
                  focus:outline-none focus:ring-gray-500 focus:border-gray-500
                  sm:text-sm
                  rounded-md
                "
                placeholder="Например DOGE"
              />
            </div>
          </div>
          <div class="autocomplete flex max-w-xs justify-around">
            <div
              v-for="autoTicker in autoComplete.splice(0, 4)"
              :key="autoTicker.name"
              @click="add(autoTicker)"
            >
              {{ autoTicker }}
            </div>
          </div>
          <div v-if="hasTickerBeenAdded">
            <p class="text-center max-w-xs text-red-600">
              This ticker has been added
            </p>
          </div>
        </div>
        <button
          @click="add"
          type="button"
          class="
            my-4
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
          "
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div class="flex">
          <button
            v-if="page > 1"
            @click="page -= 1"
            class="
              my-4
              mx-2
              mr-4
              inline-flex
              items-center
              py-2
              px-4
              border border-transparent
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-full
              text-white
              bg-gray-600
              hover:bg-gray-700
              transition-colors
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-gray-500
            "
          >
            Назад
          </button>
          <button
            v-if="hasNextPage"
            @click="page += 1"
            class="
              my-4
              mx-2
              inline-flex
              items-center
              py-2
              px-4
              border border-transparent
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-full
              text-white
              bg-gray-600
              hover:bg-gray-700
              transition-colors
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-gray-500
            "
          >
            Вперед
          </button>
          <div>
            Фильтр:
            <input
              v-model="filter"
              type="text"
              @input="(filter = $event.target.value.toUpperCase()), (page = 1)"
            />
          </div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTickers"
            :key="t.name"
            @click="select(t)"
            :class="{
              'border-4': selectedTicker === t
            }"
            class="
              bg-white
              overflow-hidden
              shadow
              rounded-lg
              border-purple-800 border-solid
              cursor-pointer
            "
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate uppercase">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ t.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="selectedTicker = null"
              @click="handleDelete(t)"
              class="
                flex
                items-center
                justify-center
                font-medium
                w-full
                bg-gray-100
                px-4
                py-4
                sm:px-6
                text-md text-gray-500
                hover:text-gray-600 hover:bg-gray-200 hover:opacity-20
                transition-all
                focus:outline-none
              "
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section v-if="selectedTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8 uppercase">
          {{ selectedTicker.name }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="(bar, idx) in normalizedGraph"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click.stop="selectedTicker = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
// [x] 6. Зависимые данные в состоянии | 5+
// [] 4. Запросы напрямую внутри компонента | 5
// [] 2. При удалении остаётся подписка на загрузку тикера | 5
// [] 5. API error handling | 5
// [] 3. Количество запросов | 4
// [x] 8. При удалении тикера не изменяется локал стор | 4
// [x] 1. dublicated code in Watch | 3
// [] 9. localstorage и анон вкладки | 3
// [] 7. Ugly graph with a lot of prices | 2
// [] 10.Magic string and nums (url, latency, localstorage's key) | 1

// In parallel
// [x] 1. График сломал, если везде одинаковые значения
// [] 2. paginatedTickers' side effect
// [x] 3. При удалении тикера, остаётся выбор
export default {
  name: "App",
  data() {
    return {
      ticker: "",
      filter: "",

      tickers: [],
      graph: [],
      selectedTicker: null,

      apiKey:
        "81b05db8496581d7d2a2f7dee21dc20505c4eb8ed23072e1b9f00cb11f68a664",

      page: 1,
      hasTickerBeenAdded: false
    };
  },

  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) {
      this.filter = windowData.filter;
    }

    if (windowData.page) {
      console.log(this.paginatedTickers.length);
      this.page = windowData.page;
    }

    const tickersData = localStorage.getItem("cryptonomicon-list");
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        this.subscribeToUpdates(ticker.name);
      });
    }
  },

  computed: {
    autoComplete() {
      if (this.ticker === "") {
        return [];
      }
      let result = [];
      let name = this.ticker.toUpperCase();
      const symbolListStr = this.getCoinSymbols();
      const symbolList = symbolListStr.split(",");
      if (symbolListStr.indexOf(name) >= 0) {
        result = symbolList.filter((s) => !s.indexOf(name));
        if (result.length >= 4) {
          result = this.clearDuplicatesInArray(result);
          return result;
        }
      }

      const partnerSymbolStr = this.getCoinPartnerSymbols();
      const partnerSymbols = partnerSymbolStr.split(",");

      if (partnerSymbolStr.indexOf(name) >= 0) {
        partnerSymbols
          .filter((s) => !s.indexOf(name))
          .forEach((el) => result.push(el));
      } else {
        console.log("indexOf(name) returned -1");
        return [];
      }
      result = this.clearDuplicatesInArray(result);
      return result;
    },

    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },

    filteredTickers() {
      return this.tickers.filter((ticker) => ticker.name.includes(this.filter));
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },

  methods: {
    subscribeToUpdates(tickerName) {
      setInterval(async () => {
        const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${this.apiKey}`
        );
        const data = await f.json();
        // currentTicker.price = data.USD; работает только во вью 2
        if (this.tickers.find((t) => t.name === tickerName) && data.USD) {
          this.tickers.find((t) => t.name === tickerName).price =
            data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);
        }

        // может не быть текущего выделенного тикера, и тогда будет ругаться, что name is null
        if (this.selectedTicker?.name === tickerName) {
          this.graph.push(data.USD);
        }
      }, 5000);
    },

    add(t = "") {
      if (t != "") {
        const typeOfT = typeof t;
        if (typeOfT == "string") {
          this.ticker = t;
        }
      }
      this.tickerExistCheck(this.ticker);
      if (this.ticker === "" || this.hasTickerBeenAdded) {
        return false;
      } else {
        const currentTicker = {
          name: this.ticker,
          price: "-"
        };
        this.tickers = [...this.tickers, currentTicker];
        this.filter = "";
        this.subscribeToUpdates(currentTicker.name);
        this.ticker = "";
      }
    },

    select(ticker) {
      this.selectedTicker = ticker;
      this.graph = [];
    },

    handleDelete(tForRemove) {
      this.tickers = this.tickers.filter((t) => tForRemove.name != t.name);
      if (this.selectedTicker === tForRemove) {
        this.selectedTicker = null;
      }
    },

    getJSONfromApi(method) {
      return fetch(method)
        .then((response) => response.json())
        .catch((error) => {
          console.log(error);
        });
    },

    coinListInit() {
      this.getJSONfromApi(
        `https://min-api.cryptocompare.com/data/blockchain/list?api_key=${this.apiKey}`
      ).then((responseJSON) => {
        const coinListStr = JSON.stringify(responseJSON.Data);
        localStorage.setItem("coinList", coinListStr);
      });
    },

    getCoinList() {
      return JSON.parse(localStorage.getItem("coinList"));
    },

    coinSymbolsInit() {
      let coinSymbols = [];
      const coins = this.getCoinList();
      for (let coin in coins) {
        coinSymbols.push(coin);
      }
      localStorage.setItem("coinSymbols", coinSymbols);
    },

    getCoinSymbols() {
      return localStorage.getItem("coinSymbols");
    },

    coinPartnerSymbolsInit() {
      const symbols = this.getCoinSymbols().split(",");
      let partnerSymbols = [];
      symbols.forEach((s) => {
        partnerSymbols.push(this.getCoinList()[s].partner_symbol);
      });
      localStorage.setItem("coinPartnerSymbols", partnerSymbols);
    },

    getCoinPartnerSymbols() {
      return localStorage.getItem("coinPartnerSymbols");
    },

    getCoin(name) {
      const result = this.getCoinList()[name];
      return result;
    },

    tickerExistCheck(tickerName) {
      const doesExistT = this.tickers.filter((t) => t.name === tickerName);
      if (doesExistT.length === 1) {
        this.hasTickerBeenAdded = true;
      } else {
        this.hasTickerBeenAdded = false;
      }
    },

    clearDuplicatesInArray(array) {
      const uniqueSet = new Set(array);
      const result = [...uniqueSet];
      return result;
    }
  },

  watch: {
    selectedTicker() {
      this.graph = [];
    },

    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },

    ticker() {
      this.hasTickerBeenAdded = false;
    }
  },

  mounted() {
    this.coinListInit();
    this.coinSymbolsInit();
    this.coinPartnerSymbolsInit();
  }
};
</script>
