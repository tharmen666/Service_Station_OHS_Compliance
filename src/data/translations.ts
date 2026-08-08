export type Language = 'EN' | 'ZU' | 'AF' | 'ST';

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
    tabQuiz: '5. 60s Assessment (40 Qs)',
    tabCurriculum: '6. SANS Manifest',

    evacuationTitle: 'ESD Emergency Evacuation & Marshal Protocols',
    evacuationSubtitle: 'SANS 10089-3 & OHSA Directives for Forecourt Supervisors & Attendants',
    spillTitle: 'Forecourt Fuel Spill Response & 4-Role Teamwork',
    spillSubtitle: 'SANS 10263 Dangerous Goods Spill Containment & Drain Protection Matrix',
    customerTitle: 'Customer Service & Hazmat Safety Compliance',
    customerSubtitle: 'Ignition hazard prevention, cell phone ban, static & nozzle safety standards',
    fireTitle: 'PASS Firefighting Technique & First Aid',
    fireSubtitle: 'SABS SANS 1910 Standard Operating Procedure for 9kg DCP extinguishers',
    quizTitle: 'Forecourt OHS Competency Test (40 Questions)',
    quizSubtitle: '60-Second Micro-Assessment with automated video remediation triggers',
    curriculumTitle: 'Curriculum & SANS Regulatory Document Manifest',
    curriculumSubtitle: 'Audited SABS / SANS standards and video remediation library',

    certModalTitle: 'HITL Certified OHS Compliance Certificate',
    certModalSubtitle: 'Audit-proof OHS compliance certificate with certified Manager Sign-off',
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
    tabQuiz: '5. Ukuhlola Imibuzo (40)',
    tabCurriculum: '6. Izincwadi Zezokuphepha',

    evacuationTitle: 'Izinqubo Zokuphuma Uma Kunesimo Esiphuthumayo',
    evacuationSubtitle: 'Imithetho ye-SANS 10089-3 nabasebenzi basegaraji',
    spillTitle: 'Ukubamba Nokuhlanza Amafutha Amachithekile',
    spillSubtitle: 'Imithetho ye-SANS 10263 yokuvikela amadrayini',
    customerTitle: 'Ukusebenza Namakhasimende Nokuphepha',
    customerSubtitle: 'Ukwenqabela ugwayi, amaselula, nengozi yemililo ngenkathi kufakwa uphethiloli',
    fireTitle: 'Indlela Yokusetshenziswa Kwesicisha-Mlilo (PASS)',
    fireSubtitle: 'Indlela efanele yokusebenzisa i-DCP 9kg extinguisher ngokwe-SABS SANS 1910',
    quizTitle: 'Ukuhlola Ulwazi Lwezokuphepha Egaraji (Imibuzo 40)',
    quizSubtitle: 'Ukuhlola ngemizuzwana eyi-60 namavidiyo ekufundisa',
    curriculumTitle: 'Uhlu Lwemicingo Nezithelo Ze-OHS',
    curriculumSubtitle: 'Amadokhumenti nabasebenzi basegaraji',

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
    tabQuiz: '5. 60s Toets (40 Vrae)',
    tabCurriculum: '6. SANS Manifes',

    evacuationTitle: 'Nood-ESD Evakuering & Marskalk Protokolle',
    evacuationSubtitle: 'SANS 10089-3 & OHSA Direktiewe vir Voorhof Toesighouers',
    spillTitle: 'Voorhof Brandstofstorting Reaksie & Spankrag',
    spillSubtitle: 'SANS 10263 Gevaarlike Goedere Storting & Rioolbeskerming',
    customerTitle: 'Kliëntediens & Gevaarlike Stowwe Veiligheid',
    customerSubtitle: 'Voorkoming van ontstekingsgevare, selfoonverbod & statiese veiligheid',
    fireTitle: 'PASS Brandbestrydingstegniek & Noodhulp',
    fireSubtitle: 'SABS SANS 1910 Standaard vir 9kg DCP Droë Poeier Blussers',
    quizTitle: 'Voorhof OHS Bevoegdheidstoets (40 Vrae)',
    quizSubtitle: '60-Sekonde mikro-assessering met outomatiese video-remediëring',
    curriculumTitle: 'Kurrikulum & SANS Regulasie Manifes',
    curriculumSubtitle: 'Geouditeerde SABS / SANS standaarde en video biblioteek',

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
    tabQuiz: '5. Tekolo ea Lipotso (40)',
    tabCurriculum: '6. SANS Manifest',

    evacuationTitle: 'Tsamaiso ea Tšhotso ea Tšhotso ka Nako ea Tshenyo',
    evacuationSubtitle: 'Melao ea SANS 10089-3 bakeng sa basebetsi ba seteishene',
    spillTitle: 'Khato ea Ho Tšoara Mafura a Tšholletsefileng',
    spillSubtitle: 'SANS 10263 ea ts\'ireletso ea litšila le likhoerekhoere',
    customerTitle: 'Litšebeletso tsa Bareki le Tšhireletso',
    customerSubtitle: 'Thibelo ea kotsi ea mollo le lilefouno ha ho tšollesoa mafura',
    fireTitle: 'Mokhoa oa Ho Tima Mollo ka Setima-Mollo (PASS)',
    fireSubtitle: 'Melao ea SABS SANS 1910 bakeng sa lifofane tsa 9kg DCP',
    quizTitle: 'Tlhahlobo ea Tsebo ea Tšhireletso Seteisheneng (Lipotso 40)',
    quizSubtitle: 'Tekolo ea metsotsoana e 60 ka livideo tsa thuto',
    curriculumTitle: 'Lihlooho tsa Melao ea SANS le OHS',
    curriculumSubtitle: 'Litokomane tse hlahlobiloeng tsa SABS / SANS',

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
