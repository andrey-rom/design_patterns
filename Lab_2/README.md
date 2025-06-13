# Geometry Shapes Management System - Lab 2

Система управления геометрическими фигурами с реализацией паттернов проектирования: Repository, Specification, Comparator, Observer, Singleton для хранения и анализа треугольников и кубов.

## 🚀 Запуск приложения

### Точка входа

**Главный файл**: `src/app.ts` - содержит точку входа  
**Демонстрация**: `src/ShapeManagementSystem.ts` - полная демонстрация всех паттернов

### Команды запуска:

```bash
# Разработка (с hot reload)
npm run dev

# Сборка проекта
npm run build

# Запуск скомпилированного приложения
npm start

# Запуск тестов
npm test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с coverage
npm run test:coverage

# Линтинг кода
npm run lint

# Автоматическое исправление ошибок линтинга
npm run lint:fix
```

## 📁 Структура проекта

```
src/
├── app.ts                     # Точка входа приложения
├── ShapeManagementSystem.ts   # Демонстрация всех паттернов
├── entities/                  # Геометрические сущности
│   ├── Shape.ts               # Базовый класс с Observer pattern
│   ├── Triangle.ts            # Треугольник с Observer notifications
│   ├── Cube.ts                # Куб с Observer notifications
│   ├── Point2D.ts             # 2D точка
│   └── Point3D.ts             # 3D точка
├── repositories/              # Repository Pattern
│   └── ShapeRepository.ts     # Хранилище фигур с CRUD операциями
├── specifications/            # Specification Pattern
│   └── ShapeSpecifications.ts # 7 спецификаций для поиска
├── comparators/               # Comparator Pattern
│   └── ShapeComparators.ts    # 9 компараторов для сортировки
├── warehouse/                 # Singleton Pattern + Storage
│   └── Warehouse.ts           # Склад метрик (площади, объемы, периметры)
├── observers/                 # Observer Pattern
│   └── WarehouseObserver.ts   # Наблюдатель для автообновления Warehouse
├── interfaces/                # Интерфейсы
│   ├── IShapeRepository.ts    # Интерфейс репозитория
│   ├── ISpecification.ts      # Интерфейс спецификации
│   ├── IComparator.ts         # Интерфейс компаратора
│   └── IShapeObserver.ts      # Интерфейс наблюдателя
├── factories/                 # Factory Pattern (из Lab 1)
│   ├── ShapeFactory.ts
│   ├── TriangleFactory.ts
│   └── CubeFactory.ts
├── services/                  # Бизнес-логика (из Lab 1)
│   ├── FileReaderService.ts
│   ├── TriangleService.ts
│   └── CubeService.ts
├── validators/                # Валидация (из Lab 1)
│   ├── TriangleValidator.ts
│   └── CubeValidator.ts
├── exceptions/                # Кастомные исключения
│   └── GeometryExceptions.ts
├── utils/                     # Утилиты
│   └── logger.ts              # Логирование
├── constants/                 # Константы
│   └── index.ts
└── tests/                     # Полное тестирование всех паттернов
    └── test.test.ts
```

## 🎯 Описание паттернов и архитектуры

### 📦 Repository Pattern

#### `ShapeRepository`

- **Назначение**: централизованное хранение всех геометрических фигур
- **Методы CRUD**:
  - `add(shape)` - добавление фигуры
  - `remove(id)` - удаление по ID
  - `findById(id)` - поиск по ID
  - `findAll()` - получение всех фигур
  - `exists(id)` - проверка существования
  - `count()` - количество фигур
- **Методы с паттернами**:
  - `findBySpecification(spec)` - поиск по спецификации
  - `sort(comparator)` - сортировка с компаратором

### 🔍 Specification Pattern

#### Реализованные спецификации (7 штук):

1. **`IdSpecification`** - поиск по ID фигуры
2. **`NameSpecification`** - поиск по имени (с частичным совпадением)
3. **`FirstQuadrantSpecification`** - поиск фигур в первом квадранте
4. **`AreaRangeSpecification`** - поиск по диапазону площади
5. **`VolumeRangeSpecification`** - поиск по диапазону объема
6. **`PerimeterRangeSpecification`** - поиск по диапазону периметра
7. **`DistanceFromOriginSpecification`** - поиск по расстоянию от начала координат

```typescript
// Пример использования
const areaSpec = new AreaRangeSpecification(10, 50);
const shapes = repository.findBySpecification(areaSpec);
```

### ⚖️ Comparator Pattern

#### Реализованные компараторы (9 штук):

1. **`IdComparator`** - сортировка по ID
2. **`NameComparator`** - сортировка по имени
3. **`XCoordinateComparator`** - по X-координате первой точки
4. **`YCoordinateComparator`** - по Y-координате первой точки
5. **`ZCoordinateComparator`** - по Z-координате первой точки
6. **`AreaComparator`** - по площади
7. **`PerimeterComparator`** - по периметру
8. **`VolumeComparator`** - по объему
9. **`DistanceFromOriginComparator`** - по расстоянию от начала координат

```typescript
// Пример использования
const sortedByArea = repository.sort(new AreaComparator());
```

### 🏬 Singleton Pattern + Warehouse

#### `Warehouse` (Singleton)

- **Назначение**: централизованное хранение всех вычисленных метрик
- **Структура данных**: `Map<string, ShapeMetrics>`
- **Метрики для каждой фигуры**:
  - `area` - площадь
  - `perimeter` - периметр
  - `volume` - объем (для 3D фигур)
- **Методы**:
  - `getInstance()` - получение единственного экземпляра
  - `updateMetrics(shapeId, metrics)` - обновление метрик
  - `getMetrics(shapeId)` - получение метрик по ID
  - `findByAreaRange(min, max)` - поиск по диапазону площади
  - `findByVolumeRange(min, max)` - поиск по диапазону объема
  - `findByPerimeterRange(min, max)` - поиск по диапазону периметра

### 👁️ Observer Pattern

#### `Shape` (Subject)

- Базовый класс содержит список наблюдателей
- Методы: `addObserver()`, `removeObserver()`, `notifyObservers()`
- Автоматическое уведомление при изменении параметров

#### `WarehouseObserver` (Observer)

- Реагирует на изменения в фигурах
- Автоматически пересчитывает и обновляет метрики в Warehouse

#### `Triangle` / `Cube` (Concrete Subjects)

- Методы изменения: `updatePoints()` / `updateCube()`
- Автоматические уведомления наблюдателей
- Пересчет происходит мгновенно при любом изменении

```typescript
// Пример Observer pattern
const triangle = new Triangle('triangle_1', pointA, pointB, pointC);
const warehouse = Warehouse.getInstance();
const observer = new WarehouseObserver(warehouse);

triangle.addObserver(observer); // Подписка на изменения
triangle.updatePoints(newPointA, newPointB, newPointC); // Автопересчет метрик
```

## 🔄 Алгоритм работы системы

1. **Инициализация**:

   - Создание `ShapeRepository`
   - Получение `Warehouse` (Singleton)
   - Создание `WarehouseObserver`

2. **Создание фигур**:

   - Создание треугольников и кубов
   - Автоматическая подписка на Observer
   - Автоматический расчет метрик в Warehouse

3. **Repository операции**:

   - Добавление/удаление фигур
   - Поиск по ID, проверка существования
   - Получение статистики

4. **Specification поиск**:

   - Поиск по 7 различным критериям
   - Комбинирование спецификаций
   - Фильтрация результатов

5. **Comparator сортировка**:

   - Сортировка по 9 различным критериям
   - Единообразный интерфейс сортировки

6. **Observer автообновление**:
   - Изменение параметров фигур
   - Автоматический пересчет метрик
   - Мгновенное обновление Warehouse

## 📊 Пример демонстрации

### Создание и добавление фигур

```typescript
const triangle = new Triangle('triangle_1', new Point2D(0, 0), new Point2D(3, 0), new Point2D(0, 4));
const cube = new Cube('cube_1', new Point3D(0, 0, 0), 2);

repository.add(triangle);
repository.add(cube);
```

### Поиск с помощью спецификаций

```typescript
// Поиск по площади в диапазоне
const areaSpec = new AreaRangeSpecification(5, 15);
const shapes = repository.findBySpecification(areaSpec);

// Поиск в первом квадранте
const firstQuadrant = new FirstQuadrantSpecification();
const positiveShapes = repository.findBySpecification(firstQuadrant);
```

### Сортировка с помощью компараторов

```typescript
// Сортировка по площади
const sortedByArea = repository.sort(new AreaComparator());

// Сортировка по имени
const sortedByName = repository.sort(new NameComparator());
```

### Observer pattern в действии

```typescript
// Изменение треугольника вызывает пересчет
triangle.updatePoints(new Point2D(0, 0), new Point2D(5, 0), new Point2D(0, 5));
// Метрики автоматически обновляются в Warehouse

// Получение обновленных метрик
const metrics = warehouse.getMetrics('triangle_1');
console.log(`New area: ${metrics.area}`);
```

## 🧪 Тестирование

### Полное покрытие тестами

- ✅ **Repository Pattern**: CRUD операции, спецификации, сортировка
- ✅ **Specification Pattern**: все 7 спецификаций с различными критериями
- ✅ **Comparator Pattern**: все 9 компараторов для сортировки
- ✅ **Singleton Pattern**: единственность экземпляра Warehouse
- ✅ **Observer Pattern**: автоматические уведомления и пересчеты
- ✅ **Entity Classes**: Triangle, Cube с методами изменения
- ✅ **Integration Tests**: взаимодействие всех паттернов

### Философия тестирования

- **Структура Given-When-Then**
- **Изолированное тестирование каждого паттерна**
- **Интеграционные тесты для взаимодействия**
- **Проверка автоматических пересчетов**
- **Тестирование граничных случаев**

## 🎯 Реализованные паттерны проектирования

### ✅ Основные паттерны (из задания):

- **Repository Pattern** - `ShapeRepository` для централизованного хранения
- **Specification Pattern** - 7 спецификаций для различных критериев поиска
- **Comparator Pattern** - 9 компараторов для различных критериев сортировки
- **Singleton Pattern** - `Warehouse` как единственный склад метрик
- **Observer Pattern** - автоматический пересчет при изменении фигур

### ✅ Дополнительные паттерны (из Lab 1):

- **Factory Pattern** - создание фигур из данных
- **Service Layer** - бизнес-логика в отдельных сервисах
- **Strategy Pattern** - различные валидаторы и сервисы

## 📋 Функциональные требования

### ✅ Repository функциональность:

- [x] Сохранение всех геометрических объектов
- [x] Методы добавления и удаления объектов
- [x] Поиск по ID, имени, координатам
- [x] Поиск по диапазонам площади, объема, периметра
- [x] Поиск по расстоянию от начала координат

### ✅ Specification функциональность:

- [x] Поиск по ID - `IdSpecification`
- [x] Поиск по имени - `NameSpecification`
- [x] Поиск по координатам (первый квадрант) - `FirstQuadrantSpecification`
- [x] Поиск по площади в диапазоне - `AreaRangeSpecification`
- [x] Поиск по объему в диапазоне - `VolumeRangeSpecification`
- [x] Поиск по периметру в диапазоне - `PerimeterRangeSpecification`
- [x] Поиск по расстоянию от начала координат - `DistanceFromOriginSpecification`

### ✅ Comparator функциональность:

- [x] Сортировка по ID - `IdComparator`
- [x] Сортировка по имени - `NameComparator`
- [x] Сортировка по координатам X, Y, Z - `XCoordinateComparator`, `YCoordinateComparator`, `ZCoordinateComparator`
- [x] Сортировка по площади - `AreaComparator`
- [x] Сортировка по периметру - `PerimeterComparator`
- [x] Сортировка по объему - `VolumeComparator`
- [x] Сортировка по расстоянию от начала координат - `DistanceFromOriginComparator`

### ✅ Warehouse + Observer функциональность:

- [x] Warehouse как Singleton для хранения метрик
- [x] Хранение площадей, объемов, периметров всех фигур
- [x] Observer pattern для автоматического пересчета
- [x] Любое изменение параметра вызывает пересчет

## 🛠 Технологии

- **TypeScript** - основной язык
- **Node.js** - runtime
- **Jest** - тестирование
- **ESLint** - линтинг кода
- **Pino** - логирование
- **Airbnb** - code style

## 📝 Требования

- Node.js >= 16
- npm >= 8

## 🚦 Статус проекта

✅ Полностью реализованная система управления геометрическими фигурами  
✅ Все 5 требуемых паттернов проектирования реализованы корректно  
✅ 100% покрытие тестами всех паттернов и их взаимодействий  
✅ Автоматический пересчет метрик при изменении параметров фигур  
✅ Полная демонстрация всей функциональности в `ShapeManagementSystem`  
✅ Детальное логирование всех операций и демонстраций
