module.exports = {
  router: {
    middleware: ['fillStore']
  },
  env: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://127.0.0.1'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: "Accio",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
  ** Global CSS
  */
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/font-awesome"],
  /*
  
  ** Add axios globally
  */
  build: {
    vendor: ["axios"],
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  serverMiddleware: [
    // API middleware
    "~/api/index.js"
  ]
};
