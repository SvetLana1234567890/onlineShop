/* 
1:50:50
                Теперь сделаем панель входа. Для этого нужно оживить кнопку. Переходим в файл NavBar.js добавляем useHistory чтобы перемещаться на страницу админ.панели в строку №9:
                                import { useHistory } from "react-router-dom";     
                            и с помощью этого хука вызываем History и добавляем в строку № 13
                                const history = useHistory()
                            а на кнопки добавляем слушатель нажатия вносим изменение в кнопки в строке №22
                                <Button 
                                    variant={"outline-light"} 
                                    onClick={() => history.push(ADMIN_ROUTE)}
                                >Админ панель</Button>
                                <Button 
                                    variant={"outline-light"} 
                                    onClick={() => history.push(LOGIN_ROUTE)} 
                                    className="ml-2"
                                >Выйти</Button>
        Приступаем к странице админ.панели. В папке pages добавляем файл Admin.js
                                import React from 'react';
                                import { Button, Container } from 'react-bootstrap';

                                const Admin = () => {
                                    return (
                                        <Container className='d-flex flex-column'>
                                            <Button variant={"outline-dark"} className="mt-2">Добавить тип</Button>
                                            <Button variant={"outline-dark"} className="mt-2">Добавить бренд</Button>
                                            <Button variant={"outline-dark"} className="mt-2">Добавить устройство</Button>
                                        </Container>
                                    );
                                };

                                export default Admin;
        Далее в папку components создаем папку modals для дальнейшего подключения модальных окон. В папке создаем файл CreateBrand.js, CreateType.js и CreateDevice.js. 
            подключим эти файлы в файле Admin.js в строку № 13
                                <CreateBrand/>
                                <CreateType/>
                                <CreateDevice/>
            В CreateType.js прописываем:
                                import React from 'react';
                                import { Button, Form, Modal } from 'react-bootstrap';

                                const CreateType = ({show, onHide}) => {  // передаем 2 пропса, show отвечает за то виден компонент или нет; onHide - это функция которая скрывает окно
                                    return (       
                                        <Modal
                                            show={show}
                                            onHide={onHide}
                                            size="lg"
                                            centered
                                        >
                                        <Modal.Header closeButton>
                                            <Modal.Title id="contained-modal-title-vcenter">
                                                Добавить тип
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Control
                                                    placeholder={"Введите название типа"}
                                                />
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                                            <Button variant="outline-success" onClick={onHide}>Добавить</Button>
                                        </Modal.Footer>
                                    </Modal>
                                    );
                                };

                                export default CreateType;
            В CreateBrand.js прописываем:
                                import React from 'react';
                                import { Button, Form, Modal } from 'react-bootstrap';


                                const CreateBrand = ({show, onHide}) => {
                                    return (
                                        <Modal
                                            show={show}
                                            onHide={onHide}
                                            size="lg"
                                            centered
                                        >
                                        <Modal.Header closeButton>
                                            <Modal.Title id="contained-modal-title-vcenter">
                                                Добавить бренд
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Control
                                                    placeholder={"Введите название типа"}
                                                />
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                                            <Button variant="outline-success" onClick={onHide}>Добавить</Button>
                                        </Modal.Footer>
                                    </Modal>
                                    )
                                }

                                export default CreateBrand;
            В CreateDevice.js прописываем:
                                import React from 'react';
                                import { Button, Form, Modal } from 'react-bootstrap';


                                const CreateDevice = ({show, onHide}) => {
                                    return (
                                        <Modal
                                            show={show}
                                            onHide={onHide}
                                            size="lg"
                                            centered
                                        >
                                        <Modal.Header closeButton>
                                            <Modal.Title id="contained-modal-title-vcenter">
                                                Добавить устройство
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Control
                                                    placeholder={"Введите название типа"}
                                                />
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                                            <Button variant="outline-success" onClick={onHide}>Добавить</Button>
                                        </Modal.Footer>
                                    </Modal>
                                    )
                                }

                                export default CreateDevice; 
            Теперь переходим в файл Admin.js и создадим три состояния, они будут отвечать за то видим ли мы модальное окно или нет. В строку №8 добавляем:  (useState - по умолчанию)
                                const [brandVisible, setBrandVisible] = useState(false)
                                const [typeVisible, setTypeVisible] = useState(false)
                                const [deviceVisible, setDeviceVisible] = useState(false)
                и передаем это состояние в подключение модальных окон (строка 18-20):
                                <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
                                <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
                                <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)}/>
                и на кнопки вешаем слушатель события на кнопки и получаем:
                                <Button 
                                    variant={"outline-dark"} className="mt-2" onClick={() => setTypeVisible(true)}
                                >Добавить тип</Button>
                                <Button 
                                    variant={"outline-dark"} className="mt-2" onClick={() => setBrandVisible(true)}
                                >Добавить бренд</Button>
                                <Button 
                                    variant={"outline-dark"} className="mt-2" onClick={() => setDeviceVisible(true)}
                                >Добавить устройство</Button>
            Теперь закончим добавление устройств в файле CreateDevice.js. В строку № 7 добавляем 
                                const {device} = useContext(Context)
                и в Modal.Body добавляем форму (строка 22):
                                <Form>
                                    <Dropdown className='mt-2 mb-2'>
                                        <Dropdown.Toggle>Виберите тип</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {device.types.map(type =>
                                                <Dropdown.Item key={type.id}>{type.name}</Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown className='mt-2 mb-2'>
                                        <Dropdown.Toggle>Виберите бренд</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {device.brands.map(brand =>
                                                <Dropdown.Item key={brand.id}>{brand.name}</Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Form.Control className='mt-3' placeholder="Введите название устройства"/>
                                    <Form.Control className='mt-3' placeholder="Введите стоимость устройства" type='number'/>
                                    <Form.Control className='mt-3' type='file'/> <hr/>
                                </Form>
                также для каждого устройста нужно будет добавлять массив характеристик, добавим в строку № 8:
                                 const [info, setInfo] = useState([])         по умолчанию там пустой массив          
                 в форму, в строку 43 добавим:
                                <Button
                                    variant={'outline-dark'}
                                >Добавить новое свойство</Button>                               
                добавим функцию с помощью которой мы будем добавлять эти характеристики. Добавим в строку 10 
                                 const addInfo = () => {
                                    setInfo([...info, {title: '', description: '', number: Date.now()}])
                                }               
                    и под формой в строку 46 добавим             
                                <Button
                                    variant={'outline-dark'}
                                    onClick={addInfo}
                                >Добавить новое свойство</Button>
                                {info.map(i =>
                                <Row  className='mt-4' key={i.number}>
                                        <Col md={4}>
                                            <Form.Control
                                                placeholder='Введите название свойства'
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Control
                                                placeholder='Введите описание свойства'
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Button variant={'outline-danger'}>Удалить</Button>
                                        </Col>
                                </Row>     
                                )}
                Теперь при нажатии на кнопку "Добавить новое свойство" у нас открываэтся строки для каждой характеристики
                Реализуем функцию, которая будет удалять характеристику  и добавим в строке №14:
                                const removeInfo = (number) => {
                                    setInfo(info.filter(i => i.number !== number) //через фильтр проверяем совпадает ли номер элемента  с номером, который передали параметром
                                }   
                    и при нажатии на кнопку "Удалить" необходимо вызывать эту функцию, вносим правки в строке №68:
                                <Button 
                                    onClick={() => removeInfo(i.number)}
                                    variant={'outline-danger'}>Удалить</Button>
    

                                    
2:02:09
    Теперь перейдем к соеденению серверной и клиентской части  
            Создадим папку http в папке  src, а в ней файл index.js и в нем настроим axios                   
                                import axios from "axios";

                                const $host = axios.create({
                                    baseURL: process.env.REACT_APP_API_URL
                                })

                                const $authHost = axios.create({
                                    baseURL: process.env.REACT_APP_API_URL
                                })

                                const authInterceptor = config => {
                                    config.headers.authorization = `Bearer  ${localStorage.getItem('token')}`
                                    return config
                                }

                                $authHost.interceptors.request.use(authInterceptor)

                                export {
                                    $host,
                                    $authHost
                                }

            Создадим файл .env в папке http:
                                REACT_APP_API_URL='http://localhost:5000/'

            В папке http создаем файл userAPI.js и реализуем функции регистрации, авторизации и проверки токена на валидность:
                                import { $authHost, $host } from "./index";

                                export const registration = async (email, password) => {
                                    const response = await $host.post('api/user/registration', {email,password, role: 'ADMIN'})
                                    return response
                                }

                                export const login = async (email, password) => {
                                    const response = await $host.post('api/user/login', {email,password})
                                    return response
                                }

                                export const check = async () => {
                                    const response = await $host.post('api/auth/registration', )
                                    return response
                                }
            Теперь воспользуемся этими функциями. Откроем страницу с авторизацией Auth.js и в строке № 9 создадим новую функцию:
                                const signIn = async () => {
                                    const response = await registration()
                                    console.log(response)
                                }
                и в строке #10 на кнопку повешаем слушатель               
                                        const [email, setEmail] = useState('')
                                        const [password, setPassword] = useState('')


                                        const click = async () => {
                                            if (isLogin){
                                                const response = await login();
                                            } else {
                                                const response = await registration(email, password);
                                                console.log(response)
                                            }
                                        }
                и редактируем сами кнопки (строка №30):
                                    <Form.Control className='mt-3' 
                                        placeholder='Введите ваш email...' 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)}/>
                                    <Form.Control className='mt-3' 
                                        placeholder='Введите ваш пароль...' 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        type="password"/>
                и на кнопке Регистрация (строка 49) подключаем функцию
                                    <Button variant={"outline-success"} onClick={click}>{isLogin ? 'Войти' : 'Регистрация'}</Button>
        Далее нам нужно чтобы сохранялась информация о пользователе (чтобы сохранялись данные пользователя и токен). В консоле прописываем npm i jwt-decode                                




*/
