import {AppSchema} from './app';
import {UserSchema} from './user';
import {DepositSchema} from './deposit';
import {GameSchema} from './game';
import {BetSchema} from './bet';
import {AdminSchema} from './admin';
import {EventSchema} from './event';
import {ResultSpaceSchema} from './resultSpace';
import {WithdrawSchema} from './withdraw';
import {BetResultSpaceSchema} from './betResultSpace';
import { WalletSchema } from './wallet';
import { SecuritySchema } from './security';
import { AffiliateStructureSchema } from './affiliateStructure';
import { ChatSchema } from './integrations/chat';
import { CustomizationSchema } from './customization';
import { TopBarSchema } from './customization/topBar';
import { BannersSchema } from './customization/banners';
import { LogoSchema }  from './customization/logo';
import { LogSchema }  from './log';
import { ColorSchema }  from './customization/color';
import { LinkSchema } from './customization/link';
import { FooterSchema } from './customization/footer';
import { TypographySchema } from './typography';
import { CurrencySchema } from './currency';
import { AddressSchema } from './address';
import { TopIconSchema } from './customization/topIcon'
import { TokenSchema } from './token';
import { MailSenderSchema } from './integrations/mailSender';
import { LoadingGifSchema } from "./customization/loadingGif";
import {AddOnSchema } from './addOn';
import { JackpotSchema } from './addOn/jackpot';
import { PermissionSchema } from "./permission";
import { AutoWithdrawSchema } from "./addOn/autoWithdraw";
import { BalanceSchema } from "./addOn/balance";
import { TxFeeSchema } from "./addOn/txFee";
import { BackgroundSchema }  from './customization/background';
import { DepositBonusSchema } from "./addOn/depositBonus";
import { BetEsportsSchema } from "./betEsports";
import { MatchSchema } from "./match";
import { BetResultSchema } from "./betResult";
import { VideogameSchema } from "./videogame";
import { EsportsScrennerSchema } from "./customization/esports_screnner";
import { PointSystemSchema } from "./addOn/pointSystem";
import { TopTabSchema } from "./customization/topTab";
import { SubSectionsSchema } from './customization/subSections';
import { ProviderSchema } from './provider';
import { ProviderTokenSchema } from './providerToken';
import { CripsrSchema } from './integrations/cripsr';
import { MoonPaySchema } from './integrations/moonpay';
import { SkinSchema } from "./customization/skin";
import { KycSchema } from "./integrations/kyc";
import { IconsSchema } from "./customization/icon";
import { SocialLinkSchema } from "./customization/socialLink";
import { AnalyticsSchema } from "./analytics";


export {
    SocialLinkSchema,
    AnalyticsSchema,
    EsportsScrennerSchema,
    VideogameSchema,
    BetResultSchema,
    MoonPaySchema,
    IconsSchema,
    SkinSchema,
    CripsrSchema,
    TopTabSchema,
    DepositBonusSchema,
    TxFeeSchema,
    BalanceSchema,
    CurrencySchema,
    UserSchema,
    LinkSchema,
    TopBarSchema,
    AddressSchema,
    FooterSchema,
    ColorSchema,
    BannersSchema,
    LogoSchema,
    LogSchema,
    CustomizationSchema,
    ChatSchema,
    AppSchema,
    WalletSchema,
    SecuritySchema,
    AffiliateStructureSchema,
    DepositSchema,
    GameSchema,
    BetSchema,
    BetResultSpaceSchema,
    EventSchema,
    WithdrawSchema,
    AdminSchema,
    ResultSpaceSchema,
    TypographySchema,
    TopIconSchema,
    TokenSchema,
    MailSenderSchema,
    LoadingGifSchema,
    AddOnSchema,
    JackpotSchema,
    PermissionSchema,
    AutoWithdrawSchema,
    BackgroundSchema,
    BetEsportsSchema,
    MatchSchema,
    PointSystemSchema,
    SubSectionsSchema,
    ProviderSchema,
    ProviderTokenSchema,
    KycSchema,
}