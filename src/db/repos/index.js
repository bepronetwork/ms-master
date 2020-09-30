import UsersRepository from './user';
import AppRepository from './app';
import BetRepository from './bet';
import DepositRepository from './deposit';
import WalletsRepository from './wallet';
import GamesRepository from './game';
import BetsRepository from './bet';
import AdminsRepository from './admin';
import EventsRepository from './event';
import ResultSpacesRepository from './resultSpace';
import WithdrawRepository from './withdraw';
import BetResultSpacesRepository from './betResultSpace';
import AuthorizedsRepository from './ecosystem/authorized';
import BlockchainsRepository from './ecosystem/blockchain';
import SecurityRepository from './security';
import ResultSpaceEcoRepository from './ecosystem/resultSpace';
import AffiliateRepository from './affiliate';
import AffiliateLinkRepository from './affiliateLink';
import AffiliateStructureRepository from './affiliateStructure';
import AffiliateSetupRepository from './affiliateSetup';
import IntegrationsRepository from './integrations';
import ChatRepository from './chat';
import CustomizationRepository from './customization';
import TopBarRepository from './topBar';
import BannersRepository from './banners';
import LogoRepository from './logo';
import LogRepository from './log';
import ColorRepository from './color';
import LinkRepository from './link';
import FooterRepository from './footer';
import TypographyRepository from './typography';
import CurrencyRepository from './currency';
import AddressRepository from './address';
import TopIconRepository from './topIcon';
import TokenRepository from './token';
import MailSenderRepository from './mailSender';
import LoadingGifRepository from "./loadingGif";
import AddOnRepository from "./addOn";
import JackpotRepository from "./jackpot";
import PermissionRepository from "./permission";
import AutoWithdrawRepository from "./autoWithdraw";
import AddOnsEcoRepository from "./ecosystem/addon";
import CasinoProviderEcoRepository from "./ecosystem/casinoProvider";
import BalanceRepository from "./balance";
import { BiggestBetWinnerRepository, BiggestUserWinnerRepository, LastBetsRepository,  PopularNumberRepository} from "./redis";
import TxFeeRepository from "./txFee";
import BackgroundRepository from "./background";
import DepositBonusRepository from "./depositBonus";
import PointSystemRepository from "./pointSystem";
import TopTabRepository from "./topTab";
import SubSectionsRepository from "./subSections";
import ProviderRepository from "./provider";
import ProviderTokenRepository from "./providerToken";
import CripsrRepository from "./cripsr";
import SkinRepository from "./skin";
import KycRepository from "./kyc";
import IconsRepository from "./icon";
import MoonPayRepository from "./moonpay";
import SocialLinkRepository from "./socialLink";
import TopUpRepository from "./topUp";

export {
    TopUpRepository,
    SocialLinkRepository,
    MoonPayRepository,
    IconsRepository,
    SkinRepository,
    CripsrRepository,
    ProviderRepository,
    TopTabRepository,
    DepositBonusRepository,
    PopularNumberRepository,
    TxFeeRepository,
    BiggestBetWinnerRepository, 
    BiggestUserWinnerRepository, 
    LastBetsRepository,
    BalanceRepository,
    AddOnsEcoRepository,
    JackpotRepository,
    AddOnRepository,
    TokenRepository,
    ChatRepository,
    FooterRepository,
    AddressRepository,
    CurrencyRepository,
    TopBarRepository,
    LinkRepository,
    ColorRepository,
    LogoRepository,
    LogRepository,
    BannersRepository,
    CustomizationRepository,
    IntegrationsRepository,
    AffiliateLinkRepository,
    AffiliateRepository,
    AffiliateSetupRepository,
    AffiliateStructureRepository,
    UsersRepository,
    SecurityRepository,
    AppRepository,
    ResultSpaceEcoRepository,
    BlockchainsRepository,
    AuthorizedsRepository,
    BetRepository,
    WithdrawRepository,
    GamesRepository,
    WalletsRepository,
    BetResultSpacesRepository,
    ResultSpacesRepository,
    EventsRepository,
    DepositRepository,
    BetsRepository,
    AdminsRepository,
    TypographyRepository,
    TopIconRepository,
    MailSenderRepository,
    LoadingGifRepository,
    PermissionRepository,
    AutoWithdrawRepository,
    BackgroundRepository,
    PointSystemRepository,
    SubSectionsRepository,
    ProviderTokenRepository,
    CasinoProviderEcoRepository,
    KycRepository,
}