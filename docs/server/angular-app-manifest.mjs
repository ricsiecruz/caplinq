
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
    'index.html': {size: 14245, hash: '8278ffebdcbf40642c46c76cadf94146462fd0c01c2f47425e5c7deb9fe6fb9f', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-LHVB35F3.css': {size: 231642, hash: 'ZrexhCQiv/A', text: () => import('./assets-chunks/styles-LHVB35F3_css.mjs').then(m => m.default)}
  },
};
