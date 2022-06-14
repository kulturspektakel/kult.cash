export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Area = Node & {
  __typename?: 'Area';
  availability: Array<TableAvailability>;
  availableTables: Scalars['Int'];
  bandsPlaying: Array<Band>;
  displayName: Scalars['String'];
  id: Scalars['ID'];
  openingHour: Array<OpeningHour>;
  table: Array<Table>;
  themeColor: Scalars['String'];
};

export type AreaAvailabilityArgs = {
  day: Scalars['Date'];
  partySize: Scalars['Int'];
};

export type AreaAvailableTablesArgs = {
  time?: InputMaybe<Scalars['DateTime']>;
};

export type AreaBandsPlayingArgs = {
  day: Scalars['Date'];
};

export type AreaOpeningHourArgs = {
  day?: InputMaybe<Scalars['Date']>;
};

export type Band = {
  __typename?: 'Band';
  description?: Maybe<Scalars['String']>;
  endTime: Scalars['DateTime'];
  genre?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  startTime: Scalars['DateTime'];
};

export type BandApplication = Node & {
  __typename?: 'BandApplication';
  bandApplicationRating: Array<BandApplicationRating>;
  bandname: Scalars['String'];
  city: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  contactedByViewer?: Maybe<Viewer>;
  demo?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  distance?: Maybe<Scalars['Float']>;
  email: Scalars['String'];
  facebook?: Maybe<Scalars['String']>;
  facebookLikes?: Maybe<Scalars['Int']>;
  genre?: Maybe<Scalars['String']>;
  genreCategory: GenreCategory;
  hasPreviouslyPlayed?: Maybe<PreviouslyPlayed>;
  heardAboutBookingFrom?: Maybe<HeardAboutBookingFrom>;
  id: Scalars['ID'];
  instagram?: Maybe<Scalars['String']>;
  instagramFollower?: Maybe<Scalars['Int']>;
  knowsKultFrom?: Maybe<Scalars['String']>;
  numberOfArtists?: Maybe<Scalars['Int']>;
  numberOfNonMaleArtists?: Maybe<Scalars['Int']>;
  rating?: Maybe<Scalars['Float']>;
  website?: Maybe<Scalars['String']>;
};

export type BandApplicationRating = {
  __typename?: 'BandApplicationRating';
  rating: Scalars['Int'];
  viewer: Viewer;
};

export type Billable = {
  salesNumbers: SalesNumber;
};

export type BillableSalesNumbersArgs = {
  after: Scalars['DateTime'];
  before: Scalars['DateTime'];
};

export type Board = {
  __typename?: 'Board';
  chair: Scalars['String'];
  deputy: Scalars['String'];
  deputy2: Scalars['String'];
  observer: Scalars['String'];
  observer2: Scalars['String'];
  secretary: Scalars['String'];
  treasurer: Scalars['String'];
};

export type CardStatus = {
  __typename?: 'CardStatus';
  balance: Scalars['Int'];
  cardId: Scalars['ID'];
  deposit: Scalars['Int'];
  recentTransactions?: Maybe<Array<Transaction>>;
};

export type CardTransaction = Transaction & {
  __typename?: 'CardTransaction';
  Order: Array<Order>;
  balanceAfter: Scalars['Int'];
  balanceBefore: Scalars['Int'];
  cardId: Scalars['String'];
  clientId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  depositAfter: Scalars['Int'];
  depositBefore: Scalars['Int'];
  deviceTime: Scalars['DateTime'];
  /** Total transaction amount, including deposit. Negative values indicate top ups/deposit returns. */
  total?: Maybe<Scalars['Int']>;
  transactionType: CardTransactionType;
};

export type CardTransactionInput = {
  __typename?: 'CardTransactionInput';
  pack: Scalars['String'];
  password: Scalars['String'];
  payload: Scalars['String'];
};

export enum CardTransactionType {
  Cashout = 'Cashout',
  Charge = 'Charge',
  TopUp = 'TopUp',
}

export type Config = {
  __typename?: 'Config';
  board?: Maybe<Board>;
  depositValue: Scalars['Int'];
  reservationStart: Scalars['DateTime'];
};

export type CreateBandApplicationInput = {
  bandname: Scalars['String'];
  city: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  demo: Scalars['String'];
  description: Scalars['String'];
  email: Scalars['String'];
  facebook?: InputMaybe<Scalars['String']>;
  genre?: InputMaybe<Scalars['String']>;
  genreCategory: GenreCategory;
  hasPreviouslyPlayed?: InputMaybe<PreviouslyPlayed>;
  heardAboutBookingFrom?: InputMaybe<HeardAboutBookingFrom>;
  instagram?: InputMaybe<Scalars['String']>;
  knowsKultFrom?: InputMaybe<Scalars['String']>;
  numberOfArtists: Scalars['Int'];
  numberOfNonMaleArtists: Scalars['Int'];
  website?: InputMaybe<Scalars['String']>;
};

export type Device = Billable & {
  __typename?: 'Device';
  cardTransactions: Array<CardTransaction>;
  id: Scalars['ID'];
  lastSeen?: Maybe<Scalars['DateTime']>;
  productList?: Maybe<ProductList>;
  salesNumbers: SalesNumber;
  softwareVersion?: Maybe<Scalars['String']>;
};

export type DeviceCardTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type DeviceSalesNumbersArgs = {
  after: Scalars['DateTime'];
  before: Scalars['DateTime'];
};

export enum DeviceType {
  ContactlessTerminal = 'CONTACTLESS_TERMINAL',
  Ipad = 'IPAD',
}

export type Event = Node & {
  __typename?: 'Event';
  bandApplication: Array<BandApplication>;
  bandApplicationEnd?: Maybe<Scalars['DateTime']>;
  bandApplicationStart?: Maybe<Scalars['DateTime']>;
  bandsPlaying: Array<Band>;
  end: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  start: Scalars['DateTime'];
};

export enum GenreCategory {
  BluesFunkJazzSoul = 'Blues_Funk_Jazz_Soul',
  ElektroHipHop = 'Elektro_HipHop',
  FolkSingerSongwriterCountry = 'Folk_SingerSongwriter_Country',
  HardrockMetalPunk = 'Hardrock_Metal_Punk',
  Indie = 'Indie',
  Other = 'Other',
  Pop = 'Pop',
  ReggaeSka = 'Reggae_Ska',
  Rock = 'Rock',
}

export enum HeardAboutBookingFrom {
  BYon = 'BYon',
  Facebook = 'Facebook',
  Friends = 'Friends',
  Instagram = 'Instagram',
  Newspaper = 'Newspaper',
  Website = 'Website',
}

export type HistoricalProduct = Billable & {
  __typename?: 'HistoricalProduct';
  name: Scalars['String'];
  productListId: Scalars['Int'];
  salesNumbers: SalesNumber;
};

export type HistoricalProductSalesNumbersArgs = {
  after: Scalars['DateTime'];
  before: Scalars['DateTime'];
};

export type MissingTransaction = Transaction & {
  __typename?: 'MissingTransaction';
  balanceAfter: Scalars['Int'];
  balanceBefore: Scalars['Int'];
  depositAfter: Scalars['Int'];
  depositBefore: Scalars['Int'];
  numberOfMissingTransactions: Scalars['Int'];
  /** Total transaction amount, including deposit. Negative values indicate top ups/deposit returns. */
  total?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelReservation?: Maybe<Scalars['Boolean']>;
  checkInReservation?: Maybe<Reservation>;
  confirmReservation?: Maybe<Reservation>;
  createBandApplication?: Maybe<BandApplication>;
  createCardTransaction?: Maybe<CardTransactionInput>;
  createOrder?: Maybe<Order>;
  createReservation?: Maybe<Reservation>;
  markBandApplicationContacted?: Maybe<BandApplication>;
  rateBandApplication?: Maybe<BandApplication>;
  requestReservation: Scalars['Boolean'];
  swapReservations?: Maybe<Scalars['Boolean']>;
  updateDeviceProductList?: Maybe<Device>;
  updateReservation?: Maybe<Reservation>;
  updateReservationOtherPersons?: Maybe<Reservation>;
  upsertProductList?: Maybe<ProductList>;
};

export type MutationCancelReservationArgs = {
  token: Scalars['String'];
};

export type MutationCheckInReservationArgs = {
  checkedInPersons: Scalars['Int'];
  id: Scalars['Int'];
};

export type MutationConfirmReservationArgs = {
  token: Scalars['String'];
};

export type MutationCreateBandApplicationArgs = {
  data: CreateBandApplicationInput;
};

export type MutationCreateCardTransactionArgs = {
  balanceAfter: Scalars['Int'];
  cardUri: Scalars['String'];
  depositAfter: Scalars['Int'];
};

export type MutationCreateOrderArgs = {
  deposit: Scalars['Int'];
  deviceTime: Scalars['DateTime'];
  payment: OrderPayment;
  products: Array<OrderItemInput>;
};

export type MutationCreateReservationArgs = {
  endTime: Scalars['DateTime'];
  note?: InputMaybe<Scalars['String']>;
  otherPersons: Array<Scalars['String']>;
  primaryEmail: Scalars['String'];
  primaryPerson: Scalars['String'];
  startTime: Scalars['DateTime'];
  tableId: Scalars['ID'];
};

export type MutationMarkBandApplicationContactedArgs = {
  bandApplicationId: Scalars['ID'];
  contacted: Scalars['Boolean'];
};

export type MutationRateBandApplicationArgs = {
  bandApplicationId: Scalars['ID'];
  rating?: InputMaybe<Scalars['Int']>;
};

export type MutationRequestReservationArgs = {
  areaId: Scalars['ID'];
  endTime: Scalars['DateTime'];
  otherPersons: Array<Scalars['String']>;
  primaryEmail: Scalars['String'];
  primaryPerson: Scalars['String'];
  startTime: Scalars['DateTime'];
  tableType?: InputMaybe<TableType>;
};

export type MutationSwapReservationsArgs = {
  a: Scalars['Int'];
  b: Scalars['Int'];
};

export type MutationUpdateDeviceProductListArgs = {
  deviceId: Scalars['ID'];
  productListId?: InputMaybe<Scalars['Int']>;
};

export type MutationUpdateReservationArgs = {
  checkedInPersons?: InputMaybe<Scalars['Int']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['Int'];
  note?: InputMaybe<Scalars['String']>;
  primaryPerson?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  tableId?: InputMaybe<Scalars['ID']>;
};

export type MutationUpdateReservationOtherPersonsArgs = {
  otherPersons: Array<Scalars['String']>;
  token: Scalars['String'];
};

export type MutationUpsertProductListArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  emoji?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  products?: InputMaybe<Array<ProductInput>>;
};

export type Node = {
  /** Unique identifier for the resource */
  id: Scalars['ID'];
};

export type NuclinoPage = {
  __typename?: 'NuclinoPage';
  content: Scalars['String'];
  id: Scalars['ID'];
  lastUpdatedAt: Scalars['DateTime'];
  lastUpdatedUser: NuclinoUser;
  title: Scalars['String'];
};

export type NuclinoSearchResult = {
  __typename?: 'NuclinoSearchResult';
  highlight: Scalars['String'];
  page: NuclinoPage;
};

export type NuclinoUser = {
  __typename?: 'NuclinoUser';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
};

export type OpeningHour = {
  __typename?: 'OpeningHour';
  endTime: Scalars['DateTime'];
  startTime: Scalars['DateTime'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime'];
  deposit: Scalars['Int'];
  deviceId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  items: Array<OrderItem>;
  payment: OrderPayment;
  total?: Maybe<Scalars['Int']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  perUnitPrice: Scalars['Int'];
  productList?: Maybe<ProductList>;
};

export type OrderItemInput = {
  amount: Scalars['Int'];
  name: Scalars['String'];
  note?: InputMaybe<Scalars['String']>;
  perUnitPrice: Scalars['Int'];
  productListId?: InputMaybe<Scalars['Int']>;
};

export enum OrderPayment {
  Bon = 'BON',
  Cash = 'CASH',
  FreeBand = 'FREE_BAND',
  FreeCrew = 'FREE_CREW',
  KultCard = 'KULT_CARD',
  SumUp = 'SUM_UP',
  Voucher = 'VOUCHER',
}

export enum PreviouslyPlayed {
  No = 'No',
  OtherFormation = 'OtherFormation',
  Yes = 'Yes',
}

export type Product = Billable & {
  __typename?: 'Product';
  id: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Int'];
  productListId: Scalars['Int'];
  requiresDeposit: Scalars['Boolean'];
  salesNumbers: SalesNumber;
};

export type ProductSalesNumbersArgs = {
  after: Scalars['DateTime'];
  before: Scalars['DateTime'];
};

export type ProductInput = {
  name: Scalars['String'];
  price: Scalars['Int'];
  requiresDeposit?: InputMaybe<Scalars['Boolean']>;
};

export type ProductList = Billable & {
  __typename?: 'ProductList';
  active: Scalars['Boolean'];
  emoji?: Maybe<Scalars['String']>;
  historicalProducts: Array<HistoricalProduct>;
  id: Scalars['Int'];
  name: Scalars['String'];
  product: Array<Product>;
  salesNumbers: SalesNumber;
};

export type ProductListSalesNumbersArgs = {
  after: Scalars['DateTime'];
  before: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  areas: Array<Area>;
  availableCapacity: Scalars['Int'];
  cardStatus: CardStatus;
  config?: Maybe<Config>;
  devices: Array<Device>;
  distanceToKult?: Maybe<Scalars['Float']>;
  events: Array<Event>;
  node?: Maybe<Node>;
  nuclinoPage?: Maybe<NuclinoPage>;
  nuclinoPages: Array<NuclinoSearchResult>;
  productList?: Maybe<ProductList>;
  productLists: Array<ProductList>;
  reservationForToken?: Maybe<Reservation>;
  reservationsByPerson: Array<ReservationByPerson>;
  viewer?: Maybe<Viewer>;
};

export type QueryAvailableCapacityArgs = {
  time?: InputMaybe<Scalars['DateTime']>;
};

export type QueryCardStatusArgs = {
  payload: Scalars['String'];
};

export type QueryDevicesArgs = {
  type?: InputMaybe<DeviceType>;
};

export type QueryDistanceToKultArgs = {
  origin: Scalars['String'];
};

export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export type QueryNuclinoPageArgs = {
  id: Scalars['ID'];
};

export type QueryNuclinoPagesArgs = {
  query: Scalars['String'];
};

export type QueryProductListArgs = {
  id: Scalars['Int'];
};

export type QueryReservationForTokenArgs = {
  token: Scalars['String'];
};

export type Reservation = {
  __typename?: 'Reservation';
  alternativeTables: Array<Maybe<Table>>;
  availableToCheckIn: Scalars['Int'];
  checkInTime?: Maybe<Scalars['DateTime']>;
  checkedInPersons: Scalars['Int'];
  endTime: Scalars['DateTime'];
  id: Scalars['Int'];
  note?: Maybe<Scalars['String']>;
  otherPersons: Array<Scalars['String']>;
  primaryEmail: Scalars['String'];
  primaryPerson: Scalars['String'];
  reservationsFromSamePerson: Array<Reservation>;
  startTime: Scalars['DateTime'];
  status: ReservationStatus;
  swappableWith: Array<Maybe<Reservation>>;
  table: Table;
  tableId: Scalars['String'];
  token: Scalars['String'];
};

export type ReservationByPerson = {
  __typename?: 'ReservationByPerson';
  email: Scalars['String'];
  reservations: Array<Reservation>;
};

export enum ReservationStatus {
  CheckedIn = 'CheckedIn',
  Confirmed = 'Confirmed',
  Pending = 'Pending',
}

export type SalesNumber = {
  __typename?: 'SalesNumber';
  count: Scalars['Int'];
  timeSeries: Array<TimeSeries>;
  total: Scalars['Float'];
};

export type SalesNumberTimeSeriesArgs = {
  grouping?: InputMaybe<TimeGrouping>;
};

export type Table = Node & {
  __typename?: 'Table';
  area: Area;
  displayName: Scalars['String'];
  id: Scalars['ID'];
  maxCapacity: Scalars['Int'];
  reservations: Array<Reservation>;
  type: TableType;
};

export type TableReservationsArgs = {
  day?: InputMaybe<Scalars['Date']>;
};

export type TableAvailability = {
  __typename?: 'TableAvailability';
  endTime: Scalars['DateTime'];
  startTime: Scalars['DateTime'];
  tableType: TableType;
};

export enum TableType {
  Island = 'ISLAND',
  Table = 'TABLE',
}

export enum TimeGrouping {
  Day = 'Day',
  Hour = 'Hour',
}

export type TimeSeries = {
  __typename?: 'TimeSeries';
  time: Scalars['DateTime'];
  value: Scalars['Int'];
};

export type Transaction = {
  balanceAfter: Scalars['Int'];
  balanceBefore: Scalars['Int'];
  depositAfter: Scalars['Int'];
  depositBefore: Scalars['Int'];
  /** Total transaction amount, including deposit. Negative values indicate top ups/deposit returns. */
  total?: Maybe<Scalars['Int']>;
};

export type Viewer = Node & {
  __typename?: 'Viewer';
  displayName: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  profilePicture?: Maybe<Scalars['String']>;
};

export type CardFragmentFragment = {
  __typename?: 'CardStatus';
  balance: number;
  deposit: number;
};

type CardTransactionFragment_CardTransaction_Fragment = {
  __typename?: 'CardTransaction';
  deviceTime: any;
  depositBefore: number;
  depositAfter: number;
  balanceBefore: number;
  balanceAfter: number;
  Order: Array<{
    __typename?: 'Order';
    items: Array<{
      __typename?: 'OrderItem';
      amount: number;
      name: string;
      productList?: {
        __typename?: 'ProductList';
        emoji?: string | null;
        name: string;
      } | null;
    }>;
  }>;
};

type CardTransactionFragment_MissingTransaction_Fragment = {
  __typename?: 'MissingTransaction';
  numberOfMissingTransactions: number;
  depositBefore: number;
  depositAfter: number;
  balanceBefore: number;
  balanceAfter: number;
};

export type CardTransactionFragmentFragment =
  | CardTransactionFragment_CardTransaction_Fragment
  | CardTransactionFragment_MissingTransaction_Fragment;

export type MissingTransactionFragmentFragment = {
  __typename?: 'MissingTransaction';
  numberOfMissingTransactions: number;
};

export type CardStatusQueryVariables = Exact<{
  payload: Scalars['String'];
}>;

export type CardStatusQuery = {
  __typename?: 'Query';
  cardStatus: {
    __typename?: 'CardStatus';
    cardId: string;
    balance: number;
    deposit: number;
    recentTransactions?: Array<
      | {
          __typename?: 'CardTransaction';
          deviceTime: any;
          depositBefore: number;
          depositAfter: number;
          balanceBefore: number;
          balanceAfter: number;
          Order: Array<{
            __typename?: 'Order';
            items: Array<{
              __typename?: 'OrderItem';
              amount: number;
              name: string;
              productList?: {
                __typename?: 'ProductList';
                emoji?: string | null;
                name: string;
              } | null;
            }>;
          }>;
        }
      | {
          __typename?: 'MissingTransaction';
          numberOfMissingTransactions: number;
          depositBefore: number;
          depositAfter: number;
          balanceBefore: number;
          balanceAfter: number;
        }
    > | null;
  };
};

type RecentTransactionsFragment_CardTransaction_Fragment = {
  __typename: 'CardTransaction';
  deviceTime: any;
  depositBefore: number;
  depositAfter: number;
  balanceBefore: number;
  balanceAfter: number;
  Order: Array<{
    __typename?: 'Order';
    items: Array<{
      __typename?: 'OrderItem';
      amount: number;
      name: string;
      productList?: {
        __typename?: 'ProductList';
        emoji?: string | null;
        name: string;
      } | null;
    }>;
  }>;
};

type RecentTransactionsFragment_MissingTransaction_Fragment = {
  __typename: 'MissingTransaction';
  numberOfMissingTransactions: number;
};

export type RecentTransactionsFragmentFragment =
  | RecentTransactionsFragment_CardTransaction_Fragment
  | RecentTransactionsFragment_MissingTransaction_Fragment;
