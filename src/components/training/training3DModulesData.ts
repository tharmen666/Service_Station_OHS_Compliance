import { SupportedLanguageCode } from '../../nelly-localization-engine';

export type Training3DModuleId =
  | 'spill-response'
  | 'evacuation-muster'
  | 'tanker-offloading'
  | 'fire-marshal-pass'
  | 'customer-service-7step'
  | 'r638-food-hygiene';

export interface Training3DHotspot {
  id: string;
  label: string;
  detail: string;
  position3D: [number, number, number];
  severity?: 'info' | 'warning' | 'critical';
}

export interface Training3DStep {
  stepNumber: number;
  title: string;
  durationSeconds: number;
  cameraPos: [number, number, number];
  cameraLookAt: [number, number, number];
  telemetryTag: string;
  captions: Record<SupportedLanguageCode, string>;
  hotspots: Training3DHotspot[];
}

export interface Training3DModuleConfig {
  id: Training3DModuleId;
  code: string;
  title: string;
  category: string;
  statutoryRef: string;
  posterSrc: string;
  steps: Training3DStep[];
}

export interface ExecutiveTourStop {
  moduleId: Training3DModuleId;
  stepIndex: number;
  durationSeconds: number;
  telemetryHighlight: string;
}

export const TRAINING_3D_MODULES: Training3DModuleConfig[] = [
  {
    id: 'spill-response',
    code: 'MOD-01',
    title: '1. 8-Step Emergency Hydrocarbon Spill Response & Non-Sparking Spill Kit',
    category: 'Spill Response',
    statutoryRef: 'NEMA 107 of 1998 • SANS 10263 • OHS Act 85 of 1993 Sec 8(2)(e)',
    posterSrc: '/assets/posters/spill_response_poster.png',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Dynamic Risk Assessment & Ignition Source Isolation',
        durationSeconds: 4,
        cameraPos: [6.5, 4.8, 7.2],
        cameraLookAt: [0, 0.5, 0],
        telemetryTag: 'OHSA SEC 8 • VAPOR ZONE ISOLATED',
        captions: {
          en: 'Assess fuel sheen windward from the dispenser sump. Prohibit phones, smoking, and running vehicle engines immediately.',
          sw: 'Tathmini uvujaji wa mafuta kutoka upande wa upepo. Zuia simu, sigara na injini za magari mara moja.',
          zu: 'Hlola ukuchitheka kukaphethiloli umile lapho kuvela khona umoya. Vimbela amaselula, ugwayi, nezinjini eziduma.',
          af: 'Assesseer die brandstofglans windop vanaf die pomp-opvangbak. Verbied fone, rook en lopende enjins onmiddellik.',
          st: 'Hlahloba ho tšholla ha mafura u eme ka lehlakoreng la moea. Thibela lifono, ho tsuba le lienjene tse sebetsang.',
          xh: 'Vavanya ukuchitheka kwamafutha umile ngasemoyeni. Valela iifowuni, ukutshaya neenjini ezihambayo ngoko nangoko.',
        },
        hotspots: [
          {
            id: 'fuel-sheen-sump',
            label: 'Hydrocarbon Fuel Sheen',
            detail: 'Volatile petrol vapours travel low across concrete paving toward ignition sources.',
            position3D: [0.4, 0.2, 0.8],
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Step 2: Chemical-Resistant PPE Donning',
        durationSeconds: 4,
        cameraPos: [4.2, 3.2, 5.2],
        cameraLookAt: [-2.4, 0.8, 1.2],
        telemetryTag: 'GSR REG 2 • NITRILE PPE VERIFIED',
        captions: {
          en: 'Don nitrile chemical-resistant gloves, splash goggles, high-visibility vest, and antistatic safety boots before approaching.',
          sw: 'Vaa glavu za nitrile zinazozuia kemikali, miwani ya usalama, fulana ya kuonekana na viatu vya usalama.',
          zu: 'Gqoka amagilavu e-nitrile avikela amakhemikhali, izibuko zokuphepha, nebhutsu zokungadali izinhlansi.',
          af: 'Trek nitril-chemiese handskoene, spatbrille, hoësigbaarheidsvest en antistatiese veiligheidsstewels aan.',
          st: 'Apara liatlana tsa nitrile, likhalase tsa tšireletso le lieta tse sa bakeng tlhase pele u atamela.',
          xh: 'Nxiba iiglavu ze-nitrile, iiglasi zokhuselo, ivesti ebonakalayo nezihlangu zokhuseleko ezingenazintlantsi.',
        },
        hotspots: [
          {
            id: 'spill-kit-trolley',
            label: 'Mobile Forecourt Spill Kit Trolley',
            detail: 'Contains PPE gloves, goggles, booms, absorbent granules, hard-bristle broom & plastic spade.',
            position3D: [-2.4, 0.9, 1.2],
            severity: 'info',
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Step 3: Stop Flow / Emergency Shut-Off Valve (ESD)',
        durationSeconds: 4,
        cameraPos: [-3.8, 3.4, 5.6],
        cameraLookAt: [-1.8, 1.1, -0.5],
        telemetryTag: 'ESD SLAM • SUBMERSIBLE PUMPS ISOLATED',
        captions: {
          en: 'Slam the red Emergency Stop (ESD) button to isolate all submersible pumps and place warning cones around the island.',
          sw: 'Bonyeza kitufe chekundu cha dharura cha ESD kuzima pampu zote na weka koni za tahadhari.',
          zu: 'Cindezela inkinobho ebomvu ye-ESD ukuze uvale wonke amaphampu bese ubeka amakhoni okuxwayisa.',
          af: 'Druk die rooi Noodstop (ESD) knoppie om alle pompe te isoleer en plaas waarskuwingskeëls rondom die eiland.',
          st: 'Tobetsa konopo e khubelu ea ESD ho tima lipompo tsohle ’me u behe likhoune tsa temoso.',
          xh: 'Cinezela iqhosha elibomvu le-ESD ukumisa zonke iimpompo kwaye ubeke iikhowuni zokulumkisa.',
        },
        hotspots: [
          {
            id: 'esd-valve',
            label: 'Red ESD Isolation Button',
            detail: 'Cuts electrical power to all forecourt dispensers and underground STP pumps within 2 seconds.',
            position3D: [-1.8, 1.2, -0.5],
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Step 4: Storm-Drain Protection & Boom Containment',
        durationSeconds: 4,
        cameraPos: [4.8, 3.0, 4.6],
        cameraLookAt: [2.2, 0.2, 1.8],
        telemetryTag: 'NEMA SEC 30 • ZERO RUNOFF TO DRAIN',
        captions: {
          en: 'Close the stormwater interceptor valve and encircle the fuel spill with hydrophobic absorbent socks/booms to protect drains.',
          sw: 'Funga valvu ya mifereji ya mvua na zungushia mafuta kwa mipira ya kufyonza kulinda mitaro.',
          zu: 'Vala i-valve yemigudu yamanzi bese uzungeza amafutha ngamabhomu okufunca ukuvikela imigudu.',
          af: 'Sluit die stormwater-afskeierklep en omsingel die storting met hidrofobiese absorbeer-slange om dreine te beskerm.',
          st: 'Koala belofo ea khoerekhoere ’me u potapotile mafura ka li-boom tse monyang.',
          xh: 'Vala ivalve yomjelo wamanzi kwaye ujikeleze ukuchitheka ngezixhobo zokufunxa ukukhusela imijelo.',
        },
        hotspots: [
          {
            id: 'storm-drain-boom',
            label: 'Storm Drain Grate & Containment Boom',
            detail: 'Never flush fuel into storm drains with water; petrol floats and expands the explosive vapor zone.',
            position3D: [2.2, 0.2, 1.8],
            severity: 'warning',
          },
        ],
      },
      {
        stepNumber: 5,
        title: 'Step 5: Absorbent Application & Hard-Bristle Broom Sweeping',
        durationSeconds: 5,
        cameraPos: [3.6, 2.8, 4.4],
        cameraLookAt: [0.3, 0.3, 0.7],
        telemetryTag: 'SANS 10263 • NON-SPARKING BROOM',
        captions: {
          en: 'Broadcast absorbent granules over the boomed spill and work them in thoroughly with a NON-SPARKING hard-bristle broom.',
          sw: 'Nyunyizia chenga za kufyonza juu ya mafuta na usugue kwa ufagio mgumu USIOTOA CHECHE.',
          zu: 'Thela izinhlayiya ezifuncayo phezu kwamafutha bese ushanela ngomshanelo oqinile ONGADALI IZINHLANSI.',
          af: 'Strooi absorbeerkorrels oor die storting en werk dit in met ’n NIE-VONKENDE hardeborsel-besem.',
          st: 'Fafatsa litholloana tse monyang ’me u fiele ka lefielo le thata le SA BAKENG TLHASE.',
          xh: 'Fafaza iinkozo ezifunxayo phezu kwamafutha kwaye utshayele ngomtshayelo oqinileyo ONGENAZINTLANTSI.',
        },
        hotspots: [
          {
            id: 'hard-broom',
            label: 'Hard-Bristle Non-Sparking Broom',
            detail: 'Polymer bristles agitate absorbent granules without generating electrostatic or friction sparks.',
            position3D: [-0.4, 0.6, 0.9],
            severity: 'warning',
          },
        ],
      },
      {
        stepNumber: 6,
        title: 'Step 6: Non-Sparking Plastic Spade Scooping (NO STEEL SHOVELS)',
        durationSeconds: 6,
        cameraPos: [3.1, 2.4, 3.8],
        cameraLookAt: [0.2, 0.4, 0.8],
        telemetryTag: 'CRITICAL RULE • PLASTIC SPADE ONLY (ZERO STEEL)',
        captions: {
          en: 'CRITICAL SAFETY RULE: Scoop saturated granules into the hazardous waste drum using ONLY the NON-SPARKING PLASTIC SPADE & hard broom. Steel spades/shovels scraping on concrete paving create friction sparks that can ignite petrol vapors!',
          sw: 'KANUNI MUHIMU: Tumia SEPETO YA PLASTIKI ISIYOTOA CHECHE na ufagio mgumu pekee! Koleo la chuma linapokwangua zege husababisha cheche zinazoweza kulipua mvuke wa petroli.',
          zu: 'UMTHETHO OBALULEKILE: Sebenzisa IFOSHOLI LEPLASTIKI ELINGADALI IZINHLANSI nomshanelo oqinile kuphela! Ifosholi lensimbi elikhuhla kukhonkolo lidala izinhlansi ezingashisa umhwamuko kaphethiloli.',
          af: 'KRITIESE REËL: Skep slegs met die NIE-VONKENDE PLASTIEKGRAAF en hardeborsel-besem in die gevaarlike-afval drom! Staalgrawe wat op beton skraap skep wrywingvonke wat petrolgampe kan aansteek.',
          st: 'MOLAO OA BOHLOKOA: Sebelisa KHARAFU EA POLASETEKE E SA BAKENG TLHASE le lefielo le thata feela! Kharafu ea tšepe e hohlalang konkereiting e baka tlhase e ka chesang mouoane oa peterole.',
          xh: 'UMTHETHO OBALULEKILEYO: Sebenzisa UMHLAKULO WEPLASTIKI ONGENAZINTLANTSI nomtshayelo oqinileyo kuphela! Umhlakulo wentsimbi okhuhlana nekonkrithi wenza iintlantsi ezinokubasa umphunga wepetroli.',
        },
        hotspots: [
          {
            id: 'plastic-spade-broom',
            label: 'Non-Sparking Plastic Spade & Hard Broom (NO STEEL)',
            detail:
              'Steel shovels/spades are STRICTLY PROHIBITED: metal scraping on concrete forecourt paving creates friction sparks that can ignite volatile petrol/hydrocarbon vapors.',
            position3D: [0.2, 0.5, 0.9],
            severity: 'critical',
          },
          {
            id: 'hazmat-drum',
            label: 'Yellow Hazardous Waste Drum',
            detail: 'All fuel-saturated absorbents, sponges, and cloths go directly into sealed labelled hazardous waste drums.',
            position3D: [1.6, 0.7, -0.4],
            severity: 'warning',
          },
        ],
      },
      {
        stepNumber: 7,
        title: 'Step 7: Authority & Management Incident Escalation',
        durationSeconds: 4,
        cameraPos: [6.0, 4.5, 6.2],
        cameraLookAt: [0, 1.0, 0],
        telemetryTag: 'OHSA SEC 24 / NEMA • INCIDENT LOGGED',
        captions: {
          en: 'Log spilled litres in the Wetstock & NCR ledger. Report spills exceeding statutory thresholds (>50L or soil/water entry) to management and authorities.',
          sw: 'Rekodi lita zilizovuja kwenye daftari la Wetstock na NCR. Ripoti uvujaji mkubwa (>50L) kwa usimamizi na mamlaka.',
          zu: 'Bhala amalitha achithekile kwi-Wetstock ne-NCR. Bika ukuchitheka okukhulu (>50L) kubaphathi nasemagunyeni.',
          af: 'Teken gestorte liter aan in die Wetstock- en NCR-register. Rapporteer stortings bo statutêre drempels (>50L) aan bestuur.',
          st: 'Ngola lilithara tse tšhollehileng bukeng ea Wetstock le NCR. Tlalehela botsamaisi haeba ho feta 50L.',
          xh: 'Bhala iilitha ezichithekileyo kwirejista ye-Wetstock ne-NCR. Xela kwabaphathi xa kuchitheke ngaphezu kwe-50L.',
        },
        hotspots: [
          {
            id: 'ncr-escalation',
            label: 'Section 24 / Wetstock NCR Link',
            detail: 'Spill volume is deducted from tank book stock and recorded under SHA-256 audit logging.',
            position3D: [0, 1.8, -1.2],
            severity: 'info',
          },
        ],
      },
      {
        stepNumber: 8,
        title: 'Step 8: Decontamination, Safe Disposal & Spill Kit Restock',
        durationSeconds: 4,
        cameraPos: [4.5, 3.2, 5.4],
        cameraLookAt: [-1.5, 0.7, 0.6],
        telemetryTag: 'SINGLE-USE KIT • 100% RESTOCK REQUIRED',
        captions: {
          en: 'Seal the hazmat drum for licensed waste removal, decontaminate PPE, and immediately restock the single-use spill kit before reopening the lane.',
          sw: 'Funga pipa la taka hatari, safisha PPE, na jaza upya vifaa vya dharura mara moja kabla ya kufungua njia.',
          zu: 'Vala idramu likadoti oyingozi, uhlanze i-PPE, bese ugcwalisa kabusha ibhokisi le-spill kit ngaphambi kokuvula umzila.',
          af: 'Verseël die gevaarlike-afval drom, ontsmet PPE, en vul die enkelgebruik-stortingstel dadelik aan voor baanheropening.',
          st: 'Koala barele ea litšila, hloekisa PPE, ’me u tlatse spill kit hape hang-hang.',
          xh: 'Vala umgqomo wenkunkuma eyingozi, ucoce i-PPE, uze ugcwalise kwakhona i-spill kit ngoko nangoko.',
        },
        hotspots: [
          {
            id: 'restock-seal',
            label: 'Single-Use Kit Tamper Seal',
            detail: 'Spill kit consumables are strictly single-use; tamper seal is applied only after full replenishment.',
            position3D: [-2.4, 1.1, 1.2],
            severity: 'info',
          },
        ],
      },
    ],
  },
  {
    id: 'evacuation-muster',
    code: 'MOD-02',
    title: '2. 9-Step Forecourt Emergency Evacuation & Live Muster Roll-Call',
    category: 'Evacuation',
    statutoryRef: 'OHS Act 85 of 1993 • MHI Regs • SANS 10089-1',
    posterSrc: '/assets/posters/evacuation_poster.png',
    steps: [
      {
        stepNumber: 1,
        title: 'Steps 1–2: Emergency Stop (E-Stop) & Driveway Blockade',
        durationSeconds: 4,
        cameraPos: [7.5, 5.5, 7.5],
        cameraLookAt: [0, 0.8, 0],
        telemetryTag: 'ESD ACTIVE • TRAFFIC BLOCKED',
        captions: {
          en: 'Hit the E-Stop to cut forecourt power immediately while 2 attendants cone off entrance and exit driveways.',
          sw: 'Bonyeza E-Stop kukata umeme mara moja huku wahudumu 2 wakifunga njia za kuingia na kutoka.',
          zu: 'Cindezela i-E-Stop ukunqamula ugesi ngokushesha ngenkathi abasebenzi aba-2 bevala izindlela zokungena.',
          af: 'Druk die Noodstop om voorhofkrag te sny terwyl 2 joggies ingange en uitgange met keëls blokkeer.',
          st: 'Tobetsa E-Stop ho khaola motlakase ha basebetsi ba 2 ba koala menyako ea seteishene.',
          xh: 'Cinezela i-E-Stop ukunqumla umbane ngelixa abasebenzi aba-2 bevala iindlela zokungena nokuphuma.',
        },
        hotspots: [
          {
            id: 'estop-kiosk',
            label: 'Forecourt E-Stop & Cashier POS Lock',
            detail: 'Cashier locks POS drawer, sounds alarm, and dials 10177 / 112 emergency services.',
            position3D: [-2.5, 1.3, -1.8],
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Steps 3–6: Fire Readiness, Kiosk/Restroom Sweep & Upwind Exit',
        durationSeconds: 4,
        cameraPos: [5.5, 4.2, 6.0],
        cameraLookAt: [1.5, 0.8, 1.0],
        telemetryTag: 'KIOSK & RESTROOM SWEEP • UPWIND EGRESS',
        captions: {
          en: 'Alert store staff, sweep restrooms and convenience aisles, instruct motorists to switch off engines, and escort everyone upwind.',
          sw: 'Tahadharisha wafanyakazi wa duka, kagua vyoo, na waongoze wateja kuelekea eneo salama juu ya upepo.',
          zu: 'Xwayisa abasebenzi basesitolo, hlola izindlu zangasese, bese uholela amakhasimende endaweni ephephile.',
          af: 'Waarsku winkelpersoneel, deursoek toilette en gange, laat enjins afskakel en begelei almal windop.',
          st: 'Lemosa basebetsi ba lebenkele, hlahloba matloana ’me u ise batho bohle sebakeng se sireletsehileng.',
          xh: 'Lumkisa abasebenzi bevenkile, hlola izindlu zangasese uze ukhokelele wonke umntu kwindawo ekhuselekileyo.',
        },
        hotspots: [
          {
            id: 'kiosk-sweep',
            label: 'Kiosk & Restroom Sweep Check',
            detail: 'Designated floor warden verifies zero staff or customers remain inside back-office or restrooms.',
            position3D: [-2.5, 1.2, -2.5],
            severity: 'warning',
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Steps 7–9: Assembly Point Roll-Call, Bi-Annual Drills & Handover',
        durationSeconds: 4,
        cameraPos: [8.0, 4.5, 5.5],
        cameraLookAt: [3.2, 1.0, 1.8],
        telemetryTag: 'MUSTER ROLL-CALL • SHIFT SHEET VERIFIED',
        captions: {
          en: 'Site Manager conducts formal roll-call at the upwind Assembly Point using the daily shift sheet, records signatures, and briefs EMS/Fire Chief.',
          sw: 'Meneja anaita majina kwenye Eneo la Kukusanyika kwa kutumia karatasi ya zamu na kutoa taarifa kwa zima moto.',
          zu: 'Umphathi wenza i-roll call endaweni yokuhlangana esebenzisa ishidi leshefti bese enikezela kwabezicishamlilo.',
          af: 'Terreinbestuurder doen roloproep by die Versamelpunt met die skofregister en oorhandig aan Nooddienste.',
          st: 'Mookameli o bala basebetsi sebakeng sa kopano ka lenane la shefte pele a nehelana ho ba pholoso.',
          xh: 'UMphathi wenza ubizo-magama kwiNdawo yokuHlanganisela ngokwekhasi leshefti phambi kokunikezela kubacimi-mlilo.',
        },
        hotspots: [
          {
            id: 'muster-point',
            label: 'Upwind Emergency Assembly Point',
            detail: 'Twice-yearly evacuation drills are mandatory under OHSA; 100% headcount must be reconciled.',
            position3D: [3.2, 1.4, 1.8],
            severity: 'info',
          },
        ],
      },
    ],
  },
  {
    id: 'tanker-offloading',
    code: 'MOD-03',
    title: '3. Tanker Offloading, ATG Verification & Earthing Safety Gate',
    category: 'Tanker Offloading',
    statutoryRef: 'SANS 10089-1 • SANS 10089-3 • OHS Act Sec 8(2)(e)',
    posterSrc: '/assets/forecourt_realistic_scene1.jpg',
    steps: [
      {
        stepNumber: 1,
        title: 'Wheel Chocks & Static Earthing Clamp (Before Cap Removal)',
        durationSeconds: 4,
        cameraPos: [6.8, 3.6, 6.2],
        cameraLookAt: [0, 0.8, 0],
        telemetryTag: 'INTERLOCK 1 • EARTHING CLAMP VERIFIED',
        captions: {
          en: 'Place wheel chocks and connect the static earthing/grounding clamp to the tanker chassis BEFORE opening any fill caps.',
          sw: 'Weka vizuizi vya magurudumu na unganisha waya wa umeme tuli kabla ya kufungua mifuniko ya tangi.',
          zu: 'Beka izivimbi zamasondo bese uxhuma intambo yomhlaba (earthing) ethenkeni NGAPHAMBI kokuvula izivalo.',
          af: 'Plaas wielklampies en koppel die statiese aardklem aan die tenkwa VOORDAT enige vuldoppe oopgemaak word.',
          st: 'Beha li-chock tsa mabili ’me u hokele thapo ea earthing pele u bula likoahelo.',
          xh: 'Beka izithinteli zamavili uze uqhagamshele ucingo lomhlaba (earthing) PHAMBI kokuvula iziciko.',
        },
        hotspots: [
          {
            id: 'earthing-clamp',
            label: 'Static Earthing / Grounding Clamp',
            detail: 'Equalizes electrostatic potential between tanker and underground tank farm to prevent vapor spark ignition.',
            position3D: [-1.4, 0.6, 1.2],
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Product Grade & Pre-Drop ATG Ullage Confirmation',
        durationSeconds: 4,
        cameraPos: [4.8, 4.2, 4.8],
        cameraLookAt: [0.8, 0.4, 0.4],
        telemetryTag: 'ULLAGE ≥ 105% BOL • GRADE LOCKED',
        captions: {
          en: 'Confirm tank product grade (ULP 93, ULP 95, Diesel 50ppm, Diesel 10ppm) and verify ≥ 5% ATG ullage headspace before connecting hoses.',
          sw: 'Thibitisha aina ya mafuta na hakikisha nafasi ya tangi (ullage) kupitia ATG kabla ya kuunganisha mipira.',
          zu: 'Qinisekisa uhlobo lukaphethiloli nezinga le-ATG ullage ngaphambi kokuxhuma amapayipi.',
          af: 'Bevestig produkgraad en verifieer ≥ 5% ATG-ullage spasie voordat aflaaipype gekoppel word.',
          st: 'Netefatsa mofuta oa mafura le sebaka sa ATG pele u hokela liphaephe.',
          xh: 'Qinisekisa udidi lwamafutha nesithuba se-ATG phambi kokudibanisa imibhobho.',
        },
        hotspots: [
          {
            id: 'ust-manholes',
            label: 'Colour-Coded UST Fill Manholes',
            detail: 'Grade cross-over (petrol into diesel) causes catastrophic engine damage and flash-point contamination.',
            position3D: [1.5, 0.2, 0.8],
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Spill Kit Staged, Vapour Recovery & 15°C BOL Reconciliation',
        durationSeconds: 4,
        cameraPos: [5.8, 3.4, -4.5],
        cameraLookAt: [0.5, 0.7, 0.2],
        telemetryTag: 'VRU STAGE 1B • 15°C BOL VERIFIED',
        captions: {
          en: 'Stage the spill kit upwind, couple the Stage 1B vapour recovery hose, monitor discharge, and reconcile post-drop ATG vs 15°C BOL.',
          sw: 'Weka spill kit tayari, unganisha mpira wa kurejesha mvuke, na linganisha ATG na BOL ya 15°C.',
          zu: 'Beka i-spill kit eduze, xhuma ipayipi le-vapour recovery, bese uqhathanisa i-ATG ne-15°C BOL.',
          af: 'Plaas stortingstel windop, koppel dampterugwinning en rekonsilieer na-aflaai ATG teen 15°C BOL.',
          st: 'Beha spill kit haufi, hokela phaephe ea mouoane, ’me u lekanye ATG le 15°C BOL.',
          xh: 'Beka i-spill kit kufuphi, qhagamshela umbhobho womphunga uze uthelekise i-ATG ne-15°C BOL.',
        },
        hotspots: [
          {
            id: 'vapour-recovery',
            label: 'Stage 1B Vapour Recovery & Staged Spill Kit',
            detail: 'Captures displaced hydrocarbon vapours safely back into the tanker compartment during bulk drop.',
            position3D: [0.2, 1.0, -0.6],
            severity: 'warning',
          },
        ],
      },
    ],
  },
  {
    id: 'fire-marshal-pass',
    code: 'MOD-04',
    title: '4. Fire Marshal & P.A.S.S. Extinguisher Deployment',
    category: 'Fire Marshal',
    statutoryRef: 'ERW Reg 9 • SANS 10105 • SANS 1910 • OHS Act Sec 8(2)(e)',
    posterSrc: '/assets/posters/pass_firefighting_poster.png',
    steps: [
      {
        stepNumber: 1,
        title: 'Alarm Activation, E-Stop & Upwind Approach',
        durationSeconds: 4,
        cameraPos: [6.4, 4.0, 6.0],
        cameraLookAt: [0, 0.9, 0],
        telemetryTag: 'CLASS B FIRE • UPWIND STANCE 3.5m',
        captions: {
          en: 'Sound the fire alarm, hit E-Stop to cut fuel flow, and position 9kg DCP/CO2 extinguishers 3–4.5m UPWIND with a clear escape path.',
          sw: 'Piga king’ora, bonyeza E-Stop, na simama mita 3–4.5 upande wa upepo na kizima moto cha 9kg DCP.',
          zu: 'Shaya i-alamu, cindezela i-E-Stop, bese uma ngaphambi komoya ngamamitha angu-3–4.5 uphethe i-9kg DCP.',
          af: 'Klink die brandalarm, druk Noodstop, en staan 3–4.5m windop met ’n oop ontsnaproete.',
          st: 'Letsa alamo, tobetsa E-Stop, ’me u eme limithara tse 3–4.5 moea o tsoang ho uena.',
          xh: 'Hlaba ikhwelo lomlilo, cinezela i-E-Stop, uze ume ngasemoyeni kwi-3–4.5m unendlela yokubaleka.',
        },
        hotspots: [
          {
            id: 'wind-direction',
            label: 'Upwind Attack Vector (Clear Egress Behind)',
            detail: 'Never fight a hydrocarbon fire from downwind or let flames block your exit.',
            position3D: [-2.2, 1.4, 1.8],
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'P.A.S.S. Execution: Pull, Aim at Base, Squeeze & Sweep',
        durationSeconds: 5,
        cameraPos: [4.2, 2.6, 4.6],
        cameraLookAt: [0, 0.7, 0],
        telemetryTag: 'P.A.S.S. METHOD • BASE OF FLAME TARGETED',
        captions: {
          en: 'Execute P.A.S.S.: PULL the safety pin, AIM the nozzle at the BASE of the fire, SQUEEZE the lever, and SWEEP side-to-side. Never use water jets on fuel fires!',
          sw: 'Tekeleza P.A.S.S.: Vuta pini, Lenga chini kwenye mzizi wa moto, Finya kishikio, Tikisa kushoto na kulia.',
          zu: 'Sebenzisa i-P.A.S.S.: Donsa iphini, Qondisa phansi emlilweni, Cindezela isibambo, Shintshanisa nxazonke.',
          af: 'Voer P.A.S.S. uit: Trek pen, Rig by die basis van die vlam, Druk handvatsel, Veeg heen en weer.',
          st: 'Sebelisa P.A.S.S.: Hula phini, Lebisa botlaaseng ba mollo, Tobetsa, ’me u fiele ka lehlakore.',
          xh: 'Sebenzisa i-P.A.S.S.: Tsala ipini, Jonga esisekweni somlilo, Cinezela, uze utshayele macala onke.',
        },
        hotspots: [
          {
            id: 'dcp-extinguisher',
            label: '9kg DCP Extinguisher (Sweep Base of Fire)',
            detail: 'Dry Chemical Powder blankets oxygen and breaks the combustion chain without spreading liquid fuel.',
            position3D: [-1.1, 0.9, 1.3],
            severity: 'warning',
          },
        ],
      },
    ],
  },
  {
    id: 'customer-service-7step',
    code: 'MOD-05',
    title: '5. 7-Step Forecourt Customer Service & 4+1 Spare Wheel Check',
    category: 'Customer Service',
    statutoryRef: 'SANS 10089-3 • Forecourt Service & Safety Standard',
    posterSrc: '/assets/posters/customer_service_poster.png',
    steps: [
      {
        stepNumber: 1,
        title: 'Steps 1–3: Lane Guidance, Zero Meter & Grade Confirmation',
        durationSeconds: 4,
        cameraPos: [5.5, 3.0, 5.2],
        cameraLookAt: [0, 0.9, 0],
        telemetryTag: 'ZERO METER • DOUBLE-CONFIRM GRADE',
        captions: {
          en: 'Guide vehicle safely, greet warmly, double-confirm fuel grade & rand/litre amount to prevent misfuelling, verify meter at 0.00, and enforce no-smoking/phones.',
          sw: 'Ongoza gari, salimia, hakikisha aina ya mafuta na mita ya sifuri (0.00), na zuia simu na sigara.',
          zu: 'Qondisa imoto, bingelela, qinisekisa uhlobo lukaphethiloli nemitha ka-0.00, bese wenqabela amaselula.',
          af: 'Lei voertuig in, groet vriendelik, dubbelbevestig brandstofgraad & bedrag, en wys 0.00 meter.',
          st: 'Tataisa koloi, lumelisa, netefatsa mofuta oa mafura le mithara ea 0.00.',
          xh: 'Khokelela imoto, bulisa, qinisekisa udidi lwamafutha nemitha eku-0.00.',
        },
        hotspots: [
          {
            id: 'zero-meter',
            label: 'Pump Zero-Meter & Grade Confirmation',
            detail: 'Prevents petrol-in-diesel misfuelling claims and pump totalizer disputes.',
            position3D: [-1.4, 1.4, 0],
            severity: 'info',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Steps 4–7: Store Promos, 4+1 Spare Wheel Check & Speedpoint Pay',
        durationSeconds: 5,
        cameraPos: [4.8, 2.6, -4.6],
        cameraLookAt: [0.4, 0.6, 0],
        telemetryTag: '4+1 SPARE WHEEL • STORE PROMO • RECEIPT',
        captions: {
          en: 'Mention inside store promos, clean windscreen, check oil/water, check ALL 4 road tyres PLUS the 5th spare wheel, lock fuel cap, and settle via Speedpoint/cash with a smile.',
          sw: 'Taja ofa za duka, safisha kioo, kagua tairi zote 4 pamoja na tairi ya akiba (4+1), funga kifuniko na malipo.',
          zu: 'Phakamisa amaphromo esitolo, hlola amawindi, uwoyela, namathayi ama-4+1 nesondo elingcwele, bese ukhokha.',
          af: 'Noem winkelpromosies, was voorruit, kontroleer olie/water, al 4 bande PLUS noodwiel (4+1), en handel betaling af.',
          st: 'Bolela lipromo tsa lebenkele, hloekisa fensetere, hlahloba mabili a 4 + le leng (4+1), ’me u lefe.',
          xh: 'Khankanya iipromo zevenkile, coca ifestile, hlola amavili ama-4 + elokutshintsha (4+1) uze uhlawule.',
        },
        hotspots: [
          {
            id: 'spare-wheel-4plus1',
            label: '4+1 Spare Wheel Pressure Check',
            detail: 'Motorists rarely check their spare tyre until a roadside puncture occurs — checking 4+1 saves lives.',
            position3D: [1.8, 0.5, -0.4],
            severity: 'warning',
          },
        ],
      },
    ],
  },
  {
    id: 'r638-food-hygiene',
    code: 'MOD-06',
    title: '6. Shop & QSR Food Service Hygiene (Regulation R638 / SANS 10049)',
    category: 'R638 Food Hygiene',
    statutoryRef: 'Regulation R638 of 2018 • SANS 10049 HACCP',
    posterSrc: '/assets/posters/first_responder_poster.png',
    steps: [
      {
        stepNumber: 1,
        title: 'Cold-Chain (≤ 5°C / ≤ -18°C) & Hot-Holding (≥ 60°C) Probes',
        durationSeconds: 4,
        cameraPos: [5.4, 3.2, 5.2],
        cameraLookAt: [-0.4, 1.0, 0],
        telemetryTag: 'R638 COLD-CHAIN • PROBE LOGGED',
        captions: {
          en: 'Verify chillers ≤ 5°C, freezers ≤ -18°C, and hot-holding cabinets ≥ 60°C (≥ 65°C recommended). Any temperature breach triggers an automatic R638 NCR.',
          sw: 'Hakikisha baridi ≤ 5°C, friza ≤ -18°C, na kabati ya moto ≥ 60°C. Mkengeuko hufungua NCR ya R638.',
          zu: 'Qinisekisa amafriji ≤ 5°C, i-freezer ≤ -18°C, nokudla okushisayo ≥ 60°C ngokwe-R638.',
          af: 'Verifieer verkoelers ≤ 5°C, vrieskaste ≤ -18°C, en warmhou-kabinette ≥ 60°C; enige oortreding open ’n R638 NCR.',
          st: 'Netefatsa lifriji ≤ 5°C, freezer ≤ -18°C, le lijo tse chesang ≥ 60°C tlas’a R638.',
          xh: 'Qinisekisa iifriji ≤ 5°C, ifriza ≤ -18°C, nokutya okushushu ≥ 60°C phantsi kwe-R638.',
        },
        hotspots: [
          {
            id: 'cold-chain-units',
            label: 'Chiller (≤ 5°C), Freezer (≤ -18°C) & Hot-Hold (≥ 60°C)',
            detail: 'Sanitize digital probe with alcohol wipe between every food/unit reading.',
            position3D: [-1.8, 1.2, -0.8],
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'FIFO Rotation, Colour-Coded Boards, Handwash & Extraction Hood',
        durationSeconds: 5,
        cameraPos: [4.6, 3.0, 4.8],
        cameraLookAt: [1.0, 0.9, 0.2],
        telemetryTag: 'SANS 10049 • ZERO CROSS-CONTAMINATION',
        captions: {
          en: 'Enforce FIFO expiry rotation, colour-coded chopping boards (raw meat vs ready-to-eat), 20-second handwashing, and extraction hood / fire-suppression green-zone checks.',
          sw: 'Tekeleza mzunguko wa FIFO, mbao za kukatia za rangi tofauti, kunawa mikono na ukaguzi wa kofia ya moshi.',
          zu: 'Landela i-FIFO, amabhodi okusika anemibala ehlukene, ukugeza izandla, nokuhlola i-extraction hood.',
          af: 'Handhaaf FIFO-rotasie, kleurgekodeerde snyplanke, handewas-SOP en uitasemkap / brandblusser-kontroles.',
          st: 'Sebelisa FIFO, liboto tsa mebala e fapaneng, ho hlapa matsoho le tlhahlobo ea hood ea mollo.',
          xh: 'Landela i-FIFO, iibhodi zokusika ezinemibala, ukuhlamba izandla nokuhlola i-extraction hood.',
        },
        hotspots: [
          {
            id: 'colour-boards-hood',
            label: 'Colour-Coded Boards & Extraction Fire-Suppression',
            detail: 'Red=Raw Meat, Yellow=Poultry, Green=Salad/Veg, White=Bakery/Dairy. Verify Ansul gauge in GREEN.',
            position3D: [1.2, 1.0, 0.2],
            severity: 'warning',
          },
        ],
      },
    ],
  },
];

export const EXECUTIVE_DEMO_TOUR_SEQUENCE: ExecutiveTourStop[] = [
  {
    moduleId: 'spill-response',
    stepIndex: 5,
    durationSeconds: 15,
    telemetryHighlight: 'PILLAR 1 • Non-Sparking Plastic Spade & Hard Broom (Zero Steel Sparks)',
  },
  {
    moduleId: 'evacuation-muster',
    stepIndex: 2,
    durationSeconds: 15,
    telemetryHighlight: 'PILLAR 1 • E-Stop Isolation & Upwind Muster Roll-Call',
  },
  {
    moduleId: 'tanker-offloading',
    stepIndex: 0,
    durationSeconds: 15,
    telemetryHighlight: 'PILLAR 2 • Tanker Earthing Clamp, Ullage & 15°C BOL Reconciliation',
  },
  {
    moduleId: 'fire-marshal-pass',
    stepIndex: 1,
    durationSeconds: 15,
    telemetryHighlight: 'PILLAR 1 • 9kg DCP Fire Marshal P.A.S.S. Deployment',
  },
  {
    moduleId: 'customer-service-7step',
    stepIndex: 1,
    durationSeconds: 15,
    telemetryHighlight: 'PILLAR 3 • 7-Step Customer Standard & 4+1 Spare Wheel Check',
  },
  {
    moduleId: 'r638-food-hygiene',
    stepIndex: 0,
    durationSeconds: 15,
    telemetryHighlight: 'PILLAR 3/4 • R638 Cold-Chain HACCP & Auto-NCR Governance',
  },
];

