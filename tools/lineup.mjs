// The channel line-up. Edit this file, then run:
//   node tools/build-channels.mjs && node tools/assemble.mjs
//
// A channel either searches the Archive (q: an archive.org query, n: how many, max: longest
// allowed in seconds) or lists hand-picked items: [archive.org identifier, display title, year].
// hours: [start, end] broadcasts only between those local hours. adult: true asks for 18+ first.

const SPACE_CADETS = [
  ['space-patrol-s-01e-01-low-480x-360p', 'Space Patrol: Web of Arachna', '1950s'],
  ['commandocodyskymarshaloftheuniverses01e03cosmicvengeance', 'Commando Cody: Enemies of the Universe', '1955'],
  ['TheSpaceAdventuresOfFlashGordon_981', 'The Space Adventures of Flash Gordon', '1954'],
  ['rockyJonesSpaceRangerBeyondTheCurtainOfSpace1954', 'Rocky Jones, Space Ranger: Beyond the Curtain of Space', '1954'],
  ['SpacePatrolS03e28MysteriousOceansInSpace', 'Space Patrol: Mysterious Oceans in Space', '1953'],
  ['GracieAllenSpaceGirls', 'Burns and Allen: The Space Patrol Kids Visit', '1951'],
  ['Space-Patrol-TheDeadlyRayGun', 'Space Patrol: The Deadly Ray Gun', '1951'],
  ['rockyJonesSpaceRangerRockysOdyssey1954', 'Rocky Jones, Space Ranger: Rocky’s Odyssey', '1954'],
  ['CommandoCodySkyMarshallOfTheUniversePart1_458', 'Commando Cody: Sky Marshal of the Universe, Part 1', '1955'],
];

const RINGSIDE = [
  ['1949-RollerDerby-NewYorkVsPhiladelphia', 'Roller Derby: New York vs. Philadelphia', '1949'],
  ['YulieBrynnerVsRoseRoman', 'Chicago Wrestling: Yulie Brynner vs. Rose Roman', '1950'],
  ['1950-RollerDerby-NewJerseyVsPhiladelphia', 'Roller Derby: New Jersey vs. Philadelphia', '1950'],
  ['04-wrestling-women-vs-the-aztec-mummy-1964-dub', 'Wrestling Women vs. the Aztec Mummy', '1964'],
  ['1952-RollerDerby-TheChiefsVsTheRedDevils_383', 'Roller Derby: The Chiefs vs. the Red Devils', '1952'],
  ['1950-RollerDerby-NewJerseyVsBrooklyn', 'Roller Derby: New Jersey vs. Brooklyn', '1950'],
];

const PRIME_TIME_TRASH = [
  ['Queen_For_A_Day', 'Queen for a Day', '1960'],
  ['RacketSquadTheSaltedMine1951', 'Racket Squad: The Salted Mine', '1951'],
  ['You_Bet_Your_Life_Groucho', 'You Bet Your Life, with Groucho Marx', '1950s'],
  ['RacketSquadTheCaseOfTheTwoLittleCountryGirls', 'Racket Squad: The Two Little Country Girls', '1951'],
  ['1958EpisodeOfqueenForADay', 'Queen for a Day', '1958'],
  ['RacketSquadKiteHigh', 'Racket Squad: Kite High', '1951'],
  ['RacketSquadAccidentallyOnPurpose', 'Racket Squad: Accidentally on Purpose', '1951'],
  ['queenforaday1963', 'Queen for a Day', '1963'],
  ['RacketSquadTheBillOfSaleRacket', 'Racket Squad: The Bill of Sale Racket', '1951'],
];

const DRIVE_IN = [
  ['Plan9FromOuterSpaceTrailer', 'Trailer: Plan 9 from Outer Space', ''],
  ['plan-9-from-outer-space', 'Plan 9 from Outer Space', '1959'],
  ['RobotMonster-Trailer', 'Trailer: Robot Monster', ''],
  ['robot-monster-1953', 'Robot Monster', '1953'],
  ['ManosTheHandsofFate', 'Manos: The Hands of Fate', '1966'],
  ['KillerShrews-Trailer', 'Trailer: The Killer Shrews', ''],
  ['The_Killer_Shrews', 'The Killer Shrews', '1959'],
  ['teenagers_from_outerspace', 'Teenagers from Outer Space', '1959'],
  ['BrideOfTheMonster-Trailer', 'Trailer: Bride of the Monster', ''],
  ['bride-of-the-monster-1955', 'Bride of the Monster', '1955'],
  ['Beast_of_Yucca_Flats_movie', 'The Beast of Yucca Flats', '1961'],
  ['cco_attackofthegiantleeches', 'Attack of the Giant Leeches', '1959'],
  ['TheCreepingTerrorTrailer', 'Trailer: The Creeping Terror', ''],
  ['TheCreepingTerror', 'The Creeping Terror', '1964'],
  ['giant_gila_monster', 'The Giant Gila Monster', '1959'],
  ['TheRobotVs.TheAztecMummylaMomiaAztecaControElRobotHumano1958-', 'The Robot vs. the Aztec Mummy', '1958'],
  ['The_Amazing_Transparent_Man', 'The Amazing Transparent Man', '1960'],
  ['the-sinister-urge-1960-edward-d.-wood-jr.-ed-wood-cult-b-movie-full-movie', 'The Sinister Urge', '1960'],
  ['SantaClausConquerstheMartians1964', 'Santa Claus Conquers the Martians', '1964'],
];

const SPACE_BABES = [
  ['Cat-womenOfTheMoon-Trailer', 'Trailer: Cat-Women of the Moon', ''],
  ['CatWomenOfTheMoon', 'Cat-Women of the Moon', '1953'],
  ['TheWildWomenOfWongoTrailer', 'Trailer: The Wild Women of Wongo', ''],
  ['The_Wild_Women_Of_Wongo', 'The Wild Women of Wongo', '1958'],
  ['fire-maidens-of-outer-space-1956_202512', 'Fire Maidens of Outer Space', '1956'],
  ['MesaOfLostWomenTrailer', 'Trailer: Mesa of Lost Women', ''],
  ['MesaOfLostWomen', 'Mesa of Lost Women', '1953'],
  ['prehistoric-women-1950', 'Prehistoric Women', '1950'],
  ['TheAstoundingShe-monsterTrailer', 'Trailer: The Astounding She-Monster', ''],
  ['the-astounding-she-monster_202311', 'The Astounding She-Monster', '1957'],
];

const VICE_SQUAD = [
  ['ReeferMadnessTrailer', 'Trailer: Reefer Madness', ''],
  ['reefer_madness1938', 'Reefer Madness', '1936'],
  ['sex_madness', 'Sex Madness', '1938'],
  ['SheShouldaSaidNo', 'She Shoulda Said ‘No’!', '1949'],
  ['The_Cocaine_Fiends', 'The Cocaine Fiends', '1935'],
  ['Test_Tube_Babies_1948', 'Test Tube Babies', '1948'],
  ['Damaged_Lives', 'Damaged Lives', '1933'],
  ['AssassinOfYouth_423', 'Assassin of Youth', '1937'],
  ['Narcotic1933EXPLOITATION', 'Narcotic', '1933'],
];

const BURLESQUE = [
  ['soundie_11', 'Soundie: Jiveroo, with the June Taylor Girls', '1940s'],
  ['Teaserama', 'Teaserama, with Bettie Page & Tempest Storm', '1955'],
  ['BettyPageDressedInSatin', 'Bettie Page: Dressed in Satin', '1950s'],
  ['rosita-royce-dove-dance-1953', 'Striporama: Rosita Royce’s Dove Dance', '1953'],
  ['soundie_12', 'Soundie: Hollywood Boogie', '1946'],
  ['varietease-1954', 'Varietease, with Lili St. Cyr', '1954'],
  ['BettyPageAndHerHighHeeledShoes', 'Bettie Page and Her High-Heeled Shoes', '1950s'],
  ['LampOfMemory', 'Soundie: Lamp of Memory, with Yvonne De Carlo', '1944'],
];

// Soundies were 1940s jukebox films: the first music videos.
const JUKEBOX = [
  ['1083SoundieMinnieTheMoocherCabCalloway', 'Cab Calloway: Minnie the Moocher', '1942'],
  ['SoundieF', 'Reg Kehoe and His Marimba Queens', '1940s'],
  ['st-louis-blues-1929', 'Bessie Smith: St. Louis Blues', '1929'],
  ['WhosYourHoot', 'Who’s Yehudi?', '1942'],
  ['1083SoundieShineLouisArmstrong', 'Louis Armstrong: Shine', '1942'],
  ['SoundieD', 'Zig Me Baby with a Gentle Zag', '1941'],
  ['soundie_10', 'A Jazz Etude', '1941'],
  ['black-and-tan_1929', 'Duke Ellington: Black and Tan', '1929'],
  ['soundie_1', 'The Hut Sut Song', '1941'],
  ['SoundieB', 'Six Hits & a Miss: Sweet Sue (Just You)', '1940s'],
  ['soundie_8', 'Snader Telescription: Daddy', '1951'],
  ['xd-38984c-official-films-african-americanand-southern-soundies-vwr', 'Soundies Reel: Cab Calloway, Louis Armstrong & More', '1940s'],
  ['SoundieH', 'Beyond the Blue Horizon', '1944'],
  ['1083SoundieContinentalConnieHaines', 'Connie Haines: Continental', '1940s'],
  ['Havana-Madri_2', 'Havana-Madrid Show', '1941'],
  ['SoundieM', 'You Can’t Marry Ten Pretty Girls', '1940s'],
  ['0838_Musical_Review_11_Louis_Armstrong_Soundie_11_33_03_18', 'Musical Review #11, with Louis Armstrong', '1940s'],
  ['soundie_4', 'Tica Ti Tica Ta', '1940s'],
  ['SoundieJ', 'Stardust', '1940s'],
  ['the-weavers-all-the-1951-videos', 'The Weavers: Snader Telescriptions', '1951'],
  ['xd-13584-drink-hearty-veto-vwr', 'Soundies Reel: Fats Waller, Red Allen, Louis Armstrong', '1940s'],
  ['SoundieK', 'It’s Got to Be This or That', '1945'],
  ['1083SoundieSailboatInTheSkyJohnnieJohnston', 'Johnnie Johnston: Sailboat in the Sky', '1940s'],
  ['soundie_6', 'Heaven Help a Sailor on a Night Like This', '1940'],
  ['soundie-the-fashionaires-billy-reed', 'The Fashionaires: A Knife, a Fork and a Spoon', '1949'],
  ['SoundieL', 'Lullaby of Broadway', '1940s'],
  ['xd-44594-african-american-sounds-bessie-smith-vwr', 'Soundies Reel: Bessie Smith & 1930s Musical Shorts', '1930s'],
];

const LAB_COAT = [
  ['Yugi-Moto_likes-to_Fart', 'Watch Mr. Wizard', '1954'],
  ['our_mr_sun', 'Bell Science: Our Mr. Sun', '1956'],
  ['IfYouWannaBeHappy', 'Watch Mr. Wizard: Electricity', '1950s'],
  ['isforAto1953', 'A Is for Atom', '1953'],
  ['CCRP-0703A-UM', 'Computer Chronicles: Artificial Intelligence', '1989'],
  ['Mr-Wizard-1-1-1', 'Watch Mr. Wizard: Types of Rocks', '1954'],
  ['flight_of_apollo_11', 'The Eagle Has Landed: The Flight of Apollo 11', '1969'],
  ['MrWizard4', 'Watch Mr. Wizard: Legs and Speed of Animals', '1950s'],
  ['gateways_to_the_mind', 'Bell Science: Gateways to the Mind', '1958'],
  ['CCRP-0419A-UM', 'Computer Chronicles: Modems', '1987'],
  ['HowBloodCirculates', 'Mr. Wizard: How Blood Circulates', '1963'],
  ['bell-science-series-the-strange-case-of-the-cosmic-rays-1957', 'Bell Science: The Strange Case of the Cosmic Rays', '1957'],
  ['WatchMr.Wizard3Episodes', 'Watch Mr. Wizard: Three Episodes', '1950s'],
  ['CCRP-0202A-UM', 'Computer Chronicles: Portables', '1985'],
  ['thread_of_life', 'Bell Science: The Thread of Life', '1960'],
  ['about-time-documentary', 'Bell Science: About Time', '1962'],
  ['ccs01e08utilities', 'Computer Chronicles: Utilities', '1984'],
  ['WatchMrWizard', 'Watch Mr. Wizard: Cereal Institute Film', '1950s'],
  ['Apollo1116mmOnboardFilm', 'Apollo 11: 16mm Onboard Film', '1969'],
];

// Racy Hollywood from before the 1934 Production Code clamped down.
const PRE_CODE = [
  ['hells-angels_1930', 'Hell’s Angels, with Jean Harlow', '1930'],
  ['Bird_of_Paradise_1932', 'Bird of Paradise, with Dolores del Río', '1932'],
  ['TheSinofNoraMoran', 'The Sin of Nora Moran', '1933'],
];

// R-rated at most: GitHub Pages allows non-pornographic nudity, not pornography.
// Nothing explicit, and nothing where a performer or character could be a minor.
const AFTER_DARK = [
  ['glenorglenda_201305', 'Glen or Glenda', '1953'],
  ['Tonight_for_Sure_1962', 'Tonight for Sure', '1962'],
  ['Maniac', 'Maniac', '1934'],
  ['satan-in-high-heels-1962_202603', 'Satan in High Heels', '1962'],
  ['The_Naked_Witch_1964', 'The Naked Witch', '1964'],
  ['Marihuana-the_Devils_Weed', 'Marihuana', '1936'],
  ['NUDEONTHEMOONTrailer', 'Trailer: Nude on the Moon', ''],
  ['nude-on-the-moon-1961', 'Nude on the Moon', '1961'],
  ['OrgyOfTheDeadTrailer', 'Trailer: Orgy of the Dead', ''],
  ['1965-orgy-of-the-dead', 'Orgy of the Dead', '1965'],
];

// Stockings, heels, girdles and 1950s fetish photographers' reels. Same limits as After Dark.
const NYLONS = [
  ['Synthetic_Fibers_Nylon_and_Rayon', 'Synthetic Fibers: Nylon and Rayon', '1949'],
  ['BettiePagepinUpBeautiesFight1950sFetishStagFilm', 'Irving Klaw: Pin-Up Beauties Fight, with Bettie Page', '1950s'],
  ['vintage-felina-1950-girdle-commercial', 'Ad: Felina Girdles', '1950'],
  ['the-pin-up-poses-of-blaze-starr-1956', 'The Pin-Up Poses of Blaze Starr', '1956'],
  ['SF173', 'Office Fashion Show', '1950s'],
  ['HumanPonyGirl50sIrvingKlawFetishStagFilm', 'Irving Klaw: Riding the Human Pony Girl', '1950s'],
  ['1969CommercialForPlaytexCrossYourHeartBra', 'Ad: Playtex Cross Your Heart', '1969'],
  ['1952-sugar-strip', 'Sugar Strip, with Jennie Lee', '1952'],
  ['ZippCast-59b541981914a108c63', 'Irving Klaw: Bound Beauties', '1950s'],
  ['sunny-knight', 'Sunny Knight', '1949'],
  ['1969CommercialForPlaytexLivingLonglineBra', 'Ad: Playtex Living Longline', '1969'],
  ['BettiePageSpankedSlaveGirlRareBondageFetishStagFilm', 'Irving Klaw: Jungle Bettie, with Bettie Page', '1955'],
  ['peek-a-boo.-1953', 'Peek-a-Boo', '1953'],
  ['1980-commercial-for-l-eggs-pantyhose', 'Ad: L’eggs Pantyhose', '1980'],
  ['betty_202402', 'Bettie Page Catfight', '1950s'],
  ['PinUpGirl', 'Pin Up Girl, with Carole Landis', '1943'],
  ['ripped-clothing-fight', 'Irving Klaw: Clothing Ripped Off in Fight', '1950s'],
  ['jane-russell-playtex-bra-1980-tv-commercial', 'Ad: Jane Russell for Playtex', '1980'],
  ['bettie-page-assorted-films', 'Irving Klaw: Teaser Girl, with Bettie Page', '1950s'],
];

const JUVIE = [
  ['TheViolentYears', 'The Violent Years', '1956'],
  ['0248_Are_You_Popular_E00020_19_00_34_00', 'Are You Popular?', '1947'],
  ['CoolHotRodA', 'Cool Hot Rod', '1953'],
  ['TeenageDevilDolls', 'Teenage Devil Dolls', '1955'],
  ['GoingSte1951', 'Going Steady?', '1951'],
  ['HowMuchA1958', 'How Much Affection?', '1958'],
  ['GirlGang1954', 'Girl Gang', '1954'],
  ['ShyGuy1947', 'Shy Guy', '1947'],
  ['last_date', 'Last Date', '1949'],
  ['AgeofTur1953', 'Age of Turmoil', '1953'],
  ['WhatAbou1955', 'What About Juvenile Delinquency?', '1955'],
  ['DatingDo1949_201805', 'Dating: Do’s and Don’ts', '1949'],
];

const LATE = [22, 4];   // 10 PM to 4 AM, viewer's local time

export const CHANNELS = [
  { num: 13, slug: 'creature',    name: 'Creature Feature', tag: 'Sci-fi & horror B-movies',                    q: 'collection:SciFi_Horror', n: 20, max: 7200 },
  { num: 17, slug: 'juvie',       name: 'Juvie',            tag: 'Girl gangs, hot rods & going steady',         items: JUVIE },
  { num: 21, slug: 'labcoat',     name: 'Lab Coat',         tag: 'Mr. Wizard, Bell Science, Apollo & Computer Chronicles', items: LAB_COAT },
  { num: 29, slug: 'ads',        name: 'Ad Break',         tag: 'Vintage commercials',                         q: 'collection:classic_tv_commercials', n: 40, max: 1800 },
  { num: 31, slug: 'spacecadets', name: 'Space Cadets',     tag: 'Tin-foil space serials from early TV',        items: SPACE_CADETS },
  { num: 33, slug: 'ringside',    name: 'Ringside',         tag: 'Roller derby, wrestling & luchadoras',        items: RINGSIDE },
  { num: 35, slug: 'primetime',   name: 'Prime Time Trash', tag: 'Sob-story game shows & con-man crime TV',     items: PRIME_TIME_TRASH },
  { num: 45, slug: 'jukebox',     name: 'Jukebox',          tag: 'Soundies, Snader Telescriptions & early jazz shorts', items: JUKEBOX },
  { num: 61, slug: 'drivein',    name: 'Drive-In',         tag: 'Monster movies so bad they’re good',          items: DRIVE_IN },
  { num: 63, slug: 'spacebabes',  name: 'Space Babes',      tag: 'Cat-women, cave girls & B-movie bombshells',  items: SPACE_BABES },
  { num: 66, slug: 'vice',        name: 'Vice Squad',       tag: 'Reefer, cocaine & “sex hygiene” scare films', items: VICE_SQUAD },
  { num: 69, slug: 'nylons',      name: 'Nylons & Heels',   tag: 'Stockings, girdles, pin-ups & Irving Klaw fetish reels. 18+, 10 PM to 4 AM', items: NYLONS, hours: LATE, adult: true },
  { num: 77, slug: 'precode',     name: 'Pre-Code',         tag: 'Racy Hollywood from before the censors arrived', items: PRE_CODE },
  { num: 88, slug: 'burlesque',  name: 'Burlesque',        tag: 'Strip-tease revues & cheesecake Soundies, 10 PM to 4 AM', items: BURLESQUE, hours: LATE },
  { num: 99, slug: 'afterdark',   name: 'After Dark',       tag: 'Fetish reels, nudie films & shockers. 18+, 10 PM to 4 AM', items: AFTER_DARK, hours: LATE, adult: true },
];
