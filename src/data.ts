import uid from './utils/uidGenerator.ts'

type productType = {
    _id: string,
    vintage: string,
    name: string,
    producerId: number
}

const products:productType[] = [
    {_id: uid(), vintage: '2021', name: 'Aszu', producerId: 1},
    {_id: uid(), vintage: '2022', name: 'Cuvee', producerId: 1},
    {_id: uid(), vintage: '2023', name: 'Furmint', producerId: 1},
    {_id: uid(), vintage: '2024', name: 'Szomorodni', producerId: 1},
    {_id: uid(), vintage: '2020', name: 'Bikaver', producerId: 2},
    {_id: uid(), vintage: '2020', name: 'Merlot', producerId: 2}
]

const producers:{
    _id: number, name: string, country: string, region: string
}[] = [
    {_id: 1, name: 'Tokaji', country: 'Hungary', region: 'Tokaj'},
    {_id: 2, name: 'Egri', country: 'Hungary', region: 'Eger'}
]

export {productType, products, producers}