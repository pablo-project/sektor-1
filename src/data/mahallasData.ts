import { MahallaYettiligiMember } from '../types';

export interface MahallaInfo {
  id: string;
  name: string;
  chairman: string;
  phone: string;
  population: number;
  sector: number;
  password?: string;
  yettilik: MahallaYettiligiMember[];
  totalAppeals?: number;
  resolvedAppeals?: number;
  inProgressAppeals?: number;
  objectionAppeals?: number;
}

export const PAXTACHI_MAHALLAS: MahallaInfo[] = [
  {
    id: 'mfy-1',
    name: 'Ko‘rpa MFY',
    chairman: 'Q. Murodov',
    phone: '+998 90 112-23-34',
    population: 3240,
    sector: 1,
    password: 'mahalla1',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'Q. Murodov', phone: '+998 90 112-23-34' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'B. Eshmurodov', phone: '+998 91 223-34-45' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'Z. Samadova', phone: '+998 93 334-45-56' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'D. Karimov', phone: '+998 94 445-56-67' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'K. Jo‘rayev', phone: '+998 97 556-67-78' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'A. Qodirov', phone: '+998 99 667-78-89' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'N. Toshpo‘latova', phone: '+998 90 778-89-90' },
    ],
  },
  {
    id: 'mfy-2',
    name: 'Toma MFY',
    chairman: 'S. Rahimov',
    phone: '+998 90 223-34-45',
    population: 2980,
    sector: 1,
    password: 'mahalla2',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'S. Rahimov', phone: '+998 90 223-34-45' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'O. Sobirov', phone: '+998 91 334-45-56' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'M. Beknazarova', phone: '+998 93 445-56-67' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'E. Ergashev', phone: '+998 94 556-67-78' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'S. Xolov', phone: '+998 97 667-78-89' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'T. Yusupov', phone: '+998 99 778-89-90' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'G. Ahmedova', phone: '+998 90 889-90-01' },
    ],
  },
  {
    id: 'mfy-3',
    name: 'Burqut MFY',
    chairman: 'O. Qodirov',
    phone: '+998 90 334-45-56',
    population: 3560,
    sector: 1,
    password: 'mahalla3',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'O. Qodirov', phone: '+998 90 334-45-56' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'F. Rustamov', phone: '+998 91 445-56-67' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'R. Saidova', phone: '+998 93 556-67-78' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'J. Normatov', phone: '+998 94 667-78-89' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'M. Boboyev', phone: '+998 97 778-89-90' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'V. Qurbonov', phone: '+998 99 889-90-01' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'Sh. Yoqubova', phone: '+998 90 990-01-12' },
    ],
  },
  {
    id: 'mfy-4',
    name: 'Humarmand MFY',
    chairman: 'N. Aliyev',
    phone: '+998 90 445-56-67',
    population: 2890,
    sector: 1,
    password: 'mahalla4',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'N. Aliyev', phone: '+998 90 445-56-67' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'Sh. Temirov', phone: '+998 91 556-67-78' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'D. Murodova', phone: '+998 93 667-78-89' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'B. Hamroyev', phone: '+998 94 778-89-90' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'U. Zokirov', phone: '+998 97 889-90-01' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'A. Haydarov', phone: '+998 99 990-01-12' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'K. Rahmatova', phone: '+998 90 102-03-04' },
    ],
  },
  {
    id: 'mfy-5',
    name: 'Go‘ro‘g‘li MFY',
    chairman: 'B. Yusupov',
    phone: '+998 90 556-67-78',
    population: 3720,
    sector: 1,
    password: 'mahalla5',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'B. Yusupov', phone: '+998 90 556-67-78' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'Q. Narzullayev', phone: '+998 91 667-78-89' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'N. Umarova', phone: '+998 93 778-89-90' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'S. Ne’matov', phone: '+998 94 889-90-01' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'O. Jabborov', phone: '+998 97 990-01-12' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'I. Mirzayev', phone: '+998 99 112-23-34' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'X. Bozorova', phone: '+998 90 203-04-05' },
    ],
  },
  {
    id: 'mfy-6',
    name: 'Qo‘shhovuz MFY',
    chairman: 'D. Yo‘ldoshev',
    phone: '+998 90 667-78-89',
    population: 3100,
    sector: 1,
    password: 'mahalla6',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'D. Yo‘ldoshev', phone: '+998 90 667-78-89' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'G. Shodiyev', phone: '+998 91 778-89-90' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'F. Qosimova', phone: '+998 93 889-90-01' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'L. Rahimov', phone: '+998 94 990-01-12' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'E. Karimov', phone: '+998 97 102-20-30' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'B. Sodiqov', phone: '+998 99 203-30-40' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'Z. Vohidova', phone: '+998 90 304-05-06' },
    ],
  },
  {
    id: 'mfy-7',
    name: 'To‘g‘olon MFY',
    chairman: 'T. Rustamov',
    phone: '+998 90 778-89-90',
    population: 2750,
    sector: 1,
    password: 'mahalla7',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'T. Rustamov', phone: '+998 90 778-89-90' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'A. Qobilov', phone: '+998 91 889-90-01' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'S. Toirova', phone: '+998 93 990-01-12' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'R. Saidov', phone: '+998 94 112-23-34' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'D. Berdiyev', phone: '+998 97 223-34-45' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'M. Rajabov', phone: '+998 99 334-45-56' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'Y. Mavlonova', phone: '+998 90 405-06-07' },
    ],
  },
  {
    id: 'mfy-8',
    name: 'Sardoba MFY',
    chairman: 'A. Karimova',
    phone: '+998 90 889-90-01',
    population: 3280,
    sector: 1,
    password: 'mahalla8',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'A. Karimova', phone: '+998 90 889-90-01' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'K. Ergashev', phone: '+998 91 990-01-12' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'D. Sharipova', phone: '+998 93 112-23-34' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'N. Yoqubov', phone: '+998 94 223-34-45' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'B. Norov', phone: '+998 97 334-45-56' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'O. G‘aniyev', phone: '+998 99 445-56-67' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'M. Asadova', phone: '+998 90 506-07-08' },
    ],
  },
  {
    id: 'mfy-9',
    name: 'Yobu MFY',
    chairman: 'E. Tursunov',
    phone: '+998 90 990-01-12',
    population: 2640,
    sector: 1,
    password: 'mahalla9',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'E. Tursunov', phone: '+998 90 990-01-12' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'F. Kenjayev', phone: '+998 91 102-12-23' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'L. Ochilova', phone: '+998 93 203-23-34' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'I. Hamroyev', phone: '+998 94 304-34-45' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'T. Jumayev', phone: '+998 97 405-45-56' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'S. Haydarov', phone: '+998 99 506-56-67' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'H. Qurbonova', phone: '+998 90 607-08-09' },
    ],
  },
  {
    id: 'mfy-10',
    name: 'Quvondiq MFY',
    chairman: 'K. Nabiyev',
    phone: '+998 91 124-56-78',
    population: 2920,
    sector: 1,
    password: 'mahalla10',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'K. Nabiyev', phone: '+998 91 124-56-78' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'R. Sobirov', phone: '+998 91 213-34-56' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'G. Rahmonova', phone: '+998 93 324-45-67' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'Sh. Oripov', phone: '+998 94 435-56-78' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'A. Bozorov', phone: '+998 97 546-67-89' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'D. Yunusov', phone: '+998 99 657-78-90' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'O. Normurodova', phone: '+998 90 708-09-10' },
    ],
  },
  {
    id: 'mfy-11',
    name: 'Mirzo Olim MFY',
    chairman: 'J. Murodov',
    phone: '+998 91 235-67-89',
    population: 3410,
    sector: 1,
    password: 'mahalla11',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'J. Murodov', phone: '+998 91 235-67-89' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'M. Shukurov', phone: '+998 91 324-45-67' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'E. Boltayeva', phone: '+998 93 435-56-78' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'K. Halimov', phone: '+998 94 546-67-89' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'S. Mahmudov', phone: '+998 97 657-78-90' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'F. Safarov', phone: '+998 99 768-89-01' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'B. Ismoilova', phone: '+998 90 809-10-11' },
    ],
  },
  {
    id: 'mfy-12',
    name: 'Mirzo Nodim MFY',
    chairman: 'Sh. Normatov',
    phone: '+998 91 346-78-90',
    population: 3150,
    sector: 1,
    password: 'mahalla12',
    yettilik: [
      { role: 'raisi', roleTitle: 'Mahalla raisi', name: 'Sh. Normatov', phone: '+998 91 346-78-90' },
      { role: 'hokim_yordamchisi', roleTitle: 'Hokim yordamchisi', name: 'V. Mirzayev', phone: '+998 91 435-56-78' },
      { role: 'xotin_qizlar', roleTitle: 'Xotin-qizlar faoli', name: 'T. Hamdamova', phone: '+998 93 546-67-89' },
      { role: 'yoshlar_yetakchisi', roleTitle: 'Yoshlar yetakchisi', name: 'A. Karimov', phone: '+998 94 657-78-90' },
      { role: 'profilaktika', roleTitle: 'Profilaktika inspektori', name: 'G. Saidov', phone: '+998 97 768-89-01' },
      { role: 'soliq', roleTitle: 'Soliq inspektori', name: 'O. Rahmonov', phone: '+998 99 879-90-12' },
      { role: 'ijtimoiy', roleTitle: 'Ijtimoiy xodim', name: 'D. Zokirova', phone: '+998 90 910-11-12' },
    ],
  },
];

export const DEFAULT_MAHALLA_YETTILIGI_TASKS = [
  {
    taskNumber: 1,
    title: 'Kambag‘al va ishsiz fuqarolar xonadonbay xatlovi hamda bandlik rejasini tuzish',
    description:
      'Mahalladagi ijtimoiy himoyaga muhtoj xonadonlarni to‘liq xatlovdan o‘tkazish, ularning daromad manbalarini o‘rganish va Kambag‘allikni qisqartirish bo‘limi bilan birgalikda bandlik choralarini ko‘rish bo‘yicha dalolatnoma tuzish.',
    targetRole: 'Hokim yordamchisi & Mahalla raisi',
    targetOrgId: 'org-2',
    targetOrgName: 'Tuman kambag‘allikni qisqartirish va bandlikka ko‘maklashish bo‘limi',
  },
  {
    taskNumber: 2,
    title: 'Profilaktik hisobda turgan shaxslar va notinch oilalar bilan profilaktik suhbatlar o‘tkazish',
    description:
      'Mahalla hududida huquqbuzarliklar profilaktikasini kuchaytirish, ilgari sudlangan va notinch oilalar bilan yettilik tarkibida xonadonbay uchrashuv o‘tkazib, xulosasini IIB ga taqdim etish.',
    targetRole: 'Profilaktika inspektori & Yettilik',
    targetOrgId: 'org-1',
    targetOrgName: 'Tuman Ichki ishlar bo‘limi (IIB)',
  },
  {
    taskNumber: 3,
    title: 'Ayollar daftari va xotin-qizlar bandligini ta’minlash bo‘yicha xulosa shakllantirish',
    description:
      'Ijtimoiy og‘ir sharoitda yashayotgan xotin-qizlar ro‘yxatini yangilash, kasb-hunarga yo‘naltirish va moddiy/ijtimoiy yordam ko‘rsatish yuzasidan dalolatnoma tuzib, Oila va xotin-qizlar bo‘limiga topshirish.',
    targetRole: 'Xotin-qizlar faoli',
    targetOrgId: 'org-3',
    targetOrgName: 'Tuman Oila va xotin-qizlar qo‘mitasi',
  },
  {
    taskNumber: 4,
    title: 'Yoshlar daftari va yoshlar tadbirkorligini qo‘llab-quvvatlash bo‘yicha monitoring',
    description:
      'Uyuşmagan va ishsiz yoshlar bilan individual muloqot o‘tkazish, ularga imtiyozli kredit yoki subsidiya ajratish bo‘yicha xulosa tuzib, Yoshlar ishlari agentligiga kiritish.',
    targetRole: 'Yoshlar yetakchisi',
    targetOrgId: 'org-4',
    targetOrgName: 'Yoshlar ishlari agentligi tuman bo‘limi',
  },
  {
    taskNumber: 5,
    title: 'Tomorqadan samarali foydalanish va daromad manbalarini o‘rganish',
    description:
      'Mahalladagi tomorqa yer egalari tomonidan ekin ekilishi va issiqxonalar faoliyatini joyiga chiqqan holda o‘rganish va Soliq inspeksiyasiga rasmiy ma’lumotnoma topshirish.',
    targetRole: 'Soliq inspektori & Hokim yordamchisi',
    targetOrgId: 'org-6',
    targetOrgName: 'Tuman Davlat soliq inspeksiyasi',
  },
  {
    taskNumber: 6,
    title: 'Yolg‘iz keksalar va nogironligi bo‘lgan shaxslarga ijtimoiy xizmat ko‘rsatish xulosasi',
    description:
      'O‘zgalar parvarishiga muhtoj yolg‘iz yashovchi fuqarolarning holidan xabar olish, ularning birlamchi ehtiyojlarini aniqlash va "Inson" ijtimoiy xizmatlar markaziga xulosa berish.',
    targetRole: 'Ijtimoiy xodim',
    targetOrgId: 'org-8',
    targetOrgName: '“Inson” ijtimoiy xizmatlar markazi',
  },
];

