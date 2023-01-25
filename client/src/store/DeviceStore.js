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
            {id: 4, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'},
            {id: 5, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'},

            {id: 6, name: 'Iphone 12 pro', price: 25000, rating: 5, img: 'https://i.allo.ua/media/catalog/product/cache/1/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-12-pro-max-gold-hero.jpg'}
        ]
        this._selectedType = {}
        this._selectedBrand = {}
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

    setSelectedType(type) {
        this._selectedType = type
    } 
    setSelectedBrand(brand) {
        this._selectedBrand = brand
    } 
    get devices() {
        return this._devices
    }
    get types() {
        return this._types
    }
    get brands() {
        return this._brands
    }
    get selectedType() {
        return this._selectedType
    }
    get selectedBrand() {
        return this._selectedBrand
    }
} 