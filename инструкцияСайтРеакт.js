/* 
Создаем папку client и server
Создаем файл index.js
В консоле открываем папку server, набираем npm init -y (создается файл package.json)
Набираем в консоли npm install express pg pg-hstore sequelize cors dotenv (установленные файлы появятся в package.json)
Набираем в консоли npm install -D nodemon (автоматически перезапускает сервер)
Скрипт, который будет запускать приложение в режиме разработки: в файле package.json вместо  
    "test": "echo \"Error: no test specified\" && exit 1" прописываем 
    "dev": "nodemon index.js"
Создание структуры приложения:
    В файле index.js прописываем
        const express = require('express') - через require импортируем express
        const PORT = 5000;
        const app = express();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  -  вызываем функцию callback чтобы слушать ответ от сервера
    В терминале пишем npm run dev  (ответ должен быть "Server started on port 5000").
    Для правильности ведения кода создадим файл в папке server - .env, вносим туда всю конфигурацию. Пропишем в нем:
       PORT = 7000
    Внесем изменения в файл index.js:
        изменим const PORT = 5000; на const PORT = process.env.PORT || 5000;
        добавим в начале файла require('dotenv').config();
Создаем файл db.js в папке server для подключения к базе данных и записываем:
    const {Sequelize} = require('sequelize');
    module.exports = new Sequelize()
Запускаем программу для базы данных pgAdmin 4 (ярлык синий слон). 
    Слева в меню Servers - Базы данных нажимаем правой кнопкой мыши - Создать - База данных - в строку База данных пишем название БД online_store - Сохранить
Возвращаемся к файлу .env и добавляем данные для входа в БД:
    PORT=5000
    DB_NAME=online_store
    DB_USER=postgres
    DB_PASSWORD=svetik199329
    DB_HOST=localhost
    DB_PORT=5432
Переходим в файл db.js и в строку module.exports = new Sequelize() и вставляем данные в ():
    module.exports = new Sequelize(
        process.env.DB_NANE, //название БД
        process.env.DB_USER, //Пользователь
        process.env.DB_PASSWORD,
        {
            dialect: 'postgres', // указываем СУБД которую используем
            host: process.env.DB_HOST,
            port: process.env.DB_PORT
        }
    )
Возвращаемся в index.js и пишем в строке №3 
    const sequelize = require('./db');
в строке №8 пишем асинхронную функцию (при работе с сервером выбираем именно такую функцию) и вставляем в нее app.listen(PORT, () => console.log(`Server started on port ${PORT}`));:
        const start = async () => {
        try {
            await sequelize.authenticate()  //пишем await для асинхронных функций
            await sequelize.sync()
            app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

        } catch (e) {
            console.log(e)
        }
    }
    start();
В консоле должны получить сообщение Executing (default): SELECT 1+1 AS result  - значит к БД удалось подключиться
Построим диаграмму схемы БД на https://app.diagrams.net/ диаграму назову Схема БД
После построения диаграмм в папке server создаем папку models и в ней файл models.js
    В файле models.js пишем:
        const sequelize = require('../db');
        const {DataTypes} = require('sequelize');
        const User = sequelize.define('user', {
             id: {type: DataTypes.INTEGER,    //INTEGER числовой тип данных
                primaryKey: true,            // первичный ключ
                autoIncrement: true          //id будет проставляться последовательно и автоматически при добавлении в БД(1, 2, 3...)
            }
            email: {type: DataTypes.STRING, unique: true,},          //unique - email у пользователя должен быть уникальным
            password: {type: DataTypes.STRING},
            role: {type: DataTypes.STRING, defaultValue: "USER"}     //defaultValue - значение по умолчанию
        })
        const Basket = sequelize.define('basket', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        })
        const BasketDevice = sequelize.define('basket_device', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        })
        const Device = sequelize.define('device', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, unique: true, allowNull: false},
            price: {type: DataTypes.INTEGER, allowNull: false},
            rating: {type: DataTypes.INTEGER, defaultValue: 0},
            img: {type: DataTypes.STRING, allowNull: false},

        })
        const Type = sequelize.define('type', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, unique: true, allowNull: false},              //allowNull: false - не может быть пустым
        })
        const Brand = sequelize.define('brand', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, unique: true, allowNull: false}
        })
        const Rating = sequelize.define('rating', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            rate: {type: DataTypes.INTEGER, allowNull: false}
        })
        const DeviceInfo = sequelize.define('device_info', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            title: {type: DataTypes.STRING, allowNull: false},
            description: {type: DataTypes.STRING, allowNull: false},
        })
    В этом же файле опишем как модели связаны мужду собой (зависимость) и пишем:
        const TypeBrand = sequelize.define('type_brand', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        })
        User.hasOne(Basket)      //User имеет одну корзину
        Basket.belongsTo(User)

        User.hasMany(Rating)
        Rating.belongsTo(User)

        Basket.hasMany(BasketDevice)
        BasketDevice.belongsTo(Basket)

        Type.hasMany(Device)
        Device.belongsTo(Type)

        Brand.hasMany(Device)
        Device.belongsTo(Brand)

        Device.hasMany(Rating)
        Rating.belongsTo(Device)

        Device.hasMany(BasketDevice)
        BasketDevice.belongsTo(Device)

        Device.hasMany(DeviceInfo) 
        DeviceInfo.belongsTo(Device)

        Type.belongsToMany(Brand, {through: TypeBrand})
        Brand.belongsToMany(Type, {through: TypeBrand})
    Делаем экспорт из файла:
        module.exports = {
            User,
            Basket,
            BasketDevice,
            Device,
            Type,
            Brand,
            Rating,
            TypeBrand,
            DeviceInfo
        }
    Переходим в файл index.js и импортируем модели в строку №4
        const models = require('./models/models');  
    сохраняем и в консоле прописывается добавление таблиц в БД автоматически согласно прописанных моделей благодаря sequelize
    Можно проверить в pgAdmin, раскрываем online_store - Схемы - Таблицы (правой кнопкой мыши - обновить) и скобках указано сколько есть таблиц
Настроим corse чтобы отправлять запросы с браузера, для этого добавим в файл index.js в строку №5:
        const cors = require('cors');
    и в строку №9:
        app.use(cors());
        app.use(express.json())
    Пробуем создать первый GET  метод в строку №11
        app.get('/', (req, res) => {
            res.status(200).json({message: 'WORKING!!'})
        })
    Для проверки запросов будем использовать программу Postman
    В строку запроса выбираем метод GET и вводим адрес
        http://localhost:5000
    нажимаем Send и получаем то же самое сообщение.
    В файле index.js убираем так как код использовали для проверки GET-запроса:
        app.get('/', (req, res) => {
            res.status(200).json({message: 'WORKING!!'})
        })
Теперь зададим каркас нашего приложения. Начнем с маршрутов по которым будут отрабатывать методы - в папке server создадим папку router в которой создаем файлы: 
    index.js, 
    brandRouter.js,
    deviceRouter.js, 
    typeRouter.js,
    userRouter.js,
В папке routes в файл index.js записываем:
        const Router = require('express');
        const router = new Router();

        router.use('/user',)
        router.use('/type',)
        router.use('/brand',)
        router.use('/device',)

        module.exports = router;
    В brandRouter.js и typeRouter.js вносим:
        const Router = require('express');
        const router = new Router();

        router.post('/',) //добавлять бренды (типы)
        router.get('/',)  //получать все бренды (типы)
        //Нужно добавить еще delete

        module.exports = router;
    В файл userRouter.js вносим:
        const Router = require('express');
        const router = new Router();

        router.post('/registration',) 
        router.post('/login',)  
        router.get('/auth',)  

        module.exports = router;
    В файл deviceRouter.js вносим:
        const Router = require('express');
        const router = new Router();

        router.post('/',) 
        router.get('/',)  
        router.get('/:id',)  //получать один конкретный девайс

        module.exports = router;
    В папке routes в файл index.js добавляем созданные роутеры в строку №3:
        const deviceRouter = require('./deviceRouter');
        const userRouter = require('./userRouter');
        const brandRouter = require('./brandRouter');
        const typeRouter = require('./typeRouter');
    и добавляем маршруты к созданным ранее роутерам в index.js
        router.use('/user', userRouter)
        router.use('/type', typeRouter)
        router.use('/brand', brandRouter)
        router.use('/device', deviceRouter)
    В основной файл index.js в папке server подключаем созданные роутеры в строке №6:
        const router = require('./routes/index')
    и в строку №12:
        app.use('/api', router);
    Чтобы проверить работу роутера перейдем в файл userRouter.js и добавим к router.get('/auth',) функцию call back:
        router.get('/auth', (req, res) => {
            res.json({message: 'ALL WORKING'})
        }) 
    а в браузере в строку и переходим по url - http://localhost:5000/api/user/authl, должно быть сообщение: {"message":"ALL WORKING"}. Значит все работает.
    Удаляем проверочный код и оставляем:
        router.get('/auth',)
В папке server создаем папку controller и в ней файл userController.js
        class UserController {
            async registration(req, res) {
            }
            async login(req, res) {
            }
            async check(req, res) { //проверка авторизован пользователь или нет
            }
        }
        module.exports = new UserController();
    В файл userRouter.js добавляем созданный контроллер в строку №3:
        const userController = require('../controllers/userController');
    и роутерам передаем второй параметр:
        router.post('/registration', userController.registration) 
        router.post('/login', userController.login)  
        router.get('/auth', userController.check)  
    То же самое делаем с brandController.js:
        class BrandController {
            async create(req, res) {
            }
            async getAll(req, res) {
            }
        }
        module.exports = new BrandController();
            В файл brandRouter.js вносим в стоку №3:
                const brandController = require('../controllers/brandController');
            Встроку №5 и 6 дописываем к router.post('/',) и router.get('/',):
                router.post('/', brandController.create) //добавлять типы
                router.get('/', brandController.getAll) 
    В typeController.js вносим:
        class TypeController {
            async create(req, res) {
            }
            async getAll(req, res) {
            }
        }
        module.exports = new TypeController();
            В файл typeRouter.js вносим в стоку №3:
                const typeController = require('../controllers/typeController');
            Встроку №5 и 6 дописываем к router.post('/',) и router.get('/',):
                router.post('/', typeController.create) //добавлять типы
                router.get('/', typeController.getAll) 

    В deviceController.js вносим
        class DeviceController {
            async create(req, res) {
            }
            async getAll(req, res) {
            }
            async getOne(req, res) {  //чтобы получать по id один конкретный девайс
            }
        }
        module.exports = new DeviceController();
            В файл deviceRouter.js вносим в стоку №3:
                const deviceController = require('../controllers/deviceController');
            Встроку №5 и 6 дописываем к router.post('/',) и router.get('/',):
                router.post('/', deviceController.create) //добавлять типы
                router.get('/', deviceController.getAll) 
                router.get('/:id', deviceController.getOne)  //получать один конкретный девайс

В папке server добавим папку error и файл ApiError.js для отображения ошибки:
        class ApiError extends Error{
            constructor(status, message) {
                super();   // вызываем родительский конструктор
                this.status = status;
                this.message = message;
            }

            static badRequest(message) { //статические функции - это функции которые можно вызывать без создания объекта, можем обращаться напрямую к классу
                return new ApiError(404, message)
            }

            static internel(message) {
                return new ApiError(500, message)
            }

            static forbiden(message) { //если нет доступа
                return new ApiError(403, message)
            }
        }
        module.exports = ApiError;
Создаем папку middleware и файл ErrorHandlingMiddleware.js запишем:
        const ApiError = require('../error/ApiError');
        module.exports = function (err, req, res, next) {
            if (err instanceof ApiError) {
                return res.status(err.status).json({message: err.message})
            }
            return res.status(500).json({message: "Непредвиденная ошибка!"})
        }
    В файл index.js подключаем файл ErrorHandlingMiddleware.js в строку №7:
        const errorHandler = require('./middleware/ErrorHandlingMiddleware');
    в строку №15:
        app.use(errorHandler); //обязательно должен быть в конце всех приложений use для регистрации ошибки. На нем работа прекращается
    Для проверки отображения ошибки в файл userController.js в async check(req, res, next) {} добавим:
        async check(req, res, next) { //проверка авторизован пользователь или нет
            const {id} = req.query
            if (!id) {
                return next(ApiError.badRequest('Не задан ID'))
            }
            res.json(id); 
        }
    и в самом начале файла подключим ApiError:
        const ApiError = require('../error/ApiError'); 
    сохраняем. В Браузире в строку запроса вводим http://localhost:5000/api/user/auth и должно отобразить ошибку {"message":"Не задан ID"}
Переходим к добавлению в БД данных. Начнем с типов. Переходим в файл typeController.js В первую строку вносим:
            const {Type} = require('../models/models');
            const ApiError = require('../error/ApiError');
    в async create(req, res) {} добавляем:
        async create(req, res) {
            const {name} = req.body;
            const type = await Type.create({name});
            return res.json(type);
        }
    Переходим в Postman чтобы протестировать. Указываем url: http://localhost:5000/api/type, метод - POST, выбираем вкладку body - raw и вместо text выбираем JSON
        в окно ввода пишем:
            {
                "name": "Холодильники"
            }
        и нажимаем Send. Ниже в консоле должно быть сообщение:
            {
                "id": 1,
                "name": "Холодильники",
                "updatedAt": "2022-04-08T18:44:11.327Z",
                "createdAt": "2022-04-08T18:44:11.327Z"
            }
        делаем запрос:
            {
                "name": "Смартфоны"
            }
        и получаем:
            {
                "id": 2,
                "name": "Смартфоны",
                "updatedAt": "2022-04-08T18:44:11.327Z",
                "createdAt": "2022-04-08T18:44:11.327Z"
            }
        Чтобы увидеть дабавленные типы переходим в pgAdmin - находим свою БД - таблицы - провой кнопкой на types - Просмотр/ред.данных - Все строки.
        В результате увидем добавленные типы.
    Создавать получилось, теперь будем получать. Переходим в файл typeController.js и в async getAll(req, res) {} добавляем:
        async getAll(req, res) {
            const types = await Type.findAll()
            return res.json(types)
        }     
    Дублируем в другие файлы. В brandController.js в начале файла вносим:
        const {Brand} = require('../models/models');
        const ApiError = require('../error/ApiError');
    и в async async create(req, res) {} и getAll(req, res) {} вносим:
        async create(req, res) {
            const {name} = req.body;
            const brand = await Brand.create({name});
            return res.json(brand);
        }
        async getAll(req, res) {
            const brand = await Brand.findAll()
            return res.json(brand)
        }
            Проверяем. Переходим в Postman чтобы протестировать. Указываем url: http://localhost:5000/api/brand, метод - POST, выбираем вкладку body - raw и вместо text выбираем JSON
                в окно ввода пишем:
                    {
                        "name": "Samsung"
                    }
                и нажимаем Send. Ниже в консоле должно быть сообщение:
                    {
                        "id": 1,
                        "name": "Samsung",
                        "updatedAt": "2022-04-08T18:44:11.327Z",
                        "createdAt": "2022-04-08T18:44:11.327Z"
                    }
                делаем запрос:
                    {
                        "name": "Apple"
                    }
                и получаем:
                    {
                        "id": 2,
                        "name": "Apple",
                        "updatedAt": "2022-04-08T18:44:11.327Z",
                        "createdAt": "2022-04-08T18:44:11.327Z"
                    }
                Чтобы увидеть дабавленные бренды переходим в pgAdmin - находим свою БД - таблицы - провой кнопкой на types - Просмотр/ред.данных - Все строки.
                В результате увидем добавленные бренды.
    Переходим в файл deviceController.js в начале файла вносим:
            const {Device} = require('../models/models');
            const ApiError = require('../error/ApiError');
        и в async async create(req, res) {} и getAll(req, res) {} и async getOne(req, res) {} вносим:
            async create(req, res, next) {
                try {
                    let {name, price, brandId, typeId, info} = req.body
                    const {img} = req.files
                    let fileName = uuid.v4() + ".jpg"
                    img.mv(path.resolve(__dirname, '..', 'static', fileName))
                    const device = await Device.create({name, price, brandId, typeId, img: fileName});

                    return res.json(device)
                } catch (e) {
                    next(ApiError.badRequest(e.message))
                }
            }

        В добавление девайсов мы указали добавление файлов и для этого в кансоле нужно установить пакет. В консоле переходим в папку server и вводим npm i express-fileupload
        В index.js добавляем в строку №6:
            const fileUpload = require('express-fileupload');
        и в строку №15 добавим:
            app.use(fileUpload({}));
        Для создания уникального имени файла установим в терминале пакет npm i uuid
        после в начале файла deviceController.js добавляем установленный пакет:
            const uuid = require('uuid');
        В папке server добавим папку static, внее будем добавлять все файлы а потом научим сервер отдавать эти файлы и подключаем ее в файле deviceController.js в строке №2:
            const path = require('path');

            Проверяем. Переходим в Postman чтобы протестировать. Указываем url: http://localhost:5000/api/device, метод - POST, выбираем вкладку body - form-data
                в окно ввода KEY пишем - name, VALUE - 12 pro, следующая строка:
                    KEY - price, VALUE - 40000,
                    KEY - brandId, VALUE - 2,  //Apple  под ID 2
                    KEY - typeId, VALUE - 2,  //Смартфон  под ID 2
                    KEY - img (выбираем File), VALUE - вибираем какой именно файл,
                и нажимаем Send. Ниже в консоле должно быть сообщение:
                    {
                        "rating": 0,
                        "id": 1,
                        "name": "12 pro",
                        "price": 40000,
                        "brandId": 2,
                        "typeId": 2,
                        "img": "6bfb94f9-7532-4c96-95a2-63fbc405848b.jpg",
                        "updatedAt": "2022-04-10T16:55:33.946Z",
                        "createdAt": "2022-04-10T16:55:33.946Z"
                    }
                    Добавим еще девайс для поиска. 
                        в окно ввода KEY пишем - name, VALUE - note 15 следующая строка:
                        KEY - price, VALUE - 30000,
                        KEY - brandId, VALUE - 1,  //Samsung  под ID 2
                        KEY - typeId, VALUE - 2,  //Смартфон  под ID 2
                        KEY - img (выбираем File), VALUE - вибираем какой именно файл,
                        и нажимаем Send. Ниже в консоле должно быть сообщение:
                        {
                            "rating": 0,
                            "id": 2,
                            "name": "note 15",
                            "price": 30000,
                            "brandId": 1,
                            "typeId": 2,
                            "img": "6bfb94f9-7532-4c96-95a2-63fbc405848b.jpg",
                            "updatedAt": "2022-04-10T16:55:33.946Z",
                            "createdAt": "2022-04-10T16:55:33.946Z"
                        }
                Чтобы увидеть дабавленные девайсы выбираем метод GET и нажимаем Send. 

        При вводе в строку браузера url: http://localhost:5000/название картинки у нас выводит ошибку. Нужно в index.js в строку №9 ввести:
            const path = require('path')
        а в строку №16 добавить:
            app.use(express.static(path.resolve(__dirname, 'static')))
    Возвращаемся к файлу deviceController.js чтобы реализовать получение всех девайсов, добавляем в async getAll(req, res) {} код:
            async getAll(req, res) {
                const {brandId, typeId} = req.query          //ищем по запросу
                let devices;
                if (!brandId && !typeId) {  //если не указан ни бренд ни тип то возвращаем все девайсы
                    devices = await Device.findAll()
                }
                if (brandId && !typeId) {   //если указан бренд  то ищем по нему и тд
                    devices = await Device.findAll({where:{brandId}})
                }
                if (!brandId && typeId) {
                    devices = await Device.findAll({where:{typeId}})
                }
                if (brandId && typeId) {
                    devices = await Device.findAll({where:{typeId, brandId}})
                }
                return res.json(devices)
            }
        Переходим в Postman для проверки. Указываем url: http://localhost:5000/api/device, метод - GET, нажимаем Send и получаем все девайсы
            Чтобы фильтровать по параметрам - ниже строки запроса вибираем Params, KEY - brandId, Value - 2 (Apple), нажимаем Send и получаем только 1 девайс от Apple и тд
        Если есть много товаров до добавим к выводу страницы и лимит товаров на странице изменив async getAll(req, res) {}:
            async getAll(req, res) {
                let {brandId, typeId, limit, page} = req.query
                page = page || 1  //страницы кратны 1
                limit = limit || 9  //количество товаров на 1 странице
                let offset = page * limit - limit   //чтобы на одной странице не посвторялись товары 
                let devices;
                if (!brandId && !typeId) {
                    devices = await Device.findAll({limit, offset})
                }
                if (brandId && !typeId) {
                    devices = await Device.findAll({where:{brandId}, limit, offset})
                }
                if (!brandId && typeId) {
                    devices = await Device.findAll({where:{typeId}, limit, offset})
                }
                if (brandId && typeId) {
                    devices = await Device.findAll({where:{typeId, brandId}, limit, offset})
                }
                return res.json(devices)
            }
        Чтобы узнать общее количество товаров (5 из 26 и тд) нужно заменить findAll на findAndCountAll^
                async getAll(req, res) {
                    let {brandId, typeId, limit, page} = req.query
                    page = page || 1
                    limit = limit || 9
                    let offset = page * limit - limit
                    let devices;
                    if (!brandId && !typeId) {
                        devices = await Device.findAndCountAll({limit, offset})
                    }
                    if (brandId && !typeId) {
                        devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
                    }
                    if (!brandId && typeId) {
                        devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
                    }
                    if (brandId && typeId) {
                        devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset})
                    }
                    return res.json(devices)
                }
         В файле deviceController.js осталось значение info без данных (DeviceInfo), переходим в файл models.js и внесем в строку Device.hasMany(DeviceInfo):
                Device.hasMany(DeviceInfo, {as: 'info'});
            в deviceController.js в const {Device} = require('../models/models') вносим:
                const {Device, DeviceInfo} = require('../models/models')
            Для получения данных при вызове подробной информации о девайсе нужно добаить в async create(req, res, next) {} добавляем:
                async create(req, res, next) {
                    try {
                        let {name, price, brandId, typeId, info} = req.body
                        const {img} = req.files
                        let fileName = uuid.v4() + ".jpg"
                        img.mv(path.resolve(__dirname, '..', 'static', fileName))
                        const device = await Device.create({name, price, brandId, typeId, img: fileName});

                        if (info) {                             //если есть информация
                            info = JSON.parse(info)             //получаем данные с formData в виде строки и нужно через parse изменить на js объект
                            info.forEach(i => 
                                DeviceInfo.create({
                                    title: i.title,
                                    description: i.description,
                                    deviceId: device.id
                                })
                            )
                        }
                        return res.json(device)
                    } catch (e) {
                        next(ApiError.badRequest(e.message))
                    }

                }
        Теперь реализуем функцию получения одного конкретного девайса async getOne(req, res) {}:
                async getOne(req, res) {
                    const {id} = req.params             //сначала получаем id девайса который нужно найти в diviceRouter.js указывали этот id как '/:id'
                    const device = await Device.findOne(
                        {
                            where: {id},                                // условия по которому ищем девайс
                            include: [{model: DeviceInfo, as: 'info'}]   // помимо id нам нужно получить еще информацию о девайсе на случай если пользователь захочет просмотреть информацию
                        },
                    )
                    return res.json(device)
                }
        Протестируем. Заходим в Postman, метод - GET, в строку запроса вводим http://localhost:5000/api/device/3   где 3 - это id девайса и нажимаем Send - в результате получаем девайс с нужным id

Перейдем к авторизации пользователя. Осуществлять будем через JWT токен.
    В консоле вводим: npm i jsonwebtoken bcrypt   (bcrypt для кеширования паролей чтобы не хранить их в БД в открытом виде )
    Переходим в файл userController.js и в строку №2 пишем:
            const bcrypt = require ('bcrypt')
            const jwt = require('jsonwebtoken')
            const {User, Basket} = require('../models/models')
            //создаем токен и передаем 3 параметра: данные и секретный ключ и опцию, в данном случае сколько живет токен 
            const generateJwt = (id, email, role) => {
                jwt.sign(
                    {id, email, role}, 
                    process.env.SECRET_KEY, 
                    {expiresIn: '24h'}
                )
            }
        и переходим к регистрации async registration(req, res) {}
                async registration(req, res) {
                    const {email, password, role} = req.body   //получаем данные для регистрации
                    if (!email || !password) {
                        return next(ApiError.badRequest('Некорректный email или password'))
                    }
                    // проверим есть ли такой пользователь
                    const candidate = await User.findOne({where: {email}})
                    if (candidate) {    // если нам вернулся пользователь (такой email уже есть) то выдаем ошибку
                        return next(ApiError.badRequest('Пользователь с таким email уже существует'))
                    }
                    //если такого пользователя нет то хэшируем пароль и указываем сколько раз
                    const hashPassword = await bcrypt.hash(password, 5) 
                    const user = await User.create({email, role, password: hashPassword}) //создаем пользователя
                    // сразу создаем корзину для пользователя
                    const basket = await Basket.create({userId: user.id})
                    //создаем токен 
                    const token = generateJwt(user.id, user.email, user.role)
                    //после того как токен сгенерирован - возвращаем его на клиент
                    return res.json({token})
                } 
        В файл .env добавляем 
                SECRET_KEY=secret_key_token_2233
        Переходим в postman чтобы протестировать. В строку прописываем:http://localhost:5000/api/user/registration метод  POST - body - raw - JSON и пишем:
                {
                    "email": "user1@mail.com",
                    "password": "12345"
                }
            получаем:
                {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMUBtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjUwMjE2MjM4LCJleHAiOjE2NTAzMDI2Mzh9.SarIpE5IvoQc40OOs-4H2W1SxN6FASw8RwcVhpXy3_U"
                }
        Проверить можно на сайте https://jwt.io/ и ввчести полученное значение для разшифровки
Реализуем функцию логина в async login(req, res) {}:
            async login(req, res, next) {
                const {email, password} = req.body
                const user = await User.findOne({where: {email}})
                //проверяем есть ли такой пользователь
                if (!user) {
                    return next(ApiError.internel('Пользователь не найден'))
                }
                // проверяем верно ли ввел пароль пользователь сравнивая пародь в токене и введенный пароль пользователем
                let comparePassword = bcrypt.compareSync(password, user.password)
                // если пароли не совпадают - возвращаем ошибку
                if (!comparePassword) {
                    return next(ApiError.internel('Пароль неверный'))
                }
                //сгенерируем токен и передадим данные
                const token = generateJwt(user.id, user.email, user.role)
                return res.json({token})
            }
    Переходим в postman чтобы протестировать. В строку прописываем:http://localhost:5000/api/user/login метод  POST - body - raw - JSON и пишем:
            {
                    "email": "user1@mail.com",
                    "password": "12345"
                }
            получаем:
                {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMUBtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjUwMjE2MjM4LCJleHAiOjE2NTAzMDI2Mzh9.SarIpE5IvoQc40OOs-4H2W1SxN6FASw8RwcVhpXy3_U"
                }
            если вводим другую почту или пароль то получим ошибку
Перед тем как написать функцию check, перейдем в папку middleware и добавим файл authMiddleware.js где мы будем декодировать токен и проверять его на валидность. Если токен не валидный будем возвращать ошибку о том что пользователь не авторизован. Пишем:
                const jwt = require('jsonwebtoken')

                module.exports = function (req, res, next) {
                    if (req.method === "OPTIONS") {
                        next()
                    }
                    try {
                        const token = req.headers.authorization.split(' ')[1] //Bearer asfasnfkajsfnjk
                        if (!token) {
                            return res.status(401).json({message: "Не авторизован"})
                        }
                        const decoded = jwt.verify(token, process.env.SECRET_KEY)
                        req.user = decoded
                        next()
                    } catch (e) { // если гдето возникла ошибка - возвращаем статус 401
                        res.status(401).json({message: "Не авторизован"})
                    }
    Переходим в файл userRouter.js и пишем в строку №4:
            const authMiddleware = require('../middleware/authMiddleware')
        и добавим вторым параметром
             router.get('/auth', authMiddleware, userController.check) 
Реализуем функцию check в async check(req, res, next) {}
        Для проверки пишем:
                async check(req, res, next) { 
                    res.json({message: "All"})
                } 
            перейдем в postman, возьмем полученный токен через регистрацию и в другой вкладке метод GET, в строке запроса http://localhost:5000/api/user/auth, Headers, KEY - Authorization, VALUE - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMUBtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjUwMjIxNjE5LCJleHAiOjE2NTAzMDgwMTl9.x_QxwX8XJjFYDR0BUojcDs_Nto0lGne27QILAODvdSI и получим
                {
                    "message": "All"
                }
        Все работает, потому пишем:
                async check(req, res, next) { //проверка авторизован пользователь или нет
                    const token = generateJwt(req.user.id, req.user.email, req.user.role)
                    return res.json({token})
                }
    Теперь чтобы товары мог добавлять только администратор добавим файл checkRoleMiddleware.js в папку middleware и пишем:
              const jwt = require('jsonwebtoken')

                module.exports = function(role) {
                    return function (req, res, next) {
                        if (req.method === "OPTIONS") {
                            next()
                        }
                        try {
                            const token = req.headers.authorization.split(' ')[1] //Bearer asfasnfkajsfnjk
                            if (!token) {
                                return res.status(401).json({message: "Не авторизован"})
                            }
                            const decoded = jwt.verify(token, process.env.SECRET_KEY)
                            if (decoded.role !== role) {
                                return res.status(403).json({message: "Нет доступа"})
                            }
                            req.user = decoded
                            next()
                        } catch (e) { // если гдето возникла ошибка - возвращаем статус 401
                            res.status(401).json({message: "Не авторизован"})
                        }
                    }
                }
        Переходим в typeRouter.js и чтобы типы мог добавлять только админ в строку №4 добавляем:
                const checkRole = require('../middleware/checkRoleMiddleware')
            а в router.post('/', typeController.create) добавляем:
                router.post('/', checkRole('ADMIN'), typeController.create)
            Чтобы проверить переходим в Postman, метод POST, в строку вводим http://localhost:5000/api/type -body - JSON передаем:
                    {
                        "name": "Ноутбуки"
                    }
                нажимаем Send и получаем ошибку
                    {
                        "message": "Не авторизован"
                    }
                Чтобы авторизоваться создаем пользователя: метод POST, в строку вводим http://localhost:5000/api/user/registration - body - raw - JSON:
                    {
                        "email": "user12@mail.com",
                        "password": "12345",
                        "role": "ADMIN"
                    }
                и получаем токен, который вводим там где добавляли тип в headers, KEY - Authorization, Value - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ1c2VyMTJAbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NTAyOTM5MDUsImV4cCI6MTY1MDM4MDMwNX0.BBQn1HKmoA_XZEOg7kf2L3Q2-3g4MY9max_Ia-sy78I  и нажимаем Send. Получаем: 
                    {
                        "id": 3,
                        "name": "Ноутбуки",
                        "updatedAt": "2022-04-18T15:03:09.253Z",
                        "createdAt": "2022-04-18T15:03:09.253Z"
                    }
                это значит что тип добавился.
        Этот Middleware передаем еще на бренды, девайсы, и добавить функцию удаления.
Серверная часть окончена
Переходим к клиентской части.
*/
