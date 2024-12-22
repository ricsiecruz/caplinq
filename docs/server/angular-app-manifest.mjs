
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://ricsiecruz.github.io/caplinq/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/https://ricsiecruz.github.io/caplinq"
  }
],
  assets: {
    'index.csr.html': {size: 4959, hash: 'ebc6e26906d424ba1aff111468396788e2798ca73f38c5225befb52b13422edb', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1058, hash: 'b9e67de26227e23c6aa09ca0c21e8efb1855d5686f0281ab9792d5b1b2c19da7', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 14704, hash: '80cba996dcd5ae6163eaf1164d574143e5b442464c31e92fe872cf0abe9f0a5a', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-LHVB35F3.css': {size: 231642, hash: 'ZrexhCQiv/A', text: () => import('./assets-chunks/styles-LHVB35F3_css.mjs').then(m => m.default)}
  },
};
