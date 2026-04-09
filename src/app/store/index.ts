import { useAuthStore } from './authStore';
import { useCounterStore } from './counterStore';
import { resetAllStores } from './storeFactory';

const store = {
    useAuthStore,
    useCounterStore,
    resetAllStores,
};

export default store;
