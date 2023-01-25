/*
Продолжение
    В терминале переходим в папку client и прописываем "npx create-react-app ."
    в установленном приложении в папке src удаляем все лишнее и оставляем файлы index.js и App.js. В index.js вставляем:
        import React from 'react';
        import ReactDOM from 'react-dom';
        import App from './App';

        ReactDOM.render(
            <App />,
            document.getElementById('root')
        );
    Теперь установим необходимые зависимости. В терминале прописываем: "npm i axios react-router-dom mobx mobx-react-lite"  axios-для передачи запросов на сервер, react-router-dom - для постраничной навигации,
    Установим bootstrap для react в терменале вводим: "npm install react-bootstrap bootstrap"
    Установим стили в файл в папке public index.html:
            <link rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"/>
        Удалим все лишнее, оставим только:
            <!DOCTYPE html>
            <html lang="en">

            <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" />
            <title>React App</title>
            </head>
            <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            </body>
            </html>
    Переходим в файл App.js это будет основным компонентом нашего приложения. Все удаляем и прописываем:
            import React from 'react';

            const App = () => {
            return (
                <div>
                WORKING
                </div>
            )
            }

            export default App;
    В терминале переходим в папку client и пишем npm start (запускаем приложение). Если в новом окне получили сообщение "WORKING" - все работает.

Теперь зададим структуру нашего приложения.
    В папку src добавляем все папки, которые нам в дальнейшем понадобятся. 
        Добавляем: 
            store, там будем взаимодействовать с mobix и хранить какие-то данные
            pages, там будут корневые компоненты которые будут являтся страницами
            components, там будут nav-бары и тд
            В папку pages создадим страницы. 
            
            Первая будет страница с авторизацией Auth.js в нее пишем:
            import React from 'react';

            const Auth = () => {
                return (
                    <div>
                        AUTH
                    </div>
                );
            };

            export default Auth;
        Добавляем файл shop.js и пишем:  Это будет основная страница, там будут карточки с устройствами, постраничный вывод, список брендов и тд
            import React from 'react';

            const Shop = () => {
                return (
                    <div>
                        SHOP
                    </div>
                );
            };

            export default Shop;
        Следующая страница когда мы откроем конкретное устройство, там будут характеристики, возможность добавить в корзину. Назовем ее DevicePage.js и напишем:
            import React from 'react';

            const DevicePage = () => {
                return (
                    <div>
                        DevicePage
                    </div>
                );
            };

            export default DevicePage;
        И Admin.js где будет админпанель где администратор будет добавлять типы, бренды, девайсы и др
            import React from 'react';

            const Admin = () => {
                return (
                    <div>
                        Admin page
                    </div>
                );
            };

            export default Admin;
        Заключительная страница - это страница с корзиной Basket.js^
            import React from 'react';

            const Basket = () => {
                return (
                    <div>
                        Basket
                    </div>
                );
            };

            export default Basket;
Теперь мы знаем какие будут старницы на нашем сайте и можем реализовать навигацию по ним.
    В папке components создадим файл AppRouter.js в нем будет описана логика навигации по страницам. На какие-то страница сможет зайти любой пользователь, а на какие-то только авторизованный 
        Здесь понадабятся компоненты Switch, Route, Redirect. В файл записываем:
            import React from 'react';
            import {Switch, Route, Redirect} from 'react-router-dom'

            const AppRouter = () => {
                return (
                    <div>
                        AppRouter
                    </div>
                );
            };

            export default AppRouter;
        А в файл App.js импортируем BrowserRouter а в него AppRouter который мы создали
                import React from 'react';
                import { BrowserRouter } from 'react-router-dom';
                import AppRouter from "./components/AppRouter";

                const App = () => {
                    return (
                        <BrowserRouter>
                        <AppRouter />
                        </BrowserRouter>
                    );
                };

                export default App;
    Далее создадим в папке src файл routes.js в котором будут описаны все маршруты к конкретным старницам, которые есть в нашем приложении.
    В нем создадим 2 масива: в первом список маршрутов для тех страниц, доступ к которым будет только у зарегистрированного пользователя и массив с маршрутами к общедоступным страницам.
        Сразу оба масива экспортируем и добавляем объект. У каждого объекта будет путь (это ссылка по которой страница будет отрабатывать) и компонент - это непосредственно сама страница
                import Admin from "./pages/Admin";

                export const authRoutes = [
                    {
                        path: '/admin',
                        Component: Admin
                    }
                ]

                export const publicRoutes = [

                ]

    Но так в виде строки указывать маршрут является не очень хорошей практикой потому создадим в папке src папку utils а в ней файл consts.js и прописываем все пути
                import Admin from "./pages/Admin";
                import {ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "./utils/consts";
                import Basket from "./pages/Basket";
                import Shop from "./pages/Shop";
                import Auth from "./pages/Auth";
                import DevicePage from "./pages/DevicePage";

    Возвращаемся в файл routes.js и теперь путь передаем как константу:  
                    export const authRoutes = [
                        {
                            path: ADMIN_ROUTE,
                            Component: Admin
                        },
                        {
                            path: BASKET_ROUTE,
                            Component: Basket
                        },
                    ]
            В массив куда может зайти любой пользователь добавляем:
                    export const publicRoutes = [
                        {
                            path: SHOP_ROUTE,
                            Component: Shop
                        },
                        {
                            path: LOGIN_ROUTE,
                            Component: Auth
                        },
                        {
                            path: REGISTRATION_ROUTE,
                            Component: Auth
                        },
                        {
                            path: DEVICE_ROUTE + '/:id',
                            Component: DevicePage
                        },
                    ]
        С маршрутами закончили, но на данном этапе они не будут работать, их нужно "оживить". Переходим в AppRouter.js и возвращаем компонент Switch.
            Switch работает таким образом: мы указываем несколько маршрутов (например страница авторизации, регистрации и магазина) и если ни один из этих маршрутов не отработает (если пользователь ввел какой-то некорректный адрес) то отработает самый последний маршрут, который указан в этом свиче.
            Создадим переменную (она будет "заглушкой", моковая переменная, потом подставим что нужно) isAuth, она будет показывать авторизован пользователь или нет (в дальнейшем мы будем хранить это в store, отправлять токен на сервер, убеждаться в том что он валидный, а затем эту переменную присваивать).
            Затем мы импортируем массив с роутами, которые доступны только авторизованному пользователю. Пробегаемся по нему при помощи функции map, сразу делаем деструктуризацию и вытаскиваем из объекта путь и компонент. И для каждого элемента массива мы отрисовываем Route где указываем путь и компонент, который по этому пути должен отрисовывать.
            Еще пропишем ключ exact, который говорит что ключ долэен точно совпадать. В качестве ключа укажем путь, что говорит что путь к каждой странице уникален. 
            В файле AppRouter.js выходит:
                    import React from 'react';
                    import {Switch, Route, Redirect} from 'react-router-dom'
                    import { authRoutes } from '../routes';

                    const AppRouter = () => {
                        const isAuth = false;
                        return (
                            <Switch>
                                {authRoutes.map(({path, Component}) =>
                                    <Route key={path} path={path} component={Component} exact/>
                                )}
                            </Switch>
                        );
                    };

                    export default AppRouter;
    
            Если все оставить так, то выходит, что эти маршруты будуь доступны каждому пользователю, необходимо сделать проверку, в 
                        {authRoutes.map(({path, Component}) =>
                            <Route key={path} path={path} component={Component} exact/>
                        )}
                добавляем isAuth && и выходит
                        <Switch>
                            {isAuth && authRoutes.map(({path, Component}) =>
                                <Route key={path} path={path} component={Component} exact/>
                            )}
                        </Switch>
                добавляем второй объект для публичного доступа, выходит:
                        <Switch>
                            {isAuth && authRoutes.map(({path, Component}) =>
                                <Route key={path} path={path} component={Component} exact/>
                            )}
                            {publicRoutes.map(({path, Component}) =>
                                <Route key={path} path={path} component={Component} exact/>
                            )}
                        </Switch>
            В браузире проверяем отображение всех маршрутов (в новой версии "react-router-dom" не будет Switch, нужно будет заменить).
            На данном этапе если ввести некорректный путь то мы на нем и останемся, потому добавим в строку №16 перед закрытием Switch:
                        <Redirect to={SHOP_ROUTE}/>
            Теперь разберемся с переменной isAuth, вынесем ее в отдельное глобальное хранилище - src-store создадим файл UserStore.js и вносим:
                        import {makeAutoObservable} from "mobx";

                        export default class UserStore {
                            constructor() {
                                this._isAuth = false
                                this._user = {}
                                makeAutoObservable(this)
                            }

                            setIsAuth(bool) {
                                this._isAuth = bool
                            }
                            setUser(user) {
                                this._user = user
                            }

                            get isAuth() {
                                return this._isAuth
                            }
                            get user() {
                                return this._user
                            }
                        }
            Теперь разберемся как это состояние прокидывать в наши компоненты. В файл index.js (в папке stc) в строку № 5 добавляем:
                        import UserStore from './store/UserStore';            
                        export const Context = createContext(null)
                и меняем ReactDOM.render() на:
                        ReactDOM.render(
                            <Context.Provider value={{
                                user: new UserStore(),
                            }}>
                                <App />  
                            </Context.Provider>,
                            document.getElementById('root')
                        );
            В файл AppRouter.js добавляем в строку № 5:
                        import { Context } from '../index';
            в переменную isAuth:
                        const {user} = useContext(Context);
            и где проверка isAuth добавляем user.isAuth.
            Таким образом у нас теперь есть глобальное хранилище  и в любом месте нашего приложения мы можем получать из него данные.
        Сразу добавляем второй store и назовем DeviceStore.js и пишем:
                        import {makeAutoObservable} from "mobx";

                        export default class DeviceStore {
                            constructor() {
                                this._types = [ //пока мы не научимся делать запросы на сервер добавим пару объектов для удобства при верстке
                                    {id: 1, name: 'Холодильники'},
                                    {id: 2, name: 'Смартфоны'},
                                    {id: 3, name: 'Ноутбуки'},
                                    {id: 4, name: 'Телевизоры'},
                                ]
                                this._brands = [
                                    {id: 1, name: 'Samsung'},
                                    {id: 2, name: 'Apple'}
                                ]
                                this._devices = [
                                    {id: 1, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'},
                                    {id: 2, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'},
                                    {id: 3, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'},
                                    {id: 4, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'}
                                ]
                                makeAutoObservable(this)
                            }

                            setTypes(types) {
                                this._types = types
                            }
                            setBrands(brands) {
                                this._brands = brands
                            }
                            setDevices(devices) {
                                this._devices = devices
                            }

                            get types() {
                                return this._types
                            }
                            get brands() {
                                return this._brands
                            }
                            get devices() {
                                return this._devices
                            }
                        }
            Теперь вернемся в index.js и помимо userStore добавим DeviceStore в строку №11:
                        device: new DeviceStore()
        На этом каркас приложения построен и приступаем к верстке.



        Далее файл инструкция3Верстка.js

    */      