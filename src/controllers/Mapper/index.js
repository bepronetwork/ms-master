import Mapper from './Mapper';
import MapperBetSingleton from './MapperBet';
import MapperUserSingleton from './MapperUser';
import MapperWalletSingleton from './App/MapperWalletTransaction';
import {
    MapperRegisterUserSingleton,
    MapperLoginUserSingleton,
    MapperAuthUserSingleton,
    Mapperlogin2faUserSingleton,
    MapperSet2faUserSingleton,
    MapperCreateApiTokenUserSingleton,
    MapperGetDepositAddressUserSingleton
} from "./user";

import {
    MapperGetCasinoGamesSingleton,
    MapperGetEcosystemDataSingleton
} from "./Ecosystem";

export {
    Mapper,
    MapperBetSingleton,
    MapperUserSingleton,
    MapperWalletSingleton,
    MapperRegisterUserSingleton,
    MapperLoginUserSingleton,
    MapperAuthUserSingleton,
    Mapperlogin2faUserSingleton,
    MapperSet2faUserSingleton,
    MapperCreateApiTokenUserSingleton,
    MapperGetDepositAddressUserSingleton,
    MapperGetCasinoGamesSingleton,
    MapperGetEcosystemDataSingleton
}