import { Organization, Appeal } from '../types';

export const SEKTOR_INFO = {
  sectorNumber: 1,
  title: 'Paxtachi tumani 1-sektori',
  leaderRole: 'Tuman hokimi',
  secretaryName: 'Abdutganiev Sarvar Akram o‘g‘li',
  secretaryRole: 'Tuman hokimligi yetakchi mutaxassisi (sektor kotibi)',
  secretaryPhone: '+998 94 062-05-55',
  headquartersPhone: '+998 94 062-05-55',
};

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Tuman Ichki ishlar bo‘limi (IIB)',
    code: 'IIB-01',
    category: 'Huquq-tartibot va Xavfsizlik',
    phone: '+998 94 186-15-02',
    leader: 'Temirov Sardor Baxriddinovich',
    password: 'IIB#Paxtachi@771!Sec',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-2',
    name: 'Tuman Soliq inspeksiyasi',
    code: 'TSI-02',
    category: 'Soliq va Moliya',
    phone: '+998 94 186-15-02',
    leader: 'Razzoqov Bobur Komilovich',
    password: 'Soliq$Tsi2026*Tax',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-3',
    name: 'Kambag‘allikni qisqartirish va bandlikka ko‘maklashish bo‘limi',
    code: 'KQBB-03',
    category: 'Bandlik va Ijtimoiy Himoya',
    phone: '+998 97 395-74-73',
    leader: 'Rashidov Mashrab Mamatmurodovich',
    password: 'Bandlik&Kqbb#2026!Job',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-4',
    name: 'Tuman iqtisodiyot va moliya bo‘limi',
    code: 'TIMB-04',
    category: 'Iqtisodiyot va Moliya',
    phone: '+998 95 705-88-99',
    leader: 'Kayumova Gavhar Akramovna',
    password: 'Moliya#Timb@884!Fin',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-5',
    name: 'Davlat kadastrlari palatasi tuman filiali',
    code: 'DKP-05',
    category: 'Yer va Kadastr',
    phone: '+998 94 484-28-80',
    leader: 'Arnaqulov Jalol Shukurullayevich',
    password: 'Kadastr$Dkp2026*Geo',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-6',
    name: 'Tuman tibbiy birlashmasi (Sog‘liqni saqlash)',
    code: 'TTB-06',
    category: "Sog'liqni Saqlash",
    phone: '+998 94 045-03-13',
    leader: 'Xolboev Olim',
    password: 'Tibbiyot#Ttb@103!Med',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-7',
    name: 'Uzagroinspeksiyaning Paxtachi tumani bo‘limi',
    code: 'UAI-07',
    category: "Qishloq xo'jaligi va Agrosanoat nazorati",
    phone: '+998 93 124-60-60',
    leader: 'Saimov Buxron Olimovich',
    password: 'Fermer&Fdthk#2026!Agro',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-8',
    name: 'Tuman yo‘llardan foydalanish korxonasi',
    code: 'TYFK-08',
    category: "Yo'l xo'jaligi",
    phone: '+998 93 463-57-59',
    leader: 'Fayurov Sherzod Faxriddinovich',
    password: 'Yollar$Tyfk2026*Road',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-9',
    name: 'Maktabgacha va maktab ta’limi bo‘limi',
    code: 'MMTB-09',
    category: "Ta'lim va Tarbiya",
    phone: '+998 93 727-79-75',
    leader: 'Rustamov Asqarjon Axmedovich',
    password: 'Talim#Mmtb@559!Edu',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-10',
    name: 'Hududgaz Paxtachi tuman gaz bo‘limi',
    code: 'HG-10',
    category: 'Gaz Ta\'minoti',
    phone: '+998 99 257-52-67',
    leader: 'Kulpiyev Kaxramon Sa’dullaevich',
    password: 'Gaz$Hudud10*Energy',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-11',
    name: '“Samarqand suv ta’minoti” AJ Paxtachi tuman filiali',
    code: 'SST-11',
    category: 'Suv Ta\'minoti',
    phone: '+998 93 810-03-12',
    leader: 'Rustamov Murodulla Rustamovich',
    password: 'Suv#Sst11@Aqua!2026',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-12',
    name: 'Tuman elektr ta’minoti korxonasi',
    code: 'TETK-12',
    category: 'Elektr Energiyasi',
    phone: '+998 94 228-28-71',
    leader: 'Usmonov Ramiz Xolmurodovich',
    password: 'Elektr$Tetk12*Power',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-13',
    name: 'Sanitariya-epidemiologik osoyishtalik bo‘limi (SEO va JS)',
    code: 'SEOJS-13',
    category: 'Sanitariya va Epidemiologiya',
    phone: '+998 94 478-57-97',
    leader: 'Ibodov Shaxzod Abdunasimovich',
    password: 'Sanitariya#Seojs@13!Safe',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-14',
    name: 'ATB “Mikrokreditbank” Ziyovuddin BXM',
    code: 'MKB-14',
    category: 'Bank va Kredit',
    phone: '+998 88 011-99-29',
    leader: 'Amirov Ilyos Maxsildinovich',
    password: 'Agrobank$Ab14*Credit',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-15',
    name: '“Inson” ijtimoiy xizmatlar markazi',
    code: 'IIM-15',
    category: 'Ijtimoiy Xizmatlar',
    phone: '+998 97 685-06-07',
    leader: 'Tofaev Habibjon Zoxidjonovich',
    password: 'Inson#Iim15@Care!2026',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-16',
    name: 'Tuman obodonlashtirish boshqarmasi',
    code: 'OB-16',
    category: 'Kommunal va Obodonlashtirish',
    phone: '+998 94 481-15-86',
    leader: 'Farmanov Halim Norqulovich',
    password: 'Obodlik$Ob16*Eco!26',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-17',
    name: 'Tuman Suv yetkazib berish xizmati davlat muassasasi (irrigatsiya)',
    code: 'SYX-17',
    category: 'Suv xo\'jaligi va Irrigatsiya',
    phone: '+998 94 241-01-14',
    leader: 'Xasanov Abdulxoliq Alisherovich',
    password: 'Irrigatsiya#Syx17*Flow',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
  {
    id: 'org-18',
    name: 'O‘zbekiston mahallalar uyushmasi tuman bo‘limi',
    code: 'MMU-18',
    category: 'Mahalla va Jamoatchilik',
    phone: '+998 93 229-77-22',
    leader: 'Xayrullaev Vosit Jasurovich',
    password: 'Uyushma#Mmu18@Mfy!2026',
    totalAppeals: 0,
    resolvedAppeals: 0,
    inProgressAppeals: 0,
    objectionAppeals: 0,
    rejectedAuthorityAppeals: 0,
  },
];

export const INITIAL_APPEALS: Appeal[] = [];

export interface DefaultTaskTemplate {
  taskNumber: number;
  title: string;
  description: string;
}

// 1. Tuman IIB profilaktika inspektori uchun 7 ta asosiy profilaktika vazifasi
export const IIB_7_TASKS: DefaultTaskTemplate[] = [
  {
    taskNumber: 1,
    title: 'Yoshlar tarbiyasi, sog‘lom turmush tarzi va uyushmagan yoshlar bilan ishlash',
    description: 'Yoshlarni vatanparvarlik, qonunga itoatkorlik ruhida tarbiyalash, sog‘lom turmush tarzini yuritish, bilim olishga intilish, ularda kitob o‘qishga qiziqish uyg‘otish, shu jumladan uyushmagan yoshlarni aniqlash va ular bilan profilaktika ishlarini o‘tkazish chora-tadbirlari ko‘rilganligi holatlarini o‘rganish, aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish, uning ijrosini ta’minlash ijrosi yuzasidan tegishli ma’lumotlarni yig‘ish, sektor shtabiga taqdim qilish va sektor shtabida sohaga oid ma’lumotlarni yangilab borish.',
  },
  {
    taskNumber: 2,
    title: 'Kriminogen vaziyat, ijtimoiy-iqtisodiy ahvol tahlili va murakkab mahallalarni o‘rganish',
    description: 'Har oyda sektordagi mahallalarda kriminogen vaziyat, ijtimoiy va iqtisodiy ahvol tahlil qilinib, vaziyat murakkab bo‘lgan, huquqbuzarlik va jinoyat ko‘p sodir etilayotgan yoki ortgan mahallalarni ajratib olish va bunda profilaktik tadbirlardan samarali foydalanish;',
  },
  {
    taskNumber: 3,
    title: 'Profilaktik hisobda turgan shaxslar ro‘yxati va elektron bazasini shakllantirish',
    description: 'Sektordagi mahallalarda aniq va manzilli ish olib borish uchun shartli ravishda profilaktik hisobda turgan shaxslarning ro‘yxati shakllantirish va ularning elektron bazasini yaratish;',
  },
  {
    taskNumber: 4,
    title: 'Sektorning jinoyatchilik pasporti va muammolarni bartaraf etish "Yo‘l xaritasi"',
    description: 'Sektorning jinoyatchilik va huquqbuzarliklarga oid pasportini shakllantirilganligi, aniqlangan muammo, kamchiliklardan kelib chiqqan xolda (jinoyatchilikka qarshi kurash, ijtimoiy-iqtisodiy va boshqalar) ularni yechimini topish borasida aniq yo‘naltirilgan “yo‘l xaritasi” ishlab chiqilganligi;',
  },
  {
    taskNumber: 5,
    title: 'Mutasaddi idoralar hamkorligi va jamoatchilik ishtirokini samarali yo‘lga qo‘yish',
    description: 'Jinoyatchilik va huquqbuzarliklarni barvaqt oldini olishda mutasaddi idoralarning hamkorligi va bu borada jamoatchilik ishtirokining samarali yo‘lga qo‘yish;',
  },
  {
    taskNumber: 6,
    title: 'Ijtimoiy hayotda oilaning rolini kuchaytirish chora-tadbirlari',
    description: 'Mas’ul tashkilotlar bilan birgalikda ijtimoiy hayotda oilaning rolini kuchaytirish chora-tadbirlari amalga oshirish;',
  },
  {
    taskNumber: 7,
    title: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish',
    description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
  },
];

// Compatibility
export const DEFAULT_SEKTOR_TASKS = IIB_7_TASKS;

// 18 ta tashkilotning har birining sohasiga mos rasmiy shtab vazifalar to'plami
export const ORG_DEFAULT_TASKS: Record<string, DefaultTaskTemplate[]> = {
  // 1. Tuman IIB profilaktika inspektori (7 ta vazifa)
  'org-1': IIB_7_TASKS,

  // 2. Tuman Soliq inspeksiyasi (5 ta vazifa)
  'org-2': [
    {
      taskNumber: 1,
      title: 'Soliq to‘lovchilar ro‘yxatini shakllantirish',
      description: 'Sektor hududida soliq to‘lovchilarning ro‘yxatlarini shakllantirish.',
    },
    {
      taskNumber: 2,
      title: 'Soliq to‘lovlari tahlillari va takliflar kiritish',
      description: 'Soliq to‘lovi yuzasidan har chorakda tahlillar olib borish, tahlillar natijasiga ko‘ra takliflar kiritish.',
    },
    {
      taskNumber: 3,
      title: 'Soliq intizomini yaxshilash targ‘iboti',
      description: 'Soliq to‘lovchining intizomi holatini yaxshilash yuzasidan targ‘ibot tadbirlari va boshqa choralarni ko‘rish.',
    },
    {
      taskNumber: 4,
      title: 'Soliq islohotlari, aniqlangan kamchiliklarni bartaraf etish va Yo‘l xaritasi',
      description: 'Soliq sohasidagi islohotlarning aholiga yetkazilishi yuzasidan sektor a’zolari tomonidan olib borilgan ishlar holatlarini o‘rganish, aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “yo‘l xaritasi” ishlab chiqish, uning ijrosini ta’minlash, “Yo‘l xaritasi” ijrosi yuzasidan ma’lumotlarni to‘plash, sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 5,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 3. Kambag‘allikni qisqartirish va bandlikka ko‘maklashish bo‘limi (8 ta vazifa)
  'org-3': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Mehnat va bandlik davlat dasturlari ijrosi nazorati',
      description: 'Har bir sektorda mehnat va bandlik munosabatlariga oid davlat va boshqa dasturlar ijrosi ta’minlanishini nazorat qilish.',
    },
    {
      taskNumber: 3,
      title: 'Bandlik hujjatlar yig‘ma jildini yuritish',
      description: 'Mehnat munosabatlari va bandlikni ta’minlash masalalariga oid hujjatlar yig‘ma jildini yuritilishini ta’minlash.',
    },
    {
      taskNumber: 4,
      title: 'Sektor aholisi bandligini ta’minlash choralari',
      description: 'Sektorda yashovchi aholining bandligini ta’minlash choralarini ko‘rib borish.',
    },
    {
      taskNumber: 5,
      title: 'Yangi ish o‘rinlarini yaratish va hududlarga ko‘maklashish',
      description: 'Yangi ish o‘rinlarini yaratish bo‘yicha kompleks chora-tadbirlar amalga oshirilishini nazorat qilish va bu borada hududlarga ko‘maklashish.',
    },
    {
      taskNumber: 6,
      title: 'Tadbirkorlik subyektlariga amaliy yordam va yangi ish o‘rinlari',
      description: 'Tadbirkorlik sub’yektlariga amaliy yordam ko‘rsatish hamda yangi ish o‘rinlarini yaratish bo‘yicha kompleks chora-tadbirlar amalga oshirish.',
    },
    {
      taskNumber: 7,
      title: 'Bitiruvchilar, yoshlar va xotin-qizlar bandligini ta’minlash',
      description: 'Kollej (litsey) bitiruvchilari, yoshlar va xotin-qizlar bandligini ta’minlash choralarini ko‘rish.',
    },
    {
      taskNumber: 8,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 4. Tuman Iqtisodiyot va moliya bo‘limi mutaxassisi (7 ta vazifa)
  'org-4': [
    {
      taskNumber: 1,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “yo‘l xaritasi” ishlab chiqish, uning ijrosini ta’minlash, “Yo‘l xaritasi” ijrosi yuzasidan ma’lumotlarni to‘plash, sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 2,
      title: 'Tadbirkorlikni rivojlantirish va investitsiyalarni jalb qilish tahlili',
      description: 'Tadbirkorlikni rivojlantirish, investitsiyalarni jalb qilish ahvolini tahlil qilish.',
    },
    {
      taskNumber: 3,
      title: 'To‘xtatilgan korxonalar faoliyatini qayta tiklash choralari',
      description: 'Faoliyati to‘xtatilgan korxonalar haqidagi ma’lumotlar tahlil qilinganligi, ularning faoliyatini qayta tiklash choralari ko‘rish.',
    },
    {
      taskNumber: 4,
      title: 'Tadbirkorlik subyektlariga yordam va yangi ish o‘rinlari yaratish',
      description: 'Tadbirkorlik sub’yektlariga amaliy yordam ko‘rsatish hamda yangi ish o‘rinlarini yaratish bo‘yicha kompleks chora-tadbirlar amalga oshirilganligi.',
    },
    {
      taskNumber: 5,
      title: 'Noqonuniy tadbirkorlik faoliyatini qonuniylashtirish',
      description: 'Hududda tegishli tartibda davlat ro‘yxatidan o‘tmagan holda noqonuniy tadbirkorlik bilan shug‘ullanuvchi shaxslar faoliyatini qonuniylashtirish choralari ko‘rilganligi.',
    },
    {
      taskNumber: 6,
      title: 'Zaxira resurslar va ishlab chiqarish salohiyati bo‘yicha takliflar',
      description: 'Ishlab chiqarishga jalb qilinmagan resurslar, mehnat va ishlab chiqarish salohiyatini aniqlanganligi va tegishli takliflar kiritish.',
    },
    {
      taskNumber: 7,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 5. Davlat kadastrlar palatasi (8 ta vazifa)
  'org-5': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish, Yo‘l xaritasi va ma’lumotlarni yangilash',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'Yer resurslaridan oqilona foydalanish va geodeziya-kartografiya dasturlari',
      description: 'Hududlarda yer resurslaridan oqilona foydalanish, yerlarni saqlash va muhofaza qilish, tuproq unumdorligini oshirish, geodeziya va kartografiya faoliyati samaradorligini kuchaytirish bo‘yicha dasturlarning amalga oshirilganligi.',
    },
    {
      taskNumber: 4,
      title: 'Davlat kadastrlari yagona tizimi va ro‘yxatlarni yuritish',
      description: 'Davlat yer kadastrini, davlat kartografiya-geodeziya kadastrini, binolar va inshootlar davlat kadastrini, hududlar davlat kadastrini, shuningdek, Davlat kadastrlari yagona tizimi yuritilganligi.',
    },
    {
      taskNumber: 5,
      title: 'Elektron ma’lumotlar bazasi va geoaxborot tizimlarini yangilab borish',
      description: 'Ko‘chmas mulk ob’yektlarining elektron ma’lumotlar bazasini, ko‘chmas mulk bahosini bozor qiymatida baholashga bosqichma-bosqich o‘tish uchun davlat kadastrlari geoaxborot tizimlarini yaratish va doimiy ravishda yangilab borilganligi.',
    },
    {
      taskNumber: 6,
      title: 'Zamonaviy AKT joriy etish va davlat xizmatlari sifatini o‘rganish',
      description: 'Sohaga zamonaviy axborot-kommunikatsiya texnologiyalarini keng joriy etish, shu jumladan, davlat xizmatlari sifatini yaxshilash maqsadida fuqarolarga hamda tadbirkorlik sub’yektlariga tezkor va sifatli xizmatlar ko‘rsatilganligi holatlarini o‘rganish, o‘rganish natijasiga ko‘ra takliflar kiritish.',
    },
    {
      taskNumber: 7,
      title: 'Uyma-uy yurish orqali muammolarni aniqlash va rivojlantirish dasturiga kiritish',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 8,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 6. Tuman tibbiy birlashmasi (11 ta vazifa)
  'org-6': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'Tibbiy xizmatlar samaradorligi va ijtimoiy muhofaza manzilliligi',
      description: 'Aholiga tibbiy xizmatlar ko‘rsatish samaradorligi, ijtimoiy muhofaza va ta’minotning manzilliligi.',
    },
    {
      taskNumber: 4,
      title: 'Ko‘p uchraydigan kasalliklar profilaktikasi va davolash choralari',
      description: 'Eng ko‘p uchraydigan kasalliklar profilaktikasi va ularni davolash bo‘yicha amalga oshirilayotgan ishlar.',
    },
    {
      taskNumber: 5,
      title: 'Kasallanish, jarohatlanish, nogironlik va o‘limning oldini olish',
      description: 'Aholi o‘rtasida kasallanish, jarohatlanish, nogironlik hamda o‘limning oldini olish va kamaytirish tadbirlarining amalga oshirilishi.',
    },
    {
      taskNumber: 6,
      title: 'Emlash va sog‘lom turmush tarzini targ‘ib qilish',
      description: 'Emlash, aholi o‘rtasida sog‘lom turmush tarzini targ‘ib qilish bo‘yicha chora-tadbirlarning amalga oshirilishi.',
    },
    {
      taskNumber: 7,
      title: 'Yolg‘iz, keksalar, nogironlar va homilador ayollar patronaji',
      description: 'Yolg‘iz, keksa, nogiron, surunkali kasalliklarga chalingan bemorlar hamda homilador ayollar patronajining tashkil etilganligi.',
    },
    {
      taskNumber: 8,
      title: 'Tibbiy muassasalar kommunikatsiya ta’minoti holati',
      description: 'Tibbiy muassasa ob’yektlari zarur kommunikatsiyalar (elektr, suv ta’minoti, telefon aloqasi kabilar) bilan ta’minlanganligi.',
    },
    {
      taskNumber: 9,
      title: 'Mutaxassis shifokorlar, tibbiy anjomlar va dori-darmon ta’minoti',
      description: 'Ixtisosliklar bo‘yicha shifokorlarning mavjudligi, zarur tibbiy anjomlar va vositalar, dori-darmonlarning mavjudligi holatlarini o‘rganish, natijasiga ko‘ra takliflar kiritish.',
    },
    {
      taskNumber: 10,
      title: 'Uyma-uy yurish asosida muammolarni bartaraf etish va rivojlanish dasturiga kiritish',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 11,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 8. Tuman yo‘llardan foydalanish korxonasi (6 ta vazifa)
  'org-8': [
    {
      taskNumber: 1,
      title: 'Avtomobil yo‘llarini rivojlantirish va davlat dasturlari ijrosi',
      description: 'Avtomobil yo‘llarini rivojlantirish, davlat dasturlarini ishlab chiqish va amalga oshirish.',
    },
    {
      taskNumber: 2,
      title: 'Avtomobil yo‘llarining xalqaro tranzit yo‘laklarini shakllantirish',
      description: 'Avtomobil yo‘llarining xalqaro tranzit yo‘laklarini shakllantirish.',
    },
    {
      taskNumber: 3,
      title: 'Avtomobil yo‘llarini moliyalashtirish, loyihalash, qurish va ta’mirlash',
      description: 'Zamonaviy transport oqimi sharoitlarida avtomobil yo‘llardan foydalanuvchilarning manfaatlarini hisobga olib, avtomobil yo‘llarini moliyalashtirish, loyihalashtirish, qurish, ta’mirlash va ulardan foydalanish masalalari kompleks hal etilishini ta’minlash hamda buyurtmachi xizmatining samarali faoliyatini tashkil qilish.',
    },
    {
      taskNumber: 4,
      title: 'Yo‘llarni qurish, rekonstruksiya qilish va saqlash sifati nazorati',
      description: 'Avtomobil yo‘llarini qurish, rekonstruksiya qilish, ta’mirlash va saqlash sifati ustidan nazoratni amalga oshirish.',
    },
    {
      taskNumber: 5,
      title: 'Sektor hududidagi ichki tuproq yo‘llarni shag‘allashtirish',
      description: 'Sektor hududidagi ichki tuproq yo‘llarni shag‘allashtirishni amalga oshirish.',
    },
    {
      taskNumber: 6,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 9. Maktabgacha va maktab ta’limi bo‘limi (8 ta vazifa)
  'org-9': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'O‘quvchilar davomati va salbiy ta’sir ko‘rsatuvchi omillarni bartaraf etish',
      description: 'O‘quvchilarning davomati (unga salbiy ta’sir ko‘rsatayotgan omillar, masalan to‘garaklar tashkil etilmaganligi, o‘qituvchilarning yetishmasligi, o‘quv mashg‘ulotlarining yuqori saviyada o‘tkazilmasligi kabilar) muammolar yechimini ta’minlash.',
    },
    {
      taskNumber: 4,
      title: 'Ta’lim muassasalari ahvoli, kutubxona va sport zallari samaradorligi',
      description: 'Ta’lim muassasalari ahvoli, kutubxona, sport zallarining mavjudligi va ulardan samarali foydalanish tizimi yo‘lga qo‘yilganligi.',
    },
    {
      taskNumber: 5,
      title: 'Fan va sport to‘garaklariga o‘quvchilarni to‘laqonli qamrab olish',
      description: 'Fanlar va sport turlari bo‘yicha to‘garaklarning samarali faoliyat ko‘rsatishlari hamda ularga o‘quvchilarning to‘laqonli qamrab olinganligi.',
    },
    {
      taskNumber: 6,
      title: 'Ta’lim muassasasi va yordamchi obyektlar holati hamda ta’lim sifati',
      description: 'Ta’lim muassasasi va undagi yordamchi ob’yektlar (oshxona, sport zali, kutubxona, o‘quv sinfxonalari, kompyuter sinflari, stadion kabilar) holati, o‘quv mashg‘ulotlarining sifati, sohaga oid qonunchilik targ‘ibotini amalga oshirish.',
    },
    {
      taskNumber: 7,
      title: 'Uyma-uy yurish orqali muammolarni bartaraf etish va rivojlantirish takliflari',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 8,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 10. Hududgaz Samarqand gazta’minoti filiali (10 ta vazifa)
  'org-10': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'Iste’molchilarni gaz bilan ta’minlash holatini doimiy o‘rganish',
      description: 'Hududlarda tuzilgan shartnomalarga muvofiq, iste’molchilarni gaz bilan ta’minlash masalalarini doimiy o‘rganib borish.',
    },
    {
      taskNumber: 4,
      title: 'Sotilgan gaz hajmi, debitor va kreditor qarzdorliklar haqqoniyligi',
      description: 'Sotilgan gaz hajmi haqidagi hisobot va axborotlar, debitor va kreditor qarzdorlik haqidagi ma’lumotlarning haqqoniyligi.',
    },
    {
      taskNumber: 5,
      title: 'Gaz tarmoqlari va infratuzilmani ekspluatatsiya va ta’mirlash',
      description: 'Gaz taqsimlash tarmoqlari bevosita iste’molchilarga bo‘linish chegarasiga qadar yetkazib berish bilan bog‘liq bo‘lgan boshqa infratuzilmalar ekspluatatsiyasi va ta’mirlash xizmatlarini amalga oshirish.',
    },
    {
      taskNumber: 6,
      title: 'Gaz hisoblagichlarini almashtirish, o‘rnatish va xizmat ko‘rsatish',
      description: 'Iste’molchilarga o‘rnatilgan iste’molini hisobga olish uskunalarini almashtirish, o‘rnatish va ekspluatatsiya xizmati ko‘rsatish.',
    },
    {
      taskNumber: 7,
      title: 'Texnik shartlar berish va yangi iste’molchilarni ulash',
      description: 'Belgilangan tartibda texnik shartlarni berish, gaz tarmoqlariga yangi iste’molchilarni ulash ishlarini amalga oshirish.',
    },
    {
      taskNumber: 8,
      title: 'Suyultirilgan gaz ballonlari bilan ta’minlash va o‘z vaqtida tarqatish',
      description: 'Tabiiy gaz yetib bormaydigan hududlarni suyultirilgan gaz ballonlari bilan ta’minlash choralarini ko‘rilganligi, suyultirilgan gaz balonlarining o‘z vaqtida aholiga tarqatilishi.',
    },
    {
      taskNumber: 9,
      title: 'Uyma-uy yurish orqali muammolarni bartaraf etish va takliflar kiritish',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 10,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 11. Samarqand suv ta’minoti MCHJ (9 ta vazifa)
  'org-11': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'Bozor prinsiplari asosida suv resurslaridan samarali foydalanish',
      description: 'Hududlarda suvdan foydalanishning va suv iste’molining bozor prinsiplarini va mexanizmlarini joriy etish asosida suv resurslaridan maqsadli va samarali foydalanilishini tashkil etish.',
    },
    {
      taskNumber: 4,
      title: 'Suvni tejovchi ilg‘or texnologiyalarni joriy etish takliflari',
      description: 'Suvni tejovchi ilg‘or texnologiyalarni joriy etish yuzasidan takliflar berish.',
    },
    {
      taskNumber: 5,
      title: 'Iste’molchilarni suv bilan uzluksiz va o‘z vaqtida ta’minlash',
      description: 'Iste’molchilarni suv bilan uzluksiz va o‘z vaqtida ta’minlashni tashkil etish.',
    },
    {
      taskNumber: 6,
      title: 'Suv inshootlarining texnik ishonchliligini ta’minlash',
      description: 'Suv inshootlarining texnik ishonchliligini ta’minlash.',
    },
    {
      taskNumber: 7,
      title: 'Suv resurslaridan oqilona foydalanish, hisob-kitob va monitoring',
      description: 'Suv resurslarini oqilona foydalanish hamda uning tezkorligini oshirish, suv resurslaridan foydalanishning aniq hisobi va hisobotini ta’minlash, suvdan foydalanish sohasida islohotlarni chuqurlashtirish, mulkchilikning turli shakllarini rivojlantirish ishlarini muvofiqlashtirish va ular amalga oshirilishining monitoringini olib borish.',
    },
    {
      taskNumber: 8,
      title: 'Uyma-uy yurish orqali muammolarni bartaraf etish va takliflar tayyorlash',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 9,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 12. Tuman elektr tarmoqlari korxonasi (8 ta vazifa)
  'org-12': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'Shartnomalar asosida iste’molchilarni energiya bilan ta’minlash',
      description: 'Tuzilgan shartnomalarga muvofiq, iste’molchilarni energiya resurslari bilan ta’minlash.',
    },
    {
      taskNumber: 4,
      title: 'Sotilgan energiya hajmi, debitor va kreditor qarzdorliklar haqqoniyligi',
      description: 'Sotilgan energiya resurslari hajmi haqidagi hisobot va axborotlar, debitor va kreditor qarzdorlik haqidagi ma’lumotlarning haqqoniyligi.',
    },
    {
      taskNumber: 5,
      title: 'Elektr tarmoqlari va infratuzilmani ekspluatatsiya hamda ta’mirlash',
      description: 'Elektr tarmoqlari hamda energiya resurslarini bevosita iste’molchilarga bo‘linish chegarasiga qadar yetkazib berish bilan bog‘liq bo‘lgan boshqa infratuzilmalar ekspluatatsiyasi va ta’mirlash xizmatlarini amalga oshirish.',
    },
    {
      taskNumber: 6,
      title: 'Hisoblagichlarni almashtirish, o‘rnatish, xizmat ko‘rsatish va yangi ulanishlar',
      description: 'Iste’molchilarga o‘rnatilgan energiya resurslari iste’molini hisobga olish uskunalarini almashtirish, o‘rnatish va ekspluatatsiya xizmati ko‘rsatish, belgilangan tartibda texnik shartlarni berish, elektr yangi iste’molchilarni ulash ishlarini amalga oshirish.',
    },
    {
      taskNumber: 7,
      title: 'Uyma-uy yurish orqali muammolarni bartaraf etish va takliflar kiritish',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 8,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 13. SEO va JS (8 ta vazifa)
  'org-13': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'Aholiga eng ko‘p uchraydigan kasalliklarni profilaktika qilish va davolash',
      description: 'Hududlarda aholiga eng ko‘p uchraydigan kasalliklarni profilaktika qilish va davolash bo‘yicha ham alohida bemorlar, ham butun oila darajasida tibbiy xizmatlar ko‘rsatish, ushbu yo‘nalishda muammolarni aniqlash, aniqlangan muammolarning bazasini shakllantirish.',
    },
    {
      taskNumber: 4,
      title: 'Malakali birlamchi tibbiy-sanitariya yordami va muntazam patronaj',
      description: 'Aholiga malakali birlamchi, birinchi navbatda, kasalliklarni profilaktika qilish masalalarida tibbiy-sanitariya yordami ko‘rsatish, tug‘ruq yoshidagi ayollar, o‘smir qizlar, homilador ayollar, bolalar, shuningdek yolg‘iz keksalar, nogironlar va surunkali kasalliklarga chalingan shaxslar hamda o‘zgalar yordamiga va ijtimoiy yordamga muhtoj shaxslar o‘rtasida muntazam patronaj ishlarini amalga oshirish.',
    },
    {
      taskNumber: 5,
      title: 'Oilada tibbiy madaniyatni oshirish va sog‘lom turmush tarzi asoslari',
      description: 'Oilada tibbiy madaniyatni oshirish va har bir kishining o‘z salomatligi va o‘zining bolalari salomatligi uchun mas’uliyatini oshirishga yo‘naltirilgan dasturlarni amalga oshirish orqali aholi o‘rtasida sog‘lom turmush tarzi asoslarini shakllantirish va mustahkamlash.',
    },
    {
      taskNumber: 6,
      title: 'Barkamol sog‘lom avlod, ona va bola salomatligi profilaktikasi',
      description: 'Aholi o‘rtasida barkamol sog‘lom avlodni tarbiyalashga, ona va bola salomatligini muhofaza qilishga, tibbiy etika va deontologiya, sanitariya-gigiyena ko‘nikmalari, oqilona ovqatlanish qoidalariga rioya etishga, tug‘ma patologiya va irsiy kasalliklarni kamaytirishga yo‘naltirilgan profilaktika tadbirlarini tashkil etish va amalga oshirish.',
    },
    {
      taskNumber: 7,
      title: 'Uyma-uy yurish orqali muammolarni bartaraf etish va takliflar kiritish',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 8,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 14. Agrobank Paxtachi filiali (7 ta vazifa)
  'org-14': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Bank xizmatlari va kreditlar ajratish bo‘yicha dasturlar ijrosi',
      description: 'Bank xizmatlari ko‘rsatilishi va kreditlar ajratilishi bo‘yicha davlat va boshqa dasturlar ijrosini ta’minlash.',
    },
    {
      taskNumber: 3,
      title: 'Bank xizmatlari samaradorligi, sifati va qulayligini oshirish',
      description: 'Hududlarda ko‘rsatilayotgan bank xizmatlari samaradorligi, sifati, ko‘rsatilayotgan bank xizmatlarining qulayligini oshirish choralarini ko‘rish.',
    },
    {
      taskNumber: 4,
      title: 'Imtiyozli kreditlarning o‘z vaqtida va to‘laqonli ajratilishi tahlili',
      description: 'Banklar tomonidan aholiga ajratilgan imtiyozli kreditlarning o‘z vaqtida va to‘laqonli ajratilishi ahvolini tahlil qilib borish.',
    },
    {
      taskNumber: 5,
      title: 'Kreditlardan maqsadli foydalanilishini o‘rganish va amaliy yordam',
      description: 'Ajratilgan kreditlar maqsadli foydalanilayotganligi holatlarini o‘rganish, aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish.',
    },
    {
      taskNumber: 6,
      title: 'Uyma-uy yurish orqali muammolarni bartaraf etish va rivojlanish dasturiga takliflar',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 7,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 15. “Inson” ijtimoiy xizmatlar markazi (7 ta vazifa)
  'org-15': [
    {
      taskNumber: 1,
      title: 'Xatlov muammolarini kategoriyalarga ajratish va hal etish',
      description: 'Xatlov davomida aniqlangan muammolarni kategoriyaga bo‘lish va o‘z vakolati doirasidagi masalalarni hal qilish choralarini ko‘rish.',
    },
    {
      taskNumber: 2,
      title: 'Kamchiliklarni bartaraf etish va Yo‘l xaritasi ijrosi',
      description: 'Aniqlangan kamchiliklarni bartaraf etish yuzasidan amaliy yordam ko‘rsatish, vaqt va mablag‘ talab qiladigan tadbirlar ijrosi yuzasidan “Yo‘l xaritasi” ishlab chiqish yuzasidan ma’lumotlarni to‘plash va sektor shtabiga taqdim qilish, sohaga oid ma’lumotlarni shtabda yangilab borish.',
    },
    {
      taskNumber: 3,
      title: 'Pensiyalar, nafaqalar va kompensatsiyalarni tayinlash va qayta hisoblash',
      description: 'Hududlarda qonun hujjatlarida belgilangan tartibda fuqarolarning davlat pensiya ta’minotini tashkil etish, fuqarolarga pensiyalar, ijtimoiy nafaqalar, kompensatsiya to‘lovlari va boshqa to‘lovlarni tayinlash, pensiyalar va boshqa to‘lovlar miqdorlarining qayta hisoblab chiqilishini ta’minlash.',
    },
    {
      taskNumber: 4,
      title: 'Pensiya ta’minoti mablag‘laridan maqsadli foydalanish tahlili va monitoringi',
      description: 'Tizimli asosda pensiyalar tayinlash va ularni qayta hisoblashning doimiy tahlilini o‘tkazish va monitoringini olib borish, fuqarolarning pensiya ta’minotiga yo‘naltiriladigan mablag‘lardan qat’iy maqsadli foydalanilishini ta’minlash.',
    },
    {
      taskNumber: 5,
      title: 'Nogironlik va yetkazilgan zararlar bo‘yicha to‘lovlarni undirib olish',
      description: 'Boquvchisini yo‘qotgan taqdirda, shuningdek mehnatda mayib bo‘lganlik yoki xodim mehnat majburiyatlarini bajarishi bilan bog‘liq kasb kasalligi oqibatidagi nogironlik tufayli tayinlangan pensiyalarga to‘langan mablag‘larni da’volar bo‘yicha aybdor yuridik va jismoniy shaxslardan belgilangan tartibda undirib olishni tashkil etish.',
    },
    {
      taskNumber: 6,
      title: 'Uyma-uy yurish orqali muammolarni bartaraf etish va takliflar kiritish',
      description: 'Uyma-uy yurish va aholi bilan uchrashuvlar asosida eng quyi bo‘g‘inda aniqlangan muammolarni bartaraf etishning aniq choralarini ko‘rish, tuman 1-sektorini rivojlantirish bo‘yicha dasturlarga kiritish uchun takliflar tayyorlash va kiritish.',
    },
    {
      taskNumber: 7,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],

  // 16. Obodonlashtirish boshqarmasi (10 ta vazifa)
  'org-16': [
    {
      taskNumber: 1,
      title: 'Ko‘kalamzorlashtirish, daraxtlarni parvarishlash va kasalliklarga qarshi kurashish',
      description: 'Hududdagi ko‘chalar, skverlar, xiyobonlar, yodgorlik majmualari va umumiy foydalaniladigan boshqa ko‘kalamzor zonalarni ko‘kalamzorlashtirish, dov-daraxtlarni parvarish qilish bo‘yicha agrotexnika tadbirlarini o‘tkazish, ularning zararkunandalari va kasalliklariga qarshi kurashish.',
    },
    {
      taskNumber: 2,
      title: 'Yo‘l-ko‘prik xo‘jaligi, yo‘laklar va sun’iy inshootlarni saqlash hamda ta’mirlash',
      description: 'Yo‘l-ko‘prik xo‘jaligini (ko‘chalar, yo‘laklar qatnov qismining yo‘l qoplamasi, bekat ko‘tarmalari, yer osti o‘tish joylari, ko‘priklar, transport chorrahalari va yo‘l o‘tkazgichlar, yon bordyurlar, suv chiqarib yuborish tarmoqlari va boshqa sun’iy inshootlar) saqlash, mukammal va joriy ta’mirlash.',
    },
    {
      taskNumber: 3,
      title: 'Xo‘jaliklararo qishloq avtomobil yo‘llarini saqlash va ta’mirlash',
      description: 'Xo‘jaliklararo qishloq avtomobil yo‘llarini saqlash, mukammal va joriy ta’mirlash.',
    },
    {
      taskNumber: 4,
      title: 'Drenaj xo‘jaligi, kollektorlar, quduqlar va favvoralarni saqlash hamda ta’mirlash',
      description: 'Drenaj xo‘jaligini (vertikal va gorizontal quduqlar, ochiq va yopiq kollektorlar, sun’iy havzalar, yer osti va yomg‘ir suvlarini haydaydigan nasos stansiyalari) va favvoralarni saqlash, mukammal, joriy ta’mirlash va ulardan foydalanish bo‘yicha boshqa ishlar.',
    },
    {
      taskNumber: 5,
      title: 'Ko‘cha va yo‘llarning tashqi yoritish tarmoqlarini saqlash va ta’mirlash',
      description: 'Elektr energiyasini tejash maqsadida zamonaviy asbob-uskunalar va texnologiyalarni joriy etgan holda yo‘llar va ko‘chalarning tashqi yoritish tarmoqlarini saqlash, mukammal va joriy ta’mirlash hamda ulardan foydalanish bo‘yicha boshqa ishlar.',
    },
    {
      taskNumber: 6,
      title: 'Nazoratsiz va egasiz hayvonlarni sanitariya qoidalarida tutish',
      description: 'Nazoratsiz, shu jumladan egasiz itlar, mushuklar va yirtqich hayvonlarni veterinariya-sanitariya qoidalariga rioya qilgan holda tutish va veterinariya va chorvachilikni rivojlantirish bo‘limlariga olib kelish.',
    },
    {
      taskNumber: 7,
      title: 'Dafn etish joylari (qabristonlar) va yodgorliklarni saqlash',
      description: 'Ekologiya me’yorlariga, sanitariya, shaharsozlik me’yorlari va qoidalariga hamda boshqa me’yorlar va qoidalarga muvofiq dafn etish joylari (qabristonlar) va qabr ustiga o‘rnatilgan yodgorliklarni saqlash va ulardan foydalanish.',
    },
    {
      taskNumber: 8,
      title: 'Obodonlashtirish obyektlarini sanitariya jihatidan tozalash',
      description: 'Mavsumiy talablarni hisobga olgan holda obodonlashtirish ob’yektlarini sanitariya jihatidan tozalash.',
    },
    {
      taskNumber: 9,
      title: 'Sektor hududida qonunchilikda yuklatilgan boshqa vazifalar',
      description: 'Sektor hududida qonunchilikda zimmasiga yuklatilgan boshqa vazifalarni bajarish.',
    },
    {
      taskNumber: 10,
      title: 'Sektor shtabida grafik asosida navbatchilik',
      description: 'Sektor shtabida tasdiqlangan grafik asosida navbatchilikni olib borish.',
    },
  ],
};

// Tashkilotlar ichidan Shtab vazifalari bo‘limida qatnashmaydigan tashkilotlar
export const NON_SHTAB_TASK_ORG_IDS = ['org-8', 'org-16', 'org-17', 'org-18'];

