/*          Продолжение  1:24:49 в видео
    Макет для верстки будем брать здесь:
        https://www.figma.com/file/nutWUOANZdJ7gnBazQBLie/Untitled?node-id=1%3A157
    Начнем с navbar. Добавляем в папку src-components - NavBar.js, разворачиваем компонент реакт:
                import React, { useContext } from "react";
                import { Context } from "..";

                const NavBar = () => {
                    const {user} = useContext(Context) //Добавляем useContext так как NavBar будет отличатся в зависимости зарегистрирован пользователь или нет
                    return (
                        <div>
                        </div>
                    );
                };

                export default NavBar;
    и подключаем Navbar через bootstrap. В строку №3 и 4 подключаем компонент bootstrap Navbar и Nav:
                    import Navbar from "react-bootstrap/Navbar";
                    import Nav from "react-bootstrap/Nav";
    и вместо <div> </div> добавляем компонент :
                    import React, { useContext } from "react";
                    import { Context } from "..";
                    import Navbar from "react-bootstrap/Navbar";
                    import Nav from "react-bootstrap/Nav";
                    import {NavLink} from "react-router-dom";
                    import { SHOP_ROUTE } from "../utils/consts";
                    import {Button, Container} from "react-bootstrap";
                    import {observer} from "mobx-react-lite";

                    const NavBar = observer( () => { //observer для отслеживания mobx в реальном времени значения состояний
                        const {user} = useContext(Context) //Добавляем useContext так как NavBar будет отличатся в зависимости зарегистрирован пользователь или нет
                        return (
                            <Navbar bg="dark" variant="dark"> 
                                <Container>
                                    <NavLink style={{color:'white'}} to={SHOP_ROUTE}>КупиДевайс</NavLink>
                                    {user.isAuth ? //воспользуемся тернарным оператором для автоизованного/не авторизованного пользователя
                                        //если пользователь авторизован:
                                        <Nav className="ml-auto" style={{color:'white'}}>
                                            <Button variant={"outline-light"}>Админ панель</Button>
                                            <Button variant={"outline-light"} className="ml-2" onClick={() => user.setIsAuth(false)}>Выйти</Button>
                                        </Nav>
                                        :
                                        <Nav className="ml-auto" style={{color:'white'}}>
                                            <Button variant={"outline-light"} onClick={() => user.setIsAuth(true)}>Авторизация</Button>
                                        </Nav>
                                    }
                                </Container>
                            </Navbar>
                        );
                    })

                    export default NavBar;
    Теперь откроем макет Авторизация и приступим к создании формы Авторизации и Регистрации. Переходим в файл Auth.js в папке pages и сделаем его уничерсальным: не только для резистрации, но и для авторизации:
                    import React from 'react';
                    import { Button, Card, Container, Form, Row } from 'react-bootstrap';
                    import {NavLink, useLocation} from 'react-router-dom';
                    import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';

                    const Auth = () => {
                        const location = useLocation()  //для получения местонахождения пользователя
                        const isLogin = location.pathname === LOGIN_ROUTE
                        return (
                            <Container 
                            className="d-flex justify-content-center align-items-center"
                            style={{height: window.innerHeight - 54}}>
                                <Card style={{width:600}} className="p-5">
                                    <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                                    <Form className='d-flex flex-column'>
                                        <Form.Control className='mt-3' placeholder='Введите ваш email...' />
                                        <Form.Control className='mt-3' placeholder='Введите ваш пароль...' />
                                        <Row className='d-flex justify-content-between mt-2 pl-3 pr-3'>
                                            {isLogin ? 
                                                <div>
                                                    Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                                                </div>
                                                :
                                                <div>
                                                    Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                                                </div>
                                                }
                                                <Button variant={"outline-success"}>{isLogin ? 'Войти' : 'Регистрация'}</Button>
                                        </Row>
                                        
                                    </Form>
                                </Card>
                            </Container>
                        );
                    };

                    export default Auth;
        Теперь переходим к самому магазину и файлу Shop.js. Вместо div все завернем в Container и выйдет:
                    <Container> 
                        <Row>
                            <Col md={3}>
                                
                            </Col>
                            <Col md={9}>
                                
                            </Col>
                        </Row>
                    </Container>
        Перейдем к созданию левой колонки с типами устройств. В папку components добавим файл TypeBar.js
                    import { observer } from 'mobx-react-lite';
                    import React, { useContext } from 'react';
                    import {ListGroup} from 'react-bootstrap';
                    import { Context } from '../index';

                    const TypeBar = observer( () => {
                        const {device} = useContext(Context) //делаем деструктуризацию
                        return (
                            <ListGroup>
                            </ListGroup>
                        );
                    })

                    export default TypeBar;
            В ListGroup с помощью функции map мы пробежимся по типам, которые находятся в нашем сторе и для каждого типа будем отрисовывать ListGroup.Item компонент и внутри будем помещать название нашего типа. Поскольку мы итерируемся по списку не забываем указать ключ
                    <ListGroup>
                        {device.types.map(type =>
                            <ListGroup.Item key={type.id}>
                                {type.name}
                            </ListGroup.Item>
                            )}
                    </ListGroup>
            Теперь нужно чтобы при нажатии на какой-то конкретный тип нам нужно его выделять. В файл DeviceStore.js в строку №33 добавляем:
                            setSelectedType() {
                            }
                и в строку №21 для хранения выделенного типа
                            this._selectedType = {}
                и в строку №35 в функцию setSelectedType записываем:
                            setSelectedType(type) {
                                this._selectedType = type
                            }
                сразу делаем гетер (добавляем в строку №44):
                            get selectedType() {
                                return this._selectedType
                            }
                Возвращаемся в файл TypeBar и добавим onClick по нажатию  на item листа и передаем тип и чтобы выбранный элемент как-то отличался. Если id элента итерации совпадает с типом, который мы сохранили в стор то тогда он будет активным.
                 и чтобы он как-то выделялся при наведении добавим стиль
                            <ListGroup.Item
                                style={{cursor: 'pointer'}}
                                active={type.id === device.selectedType.id}
                                onClick={() => device.setSelectedType(type)}
                                key={type.id}
                            >
                                {type.name}
                            </ListGroup.Item>
            Теперь создадим панель с брендами, в папку components добавим файл BrandBar.js и разворачиваем компонент BravdBar, заворачиваем в observer. Корневым элементом сделаем Row и сделаем его флексовым
                через функцию map пробегаемся по брендам и для каждого будем отрисовывать Card. Поскольку итерируемся по массиву не забываем про key
                            import React, {useContext} from 'react';
                            import {observer} from "mobx-react-lite";
                            import {Context} from "../index";

                            const BravdBar = observer(() => {
                                const {device} = useContext(Context)
                                return (
                                    <Row className="d-flex">
                                        {device.brands.map(brand =>
                                            <Card
                                                key={brand.id}
                                                className="p-3"
                                            >
                                                {brand.name}
                                            </Card>    
                                        )}
                                    </Row>
                                );
                            });

                            export default BravdBar;
            Перейдем на страницу магазина и во вторую колонку добавляем BravdBar:
                    в строку №22 файла DeviceStore.js добавим:
                            this._selectedBrand = {}
                    в строку №40
                            setSelectedBrand(brand) {
                                this._selectedBrand = brand
                            } 
                    в строку №53
                            get selectedBrand() {
                                return this._selectedBrand
                            }

                Добавим стиль при нажатии, в строке №14 файла BrandBar.js пишем:
                            style={{cutsor: 'pointer'}}
                            onClick={() => product.setSelectedBrand(brand)}
                            border = {brand.id === product.selectedBrand.id ? 'danger' : 'light'}

            Добавим список товаров
                Создадим файл в папке components и назовем DeviceList.js. Добавляем:
                            import React, {useContext} from 'react';
                            import {observer} from "mobx-react-lite";
                            import {Context} from "../index";
                            import { Row } from 'react-bootstrap';


                            const DeviceList = observer(() => {
                                const {device} = useContext(Context)
                                return (
                                    <Row className='d-flex'>
                                        {device.device.map(device =>
                                            
                                        )}
                                    </Row>
                                );
                            });

                            export default DeviceList;
                Создаем компонент DeviceItem.js и пишем:
                            import React, {useContext} from 'react';
                            import { Col } from 'react-bootstrap';


                            const DeviceItem = () => {
                                return (
                                    <Col md={3} className={'mt-3'}>
                                        item
                                    </Col>
                                );
                            };

                            export default DeviceItem;
                Подключаем файл DeviceItem.js к DeviceList.js добавив в строке №13 
                            <DeviceItem key={device.id} device={device} /> отрисовываем компонент, передаем ключ и отрисовываем элемент текущей итерации, а в 
                        файле DeviceItem.js мы этот девайс принимаем:
                            import React from 'react';
                            import { Col } from 'react-bootstrap';


                            const DeviceItem = ({device}) => {
                                return (
                                    <Col md={3}>
                                        item
                                    </Col>
                                );
                            };

                            export default DeviceItem;
            Переходим на страницу магазина Shop.js и в строку №15 добавляем <DeviceList/> видим что девайсы отрисованы
                Теперь перейдем к элементу DeviceItem и сделаем картинку, название, обернем в карточку.
                 в строку №3 добавляем
                            import Image from 'react-bootstrap/Image';
                            import star from '../assets/Vector.svg'  
                в строку №9 (в <Col md={3}>) добавляем:
                            <Card style={{width: 150, cursor: 'pointer'}} border={"light"}>
                                <Image width={150} height={150} src={device.img}/>
                                <div className='text-black-50 mt-1 d-flex justify-content-between align-items-center'>
                                    <div>Sumsung..</div>
                                    <div className='d-flex align-items-center'>
                                        <div>{device.rating}</div>
                                        <Image width={18} height={18} src={star}/>
                                    </div>
                                </div>
                                <div>{device.name}</div>
                            </Card>
                Теперь сделаем устройства кликабельными чтобы переходить на страницу детального просмотра девайса        
                     В файле DeviceItem.js добавляем в строке №5
                                import { useHistory } from 'react-router-dom';
                                и в строке №9
                                const history = useHistory()
                    добавляем слушатель события Клик в строке 12: 
                                <Col md={3} className={'mt-3'} onClick={() => history.push(DEVICE_ROUTE + '/' + device.id)}>      history.push генерит отдельную страницу под каждый девайс, потом будем делать запрос на сервер чтобы получать всю информацию о товаре
                Переходим в файл DevicePage.js. Делим страницу на 3 столбца, в первом будет картинка, втором рейтин
                                import React from 'react';
                                import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
                                import bigStar from '../assets/bigStar.png'

                                const DevicePage = () => {
                                    const device = {id: 1, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'}
                                    
                                    return (
                                        <Container className='mt-3'>
                                            <Row>
                                                <Col md={4}>
                                                    <Image width={300} height={300} src={device.img}/>
                                                </Col>
                                                <Col md={4}>
                                                    <Row className='d-flex flex-column align-items-center'>
                                                        <h2>{device.name}</h2>
                                                        <div 
                                                            className='d-flex align-items-center justify-content-center'
                                                            style={{background: `url(${bigStar}) no-repeat center center`, width: 240, height: 240, backgroundSize: 'cover', fontSize:64}}
                                                        >
                                                            {device.rating}
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col md={4}>
                                                    <Card
                                                    className='d-flex flex-column align-items-center justify-content-around'
                                                    style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
                                                    >
                                                        <h3>От: {device.price} грн.</h3>
                                                        <Button variant={'outline-dark'}>Добавить в корзину</Button>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Container>
                                    );
                                };

                                export default DevicePage;
    1:49:50
                        Теперь добавим характеристики, сделаем отдельный массив и позднне все это будем получать с бэкэнда. А Пока добавим вручную на строку №7:
                                const description = [
                                    {id:1, title: 'Оперативная память', description: '5 гб'},
                                    {id:2, title: 'Камера', description: '12 мп'},
                                    {id:3, title: 'Процессор', description: 'Пентиум 3'},
                                    {id:4, title: 'Кол-во ядер', description: '2'},
                                    {id:5, title: 'Аккумулятор', description: '4000'},

                                ]       
                        и в строку № 43:
                                <Row className='d-flex flex-column m-3'>
                                    <h1>Характеристики</h1>
                                    {description.map((info, index) =>
                                        <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                                            {info.title}: {info.description}
                                        </Row>
                                    )}
                                </Row>

            */