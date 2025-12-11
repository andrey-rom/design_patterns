# Объяснение проекта (Лаба 2) — Asynchronous Programming

## Содержание
- Общая архитектура
- Детальное объяснение файлов
- Как запустить
- Ответы на теоретические вопросы

## Общая архитектура
Проект реализует простую систему управления студентами на Node.js с акцентом на:
- Асинхронный ввод/вывод (fs/promises) для чтения/записи JSON.
- Периодический бэкап массива студентов с защитой от наложения операций.
- EventEmitter для событий по студентам и бэкапу.
- Репортёр, собирающий статистику по созданным бэкапам.

Основные модули:
- `Student.js` — модель студента.
- `StudentsStorage.js` — память + события для CRUD/агрегаций.
- `Logger.js` — единый логгер с режимами quiet/verbose.
- `utils.js` — асинхронные helpers чтения/записи JSON.
- `events.js` — словари имён событий студентов/бэкапов.
- `Backup.js` — класс периодического бэкапа с защитой от гонок.
- `Reporter.js` — сбор статистики по файлам бэкапов.
- `index.js` — точка входа, связывает всё, демонстрирует сценарий.

## Что добавлено/изменено в Лабе 2 (с кодом)

### Асинхронный ввод/вывод (utils.js) — Task 1
```7:46:/2025-nodejs-pr/pr-2/task/utils.js
async function saveToJSON(data, filePath) {
  const jsonData = JSON.stringify(data, null, 2);   // делаем красивый JSON
  await fs.writeFile(filePath, jsonData, 'utf8');   // асинхронно пишем файл
  logger.log(`[IO] saved JSON -> ${filePath}`);     // логируем успешную запись
}

async function loadJSON(filePath) {
  const content = await fs.readFile(filePath, 'utf8'); // асинхронно читаем файл
  const jsonData = JSON.parse(content);                // парсим JSON
  if (Array.isArray(jsonData)) {                       // если массив студентов
    return jsonData.map(                               // восстанавливаем экземпляры Student
      (s) => new Student(s.id, s.name, s.age, s.group)
    );
  }
  return jsonData;                                     // если не массив — возвращаем как есть
}
```
Что сделано: все операции I/O переведены на fs/promises; при чтении массива создаются объекты Student; логируются успех/ошибка.

### События и хранение студентов (StudentsStorage.js) — Task 4 (часть 1)
```5:74:/2025-nodejs-pr/pr-2/task/StudentsStorage.js
class StudentsStorage extends EventEmitter {
  #students = [ ... ];                               // приватное хранилище примеров

  addStudent(name, age, group) {
    const newId = String(this.#getLastId() + 1);     // генерим новый id
    const newStudent = new Student(newId, name, age, group);
    this.#students.push(newStudent);                 // кладём в массив
    this.emit(STUDENT_EVENTS.ADDED, newStudent);     // событие «добавлен»
    return newStudent;
  }

  removeStudent(id) {
    const student = this.#students.find((s) => s.id === id);
    if (!student) {
      const error = new Error(`Student with id ${id} not found`);
      this.emit(STUDENT_EVENTS.REMOVAL_FAILED, id, error); // событие «ошибка удаления»
      throw error;
    }
    this.#students = this.#students.filter((s) => s.id !== id); // удаляем из массива
    this.emit(STUDENT_EVENTS.REMOVED, student);                 // событие «удалён»
    return student;
  }

  getStudentById(id) {
    const student = this.#students.find((s) => s.id === id) || null; // ищем или null
    this.emit(STUDENT_EVENTS.RETRIEVED, { id, student });           // событие «получен»
    return student;
  }

  getStudentsByGroup(group) {
    const students = this.#students.filter((s) => s.group === group); // фильтр по группе
    this.emit(STUDENT_EVENTS.BY_GROUP_RETRIEVED, { group, students }); // событие «получены по группе»
    return students;
  }

  getAllStudents() {
    this.emit(STUDENT_EVENTS.ALL_RETRIEVED, this.#students);      // событие «все получены»
    return this.#students;
  }

  calculateAverageAge() {
    if (this.#students.length === 0) {
      this.emit(STUDENT_EVENTS.AVERAGE_AGE_CALCULATED, 0);        // событие с 0
      return 0;
    }
    const averageAge = this.#students.reduce((acc, s) => acc + s.age, 0) / this.#students.length;
    this.emit(STUDENT_EVENTS.AVERAGE_AGE_CALCULATED, averageAge); // событие со средним
    return averageAge;
  }
}
```
Что сделано: на каждую операцию CRUD/агрегации повешены события для EventEmitter, логика остаётся простой и линейной.

### Словари событий (events.js) — Task 4
```1:27:/2025-nodejs-pr/pr-2/task/events.js
const STUDENT_EVENTS = {
  ADDED: 'studentAdded',                // студент добавлен
  REMOVED: 'studentRemoved',            // студент удалён
  REMOVAL_FAILED: 'studentRemovalFailed', // ошибка удаления
  RETRIEVED: 'studentRetrieved',        // поиск по id
  ALL_RETRIEVED: 'allStudentsRetrieved',// получение всех
  BY_GROUP_RETRIEVED: 'studentsByGroupRetrieved', // по группе
  AVERAGE_AGE_CALCULATED: 'averageAgeCalculated', // средний возраст
};

const BACKUP_EVENTS = {
  STARTED: 'backupStarted',             // бэкап запущен
  STOPPED: 'backupStopped',             // бэкап остановлен
  COMPLETED: 'backupCompleted',         // файл успешно сохранён
  FAILED: 'backupFailed',               // ошибка сохранения
  SKIPPED: 'backupSkipped',             // пропуск из-за pending
  ERROR: 'backupError',                 // критическая ошибка
  ALREADY_RUNNING: 'backupAlreadyRunning', // повторный старт
  NOT_RUNNING: 'backupNotRunning',      // стоп без запуска
  DIRECTORY_ERROR: 'backupDirectoryError', // ошибка каталога
};
```
Что сделано: все имена событий собраны в одном месте, чтобы использовать их и в эмиттерах, и в слушателях без магических строк.

### Периодический бэкап с защитой (Backup.js) — Tasks 2–3–4 (часть 2)
```6:95:/2025-nodejs-pr/pr-2/task/Backup.js
class Backup extends EventEmitter {
  constructor(backupDir = './backups') {
    super();
    this.backupDir = backupDir;     // куда писать бэкапы
    this.interval = null;           // хранение setInterval id
    this.isPending = false;         // флаг «пишется файл»
    this.consecutiveSkips = 0;      // сколько раз подряд пропустили
  }

  async ensureBackupDirectory() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });        // создаём каталог
    } catch (err) {
      this.emit(BACKUP_EVENTS.DIRECTORY_ERROR, { error: err, message: err.message });
      throw err;                                                  // пробрасываем ошибку
    }
  }

  generateBackupFilename() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, -5);
    return `${timestamp}.backup.json`;                            // имя вида YYYY-MM-DD_HH-MM-SS.backup.json
  }

  async saveBackup(students) {
    await this.ensureBackupDirectory();                           // гарантируем каталог
    const filename = this.generateBackupFilename();
    const filePath = path.join(this.backupDir, filename);
    const jsonData = JSON.stringify(students, null, 2);           // форматируем JSON
    await fs.writeFile(filePath, jsonData, 'utf8');               // пишем файл
    this.emit(BACKUP_EVENTS.COMPLETED, { filename, filePath, timestamp: new Date() }); // событие успеха
  }

  start(getStudentsFn, intervalMs = 1000) {
    if (this.interval) {                                         // защита от повторного старта
      this.emit(BACKUP_EVENTS.ALREADY_RUNNING);
      return;
    }
    this.interval = setInterval(async () => {
      if (this.isPending) {                                      // если прошлый бэкап ещё не завершён
        this.consecutiveSkips += 1;
        this.emit(BACKUP_EVENTS.SKIPPED, { skipCount: this.consecutiveSkips, reason: 'Previous backup still pending' });
        if (this.consecutiveSkips >= 3) {                        // 3 раза подряд — считаем ошибкой
          const error = new Error('Backup pending for 3 intervals in a row');
          this.emit(BACKUP_EVENTS.ERROR, { error, message: error.message, skipCount: this.consecutiveSkips });
          this.stop();
          throw error;
        }
        return;
      }
      this.consecutiveSkips = 0;                                 // сбрасываем счётчик
      this.isPending = true;                                     // помечаем как «в работе»
      try {
        const students = getStudentsFn();                        // берём текущие данные
        await this.saveBackup(students);                         // сохраняем
      } catch (err) {
        this.emit(BACKUP_EVENTS.ERROR, { error: err, message: err.message }); // логируем ошибку
      } finally {
        this.isPending = false;                                  // снимаем флаг
      }
    }, intervalMs);
    this.emit(BACKUP_EVENTS.STARTED, { intervalMs });            // событие запуска
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);                              // останавливаем интервал
      this.interval = null;
      this.emit(BACKUP_EVENTS.STOPPED);                          // событие остановки
    } else {
      this.emit(BACKUP_EVENTS.NOT_RUNNING);                      // если не было запущено
    }
  }
}
```
Что сделано: бэкап теперь асинхронный, периодический, с защитой от наложений (skip + ошибка после 3), событийной сигнализацией и безопасной остановкой.

### Репортёр по бэкапам (Reporter.js) — Task 5
```4:139:/2025-nodejs-pr/pr-2/task/Reporter.js
class Reporter {
  async getBackupFiles() {
    const files = await fs.readdir(this.backupDir);              // читаем каталог
    return files.filter((file) => file.endsWith('.backup.json')); // оставляем только бэкапы
  }

  parseTimestampFromFilename(filename) {
    const timestampStr = filename.replace('.backup.json', '');   // убираем суффикс
    const parts = timestampStr.split('_');                       // отделяем дату/время
    if (parts.length !== 2) return null;
    const [datePart, timePart] = parts;
    const timeParts = timePart.split('-');
    if (timeParts.length !== 3) return null;
    return new Date(`${datePart}T${timeParts.join(':')}`);       // собираем ISO и делаем Date
  }

  async generateReport() {
    const backupFiles = await this.getBackupFiles();
    if (backupFiles.length === 0) {                              // если нет файлов — пустая статистика
      return { totalBackupFiles: 0, latestBackupFile: null, latestBackupFileDate: null, studentsById: [], averageStudentsPerFile: 0 };
    }

    const backupData = await Promise.all(
      backupFiles.map(async (filename) => ({
        filename,
        students: Array.isArray(await this.readBackupFile(filename)) ? await this.readBackupFile(filename) : [],
        timestamp: this.parseTimestampFromFilename(filename),
      }))
    );

    backupData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // сортируем: свежий первый
    const latestBackup = backupData[0];

    const studentsByIdMap = new Map();
    backupData.forEach(({ students }) => {
      students.forEach((student) => {
        studentsByIdMap.set(student.id, (studentsByIdMap.get(student.id) || 0) + 1); // считаем вхождения id
      });
    });

    const studentsById = Array.from(studentsByIdMap.entries())
      .map(([id, amount]) => ({ id, amount }))
      .sort((a, b) => (b.amount !== a.amount ? b.amount - a.amount : a.id.localeCompare(b.id)));

    const totalStudents = backupData.reduce((sum, { students }) => sum + students.length, 0);
    const averageStudentsPerFile = Math.round((totalStudents / backupFiles.length) * 100) / 100; // среднее с округлением

    return {
      totalBackupFiles: backupFiles.length,
      latestBackupFile: latestBackup.filename,
      latestBackupFileDate: latestBackup.timestamp ? latestBackup.timestamp.toISOString() : null,
      latestBackupFileReadable: latestBackup.timestamp
        ? latestBackup.timestamp.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
        : null,
      studentsById,
      averageStudentsPerFile,
    };
  }

  async readBackupFile(filename) {
    const filePath = path.join(this.backupDir, filename);
    const content = await fs.readFile(filePath, 'utf8');         // читаем файл
    return JSON.parse(content);                                  // парсим JSON
  }

  async printReport() {
    const report = await this.generateReport();                  // готовим отчёт
    console.log('\n[REPORT] backup statistics');
    console.log(`- files: ${report.totalBackupFiles}`);
    if (report.latestBackupFile) {
      console.log(`- latest: ${report.latestBackupFile}`);
      if (report.latestBackupFileReadable) {
        console.log(`- latest at: ${report.latestBackupFileReadable}`);
      }
    }
    console.log('- students by id (occurrences):', JSON.stringify(report.studentsById));
    console.log(`- avg students/file: ${report.averageStudentsPerFile}`);
    console.log('[REPORT] end\n');
    return report;
  }
}
```
Что сделано: репортёр теперь с пошаговыми комментариями — читает файлы, вытягивает даты из имён, группирует студентов по id, считает среднее и выводит компактный отчёт.

### Точка входа и привязка событий (index.js) — Tasks 1–5 (сборка)
```1:85:/2025-nodejs-pr/pr-2/task/index.js
const logger = getLogger(isVerbose, isQuiet);                    // получаем синглтон-логгер с флагами

function attachStudentEventListeners(storage) {
  storage.on(STUDENT_EVENTS.ADDED,   (s) => logger.log(`[STUDENTS] added id=${s.id} name=${s.name}`));
  storage.on(STUDENT_EVENTS.REMOVED, (s) => logger.log(`[STUDENTS] removed id=${s.id} name=${s.name}`));
  storage.on(STUDENT_EVENTS.REMOVAL_FAILED, (id, err) => logger.log(`[STUDENTS][error] remove id=${id} -> ${err.message}`));
  storage.on(STUDENT_EVENTS.AVERAGE_AGE_CALCULATED, (avg) => logger.log(`[STUDENTS] average age=${avg}`));
}

function attachBackupEventListeners(backup) {
  backup.on(BACKUP_EVENTS.STARTED,   ({ intervalMs }) => logger.log(`[BACKUP] started interval=${intervalMs}ms`));
  backup.on(BACKUP_EVENTS.COMPLETED, ({ filename })   => logger.log(`[BACKUP] completed file=${filename}`));
  backup.on(BACKUP_EVENTS.SKIPPED,   ({ skipCount, reason }) => logger.log(`[BACKUP] skipped #${skipCount} reason=${reason}`));
  backup.on(BACKUP_EVENTS.ERROR,     ({ message, skipCount }) => logger.log(`[BACKUP][error] ${message}${skipCount ? ` skips=${skipCount}` : ''}`));
  backup.on(BACKUP_EVENTS.STOPPED,   () => logger.log('[BACKUP] stopped'));
}

async function main() {
  const storage = new StudentsStorage();                        // создаём хранилище
  attachStudentEventListeners(storage);                         // вешаем слушателей

  storage.addStudent('Alice', 22, 1);                           // демо: добавили
  storage.addStudent('Bob', 24, 2);                             // демо: добавили
  storage.calculateAverageAge();                                // демо: посчитали средний возраст
  storage.removeStudent('2');                                   // демо: удалили одного

  await saveToJSON(storage.getAllStudents(), './students.json'); // сохраняем снимок на диск
  const restored = await loadJSON('./students.json');            // читаем обратно
  logger.log('[IO] restored snapshot count=', Array.isArray(restored) ? restored.length : 0);

  const backup = new Backup('./backups');                        // создаём бэкап-класс
  attachBackupEventListeners(backup);                            // слушаем события бэкапа
  backup.start(() => storage.getAllStudents(), 1000);            // запускаем интервал (1с)

  setTimeout(async () => {                                       // через 4с остановка и отчёт
    backup.stop();
    const reporter = new Reporter('./backups');
    await reporter.printReport();
  }, 4000);
}
```
Что сделано: показан полный цикл с подробными комментариями: работа со storage, async запись/чтение, запуск бэкапа, обработка событий, остановка и печать отчёта.

### Синглтон-логгер (Logger.js) — обновлённые режимы логирования
```4:48:/2025-nodejs-pr/pr-2/task/Logger.js
class Logger {
  static #instance = null;          // держим единственный экземпляр (singleton)
  #isVerboseModeEnabled = false;    // флаг подробного режима
  #isQuietModeEnabled = false;      // флаг «тихий» (не выводить ничего)
  ...
  log(...data) {
    if (this.#isQuietModeEnabled) return;            // тихий режим — выходим
    console.log(...data);                            // основной вывод
    if (this.#isVerboseModeEnabled) {                // если verbose — выводим системные метрики
      const systemInfo = {
        timestamp: new Date().toISOString(),
        platform: os.platform(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuModel: os.cpus()[0].model
      };
      console.log('[VERBOSE SYSTEM INFO]', systemInfo);
    }
  }
}
```
Что происходит: логгер управляется двумя флагами (quiet/verbose); в quiet не печатает, в verbose добавляет системную информацию. Все новые события/отчёты проходят через эту точку, чтобы формат был единым.

## Детальное объяснение файлов

### Student.js (пошагово)
1) Определяется класс `Student` с полями `id`, `name`, `age`, `group`.  
2) В конструктор приходят значения, присваиваются в поля экземпляра.  
3) Экспортируется через `module.exports = { Student };`, чтобы другие файлы могли создавать студентов.

### StudentsStorage.js (пошагово)
1) Наследуется от `EventEmitter`, чтобы эмитить события.  
2) Приватное поле `#students` инициализируется тремя студентами (примерные данные).  
3) Приватный метод `#getLastId()`:
   - Если список пуст — вернуть 0.
   - Берёт `id` последнего студента, приводит к числу, возвращает.  
4) `addStudent(name, age, group)`:
   - Берёт последний id, увеличивает на 1, превращает в строку.
   - Создаёт `Student`, кладёт в массив.
   - Эмитит `STUDENT_EVENTS.ADDED` с новым студентом.
   - Возвращает созданного студента.  
5) `removeStudent(id)`:
   - Ищет студента по id.
   - Если не нашёл — создаёт ошибку, эмитит `REMOVAL_FAILED`, бросает ошибку.
   - Если нашёл — фильтрует массив без этого id, эмитит `REMOVED`, возвращает удалённого.  
6) `getStudentById(id)`:
   - Ищет в массиве, возвращает объект или `null`.
   - Эмитит `RETRIEVED` с `{ id, student }`.  
7) `getStudentsByGroup(group)`:
   - Фильтрует по полю `group`.
   - Эмитит `BY_GROUP_RETRIEVED` с `{ group, students }`.  
8) `getAllStudents()`:
   - Возвращает текущий массив.
   - Эмитит `ALL_RETRIEVED` со всем списком.  
9) `calculateAverageAge()`:
   - Если пусто — эмитит `AVERAGE_AGE_CALCULATED` со значением 0, возвращает 0.
   - Иначе суммирует возраст через reduce, делит на длину.
   - Эмитит событие с посчитанным средним, возвращает его.

### Logger.js (пошагово)
1) Приватные флаги `#isVerboseModeEnabled`, `#isQuietModeEnabled`.  
2) Статическое поле `#instance` реализует синглтон (один логгер на всё приложение).  
3) В конструкторе сохраняются флаги verbose/quiet, экземпляр кладётся в `#instance`.  
4) `static getLogger(verbose=false, quiet=false)`:
   - Если экземпляр не создан — создаёт с заданными флагами.
   - Возвращает единственный экземпляр.  
5) `log(...data)`:
   - Если quiet — ничего не выводит.
   - Иначе выводит сообщение.
   - Если verbose — дополнительно печатает системную информацию (timestamp, платформа, память, CPU).

### utils.js (пошагово)
1) Подключает `fs/promises`, `getLogger`, `Student`.  
2) `saveToJSON(data, filePath)`:
   - Превращает данные в строку JSON с отступами.
   - Асинхронно пишет файл `utf8`.
   - Логирует `[IO] saved JSON -> ...`.
   - Ошибки логирует `[IO][error]` и пробрасывает дальше.  
3) `loadJSON(filePath)`:
   - Асинхронно читает файл `utf8`.
   - Парсит JSON.
   - Если это массив — мапит элементы в экземпляры `Student`.
   - Возвращает распарсенные данные.
   - Если файла нет (ENOENT) — логирует, возвращает `null`.
   - Другие ошибки логируются и пробрасываются.

### events.js (пошагово)
1) Описывает строки-имена событий для студентов (added/removed/.../averageAgeCalculated).  
2) Описывает строки-имена событий для бэкапа (started/stopped/completed/failed/skipped/error/...).
3) Экспортирует оба словаря, чтобы их использовали `StudentsStorage`, `Backup`, `index`.

### Backup.js (пошагово)
1) Наследует `EventEmitter`; хранит `interval`, `backupDir`, флаг `isPending`, счётчик `consecutiveSkips`.  
2) `ensureBackupDirectory()` — создаёт каталог бэкапов (recursive). Ошибка → событие `DIRECTORY_ERROR`, проброс.  
3) `generateBackupFilename()` — формирует имя `YYYY-MM-DD_HH-MM-SS.backup.json` из ISO-строки.  
4) `saveBackup(students)`:
   - Гарантирует наличие каталога.
   - Генерирует имя, путь.
   - Пишет JSON с отступами.
   - Эмитит `COMPLETED` с именем, путём, временем.  
5) `start(getStudentsFn, intervalMs=1000)`:
   - Если уже есть interval — эмитит `ALREADY_RUNNING`, выходим.
   - setInterval:
     - Если `isPending` — инкремент `consecutiveSkips`, эмит `SKIPPED`; если подряд 3 — создаёт ошибку, эмит `ERROR`, вызывает `stop()`, бросает ошибку.
     - Если не pending — сбрасывает счётчик, ставит pending=true, получает студентов из `getStudentsFn()`, вызывает `saveBackup`, ошибки уходят в `ERROR`, в finally pending=false.
   - Эмитит `STARTED`.  
6) `stop()`:
   - Если interval активен — clearInterval, null, эмит `STOPPED`.
   - Иначе эмит `NOT_RUNNING`.

### Reporter.js (пошагово)
1) Принимает путь к каталогу бэкапов, сохраняет в `this.backupDir`.  
2) `parseTimestampFromFilename(name)` — вытаскивает дату из имени файла, возвращает `Date` или `null`.  
3) `getBackupFiles()` — читает каталог, фильтрует `*.backup.json`; если каталога нет — возвращает пустой список.  
4) `readBackupFile(filename)` — читает файл и парсит JSON.  
5) `generateReport()`:
   - Берёт список файлов, если пусто — возвращает объект с нулями.
   - Читает все файлы (Promise.all), парсит студентов, парсит timestamp из имени.
   - Сортирует по дате (самый свежий первый).
   - Считает встречаемость каждого `id` через Map → массив `{id, amount}`, сортировка по количеству и id.
   - Считает среднее число студентов на файл (округление до 2 знаков).
   - Возвращает объект отчёта с полями: число файлов, имя последнего, даты, сгруппированный список, среднее.  
6) `printReport()`:
   - Вызывает `generateReport()`.
   - Печатает компактный блок `[REPORT] ...`.
   - Возвращает отчёт (можно использовать дальше в коде).

### index.js (пошагово)
1) Читает аргументы `--verbose`/`--quiet`, создаёт `logger` с флагами.  
2) Создаёт `StudentsStorage`, вешает слушатели на ключевые события (add/remove/error/average).  
3) Выполняет демонстрационные операции:
   - Добавляет двух студентов.
   - Считает средний возраст.
   - Удаляет одного.
4) Сохраняет текущих студентов в `./students.json` (async), затем грузит назад и логирует размер.  
5) Создаёт `Backup` на `./backups`, вешает слушатели (start/completed/skipped/error/stop), стартует с интервалом 1с.  
6) Через 4 секунды:
   - Останавливает бэкап.
   - Создаёт `Reporter`, печатает отчёт.  
7) Любая фатальная ошибка ловится в `.catch`, логируется и завершает процесс.

## Как запустить
Из каталога `pr-2`:
```bash
node task/index.js
```
С флагами:
```bash
node task/index.js --quiet
node task/index.js --verbose
```
Бэкапы сохраняются в `./backups`, JSON снимок — `./students.json`.

## Ответы на теоретические вопросы
# Вопросы и ответы по асинхронности в JavaScript и Node.js

1. Какой традиционный способ обработки асинхронных операций в JavaScript?
Традиционным способом (до появления Promise и async/await) были колбэки (callbacks). Это функции, которые передаются в качестве аргумента другой функции и вызываются после завершения асинхронной операции.

Проблема: При сложной логике возникает так называемый "Callback Hell" (или "Pyramid of Doom") — сильная вложенность кода, которую трудно читать и поддерживать.

Пример: fs.readFile('file.txt', (err, data) => { ... })

2. Объясните жизненный цикл Promise
У Промиса есть три возможных состояния. Он может переходить из Pending в одно из двух завершенных состояний, но никогда не меняет состояние после завершения (settled).

Pending (Ожидание): Начальное состояние. Операция еще не завершена.

Fulfilled / Resolved (Исполнено): Операция завершилась успешно. Промис возвращает значение (value). Вызывается метод .then().

Rejected (Отклонено): Операция завершилась с ошибкой. Промис возвращает причину ошибки (error). Вызывается метод .catch().

3. Объясните Promise.all()
Этот метод принимает массив (или итерируемый объект) промисов и возвращает новый промис.

Успех: Ждет выполнения всех переданных промисов. Возвращает массив результатов в том же порядке, в котором промисы были переданы.

Ошибка: Если хотя бы один промис будет отклонен (rejected), Promise.all мгновенно отклоняется с этой ошибкой, игнорируя остальные (принцип "всё или ничего").

4. Объясните Promise.allSettled()
Метод принимает массив промисов и ждет завершения всех из них, независимо от результата (успех или ошибка).

Результат: Возвращает массив объектов, описывающих итог каждого промиса:

{ status: 'fulfilled', value: ... }

{ status: 'rejected', reason: ... }

Применение: Полезно, когда нужно запустить несколько независимых задач и получить отчет по каждой, даже если некоторые упали.

5. Объясните Promise.race()
Этот метод запускает "гонку". Он принимает массив промисов и завершается, как только завершится (settled) самый первый из них.

Результат: Повторяет результат (значение или ошибку) того промиса, который "финишировал" первым. Остальные промисы продолжают выполняться, но их результаты игнорируются.

Применение: Тайм-ауты (например, запрос к серверу или ошибка через 5 секунд, что наступит раньше).

6. Объясните Promise.any()
Метод принимает массив промисов и ждет первого успешно выполненного (fulfilled).

Успех: Возвращает значение первого успешного промиса.

Ошибка: Если все переданные промисы были отклонены, возвращает AggregateError (объект, содержащий все ошибки).

Отличие от race: race реагирует на первое изменение состояния (даже ошибку), а any ищет именно первый успех.

7. Что такое Stream? Назовите кейсы использования
Stream (Поток) — это интерфейс для работы с потоковыми данными в Node.js. Это способ обработки данных по частям (chunks), не загружая их целиком в оперативную память.

Основные типы:

Readable: Для чтения (например, fs.createReadStream).

Writable: Для записи (например, fs.createWriteStream).

Duplex: Для чтения и записи (например, TCP-сокеты).

Transform: Разновидность Duplex, где выходные данные вычисляются на основе входных (например, сжатие Gzip).

Кейсы использования:

Чтение/Запись огромных файлов: Файл размером 10 ГБ невозможно загрузить в память целиком, но можно обработать потоком.

Видео/Аудио стриминг: Отдача контента пользователю по мере его загрузки.

HTTP-запросы/ответы: В Node.js req и res являются потоками.

8. Что такое блокирующая операция?
Блокирующая операция (Blocking) — это выполнение кода, при котором поток JavaScript (основной поток) останавливается и ждет завершения операции, прежде чем перейти к следующей строке.

Эффект: Интерфейс браузера "зависает", сервер Node.js перестает принимать новые запросы.

Примеры: fs.readFileSync (в Node.js), alert (в браузере), бесконечный цикл while(true), сложные математические вычисления на CPU.

9. Что такое неблокирующая операция?
Неблокирующая операция (Non-blocking) — операция, которая не останавливает выполнение основного потока. Запрос отправляется, и выполнение кода продолжается, а результат обрабатывается позже (через колбэк, промис или событие).

Эффект: Приложение остается отзывчивым.

Примеры: fetch, setTimeout, fs.readFile, запросы к базе данных.

10. Объясните EventEmitter. Как он работает?
EventEmitter — это класс в Node.js (модуль events), реализующий паттерн Publisher/Subscriber (Наблюдатель).

Как работает:

Вы создаете экземпляр эмиттера.

Подписываетесь на событие с помощью .on('eventName', callback).

Генерируете событие с помощью .emit('eventName', data).

Когда вызывается emit, синхронно выполняются все функции-слушатели, привязанные к этому событию. Это основа архитектуры Node.js (HTTP-сервер, потоки — все наследуются от EventEmitter).

11. Как работает Event Loop в веб-браузерах?
Event Loop (Цикл событий) в браузере координирует выполнение кода, обработку событий и обновление интерфейса. Упрощенная схема:

Call Stack (Стек вызовов): Выполняет синхронный код.

Web APIs: Асинхронные задачи (таймеры, AJAX) делегируются сюда. После завершения они попадают в очереди.

Очередь микрозадач (Microtask Queue): Сюда попадают Promise.then, MutationObserver, queueMicrotask. Имеет наивысший приоритет.

Очередь задач (Task Queue / Macrotasks): Сюда попадают setTimeout, setInterval, события DOM, I/O.

Рендеринг: Браузер пытается перерисовать страницу между выполнением задач.

Алгоритм:

Выполнить весь код в стеке.

Очистить всю очередь микрозадач (если в процессе появляются новые — выполнить и их).

Отрисовать изменения (Render), если нужно.

Взять одну задачу из очереди макрозадач.

Повторить цикл.

12. Как работает Event Loop в Node.js?
В Node.js Event Loop сложнее и основан на библиотеке libuv. Он состоит из нескольких фаз. На каждой фазе есть своя очередь колбэков, которые выполняются до истощения очереди или достижения лимита.

Основные фазы (по порядку):

Timers: Выполняет колбэки setTimeout и setInterval.

Pending Callbacks: Системные операции (например, ошибки TCP).

Idle, Prepare: Внутреннее использование.

Poll: Ожидание новых событий I/O (чтение файлов, сеть). Самая важная фаза.

Check: Здесь выполняется setImmediate().

Close Callbacks: Обработка закрытия (например, socket.on('close')).

Между переходом с одной фазы на другую Node.js проверяет и выполняет очередь process.nextTick и микрозадачи (Promise).

13. Объясните process.nextTick(). В какой момент Event Loop он выполняется?
process.nextTick() — это специфичный для Node.js механизм.

Момент выполнения: Он выполняется сразу после завершения текущей операции, но перед тем, как Event Loop продолжит работу или перейдет к следующей фазе.

У него приоритет выше, чем у Промисов.

Очередь nextTick обрабатывается полностью, что может "заморить голодом" (starve) I/O операции, если рекурсивно вызывать nextTick.

14. Объясните setImmediate(). В какой момент Event Loop он выполняется?
setImmediate() предназначен для выполнения кода после завершения текущей фазы Poll.

Момент выполнения: Колбэк выполняется в фазе Check цикла событий Node.js.

Сравнение с setTimeout(..., 0):

Если они вызваны внутри I/O цикла (например, при чтении файла), setImmediate всегда выполнится раньше, чем setTimeout(..., 0).

В глобальном контексте порядок выполнения зависит от производительности системы и может быть случайным.

Хотите углубиться в какую-то конкретную тему, например, разобрать примеры кода для Promise.any или нюансы фаз Event Loop в Node.js?
