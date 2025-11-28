# Объяснение кода проекта "Student Management System"

## Содержание
1. [Общая архитектура проекта](#общая-архитектура-проекта)
2. [Детальное объяснение каждого файла](#детальное-объяснение-каждого-файла)
3. [Ответы на теоретические вопросы](#ответы-на-теоретические-вопросы)

---

## Общая архитектура проекта

Проект представляет собой систему управления студентами, написанную на чистом Node.js без использования внешних библиотек. Код разделен на модули (файлы) по функциональности:

- **Student.js** - класс для представления студента
- **StudentStorage.js** - класс для хранения и управления студентами
- **Logger.js** - класс для логирования с поддержкой разных режимов
- **utils.js** - утилиты для работы с файлами (сохранение/загрузка JSON)
- **index.js** - главный файл, который запускает программу

---

## Детальное объяснение каждого файла

### 1. Student.js - Класс студента

**Назначение:** Этот файл определяет структуру данных для студента.

```javascript
class Student {
  constructor(id, name, age, group) {
    this.id = id;        // Уникальный идентификатор студента
    this.name = name;    // Имя студента
    this.age = age;      // Возраст студента
    this.group = group;  // Группа студента
  }
}
```

**Что происходит:**
- Создается класс `Student` - это шаблон (blueprint) для создания объектов студентов
- Конструктор `constructor()` - это специальный метод, который вызывается при создании нового объекта
- `this.id`, `this.name`, `this.age`, `this.group` - это свойства объекта, которые хранят данные о студенте
- `module.exports = {Student}` - экспортирует класс, чтобы его можно было использовать в других файлах

**Пример использования:**
```javascript
const student = new Student("1", "Иван Иванов", 20, 2);
// Создается объект: { id: "1", name: "Иван Иванов", age: 20, group: 2 }
```

---

### 2. StudentStorage.js - Хранилище студентов

**Назначение:** Класс для управления коллекцией студентов (добавление, удаление, поиск, вычисления).

#### Приватное поле `#students`
```javascript
#students = [
  new Student("1", "John Doe", 21, 2),
  new Student("2", "Jane Doe", 25, 3),
  new Student("3", "Andrei Ramanenka", 24, 3),
];
```
- `#` означает приватное поле - к нему нельзя обратиться извне класса
- Это массив, который хранит всех студентов
- Инициализируется тремя студентами по умолчанию

#### Метод `#getLastId()` (приватный) приватность гарантирует, что ID генерируется только через addStudent(), где есть полный контроль над процессом.
```javascript
#getLastId() {
  if (this.#students.length === 0) return 0;
  const lastId = this.#students[this.#students.length-1].id;
  return Number(lastId);
}
```
**Что делает:**
- Находит ID последнего студента в массиве
- Если массив пустой, возвращает 0
- Преобразует строковый ID в число и возвращает его
- Используется для генерации нового ID при добавлении студента

**Как работает:**
1. Проверяет, есть ли студенты (`length === 0`)
2. Берет последний элемент массива (`[length-1]`)
3. Извлекает его ID и преобразует в число

#### Метод `addStudent(name, age, group)`
```javascript
addStudent(name, age, group) {
  const lastId = this.#getLastId();
  const newId = String(lastId + 1);
  this.#students.push(new Student(newId, name, age, group));
}
```
**Что делает:** Добавляет нового студента в хранилище.

**Пошагово:**
1. Получает ID последнего студента (например, "3")
2. Создает новый ID, увеличивая на 1 (например, "4")
3. Преобразует число обратно в строку (`String()`)
4. Создает новый объект `Student` с этим ID
5. Добавляет его в массив через `push()`

**Пример:**
```javascript
storage.addStudent("Петр", 22, 1);
// Добавится студент с ID "4"
```

#### Метод `removeStudent(id)`
```javascript
removeStudent(id) {
  const student = this.#students.find(student => student.id === id);
  if (!student) {
    throw new Error(`Student with id ${id} not found`);
  }
  this.#students = this.#students.filter(student => student.id !== id);
}
```
**Что делает:** Удаляет студента по ID.

**Пошагово:**
1. Ищет студента с указанным ID через `find()`
2. Если не найден - выбрасывает ошибку (`throw new Error`)
3. Если найден - фильтрует массив, оставляя всех студентов, кроме того, у кого совпадает ID
4. Присваивает отфильтрованный массив обратно в `#students`

**Как работает `filter()`:**
- Проходит по каждому элементу массива
- Возвращает только те элементы, для которых условие `student.id !== id` истинно
- То есть оставляет всех, кроме удаляемого

#### Метод `getStudentById(id)`
```javascript
getStudentById(id) {
  return this.#students.find(s => s.id === id) || null;
}
```
**Что делает:** Находит студента по ID.

**Как работает:**
- `find()` ищет первый элемент массива, для которого условие `s.id === id` истинно
- Если найден - возвращает объект студента
- Если не найден - `find()` возвращает `undefined`, тогда `|| null` преобразует это в `null`

**Пример:**
```javascript
const student = storage.getStudentById("2");
// Вернет объект студента или null
```

#### Метод `getStudentsByGroup(group)`
```javascript
getStudentsByGroup(group) {
  return this.#students.filter(s => s.group === group);
}
```
**Что делает:** Возвращает всех студентов из указанной группы.

**Как работает:**
- `filter()` проходит по всем студентам
- Оставляет только тех, у кого `group` совпадает с переданным значением
- Возвращает массив найденных студентов

**Пример:**
```javascript
const group2Students = storage.getStudentsByGroup(2);
// Вернет массив всех студентов из группы 2
```

#### Метод `getAllStudents()`
```javascript
getAllStudents() {
  return this.#students;
}
```
**Что делает:** Возвращает массив всех студентов.

**Просто возвращает приватное поле `#students`.**

#### Метод `calculateAverageAge()`
```javascript
calculateAverageAge() {
  if (this.#students.length === 0) return 0;
  return this.#students.reduce((acc, student) => acc + student.age, 0) / this.#students.length;
}
```
**Что делает:** Вычисляет средний возраст всех студентов.

**Как работает `reduce()`:**
1. Начальное значение аккумулятора: `0`
2. Для каждого студента: `acc + student.age` (суммирует возрасты)
3. После прохода по всем студентам получаем сумму всех возрастов
4. Делим сумму на количество студентов

**Пример:**
- Студенты: 21, 25, 24 года
- Сумма: 21 + 25 + 24 = 70
- Среднее: 70 / 3 = 23.33

**Защита от деления на ноль:**
- Если массив пустой, возвращает 0

---

### 3. Logger.js - Система логирования

**Назначение:** Класс для вывода сообщений с поддержкой разных режимов (обычный, подробный, тихий).

#### Приватные поля
```javascript
#isVerboseModeEnabled = false;  // Режим подробного вывода
#isQuietModeEnabled = false;    // Режим тишины (без вывода)
static #instance = null;         // Единственный экземпляр класса (Singleton)
```

**Что такое Singleton:**
- Паттерн проектирования, который гарантирует, что класс имеет только один экземпляр
- `static #instance` - это поле класса (не экземпляра), общее для всех
- Используется, чтобы везде в программе был один и тот же логгер

#### Конструктор
```javascript
constructor(verbose = false, quiet = false) {
  this.#isVerboseModeEnabled = verbose;
  this.#isQuietModeEnabled = quiet;
  Logger.#instance = this;
}
```
**Что делает:**
- Принимает два параметра с значениями по умолчанию `false`
- Сохраняет их в приватные поля
- Сохраняет текущий экземпляр в статическое поле `#instance`

#### Статический метод `getLogger()`
```javascript
static getLogger(verbose = false, quiet = false) {
  if (!this.#instance){
    this.#instance = new Logger(verbose, quiet);
  }
  return this.#instance;
}
```
**Что делает:** Создает или возвращает существующий экземпляр логгера.

**Как работает:**
- `static` означает, что метод принадлежит классу, а не экземпляру
- Если экземпляр еще не создан (`!this.#instance`) - создает новый
- Если уже создан - возвращает существующий
- Это гарантирует, что в программе всегда один логгер

**Почему это нужно:**
- Можно вызвать `getLogger()` из любого файла
- Всегда получишь один и тот же экземпляр
- Настройки (verbose/quiet) сохраняются везде

#### Метод `log(...data)`
```javascript
log(...data) {
  if (this.#isQuietModeEnabled){
    return;  // Выходим из функции, ничего не выводим
  }

  // Выводим сообщение
  console.log(...data);

  // Если включен verbose режим - выводим системную информацию
  if (this.#isVerboseModeEnabled) {
    const systemInfo = {
      timestamp: new Date().toISOString(),
      platform: os.platform(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpuModel: os.cpus()[0].model
    };
    console.log("[VERBOSE SYSTEM INFO]", systemInfo);
  }
}
```

**Что делает:** Выводит сообщение в консоль с учетом режима работы.

**Параметр `...data`:**
- `...` - это spread operator (оператор расширения)
- Позволяет передать любое количество аргументов
- Все аргументы собираются в массив `data`

**Логика работы:**
1. **Если quiet режим включен:** сразу выходим, ничего не выводим
2. **Обычный режим:** выводим сообщение через `console.log(...data)`
3. **Если verbose режим включен:** после сообщения выводим системную информацию

**Системная информация (из модуля `os`):**
- `timestamp` - текущее время в формате ISO
- `platform` - операционная система (darwin, win32, linux)
- `totalMemory` - общий объем памяти в байтах
- `freeMemory` - свободная память в байтах
- `cpuModel` - модель процессора (берем первый CPU из массива)

**Примеры работы:**
```javascript
// Обычный режим
logger.log("Привет");  // Выведет: Привет

// Quiet режим
logger.log("Привет");  // Ничего не выведет

// Verbose режим
logger.log("Привет");  
// Выведет:
// Привет
// [VERBOSE SYSTEM INFO] { timestamp: '...', platform: 'darwin', ... }
```

#### Функция `getLogger()`
```javascript
function getLogger(verbose = false, quiet = false) {
  return Logger.getLogger(verbose, quiet);
}
```
**Что делает:** Обертка для удобного вызова статического метода.

**Зачем:** Упрощает использование - можно вызвать функцию вместо `Logger.getLogger()`

---

### 4. utils.js - Утилиты для работы с файлами

**Назначение:** Функции для сохранения и загрузки данных в/из JSON файлов.

#### Функция `saveToJSON(data, filePath)`
```javascript
function saveToJSON(data, filePath) {
  const logger = getLogger();
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, "utf8");
    logger.log("JSON file saved successfully!");
  } catch (err) {
    logger.log("Error writing file:", err);
    throw err;
  }
}
```

**Что делает:** Сохраняет данные в JSON файл.

**Пошагово:**
1. Получает экземпляр логгера
2. **`try-catch`** - конструкция для обработки ошибок
3. **`JSON.stringify(data, null, 2)`**:
   - Преобразует JavaScript объект/массив в JSON строку
   - `null` - функция замены (не используется)
   - `2` - количество пробелов для отступов (красивое форматирование)
4. **`fs.writeFileSync(filePath, jsonData, "utf8")`**:
   - Синхронно записывает данные в файл
   - `filePath` - путь к файлу
   - `jsonData` - данные для записи
   - `"utf8"` - кодировка
5. Если успешно - логирует успех
6. Если ошибка - логирует ошибку и выбрасывает исключение (`throw err`)

**Пример:**
```javascript
const students = [new Student("1", "Иван", 20, 2)];
saveToJSON(students, './students.json');
// Создаст файл students.json с содержимым:
// [
//   {
//     "id": "1",
//     "name": "Иван",
//     "age": 20,
//     "group": 2
//   }
// ]
```

#### Функция `loadJSON(filePath)`
```javascript
function loadJSON(filePath) {
  const logger = getLogger();
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(content);
    
    if (Array.isArray(jsonData)) {
      return jsonData.map(studentData => 
        new Student(studentData.id, studentData.name, studentData.age, studentData.group)
      );
    }
    
    return jsonData;
  } else {
    logger.log("File doesn't exist");
    return null;
  }
}
```

**Что делает:** Загружает данные из JSON файла и преобразует их обратно в объекты Student.

**Пошагово:**
1. Получает экземпляр логгера
2. **`fs.existsSync(filePath)`** - проверяет, существует ли файл
3. Если файл существует:
   - **`fs.readFileSync(filePath, 'utf8')`** - читает содержимое файла
   - **`JSON.parse(content)`** - преобразует JSON строку в JavaScript объект
   - **`Array.isArray(jsonData)`** - проверяет, является ли данные массивом
   - Если массив - преобразует каждый элемент обратно в объект `Student` через `map()`
   - Если не массив - возвращает как есть
4. Если файл не существует - логирует сообщение и возвращает `null`

**Как работает `map()`:**
- Проходит по каждому элементу массива
- Для каждого элемента создает новый объект `Student`
- Возвращает новый массив с объектами `Student`

**Пример:**
```javascript
const students = loadJSON('./students.json');
// Вернет массив объектов Student или null, если файл не существует
```

**Почему нужно преобразовывать обратно в Student:**
- При сохранении в JSON объекты становятся обычными объектами
- При загрузке они не имеют методов класса Student
- Преобразование восстанавливает правильную структуру

---

### 5. index.js - Главный файл программы

**Назначение:** Точка входа программы, которая связывает все модули вместе.

#### Импорт модулей
```javascript
const { getLogger } = require('./Logger');
const { StudentsStorage } = require('./StudentStorage');
const { loadJSON, saveToJSON } = require('./utils');
```
**Что делает:**
- `require()` - функция для импорта модулей в CommonJS
- Импортирует нужные функции и классы из других файлов
- Используется деструктуризация `{ }` для извлечения конкретных экспортов

#### Обработка CLI аргументов
```javascript
const args = process.argv.slice(2);
const isVerbose = args.includes("--verbose");
const isQuiet = args.includes("--quiet");
```
**Что делает:** Читает аргументы командной строки.

**Как работает:**
- `process.argv` - массив аргументов командной строки
  - `process.argv[0]` - путь к Node.js
  - `process.argv[1]` - путь к скрипту
  - `process.argv[2]` и далее - аргументы пользователя
- `slice(2)` - берет все элементы начиная с индекса 2 (пропускает путь к node и скрипту)
- `includes("--verbose")` - проверяет, есть ли аргумент `--verbose` в массиве
- Сохраняет результат в переменные `isVerbose` и `isQuiet`

**Пример:**
```bash
node task/index.js --verbose
# process.argv = ['/path/to/node', '/path/to/index.js', '--verbose']
# args = ['--verbose']
# isVerbose = true
```

#### Инициализация логгера
```javascript
const logger = getLogger(isVerbose, isQuiet);
```
**Что делает:** Создает экземпляр логгера с настройками из CLI аргументов.

#### Создание хранилища студентов
```javascript
const studentsStorage = new StudentsStorage();
```
**Что делает:** Создает новый экземпляр класса `StudentsStorage` с тремя студентами по умолчанию.

#### Демонстрация работы системы
```javascript
logger.log(studentsStorage.getAllStudents());
studentsStorage.addStudent('new', 23, 'new');
logger.log(studentsStorage.getStudentsByGroup(2));
saveToJSON(studentsStorage.getAllStudents(), './students.json');
logger.log(studentsStorage.calculateAverageAge());
logger.log(studentsStorage.getStudentById('5'));
const newStudents = loadJSON('./students.json');
logger.log(newStudents);
studentsStorage.removeStudent('4');
logger.log(studentsStorage.getAllStudents());
```

**Что происходит:**
1. Выводит всех студентов
2. Добавляет нового студента
3. Выводит студентов из группы 2
4. Сохраняет всех студентов в JSON файл
5. Выводит средний возраст
6. Пытается найти студента с ID '5' (вернет null)
7. Загружает студентов из JSON файла
8. Удаляет студента с ID '4'
9. Выводит всех студентов после удаления

**Это демонстрационный код** - показывает работу всех методов системы.

---

## Ответы на теоретические вопросы

### 1. What is Node.js?

**Node.js** - это среда выполнения JavaScript на стороне сервера, построенная на движке V8 от Google Chrome. Позволяет выполнять JavaScript код вне браузера.

**Ключевые особенности:**
- Асинхронный и событийно-ориентированный
- Работает на сервере (не в браузере)
- Использует JavaScript как язык программирования
- Большая экосистема пакетов через npm

**Пример использования:** веб-серверы, API, инструменты командной строки, автоматизация.

---

### 2. What are the benefits of Node.js?

**Преимущества Node.js:**

1. **Один язык для фронтенда и бэкенда** - JavaScript везде
2. **Высокая производительность** - асинхронный I/O, неблокирующие операции
3. **Большая экосистема** - миллионы пакетов в npm
4. **Быстрая разработка** - простота JavaScript, много готовых решений
5. **Масштабируемость** - хорошо подходит для микросервисов
6. **Активное сообщество** - много документации и поддержки

**Недостатки:**
- Не подходит для CPU-интенсивных задач
- Callback hell (решается промисами/async-await)

---

### 3. How libuv and V8 are related to Node.js?

**V8:**
- Движок JavaScript от Google
- Компилирует JavaScript в машинный код
- Используется в Chrome и Node.js
- Отвечает за выполнение JavaScript кода

**libuv:**
- Библиотека для асинхронного I/O
- Управляет файловой системой, сетью, таймерами
- Реализует event loop
- Работает с потоками и процессами

**Связь:**
- Node.js объединяет V8 и libuv
- V8 выполняет JavaScript код
- libuv обеспечивает асинхронные операции
- Вместе они создают среду выполнения Node.js

**Схема:**
```
JavaScript код → V8 (выполнение) → libuv (I/O операции) → Операционная система
```

---

### 4. What are the differences between Node.js and Web Browser?

| Аспект | Node.js | Web Browser |
|--------|---------|-------------|
| **Среда выполнения** | Сервер/CLI | Браузер |
| **Доступ к файловой системе** | ✅ Есть (fs модуль) | ❌ Нет (безопасность) |
| **Доступ к процессам** | ✅ Есть | ❌ Нет |
| **Глобальные объекты** | `global`, `process` | `window`, `document` |
| **Модули** | CommonJS, ESM | ESM, script tags |
| **DOM API** | ❌ Нет | ✅ Есть |
| **Web APIs** | ❌ Нет (fetch доступен в новых версиях) | ✅ Есть |
| **Цель** | Серверные приложения | Интерактивные веб-страницы |

**Основное отличие:** Node.js работает на сервере и имеет доступ к системным ресурсам, браузер работает в песочнице для безопасности пользователя.

---

### 5. What is npm? Why do we need it?

**npm (Node Package Manager)** - менеджер пакетов для Node.js, по умолчанию устанавливается с Node.js.

**Зачем нужен:**

1. **Установка пакетов** - `npm install express` устанавливает библиотеку
2. **Управление зависимостями** - автоматически устанавливает зависимости пакетов
3. **Версионирование** - управляет версиями пакетов
4. **Скрипты** - запуск команд через `npm run`
5. **Публикация пакетов** - можно публиковать свои пакеты

**Основные команды:**
- `npm install` - установить зависимости из package.json
- `npm install <package>` - установить пакет
- `npm init` - создать package.json
- `npm run <script>` - запустить скрипт

**package.json** - файл, который описывает проект и его зависимости.

---

### 6. What are the alternatives to npm?

**Альтернативы npm:**

1. **yarn** - создан Facebook, быстрее npm, lock-файлы
2. **pnpm** - использует симлинки, экономит место на диске
3. **bun** - новый менеджер пакетов, очень быстрый

**Сравнение:**
- **npm** - стандартный, встроен в Node.js
- **yarn** - популярная альтернатива, хорошая производительность
- **pnpm** - эффективное использование дискового пространства
- **bun** - самый быстрый, но новый

Все они работают с package.json и могут устанавливать пакеты из npm реестра.

---

### 7. How can you read arguments which were passed through CLI to your script?

**Чтение CLI аргументов через `process.argv`:**

```javascript
// process.argv - массив аргументов
// [0] - путь к Node.js
// [1] - путь к скрипту
// [2+] - аргументы пользователя

const args = process.argv.slice(2);  // Берем только пользовательские аргументы

// Пример: node script.js --verbose --name=John
// args = ['--verbose', '--name=John']

if (args.includes('--verbose')) {
  // Обработка флага
}

// Или парсинг более сложных аргументов
args.forEach(arg => {
  if (arg.startsWith('--name=')) {
    const name = arg.split('=')[1];
  }
});
```

**Альтернативы:**
- Библиотеки: `commander`, `yargs`, `minimist` - для более сложного парсинга
- Встроенный `process.argv` - для простых случаев

---

### 8. Explain how to work with CommonJS modules. Import/Export.

**CommonJS** - система модулей в Node.js (по умолчанию).

#### Экспорт (Export)

**Экспорт одного значения:**
```javascript
// math.js
function add(a, b) {
  return a + b;
}
module.exports = add;

// Или
module.exports = { add };
```

**Экспорт нескольких значений:**
```javascript
// utils.js
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }

module.exports = {
  add,
  subtract
};
```

**Экспорт класса:**
```javascript
// Student.js
class Student {
  constructor(name) {
    this.name = name;
  }
}
module.exports = { Student };
```

#### Импорт (Import/Require)

**Импорт всего модуля:**
```javascript
const math = require('./math');
math.add(1, 2);
```

**Импорт с деструктуризацией:**
```javascript
const { add, subtract } = require('./utils');
add(1, 2);
```

**Импорт встроенных модулей:**
```javascript
const fs = require('fs');
const os = require('os');
```

**Импорт из node_modules:**
```javascript
const express = require('express');
```

**Ключевые моменты:**
- `module.exports` - экспортирует из модуля
- `require()` - импортирует модуль
- Путь начинается с `./` для локальных файлов
- Модули кэшируются - выполняется только при первом require

---

### 9. Is it possible to execute your `.js` script without calling `node`? If yes - how?

**Да, возможно несколькими способами:**

#### 1. Shebang (Unix/Linux/macOS)
```javascript
#!/usr/bin/env node
// В начале файла

console.log("Hello");
```
Затем сделать файл исполняемым:
```bash
chmod +x script.js
./script.js
```

#### 2. package.json scripts
```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```
Запуск: `npm start`

#### 3. npm link (для CLI инструментов)
Создать исполняемый скрипт в package.json:
```json
{
  "bin": {
    "my-script": "./index.js"
  }
}
```

**Ограничения:**
- На Windows shebang не работает напрямую
- Все равно нужен Node.js установленный
- Это просто удобство, под капотом все равно вызывается `node`

---

### 10. What is the core difference between CommonJS and ESM modules?

**CommonJS (CJS):**
- Синхронная загрузка модулей
- `require()` - динамический импорт
- `module.exports` - экспорт
- По умолчанию в Node.js
- Можно использовать `require()` в любом месте кода

**ESM (ES Modules):**
- Асинхронная загрузка модулей
- `import/export` - статический импорт
- Должен быть в начале файла (top-level)
- Нужно указать `"type": "module"` в package.json
- Стандарт JavaScript (ES6+)

**Примеры:**

**CommonJS:**
```javascript
const fs = require('fs');
module.exports = { myFunction };
```

**ESM:**
```javascript
import fs from 'fs';
export { myFunction };
```

**Ключевые отличия:**
1. **Синтаксис** - `require/module.exports` vs `import/export`
2. **Статический vs динамический** - ESM анализируется до выполнения
3. **Асинхронность** - ESM загружается асинхронно
4. **Совместимость** - ESM современный стандарт, CJS legacy

**В Node.js:** можно использовать оба, но не смешивать в одном файле.

---

### 11. Which functionality provides built-in `fs` module?

**`fs` (File System)** - модуль для работы с файловой системой.

**Основные функции:**

**Чтение файлов:**
- `fs.readFileSync()` - синхронное чтение
- `fs.readFile()` - асинхронное чтение
- `fs.readdirSync()` - чтение директории

**Запись файлов:**
- `fs.writeFileSync()` - синхронная запись
- `fs.writeFile()` - асинхронная запись
- `fs.appendFileSync()` - добавление в конец файла

**Работа с путями:**
- `fs.existsSync()` - проверка существования файла
- `fs.statSync()` - информация о файле
- `fs.mkdirSync()` - создание директории
- `fs.rmdirSync()` - удаление директории

**Примеры:**
```javascript
const fs = require('fs');

// Чтение
const data = fs.readFileSync('file.txt', 'utf8');

// Запись
fs.writeFileSync('file.txt', 'content', 'utf8');

// Проверка существования
if (fs.existsSync('file.txt')) {
  // файл существует
}
```

**Важно:** есть синхронные (блокирующие) и асинхронные (неблокирующие) версии функций.

---

### 12. Which functionality provides built-in `os` module?

**`os` (Operating System)** - модуль для получения информации об операционной системе.

**Основные функции:**

**Информация о системе:**
- `os.platform()` - платформа (darwin, win32, linux)
- `os.arch()` - архитектура процессора (x64, arm64)
- `os.type()` - тип ОС (Darwin, Windows_NT, Linux)
- `os.release()` - версия ОС

**Информация о памяти:**
- `os.totalmem()` - общий объем памяти (байты)
- `os.freemem()` - свободная память (байты)

**Информация о CPU:**
- `os.cpus()` - массив информации о каждом ядре CPU
- `os.cpus()[0].model` - модель процессора

**Информация о сети:**
- `os.networkInterfaces()` - сетевые интерфейсы
- `os.hostname()` - имя хоста

**Пути:**
- `os.homedir()` - домашняя директория
- `os.tmpdir()` - временная директория

**Примеры:**
```javascript
const os = require('os');

console.log(os.platform());      // 'darwin'
console.log(os.totalmem());      // 17179869184 (байты)
console.log(os.freemem());       // 65142784 (байты)
console.log(os.cpus()[0].model); // 'Apple M3'
```

---

### 13. Which functionality provides built-in `path` module?

**`path`** - модуль для работы с путями к файлам и директориям.

**Основные функции:**

**Работа с путями:**
- `path.join()` - объединяет части пути (правильно для ОС)
- `path.resolve()` - преобразует в абсолютный путь
- `path.normalize()` - нормализует путь (убирает `..`, `.`)

**Извлечение частей пути:**
- `path.dirname()` - директория файла
- `path.basename()` - имя файла
- `path.extname()` - расширение файла
- `path.parse()` - разбирает путь на части

**Проверка:**
- `path.isAbsolute()` - проверяет, абсолютный ли путь

**Примеры:**
```javascript
const path = require('path');

// Объединение путей
path.join('/users', 'john', 'file.txt');
// '/users/john/file.txt' (Unix) или '\\users\\john\\file.txt' (Windows)

// Извлечение частей
path.basename('/users/john/file.txt');  // 'file.txt'
path.dirname('/users/john/file.txt');   // '/users/john'
path.extname('/users/john/file.txt');   // '.txt'

// Разбор пути
path.parse('/users/john/file.txt');
// { root: '/', dir: '/users/john', base: 'file.txt', ext: '.txt', name: 'file' }

// Абсолютный путь
path.resolve('file.txt');  // '/current/directory/file.txt'
```

**Зачем нужен:**
- Кросс-платформенность (разные разделители для Windows/Unix)
- Безопасная работа с путями
- Удобное извлечение информации о файлах

---

## Заключение

Этот документ объясняет все аспекты проекта "Student Management System". Код разделен на логические модули, каждый из которых отвечает за свою функциональность. Используются только встроенные модули Node.js без внешних зависимостей, что соответствует требованиям задания.

**Ключевые концепции:**
- Модульность (CommonJS)
- Классы и инкапсуляция
- Работа с файловой системой
- Логирование с разными режимами
- Обработка CLI аргументов
