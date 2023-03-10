import React, { useContext } from "react";
import { Context } from "..";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {NavLink} from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import {Button, Container} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import { useHistory } from "react-router-dom";

const NavBar = observer( () => { //observer для отслеживания mobx в реальном времени значения состояний
    const {user} = useContext(Context) //Добавляем useContext так как NavBar будет отличатся в зависимости зарегистрирован пользователь или нет
    const history = useHistory()
    
    return (
        <Navbar bg="dark" variant="dark"> 
            <Container>
                <NavLink style={{color:'white'}} to={SHOP_ROUTE}>КупиДевайс</NavLink>
                {user.isAuth ? //воспользуемся тернарным оператором для автоизованного/не авторизованного пользователя
                    //если пользователь авторизован:
                    <Nav className="ml-auto" style={{color:'white'}}>
                        <Button 
                            variant={"outline-light"} 
                            onClick={() => history.push(ADMIN_ROUTE)}
                        >Админ панель</Button>
                        <Button 
                            variant={"outline-light"} 
                            onClick={() => history.push(LOGIN_ROUTE)} 
                            className="ml-2"
                        >Выйти</Button>
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