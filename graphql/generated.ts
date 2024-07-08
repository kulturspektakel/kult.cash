export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends {[key: string]: unknown}, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | {[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: {input: string; output: string};
  String: {input: string; output: string};
  Boolean: {input: boolean; output: boolean};
  Int: {input: number; output: number};
  Float: {input: number; output: number};
  Date: {input: any; output: any};
  DateTime: {input: any; output: any};
};

export type Area = Node & {
  __typename?: 'Area';
  bandsPlaying: Array<BandPlaying>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  openingHour: Array<OpeningHour>;
  themeColor: Scalars['String']['output'];
};

export type AreaBandsPlayingArgs = {
  day: Scalars['Date']['input'];
};

export type AreaOpeningHourArgs = {
  day?: InputMaybe<Scalars['Date']['input']>;
};

export type Asset = {
  copyright?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  uri: Scalars['String']['output'];
};

export type BandApplication = Node & {
  __typename?: 'BandApplication';
  bandApplicationRating: Array<BandApplicationRating>;
  bandname: Scalars['String']['output'];
  city: Scalars['String']['output'];
  comments: BandApplicationCommentsConnection;
  contactName: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  contactedByViewer?: Maybe<Viewer>;
  createdAt: Scalars['DateTime']['output'];
  demo?: Maybe<Scalars['String']['output']>;
  demoEmbed?: Maybe<Scalars['String']['output']>;
  demoEmbedType?: Maybe<DemoEmbedType>;
  demoEmbedUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  distance?: Maybe<Scalars['Float']['output']>;
  email: Scalars['String']['output'];
  event: Event;
  eventId: Scalars['ID']['output'];
  facebook?: Maybe<Scalars['String']['output']>;
  facebookLikes?: Maybe<Scalars['Int']['output']>;
  genre?: Maybe<Scalars['String']['output']>;
  genreCategory: GenreCategory;
  hasPreviouslyPlayed?: Maybe<PreviouslyPlayed>;
  heardAboutBookingFrom?: Maybe<HeardAboutBookingFrom>;
  id: Scalars['ID']['output'];
  instagram?: Maybe<Scalars['String']['output']>;
  instagramFollower?: Maybe<Scalars['Int']['output']>;
  knowsKultFrom?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  numberOfArtists?: Maybe<Scalars['Int']['output']>;
  numberOfNonMaleArtists?: Maybe<Scalars['Int']['output']>;
  pastApplications: Array<BandApplication>;
  pastPerformances: Array<BandPlaying>;
  rating?: Maybe<Scalars['Float']['output']>;
  repertoire?: Maybe<BandRepertoireType>;
  spotifyArtist?: Maybe<Scalars['String']['output']>;
  spotifyMonthlyListeners?: Maybe<Scalars['Int']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type BandApplicationCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type BandApplicationComment = Node & {
  __typename?: 'BandApplicationComment';
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  user: Viewer;
};

export type BandApplicationCommentInput = {
  bandApplicationId: Scalars['ID']['input'];
  comment: Scalars['String']['input'];
};

export type BandApplicationCommentsConnection = {
  __typename?: 'BandApplicationCommentsConnection';
  edges: Array<BandApplicationCommentsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BandApplicationCommentsConnectionEdge = {
  __typename?: 'BandApplicationCommentsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: BandApplicationComment;
};

export type BandApplicationRating = {
  __typename?: 'BandApplicationRating';
  rating: Scalars['Int']['output'];
  viewer: Viewer;
};

export type BandApplicationUpdateInput = {
  contacted?: InputMaybe<Scalars['Boolean']['input']>;
  instagramFollower?: InputMaybe<Scalars['Int']['input']>;
};

export type BandPlaying = Node & {
  __typename?: 'BandPlaying';
  area: Area;
  description?: Maybe<Scalars['String']['output']>;
  endTime: Scalars['DateTime']['output'];
  event: Event;
  eventId: Scalars['ID']['output'];
  facebook?: Maybe<Scalars['String']['output']>;
  genre?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  instagram?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  photo?: Maybe<PixelImage>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  soundcloud?: Maybe<Scalars['String']['output']>;
  spotify?: Maybe<Scalars['String']['output']>;
  startTime: Scalars['DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
  youtube?: Maybe<Scalars['String']['output']>;
};

export enum BandRepertoireType {
  ExclusivelyCoverSongs = 'ExclusivelyCoverSongs',
  ExclusivelyOwnSongs = 'ExclusivelyOwnSongs',
  MostlyCoverSongs = 'MostlyCoverSongs',
  MostlyOwnSongs = 'MostlyOwnSongs',
}

export type Billable = {
  salesNumbers: Array<SalesNumber>;
};

export type BillableSalesNumbersArgs = {
  after: Scalars['DateTime']['input'];
  before: Scalars['DateTime']['input'];
};

export type Board = {
  __typename?: 'Board';
  chair: Scalars['String']['output'];
  deputy: Scalars['String']['output'];
  deputy2: Scalars['String']['output'];
  observer: Scalars['String']['output'];
  observer2: Scalars['String']['output'];
  secretary: Scalars['String']['output'];
  treasurer: Scalars['String']['output'];
};

export type Card = Node &
  Transactionable & {
    __typename?: 'Card';
    id: Scalars['ID']['output'];
    transactions: CardTransactionConnection;
  };

export type CardTransactionsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<CardTransactionType>;
};

export type CardStatus = {
  __typename?: 'CardStatus';
  balance: Scalars['Int']['output'];
  cardId: Scalars['ID']['output'];
  deposit: Scalars['Int']['output'];
  hasNewerTransactions?: Maybe<Scalars['Boolean']['output']>;
  recentTransactions?: Maybe<Array<Transaction>>;
};

export type CardTransaction = Transaction & {
  __typename?: 'CardTransaction';
  Order?: Maybe<Order>;
  balanceAfter: Scalars['Int']['output'];
  balanceBefore: Scalars['Int']['output'];
  cardId: Scalars['String']['output'];
  clientId: Scalars['String']['output'];
  depositAfter: Scalars['Int']['output'];
  depositBefore: Scalars['Int']['output'];
  deviceTime: Scalars['DateTime']['output'];
  transactionType: CardTransactionType;
};

export type CardTransactionConnection = {
  __typename?: 'CardTransactionConnection';
  /** This includes money made from deposit */
  balanceTotal: Scalars['Int']['output'];
  data: Array<CardTransaction>;
  depositIn: Scalars['Int']['output'];
  depositOut: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  uniqueCards: Scalars['Int']['output'];
};

export enum CardTransactionType {
  Cashout = 'Cashout',
  Charge = 'Charge',
  TopUp = 'TopUp',
}

export type Config = {
  __typename?: 'Config';
  board: Board;
  depositValue: Scalars['Int']['output'];
};

export type CreateBandApplicationInput = {
  bandname: Scalars['String']['input'];
  city: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  demo?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  email: Scalars['String']['input'];
  facebook?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Scalars['String']['input']>;
  genreCategory: GenreCategory;
  hasPreviouslyPlayed?: InputMaybe<PreviouslyPlayed>;
  heardAboutBookingFrom?: InputMaybe<HeardAboutBookingFrom>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  knowsKultFrom?: InputMaybe<Scalars['String']['input']>;
  numberOfArtists?: InputMaybe<Scalars['Int']['input']>;
  numberOfNonMaleArtists?: InputMaybe<Scalars['Int']['input']>;
  repertoire?: InputMaybe<BandRepertoireType>;
  spotifyArtist?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export enum DemoEmbedType {
  BandcampAlbum = 'BandcampAlbum',
  BandcampTrack = 'BandcampTrack',
  SoundcloudUrl = 'SoundcloudUrl',
  SpotifyAlbum = 'SpotifyAlbum',
  SpotifyArtist = 'SpotifyArtist',
  SpotifyTrack = 'SpotifyTrack',
  Unresolvable = 'Unresolvable',
  YouTubePlaylist = 'YouTubePlaylist',
  YouTubeVideo = 'YouTubeVideo',
}

export type Device = Billable &
  Node &
  Transactionable & {
    __typename?: 'Device';
    id: Scalars['ID']['output'];
    lastSeen?: Maybe<Scalars['DateTime']['output']>;
    productList?: Maybe<ProductList>;
    salesNumbers: Array<SalesNumber>;
    softwareVersion?: Maybe<Scalars['String']['output']>;
    transactions: CardTransactionConnection;
  };

export type DeviceSalesNumbersArgs = {
  after: Scalars['DateTime']['input'];
  before: Scalars['DateTime']['input'];
};

export type DeviceTransactionsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<CardTransactionType>;
};

export enum DeviceType {
  ContactlessTerminal = 'CONTACTLESS_TERMINAL',
  Ipad = 'IPAD',
}

export enum DirectusPixelImageFormat {
  Auto = 'auto',
  Jpg = 'jpg',
  Original = 'original',
  Png = 'png',
  Tiff = 'tiff',
  Webp = 'webp',
}

export type Event = Node & {
  __typename?: 'Event';
  bandApplication: Array<BandApplication>;
  bandApplicationEnd?: Maybe<Scalars['DateTime']['output']>;
  bandApplicationStart?: Maybe<Scalars['DateTime']['output']>;
  bandsPlaying: EventBandsPlayingConnection;
  description?: Maybe<Scalars['String']['output']>;
  djApplicationEnd?: Maybe<Scalars['DateTime']['output']>;
  djApplicationStart?: Maybe<Scalars['DateTime']['output']>;
  end: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  media: EventMediaConnection;
  name: Scalars['String']['output'];
  poster?: Maybe<PixelImage>;
  start: Scalars['DateTime']['output'];
};

export type EventBandsPlayingArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type EventMediaArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type EventBandsPlayingConnection = {
  __typename?: 'EventBandsPlayingConnection';
  edges: Array<EventBandsPlayingConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EventBandsPlayingConnectionEdge = {
  __typename?: 'EventBandsPlayingConnectionEdge';
  cursor: Scalars['String']['output'];
  node: BandPlaying;
};

export type EventMediaConnection = {
  __typename?: 'EventMediaConnection';
  edges: Array<EventMediaConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EventMediaConnectionEdge = {
  __typename?: 'EventMediaConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Asset;
};

export enum EventType {
  Kulturspektakel = 'Kulturspektakel',
  Locker = 'Locker',
  Other = 'Other',
}

export enum GenreCategory {
  BluesFunkJazzSoul = 'Blues_Funk_Jazz_Soul',
  Dj = 'DJ',
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
  name: Scalars['String']['output'];
  productListId: Scalars['ID']['output'];
  salesNumbers: Array<SalesNumber>;
};

export type HistoricalProductSalesNumbersArgs = {
  after: Scalars['DateTime']['input'];
  before: Scalars['DateTime']['input'];
};

export type MarkdownString = {
  __typename?: 'MarkdownString';
  images: Array<PixelImage>;
  markdown: Scalars['String']['output'];
  plainText: Scalars['String']['output'];
};

export type MissingTransaction = Transaction & {
  __typename?: 'MissingTransaction';
  balanceAfter: Scalars['Int']['output'];
  balanceBefore: Scalars['Int']['output'];
  depositAfter: Scalars['Int']['output'];
  depositBefore: Scalars['Int']['output'];
  numberOfMissingTransactions: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBandApplication: BandApplication;
  createBandApplicationComment: BandApplication;
  createNonceRequest?: Maybe<Scalars['String']['output']>;
  createOrder: Order;
  deleteBandApplicationComment: BandApplication;
  markBandApplicationContacted: BandApplication;
  nonceFromRequest?: Maybe<Scalars['String']['output']>;
  rateBandApplication: BandApplication;
  updateBandApplication: BandApplication;
  updateDeviceProductList: Device;
  upsertProductList: ProductList;
};

export type MutationCreateBandApplicationArgs = {
  data: CreateBandApplicationInput;
  eventId: Scalars['ID']['input'];
};

export type MutationCreateBandApplicationCommentArgs = {
  input: BandApplicationCommentInput;
};

export type MutationCreateNonceRequestArgs = {
  email: Scalars['String']['input'];
};

export type MutationCreateOrderArgs = {
  deposit: Scalars['Int']['input'];
  deviceTime: Scalars['DateTime']['input'];
  payment: OrderPayment;
  products: Array<OrderItemInput>;
};

export type MutationDeleteBandApplicationCommentArgs = {
  id: Scalars['ID']['input'];
};

export type MutationMarkBandApplicationContactedArgs = {
  bandApplicationId: Scalars['ID']['input'];
  contacted: Scalars['Boolean']['input'];
};

export type MutationNonceFromRequestArgs = {
  nonceRequestId: Scalars['String']['input'];
};

export type MutationRateBandApplicationArgs = {
  bandApplicationId: Scalars['ID']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateBandApplicationArgs = {
  bandApplicationId: Scalars['ID']['input'];
  data?: InputMaybe<BandApplicationUpdateInput>;
};

export type MutationUpdateDeviceProductListArgs = {
  deviceId: Scalars['ID']['input'];
  productListId: Scalars['ID']['input'];
};

export type MutationUpsertProductListArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  products?: InputMaybe<Array<ProductInput>>;
};

export type News = Node & {
  __typename?: 'News';
  content: MarkdownString;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type NuclinoPage = Node & {
  __typename?: 'NuclinoPage';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUpdatedAt: Scalars['DateTime']['output'];
  lastUpdatedUser: NuclinoUser;
  title: Scalars['String']['output'];
};

export type NuclinoSearchResult = {
  __typename?: 'NuclinoSearchResult';
  highlight?: Maybe<Scalars['String']['output']>;
  page: NuclinoPage;
};

export type NuclinoUser = {
  __typename?: 'NuclinoUser';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

export type ObfuscatedBandApplication = {
  __typename?: 'ObfuscatedBandApplication';
  applicationTime: Scalars['DateTime']['output'];
  obfuscatedEmail: Scalars['String']['output'];
};

export type OpeningHour = {
  __typename?: 'OpeningHour';
  endTime: Scalars['DateTime']['output'];
  startTime: Scalars['DateTime']['output'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  deposit: Scalars['Int']['output'];
  deviceId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['Int']['output'];
  items: Array<OrderItem>;
  payment: OrderPayment;
  total: Scalars['Int']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  amount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  perUnitPrice: Scalars['Int']['output'];
  productList?: Maybe<ProductList>;
};

export type OrderItemInput = {
  amount: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  perUnitPrice: Scalars['Int']['input'];
  productListId?: InputMaybe<Scalars['Int']['input']>;
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

export type Page = Node & {
  __typename?: 'Page';
  bottom?: Maybe<MarkdownString>;
  content?: Maybe<MarkdownString>;
  id: Scalars['ID']['output'];
  left?: Maybe<MarkdownString>;
  right?: Maybe<MarkdownString>;
  title: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PixelImage = Asset & {
  __typename?: 'PixelImage';
  copyright?: Maybe<Scalars['String']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  scaledUri: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  uri: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type PixelImageScaledUriArgs = {
  format?: InputMaybe<DirectusPixelImageFormat>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export enum PreviouslyPlayed {
  No = 'No',
  OtherFormation = 'OtherFormation',
  Yes = 'Yes',
}

export type Product = Billable &
  Node & {
    __typename?: 'Product';
    additives: Array<ProductAdditives>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    price: Scalars['Int']['output'];
    productListId: Scalars['ID']['output'];
    requiresDeposit: Scalars['Boolean']['output'];
    salesNumbers: Array<SalesNumber>;
  };

export type ProductSalesNumbersArgs = {
  after: Scalars['DateTime']['input'];
  before: Scalars['DateTime']['input'];
};

export type ProductAdditives = {
  __typename?: 'ProductAdditives';
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ProductInput = {
  additives: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  requiresDeposit: Scalars['Boolean']['input'];
};

export type ProductList = Billable &
  Node & {
    __typename?: 'ProductList';
    active: Scalars['Boolean']['output'];
    description?: Maybe<Scalars['String']['output']>;
    emoji?: Maybe<Scalars['String']['output']>;
    historicalProducts: Array<HistoricalProduct>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    product: Array<Product>;
    salesNumbers: Array<SalesNumber>;
  };

export type ProductListSalesNumbersArgs = {
  after: Scalars['DateTime']['input'];
  before: Scalars['DateTime']['input'];
};

export type Query = {
  __typename?: 'Query';
  areas: Array<Area>;
  bandPlaying?: Maybe<BandPlaying>;
  cardStatus: CardStatus;
  checkDuplicateApplication?: Maybe<ObfuscatedBandApplication>;
  config: Config;
  crewCalendar: Array<VEvent>;
  devices: Array<Device>;
  distanceToKult?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use `eventsConnection` instead. */
  events: Array<Event>;
  eventsConnection: QueryEventsConnection;
  findBandPlaying: Array<BandPlaying>;
  news: QueryNewsConnection;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  nuclinoPages: Array<NuclinoSearchResult>;
  productAdditives: Array<ProductAdditives>;
  productLists: Array<ProductList>;
  spotifyArtist: Array<SpotifyArtist>;
  transactions: Transactions;
  viewer?: Maybe<Viewer>;
};

export type QueryBandPlayingArgs = {
  eventId: Scalars['ID']['input'];
  slug: Scalars['String']['input'];
};

export type QueryCardStatusArgs = {
  payload: Scalars['String']['input'];
};

export type QueryCheckDuplicateApplicationArgs = {
  bandname: Scalars['String']['input'];
  eventId: Scalars['ID']['input'];
};

export type QueryCrewCalendarArgs = {
  includePastEvents?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryDevicesArgs = {
  type?: InputMaybe<DeviceType>;
};

export type QueryDistanceToKultArgs = {
  origin: Scalars['String']['input'];
};

export type QueryEventsArgs = {
  hasBandsPlaying?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<EventType>;
};

export type QueryEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasBandsPlaying?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<EventType>;
};

export type QueryFindBandPlayingArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

export type QueryNewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};

export type QueryNuclinoPagesArgs = {
  query: Scalars['String']['input'];
};

export type QueryProductAdditivesArgs = {
  type?: InputMaybe<DeviceType>;
};

export type QueryProductListsArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuerySpotifyArtistArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

export type QueryEventsConnection = {
  __typename?: 'QueryEventsConnection';
  edges: Array<QueryEventsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryEventsConnectionEdge = {
  __typename?: 'QueryEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type QueryNewsConnection = {
  __typename?: 'QueryNewsConnection';
  edges: Array<QueryNewsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryNewsConnectionEdge = {
  __typename?: 'QueryNewsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: News;
};

export type SalesNumber = {
  __typename?: 'SalesNumber';
  count: Scalars['Int']['output'];
  payment: OrderPayment;
  timeSeries: Array<TimeSeries>;
  total: Scalars['Float']['output'];
};

export type SalesNumberTimeSeriesArgs = {
  grouping?: InputMaybe<TimeGrouping>;
};

export type SpotifyArtist = {
  __typename?: 'SpotifyArtist';
  genre?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export enum TimeGrouping {
  Day = 'Day',
  Hour = 'Hour',
}

export type TimeSeries = {
  __typename?: 'TimeSeries';
  time: Scalars['DateTime']['output'];
  value: Scalars['Int']['output'];
};

export type Transaction = {
  balanceAfter: Scalars['Int']['output'];
  balanceBefore: Scalars['Int']['output'];
  depositAfter: Scalars['Int']['output'];
  depositBefore: Scalars['Int']['output'];
};

export type Transactionable = {
  transactions: CardTransactionConnection;
};

export type TransactionableTransactionsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<CardTransactionType>;
};

export type Transactions = Transactionable & {
  __typename?: 'Transactions';
  transactions: CardTransactionConnection;
};

export type TransactionsTransactionsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<CardTransactionType>;
};

export type VEvent = {
  __typename?: 'VEvent';
  allDay: Scalars['Boolean']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTime']['output'];
  location?: Maybe<Scalars['String']['output']>;
  start: Scalars['DateTime']['output'];
  summary: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type Viewer = Node & {
  __typename?: 'Viewer';
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
};

export type CardFragmentFragment = {
  __typename?: 'CardStatus';
  balance: number;
  deposit: number;
};

type CardTransactionFragment_CardTransaction_Fragment = {
  __typename: 'CardTransaction';
  deviceTime: any;
  depositBefore: number;
  depositAfter: number;
  balanceBefore: number;
  balanceAfter: number;
  Order?: {
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
  } | null;
};

type CardTransactionFragment_MissingTransaction_Fragment = {
  __typename: 'MissingTransaction';
  numberOfMissingTransactions: number;
  depositBefore: number;
  depositAfter: number;
  balanceBefore: number;
  balanceAfter: number;
};

export type CardTransactionFragmentFragment =
  | CardTransactionFragment_CardTransaction_Fragment
  | CardTransactionFragment_MissingTransaction_Fragment;

export type CardStatusQueryVariables = Exact<{
  payload: Scalars['String']['input'];
}>;

export type CardStatusQuery = {
  __typename?: 'Query';
  cardStatus: {
    __typename?: 'CardStatus';
    cardId: string;
    hasNewerTransactions?: boolean | null;
    balance: number;
    deposit: number;
    recentTransactions?: Array<
      | {
          __typename: 'CardTransaction';
          deviceTime: any;
          depositBefore: number;
          depositAfter: number;
          balanceBefore: number;
          balanceAfter: number;
          Order?: {
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
          } | null;
        }
      | {
          __typename: 'MissingTransaction';
          numberOfMissingTransactions: number;
          depositBefore: number;
          depositAfter: number;
          balanceBefore: number;
          balanceAfter: number;
        }
    > | null;
  };
};
