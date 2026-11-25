// The channel line-up. Edit this file, then run:
//   node tools/build-channels.mjs && node tools/assemble.mjs
//
// A channel either searches the Archive (q: an archive.org query, n: how many, max: longest
// allowed in seconds) or lists hand-picked items: [archive.org identifier, display title, year].
// hours: [start, end] broadcasts only between those local hours. adult: true asks for 18+ first.

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
  ['slave_in_bondage', 'Slaves in Bondage', '1937'],
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
  ['alphabet_conspiracy', 'Bell Science: The Alphabet Conspiracy', '1959'],
  ['Apollo15And1616mmOnboardFilm', 'Apollo 15 & 16: 16mm Onboard Film', '1971–72'],
  ['skylab_zero-g', 'Skylab: Zero G', '1973'],
  ['CCRP-1107A-BS', 'Computer Chronicles: The Internet', '1993'],
  ['gov.archives.arc.59760', 'Voyager 2: Rendezvous with Saturn', '1981'],
  ['bacteria_friend_and_foe', 'Bacteria: Friend and Foe', '1950s'],
  ['gov.archives.arc.1157922', 'Space Shuttle: A Remarkable Flying Machine', '1981'],
  ['skylab_gyroscopes_in_space', 'Skylab: Gyroscopes in Space', '1973'],
  ['marsthevikingmission', 'Mars: The Viking Mission', '1979'],
  ['CCRP-1230A-BS', 'Computer Chronicles: PC Video', '1995'],
  ['200634_The_Growth_of_Plants', 'The Growth of Plants', '1940s'],
  ['gov.ntis.ava03129vnb1', 'Time of Apollo', '1975'],
  ['skylab_magnetism_in_space', 'Skylab: Magnetism in Space', '1973'],
  ['voyager_grand_tour', 'Voyager: The Grand Tour', '1990'],
  ['starfinder_17_hubble_instruments', 'Starfinder: Hubble’s Instruments', '1990'],
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
  ['too-hot-to-handle-1960-the-pink-flamingo-cut', 'Trailer: Too Hot to Handle', '', '1Too Hot to Handle 1960 The Pink Flamingo Cut Trailer.mp4'],
  ['too-hot-to-handle-1960-the-pink-flamingo-cut', 'Too Hot to Handle, with Jayne Mansfield', '1960', '1Too Hot to Handle 1960 The Pink Flamingo Cut.mp4'],
  ['sinema-trailer_shanty-tramp', 'Trailer: Shanty Tramp', '1967'],
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
  ['ripped-clothing-fight', 'Irving Klaw: Clothing Ripped Off in Fight', '1950s', 'Clothing Ripped Off In Fight.mp4'],
  ['jane-russell-playtex-bra-1980-tv-commercial', 'Ad: Jane Russell for Playtex', '1980'],
  ['tempest-storm-1952', 'Tempest Storm', '1952'],
  ['UnionSqu1950', 'Newsreel: Fashion Show in Union Square', '1950'],
  ['StripperDixieEvans', 'Dixie Evans, the Marilyn of Burlesque', '1950s'],
  ['bettie-page-assorted-films', 'Irving Klaw: Teaser Girl, with Bettie Page', '1950s', 'Bettie Page Teaser Girl 1.mp4'],
  ["64614StudiosOnParadeFootageVwr", "Silk Stocking Parade", "1950s"],
  ["bettie-page-assorted-films", "Bettie Page: Teaser Girl in High Heels", "1950s", "Bettie_Page-Teaser_Girl_In_High_Heels.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Negligee Fight", "1950s", "Negligee Fight.mp4"],
  ["stripper_georgia_sothern", "Georgia Sothern", "1940s"],
  ["bettie-page-assorted-films", "Bettie Page: Fireplace Dance", "1950s", "Bettie Page-Betty's Fireplace Dance.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Leg Wrestling and Scissor Holds", "1950s", "Leg Wrestling And Scissor Holds.mp4"],
  ["1985-commercial-for-razza-matazz-hosiery", "Ad: Razzamatazz Hosiery", "1985"],
  ["LadyofBurlesque", "Lady of Burlesque, with Barbara Stanwyck", "1943"],
  ["TeriMartineInLadyPhotographer8mmGlamourFilm", "Teri Martine: Lady Photographer", "1960s"],
  ["bettie-page-assorted-films", "Bettie Page: Dance of Passion", "1950s", "Bettie Page-Dance of Passion.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Leggy Leer Wrestles Jonnie", "1950s", "Leggy Leer Wrestles With Jonnie.mp4"],
  ["youtube-Z0FiDWbUc3Q", "Ad: The Apple Bra", "1980"],
  ["Stripper-BlazeStarr-BurlesqueQueen", "Blaze Starr, Burlesque Queen", "1950s"],
  ["bettie-page-assorted-films", "Bettie Page: The Red Dress", "1950s", "Bettie Page-Red Dress.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Gun Fight", "1950s", "Gun Fight.mp4"],
  ["0733_Soundies_Variety_Girls_Burlesque_04_29_02_05", "Soundies: Variety Girls", "1948"],
  ["bettie-page-assorted-films", "Bettie Page: Sorority Girl", "1950s", "Bettie_Page-Sorority_Girl.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Head Scissor Fight", "1950s", "Head Scissor Fight.mp4"],
  ["stripper_betty_rowland", "Betty Rowland, the Ball of Fire", "1940s"],
  ["Dr.Sex", "Dr. Sex", "1964"],
  ["bettie-page-assorted-films", "Bettie Page: Tantalizing Betty Dances Again", "1950s", "Bettie Page-Tantalizing Betty Dances Again.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Sandra Battles Nora", "1950s", "Sandra Battles Nora.mp4"],
  ["bettie-page-assorted-films", "Bettie Page: Second G-String Dance", "1950s", "Bettie Page-Betty's Second G-String Dance.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Pin-Down Fight", "1950s", "Pin Down Fight.mp4"],
  ["bettie-page-assorted-films", "Bettie Page: Teaser Girl 2", "1950s", "Bettie Page Teaser Girl 2.mp4"],
  ["ripped-clothing-fight", "Irving Klaw: Lively Pin-Down Struggle", "1950s", "Lively Pin Down Struggle.mp4"],
  ["LessonOfTheStrap50sBondage-spankingFetishStagFilm", "Lesson of the Strap", "1950s"],
];

// Blonde bombshells, jungle girls and bad girls. Nothing with nudity: this one is on all day.
const BOMBSHELL = [
  ['ladies-of-the-chorus-free-movie-marilyn-monroe-adele-jergens', 'Ladies of the Chorus, with Marilyn Monroe', '1948'],
  ['she_gods_of_shark_reef', 'She Gods of Shark Reef', '1958'],
  ['FemJungle', 'Female Jungle, with Jayne Mansfield', '1956'],
  ['JungleSiren', 'Jungle Siren, with Ann Corio', '1942'],
  ['RC_SwampWomen', 'Swamp Women', '1955'],
  ['PrehistoricWomen_514', 'Prehistoric Women', '1950'],
  ['DanceHallRacket', 'Dance Hall Racket', '1953'],
];

// 80s Saturday-morning feel: toy and cereal ad breaks, Forest Service PSAs, and free cartoons
// (the 80s shows themselves are still under copyright).
const SATURDAY = [
  ['rainbow-bright-and-he-man-1985-commercials', 'Ads: Rainbow Brite & He-Man Breaks', '1985'],
  ['superman_1941', 'Superman', '1941'],
  ['1985-hasbro-transformers-christmas-alex-karras-these-robots-are-hot-tv-commercial', 'Ad: Transformers', '1985'],
  ['clutchcargocartooonscollection', 'Clutch Cargo: Air Race', '1959', 'CLUTCH CARGO Air Race.mp4'],
  ['WoodsyOwlPSACollection1965-1985', 'PSAs: Woodsy Owl', '1965–85'],
  ['SpaceAngelCartoonsCollection', 'Space Angel: Cosmic Combat', '1962', 'SpaceAngelCosmicCombat.mp4'],
  ['Vintage_Commercials_Advertisements_80s', 'Ads: CBS Saturday Morning', '1984', 'CBS Commercials 04-14-84 A.mp4'],
  ['Vintage_Commercials_Advertisements_80s', 'Ads: CBS Saturday Morning', '1984', 'CBS Commercials 04-14-84 B.mp4'],
  ['Vintage_Commercials_Advertisements_80s', 'Ads: CBS Saturday Morning', '1984', 'CBS Commercials 04-14-84 C.mp4'],
  ['noveltoon_casper_tfg_theres_good_boos_tonight', 'Casper: There’s Good Boos Tonight', '1948'],
  ['TransformersAustralianToyCommercials1987', 'Ads: Transformers (Australia)', '1987'],
  ['superman_the_mechanical_monsters', 'Superman: The Mechanical Monsters', '1941'],
  ['DKJrCereal_6-16-84', 'Ad: Donkey Kong Jr. Cereal', '1984'],
  ['clutchcargocartooonscollection', 'Clutch Cargo: Crop Dusters', '1959', 'CLUTCH CARGO Crop Dusters.mp4'],
  ['jan-9th-1985-channel-5-and-13-new-york-he-man-raccons-on-ice-she-ra-commercials', 'Ads: He-Man, She-Ra & ThunderCats Breaks', '1985'],
  ['superman_electric_earthquake', 'Superman: Electric Earthquake', '1942'],
  ['cabbage-patch-kids-commercial-collection', 'Ad: Cabbage Patch Kids', '1983', "1980's Cabbage Patch Kids Ads/Cabbage Patch Kids Commercial 1983.mp4"],
  ['cabbage-patch-kids-commercial-collection', 'Ad: Cabbage Patch Kids', '1985', "1980's Cabbage Patch Kids Ads/Cabbage Patch Kids Commercial 1985 a.mp4"],
  ['SpaceAngelCartoonsCollection', 'Space Angel: Expedition to a New Moon', '1962', 'SpaceAngelExpeditionToANewMoon.mp4'],
  ['SmokeyBearFirePreventionPSAs1960-1980', 'PSAs: Smokey Bear', '1960–80'],
  ['mr.-bug-goes-to-town-1941', 'Mr. Bug Goes to Town', '1941'],
  ['G11987', 'Ads: Transformers Headmasters & Targetmasters', '1987'],
  ['clutchcargocartooonscollection', 'Clutch Cargo: Mister Abominable', '1959', 'CLUTCH CARGO Mister Abominable.mp4'],
  ['80-s-commercials-vol-4.-title-1', 'Ads: 80s Toy Commercials', '1980s'],
  ['superman_eleventh_hour', 'Superman: Eleventh Hour', '1942'],
  ['Vintage_Commercials_Advertisements_80s', 'Ads: ABC Saturday Morning', '1987', 'ABC Commercials 07_25_87 A.mp4'],
  ['Vintage_Commercials_Advertisements_80s', 'Ads: ABC Saturday Morning', '1987', 'ABC Commercials 07_25_87 B.mp4'],
  ['casper-the-friendly-ghost-boo-moon-1953', 'Casper: Boo Moon', '1953'],
  ['80s-90s-toy-commercial-compilation-nostalgia-720p', 'Ads: Teddy Ruxpin, Micro Machines & More', '1980s–90s'],
  ['SpaceAngelCartoonsCollection', 'Space Angel: The Fugitives', '1962', 'SpaceAngelTheFugitives.mp4'],
  ['Vintage_Commercials_Advertisements_80s', 'Ads: During Muppet Babies', '1980s', '1 80s Adverts Muppet Babies CBS source.mp4'],
  ['Superman_The_Magnetic_Telescope', 'Superman: The Magnetic Telescope', '1942'],
  ['rialto.0002', 'PSA: No Smoking', '1979'],
  ['clutchcargocartooonscollection', 'Clutch Cargo: The Missing Mermaid', '1959', 'Clutch Cargo The Missing Mermaid.mp4'],
];

// Musclemen, Amazon queens and captive women from Italian peplum epics.
const SWORDS = [
  ["HerculesUnchained", "Hercules Unchained", "1959"],
  ["turner_video_393139", "Clip: The Loves of Hercules, with Jayne Mansfield", "1960"],
  ["Colossus_and_the_Amazon_Queen", "Colossus and the Amazon Queen", "1960"],
  ["QueenoftheAmazons", "Queen of the Amazons", "1947"],
  ["cco__HerculesandtheCaptiveWomen", "Hercules and the Captive Women", "1961"],
  ["TheMightyThorAgainstTheQueenOfTheAmazonsthorAndTheAmazonWomen-", "Thor and the Amazon Women", "1963"],
  ["Hercules_Against_the_Moon_Men", "Hercules Against the Moon Men", "1964"],
];

export const CHANNELS = [
  { num: 8,  slug: 'saturday',    name: 'Saturday Morning', tag: '80s toy & cereal ads, Superman, Clutch Cargo & Space Angel', items: SATURDAY },
  { num: 21, slug: 'labcoat',     name: 'Lab Coat',         tag: 'Mr. Wizard, Bell Science, NASA & Computer Chronicles', items: LAB_COAT },
  { num: 29, slug: 'ads',        name: 'Ad Break',         tag: 'Vintage commercials',                         q: 'collection:classic_tv_commercials', n: 40, max: 1800 },
  { num: 38, slug: 'bombshell',   name: 'Bombshell',        tag: 'Marilyn, Jayne, jungle sirens & swamp women', items: BOMBSHELL },
  { num: 51, slug: 'swords',      name: 'Sword & Sandal',   tag: 'Hercules, Amazon queens & captive women',     items: SWORDS },
  { num: 63, slug: 'spacebabes',  name: 'Space Babes',      tag: 'Cat-women, cave girls & B-movie bombshells',  items: SPACE_BABES },
  { num: 66, slug: 'vice',        name: 'Vice Squad',       tag: 'Reefer, cocaine & “sex hygiene” scare films', items: VICE_SQUAD },
  { num: 69, slug: 'nylons',      name: 'Nylons & Heels',   tag: 'Stockings, heels, burlesque queens, Bettie Page & Irving Klaw fetish reels. 18+', items: NYLONS, adult: true },
  { num: 77, slug: 'precode',     name: 'Pre-Code',         tag: 'Racy Hollywood from before the censors arrived', items: PRE_CODE },
  { num: 88, slug: 'burlesque',  name: 'Burlesque',        tag: 'Strip-tease revues & cheesecake Soundies', items: BURLESQUE },
  { num: 99, slug: 'afterdark',   name: 'After Dark',       tag: 'Fetish reels, nudie films & shockers. 18+', items: AFTER_DARK, adult: true },
];
