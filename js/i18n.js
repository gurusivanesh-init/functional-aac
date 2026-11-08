// Internationalization (i18n) & Age-Specific Vocabulary Engine for Functional AAC
// Supported Languages: English (en), Tamil (ta), Telugu (te), Kannada (kn), Hindi (hi)

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', voiceLang: 'en-US', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', voiceLang: 'ta-IN', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', voiceLang: 'te-IN', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', voiceLang: 'kn-IN', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voiceLang: 'hi-IN', flag: '🇮🇳' },
];

// Age Group Category Rules:
// - Children (3-12): Core needs only (Home, School, Feelings, Health, Social, Activities, Emergency). NO Work, NO adult transit, NO advanced studies.
// - Teenagers (13-17): Adds Studies & Transportation. NO adult Work.
// - Adults (18+): Adds Work, Transit, Higher Studies. NO primary School.
// - All Ages: Comprehensive access to all 10 categories.
export const CATEGORY_AGE_RULES = {
  Home: ['Children', 'Teenagers', 'Adults'],
  School: ['Children', 'Teenagers'],
  Studies: ['Teenagers', 'Adults'],
  Work: ['Adults'],
  Transportation: ['Teenagers', 'Adults'],
  Feelings: ['Children', 'Teenagers', 'Adults'],
  Health: ['Children', 'Teenagers', 'Adults'],
  Social: ['Children', 'Teenagers', 'Adults'],
  Activities: ['Children', 'Teenagers', 'Adults'],
  Emergency: ['Children', 'Teenagers', 'Adults'],
};

// Category Translations
export const CATEGORY_TRANSLATIONS = {
  Home: { en: 'Home', ta: 'வீடு', te: 'ఇల్లు', kn: 'ಮನೆ', hi: 'घर' },
  School: { en: 'School', ta: 'பள்ளி', te: 'పాఠశాల', kn: 'ಶಾಲೆ', hi: 'स्कूल' },
  Studies: { en: 'Studies', ta: 'படிப்பு', te: 'చదువు', kn: 'ಅಧ್ಯಯನ', hi: 'पढ़ाई' },
  Work: { en: 'Work', ta: 'வேலை', te: 'పని', kn: 'ಕೆಲಸ', hi: 'काम' },
  Transportation: { en: 'Transportation', ta: 'போக்குவரத்து', te: 'రవాణా', kn: 'ಸಾರಿಗೆ', hi: 'परिवहन' },
  Feelings: { en: 'Feelings', ta: 'உணர்வுகள்', te: 'భావోద్వేగాలు', kn: 'ಭಾವನೆಗಳು', hi: 'भावनाएं' },
  Health: { en: 'Health', ta: 'உடல்நலம்', te: 'ఆరోగ్యం', kn: 'ಆರೋಗ್ಯ', hi: 'स्वास्थ्य' },
  Social: { en: 'Social', ta: 'சமூகம்', te: 'సామాజికం', kn: 'ಸಾಮಾಜಿಕ', hi: 'सामाजिक' },
  Activities: { en: 'Activities', ta: 'செயல்பாடுகள்', te: 'కార్యకలాపాలు', kn: 'ಚಟುವಟಿಕೆಗಳು', hi: 'गतिविधियाँ' },
  Emergency: { en: 'Emergency', ta: 'அவசரநிலை', te: 'అత్యవసరం', kn: 'ತುರ್ತು', hi: 'आपातकालीन' }
};

// Core Utterances Translations
export const CORE_WORDS = {
  YES: { en: 'YES', ta: 'ஆம்', te: 'అవును', kn: 'ಹೌದು', hi: 'हाँ' },
  NO: { en: 'NO', ta: 'இல்லை', te: 'కాదు', kn: 'ಇಲ್ಲ', hi: 'नहीं' },
  PLEASE: { en: 'PLEASE', ta: 'தயவுசெய்து', te: 'దయచేసి', kn: 'ದಯವಿಟ್ಟು', hi: 'कृपया' },
  THANK_YOU: { en: 'THANK YOU', ta: 'நன்றி', te: 'ధన్యవాదాలు', kn: 'ಧನ್ಯವಾದ', hi: 'धन्यवाद' },
  HELP: { en: 'HELP', ta: 'உதவி', te: 'సహాయం', kn: 'ಸಹಾಯ', hi: 'मदद' },
  STOP: { en: 'STOP', ta: 'நிறுத்து', te: 'ఆపు', kn: 'ನಿಲ್ಲಿಸಿ', hi: 'रुको' },
  SPEAK: { en: 'Speak', ta: 'பேசு', te: 'మాట్లాడు', kn: 'ಮಾತನಾಡು', hi: 'बोलें' },
  CLEAR: { en: 'Clear', ta: 'அழி', te: 'తుడిచివేయి', kn: 'ಅಳಿಸು', hi: 'साफ़' },
  SOS_TITLE: { en: 'EMERGENCY SOS', ta: 'அவசர உதவி (SOS)', te: 'అత్యవసర SOS', kn: 'ತುರ್ತು SOS', hi: 'आपातकालीन SOS' },
  SOS_ACTION: { en: 'QUICK ASSIST →', ta: 'அவசர உதவி →', te: 'సత్వర సహాయం →', kn: 'ತ್ವರಿತ ನೆರವು →', hi: 'त्वरित सहायता →' },
  READY: { en: 'Ready to communicate', ta: 'பேசத் தயார்', te: 'మాట్లాడటానికి సిద్ధం', kn: 'ಸಂವಹನಕ್ಕೆ ಸಿದ್ಧ', hi: 'बातचीत के लिए तैयार' },
  VIEWING_SOS: { en: 'Viewing SOS Mode', ta: 'அவசர நிலை பயன்முறை', te: 'SOS మోడ్ చూస్తున్నారు', kn: 'SOS ಮೋಡ್ ವೀಕ್ಷಣೆ', hi: 'SOS मोड सक्रिय' }
};

// Comprehensive Phrase Translations (All 79 system starter phrases + custom starters)
export const PHRASE_TRANSLATIONS = {
  // --- HOME ---
  sys_home_1: { en: 'I am hungry.', ta: 'எனக்கு பசிக்கிறது.', te: 'నాకు ఆకలిగా ఉంది.', kn: 'ನನಗೆ ಹಸಿವಾಗಿದೆ.', hi: 'मुझे भूख लगी है।' },
  sys_home_2: { en: 'I want water.', ta: 'எனக்கு தண்ணீர் வேண்டும்.', te: 'నాకు నీళ్లు కావాలి.', kn: 'ನನಗೆ ನೀರು ಬೇಕು.', hi: 'मुझे पानी चाहिए।' },
  sys_home_3: { en: 'I need to use the toilet.', ta: 'நான் கழிப்பறைக்கு செல்ல வேண்டும்.', te: 'నేను టాయిలెట్‌కి వెళ్ళాలి.', kn: 'ನಾನು ಶೌಚಾಲಯಕ್ಕೆ ಹೋಗಬೇಕು.', hi: 'मुझे शौचालय जाना है।' },
  sys_home_4: { en: 'I want to sleep.', ta: 'நான் தூங்க வேண்டும்.', te: 'నేను నిద్రపోవాలి.', kn: 'ನಾನು ಮಲಗಬೇಕು.', hi: 'मुझे सोना है।' },
  sys_home_5: { en: 'I need help.', ta: 'எனக்கு உதவி வேண்டும்.', te: 'నాకు సహాయం కావాలి.', kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು.', hi: 'मुझे मदद चाहिए।' },
  sys_home_6: { en: 'I am uncomfortable.', ta: 'எனக்கு அசௌகரியமாக இருக்கிறது.', te: 'నాకు అసౌకర్యంగా ఉంది.', kn: 'ನನಗೆ ಅಸಹನೀಯವಾಗಿದೆ.', hi: 'मुझे असहज लग रहा है।' },
  sys_home_7: { en: "I don't feel well.", ta: 'எனக்கு உடம்பு சரியில்லை.', te: 'నాకు ఒంట్లో బాగాలేదు.', kn: 'ನನಗೆ ಹುಷಾರಿಲ್ಲ.', hi: 'मेरी तबीयत ठीक नहीं है।' },
  sys_home_8: { en: 'I want to go outside.', ta: 'நான் வெளியே செல்ல விரும்புகிறேன்.', te: 'నేను బయటికి వెళ్ళాలి.', kn: 'ನಾನು ಹೊರಗೆ ಹೋಗಬೇಕು.', hi: 'मुझे बाहर जाना है।' },

  // --- SCHOOL ---
  sys_sch_1: { en: 'I need help.', ta: 'எனக்கு உதவி வேண்டும்.', te: 'నాకు సహాయం కావాలి.', kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು.', hi: 'मुझे मदद चाहिए।' },
  sys_sch_2: { en: "I don't understand.", ta: 'எனக்கு புரியவில்லை.', te: 'నాకు అర్థం కాలేదు.', kn: 'ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ.', hi: 'मुझे समझ नहीं आया।' },
  sys_sch_3: { en: 'Please explain again.', ta: 'தயவுசெய்து மீண்டும் விளக்குங்கள்.', te: 'దయచేసి మళ్లీ వివరించండి.', kn: 'ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ವಿವರಿಸಿ.', hi: 'कृपया दोबारा समझाएं।' },
  sys_sch_4: { en: 'I finished my work.', ta: 'நான் என் வேலையை முடித்துவிட்டேன்.', te: 'నేను నా పని పూర్తి చేశాను.', kn: 'ನಾನು ನನ್ನ ಕೆಲಸ ಮುಗಿಸಿದ್ದೇನೆ.', hi: 'मैंने अपना काम पूरा कर लिया।' },
  sys_sch_5: { en: 'I need a break.', ta: 'எனக்கு சிறிது ஓய்வு வேண்டும்.', te: 'నాకు కాసేపు విరామం కావాలి.', kn: 'ನನಗೆ ವಿರಾಮ ಬೇಕು.', hi: 'मुझे ब्रेक चाहिए।' },
  sys_sch_6: { en: 'I want to use the toilet.', ta: 'நான் கழிப்பறைக்கு செல்ல வேண்டும்.', te: 'నేను టాయిలెట్ వెళ్ళాలి.', kn: 'ನಾನು ಶೌಚಾಲಯಕ್ಕೆ ಹೋಗಬೇಕು.', hi: 'मुझे शौचालय जाना है।' },
  sys_sch_7: { en: 'I need a pencil.', ta: 'எனக்கு பென்சில் வேண்டும்.', te: 'నాకు పెన్సిల్ కావాలి.', kn: 'ನನಗೆ ಪೆನ್ಸಿಲ್ ಬೇಕು.', hi: 'मुझे पेंसिल चाहिए।' },
  sys_sch_8: { en: 'I have a question.', ta: 'எனக்கு ஒரு கேள்வி உள்ளது.', te: 'నాకు ఒక ప్రశ్న ఉంది.', kn: 'ನನಗೆ ಒಂದು ಪ್ರಶ್ನೆ ಇದೆ.', hi: 'मेरा एक सवाल है।' },
  sys_sch_9: { en: "I don't feel well.", ta: 'எனக்கு உடம்பு சரியில்லை.', te: 'నాకు ఒంట్లో బాగాలేదు.', kn: 'ನನಗೆ ಹುಷಾರಿಲ್ಲ.', hi: 'मेरी तबीयत ठीक नहीं है।' },

  // --- STUDIES ---
  sys_stu_1: { en: 'I need help with this.', ta: 'இதில் எனக்கு உதவி தேவை.', te: 'దీనిలో నాకు సహాయం కావాలి.', kn: 'ಇದರಲ್ಲಿ ನನಗೆ ಸಹಾಯ ಬೇಕು.', hi: 'मुझे इसमें मदद चाहिए।' },
  sys_stu_2: { en: "I don't understand this topic.", ta: 'எனக்கு இந்த தலைப்பு புரியவில்லை.', te: 'నాకు ఈ విషయం అర్థం కాలేదు.', kn: 'ನನಗೆ ಈ ವಿಷಯ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ.', hi: 'मुझे यह विषय समझ नहीं आया।' },
  sys_stu_3: { en: 'Please explain it again.', ta: 'தயவுசெய்து மீண்டும் சொல்லுங்கள்.', te: 'దయచేసి మళ్లీ చెప్పండి.', kn: 'ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ತಿಳಿಸಿ.', hi: 'कृपया इसे फिर से समझाएं।' },
  sys_stu_4: { en: 'I have completed the assignment.', ta: 'நான் ஒப்படைப்பை முடித்துவிட்டேன்.', te: 'నేను అసైన్‌మెంట్ పూర్తి చేశాను.', kn: 'ನಾನು ನಿಯೋಜನೆ ಮುಗಿಸಿದ್ದೇನೆ.', hi: 'मैंने असाइनमेंट पूरा कर लिया है।' },
  sys_stu_5: { en: 'I need more time.', ta: 'எனக்கு கூடுதல் நேரம் வேண்டும்.', te: 'నాకు మరింత సమయం కావాలి.', kn: 'ನನಗೆ ಹೆಚ್ಚಿನ ಸಮಯ ಬೇಕು.', hi: 'मुझे और समय चाहिए।' },
  sys_stu_6: { en: 'Can you help me?', ta: 'நீங்கள் எனக்கு உதவ முடியுமா?', te: 'మీరు నాకు సహాయం చేయగలరా?', kn: 'ನೀವು ನನಗೆ ಸಹಾಯ ಮಾಡಬಹುದೇ?', hi: 'क्या आप मेरी मदद कर सकते हैं?' },

  // --- WORK ---
  sys_wrk_1: { en: 'I need help.', ta: 'எனக்கு உதவி தேவை.', te: 'నాకు సహాయం కావాలి.', kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು.', hi: 'मुझे मदद चाहिए।' },
  sys_wrk_2: { en: 'I have finished this task.', ta: 'நான் இந்த வேலையை முடித்துவிட்டேன்.', te: 'నేను ఈ పని పూర్తి చేశాను.', kn: 'ನಾನು ಈ ಕೆಲಸ ಮುಗಿಸಿದ್ದೇನೆ.', hi: 'मैंने यह काम पूरा कर लिया है।' },
  sys_wrk_3: { en: 'I need more time.', ta: 'எனக்கு கூடுதல் நேரம் வேண்டும்.', te: 'నాకు మరింత సమయం కావాలి.', kn: 'ನನಗೆ ಹೆಚ್ಚಿನ ಸಮಯ ಬೇಕು.', hi: 'मुझे और समय चाहिए।' },
  sys_wrk_4: { en: 'I have a question.', ta: 'எனக்கு ஒரு சந்தேகம் உள்ளது.', te: 'నాకు ఒక ప్రశ్న ఉంది.', kn: 'ನನಗೆ ಒಂದು ಪ್ರಶ್ನೆ ಇದೆ.', hi: 'मेरा एक प्रश्न है।' },
  sys_wrk_5: { en: 'I need a break.', ta: 'எனக்கு இடைவேளை வேண்டும்.', te: 'నాకు విరామం కావాలి.', kn: 'ನನಗೆ ವಿರಾಮ ಬೇಕು.', hi: 'मुझे ब्रेक चाहिए।' },
  sys_wrk_6: { en: "I don't feel well.", ta: 'எனக்கு உடம்பு சரியில்லை.', te: 'నాకు ఆరోగ్యం బాగాలేదు.', kn: 'ನನಗೆ ಹುಷಾರಿಲ್ಲ.', hi: 'मेरी तबीयत ठीक नहीं लग रही।' },
  sys_wrk_7: { en: 'Please explain the task again.', ta: 'பணியை மீண்டும் விளக்குங்கள்.', te: 'దయచేసి పనిని మళ్లీ వివరించండి.', kn: 'ದಯವಿಟ್ಟು ಕೆಲಸವನ್ನು ಮತ್ತೊಮ್ಮೆ ವಿವರಿಸಿ.', hi: 'कृपया काम को दोबारा समझाइए।' },

  // --- TRANSPORTATION ---
  sys_trn_1: { en: 'I want to go home.', ta: 'நான் வீட்டிற்கு செல்ல வேண்டும்.', te: 'నేను ఇంటికి వెళ్ళాలి.', kn: 'ನಾನು ಮನೆಗೆ ಹೋಗಬೇಕು.', hi: 'मुझे घर जाना है।' },
  sys_trn_2: { en: 'I want to go to school.', ta: 'நான் பள்ளிக்கு செல்ல வேண்டும்.', te: 'నేను స్కూల్‌కి వెళ్ళాలి.', kn: 'ನಾನು ಶಾಲೆಗೆ ಹೋಗಬೇಕು.', hi: 'मुझे स्कूल जाना है।' },
  sys_trn_3: { en: 'Where are we going?', ta: 'நாம் எங்கே போகிறோம்?', te: 'మనం ఎక్కడికి వెళ్తున్నాం?', kn: 'ನಾವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೇವೆ?', hi: 'हम कहाँ जा रहे हैं?' },
  sys_trn_4: { en: 'Please stop here.', ta: 'தயவுசெய்து இங்கே நிறுத்துங்கள்.', te: 'దయచేసి ఇక్కడ ఆపండి.', kn: 'ದಯವಿಟ್ಟು ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.', hi: 'कृपया यहाँ रोकिए।' },
  sys_trn_5: { en: 'I need help.', ta: 'எனக்கு உதவி வேண்டும்.', te: 'నాకు సహాయం కావాలి.', kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು.', hi: 'मुझे मदद चाहिए।' },
  sys_trn_6: { en: 'How much is the ticket?', ta: 'டிக்கெட் விலை எவ்வளவு?', te: 'టికెట్ ధర ఎంత?', kn: 'ಟಿಕೆಟ್ ಬೆಲೆ ಎಷ್ಟು?', hi: 'टिकट कितने का है?' },
  sys_trn_7: { en: 'I have lost my ticket.', ta: 'நான் என் டிக்கெட்டை தொலைத்துவிட்டேன்.', te: 'నేను నా టికెట్ పోగొట్టుకున్నాను.', kn: 'ನನ್ನ ಟಿಕೆಟ್ ಕಳೆದುಹೋಗಿದೆ.', hi: 'मेरा टिकट खो गया है।' },
  sys_trn_8: { en: 'I am feeling uncomfortable.', ta: 'எனக்கு அசௌகரியமாக இருக்கிறது.', te: 'నాకు అసౌకర్యంగా ఉంది.', kn: 'ನನಗೆ ಅಸಹನೀಯವಾಗಿದೆ.', hi: 'मुझे असहज लग रहा है।' },

  // --- FEELINGS ---
  sys_fel_1: { en: 'I am happy.', ta: 'நான் மகிழ்ச்சியாக இருக்கிறேன்.', te: 'నేను సంతోషంగా ఉన్నాను.', kn: 'ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ.', hi: 'मैं खुश हूँ।' },
  sys_fel_2: { en: 'I am sad.', ta: 'நான் வருத்தமாக இருக்கிறேன்.', te: 'నేను బాధగా ఉన్నాను.', kn: 'ನಾನು ದುಃಖಿತನಾಗಿದ್ದೇನೆ.', hi: 'मैं दुखी हूँ।' },
  sys_fel_3: { en: 'I am angry.', ta: 'நான் கோபமாக இருக்கிறேன்.', te: 'నాకు కోపంగా ఉంది.', kn: 'ನನಗೆ ಕೋಪ ಬಂದಿದೆ.', hi: 'मुझे गुस्सा आ रहा है।' },
  sys_fel_4: { en: 'I am scared.', ta: 'எனக்கு பயமாக இருக்கிறது.', te: 'నాకు భయంగా ఉంది.', kn: 'ನನಗೆ ಭಯವಾಗುತ್ತಿದೆ.', hi: 'मुझे डर लग रहा है।' },
  sys_fel_5: { en: 'I am tired.', ta: 'நான் சோர்வாக இருக்கிறேன்.', te: 'నేను అలసిపోయాను.', kn: 'ನನಗೆ ಆಯಾಸವಾಗಿದೆ.', hi: 'मैं थक गया हूँ।' },
  sys_fel_6: { en: 'I am confused.', ta: 'எனக்கு குழப்பமாக இருக்கிறது.', te: 'నాకు గందరగోళంగా ఉంది.', kn: 'ನನಗೆ ಗೊಂದಲವಾಗಿದೆ.', hi: 'मैं उलझन में हूँ।' },
  sys_fel_7: { en: 'I am uncomfortable.', ta: 'எனக்கு அசௌகரியமாக இருக்கிறது.', te: 'నాకు అసౌకర్యంగా ఉంది.', kn: 'ನನಗೆ ಅಸಹನೀಯವಾಗಿದೆ.', hi: 'मुझे असहज लग रहा है।' },
  sys_fel_8: { en: 'I am worried.', ta: 'எனக்கு கவலையாக இருக்கிறது.', te: 'నాకు ఆందోళనగా ఉంది.', kn: 'ನನಗೆ ಚಿಂತೆಯಾಗಿದೆ.', hi: 'मुझे चिंता हो रही है।' },

  // --- HEALTH ---
  sys_hlt_1: { en: 'I am in pain.', ta: 'எனக்கு வலிக்கிறது.', te: 'నాకు నొప్పిగా ఉంది.', kn: 'ನನಗೆ ನೋವಾಗುತ್ತಿದೆ.', hi: 'मुझे दर्द हो रहा है।' },
  sys_hlt_2: { en: 'I feel sick.', ta: 'எனக்கு உடம்பு சரியில்லை.', te: 'నాకు అనారోగ్యంగా ఉంది.', kn: 'ನನಗೆ ಹುಷಾರಿಲ್ಲ.', hi: 'मुझे बीमार महसूस हो रहा है।' },
  sys_hlt_3: { en: 'I feel dizzy.', ta: 'எனக்கு தலை சுற்றுகிறது.', te: 'నాకు తల తిరుగుతోంది.', kn: 'ನನಗೆ ತಲೆ ತಿರುಗುತ್ತಿದೆ.', hi: 'मुझे चक्कर आ रहे हैं।' },
  sys_hlt_4: { en: 'I need medicine.', ta: 'எனக்கு மருந்து வேண்டும்.', te: 'నాకు మందులు కావాలి.', kn: 'ನನಗೆ ಔಷಧಿ ಬೇಕು.', hi: 'मुझे दवाई चाहिए।' },
  sys_hlt_5: { en: 'I need to see a doctor.', ta: 'நான் மருத்துவரைப் பார்க்க வேண்டும்.', te: 'నేను డాక్టర్‌ని చూడాలి.', kn: 'ನಾನು ವೈದ್ಯರನ್ನು ನೋಡಬೇಕು.', hi: 'मुझे डॉक्टर को दिखाना है।' },
  sys_hlt_6: { en: 'I need help.', ta: 'எனக்கு உதவி வேண்டும்.', te: 'నాకు సహాయం కావాలి.', kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು.', hi: 'मुझे मदद चाहिए।' },
  sys_hlt_7: { en: 'I am having difficulty breathing.', ta: 'எனக்கு மூச்சு விடுவதில் சிரமம் உள்ளது.', te: 'నాకు శ్వాస తీసుకోవడం కష్టంగా ఉంది.', kn: 'ನನಗೆ ಉಸಿರಾಟದ ತೊಂದರೆಯಾಗಿದೆ.', hi: 'मुझे सांस लेने में तकलीफ हो रही है।' },

  // --- SOCIAL ---
  sys_soc_1: { en: 'Hello.', ta: 'வணக்கம்.', te: 'నమస్కారం.', kn: 'ನಮಸ್ಕಾರ.', hi: 'नमस्ते।' },
  sys_soc_2: { en: 'Goodbye.', ta: 'போய் வருகிறேன்.', te: 'వెళ్లి వస్తాను.', kn: 'ಹೋಗಿ ಬರುತ್ತೇನೆ.', hi: 'अलविदा।' },
  sys_soc_3: { en: 'Thank you.', ta: 'நன்றி.', te: 'ధన్యవాదాలు.', kn: 'ಧನ್ಯವಾದಗಳು.', hi: 'धन्यवाद।' },
  sys_soc_4: { en: 'Please.', ta: 'தயவுசெய்து.', te: 'దయచేసి.', kn: 'ದಯವಿಟ್ಟು.', hi: 'कृपया।' },
  sys_soc_5: { en: 'I want to talk.', ta: 'நான் பேச விரும்புகிறேன்.', te: 'నేను మాట్లాడాలి అనుకుంటున్నాను.', kn: 'ನಾನು ಮಾತನಾಡಲು ಬಯಸುತ್ತೇನೆ.', hi: 'मैं बात करना चाहता हूँ।' },
  sys_soc_6: { en: "I don't want to talk.", ta: 'நான் பேச விரும்பவில்லை.', te: 'నేను మాట్లాడాలని అనుకోవడం లేదు.', kn: 'ನಾನು ಮಾತನಾಡಲು ಇಷ್ಟಪಡುವುದಿಲ್ಲ.', hi: 'मैं बात नहीं करना चाहता।' },
  sys_soc_7: { en: 'Can you help me?', ta: 'நீங்கள் எனக்கு உதவ முடியுமா?', te: 'మీరు నాకు సహాయం చేయగలరా?', kn: 'ನೀವು ನನಗೆ ಸಹಾಯ ಮಾಡುವಿರಾ?', hi: 'क्या आप मेरी मदद करेंगे?' },
  sys_soc_8: { en: 'I like this.', ta: 'எனக்கு இது பிடித்திருக்கிறது.', te: 'నాకు ఇది నచ్చింది.', kn: 'ನನಗೆ ಇದು ಇಷ್ಟವಾಯಿತು.', hi: 'मुझे यह पसंद है।' },
  sys_soc_9: { en: "I don't like this.", ta: 'எனக்கு இது பிடிக்கவில்லை.', te: 'నాకు ఇది నచ్చలేదు.', kn: 'ನನಗೆ ಇದು ಇಷ್ಟವಿಲ್ಲ.', hi: 'मुझे यह पसंद नहीं है।' },

  // --- ACTIVITIES ---
  sys_act_1: { en: 'I want to play.', ta: 'நான் விளையாட வேண்டும்.', te: 'నేను ఆడుకోవాలి.', kn: 'ನಾನು ಆಟವಾಡಬೇಕು.', hi: 'मुझे खेलना है।' },
  sys_act_2: { en: 'I want to watch TV.', ta: 'நான் டிவி பார்க்க வேண்டும்.', te: 'నేను టీవీ చూడాలి.', kn: 'ನಾನು ಟಿವಿ ನೋಡಬೇಕು.', hi: 'मुझे टीवी देखना है।' },
  sys_act_3: { en: 'I want to listen to music.', ta: 'நான் பாட்டு கேட்க வேண்டும்.', te: 'నేను పాటలు వినాలి.', kn: 'ನಾನು ಹಾಡುಗಳನ್ನು ಕೇಳಬೇಕು.', hi: 'मुझे संगीत सुनना है।' },
  sys_act_4: { en: 'I want to go outside.', ta: 'நான் வெளியே போக வேண்டும்.', te: 'నేను బయటికి వెళ్ళాలి.', kn: 'ನಾನು ಹೊರಗೆ ಹೋಗಬೇಕು.', hi: 'मुझे बाहर जाना है।' },
  sys_act_5: { en: 'I want to draw.', ta: 'நான் படம் வரைய வேண்டும்.', te: 'నేను బొమ్మలు గీయాలి.', kn: 'ನಾನು ಚಿತ್ರ ಬಿಡಿಸಬೇಕು.', hi: 'मुझे चित्र बनाना है।' },
  sys_act_6: { en: 'I want to rest.', ta: 'நான் ஓய்வெடுக்க வேண்டும்.', te: 'నేను విశ్రాంతి తీసుకోవాలి.', kn: 'ನಾನು ವಿಶ್ರಾಂತಿ ಪಡೆಯಬೇಕು.', hi: 'मुझे आराम करना है।' },
  sys_act_7: { en: 'I want to use the computer.', ta: 'நான் கணினி பயன்படுத்த வேண்டும்.', te: 'నేను కంప్యూటర్ ఉపయోగించాలి.', kn: 'ನಾನು ಕಂಪ್ಯೂಟರ್ ಬಳಸಬೇಕು.', hi: 'मुझे कंप्यूटर इस्तेमाल करना है।' },

  // --- EMERGENCY ---
  sys_emg_1: { en: 'I need help.', ta: 'எனக்கு உதவி வேண்டும்!', te: 'నాకు సహాయం కావాలి!', kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು!', hi: 'मुझे मदद चाहिए!' },
  sys_emg_2: { en: 'I am hurt.', ta: 'எனக்கு காயம் ஏற்பட்டுள்ளது.', te: 'నాకు దెబ్బ తగిలింది.', kn: 'ನನಗೆ ಗಾಯವಾಗಿದೆ.', hi: 'मुझे चोट लगी है।' },
  sys_emg_3: { en: 'I am in pain.', ta: 'எனக்கு கடுமையான வலி உள்ளது.', te: 'నాకు చాలా నొప్పిగా ఉంది.', kn: 'ನನಗೆ ತೀವ್ರ ನೋವಾಗುತ್ತಿದೆ.', hi: 'मुझे बहुत दर्द हो रहा है।' },
  sys_emg_4: { en: 'I feel sick.', ta: 'எனக்கு மிகவும் உடம்பு சரியில்லை.', te: 'నాకు తీవ్ర అనారోగ్యంగా ఉంది.', kn: 'ನನಗೆ ತುಂಬಾ ಹುಷಾರಿಲ್ಲ.', hi: 'मेरी तबीयत बहुत खराब है।' },
  sys_emg_5: { en: 'I cannot breathe properly.', ta: 'என்னால் சரியாக மூச்சு விட முடியவில்லை.', te: 'నాకు సరిగ్గా శ్వాస ఆడటం లేదు.', kn: 'ನನಗೆ ಸರಿಯಾಗಿ ಉಸಿರಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.', hi: 'मुझे ठीक से सांस नहीं आ रही है।' },
  sys_emg_6: { en: 'Call my parent.', ta: 'என் பெற்றோருக்கு அழையுங்கள்.', te: 'మా తల్లిదండ్రులకు ఫోన్ చేయండి.', kn: 'ನನ್ನ ಪೋಷಕರಿಗೆ ಕರೆ ಮಾಡಿ.', hi: 'मेरे माता-पिता को फोन करें।' },
  sys_emg_7: { en: 'Call my caregiver.', ta: 'என் பராமரிப்பாளரை அழையுங்கள்.', te: 'నా సంరక్షకుడికి ఫోన్ చేయండి.', kn: 'ನನ್ನ ಆರೈಕೆದಾರರಿಗೆ ಕರೆ ಮಾಡಿ.', hi: 'मेरे केयरगिवर को फोन करें।' },
  sys_emg_8: { en: 'Call emergency services.', ta: 'அவசர உதவிக்கு அழையுங்கள்.', te: 'ఎమర్జెన్సీ సర్వీసెస్‌కి కాల్ చేయండి.', kn: 'ತುರ್ತು ಸೇವೆಗಳಿಗೆ ಕರೆ ಮಾಡಿ.', hi: 'आपातकालीन सेवा को फोन करें।' },
  sys_emg_9: { en: 'Please stay with me.', ta: 'தயவுசெய்து என்னுடன் இருங்கள்.', te: 'దయచేసి నాతోనే ఉండండి.', kn: 'ದಯವಿಟ್ಟು ನನ್ನೊಂದಿಗೆ ಇರಿ.', hi: 'कृपया मेरे साथ रहिए।' },
  sys_emg_10: { en: 'I am lost.', ta: 'நான் வழி தவறிவிட்டேன்.', te: 'నేను దారి తప్పిపోయాను.', kn: 'ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ.', hi: 'मैं रास्ता भटक गया हूँ।' },

  // --- STARTER CUSTOM PHRASES ---
  cust_1: { en: 'I want my mother.', ta: 'எனக்கு என் அம்மா வேண்டும்.', te: 'నాకు మా అమ్మ కావాలి.', kn: 'ನನಗೆ ನನ್ನ ಅಮ್ಮ ಬೇಕು.', hi: 'मुझे मेरी माँ चाहिए।' },
  cust_2: { en: 'I need my blue bag.', ta: 'எனக்கு என் நீல பை வேண்டும்.', te: 'నాకు నా నీలిరంగు బ్యాగ్ కావాలి.', kn: 'ನನಗೆ ನನ್ನ ನೀಲಿ ಬ್ಯಾಗ್ ಬೇಕು.', hi: 'मुझे मेरा नीला बैग चाहिए।' },
  cust_3: { en: 'I want to go to the park.', ta: 'நான் பூங்காவிற்கு செல்ல வேண்டும்.', te: 'నేను పార్కుకి వెళ్ళాలి.', kn: 'ನಾನು ಪಾರ್ಕ್‌ಗೆ ಹೋಗಬೇಕು.', hi: 'मुझे पार्क जाना है।' }
};

// UI Text Translations
export const UI_TRANSLATIONS = {
  appName: { en: 'Functional AAC', ta: 'செயல்பாட்டு AAC', te: 'ఫంక్షనల్ AAC', kn: 'ಕ್ರಿಯಾತ್ಮಕ AAC', hi: 'कार्यात्मक AAC' },
  appSubtitle: { en: 'Caregiver Communication Suite & Physical Device Manager', ta: 'பராமரிப்பாளர் தொடர்பு மற்றும் சாதன மேலாளர்', te: 'సంరక్షకుల సంభాషణ & పరికర నిర్వాహకుడు', kn: 'ಆರೈಕೆದಾರರ ಸಂವಹನ ಮತ್ತು ಸಾಧನ ವ್ಯವಸ್ಥಾಪಕ', hi: 'केयरगिवर संचार और डिवाइस प्रबंधक' },
  tabHome: { en: 'AAC Communicator (Home)', ta: 'AAC தொடர்பாளர் (முகப்பு)', te: 'AAC కమ్యూనికేటర్ (హోమ్)', kn: 'AAC ಸಂವಹನಕಾರ (ಮುಖಪುಟ)', hi: 'AAC कम्युनिकेटर (होम)' },
  tabLibrary: { en: 'Phrase Library', ta: 'சொற்றொடர் நூலகம்', te: 'వాక్యాల లైబ్రరీ', kn: 'ವಾಕ್ಯಗಳ ಗ್ರಂಥಾಲಯ', hi: 'वाक्यांश लाइब्रेरी' },
  tabCustom: { en: 'My Custom Phrases', ta: 'என் தனிப்பயன் சொற்றொடர்கள்', te: 'నా అనుకూల వాక్యాలు', kn: 'ನನ್ನ ಕಸ್ಟಮ್ ವಾಕ್ಯಗಳು', hi: 'मेरे कस्टम वाक्यांश' },
  tabSettings: { en: 'Settings & Device', ta: 'அமைப்புகள் & சாதனம்', te: 'సెట్టింగ్‌లు & పరికరం', kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು & ಸಾಧನ', hi: 'सेटिंग्स और डिवाइस' },
  a11yTitle: { en: 'Accessibility & Display', ta: 'அணுகல்தன்மை & காட்சி', te: 'యాక్సెసిబిలిటీ & డిస్‌ప్లే', kn: 'ಪ್ರವೇಶಿಸುವಿಕೆ & ಪ್ರದರ್ಶನ', hi: 'अभिगम्यता और प्रदर्शन' },
  fontSizeLabel: { en: 'Text Size Scaling', ta: 'எழுத்து அளவு', te: 'టెక్స్ట్ పరిమాణం', kn: 'ಪಠ್ಯ ಗಾತ್ರ', hi: 'फ़ॉन्ट का आकार' },
  contrastLabel: { en: 'Contrast Mode', ta: 'மாறுபட்ட முறை', te: 'కాంట్రాస్ట్ మోడ్', kn: 'ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್', hi: 'कंट्रास्ट मोड' },
  themeLabel: { en: 'Appearance Theme', ta: 'தோற்ற முறை', te: 'థీమ్ మోడ్', kn: 'ಥೀಮ್ ಮೋಡ್', hi: 'दिखावट थीम' },
  reducedMotion: { en: 'Reduced Motion', ta: 'குறைந்த இயக்கம்', te: 'తగ్గించిన యానిమేషన్లు', kn: 'ಕಡಿಮೆ ಚಲನೆ', hi: 'कम मोशन' },
  soundClicks: { en: 'Tactile Sound Click', ta: 'தொடு ஒலி பின்னூட்டம்', te: 'స్పర్శ క్లిక్ శబ్దం', kn: 'ಸ್ಪರ್ಶ ಧ್ವನಿ ಕ್ಲಿಕ್', hi: 'स्पर्श ध्वनि क्लिक' },
  syncButton: { en: 'Sync to AAC Device', ta: 'AAC சாதனத்துடன் ஒத்திசை', te: 'AAC పరికరానికి సింక్ చేయండి', kn: 'AAC ಸಾಧನಕ್ಕೆ ಸಿಂಕ್ ಮಾಡಿ', hi: 'AAC डिवाइस में सिंक करें' },
  inSync: { en: 'Device in Sync', ta: 'சாதனம் ஒத்திசைக்கப்பட்டது', te: 'పరికరం సింక్‌లో ఉంది', kn: 'ಸಾಧನ ಸಿಂಕ್ ಆಗಿದೆ', hi: 'डिवाइस सिंक है' },
  pendingSync: { en: 'Changes pending sync', ta: 'ஒத்திசைக்க வேண்டிய மாற்றங்கள்', te: 'సింక్ పెండింగ్‌లో ఉన్న మార్పులు', kn: 'ಸಿಂಕ್ ಬಾಕಿ ಇರುವ ಬದಲಾವಣೆಗಳು', hi: 'सिंक लंबित परिवर्तन' },
  searchPlaceholder: { en: 'Search functional phrases...', ta: 'சொற்றொடர்களைத் தேடுங்கள்...', te: 'వాక్యాలను శోధించండి...', kn: 'ವಾಕ್ಯಗಳನ್ನು ಹುಡುಕಿ...', hi: 'वाक्यांश खोजें...' },
  addPhraseBtn: { en: '+ Add New Phrase', ta: '+ புதிய சொற்றொடர்', te: '+ కొత్త వాక్యం జోడించు', kn: '+ ಹೊಸ ವಾಕ್ಯ ಸೇರಿಸಿ', hi: '+ नया वाक्यांश जोड़ें' }
};

class I18nService {
  constructor() {
    this.currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('aac_language_v1')) || 'en';
    this.listeners = [];
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === langCode)) return;
    this.currentLang = langCode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('aac_language_v1', langCode);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', langCode);
    }
    this.notify();
  }

  getCurrentLanguageInfo() {
    return SUPPORTED_LANGUAGES.find(l => l.code === this.currentLang) || SUPPORTED_LANGUAGES[0];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.currentLang); } catch (e) { console.error('i18n notify error:', e); }
    });
  }

  // Get phrase text in the active language (falls back to English, then phrase.text)
  getPhraseText(phrase, lang = this.currentLang) {
    if (!phrase) return '';
    if (PHRASE_TRANSLATIONS[phrase.id] && PHRASE_TRANSLATIONS[phrase.id][lang]) {
      return PHRASE_TRANSLATIONS[phrase.id][lang];
    }
    // Check if custom phrase has embedded translations or fallback to its text
    if (phrase.translations && phrase.translations[lang]) {
      return phrase.translations[lang];
    }
    return phrase.text || '';
  }

  // Get category localized name
  getCategoryName(catId, lang = this.currentLang) {
    if (CATEGORY_TRANSLATIONS[catId] && CATEGORY_TRANSLATIONS[catId][lang]) {
      return CATEGORY_TRANSLATIONS[catId][lang];
    }
    return catId;
  }

  // Get core word in active language
  getCoreWord(key, lang = this.currentLang) {
    if (CORE_WORDS[key] && CORE_WORDS[key][lang]) {
      return CORE_WORDS[key][lang];
    }
    return key;
  }

  // Get UI String
  t(key, lang = this.currentLang) {
    if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][lang]) {
      return UI_TRANSLATIONS[key][lang];
    }
    return key;
  }

  // Get BCP 47 voice code for speech synthesis (en-US, ta-IN, te-IN, kn-IN, hi-IN)
  getVoiceLang(lang = this.currentLang) {
    const info = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    return info ? info.voiceLang : 'en-US';
  }

  // Filter categories allowed for a specific age group
  getCategoriesForAge(ageGroup = 'Children', allCategories = []) {
    const ageKey = ageGroup || 'Children';
    if (ageKey === 'All Ages') return allCategories;
    return allCategories.filter(cat => {
      const allowed = CATEGORY_AGE_RULES[cat.id] || ['Children', 'Teenagers', 'Adults'];
      return allowed.includes(ageKey);
    });
  }
}

export const i18n = new I18nService();
