import jsonServer from 'json-server';
import auth from 'json-server-auth';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();

// Aniq manzil orqali routerni yaratamiz
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// 1. Bazani auth bilan bog'laymiz (Bu majburiy qator)
server.db = router.db;

// 2. Default middleware'larni ulaymiz (logger, static va h.k.)
server.use(middlewares);

// 3. JORIDAGI ENGRIDAN KEYIN: JSON tana (body) o'quvchini ulaymiz
// Bu bo'lmasa POST so'rovdagi email va parolni server o'qiy olmaydi
server.use(jsonServer.bodyParser);

// 4. DIQQAT: Auth routerdan doim oldin turishi shart!
server.use(auth); 

// 5. Eng oxirida routerni ulaymiz
server.use(router);

server.listen(4000, () => {
  console.log('Server 4000-portda muvaffaqiyatli kutilmoqda...');
});