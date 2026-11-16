export type Language = 'EN' | 'SW' | 'ZU' | 'AF' | 'ST';

export interface DemoChapter {
  id: number;
  timeRange: string;
  title: string;
  visualCue: string;
  script: string;
  accentGuidance: string;
}

export interface Translations {
  headerBadge: string;
  headerTitle: string;
  usbStatus: string;
  esdStatus: string;
  aiPromptBtn: string;
  sansCompliance: string;
  hitlSignoffBtn: string;
  
  // Navigation Tabs
  tabEvacuation: string;
  tabSpill: string;
  tabCustomer: string;
  tabFire: string;
  tabQuiz: string;
  tabCurriculum: string;
  tabDemoVideo: string;
  tabFirstResponder: string;

  // Module Titles
  evacuationTitle: string;
  evacuationSubtitle: string;
  spillTitle: string;
  spillSubtitle: string;
  customerTitle: string;
  customerSubtitle: string;
  fireTitle: string;
  fireSubtitle: string;
  quizTitle: string;
  quizSubtitle: string;
  curriculumTitle: string;
  curriculumSubtitle: string;
  demoVideoTitle: string;
  demoVideoSubtitle: string;
  firstResponderTitle: string;
  firstResponderSubtitle: string;

  // Demo Video Hub
  playDemoBtn: string;
  pauseDemoBtn: string;
  nextChapterBtn: string;
  prevChapterBtn: string;
  recordGuideBtn: string;
  voiceLanguageLabel: string;
  accentNoteLabel: string;
  whatToClickLabel: string;
  scriptToReadLabel: string;
  screenRecordingShortcut: string;
  chaptersList: DemoChapter[];

  // Certificate Modal
  certModalTitle: string;
  certModalSubtitle: string;
  candidateName: string;
  employeeId: string;
  stationLocation: string;
  roleTitle: string;
  managerName: string;
  managerRegNo: string;
  issueDate: string;
  auditHash: string;
  sansSeal: string;
  printCertBtn: string;
  closeBtn: string;
  signoffApproved: string;

  // Touch POS Controls
  nextQuestion: string;
  prevQuestion: string;
  resetQuiz: string;
  launchVideo: string;
  remediationAvailable: string;
  correctAnswer: string;
  incorrectAnswer: string;
}

export const translations: Record<Language, Translations> = {
  EN: {
    headerBadge: 'Forecourt POS OHS • SANS 10089',
    headerTitle: 'Service Station Compliance Tablet',
    usbStatus: 'USB Drive: D:\\ Active',
    esdStatus: 'ESD System: READY',
    aiPromptBtn: 'Google AI Studio',
    sansCompliance: 'SANS 10089 / OHSA 85-1993',
    hitlSignoffBtn: 'HITL OHS Sign-off Certificate',

    tabEvacuation: '1. ESD & Evacuation',
    tabSpill: '2. Fuel Spill Containment',
    tabCustomer: '3. Customer Hazmat',
    tabFire: '4. PASS Firefighting',
    tabQuiz: '5. 60s Assessment',
    tabCurriculum: '6. SANS Manifest',
    tabDemoVideo: '7. 🎥 Live Demo Video',
    tabFirstResponder: '8. 🚑 Nightshift First Responder',

    evacuationTitle: 'ESD Emergency Evacuation & Marshal Protocols',
    evacuationSubtitle: 'SANS 10089-3 & OHSA Directives for Forecourt Supervisors & Attendants',
    spillTitle: 'Forecourt Fuel Spill Response & 4-Role Teamwork',
    spillSubtitle: 'SANS 10263 Dangerous Goods Spill Containment & Drain Protection Matrix',
    customerTitle: 'Customer Service & Hazmat Safety Compliance',
    customerSubtitle: 'Ignition hazard prevention, cell phone ban, static & nozzle safety standards',
    fireTitle: 'PASS Firefighting Technique & First Aid',
    fireSubtitle: 'SABS SANS 1910 Standard Operating Procedure for 9kg DCP extinguishers',
    quizTitle: 'Forecourt OHS Competency Test',
    quizSubtitle: '60-Second Micro-Assessment with automated video remediation triggers',
    curriculumTitle: 'Curriculum & SANS Regulatory Document Manifest',
    curriculumSubtitle: 'Audited SABS / SANS standards and video remediation library',
    demoVideoTitle: 'Executive Demo Video Portal & Voiceover Studio',
    demoVideoSubtitle: 'Interactive 2-minute operational walkthrough updated with First Responder & Continuous Refresher Lifecycle.',
    firstResponderTitle: 'Forecourt First Responder & Nightshift Medical Protocol',
    firstResponderSubtitle: 'OHS Haven 4-Step emergency triage & cashier intercom bridge protocol.',

    playDemoBtn: '▶ Play Presentation Chapter',
    pauseDemoBtn: '⏸ Pause Audio & Teleprompter',
    nextChapterBtn: 'Next Chapter →',
    prevChapterBtn: '← Previous Chapter',
    recordGuideBtn: '🎬 Screen Recording Shortcut: Win + Shift + R',
    voiceLanguageLabel: 'Demo Voice Language:',
    accentNoteLabel: 'South African English Accent (Operational, Direct, High-Trust)',
    whatToClickLabel: '🖥️ What to Click / Show on Screen:',
    scriptToReadLabel: '🗣️ Voiceover Script to Read Out:',
    screenRecordingShortcut: 'Full Screen setup: F11 | Mic: ON | Target: http://localhost:3000',

    chaptersList: [
      {
        id: 1,
        timeRange: '0:00 - 0:20',
        title: '1. Forecourt Risk & Regulatory Threat',
        visualCue: 'Display the main Forecourt POS Landing Page showing high-hazard modules and ESD readiness status.',
        script: '"Service station forecourts are fast-paced, high-hazard environments. With labor inspectors cracking down on retail fuel safety, a single fuel spill, fire mishandling, or untrained staff member can lead to immediate prohibition notices, crippling operational downtime, and massive liabilities. Paper-based training manuals simply don\'t work for busy forecourt staff."',
        accentGuidance: 'South African English: Professional, clear, authoritative operational tone.'
      },
      {
        id: 2,
        timeRange: '0:20 - 0:40',
        title: '2. Multilingual Touch POS & Staff Empowerment',
        visualCue: 'Click the Language Switcher on the top bar (toggle between English, isiZulu, Afrikaans, Sesotho).',
        script: '"The Service Station OHS Compliance App turns any POS terminal or tablet into an instant micro-training portal. Built with multilingual support, it empowers cashiers, attendants, and supervisors in their preferred language. Staff love it because it’s fast, clear, and interactive—building real operational confidence without corporate jargon."',
        accentGuidance: 'Warm, empowering, highlighting local language accessibility.'
      },
      {
        id: 3,
        timeRange: '0:40 - 1:00',
        title: '3. Interactive Spill & PASS Firefighting',
        visualCue: 'Click into the PASS Firefighting Module, select a 60s scenario question, and trigger a Video Remediation Modal.',
        script: '"From mastering the PASS firefighting sequence to deploying the 4-role fuel spill containment response, staff engage in rapid 60-second scenario assessments. If a worker misses a question, our instant Video Remediation Loop automatically plays the exact timestamped safety clip, turning micro-failures into immediate learning moments."',
        accentGuidance: 'Energetic, safety-focused, dynamic pacing.'
      },
      {
        id: 4,
        timeRange: '1:00 - 1:20',
        title: '4. Nightshift First Responder & Medical Protocol',
        visualCue: 'Click on the "8. 🚑 Nightshift First Responder" tab, showcasing the 4-step emergency triage & cashier intercom bridge.',
        script: '"When accidents happen during critical nightshifts, our Nightshift First Responder Protocol guides attendants through mandatory PPE glove compliance, spinal cautions, conscious patient diagnostic questioning, and direct cashier intercom EMS dispatch. Immediate medical response when every second counts."',
        accentGuidance: 'Calm, urgent, clinical first responder authority.'
      },
      {
        id: 5,
        timeRange: '1:20 - 1:40',
        title: '5. Monthly Refresher Engine & Retailer Alerts',
        visualCue: 'Click on Stage 2: Refresher & open the Retailer Notification Center (Alerts button).',
        script: '"Compliance is a continuous lifecycle. Our Monthly Refresher Hub engages staff with 3-minute high-risk case studies and 5 micro-MCQs. Station managers monitor live readiness meters—Compliant, Pending, or Overdue—with automated SMS and email escalation triggers."',
        accentGuidance: 'Analytical, management-focused, high ROI.'
      },
      {
        id: 6,
        timeRange: '1:40 - 2:00',
        title: '6. HITL Certificates & Corporate Stewardship',
        visualCue: 'Open the Audit Certificate Generator showing SHA-256 Hash and the Oil Brand Monthly Compliance Dossier exporter.',
        script: '"Legal compliance certificates with certified Human-in-the-Loop manager sign-offs are auto-generated and indexed. For corporate oil brands, our 3-Tier Escalation Dossier exports full site compliance analytics directly for SANS 10089 audits. Zero admin burden, zero compliance headaches, and maximum forecourt safety!"',
        accentGuidance: 'High ROI, executive summary pitch, strong call to action.'
      }
    ],

    certModalTitle: 'HITL Certified OHS Compliance Certificate',
    certModalSubtitle: 'OHS assessment record with supervisor sign-off',
    candidateName: 'Attendant / Staff Name',
    employeeId: 'Employee / South African ID',
    stationLocation: 'Service Station / Site Location',
    roleTitle: 'Operational Role',
    managerName: 'Certifying OHS Manager',
    managerRegNo: 'OHS Registration / SACPCMP No.',
    issueDate: 'Certificate Issue Date',
    auditHash: 'SANS Audit Verification Hash',
    sansSeal: 'SANS 10089 / OHSA 85 OF 1993 CERTIFIED',
    printCertBtn: 'Print / Save Audit Certificate',
    closeBtn: 'Close Window',
    signoffApproved: 'MANAGER HITL APPROVED',

    nextQuestion: 'Next Question →',
    prevQuestion: '← Previous Question',
    resetQuiz: 'Reset Assessment',
    launchVideo: 'Launch Video Remediation',
    remediationAvailable: 'Video Remediation Clip Available',
    correctAnswer: '✓ Correct Answer',
    incorrectAnswer: '❌ Incorrect Answer'
  },
  SW: {
    headerBadge: 'Usalama wa Forecourt POS • SANS/OSHA',
    headerTitle: 'Kompyuta Mpakato ya Uzingatiaji wa Kituo cha Mafuta',
    usbStatus: 'Hifadhi ya USB: D:\\ Inafanya Kazi',
    esdStatus: 'Mfumo wa ESD: TAYARI',
    aiPromptBtn: 'Google AI Studio',
    sansCompliance: 'SANS 10089 / OSHA 2007',
    hitlSignoffBtn: 'Cheti cha Uidhinishaji cha OHS (HITL)',

    tabEvacuation: '1. ESD na Uokoaji wa Dharura',
    tabSpill: '2. Udhibiti wa Uvujaji wa Mafuta',
    tabCustomer: '3. Huduma ya Wateja na Hazmat',
    tabFire: '4. Kuzima Moto kwa PASS',
    tabQuiz: '5. Tathmini ya Sekunde 60',
    tabCurriculum: '6. Orodha ya Kanuni za Usalama',
    tabDemoVideo: '7. 🎥 Video ya Maonyesho',
    tabFirstResponder: '8. 🚑 Msaada wa Kwanza Usiku',

    evacuationTitle: 'Itifaki ya Kuzima ya Dharura (ESD) na Uokoaji wa Forecourt',
    evacuationSubtitle: 'Miongozo ya SANS 10089-3 na OSHA kwa Wasimamizi na Wahudumu wa Mafuta',
    spillTitle: 'Udhibiti wa Uvujaji wa Mafuta na Kazi ya Pamoja ya Majukumu 4',
    spillSubtitle: 'Mbinu za Kuzuia Mafuta Kuingia Mitaroni na Kusafisha kwa Vifaa visivyotoa Cheche',
    customerTitle: 'Huduma kwa Wateja na Uzingatiaji wa Usalama wa Mafuta',
    customerSubtitle: 'Kuzuia vyanzo vya moto, marufuku ya simu za mkononi, na usalama wa nozeli',
    fireTitle: 'Mbinu ya Kuzima Moto ya PASS na Msaada wa Kwanza',
    fireSubtitle: 'Taratibu Sanifu za Uendeshaji za Vizima Moto vya 9kg DCP',
    quizTitle: 'Mtihani wa Umahiri wa OHS wa Forecourt',
    quizSubtitle: 'Tathmini ya haraka ya sekunde 60 yenye marekebisho ya kiotomatiki ya video',
    curriculumTitle: 'Mtaala na Nyaraka za Kisheria za Usalama',
    curriculumSubtitle: 'Viwango vilivyokaguliwa na maktaba ya video za marekebisho ya mafunzo',
    demoVideoTitle: 'Video ya Maonyesho ya Uendeshaji na Studio ya Sauti',
    demoVideoSubtitle: 'Mwongozo wa mwingiliano wa dakika 2 wa usalama wa kituo cha mafuta.',
    firstResponderTitle: 'Mtoa Huduma wa Kwanza wa Forecourt na Itifaki ya Matibabu ya Usiku',
    firstResponderSubtitle: 'Itifaki ya hatua 4 ya dharura na mawasiliano ya intercom ya kaunta.',

    playDemoBtn: '▶ Cheza Sura ya Uwasilishaji',
    pauseDemoBtn: '⏸ Sitisha Sauti na Maandishi',
    nextChapterBtn: 'Sura Inayofuata →',
    prevChapterBtn: '← Sura Iliyotangulia',
    recordGuideBtn: '🎬 Njia ya Mkato ya Kurekodi Skrini: Win + Shift + R',
    voiceLanguageLabel: 'Lugha ya Sauti ya Maonyesho:',
    accentNoteLabel: 'Lafudhi ya Kiswahili Sanifu (Wazi, Thabiti, Ya Kuaminika)',
    whatToClickLabel: 'Kile cha Kubonyeza kwenye Skrini:',
    scriptToReadLabel: 'Maandishi ya Kusoma kwa Sauti:',
    screenRecordingShortcut: 'Kurekodi Skrini: Bonyeza Win + Shift + R kuanza.',
    chaptersList: [
      {
        id: 1,
        timeRange: '0:00 - 0:20',
        title: '1. Hatari za Kituo cha Mafuta na Ukaguzi wa Sheria',
        visualCue: 'Onyesha dashibodi kuu ya Forecourt POS inayoonyesha viashiria vya hatari.',
        script: '"Vituo vya mafuta ni mazingira yenye hatari kubwa ya moto na milipuko. Wakaguzi wa serikali wanapofanya ukaguzi, uvujaji mmoja wa mafuta au mfanyakazi asiye na mafunzo anaweza kusababisha kituo kufungwa mara moja. Mifumo ya karatasi haifanyi kazi kwa wafanyakazi wa vituo."',
        accentGuidance: 'Kiswahili cha Afrika Mashariki: Kwa sauti thabiti ya kiusalama.'
      },
      {
        id: 2,
        timeRange: '0:20 - 0:40',
        title: '2. POS ya Lugha Nyingi kwa Wafanyakazi',
        visualCue: 'Bonyeza kibadilisha lugha hapo juu (badilisha kati ya Kiingereza, Kiswahili, isiZulu, Afrikaans, Sesotho).',
        script: '"Programu ya Uzingatiaji wa OHS inageuza skrini yoyote ya POS au kompyuta mpakato kuwa kituo cha mafunzo ya haraka. Imejengwa kwa lugha nyingi ili kuwawezesha wahudumu, watoza fedha na wasimamizi kujifunza kwa lugha wanayoielewa vyema."',
        accentGuidance: 'Kwa sauti ya kutia moyo na kuhamasisha.'
      },
      {
        id: 3,
        timeRange: '0:40 - 1:00',
        title: '3. Mbinu ya PASS na Udhibiti wa Uvujaji wa Mafuta',
        visualCue: 'Bonyeza moduli ya PASS Firefighting, sikiliza swali, na ufungue Video ya Marekebisho.',
        script: '"Kutoka kwa mafunzo ya mbinu ya PASS ya kuzima moto hadi udhibiti wa uvujaji wa mafuta kwa majukumu 4 ya wafanyakazi, wahudumu hushiriki katika tathmini ya sekunde 60 yenye maswali 40."',
        accentGuidance: 'Kwa msisitizo wa usalama na kasi ya kuchukua hatua.'
      },
      {
        id: 4,
        timeRange: '1:00 - 1:20',
        title: '4. Msaada wa Kwanza Wakati wa Usiku (First Responder)',
        visualCue: 'Bonyeza "8. 🚑 Msaada wa Kwanza", onyesha hatua 4 za kusaidia majeruhi na kuita gari la wagonjwa.',
        script: '"Dharura inapotokea wakati wa usiku, itifaki yetu ya Msaada wa Kwanza inawaongoza wafanyakazi kutoa msaada wa haraka na kuratibu na mhudumu wa kaunta kuita gari la wagonjwa."',
        accentGuidance: 'Sauti tulivu lakini ya tahadhari kubwa.'
      },
      {
        id: 5,
        timeRange: '1:20 - 1:40',
        title: '5. Mafunzo ya Kila Mwezi na Usimamizi wa Kituo',
        visualCue: 'Bonyeza "Refresher Hub" na ufungue Kituo cha Taarifa cha Mmiliki wa Kituo.',
        script: '"Usalama ni mchakato endelevu wa kila siku. Kituo chetu cha kurudia mafunzo kinatoa mazoezi ya kila mwezi na kuwawezesha wasimamizi kuona maendeleo ya kila mfanyakazi."',
        accentGuidance: 'Sauti ya kiuongozi na usimamizi bora.'
      },
      {
        id: 6,
        timeRange: '1:40 - 2:00',
        title: '6. Vyeti vya Uidhinishaji wa Msimamizi (HITL) na Ripoti za Ukaguzi',
        visualCue: 'Fungua Audit Certificate Generator inayoonyesha saini ya msimamizi na faili ya ukaguzi wa chapa ya mafuta.',
        script: '"Mara tu mafunzo yanapokamilika, vyeti rasmi vya usalama vinavyoidhinishwa na binadamu (HITL) vinatolewa kwa ajili ya wakaguzi wa serikali. Hakuna fomu za karatasi, ni usalama kamili."',
        accentGuidance: 'Sauti ya kumalizia yenye ujasiri na uhakika.'
      }
    ],

    certModalTitle: 'Cheti Kilichoidhinishwa cha Msimamizi wa OHS',
    certModalSubtitle: 'Cheti cha usalama kinachotambuliwa kisheria chini ya OSHA na SANS 10089',
    candidateName: 'Jina la Mfanyakazi',
    employeeId: 'Nambari ya Kitambulisho / Mfanyakazi',
    stationLocation: 'Eneo la Kituo cha Mafuta',
    roleTitle: 'Wadhifa / Jukumu',
    managerName: 'Jina la Msimamizi wa OHS',
    managerRegNo: 'Nambari ya Usajili ya OHS',
    issueDate: 'Tarehe ya Kutolewa',
    auditHash: 'Msimbo wa Ukaguzi wa Kielektroniki',
    sansSeal: 'IMETHIBITISHWA CHINI YA KANUNI ZA SANS 10089 / OSHA',
    printCertBtn: 'Chapisha / Hifadhi Cheti',
    closeBtn: 'Funga',
    signoffApproved: 'IMEIDHINISHWA NA MSIMAMIZI (HITL APPROVED)',

    nextQuestion: 'Swali Linalofuata →',
    prevQuestion: '← Swali Lililopita',
    resetQuiz: 'Anzisha Upya Tathmini',
    launchVideo: 'Fungua Video ya Mafunzo',
    remediationAvailable: 'Video ya Marekebisho Ipo Tayari',
    correctAnswer: '✓ Jibu Sahihi',
    incorrectAnswer: '❌ Jibu Lisilo Sahihi'
  },
  ZU: {
    headerBadge: 'I-Forecourt POS OHS • SANS 10089',
    headerTitle: 'Ithebulethi Yezokuphepha Egaraji',
    usbStatus: 'I-USB: D:\\ Iyafundwa',
    esdStatus: 'I-ESD Inkinobho: ILUNGILE',
    aiPromptBtn: 'Google AI Studio',
    sansCompliance: 'SANS 10089 / OHSA 85-1993',
    hitlSignoffBtn: 'Isitifiketi Somphathi OHS',

    tabEvacuation: '1. Inkinobho ESD & Ukuphuma',
    tabSpill: '2. Ukuchitheka Kwalethe',
    tabCustomer: '3. Amakhasimende Nokuphepha',
    tabFire: '4. Slwisa Umlilo (PASS)',
    tabQuiz: '5. Ukuhlola Imibuzo',
    tabCurriculum: '6. Izincwadi Zezokuphepha',
    tabDemoVideo: '7. 🎥 Ividiyo Yedemo',
    tabFirstResponder: '8. 🚑 Ukulimala Nokwelapha Egaraji',

    evacuationTitle: 'Izinqubo Zokuphuma Uma Kunesimo Esiphuthumayo',
    evacuationSubtitle: 'Imithetho ye-SANS 10089-3 nabasebenzi basegaraji',
    spillTitle: 'Ukubamba Nokuhlanza Amafutha Amachithekile',
    spillSubtitle: 'Imithetho ye-SANS 10263 yokuvikela amadrayini',
    customerTitle: 'Ukusebenza Namakhasimende Nokuphepha',
    customerSubtitle: 'Ukwenqabela ugwayi, amaselula, nengozi yemililo ngenkathi kufakwa uphethiloli',
    fireTitle: 'Indlela Yokusetshenziswa Kwesicisha-Mlilo (PASS)',
    fireSubtitle: 'Indlela efanele yokusebenzisa i-DCP 9kg extinguisher ngokwe-SABS SANS 1910',
    quizTitle: 'Ukuhlola Ulwazi Lwezokuphepha Egaraji',
    quizSubtitle: 'Ukuhlola ngemizuzwana eyi-60 namavidiyo ekufundisa',
    curriculumTitle: 'Uhlu Lwemicingo Nezithelo Ze-OHS',
    curriculumSubtitle: 'Amadokhumenti nabasebenzi basegaraji',
    demoVideoTitle: 'Isizinda Sembukiso Wevidiyo (isiZulu)',
    demoVideoSubtitle: 'Umbukiso wesibonelo osondeziwe nezinhlelo ezintsha zokwelashwa kwabalimele nabasebenzi ebusuku.',
    firstResponderTitle: 'Ezokwelashwa Ngokushesha Egaraji Ebusuku',
    firstResponderSubtitle: 'Izinyathelo ezine zokwelapha abalimele nentsha nabasebenzi egaraji.',

    playDemoBtn: '▶ Dlala Ividiyo Yedemo',
    pauseDemoBtn: '⏸ Misa Ividiyo',
    nextChapterBtn: 'Isahluko Esilandelayo →',
    prevChapterBtn: '← Isahluko Esidlule',
    recordGuideBtn: '🎬 Inqamulelo: Win + Shift + R',
    voiceLanguageLabel: 'Ulimi Lwedemo:',
    accentNoteLabel: 'South African isiZulu Operational Accent (IsiZulu saseGoli/saKwaZulu esingcono)',
    whatToClickLabel: '🖥️ Lokho Okufanele Ukuchofoze Kuskrini:',
    scriptToReadLabel: '🗣️ Umculo Nomhlahlandlela Ogcwele (isiZulu Script):',
    screenRecordingShortcut: 'Skrini Esigcwele: F11 | I-Mic: ON | Iwebhusayithi: http://localhost:3000',

    chaptersList: [
      {
        id: 1,
        timeRange: '0:00 - 0:20',
        title: '1. Ingozi Egaraji Nokuhlolwa Ngumthetho',
        visualCue: 'Veza ikhasi elikhulu le-Forecourt POS elibonisa imojula yezokuphepha nezimo ezinobungozi.',
        script: '"Izingaraji zephethiloli zinezimo ezinobungozi obukhulu kakhulu. Njengoba abahloli bezabasebenzi baqinisa imithetho yezokuphepha egaraji, ukuchitheka kwamafutha okukodwa, noma isisebenzi esingafundisiwe singadala ukuthi igaraji livalwe ngokushesha, kuholele ekulahlekelweni yizimali ezinkulu. Amabhuku aphepheni awasebenzi kubasebenzi bangaphandle egaraji."',
        accentGuidance: 'Shono ngezwi elinamandla, elinesizotha solimi lwesiZulu sase-South Africa.'
      },
      {
        id: 2,
        timeRange: '0:20 - 0:40',
        title: '2. I-POS Ngezilimi Eziningi Nokunika Abasebenzi Amandla',
        visualCue: 'Chofoza i-Language Switcher phezulu (shintsha phakathi kwesiNgisi, isiZulu, Afrikaans, Sesotho).',
        script: '"I-Service Station OHS Compliance App iguqula yonke i-POS terminal noma ithebulethi ibe isizinda semfundo esheshayo. Yakhiwe ngosizo lwezilimi eziningi ukusiza abasebenzi basegaraji, amakhashiya, nabaphathi ngolimi abaluthandayo. Abasebenzi bayayithanda ngoba ishesha kakhulu, icacile, futhi iyakha ukuzithemba ngaphandle kwemagama anzima."',
        accentGuidance: 'Zwi elicacile, elikhuthazayo ngenkuthalo emsebenzini.'
      },
      {
        id: 3,
        timeRange: '0:40 - 1:00',
        title: '3. Imojula Yokusula Umlilo Ukuchitheka Kwamafutha',
        visualCue: 'Vula imojula ye-PASS Firefighting, khetha umbuzo, bese uvula i-Video Remediation Modal.',
        script: '"Kusukela ekufundeni indlela ye-PASS yokususa umlilo kuya ekubambeni ukuchitheka kwamafutha ngezindima ezine, abasebenzi benza ukuhlola kwamasekhondi angama-60. Uma isisebenzi siphaza umbuzo, i-Video Remediation Loop yethu idlala ividiyo ngokushesha ukulungisa leyo phutha ngaleso sikhathi."',
        accentGuidance: 'Ngesivinini nomdlandla wezokuphepha emsebenzini.'
      },
      {
        id: 4,
        timeRange: '1:00 - 1:20',
        title: '4. Ukwelapha Abalimele Ebusuku (First Responder)',
        visualCue: 'Chofoza ithabhu ye-"8. 🚑 Ukulimala Nokwelapha Egaraji", ubonise izinyathelo ezine ezibonisa ukufaka amagilavu ne-intercom.',
        script: '"Uma kuvela ingozi ebusuku, imojula yethu yezokwelapha inika abasebenzi indlela efanele yokufaka amagilavu emithi, ukubheka ukulimala komgogodla, ukubuza imibuzo yabaphilayo, nokubiza amambulansi ngokushesha emashinini ekhashiya."',
        accentGuidance: 'Izwi elizolile, elisheshayo, elinesizotha sokwelashwa.'
      },
      {
        id: 5,
        timeRange: '1:20 - 1:40',
        title: '5. Ukubukeza Ngemva Kwenyanga Nesaziso Somphathi',
        visualCue: 'Chofoza "Stage 2: Refresher" bese uvula i-Retailer Notification Center (Alerts button).',
        script: '"Ukuphepha kuyinqubo eqhubekayo. Uhlelo lwethu lwenyanga ne-Refresher Hub lunika abasebenzi imibuzo emifushane nemibhalo yesimo. Abaphathi babona ukulunga kwabasebenzi bukhoma ngezaziso ezihamba kumakhalekhukhwini nezifoni."',
        accentGuidance: 'Izwi elihlaziya ukusebenza nokuphatha.'
      },
      {
        id: 6,
        timeRange: '1:40 - 2:00',
        title: '6. Izitifiketi (HITL) Nombiko Wamampani Amafutha',
        visualCue: 'Vula i-Audit Certificate Generator ne-Oil Brand Monthly Compliance Dossier exporter.',
        script: '"Izitifiketi zomthetho ezinesiginesha yomphathi zidalwa ngokuzenzakalelayo. Ezinkampanini ezinkulu zephethiloli, uhlelo lwethu lwe-3-Tier Dossier lukhipha imibiko ephelele yezokuphepha ngokwe-SANS 10089. Ayikho imithwalo, kuphela ukuphepha egaraji!"',
        accentGuidance: 'Izwi lokuphothula ngamandla amakhulu ezokuphepha.'
      }
    ],

    certModalTitle: 'Isitifiketi Esivunyiwe Ngumphathi OHS',
    certModalSubtitle: 'Isitifiketi esisemthethweni sohlelo lwe-OHSA ne-SANS 10089',
    candidateName: 'Igama Labasebenzi',
    employeeId: 'Inombolo Yomsebenzi / ID',
    stationLocation: 'Indawo Yegaraji (Station Name)',
    roleTitle: 'Umsebenzi (Role)',
    managerName: 'Igama Lempathi OHS Certified',
    managerRegNo: 'Inombolo ye-SACPCMP / OHS Reg',
    issueDate: 'Usuku Lwesitifiketi',
    auditHash: 'Ikhodi Yokuhlola Ye-SANS Audit',
    sansSeal: 'KUFUNYWE IMITETHO YE-SANS 10089 / OHSA 85 OF 1993',
    printCertBtn: 'Phrinta / Gcina Isitifiketi',
    closeBtn: 'Vala',
    signoffApproved: 'ISAYINWE NGUMPHATHI (HITL APPROVED)',

    nextQuestion: 'Umbuzo Olandelayo →',
    prevQuestion: '← Umbuzo Odlule',
    resetQuiz: 'Phinda Qala Ukuhlola',
    launchVideo: 'Vula Ividiyo Yokufunda',
    remediationAvailable: 'Ividiyo Yencazelo Iyatholakala',
    correctAnswer: '✓ Impendulo Eyiyeyo',
    incorrectAnswer: '❌ Impendulo Engayiyo'
  },
  AF: {
    headerBadge: 'Voorhof POS OHS • SANS 10089',
    headerTitle: 'Diensstasie OHS Voldoenings-Tablet',
    usbStatus: 'USB Skyf: D:\\ Aktief',
    esdStatus: 'ESD Stelsel: GEREED',
    aiPromptBtn: 'Google AI Studio',
    sansCompliance: 'SANS 10089 / OHSA 85-1993',
    hitlSignoffBtn: 'OHS Bestuurder Sertifikaat',

    tabEvacuation: '1. ESD Evakuering',
    tabSpill: '2. Brandstof Storting',
    tabCustomer: '3. Kliënt Gevaarvryheid',
    tabFire: '4. PASS Brandbestryding',
    tabQuiz: '5. 60s Toets',
    tabCurriculum: '6. SANS Manifes',
    tabDemoVideo: '7. 🎥 Live Demo Video',
    tabFirstResponder: '8. 🚑 Nood Noodhulp & Nagskof Protocol',

    evacuationTitle: 'Nood-ESD Evakuering & Marskalk Protokolle',
    evacuationSubtitle: 'SANS 10089-3 & OHSA Direktiewe vir Voorhof Toesighouers',
    spillTitle: 'Voorhof Brandstofstorting Reaksie & Spankrag',
    spillSubtitle: 'SANS 10263 Gevaarlike Goedere Storting & Rioolbeskerming',
    customerTitle: 'Kliëntediens & Gevaarlike Stowwe Veiligheid',
    customerSubtitle: 'Voorkoming van ontstekingsgevare, selfoonverbod & statiese veiligheid',
    fireTitle: 'PASS Brandbestrydingstegniek & Noodhulp',
    fireSubtitle: 'SABS SANS 1910 Standaard vir 9kg DCP Droë Poeier Blussers',
    quizTitle: 'Voorhof OHS Bevoegdheidstoets',
    quizSubtitle: '60-Sekonde mikro-assessering met outomatiese video-remediëring',
    curriculumTitle: 'Kurrikulum & SANS Regulasie Manifes',
    curriculumSubtitle: 'Geouditeerde SABS / SANS standaarde en video biblioteek',
    demoVideoTitle: 'Demonstrasie Video Portaal (Afrikaans)',
    demoVideoSubtitle: 'Opgedateerde video-demonstrasie met Eerste Reageerder nagskof noodhulp en maandelikse opknappingsiklus.',
    firstResponderTitle: 'Voorhof Eerste Reageerder & Nagskof Noodhulp',
    firstResponderSubtitle: 'OHS Haven 4-stap nood triage en kassier kommunikasie protokol.',

    playDemoBtn: '▶ Speel Demonstrasie Hoofstuk',
    pauseDemoBtn: '⏸ Skakel Oudio Af',
    nextChapterBtn: 'Volgende Hoofstuk →',
    prevChapterBtn: '← Vorige Hoofstuk',
    recordGuideBtn: '🎬 Opname Kortpad: Win + Shift + R',
    voiceLanguageLabel: 'Demo Stem Taal:',
    accentNoteLabel: 'Suid-Afrikaanse Afrikaanse Aksent (Duidelik, Operasioneel, Professioneel)',
    whatToClickLabel: '🖥️ Waarop om te klik op die skerm:',
    scriptToReadLabel: '🗣️ Teks om hardop te lees (Afrikaans Script):',
    screenRecordingShortcut: 'Volskerm: F11 | Mikrofoon: AAN | Adres: http://localhost:3000',

    chaptersList: [
      {
        id: 1,
        timeRange: '0:00 - 0:20',
        title: '1. Voorhof Risiko & Regulasie Bedreiging',
        visualCue: 'Wys die hoof Voorhof POS Bladsy met hoë-risiko modules en ESD gereedheid.',
        script: '"Diensstasie-voorhowe is vinnige, hoë-risiko omgewings. Met arbeidsinspekteurs wat toeslaan op kleinhandel-brandstofveiligheid, kan \'n enkele brandstofstorting, brandhanteringfout of onopgeleide personeellid lei tot onmiddellike verbodskennisgewings, verlammende operasionele stilstand en massiewe aanspreeklikhede. Papiergebaseerde opleidingshandleidings werk eenvoudig nie vir besige voorhofpersoneel nie."',
        accentGuidance: 'Suid-Afrikaanse Afrikaanse aksent: Kragtig, saaklik en gesaghebbend.'
      },
      {
        id: 2,
        timeRange: '0:20 - 0:40',
        title: '2. Meertalige POS & Personeel Bemagtiging',
        visualCue: 'Klik die Taalwisselaar bo-aan (skakel tussen Engels, isiZulu, Afrikaans, Sesotho).',
        script: '"Die Service Station OHS Compliance App verander enige POS-terminaal of tablet in \'n onmiddellike mikro-opleidingsportaal. Gebou met meertalige ondersteuning, bemagtig dit kassiere, joggies en toesighouers in hul taal van keuse. Personeel hou daarvan omdat dit vinnig, duidelik en interaktief is—dit bou werklike operasionele selfvertroue sonder om hulle te oorweldig met korporatiewe jargon."',
        accentGuidance: 'Warm, duidelik en ondersteunend vir plaaslike personeel.'
      },
      {
        id: 3,
        timeRange: '0:40 - 1:00',
        title: '3. Interaktiewe Storting & PASS Brandbestryding',
        visualCue: 'Klik in die PASS Brandbestryding Module, kies \'n vraag, en aktiveer die Video Remediation Modal.',
        script: '"Van die bemeestering van die PASS-brandbestrydingvolgorde tot die ontplooiing van die 4-rol brandstofstortingsreaksie, neem personeel deel aan vinnige 60-sekonde scenario-assesserings. As \'n werker \'n vraag mis, speel ons onmiddellike Video Remediation Loop outomaties die presiese tydstempel-veiligheidssnit, wat mikro-foute verander in onmiddellike leer-omblikke."',
        accentGuidance: 'Vinnig, dinamies en veiligheidsgefokus.'
      },
      {
        id: 4,
        timeRange: '1:00 - 1:20',
        title: '4. Nagskof Eerste Reageerder & Mediese Protokol',
        visualCue: 'Klik op die "8. 🚑 Nood Noodhulp" skakelaar en wys die 4-stap nood triage met handskoen verpligting.',
        script: '"Wanneer ongelukke tydens kritieke nagskofte plaasvind, lei ons Noodhulp Protokol personeel deur verpligte handskoenveiligheid, ruggraat waarskuwings, diagnostiese vrae en direkte kassier interkom noodoproepe vir blitsvinnige mediese hulp."',
        accentGuidance: 'Kalm, dringend, medies gesaghebbend.'
      },
      {
        id: 5,
        timeRange: '1:20 - 1:40',
        title: '5. Maandelikse Opknapping & Bestuurder Kennisgewings',
        visualCue: 'Klik op "Stage 2: Refresher" en maak die Retailer Notification Center oop.',
        script: '"Veiligheid is \'n deurlopende siklus. Ons Maandelikse Opknappings spilpunt betrek personeel met 3-minute gevallestudies en 5 vrae. Bestuurders monitor intydse gereedheidsmeters met outomatiese selfoon en e-pos waarskuwings."',
        accentGuidance: 'Analities, bestuurgefokus en hoë ROI.'
      },
      {
        id: 6,
        timeRange: '1:40 - 2:00',
        title: '6. HITL Sertifikate & Korporatiewe Maatskappy Dossier',
        visualCue: 'Maak die Audit Certificate Generator oop met SHA-256 Hash en die Oil Brand Monthly Compliance Dossier exporter.',
        script: '"Die oomblik as opleiding voltooi is, word wetlike voldoeningsertifikate met gesertifiseerde Mens-in-die-Lus (HITL) bestuurder-ondertekenings outomaties gegenereer en geïndexeer vir inspekteur-oudits. Nul administrasielas, nul voldoeningskommernisse, en maksimum voorhofveiligheid. Reël vandag nog \'n regstreekse demonstrasie vir jou diensstasie!"',
        accentGuidance: 'Sterk finale oproep tot aksie vir besigheidseienaars.'
      }
    ],

    certModalTitle: 'HITL Gesertifiseerde OHS Voldoeningsertifikaat',
    certModalSubtitle: 'Geouditeerde OHS voldoeningsertifikaat met Bestuurder Ondertekening',
    candidateName: 'Werknemer Naam',
    employeeId: 'Werknemer / ID Nommer',
    stationLocation: 'Diensstasie Ligging',
    roleTitle: 'Operasionele Rol',
    managerName: 'Sertifiserende OHS Bestuurder',
    managerRegNo: 'OHS Registrasie / SACPCMP Nr.',
    issueDate: 'Sertifikaat Datum',
    auditHash: 'SANS Oudit Verifikasie Kode',
    sansSeal: 'SANS 10089 / OHSA 85 VAN 1993 GESIERTIFISEER',
    printCertBtn: 'Druk / Stoor Sertifikaat',
    closeBtn: 'Sluit',
    signoffApproved: 'BESTUURDER GOEDGEKEUR (HITL APPROVED)',

    nextQuestion: 'Volgende Vraag →',
    prevQuestion: '← Vorige Vraag',
    resetQuiz: 'Hertoets Assessering',
    launchVideo: 'Begin Video Remedie',
    remediationAvailable: 'Video Remedie Beskikbaar',
    correctAnswer: '✓ Korrekte Antwoord',
    incorrectAnswer: '❌ Inkorrekte Antwoord'
  },
  ST: {
    headerBadge: 'Forecourt POS OHS • SANS 10089',
    headerTitle: 'Letlapa la Tšhireletso la Seteishene',
    usbStatus: 'USB Drive: D:\\ E Etsa Hantle',
    esdStatus: 'ESD System: E LOKILE',
    aiPromptBtn: 'Google AI Studio',
    sansCompliance: 'SANS 10089 / OHSA 85-1993',
    hitlSignoffBtn: 'Setefeketi sa Molaoli wa OHS',

    tabEvacuation: '1. Likonopo tsa ESD',
    tabSpill: '2. Ho Tšholla ha Mafura',
    tabCustomer: '3. Tšhireletso ea Bareki',
    tabFire: '4. Ho Tima Mollo (PASS)',
    tabQuiz: '5. Tekolo ea Lipotso',
    tabCurriculum: '6. SANS Manifest',
    tabDemoVideo: '7. 🎥 Live Demo Video',
    tabFirstResponder: '8. 🚑 Tšhireletso ea Liphatlalatso le Seteishene',

    evacuationTitle: 'Tsamaiso ea Tšhotso ea Tšhotso ka Nako ea Tshenyo',
    evacuationSubtitle: 'Melao ea SANS 10089-3 bakeng sa basebetsi ba seteishene',
    spillTitle: 'Khato ea Ho Tšoara Mafura a Tšholletsefileng',
    spillSubtitle: 'SANS 10263 ea ts\'ireletso ea litšila le likhoerekhoere',
    customerTitle: 'Litšebeletso tsa Bareki le Tšhireletso',
    customerSubtitle: 'Thibelo ea kotsi ea mollo le lilefouno ha ho tšollesoa mafura',
    fireTitle: 'Mokhoa oa Ho Tima Mollo ka Setima-Mollo (PASS)',
    fireSubtitle: 'Melao ea SABS SANS 1910 bakeng sa lifofane tsa 9kg DCP',
    quizTitle: 'Tlhahlobo ea Tsebo ea Tšhireletso Seteisheneng',
    quizSubtitle: 'Tekolo ea metsotsoana e 60 ka livideo tsa thuto',
    curriculumTitle: 'Lihlooho tsa Melao ea SANS le OHS',
    curriculumSubtitle: 'Litokomane tse hlahlobiloeng tsa SABS / SANS',
    demoVideoTitle: 'Mofuta oa Demo ea Video (Sesotho)',
    demoVideoSubtitle: 'Video e ntjhafalitsoeng e bontsang mehato ea tšhireletso bosiu le lithuto tsa khoeli le khoeli.',
    firstResponderTitle: 'Mokhoa oa Kapele wa Ho Tšoara Likotsi Bosiu',
    firstResponderSubtitle: 'Litsela tse 4 tsa ho tlamisa likotsi le ho letsetsa ambulanse.',

    playDemoBtn: '▶ Bapala Video ea Demo',
    pauseDemoBtn: '⏸ Misa Video',
    nextChapterBtn: 'Khaolo e Latelang →',
    prevChapterBtn: '← Khaolo e Fetileng',
    recordGuideBtn: '🎬 Tsela ea Ho Rekota: Win + Shift + R',
    voiceLanguageLabel: 'Puo ea Demo:',
    accentNoteLabel: 'South African Sesotho Operational Accent (Sesotho sa Free State / Gauteng)',
    whatToClickLabel: '🖥️ Eng seo u lokelang ho se tobetsa:',
    scriptToReadLabel: '🗣️ Mengolo eo u lokelang ho e bala (Sesotho Script):',
    screenRecordingShortcut: 'Sekrin se tletseng: F11 | Maekerofounu: ON | Aterese: http://localhost:3000',

    chaptersList: [
      {
        id: 1,
        timeRange: '0:00 - 0:20',
        title: '1. Kotsi ea Seteishene le Hlahlobo ea Molao',
        visualCue: 'Bontša leqephe la mantlha la Forecourt POS le bontšang likotsi.',
        script: '"Liseteishene tsa mafura ke dibaka tsa kotsi e kholo haholo. Ha bahlahlobi ba tsa mosebetsi ba tiisa melao ea tšhireletso, ho tšholla ha mafura ho le mong kapa mosebetsi ea sa koetlisoang ho ka tsosa hore seteishene se koaloe hang-hang, se bake tahlehelo e kholo ea chelete. Libuka tsa pampiri ha li sebetse ho basebetsi ba seteishene."',
        accentGuidance: 'Sesotho sa South Africa: Ka lentswe le tiileng la tsireletso.'
      },
      {
        id: 2,
        timeRange: '0:20 - 0:40',
        title: '2. POS ea Lipuo tse Fapaneng le Basebetsi',
        visualCue: 'Tobetsa sefetoli sa puo kaholimo (fetola pakeng tsa English, isiZulu, Afrikaans, Sesotho).',
        script: '"App ea Service Station OHS Compliance e fetola POS terminal kapa tablet e nngwe le e nngwe ho ba sebaka sa kapele sa thuto. E hahiloe ka lipuo tse fapaneng ho matlafatsa basebetsi ba seteishene, li-cashier le babusisi ka puo ea bona. Basebetsi ba e rata hobane e potlaka, e hlakile, ebile e fana ka ts\'epo e kholo."',
        accentGuidance: 'Ka lentswe le mofuthu la ho matlafatsa mosebetsi.'
      },
      {
        id: 3,
        timeRange: '0:40 - 1:00',
        title: '3. Mokhoa oa PASS le Ho Tšoara Mafura',
        visualCue: 'Tobetsa ho PASS Firefighting Module, utloela potso, mme u bule Video Remediation Modal.',
        script: '"Ho tloha ho ithuteng mokhoa wa PASS wa ho tima mollo ho fihlela ho tšoara ho tšholla ha mafura ka likarolo tse 4, basebetsi ba nka karolo ho tlhahlobo ea metsotsoana e 60. Ha mosebetsi a fosa potso, Video Remediation Loop ea rona e bapala video hang-hang ho lokisa phoso eo."',
        accentGuidance: 'Ka lebelo le matla la tsireletso mosebetsing.'
      },
      {
        id: 4,
        timeRange: '1:00 - 1:20',
        title: '4. Tšhireletso ea Liphatlalatso Bosiu (First Responder)',
        visualCue: 'Tobetsa ho "8. 🚑 Tšhireletso ea Liphatlalatso", u bontše mehato e 4 ea ho tlamisa likotsi le ho letsetsa ambulanse.',
        script: '"Ha likotsi li etsahala bosiu, mokhoa wa rona wa pele wa tšhireletso o tsamaisa basebetsi ho fana ka mehato ea kapele ea thuto le ho fana ka tlhahisoleseling ho cashier bakeng sa ambulanse."',
        accentGuidance: 'Lentswe le iketlileng, le potlakileng la tšhireletso.'
      },
      {
        id: 5,
        timeRange: '1:20 - 1:40',
        title: '5. Thuto ea Khoeli le Khoeli le Melao ea Molaoli',
        visualCue: 'Tobetsa ho "Stage 2: Refresher" ' + 'mme u bule Retailer Notification Center.',
        script: '"Tšhireletso ke tsamaiso ea kamehla. Refresher Hub ea rona e fana ka lipotso le mehlala ea kapele. Molaoli u bona boemo ba mosebetsi e mong le e mong ka molaetsa oa founo."',
        accentGuidance: 'Lentswe la molaoli le tlhahlobo.'
      },
      {
        id: 6,
        timeRange: '1:40 - 2:00',
        title: '6. Li-setefeketi tsa Molaoli (HITL) le Tlhahlobo ea Khampani',
        visualCue: 'Bula Audit Certificate Generator e bontšang ho saena hoa molaoli le Oil Brand Compliance Dossier exporter.',
        script: '"Hang ha thuto e phethiloe, li-setefeketi tsa tšhireletso tse saeniloeng ke molaoli (HITL) li etsoa ka boeona bakeng sa bahlahlobi ba melao. Ha ho boima ba tsamaiso, ha ho mathata a melao, ke tšhireletso e felletseng ea seteishene. Rera demo bakeng sa seteishene sa hao kajeno!"',
        accentGuidance: 'Lentswe la ho koala ka thabo le tsireletso.'
      }
    ],

    certModalTitle: 'Setefeketi se Netefalitsoeng sa Molaoli wa OHS',
    certModalSubtitle: 'Setefeketi sa tšhireletso se amohelehileng ka tlas\'a OHSA le SANS 10089',
    candidateName: 'Lebitso la Msebetsi',
    employeeId: 'Nomoro ea ID / Msebetsi',
    stationLocation: 'Sebaka sa Seteishene',
    roleTitle: 'Mosebetsi (Role)',
    managerName: 'Lebitso la Molaoli oa OHS',
    managerRegNo: 'Nomoro ea OHS / SACPCMP',
    issueDate: 'Letsatsi la Setefeketi',
    auditHash: 'Khoutu ea Hlahlobo ea SANS',
    sansSeal: 'E NETEFALITSOE KA TLAS\'A SANS 10089 / OHSA 85 OF 1993',
    printCertBtn: 'Hatisa / Boloka Setefeketi',
    closeBtn: 'Koala',
    signoffApproved: 'E AMOHELEHILE KA MOLAOLI (HITL APPROVED)',

    nextQuestion: 'Potso e Latelang →',
    prevQuestion: '← Potso e Fetileng',
    resetQuiz: 'Nchafatsa Tlhahlobo',
    launchVideo: 'Bula Video ea Thuto',
    remediationAvailable: 'Video ea Thuto e Teng',
    correctAnswer: '✓ Karabo e Nepahetseng',
    incorrectAnswer: '❌ Karabo e Fosahetseng'
  }
};
