import { boot } from 'quasar/wrappers';
import langPtBR from 'quasar/lang/pt-BR';

export default boot(({ app }) => {
  app.config.globalProperties.$q.lang.set(langPtBR);
});
