import { PetrolModel } from '@api/interfaces';

const staticDB = {
    petrolList: (): Promise<PetrolModel[]> => {
        try{
            return import('./petrol-list.json') as any
        }catch (err){
            return Promise.reject(err)
        }
    }
}

export {staticDB}


