/**
 * Banglish to Bengali Transliteration Engine
 * Based on Avro Phonetic rules with common patterns
 */

// Bengali vowels
const VOWELS = {
  'a': 'া',
  'A': 'আ',
  'i': 'ি',
  'I': 'ী',
  'u': 'ু',
  'U': 'ূ',
  'e': 'ে',
  'E': 'ে',
  'o': 'ো',
  'O': 'ো',
  'oi': 'ৈ',
  'ou': 'ৌ',
  'OU': 'ৌ',
  'OI': 'ৈ',
};

// Standalone vowels (at word start)
const STANDALONE_VOWELS = {
  'a': 'অ',
  'A': 'আ',
  'aa': 'আ',
  'i': 'ই',
  'I': 'ঈ',
  'ii': 'ঈ',
  'u': 'উ',
  'U': 'ঊ',
  'uu': 'ঊ',
  'e': 'এ',
  'E': 'এ',
  'o': 'ও',
  'O': 'ও',
  'oi': 'ঐ',
  'OI': 'ঐ',
  'ou': 'ঔ',
  'OU': 'ঔ',
};

// Consonants mapping (sorted by length for longest match first)
const CONSONANTS = {
  // Complex conjuncts first
  'NGch': 'ঞ্ছ',
  'NGg': 'ঙ্গ',
  'NGk': 'ঙ্ক',
  'NGm': 'ঙ্ম',
  'nch': 'ঞ্ছ',
  'ndh': 'ন্ধ',
  'ndr': 'ন্দ্র',
  'nth': 'ন্থ',
  'shch': 'শ্ছ',
  'sth': 'স্থ',
  'shm': 'শ্ম',
  'shw': 'শ্ব',
  'skh': 'স্খ',
  'sph': 'স্ফ',
  'str': 'স্ত্র',
  'tth': 'ট্ঠ',
  
  // Triple consonants
  'ksh': 'ক্ষ',
  'kkh': 'ক্ষ',
  'cch': 'চ্ছ',
  'chh': 'ছ',
  'ddh': 'দ্ধ',
  'dgh': 'দ্ঘ',
  'ggh': 'গ্ঘ',
  'ghn': 'ঘ্ন',
  'jjh': 'জ্ঝ',
  'ktr': 'ক্ত্র',
  'mpl': 'ম্প্ল',
  'ngg': 'ঙ্গ',
  'ngk': 'ঙ্ক',
  'ngm': 'ঙ্ম',
  'nkh': 'ঙ্খ',
  'nth': 'ন্থ',
  'ptr': 'প্ত্র',
  'shk': 'শ্ক',
  'shn': 'শ্ন',
  'shp': 'শ্প',
  'sht': 'শ্ত',
  'skr': 'স্ক্র',
  'spl': 'স্প্ল',
  'spr': 'স্প্র',
  
  // Double consonants
  'bb': 'ব্ব',
  'bh': 'ভ',
  'bd': 'ব্দ',
  'bj': 'ব্জ',
  'bl': 'ব্ল',
  'br': 'ব্র',
  'cc': 'চ্চ',
  'ch': 'ছ',
  'cj': 'চ্য',
  'ck': 'ক',
  'dd': 'দ্দ',
  'dh': 'ধ',
  'Dh': 'ঢ',
  'dj': 'দ্য',
  'dl': 'দ্ল',
  'dm': 'দ্ম',
  'dn': 'দ্ন',
  'dr': 'দ্র',
  'dv': 'দ্ব',
  'ff': 'ফ্ফ',
  'gg': 'জ্ঞ',
  'gh': 'ঘ',
  'gj': 'গ্য',
  'gl': 'গ্ল',
  'gm': 'গ্ম',
  'gn': 'গ্ন',
  'gr': 'গ্র',
  'hm': 'হ্ম',
  'hn': 'হ্ন',
  'hr': 'হ্র',
  'jh': 'ঝ',
  'jj': 'জ্জ',
  'jn': 'জ্ঞ',
  'jr': 'জ্র',
  'kh': 'খ',
  'kk': 'ক্ক',
  'kl': 'ক্ল',
  'km': 'ক্ম',
  'kn': 'ক্ন',
  'kr': 'ক্র',
  'kt': 'ক্ত',
  'lb': 'ল্ব',
  'ld': 'ল্ড',
  'lg': 'ল্গ',
  'lk': 'ল্ক',
  'll': 'ল্ল',
  'lm': 'ল্ম',
  'lp': 'ল্প',
  'lt': 'ল্ট',
  'mb': 'ম্ব',
  'mf': 'ম্ফ',
  'ml': 'ম্ল',
  'mm': 'ম্ম',
  'mn': 'ম্ন',
  'mp': 'ম্প',
  'mr': 'ম্র',
  'ms': 'ম্স',
  'mt': 'ম্ত',
  'nb': 'ন্ব',
  'nc': 'ঞ্চ',
  'nd': 'ন্দ',
  'Nd': 'ণ্ড',
  'ND': 'ণ্ড',
  'ng': 'ং',
  'NG': 'ঙ',
  'nj': 'ঞ্জ',
  'nk': 'ঙ্ক',
  'nl': 'ন্ল',
  'nm': 'ন্ম',
  'nn': 'ন্ন',
  'Nn': 'ণ্ণ',
  'NN': 'ণ্ণ',
  'np': 'ন্প',
  'ns': 'ন্স',
  'nt': 'ন্ত',
  'Nt': 'ণ্ট',
  'NT': 'ণ্ট',
  'nw': 'ন্ব',
  'ny': 'ন্য',
  'ph': 'ফ',
  'pk': 'প্ক',
  'pl': 'প্ল',
  'pn': 'প্ন',
  'pp': 'প্প',
  'pr': 'প্র',
  'ps': 'প্স',
  'pt': 'প্ত',
  'rb': 'র্ব',
  'rc': 'র্চ',
  'rd': 'র্দ',
  'rf': 'র্ফ',
  'rg': 'র্গ',
  'rh': 'র‌্হ',
  'rj': 'র্জ',
  'rk': 'র্ক',
  'rl': 'র্ল',
  'rm': 'র্ম',
  'rn': 'র্ন',
  'rp': 'র্প',
  'rr': 'র‌্র',
  'rs': 'র্স',
  'rt': 'র্ত',
  'rv': 'র্ভ',
  'rw': 'র্ব',
  'ry': 'র্য',
  'rZ': 'র্য',
  'sb': 'স্ব',
  'sc': 'স্ক',
  'sh': 'শ',
  'Sh': 'ষ',
  'SH': 'ষ',
  'sk': 'স্ক',
  'sl': 'স্ল',
  'sm': 'স্ম',
  'sn': 'স্ন',
  'sp': 'স্প',
  'sr': 'স্র',
  'ss': 'স্স',
  'st': 'স্ত',
  'sw': 'স্ব',
  'sy': 'স্য',
  'tb': 'ত্ব',
  'th': 'থ',
  'Th': 'ঠ',
  'TH': 'ঠ',
  'tj': 'ত্য',
  'tk': 'ট্ক',
  'tl': 'ত্ল',
  'tm': 'ত্ম',
  'tn': 'ত্ন',
  'tp': 'ত্প',
  'tr': 'ত্র',
  'Tr': 'ট্র',
  'TR': 'ট্র',
  'ts': 'ৎস',
  'tt': 'ত্ত',
  'tw': 'ত্ব',
  'ty': 'ত্য',
  'vr': 'ভ্র',
  
  // Single consonants
  'b': 'ব',
  'c': 'চ',
  'd': 'দ',
  'D': 'ড',
  'f': 'ফ',
  'g': 'গ',
  'h': 'হ',
  'j': 'জ',
  'k': 'ক',
  'l': 'ল',
  'm': 'ম',
  'n': 'ন',
  'N': 'ণ',
  'p': 'প',
  'q': 'ক',
  'r': 'র',
  'R': 'ড়',
  's': 'স',
  'S': 'ষ',
  't': 'ত',
  'T': 'ট',
  'v': 'ভ',
  'w': 'ও',
  'x': 'ক্স',
  'y': 'য়',
  'Y': 'য়',
  'z': 'য',
  'Z': 'য',
};

// Special characters
const SPECIAL = {
  '.': '।',
  '..': '।।',
  ':': ':',
  '^': 'ঁ',     // Chandrabindu
  '`': '',       // Suppress inherent vowel (hasanta helper)
  ',,': '্',     // Hasanta
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

// Common word dictionary for better accuracy
const DICTIONARY = {
  'ami': 'আমি',
  'tumi': 'তুমি',
  'apni': 'আপনি',
  'se': 'সে',
  'ora': 'ওরা',
  'amra': 'আমরা',
  'tomra': 'তোমরা',
  'apnara': 'আপনারা',
  'tara': 'তারা',
  'amar': 'আমার',
  'tomar': 'তোমার',
  'apnar': 'আপনার',
  'tar': 'তার',
  'amader': 'আমাদের',
  'tomader': 'তোমাদের',
  'apnader': 'আপনাদের',
  'tader': 'তাদের',
  'ki': 'কী',
  'keno': 'কেন',
  'kothay': 'কোথায়',
  'kokhon': 'কখন',
  'kivabe': 'কীভাবে',
  'koto': 'কত',
  'ke': 'কে',
  'kon': 'কোন',
  'hae': 'হ্যাঁ',
  'hya': 'হ্যাঁ',
  'han': 'হ্যাঁ',
  'na': 'না',
  'naa': 'না',
  'ache': 'আছে',
  'achen': 'আছেন',
  'achi': 'আছি',
  'acho': 'আছো',
  'chilo': 'ছিল',
  'chilen': 'ছিলেন',
  'chilam': 'ছিলাম',
  'chile': 'ছিলে',
  'hobe': 'হবে',
  'hoben': 'হবেন',
  'hobe': 'হবে',
  'kori': 'করি',
  'koro': 'করো',
  'koren': 'করেন',
  'kore': 'করে',
  'korchi': 'করছি',
  'korcho': 'করছো',
  'korchen': 'করছেন',
  'korche': 'করছে',
  'korbo': 'করবো',
  'korbe': 'করবে',
  'korben': 'করবেন',
  'korlam': 'করলাম',
  'korle': 'করলে',
  'korlen': 'করলেন',
  'korlo': 'করলো',
  'jani': 'জানি',
  'jano': 'জানো',
  'janen': 'জানেন',
  'jane': 'জানে',
  'janchi': 'জানছি',
  'jancho': 'জানছো',
  'janchen': 'জানছেন',
  'janbe': 'জানবে',
  'janbo': 'জানবো',
  'janlam': 'জানলাম',
  'janle': 'জানলে',
  'janlo': 'জানলো',
  'boli': 'বলি',
  'bolo': 'বলো',
  'bolen': 'বলেন',
  'bole': 'বলে',
  'bolchi': 'বলছি',
  'bolcho': 'বলছো',
  'bolchen': 'বলছেন',
  'bolche': 'বলছে',
  'bolbo': 'বলবো',
  'bolbe': 'বলবে',
  'bollam': 'বললাম',
  'bolle': 'বললে',
  'bollo': 'বললো',
  'dekhi': 'দেখি',
  'dekho': 'দেখো',
  'dekhen': 'দেখেন',
  'dekhe': 'দেখে',
  'dekhchi': 'দেখছি',
  'dekhcho': 'দেখছো',
  'dekhchen': 'দেখছেন',
  'dekhche': 'দেখছে',
  'dekhbo': 'দেখবো',
  'dekhbe': 'দেখবে',
  'dekhlam': 'দেখলাম',
  'dekhle': 'দেখলে',
  'dekhlo': 'দেখলো',
  'jai': 'যাই',
  'jao': 'যাও',
  'jan': 'যান',
  'jay': 'যায়',
  'jachi': 'যাচ্ছি',
  'jacho': 'যাচ্ছো',
  'jachen': 'যাচ্ছেন',
  'jache': 'যাচ্ছে',
  'jabo': 'যাবো',
  'jabe': 'যাবে',
  'jaben': 'যাবেন',
  'gelam': 'গেলাম',
  'gele': 'গেলে',
  'gelo': 'গেলো',
  'gelen': 'গেলেন',
  'asi': 'আসি',
  'aso': 'আসো',
  'asen': 'আসেন',
  'ase': 'আসে',
  'aschi': 'আসছি',
  'ascho': 'আসছো',
  'aschen': 'আসছেন',
  'asche': 'আসছে',
  'asbo': 'আসবো',
  'asbe': 'আসবে',
  'aslam': 'এলাম',
  'eshe': 'এসে',
  'ese': 'এসে',
  'elo': 'এলো',
  'khabo': 'খাবো',
  'khabe': 'খাবে',
  'khai': 'খাই',
  'khao': 'খাও',
  'khan': 'খান',
  'khay': 'খায়',
  'khachi': 'খাচ্ছি',
  'khacho': 'খাচ্ছো',
  'khachen': 'খাচ্ছেন',
  'khache': 'খাচ্ছে',
  'khelam': 'খেলাম',
  'khele': 'খেলে',
  'khelo': 'খেলো',
  'pari': 'পারি',
  'paro': 'পারো',
  'paren': 'পারেন',
  'pare': 'পারে',
  'parbo': 'পারবো',
  'parbe': 'পারবে',
  'parlam': 'পারলাম',
  'parle': 'পারলে',
  'valo': 'ভালো',
  'bhalo': 'ভালো',
  'kharap': 'খারাপ',
  'sundor': 'সুন্দর',
  'boro': 'বড়',
  'choto': 'ছোট',
  'notun': 'নতুন',
  'purano': 'পুরোনো',
  'bepar': 'ব্যাপার',
  'proshno': 'প্রশ্ন',
  'uttor': 'উত্তর',
  'bhai': 'ভাই',
  'bon': 'বোন',
  'ma': 'মা',
  'baba': 'বাবা',
  'dada': 'দাদা',
  'didi': 'দিদি',
  'bondhu': 'বন্ধু',
  'bari': 'বাড়ি',
  'school': 'স্কুল',
  'college': 'কলেজ',
  'office': 'অফিস',
  'bazar': 'বাজার',
  'hospital': 'হাসপাতাল',
  'thana': 'থানা',
  'manush': 'মানুষ',
  'lok': 'লোক',
  'chele': 'ছেলে',
  'meye': 'মেয়ে',
  'baccha': 'বাচ্চা',
  'samay': 'সময়',
  'din': 'দিন',
  'rat': 'রাত',
  'sokal': 'সকাল',
  'dupur': 'দুপুর',
  'bikel': 'বিকেল',
  'sondhya': 'সন্ধ্যা',
  'aj': 'আজ',
  'kal': 'কাল',
  'porso': 'পরশু',
  'gotokal': 'গতকাল',
  'sombar': 'সোমবার',
  'mongolbar': 'মঙ্গলবার',
  'budhbar': 'বুধবার',
  'brihospotibar': 'বৃহস্পতিবার',
  'shukrobar': 'শুক্রবার',
  'shonibar': 'শনিবার',
  'robibar': 'রবিবার',
  'bangla': 'বাংলা',
  'bangladesh': 'বাংলাদেশ',
  'bharot': 'ভারত',
  'dhaka': 'ঢাকা',
  'kolkata': 'কলকাতা',
  'chai': 'চাই',
  'chao': 'চাও',
  'chan': 'চান',
  'chay': 'চায়',
  'chaibo': 'চাইবো',
  'chaibe': 'চাইবে',
  'kemon': 'কেমন',
  'emon': 'এমন',
  'onek': 'অনেক',
  'ektu': 'একটু',
  'eka': 'একা',
  'dui': 'দুই',
  'tin': 'তিন',
  'char': 'চার',
  'pach': 'পাঁচ',
  'choy': 'ছয়',
  'sat': 'সাত',
  'at': 'আট',
  'noy': 'নয়',
  'dosh': 'দশ',
  'ek': 'এক',
  'ar': 'আর',
  'o': 'ও',
  'ba': 'বা',
  'ebong': 'এবং',
  'kintu': 'কিন্তু',
  'jokhon': 'যখন',
  'tokhon': 'তখন',
  'jodi': 'যদি',
  'tahole': 'তাহলে',
  'r': 'র',
  'thik': 'ঠিক',
  'shob': 'সব',
  'shobai': 'সবাই',
  'keu': 'কেউ',
  'kichhu': 'কিছু',
  'proti': 'প্রতি',
  'prottekta': 'প্রত্যেকটা',
  'dhonnobad': 'ধন্যবাদ',
  'dhanyabad': 'ধন্যবাদ',
  'shuvo': 'শুভ',
  'shubho': 'শুভ',
  'nomoskar': 'নমস্কার',
  'namaskar': 'নমস্কার',
  'assalamualaikum': 'আসসালামুআলাইকুম',
  'salam': 'সালাম',
  'khoda': 'খোদা',
  'allah': 'আল্লাহ',
  'ishwar': 'ঈশ্বর',
  'bhagwan': 'ভগবান',
  'pray': 'প্রায়',
  'obosshoi': 'অবশ্যই',
  'hoyto': 'হয়তো',
  'hoyeto': 'হয়তো',
  'ekhon': 'এখন',
  'tokhon': 'তখন',
  'ekhane': 'এখানে',
  'sekhane': 'সেখানে',
  'okhane': 'ওখানে',
  'theke': 'থেকে',
  'jonno': 'জন্য',
  'jonne': 'জন্যে',
  'sathe': 'সাথে',
  'shathe': 'সাথে',
  'diye': 'দিয়ে',
  'niye': 'নিয়ে',
  'kore': 'করে',
  'bole': 'বলে',
  'hoe': 'হয়ে',
  'hoye': 'হয়ে',
  'lagche': 'লাগছে',
  'lagbe': 'লাগবে',
  'lage': 'লাগে',
  'dorkar': 'দরকার',
  'proyojon': 'প্রয়োজন',
  'mone': 'মনে',
  'moner': 'মনের',
  'jibon': 'জীবন',
  'jiboner': 'জীবনের',
  'prithibi': 'পৃথিবী',
  'duniya': 'দুনিয়া',
  'desh': 'দেশ',
  'desher': 'দেশের',
  'bhashar': 'ভাষার',
  'bhasha': 'ভাষা',
  'golpo': 'গল্প',
  'kobita': 'কবিতা',
  'gan': 'গান',
  'chobi': 'ছবি',
  'cinema': 'সিনেমা',
  'natok': 'নাটক',
  'boi': 'বই',
  'potro': 'পত্র',
  'chithi': 'চিঠি',
  'khabar': 'খবর',
  'shongbad': 'সংবাদ',
  'chinta': 'চিন্তা',
  'vabna': 'ভাবনা',
  'bhabna': 'ভাবনা',
  'asha': 'আশা',
  'swapno': 'স্বপ্ন',
  'iccha': 'ইচ্ছা',
  'icha': 'ইচ্ছা',
  'uchit': 'উচিত',
  'uchiT': 'উচিৎ',
  'dhormo': 'ধর্ম',
  'shikkha': 'শিক্ষা',
  'siksha': 'শিক্ষা',
  'kaj': 'কাজ',
  'kaaj': 'কাজ',
  'kaam': 'কাম',
  'shuru': 'শুরু',
  'sesh': 'শেষ',
  'majhe': 'মাঝে',
  'age': 'আগে',
  'pore': 'পরে',
  'upore': 'উপরে',
  'niche': 'নিচে',
  'baire': 'বাইরে',
  'bhetore': 'ভেতরে',
  'bhitore': 'ভিতরে',
  'kache': 'কাছে',
  'dure': 'দূরে',
  'paashe': 'পাশে',
  'pashe': 'পাশে',
  'shamne': 'সামনে',
  'pichone': 'পিছনে',
  'dangay': 'ডানে',
  'bamey': 'বামে',
  'taka': 'টাকা',
  'poisha': 'পয়সা',
  'dam': 'দাম',
  'kena': 'কেনা',
  'becha': 'বেচা',
  'bikri': 'বিক্রি',
  'bikroy': 'বিক্রয়',
  'byapar': 'ব্যাপার',
  'byabsha': 'ব্যবসা',
  'chakri': 'চাকরি',
  'kormo': 'কর্ম',
  'kormosthol': 'কর্মস্থল',
  'pani': 'পানি',
  'jol': 'জল',
  'khaddo': 'খাদ্য',
  'khabar': 'খাবার',
  'vat': 'ভাত',
  'bhat': 'ভাত',
  'ruti': 'রুটি',
  'torkari': 'তরকারি',
  'mach': 'মাছ',
  'mangso': 'মাংস',
  'dim': 'ডিম',
  'dudh': 'দুধ',
  'cha': 'চা',
  'coffee': 'কফি',
  'phal': 'ফল',
  'shobji': 'সবজি',
  'sobji': 'সবজি',
  'gach': 'গাছ',
  'ful': 'ফুল',
  'pata': 'পাতা',
  'ghor': 'ঘর',
  'ghorer': 'ঘরের',
  'dari': 'দরজা',
  'dorja': 'দরজা',
  'janala': 'জানালা',
  'chhat': 'ছাদ',
  'deyal': 'দেয়াল',
  'mati': 'মাটি',
  'akash': 'আকাশ',
  'chad': 'চাঁদ',
  'surjo': 'সূর্য',
  'surya': 'সূর্য',
  'tara': 'তারা',
  'megh': 'মেঘ',
  'bristi': 'বৃষ্টি',
  'brishti': 'বৃষ্টি',
  'jhoro': 'ঝড়',
  'jhod': 'ঝড়',
  'batas': 'বাতাস',
  'nodi': 'নদী',
  'shagar': 'সাগর',
  'sagar': 'সাগর',
  'samudro': 'সমুদ্র',
  'pahar': 'পাহাড়',
  'parbat': 'পর্বত',
  'bon': 'বন',
  'jungle': 'জঙ্গল',
  'jongol': 'জঙ্গল',
  'chotpot': 'চটপট',
  'taratari': 'তাড়াতাড়ি',
  'dhire': 'ধীরে',
  'aste': 'আস্তে',
  'jore': 'জোরে',
  'sahajje': 'সাহায্য',
  'shahajjo': 'সাহায্য',
};

/**
 * Check if a character is a vowel key
 */
function isVowelKey(char) {
  return 'aAiIuUeEoO'.includes(char);
}

/**
 * Check if a character is a consonant key
 */
function isConsonantKey(char) {
  return /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/.test(char);
}

/**
 * Get all consonant keys sorted by length (longest first)
 */
const SORTED_CONSONANT_KEYS = Object.keys(CONSONANTS).sort((a, b) => b.length - a.length);
const SORTED_VOWEL_KEYS = Object.keys(VOWELS).sort((a, b) => b.length - a.length);
const SORTED_STANDALONE_VOWEL_KEYS = Object.keys(STANDALONE_VOWELS).sort((a, b) => b.length - a.length);

/**
 * Main transliteration function
 */
function transliterate(input) {
  if (!input || input.trim() === '') {
    return input;
  }

  // Check dictionary first
  const lowerInput = input.toLowerCase();
  if (DICTIONARY[lowerInput]) {
    return DICTIONARY[lowerInput];
  }

  let result = '';
  let i = 0;
  let isWordStart = true;

  while (i < input.length) {
    const char = input[i];
    
    // Handle special characters
    if (SPECIAL[char] !== undefined) {
      // Check for double special chars like ..
      if (i + 1 < input.length && SPECIAL[char + input[i + 1]] !== undefined) {
        result += SPECIAL[char + input[i + 1]];
        i += 2;
      } else {
        result += SPECIAL[char];
        i++;
      }
      isWordStart = true;
      continue;
    }

    // Handle whitespace
    if (/\s/.test(char)) {
      result += char;
      i++;
      isWordStart = true;
      continue;
    }

    // Handle punctuation that should pass through
    if (/[!@#$%&*()_+=\[\]{};':"\\|,<>\/?`~-]/.test(char)) {
      result += char;
      i++;
      isWordStart = true;
      continue;
    }

    // Try to match vowel at word start
    if (isWordStart) {
      let matchedVowel = false;
      for (const vowelKey of SORTED_STANDALONE_VOWEL_KEYS) {
        if (input.substring(i, i + vowelKey.length).toLowerCase() === vowelKey.toLowerCase() &&
            input.substring(i, i + vowelKey.length) === vowelKey) {
          result += STANDALONE_VOWELS[vowelKey];
          i += vowelKey.length;
          isWordStart = false;
          matchedVowel = true;
          break;
        }
      }
      if (matchedVowel) continue;
    }

    // Try to match consonants (longest match first)
    let matchedConsonant = false;
    for (const consKey of SORTED_CONSONANT_KEYS) {
      const substr = input.substring(i, i + consKey.length);
      if (substr === consKey) {
        result += CONSONANTS[consKey];
        i += consKey.length;
        isWordStart = false;
        matchedConsonant = true;

        // Check if followed by a vowel
        if (i < input.length) {
          let matchedVowelAfter = false;
          for (const vowelKey of SORTED_VOWEL_KEYS) {
            const vowelSubstr = input.substring(i, i + vowelKey.length);
            if (vowelSubstr.toLowerCase() === vowelKey.toLowerCase() &&
                vowelSubstr === vowelKey) {
              // Add vowel kar
              result += VOWELS[vowelKey];
              i += vowelKey.length;
              matchedVowelAfter = true;
              break;
            }
          }
          // If no vowel follows, add hasanta for joining or inherent 'অ'
          // Actually in Bengali script, consonants have inherent 'অ' sound
          // We don't need to add anything explicitly
        }
        break;
      }
    }
    if (matchedConsonant) continue;

    // Try to match standalone vowels mid-word
    let matchedMidVowel = false;
    for (const vowelKey of SORTED_STANDALONE_VOWEL_KEYS) {
      const substr = input.substring(i, i + vowelKey.length);
      if (substr.toLowerCase() === vowelKey.toLowerCase() && substr === vowelKey) {
        result += STANDALONE_VOWELS[vowelKey];
        i += vowelKey.length;
        isWordStart = false;
        matchedMidVowel = true;
        break;
      }
    }
    if (matchedMidVowel) continue;

    // Pass through unrecognized characters
    result += char;
    i++;
    isWordStart = !(/[a-zA-Z]/.test(char));
  }

  return result;
}

module.exports = { transliterate, DICTIONARY };
