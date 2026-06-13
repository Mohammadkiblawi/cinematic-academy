/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
// ── API helpers ──────────────────────────────────────────
const api = {
  async get(url) {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  },
  async post(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN,   // injected by Django template
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  }
};

// const COURSES = [
//   { id:0, title:'Mastering Camera Movement', breadTitle:'Mastering Camera Movement', tag:'Cinematography', tagClass:'tag-cinemato', level:'Intermediate', desc:'Master the art of dynamic camera movement with hands-on techniques.', rating:'4.9', ratingCount:'(2,847 ratings)', students:'12,450 students enrolled', hours:'8 hours total', instructor:'Sarah Chen', instrInitials:'SC', instrAv:'av-purple', duration:'8h 30m', lessonsCount:'32', lessonsCompleted:'21', totalLessons:32, level:'Intermediate', progress:65, status:'inprogress', thumb:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80', heroBg:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=80',
//     curriculum:[
//       {title:'Introduction to Cinematography',lessons:[
//         {name:'Welcome to the Course',dur:'5:30',durSec:330,status:'done',img:'https://plus.unsplash.com/premium_photo-1682125771198-f7cbed7cb868?q=80&w=1160'},
//         {name:'Understanding Your Camera',dur:'12:45',durSec:765,status:'done',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Lens Basics',dur:'15:20',durSec:920,status:'play',img:'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=600&q=80'}
//       ]},
//       {title:'Lighting Fundamentals',lessons:[
//         {name:'Introduction to Three-Point Lighting',dur:'12:34',durSec:754,status:'play',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Natural vs. Artificial Light',dur:'18:22',durSec:1102,status:'play',img:'https://images.unsplash.com/photo-1559154132-6d27bd0c65b0?q=80&w=871'},
//         {name:'Working with Shadows',dur:'15:45',durSec:945,status:'play',img:'https://plus.unsplash.com/premium_photo-1722764877809-6af1e98f6abf?q=80&w=870'}
//       ]},
//       {title:'Advanced Techniques',lessons:[
//         {name:'Dynamic Camera Movement',dur:'20:10',durSec:1210,status:'lock',img:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600&q=80'},
//         {name:'Working with Gimbals',dur:'17:55',durSec:1075,status:'lock',img:'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=600&q=80'},
//         {name:'Aerial Cinematography',dur:'22:30',durSec:1350,status:'lock',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'}
//       ]}
//     ]
//   },
//   { id:1, title:'Advanced Color Grading Techniques', breadTitle:'Advanced Color Grading', tag:'Editing', tagClass:'tag-editing', level:'Advanced', desc:'Dive deep into professional color grading workflows.', rating:'4.8', ratingCount:'(1,923 ratings)', students:'9,870 students enrolled', hours:'6 hours total', instructor:'Marcus Rodriguez', instrInitials:'MR', instrAv:'av-teal', duration:'6h 45m', lessonsCount:'28', lessonsCompleted:'12', totalLessons:28, level:'Advanced', progress:42, status:'inprogress', thumb:'https://images.unsplash.com/photo-1716471330459-063b3baf247e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', heroBg:'https://images.unsplash.com/photo-1716471330459-063b3baf247e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     curriculum:[
//       {title:'Color Theory Foundations',lessons:[
//         {name:'Understanding Color Science',dur:'8:20',durSec:500,status:'done',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'},
//         {name:'Color Wheels & Vectors',dur:'11:15',durSec:675,status:'done',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'},
//         {name:'Reading Scopes & Waveforms',dur:'14:30',durSec:870,status:'play',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'}
//       ]},
//       {title:'DaVinci Resolve Workflow',lessons:[
//         {name:'Node-Based Color Grading',dur:'16:00',durSec:960,status:'play',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'},
//         {name:'Working with LUTs',dur:'12:45',durSec:765,status:'play',img:'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=600&q=80'},
//         {name:'Power Windows & Masking',dur:'18:10',durSec:1090,status:'lock',img:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600&q=80'}
//       ]},
//       {title:'Cinematic Looks',lessons:[
//         {name:'Recreating Film Stocks',dur:'22:00',durSec:1320,status:'lock',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'},
//         {name:'Teal & Orange Mastery',dur:'19:30',durSec:1170,status:'lock',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Delivering Your Grade',dur:'10:45',durSec:645,status:'lock',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'}
//       ]}
//     ]
//   },
//   { id:2, title:'Scene Composition & Blocking', breadTitle:'Scene Composition & Blocking', tag:'Directing', tagClass:'tag-directing', level:'Intermediate', desc:'Learn how top directors plan and execute compelling scenes.', rating:'4.7', ratingCount:'(3,102 ratings)', students:'15,320 students enrolled', hours:'5 hours total', instructor:'Emily Watson', instrInitials:'EW', instrAv:'av-blue', duration:'5h 20m', lessonsCount:'24', lessonsCompleted:'21', totalLessons:24, level:'Intermediate', progress:88, status:'inprogress', thumb:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=800&q=80', heroBg:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=1400&q=80',
//     curriculum:[
//       {title:'Foundations of Composition',lessons:[
//         {name:'Rule of Thirds',dur:'9:00',durSec:540,status:'done',img:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600&q=80'},
//         {name:'Leading Lines & Depth',dur:'13:20',durSec:800,status:'done',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'},
//         {name:'Frame Within a Frame',dur:'11:45',durSec:705,status:'done',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'}
//       ]},
//       {title:'Blocking Techniques',lessons:[
//         {name:'Actor Blocking Basics',dur:'15:30',durSec:930,status:'done',img:'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=600&q=80'},
//         {name:'Camera & Actor Sync',dur:'18:00',durSec:1080,status:'done',img:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600&q=80'},
//         {name:'Rehearsal Strategies',dur:'14:20',durSec:860,status:'play',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'}
//       ]},
//       {title:'Advanced Scene Direction',lessons:[
//         {name:'Emotional Scene Pacing',dur:'20:15',durSec:1215,status:'lock',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'},
//         {name:'Long-Take Choreography',dur:'25:00',durSec:1500,status:'lock',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Final Capstone Project',dur:'30:00',durSec:1800,status:'lock',img:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600&q=80'}
//       ]}
//     ]
//   },
//   { id:3, title:'Natural Light Cinematography', breadTitle:'Natural Light Cinematography', tag:'Cinematography', tagClass:'tag-cinemato', level:'Beginner', desc:'Harness the power of natural light for stunning visuals.', rating:'4.6', ratingCount:'(1,204 ratings)', students:'8,230 students enrolled', hours:'9 hours total', instructor:'David Kim', instrInitials:'DK', instrAv:'av-green', duration:'9h 15m', lessonsCount:'36', lessonsCompleted:'5', totalLessons:36, level:'Beginner', progress:15, status:'inprogress', thumb:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80', heroBg:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1400&q=80',
//     curriculum:[
//       {title:'Understanding Natural Light',lessons:[
//         {name:'Golden Hour Shooting',dur:'14:20',durSec:860,status:'done',img:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80'},
//         {name:'Overcast & Diffused Light',dur:'11:45',durSec:705,status:'play',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Harsh Midday Sun',dur:'13:30',durSec:810,status:'lock',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'}
//       ]},
//       {title:'Reflectors & Diffusers',lessons:[
//         {name:'Using Reflectors On-Set',dur:'16:00',durSec:960,status:'lock',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'},
//         {name:'DIY Diffusion Techniques',dur:'12:00',durSec:720,status:'lock',img:'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600&q=80'},
//         {name:'Combining Natural & Artificial',dur:'18:30',durSec:1110,status:'lock',img:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80'}
//       ]},
//       {title:'Location Scouting',lessons:[
//         {name:'Reading a Location',dur:'10:45',durSec:645,status:'lock',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'},
//         {name:'Time of Day Planning',dur:'14:00',durSec:840,status:'lock',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Weather & Mood',dur:'11:20',durSec:680,status:'lock',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'}
//       ]}
//     ]
//   },
//   { id:4, title:'Audio for Film Production', breadTitle:'Audio for Film Production', tag:'Sound Design', tagClass:'tag-sound', level:'Intermediate', desc:'Professional sound recording, mixing, and design for film.', rating:'4.8', ratingCount:'(987 ratings)', students:'6,540 students enrolled', hours:'7 hours total', instructor:'Lisa Martinez', instrInitials:'LM', instrAv:'av-pink', duration:'7h 40m', lessonsCount:'30', lessonsCompleted:'17', totalLessons:30, level:'Intermediate', progress:55, status:'inprogress', thumb:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80', heroBg:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1400&q=80',
//     curriculum:[
//       {title:'Sound Recording Fundamentals',lessons:[
//         {name:'Microphone Types & Placement',dur:'13:00',durSec:780,status:'done',img:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80'},
//         {name:'Boom Operation Techniques',dur:'15:30',durSec:930,status:'done',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Wireless Lavalier Setup',dur:'11:20',durSec:680,status:'play',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'}
//       ]},
//       {title:'On-Set Sound',lessons:[
//         {name:'Recording Dialogue Cleanly',dur:'14:45',durSec:885,status:'play',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'},
//         {name:'Managing Background Noise',dur:'12:30',durSec:750,status:'lock',img:'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=600&q=80'},
//         {name:'Timecode & Sync',dur:'10:00',durSec:600,status:'lock',img:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80'}
//       ]},
//       {title:'Post-Production Audio',lessons:[
//         {name:'Dialogue Editing in Premiere',dur:'20:00',durSec:1200,status:'lock',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'},
//         {name:'Sound Design & Foley',dur:'22:30',durSec:1350,status:'lock',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Final Mix & Deliverables',dur:'18:00',durSec:1080,status:'lock',img:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80'}
//       ]}
//     ]
//   },
//   { id:5, title:'Narrative Editing Fundamentals', breadTitle:'Narrative Editing Fundamentals', tag:'Editing', tagClass:'tag-editing', level:'Beginner', desc:'Learn storytelling through editing – pacing, rhythm, and emotional impact.', rating:'4.5', ratingCount:'(2,341 ratings)', students:'11,800 students enrolled', hours:'6 hours total', instructor:'James Wilson', instrInitials:'JW', instrAv:'av-orange', duration:'6h 10m', lessonsCount:'26', lessonsCompleted:'8', totalLessons:26, level:'Beginner', progress:30, status:'inprogress', thumb:'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80', heroBg:'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1400&q=80',
//     curriculum:[
//       {title:'Editing Foundations',lessons:[
//         {name:'The Cut: When & Why',dur:'9:30',durSec:570,status:'done',img:'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80'},
//         {name:'Continuity Editing Rules',dur:'12:00',durSec:720,status:'done',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Jump Cuts & Their Uses',dur:'10:45',durSec:645,status:'play',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'}
//       ]},
//       {title:'Pacing & Rhythm',lessons:[
//         {name:'Building Tension',dur:'14:20',durSec:860,status:'play',img:'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=600&q=80'},
//         {name:'Emotional Pacing',dur:'16:00',durSec:960,status:'lock',img:'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80'},
//         {name:'Music & Edit Sync',dur:'13:30',durSec:810,status:'lock',img:'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=600&q=80'}
//       ]},
//       {title:'Advanced Editing',lessons:[
//         {name:'Montage Theory',dur:'18:00',durSec:1080,status:'lock',img:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80'},
//         {name:'Non-Linear Storytelling',dur:'22:00',durSec:1320,status:'lock',img:'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=600&q=80'},
//         {name:'Final Cut Delivery',dur:'15:00',durSec:900,status:'lock',img:'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80'}
//       ]}
//     ]
//   }
// ];
// ── Course list (replaces static COURSES array) ──────────
let COURSES = [];  // populated on first load

let COURSE_INDEX = {};

function resolveCourseIndex(courseId) {
  return COURSE_INDEX[courseId] !== undefined ? COURSE_INDEX[courseId] : courseId;
}

async function loadCourses() {
  if (COURSES.length) return COURSES;
  const data = await api.get('/api/courses/');
  COURSES = data.courses.filter(c=>c.is_enrolled);
    // If the server injected an initial course (page‑load), merge it into the array
    if (window.initialCourse) {
        const i = COURSES.findIndex(c => c.id === window.initialCourse.id);
        if (i !== -1) {
            // Merge instead of overwrite — preserves fields like is_enrolled,
            // tagClass, instrAv, instrInitials, etc. that only /api/courses/ provides
            COURSES[i] = { ...COURSES[i], ...window.initialCourse, is_enrolled: true };
        } else {
            COURSES.push(window.initialCourse);
        }
    }

  // Build id -> array index map for resolveCourseIndex
  COURSE_INDEX = {};
  COURSES.forEach((c, idx) => { COURSE_INDEX[c.id] = idx; });

  return COURSES;
}

const LESSON_NOTES = {
  default:['Key light: Main light source, positioned 45° from subject','Fill light: Softens shadows, typically 1/2 intensity of key','Back light: Separates subject from background, creates depth'],
  'Lens Basics':['Wide angle (16–35mm): landscapes, establishing shots','Standard (35–85mm): natural perspective, interviews','Telephoto (85mm+): compression effect, wildlife, sports'],
  'Node-Based Color Grading':['Serial nodes: corrections flow left to right','Parallel nodes: blend multiple grades','Layer nodes: alpha masks for targeted corrections'],
};
const LESSON_RESOURCES = {
  default:[{type:'PDF',name:'Lesson Notes – Three-Point Lighting',size:'2.4 MB'},{type:'PDF',name:'Lighting Diagrams Reference',size:'1.8 MB'},{type:'ZIP',name:'Practice Files',size:'45 MB'}],
  'Lens Basics':[{type:'PDF',name:'Lens Guide – Focal Lengths',size:'3.1 MB'},{type:'ZIP',name:'Sample Raw Footage',size:'120 MB'}],
};
const LESSON_DESCS = {
  'Introduction to Three-Point Lighting':'Learn the fundamental lighting technique used in professional film and video production.',
  'Natural vs. Artificial Light':'Understand how to harness natural light and supplement it with artificial sources.',
  'Working with Shadows':'Shadow is a storytelling tool. Learn to sculpt shadows for mood and depth.',
  'Welcome to the Course':'Get oriented with the course structure and meet your instructor.',
  'Understanding Your Camera':'Deep dive into camera anatomy, sensor mechanics, and cinematic setup.',
  'Lens Basics':'Explore focal lengths and how your lens choice impacts the visual story.',
  default:'Explore this lesson\'s core concepts and build practical filmmaking skills.'
};

/* ═══════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════ */
let currentCourseIdx=0, currentSectionIdx=0, currentLessonIdx=0;
let completedLessons=new Set();
let ldIsPlaying=false, ldTimer=null, ldCurrentSec=334, ldTotalSec=754, ldMuted=false;
let dashIsPlaying=false, dashTimer=null, dashCurrSec=425, dashTotalSec=945;
let notifPanelOpen=false, unreadCount=3;
let mcCurrentFilter='all';
let llCurrentFilter='all', llCurrentSort='default', courseOpenedFrom='dashboard';

/* ═══════════════════════════════════════════════════════
   NOTIFICATIONS
═══════════════════════════════════════════════════════ */
function toggleNotif(e){e.stopPropagation();notifPanelOpen?closeNotif():openNotif();}
function openNotif(){notifPanelOpen=true;document.getElementById('notifPanel').classList.add('open');document.getElementById('notifBell').classList.add('notif-active');}
function closeNotif(){notifPanelOpen=false;document.getElementById('notifPanel').classList.remove('open');document.getElementById('notifBell').classList.remove('notif-active');}
document.addEventListener('click',e=>{if(notifPanelOpen&&!document.getElementById('notifPanel').contains(e.target)&&!document.getElementById('notifBell').contains(e.target))closeNotif();});
function readNotif(idx){const item=document.getElementById('notif-'+idx);if(!item||item.classList.contains('read'))return;item.classList.add('read');unreadCount=Math.max(0,unreadCount-1);updateNotifBadge();showToast('👁️','Notification marked as read');}
function markAllRead(){document.querySelectorAll('.notif-item:not(.read)').forEach(i=>i.classList.add('read'));unreadCount=0;updateNotifBadge();showToast('fa-check','All notifications marked as read');}
function updateNotifBadge(){const b=document.getElementById('notifCountBadge'),d=document.getElementById('notifDot');b.textContent=unreadCount;unreadCount===0?(b.classList.add('zero'),d.classList.add('hidden')):(b.classList.remove('zero'),d.classList.remove('hidden'));document.getElementById('notifEmpty').classList.toggle('show',unreadCount===0);}

/* ═══════════════════════════════════════════════════════
   LESSONS LIBRARY
═══════════════════════════════════════════════════════ */

/* Flatten all lessons from all courses */
function getAllLessons() {
  const all = [];
  COURSES.filter(c => c.is_enrolled).forEach(c => {
    c.curriculum.forEach((sec, si) => {
      sec.lessons.forEach((l, li) => {
        all.push({
          ...l,
          courseIdx: c.id, si, li,
          courseName: c.title,
          courseShort: c.breadTitle,
          instructor:  c.instructor,
          tagClass:    c.tagClass,
          tag:         c.tag,
        });
      });
    });
  });
  return all;
}

function buildLessonsLibrary(filter='all', query='', sort='default') {
  let lessons = getAllLessons();

  // Filter by status
  if (filter === 'completed') lessons = lessons.filter(l => l.status === 'done');
  if (filter === 'inprogress') lessons = lessons.filter(l => l.status === 'play');

  // Filter by search
  if (query) {
    const q = query.toLowerCase();
    lessons = lessons.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.courseName.toLowerCase().includes(q) ||
      l.instructor.toLowerCase().includes(q) ||
      l.tag.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'az')  lessons.sort((a,b) => a.name.localeCompare(b.name));
  if (sort === 'dur') lessons.sort((a,b) => b.durSec - a.durSec);
  if (sort === 'status') lessons.sort((a,b) => {
    const order = {done:0,play:1,lock:2};
    return order[a.status] - order[b.status];
  });

  // Update stats
  const all    = getAllLessons();
  const done   = all.filter(l=>l.status==='done').length;
  const inprog = all.filter(l=>l.status==='play').length;
  animateLlStat('ll-total', all.length);
  animateLlStat('ll-done',  done);
  animateLlStat('ll-inprog',inprog);

  // Render
  const container = document.getElementById('llList');
  if (!lessons.length) {
    container.innerHTML = `<div class="ll-empty"><i class="fa-solid fa-magnifying-glass"></i><h3>No lessons found</h3><p>Try adjusting your search or filter.</p></div>`;
    return;
  }

  container.innerHTML = lessons.map((l, i) => {
    const isDone   = l.status === 'done';
    const isPlay   = l.status === 'play';
    const isLock   = l.status === 'lock';
    const isNowPlaying = isPlay && i === 0 && filter==='all' && !query;

    // Status ring HTML
    let ringHtml = '';
    if (isDone) {
      ringHtml = `<div class="ll-status-ring ring-done"><i class="fa-solid fa-check"></i></div>`;
    } else if (isPlay) {
      const pct = Math.floor(Math.random()*40+20); // simulated progress %
      ringHtml = `<div class="ll-status-ring ring-inprog" style="--pct:${pct}%"><div class="ring-inprog-fill"></div></div>`;
    }

    // Action button
    const btnClass = (isDone||isLock) ? 'btn-review' : 'btn-watch';
    const btnText  = isDone ? 'Review' : isLock ? 'Locked' : 'Watch Now';
    const btnIcon  = isDone ? '' : isLock ? '<i class="fa-solid fa-lock" style="font-size:10px"></i> ' : '';
    const btnClick = isLock
      ? `showToast('fa-lock','Complete previous lessons to unlock')`
      : `openLesson(${l.courseIdx},${l.si},${l.li})`;

    return `
      <div class="ll-row${isNowPlaying?' now-playing':''}" onclick="${isLock?`showToast('fa-lock','Complete previous lessons to unlock')`:`openLesson(${l.courseIdx},${l.si},${l.li})`}" style="animation:fadeInUp .4s ease ${i*0.06}s both">
        <div class="ll-thumb-wrap">
          <img class="ll-thumb" src="${l.img}" alt="${l.name}"/>
          <div class="ll-dur-badge">${l.dur}</div>
          ${ringHtml}
          <div class="ll-play-overlay"><div class="ll-play-circle"><i class="fa-solid fa-${isLock?'lock':'play'}" style="font-size:${isLock?'12':'14'}px;${isLock?'':'margin-left:2px'}"></i></div></div>
        </div>
        <div class="ll-row-body">
          <div class="ll-info">
            <div class="ll-row-tag ${l.tagClass}">${l.tag}</div>
            <div class="ll-row-title">${l.name}</div>
            <div class="ll-row-meta">
              <span class="course-name">${l.courseShort}</span>
              <span class="dot">•</span>
              <span class="instructor-text">${l.instructor}</span>
              ${isNowPlaying ? `<span class="ll-now-playing-pill"><i class="fa-solid fa-circle"></i> Now Playing</span>` : ''}
            </div>
          </div>
          <button class="ll-action-btn ${btnClass}" onclick="event.stopPropagation();${btnClick}">${btnIcon}${btnText}</button>
        </div>
      </div>`;
  }).join('');
}

function animateLlStat(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const timer = setInterval(()=>{
    cur = Math.min(cur+1, target);
    el.textContent = cur;
    if(cur>=target) clearInterval(timer);
  }, 60);
}

function llFilter(filter, btn) {
  llCurrentFilter = filter;
  document.querySelectorAll('.ll-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  buildLessonsLibrary(filter, document.getElementById('llSearchInput').value, llCurrentSort);
}

function llSearch(inp) {
  buildLessonsLibrary(llCurrentFilter, inp.value, llCurrentSort);
}

const sortCycles = ['default','az','dur','status'];
const sortLabels = {default:'Default', az:'A–Z', dur:'Duration', status:'Status'};
function llCycleSort() {
  const idx = sortCycles.indexOf(llCurrentSort);
  llCurrentSort = sortCycles[(idx+1) % sortCycles.length];
  document.getElementById('llSortLabel').textContent = 'Sort: ' + sortLabels[llCurrentSort];
  buildLessonsLibrary(llCurrentFilter, document.getElementById('llSearchInput').value, llCurrentSort);
  showToast('fa-rotate', `Sorted by ${sortLabels[llCurrentSort]}`);
}

/* ═══════════════════════════════════════════════════════
   MY COURSES
═══════════════════════════════════════════════════════ */
function buildMyCourses(filter='all', query='') {
  const grid = document.getElementById('mcGrid');
  const enrolledCourses = COURSES.filter(c=>c.is_enrolled);
  let filtered = enrolledCourses.filter(c=>{
    const mf = filter==='all'||(filter==='inprogress'&&c.status==='inprogress')||(filter==='completed'&&c.progress===100);
    const mq = !query||c.title.toLowerCase().includes(query.toLowerCase())||c.instructor.toLowerCase().includes(query.toLowerCase())||c.tag.toLowerCase().includes(query.toLowerCase());
    return mf&&mq;
  });
  if(!filtered.length){grid.innerHTML=`<div class="mc-empty"><i class="fa-solid fa-magnifying-glass"></i><h3>No courses found</h3><p>Try adjusting your search or filter.</p></div>`;return;}
  grid.innerHTML=filtered.map((c,i)=>`
    <div class="mc-card" style="animation:fadeInUp .4s ease ${i*0.07}s both" onclick="openCourse(${c.id})" data-course-id=${c.id}>
      <div class="mc-thumb-wrap"><img class="mc-thumb" src="${c.thumb}" alt="${c.title}"/><div class="mc-thumb-overlay"><div class="mc-thumb-play"><i class="fa-solid fa-play" style="font-size:18px;margin-left:3px"></i></div></div>${c.progress===100?`<div class="mc-completed-badge"><i class="fa-solid fa-check"></i> Completed</div>`:''}</div>
      <div class="mc-card-body">
        <div class="mc-tags-row"><span class="mc-tag ${c.tagClass}">${c.tag}</span><span class="mc-level">${c.level}</span></div>
        <div class="mc-card-title">${c.title}</div>
        <div class="mc-instructor"><div class="mc-instr-avatar ${c.instrAv}">${c.instrInitials}</div><span class="mc-instr-name">${c.instructor}</span></div>
        <div class="mc-meta-row"><div class="mc-meta-item"><i class="fa-regular fa-circle-check"></i> ${c.lessonsCompleted}/${c.lessonsCount} lessons</div><div class="mc-meta-item"><i class="fa-regular fa-clock"></i> ${c.duration}</div></div>
        <div class="mc-progress-row"><span>Progress</span><span>${c.progress}%</span></div>
        <div class="mc-bar"><div class="mc-fill ${c.progress>70?'teal':''}" data-target="${c.progress}" style="width:0%"></div></div>
        <button class="mc-continue-btn" onclick="event.stopPropagation();openCourse(${c.id})">Continue</button>
      </div>
    </div>`).join('');
  setTimeout(()=>document.querySelectorAll('.mc-fill[data-target]').forEach(el=>el.style.width=el.dataset.target+'%'),200);
  document.getElementById('mc-total').textContent=enrolledCourses.length;
  document.getElementById('mc-inprogress').textContent=enrolledCourses.filter(c=>c.progress>0&&c.progress<100).length+enrolledCourses.filter(c=>c.progress===100).length;
  document.getElementById('mc-completed').textContent=enrolledCourses.filter(c=>c.progress===100).length;
  document.getElementById('mc-notstarted').textContent=enrolledCourses.filter(c=>c.progress===0).length;
}
function mcFilter(filter,btn){mcCurrentFilter=filter;document.querySelectorAll('.mc-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');buildMyCourses(filter,document.getElementById('mcSearchInput').value);}
function mcSearch(inp){buildMyCourses(mcCurrentFilter,inp.value);}

/* ═══════════════════════════════════════════════════════
   PAGE NAV
═══════════════════════════════════════════════════════ */
function showPage(id) {
  closeNotif();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+id);
  if(pg){pg.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
  if(id==='dashboard')  {setTimeout(animateCounters, 400); animateBars();}
  if(id==='mycourses')  { loadCourses().then(()=>{ buildMyCourses(mcCurrentFilter,''); setTimeout(animateMCCounters,200); }); }
  if(id==='lessons')    { loadCourses().then(()=> buildLessonsLibrary(llCurrentFilter,'',llCurrentSort)); }  
  if(id==='progress')   initProgressPage();
  if(id==='community')  initCommunityPage();
  if(id==='downloads')  initDownloadsPage();
}
function setTopbar(t){document.getElementById('topbarTitle').textContent=t;}
function navTo(e,page,el){
  e.preventDefault();
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  showPage(page);
  const titles={dashboard:'Dashboard',mycourses:'My Courses',lessons:'Lessons',course:'Course Details',lesson:'Lesson',progress:'Progress',community:'Community',downloads:'Downloads',settings:'Settings'};
  setTopbar(titles[page]||'Dashboard');
  closeSidebar();
}

/* ═══════════════════════════════════════════════════════
   COURSE DETAIL
═══════════════════════════════════════════════════════ */
function openCourse(courseId){
  const pg=document.querySelector('.page.active')?.id;
  courseOpenedFrom=pg==='page-mycourses'?'mycourses':pg==='page-lessons'?'lessons':'dashboard';
  const idx = resolveCourseIndex(courseId);
  currentCourseIdx=courseId;
  const c=COURSES[idx];
  if(!c) return;
  document.getElementById('cdHeroBg').style.backgroundImage=`url('${c.heroBg}')`;
  document.getElementById('cdBreadTitle').textContent=c.breadTitle;
  document.getElementById('cdTitle').textContent=c.title;
  document.getElementById('cdRating').textContent=c.rating;
  document.getElementById('cdRatingCount').textContent=c.ratingCount;
  document.getElementById('cdStudents').textContent=c.students;
  document.getElementById('cdHours').textContent=c.hours;
  const tagEl=document.getElementById('cdTag');tagEl.textContent=c.tag;tagEl.className='cd-tag '+c.tagClass;
  document.getElementById('cdSideThumb').src=c.thumb;
  document.getElementById('cdPct').textContent=c.progress+'% Complete';
  document.getElementById('cdInstructor').textContent=c.instructor;
  document.getElementById('cdDuration').textContent=c.duration;
  document.getElementById('cdLessons').textContent=c.lessonsCount;
  document.getElementById('cdLevel').textContent=c.level;
  document.getElementById('cdDesc').textContent=c.desc;
    const backLink = document.getElementById('cdBreadBack');

    backLink.textContent = 'My Courses';

    backLink.onclick = (e) => {
        e.preventDefault();

        const navEl = document.getElementById('nav-mycourses');

        if (navEl) {
            navTo(e, 'mycourses', navEl);
        } else {
            showPage('mycourses');
            setTopbar('My Courses');
        }
    };
  
  const fill=document.getElementById('csFill');fill.style.width='0%';setTimeout(()=>fill.style.width=c.progress+'%',150);
  document.getElementById('csContinueBtn').onclick=()=>{
    const flat=flatLessons(courseId), first=flat.find(f=>f.status!=='done')||flat[0];
    if(first){
      openLesson(courseId,first.si,first.li);
    }
  };
  document.getElementById('csSideThumbWrap').onclick=()=>{
    const flat=flatLessons(courseId), first=flat.find(f=>f.status!=='done')||flat[0];
    if(first){
      openLesson(courseId,first.si,first.li);
    }
  };
  buildAccordion(c.curriculum,courseId);
  showPage('course');setTopbar('Course Details');
  updateDashboardUI(idx); // Instantly update the dashboard UI
    api.post(`/api/set-active-course/${courseId}/`, {}).catch(() => {}); // Save to database
}

function flatLessons(courseId){
  const idx = resolveCourseIndex(courseId);
  const flat=[];
  if(!COURSES[idx] || !Array.isArray(COURSES[idx].curriculum)) return flat;
  COURSES[idx].curriculum.forEach((sec,si)=>{ const lessons = Array.isArray(sec.lessons) ? sec.lessons : []; lessons.forEach((l,li)=>flat.push({...l,si,li})); });
  return flat;
}

function buildAccordion(curriculum,courseId){
  const acc=document.getElementById('accordion');
  if(!acc) return;
  acc.innerHTML='';
  const sections = Array.isArray(curriculum) ? curriculum : [];
  if(!sections.length){
    acc.innerHTML='<div class="empty-curriculum">No curriculum available.</div>';
    return;
  }
  sections.forEach((sec,si)=>{
    const item=document.createElement('div');item.className='accordion-item'+(si===0?' open':'');
    const lessons = Array.isArray(sec.lessons) ? sec.lessons : [];
    const title = sec.title || `Section ${si+1}`;
    item.innerHTML=`<div class="accordion-header" onclick="toggleAcc(this)"><div class="acc-num">${si+1}</div><div class="acc-title">${title}</div><div class="acc-meta"><span class="acc-count">${lessons.length} lessons</span><i class="fa-solid fa-chevron-down acc-chevron"></i></div></div>
    <div class="accordion-body"><div class="acc-lessons">${lessons.map((l,li)=>{const icons={done:`<div class="al-icon al-done"><i class="fa-solid fa-check"></i></div>`,play:`<div class="al-icon al-play"><i class="fa-solid fa-play" style="font-size:9px"></i></div>`,lock:`<div class="al-icon al-lock"><i class="fa-solid fa-lock" style="font-size:9px"></i></div>`};const locked=l.status==='lock';return `<div class="acc-lesson" 
    data-locked="${locked}" onclick="${locked?`showToast('fa-lock','Complete previous lessons to 
    unlock')`:`openLesson(${courseId},${si},${li})`}">${icons[l.status] || icons.play}<span class="al-name">${l.title || l.name || 'Untitled Lesson'}</span><span 
    class="al-dur">${l.duration || l.dur || '0:00'}</span></div>`;}).join('')}</div></div>`;
    acc.appendChild(item);
  });
}
function toggleAcc(h){const item=h.closest('.accordion-item'),open=item.classList.contains('open');document.querySelectorAll('.accordion-item').forEach(i=>i.classList.remove('open'));if(!open)item.classList.add('open');}

/* ═══════════════════════════════════════════════════════
   LESSON DETAIL
═══════════════════════════════════════════════════════ */
async function openLesson(courseId,si,li){
  const idx = resolveCourseIndex(courseId);
  currentCourseIdx=courseId;currentSectionIdx=si;currentLessonIdx=li;
  const course = COURSES[idx];
  if (!course || !Array.isArray(course.curriculum) || !course.curriculum[si] || !Array.isArray(course.curriculum[si].lessons) || !course.curriculum[si].lessons[li]) {
    console.warn('Invalid lesson selection', courseId, si, li);
    return;
  }
  const lesson = course.curriculum[si].lessons[li];
  if(lesson.status==='lock'){showToast('fa-lock','Complete previous lessons to unlock');return;}
  stopLessonPlay();
  document.getElementById('ldBreadcrumb').innerHTML=`<a href="#" onclick="showPage('dashboard');setTopbar('Dashboard')">Dashboard</a><span class="sep">/</span><a href="#" onclick="openCourse(${courseId})">${course.breadTitle}</a><span class="sep">/</span><span class="current">${lesson.name}</span>`;
  document.getElementById('ldVideoBg').src=lesson.img;
  ldTotalSec=lesson.durSec;ldCurrentSec=Math.floor(ldTotalSec*0.44);
  updateLdTimeline();document.getElementById('ldDurTime').textContent=lesson.dur;
  document.getElementById('ldVideoSection').classList.remove('ld-playing');
  const flat=flatLessons(courseId),fIdx=flat.findIndex(f=>f.si===si&&f.li===li);
   updateDashboardUI(idx, fIdx); // Instantly update dashboard with the specific lesson
    api.post(`/api/set-active-course/${courseId}/`, {}).catch(() => {}); // Save to database
  document.getElementById('ldBadgeText').textContent=`LESSON ${fIdx+1} OF ${course.lessonsCount}`;
  document.getElementById('ldTitle').textContent=lesson.name;
  document.getElementById('ldDesc').textContent=LESSON_DESCS[lesson.name]||LESSON_DESCS.default;
  const notes=LESSON_NOTES[lesson.name]||LESSON_NOTES.default;
  document.getElementById('ldNoteList').innerHTML=notes.map(n=>`<div class="note-item"><div class="note-bullet"></div><span>${n}</span></div>`).join('');
  const resources=LESSON_RESOURCES[lesson.name]||LESSON_RESOURCES.default;
  document.getElementById('ldResourceList').innerHTML=resources.map(r=>{const cls=r.type==='ZIP'?'res-zip':'res-pdf';return `<div class="resource-item" onclick="showToast('fa-download','Downloading: ${r.name}')"><div class="res-icon ${cls}">${r.type}</div><div class="res-info"><div class="res-name">${r.name}</div><div class="res-size">${r.size}</div></div><button class="res-dl" onclick="event.stopPropagation();showToast('fa-download','Downloading: ${r.name}')"><i class="fa-solid fa-download"></i></button></div>`;}).join('');
  const card=document.getElementById('ldCompleteCard'),lbl=document.getElementById('ldCompleteLabel');
  (lesson.status==='done')?(card.classList.add('completed'),lbl.textContent='Completed!'):(card.classList.remove('completed'),lbl.textContent='Mark as complete');
  buildUpNext(courseId,si,li);buildDots(courseId,fIdx);
  document.getElementById('ldPrevBtn').disabled=fIdx===0;
  document.getElementById('ldNextBtn').disabled=fIdx===flat.length-1;
  showPage('lesson');setTopbar('Lesson');
}

function buildUpNext(courseId,si,li){
  const flat=flatLessons(courseId),current=flat.findIndex(f=>f.si===si&&f.li===li),upcoming=flat.slice(current+1,current+4);
  const container=document.getElementById('ldUpNextList');
  if(!upcoming.length){container.innerHTML=`<div style="padding:16px;font-size:13px;color:var(--text3);text-align:center"><i class="fa-solid fa-trophy" style="color:var(--gold);font-size:20px;display:block;margin-bottom:8px"></i>Last lesson!</div>`;return;}
  container.innerHTML=upcoming.map((l,i)=>{const locked=l.status==='lock';return `<div class="up-next-item${i===0?' active-next':''}" onclick="${locked?`showToast('fa-lock','Complete previous lessons to unlock')`:`openLesson(${courseId},${l.si},${l.li})`}"><div class="un-thumb"><img src="${l.img}" alt="${l.name}"/><div class="un-play-icon"><i class="fa-solid fa-${locked?'lock':'play'}" style="width:26px;height:26px;border-radius:50%;background:${locked?'var(--white10)':'var(--purple)'};display:flex;align-items:center;justify-content:center;color:${locked?'var(--text3)':'#fff'};font-size:9px"></i></div></div><div class="un-info"><div class="un-title">${l.name}</div><div class="un-dur">${l.dur}</div></div></div>`;}).join('');
}
function buildDots(courseId,currentFlatIdx){const flat=flatLessons(courseId),total=Math.min(flat.length,8);document.getElementById('ldDots').innerHTML=flat.slice(0,total).map((l,i)=>{const done=l.status==='done';return `<div class="ld-dot ${i===currentFlatIdx?'active':done?'done':''}" onclick="jumpDot(${courseId},${i})"></div>`;}).join('');}
function jumpDot(courseId,fIdx){const flat=flatLessons(courseId),l=flat[fIdx];openLesson(courseId,l.si,l.li);}
function lessonNav(dir){const flat=flatLessons(currentCourseIdx),fIdx=flat.findIndex(f=>f.si===currentSectionIdx&&f.li===currentLessonIdx),newIdx=fIdx+dir;if(newIdx<0||newIdx>=flat.length)return;const l=flat[newIdx];if(l.status==='lock'&&dir>0){showToast('fa-lock','Complete this lesson first');return;}openLesson(currentCourseIdx,l.si,l.li);}

/* Mark/unmark the current lesson as complete, unlock the next lesson,
   persist to the server, and refresh any views that show lesson status. */
function toggleComplete(){
  const idx = resolveCourseIndex(currentCourseIdx);
  const course = COURSES[idx];
  const card=document.getElementById('ldCompleteCard'), lbl=document.getElementById('ldCompleteLabel');
  if(!course) return;
  const lesson = course.curriculum?.[currentSectionIdx]?.lessons?.[currentLessonIdx];
  if(!lesson) return;

  const wasDone = lesson.status === 'done';

  if(wasDone){
    lesson.status = 'play';
    card.classList.remove('completed');
    lbl.textContent = 'Mark as complete';
    showToast('fa-arrow-rotate-left','Lesson marked as incomplete');
  } else {
    lesson.status = 'done';
    card.classList.add('completed');
    lbl.textContent = 'Completed!';
    showToast('fa-check','Lesson complete! Great work.');

    // Unlock the next lesson if it was locked
    const flat = flatLessons(currentCourseIdx);
    const fIdx = flat.findIndex(f=>f.si===currentSectionIdx && f.li===currentLessonIdx);
    const next = flat[fIdx+1];
    if(next){
      const nextLesson = course.curriculum[next.si].lessons[next.li];
      if(nextLesson.status === 'lock') nextLesson.status = 'play';
    }

    // Persist completion to the server
    if(lesson.id !== undefined){
      api.post(`/api/lessons/${lesson.id}/complete/`, {}).catch(err=>{
        console.error('Failed to save lesson completion', err);
        showToast('fa-exclamation-triangle','Could not save progress');
      });
    }
  }

  // Recompute course progress
  const flatAll = flatLessons(currentCourseIdx);
  const doneCount = flatAll.filter(l=>l.status==='done').length;
  course.lessonsCompleted = doneCount;
  course.progress = flatAll.length ? Math.round(doneCount/flatAll.length*100) : 0;
  course.status = course.progress===100 ? 'completed' : (course.progress>0 ? 'inprogress' : 'notstarted');

  // Refresh lesson-detail UI
  const flat = flatLessons(currentCourseIdx);
  const fIdx = flat.findIndex(f=>f.si===currentSectionIdx && f.li===currentLessonIdx);
  buildDots(currentCourseIdx,fIdx);
  buildUpNext(currentCourseIdx,currentSectionIdx,currentLessonIdx);
  document.getElementById('ldNextBtn').disabled = fIdx===flat.length-1;
  if(Array.isArray(course.curriculum)) buildAccordion(course.curriculum, currentCourseIdx);

  // Refresh other views if visible
  if(document.getElementById('page-mycourses')?.classList.contains('active') && typeof buildMyCourses==='function') buildMyCourses(typeof mcCurrentFilter!=='undefined'?mcCurrentFilter:'all', document.getElementById('mcSearchInput')?.value||'');
  if(document.getElementById('page-lessons')?.classList.contains('active') && typeof buildLessonsLibrary==='function') buildLessonsLibrary(typeof llCurrentFilter!=='undefined'?llCurrentFilter:'all', document.getElementById('llSearchInput')?.value||'', typeof llCurrentSort!=='undefined'?llCurrentSort:'default');
  if(typeof rebuildDashCurriculum==='function') rebuildDashCurriculum();
}

/* ═══════════════════════════════════════════════════════
   VIDEO PLAYERS
═══════════════════════════════════════════════════════ */
function toggleLessonPlay(){ldIsPlaying=!ldIsPlaying;const section=document.getElementById('ldVideoSection'),icon=document.getElementById('ldPlayIcon'),ci=document.getElementById('ldCtrlIcon');if(ldIsPlaying){section.classList.add('ld-playing');icon.className='fa-solid fa-pause';ci.className='fa-solid fa-pause';ldTimer=setInterval(()=>{ldCurrentSec++;if(ldCurrentSec>=ldTotalSec){ldCurrentSec=ldTotalSec;stopLessonPlay();showToast('fa-check','Lesson finished!');setTimeout(toggleComplete,800);}updateLdTimeline();},300);}else stopLessonPlay();}
function stopLessonPlay(){clearInterval(ldTimer);ldIsPlaying=false;const s=document.getElementById('ldVideoSection');if(s)s.classList.remove('ld-playing');const i=document.getElementById('ldPlayIcon'),ci=document.getElementById('ldCtrlIcon');if(i)i.className='fa-solid fa-play';if(ci)ci.className='fa-solid fa-play';}
function updateLdTimeline(){document.getElementById('ldBarFill').style.width=(ldCurrentSec/ldTotalSec*100)+'%';document.getElementById('ldCurrTime').textContent=fmtTime(ldCurrentSec);}
function ldSeek(e){const t=document.getElementById('ldBarFill').parentElement,r=t.getBoundingClientRect();ldCurrentSec=Math.floor(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*ldTotalSec);updateLdTimeline();}
function ldSkip(s){ldCurrentSec=Math.max(0,Math.min(ldTotalSec,ldCurrentSec+s));updateLdTimeline();}
function toggleMute(){ldMuted=!ldMuted;document.getElementById('ldVolIcon').className=ldMuted?'fa-solid fa-volume-xmark':'fa-solid fa-volume-high';}
function updateVolume(s){const v=+s.value;document.getElementById('ldVolIcon').className=v===0?'fa-solid fa-volume-xmark':v<50?'fa-solid fa-volume-low':'fa-solid fa-volume-high';}
function changeSpeed(s){showToast('fa-bolt',`Playback speed: ${s.value}×`);}
function toggleDashPlay(){dashIsPlaying=!dashIsPlaying;const icon=document.getElementById('dashPlayIcon'),btn=document.getElementById('dashBigPlay');if(dashIsPlaying){icon.className='fa-solid fa-pause';btn.style.background='var(--teal)';showToast('fa-play','Playing: Working with Shadows and Contrast');dashTimer=setInterval(()=>{dashCurrSec++;if(dashCurrSec>=dashTotalSec){clearInterval(dashTimer);dashIsPlaying=false;icon.className='fa-solid fa-play';btn.style.background='var(--purple)';showToast('fa-check','Lesson completed!');}updateDashTimeline();},300);}else{clearInterval(dashTimer);icon.className='fa-solid fa-play';btn.style.background='var(--purple)';}}
function dashSeek(e){e.stopPropagation();const b=e.currentTarget,r=b.getBoundingClientRect();dashCurrSec=Math.floor(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*dashTotalSec);updateDashTimeline();}
function updateDashTimeline(){document.getElementById('dashTimelineFill').style.width=(dashCurrSec/dashTotalSec*100)+'%';document.getElementById('dashCurrentTime').textContent=fmtTime(dashCurrSec);}

/* ═══════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════ */
function fmtTime(s){return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;}
function handleSearch(inp){const q=inp.value.toLowerCase();document.querySelectorAll('.dash-course-card').forEach(c=>{c.style.display=!q||c.querySelector('.course-title-text').textContent.toLowerCase().includes(q)?'':'none';});}
function animateCounters(){
  document.querySelectorAll('#page-dashboard .count-up').forEach(el=>{
    const t=+el.dataset.target;
    el.textContent='0';
    let c=0; const d=1500,s=16;
    const step=t/(d/s);
    const tm=setInterval(()=>{
      c=Math.min(c+step,t);
      el.textContent=Math.floor(c);
      if(c>=t){el.textContent=t;clearInterval(tm);}
    },s);
  });
}
function animateBars(){
  document.querySelectorAll('#page-dashboard [data-target]').forEach(el=>{
    if(el.classList.contains('count-up'))return;
    el.style.width='0%';
    setTimeout(()=>el.style.width=el.dataset.target+'%',300);
  });
}
function animateMCCounters(){document.querySelectorAll('#page-mycourses .mc-stat-number').forEach(el=>{const t=+el.textContent||0;el.textContent='0';let c=0;const d=1200,s=16,tm=setInterval(()=>{c=Math.min(c+t/(d/s),t);el.textContent=Math.floor(c);if(c>=t)clearInterval(tm);},s);});document.querySelectorAll('#page-mycourses .mc-fill').forEach(el=>{const w=el.style.width;el.style.width='0%';setTimeout(()=>el.style.width=w,300);});}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('overlay').classList.toggle('active');}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').classList.remove('active');}
function showToast(icon,msg){const c=document.getElementById('toastContainer'),t=document.createElement('div');t.className='toast';t.innerHTML=`<span class="toast-icon"><i class="fa-solid ${icon}"></i></span><span class="toast-msg">${msg}</span>`;c.appendChild(t);setTimeout(()=>{t.classList.add('removing');setTimeout(()=>t.remove(),300);},3000);}

/* ═══════════════════════════════════════════════════════
   PROGRESS PAGE
═══════════════════════════════════════════════════════ */
function initProgressPage(){
  animateProgCounters();
  buildProgCourses();
  buildCertificates();
 
}

function animateProgCounters(){
  document.querySelectorAll('.prog-count').forEach(el=>{
    const t=+el.dataset.target,d=1600,s=16;let c=0;
    const tm=setInterval(()=>{c=Math.min(c+t/(d/s),t);el.textContent=Math.floor(c).toLocaleString();if(c>=t)clearInterval(tm);},s);
  });
}
const COURSE_ICONS=[
  {icon:'fa-video',cls:'pci-purple',fill:'pcf-purple',color:'var(--purple-light)'},
  {icon:'fa-palette',cls:'pci-teal',fill:'pcf-teal',color:'var(--teal)'},
  {icon:'fa-clapperboard',cls:'pci-blue',fill:'pcf-blue',color:'var(--directing)'},
  {icon:'fa-headphones',cls:'pci-pink',fill:'pcf-pink',color:'var(--sound)'},
  {icon:'fa-sun',cls:'pci-green',fill:'pcf-green',color:'#22c55e'},
  {icon:'fa-film',cls:'pci-orange',fill:'pcf-orange',color:'#f97316'},
];

function buildProgCourses(){
  const list=document.getElementById('progCourseList');if(!list)return;
  list.innerHTML=COURSES.map((c,i)=>{
    const ic=COURSE_ICONS[i%COURSE_ICONS.length];
    const lessonsLeft=c.totalLessons-parseInt(c.lessonsCompleted||0);
    return `<div class="prog-course-row" onclick="openCourse(${c.id})">
      <div class="prog-course-icon ${ic.cls}"><i class="fa-solid ${ic.icon}"></i></div>
      <div class="prog-course-info">
        <div class="prog-course-name">${c.title}</div>
        <div class="prog-course-meta">
          <span><i class="fa-solid fa-graduation-cap"></i>${c.instructor}</span>
          <span><i class="fa-regular fa-circle-check"></i>${c.lessonsCompleted||0}/${c.totalLessons} lessons</span>
          <span><i class="fa-regular fa-clock"></i>${c.duration}</span>
          <span style="color:${c.progress===100?'var(--teal)':'var(--text3)'}">${c.progress===100?'✓ Completed':c.progress===0?'Not started':'In progress'}</span>
        </div>
        <div class="prog-course-bar-wrap">
          <div class="prog-course-bar"><div class="prog-course-fill ${ic.fill}" id="pcf-${i}" style="width:0%"></div></div>
          <div class="prog-course-pct" style="color:${ic.color}">${c.progress}%</div>
        </div>
      </div>
    </div>`;
  }).join('');
  // animate bars
  setTimeout(()=>{
    COURSES.forEach((_,i)=>{
      const el=document.getElementById('pcf-'+i);
      if(el) el.style.width=COURSES[i].progress+'%';
    });
  },200);
}

const CERTIFICATES=[
  {icon:'fa-video',name:'Mastering Camera Movement',meta:'Issued May 2024 · Sarah Chen · 8h 30m',earned:true},
  {icon:'fa-palette',name:'Advanced Color Grading',meta:'Issued Apr 2024 · Marcus Rodriguez · 6h 45m',earned:true},
  {icon:'fa-clapperboard',name:'Scene Composition & Blocking',meta:'Issued Mar 2024 · Emily Watson · 5h 20m',earned:true},
  {icon:'fa-headphones',name:'Audio for Film Production',meta:'Issued Feb 2024 · Lisa Martinez · 7h 40m',earned:true},
  {icon:'fa-sun',name:'Natural Light Cinematography',meta:'In progress — 15% complete',earned:false},
  {icon:'fa-film',name:'Narrative Editing Fundamentals',meta:'In progress — 30% complete',earned:false},
];

function buildCertificates(){
  const grid=document.getElementById('progCertsGrid');if(!grid)return;
  grid.innerHTML=CERTIFICATES.map(c=>`
    <div class="prog-cert-card${c.earned?'':' locked'}">
      <div class="prog-cert-shine"></div>
      <div class="prog-cert-icon ${c.earned?'earned':'locked-ico'}">
        <i class="fa-solid ${c.icon}"></i>
      </div>
      <div class="prog-cert-info">
        <div class="prog-cert-name">${c.name}</div>
        <div class="prog-cert-meta">${c.meta}</div>
        <div class="prog-cert-tag ${c.earned?'earned-tag':'locked-tag'}">
          ${c.earned?'<i class="fa-solid fa-certificate"></i> Certificate Issued':'<i class="fa-solid fa-lock"></i> Not yet earned'}
        </div>
      </div>
    </div>
  `).join('');
}



/* ═══════════════════════════════════════════════════════
   COMMUNITY PAGE
═══════════════════════════════════════════════════════ */
const COMM_POSTS = [
  {id:0, name:'Sarah Chen', initials:'SC', av:'av-purple', role:'instructor', time:'2 hours ago', trending:true,
   title:'New Tutorial: Advanced Camera Rigging Techniques',
   body:'Just uploaded a comprehensive guide on building custom camera rigs for independent filmmakers. Check it out and let me know what you think!',
   category:'Cinematography', catClass:'tag-cinemato', likes:45, comments:32, liked:false},
  {id:1, name:'Emily Watson', initials:'EW', av:'av-blue', role:'instructor', time:'12 hours ago', trending:false,
   title:'Tips for directing non-professional actors',
   body:'After 15 years of directing, here are my top 5 techniques for getting authentic performances from first-time actors…',
   category:'Directing', catClass:'tag-directing', likes:67, comments:19, liked:false},
  {id:2, name:'Marcus Rodriguez', initials:'MR', av:'av-teal', role:'instructor', time:'1 day ago', trending:true,
   title:'Color grading workflow in DaVinci Resolve 19',
   body:'The new AI-assisted tools are game-changers. Here\'s my node-based workflow for achieving a filmic look straight out of the box.',
   category:'Editing', catClass:'tag-editing', likes:92, comments:41, liked:false},
  {id:3, name:'David Kim', initials:'DK', av:'av-green', role:'member', time:'2 days ago', trending:false,
   title:'Question: Best way to learn audio sync for documentaries?',
   body:'I\'m working on my first documentary and struggling with syncing my boom mic recordings to the camera footage in post. Any tips?',
   category:'Sound Design', catClass:'tag-sound', likes:24, comments:15, liked:false},
  {id:4, name:'Lisa Martinez', initials:'LM', av:'av-pink', role:'member', time:'3 days ago', trending:false,
   title:'Sharing my short film — feedback welcome!',
   body:'After 6 months on this platform, I finally completed my short film using everything I\'ve learned here. Would love constructive feedback from the community.',
   category:'Cinematography', catClass:'tag-cinemato', likes:83, comments:27, liked:false},
  {id:5, name:'James Wilson', initials:'JW', av:'av-orange', role:'member', time:'4 days ago', trending:false,
   title:'Handheld vs gimbal — when to choose which?',
   body:'I\'ve been experimenting with both styles. Handheld gives raw energy but a gimbal offers polish. Here\'s what I\'ve figured out about choosing…',
   category:'Cinematography', catClass:'tag-cinemato', likes:56, comments:22, liked:false},
];
let commCurrentFilter='all', commLiked=new Set(), commLocalPosts=[];

function initCommunityPage(){
  buildCommFeed(commCurrentFilter);
  animateCommCounters();
}

function animateCommCounters(){
  document.querySelectorAll('#page-community .comm-count').forEach(el=>{
    const t=+el.dataset.target,d=1400,s=16;let c=0;
    const tm=setInterval(()=>{c=Math.min(c+t/(d/s),t);el.textContent=Math.floor(c).toLocaleString();if(c>=t)clearInterval(tm);},s);
  });
}

function commFilter(f,btn){
  commCurrentFilter=f;
  document.querySelectorAll('.comm-tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  buildCommFeed(f);
}

function buildCommFeed(filter){
  const feed=document.getElementById('commFeed');if(!feed)return;
  let posts=[...commLocalPosts,...COMM_POSTS];
  if(filter==='trending') posts=posts.filter(p=>p.trending);
  if(filter==='instructor') posts=posts.filter(p=>p.role==='instructor');
  if(filter==='questions') posts=posts.filter(p=>p.title.toLowerCase().includes('?')||p.title.toLowerCase().includes('question'));
  feed.innerHTML=posts.map(p=>renderPost(p)).join('');
}

function renderPost(p){
  const isLiked=commLiked.has(p.id);
  return `<div class="comm-post" id="comm-post-${p.id}">
    <div class="comm-post-header">
      <div class="comm-post-avatar ${p.av}">${p.initials}</div>
      <div class="comm-post-meta">
        <div class="comm-post-top">
          <span class="comm-post-name">${p.name}</span>
          ${p.role==='instructor'?'<span class="comm-instructor-tag">Instructor</span>':''}
          <span class="comm-post-time">· ${p.time}</span>
          ${p.trending?'<span class="comm-trending-tag"><i class="fa-solid fa-arrow-trend-up"></i> Trending</span>':''}
        </div>
      </div>
    </div>
    <div class="comm-post-title">${p.title}</div>
    <div class="comm-post-body">${p.body}</div>
    <div class="comm-post-footer">
      <span class="comm-cat-tag ${p.catClass}" style="text-transform:uppercase;letter-spacing:1px;font-size:9px;font-weight:700">${p.category}</span>
      <button class="comm-action-btn${isLiked?' liked':''}" onclick="toggleLike(${p.id},this)">
        <i class="fa-${isLiked?'solid':'regular'} fa-heart"></i>
        <span id="comm-likes-${p.id}">${p.likes}</span>
      </button>
      <button class="comm-action-btn"">
        <i class="fa-regular fa-comment"></i>
        <span>${p.comments}</span>
      </button>
      <div class="comm-action-spacer"></div>
      <button class="comm-share-btn" onclick="showToast('fa-link','Link copied to clipboard!')">
        <i class="fa-solid fa-share-nodes"></i> Share
      </button>
    </div>
  </div>`;
}

function toggleLike(postId,btn){
  const post=[...commLocalPosts,...COMM_POSTS].find(p=>p.id===postId);if(!post)return;
  const likeEl=document.getElementById('comm-likes-'+postId);
  if(commLiked.has(postId)){commLiked.delete(postId);post.likes--;btn.classList.remove('liked');btn.querySelector('i').className='fa-regular fa-heart';}
  else{commLiked.add(postId);post.likes++;btn.classList.add('liked');btn.querySelector('i').className='fa-solid fa-heart';showToast('fa-heart','Post liked!');}
  if(likeEl) likeEl.textContent=post.likes;
}

function submitPost(){
  const text=document.getElementById('commComposeText').value.trim();
  const cat=document.getElementById('commCatSelect').value;
  if(!text){showToast('fa-triangle-exclamation','Please write something first!');return;}
  const catLabels={cinematography:'Cinematography',editing:'Editing',directing:'Directing',sound:'Sound Design',general:'General','':'General'};
  const catClasses={cinematography:'tag-cinemato',editing:'tag-editing',directing:'tag-directing',sound:'tag-sound',general:'tag-directing','':'tag-directing'};
  const newPost={id:Date.now(),name:CURRENT_USER.name,initials:CURRENT_USER.initials || CURRENT_USER.name.substring(0, 2).toUpperCase(),
   av:'av-purple',role:'member',time:'Just now',trending:false,
    title:text.length>80?text.substring(0,80)+'…':text,body:text,
    category:catLabels[cat],catClass:catClasses[cat],likes:0,comments:0,liked:false};
  commLocalPosts.unshift(newPost);
  document.getElementById('commComposeText').value='';
  document.getElementById('commCatSelect').value='';
  buildCommFeed(commCurrentFilter);
  showToast('fa-check','Post published successfully!');
}

/* ═══════════════════════════════════════════════════════
   DOWNLOADS PAGE
═══════════════════════════════════════════════════════ */
const DL_FILES=[
  {name:'Cinematography Lighting Guide.pdf',course:'Mastering Camera Movement',size:'2.4 MB',date:'May 28, 2024',type:'pdf',cat:'Cinematography',catClass:'tag-cinemato'},
  {name:'Color Grading LUTs Pack.zip',course:'Advanced Color Grading',size:'145 MB',date:'May 27, 2024',type:'zip',cat:'Editing',catClass:'tag-editing'},
  {name:'Camera Movement Reference Videos.zip',course:'Mastering Camera Movement',size:'580 MB',date:'May 25, 2024',type:'zip',cat:'Cinematography',catClass:'tag-cinemato'},
  {name:'Blocking Diagrams Template.psd',course:'Scene Composition & Blocking',size:'12.8 MB',date:'May 24, 2024',type:'psd',cat:'Directing',catClass:'tag-directing'},
  {name:'Audio Mixing Cheat Sheet.pdf',course:'Audio for Film Production',size:'1.2 MB',date:'May 22, 2024',type:'pdf',cat:'Sound Design',catClass:'tag-sound'},
  {name:'Lens Comparison Chart.pdf',course:'Mastering Camera Movement',size:'3.6 MB',date:'May 20, 2024',type:'pdf',cat:'Cinematography',catClass:'tag-cinemato'},
  {name:'Editing Keyboard Shortcuts.pdf',course:'Narrative Editing Fundamentals',size:'890 KB',date:'May 18, 2024',type:'pdf',cat:'Editing',catClass:'tag-editing'},
  {name:'Natural Light Setup Guide.pdf',course:'Natural Light Cinematography',size:'5.2 MB',date:'May 15, 2024',type:'pdf',cat:'Cinematography',catClass:'tag-cinemato'},
];
const DL_ICONS={pdf:{cls:'dl-icon-pdf',icon:'fa-regular fa-file-pdf'},zip:{cls:'dl-icon-zip',icon:'fa-regular fa-file-zipper'},psd:{cls:'dl-icon-psd',icon:'fa-regular fa-file-image'},video:{cls:'dl-icon-video',icon:'fa-regular fa-file-video'},doc:{cls:'dl-icon-doc',icon:'fa-regular fa-file-lines'}};
let dlCurrentFilter='all',dlCurrentSearch='';
function initDownloadsPage(){buildDlList();animateDlCounters();}
function animateDlCounters(){
  document.querySelectorAll('#page-downloads .dl-count').forEach(el=>{
    const t=+el.dataset.target;el.textContent='0';let c=0;
    const tm=setInterval(()=>{c=Math.min(c+t/60,t);el.textContent=Math.floor(c);if(c>=t){el.textContent=t;clearInterval(tm);}},16);
  });
  const sizeEl=document.getElementById('dlSizeNum');
  if(sizeEl){let c=0,t=1974.7;const tm=setInterval(()=>{c=Math.min(c+t/60,t);sizeEl.textContent=c.toFixed(1);if(c>=t){sizeEl.textContent=t.toFixed(1);clearInterval(tm);}},16);}
}
function dlFilter(type,btn){
  dlCurrentFilter=type;
  document.querySelectorAll('.dl-tab').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  buildDlList();
}
function dlSearch(val){dlCurrentSearch=val.toLowerCase();buildDlList();}
function buildDlList(){
  const list=document.getElementById('dlList');if(!list)return;
  const files=DL_FILES.filter(f=>{
    const mt=dlCurrentFilter==='all'||(dlCurrentFilter==='pdf'&&f.type==='pdf')||(dlCurrentFilter==='zip'&&f.type==='zip');
    const ms=!dlCurrentSearch||f.name.toLowerCase().includes(dlCurrentSearch)||f.course.toLowerCase().includes(dlCurrentSearch);
    return mt&&ms;
  });
  if(!files.length){list.innerHTML=`<div class="dl-empty"><i class="fa-solid fa-folder-open"></i><p>No files match your search.</p></div>`;return;}
  list.innerHTML=files.map((f,i)=>{
    const ic=DL_ICONS[f.type]||DL_ICONS.doc;
    return `<div class="dl-row" style="animation-delay:${i*0.06}s">
      <div class="dl-file-icon ${ic.cls}"><i class="${ic.icon}"></i></div>
      <div class="dl-file-info">
        <div class="dl-file-name">${f.name}</div>
        <div class="dl-file-meta">
          <span><i class="fa-solid fa-book-open"></i>&nbsp;${f.course}</span>
          <div class="dot"></div>
          <span><i class="fa-solid fa-database"></i>&nbsp;${f.size}</span>
          <div class="dot"></div>
          <span><i class="fa-regular fa-calendar"></i>&nbsp;${f.date}</span>
        </div>
      </div>
      <span class="dl-cat-tag ${f.catClass}">${f.cat}</span>
      <button class="dl-btn" title="Download ${f.name}" onclick="handleDownload('${f.name}')"><i class="fa-solid fa-download"></i></button>
    </div>`;
  }).join('');
}
function handleDownload(name){showToast('fa-download',`Downloading ${name}…`);}

  // const pg=document.querySelector('.page.active')?.id;
  // if(e.code==='Space'&&e.target===document.body){e.preventDefault();if(pg==='page-lesson')toggleLessonPlay();else if(pg==='page-dashboard')toggleDashPlay();}
  // if(e.code==='ArrowRight'&&pg==='page-lesson')ldSkip(10);
  // if(e.code==='ArrowLeft'&&pg==='page-lesson')ldSkip(-10);
  // if(e.code==='Escape'){closeNotif();if(pg==='page-lesson'){stopLessonPlay();openCourse(currentCourseIdx);}else if(pg==='page-course'){showPage(courseOpenedFrom);setTopbar(courseOpenedFrom==='mycourses'?'My Courses':courseOpenedFrom==='lessons'?'Lessons':'Dashboard');}else if(pg==='page-mycourses'||pg==='page-lessons'){showPage('dashboard');setTopbar('Dashboard');}}



  /* ═══════════════════════════════════════════════════════
   Settings Page
═══════════════════════════════════════════════════════ */
function switchSettingsTab(event, panelId) {
  // Deactivate all matching tab buttons
  const buttons = document.querySelectorAll('.s-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Deactivate all matching visual layout panels
  const panels = document.querySelectorAll('.s-panel');
  panels.forEach(p => p.classList.remove('active'));
  
  // Activate selected active UI components
  event.currentTarget.classList.add('active');
  const targetPanel = document.getElementById(panelId);
  if(targetPanel) {
    targetPanel.classList.add('active');
  }
}

// Optional: Client-side avatar instant preview handler
function previewAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const avatarImg = document.getElementById('settings-avatar-img');
      if(avatarImg) avatarImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

/* Rebuild the dashboard's "Course Curriculum" lesson list from live COURSES data.
   This replaces the static Django-rendered list so completions update it instantly. */
function rebuildDashCurriculum(){
  const list = document.getElementById('dashLessonList');
  if(!list) return;
  // Find the first enrolled course with curriculum
  const course = COURSES.find(c => c.is_enrolled && Array.isArray(c.curriculum) && c.curriculum.length);
  if(!course){ list.innerHTML=`<div class="lesson-item no-lessons"><div class="lesson-info"><div class="lesson-name">No lessons available yet</div></div></div>`; return; }
  let html = '';
  course.curriculum.forEach(sec=>{
    if(sec.title) html += `<div class="curriculum-section-title">${sec.title}</div>`;
    (sec.lessons||[]).forEach(lesson=>{
      const si = lesson.si, li = lesson.li;
      const isDone = lesson.status==='done', isPlay = lesson.status==='play', isLock = lesson.status==='lock';
      const clickFn = isLock ? `showToast('fa-lock','Complete previous lessons first')` : `openLesson(${course.id},${si},${li})`;
      html += `<div class="lesson-item ${isPlay?'active':''} ${isDone?'completed':''}" onclick="${clickFn}">
        <div class="lesson-status ${isDone?'ls-done':isPlay?'ls-active':'ls-locked'}">${isDone?'<i class="fa-solid fa-check"></i>':isPlay?'<i class="fa-solid fa-play"></i>':'<i class="fa-solid fa-lock" style="font-size:9px"></i>'}</div>
        <div class="lesson-info"><div class="lesson-name">${lesson.name||lesson.title||'Untitled'}</div><div class="lesson-dur">${lesson.dur||lesson.duration||'0:00'}</div></div>
        ${isDone?'<i class="fa-solid fa-check" style="color:var(--teal);font-size:12px"></i>':''}
      </div>`;
    });
  });
  list.innerHTML = html;

  // Sync the dashboard course progress bar/label with live data
  document.querySelectorAll('#page-dashboard .course-fill[data-target]').forEach(el=>{
    el.style.width = el.dataset.target + '%';
  });
  const enrolled = COURSES.filter(c=>c.is_enrolled);
  document.querySelectorAll('#page-dashboard .dash-course-card').forEach((card,i)=>{
    const c = enrolled[i]; if(!c) return;
    const fill = card.querySelector('.course-fill');
    const label = card.querySelector('.course-progress-label span:last-child');
    if(fill){ fill.dataset.target = c.progress; fill.style.width = c.progress+'%'; }
    if(label) label.textContent = c.progress+'%';
  });
}

function updateDashboardUI(courseIdx, flatLessonIdx = null) {
    const course = COURSES[courseIdx];
    if (!course) return;

    // Update ALL course cards to reflect the active course
    const allCards = document.querySelectorAll('.mc-card');
    allCards.forEach((card, index) => {
        const courseId = parseInt(card.getAttribute('data-course-id') || card.onclick?.toString().match(/\d+/)?.[0]);
        
        if (courseId === course.id) {
            // Highlight this card as active
            card.classList.add('active-course');
            card.style.border = '2px solid var(--purple)';
            card.style.boxShadow = '0 0 20px rgba(108, 63, 255, 0.3)';
        } else {
            // Reset other cards
            card.classList.remove('active-course');
            card.style.border = '';
            card.style.boxShadow = '';
        }
        
        // Update the course card's progress dynamically
        const titleEl = card.querySelector('.mc-card-title');
        const thumbEl = card.querySelector('.mc-thumb');
        const progressFill = card.querySelector('.mc-fill');
        const progressPct = card.querySelector('.mc-progress-row span:last-child');
        
        if (titleEl && course.title) titleEl.textContent = course.title;
        if (thumbEl && course.thumb) thumbEl.src = course.thumb;
        if (progressFill) {
            progressFill.style.width = course.progress + '%';
            if (course.progress > 70) progressFill.classList.add('teal');
        }
        if (progressPct) progressPct.textContent = course.progress + '%';
    });

    // Update "Currently Watching" section if it exists
    const cwThumb = document.querySelector('.dash-cw-thumb img');
    const cwTitle = document.querySelector('.dash-cw-title');
    const cwDuration = document.querySelector('.dash-cw-duration');
    
    let lesson = null;
    const flat = flatLessons(courseIdx);
    
    if (flatLessonIdx !== null && flat[flatLessonIdx]) {
        lesson = flat[flatLessonIdx];
    } else {
        // Fallback to first incomplete lesson
        lesson = flat.find(l => l.status !== 'done') || flat[0];
    }

    if (lesson) {
        if (cwThumb) cwThumb.src = lesson.img || course.thumb;
        if (cwTitle) cwTitle.textContent = lesson.name;
        if (cwDuration) cwDuration.textContent = lesson.dur + ' remaining';
    } else if (course.thumb) {
        if (cwThumb) cwThumb.src = course.thumb;
        if (cwTitle) cwTitle.textContent = course.title;
        if (cwDuration) cwDuration.textContent = 'Start learning';
    }

    // Update Course Curriculum container dynamically
    const curriculumContainer = document.getElementById('dash-curriculum-container');
    if (curriculumContainer && course.curriculum) {
        let html = '';
        course.curriculum.forEach((sec, si) => {
            html += `<div class="curriculum-section" style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 12px; color: var(--text1); font-size: 16px; font-weight: 600;">${sec.title}</h4>
                        <div class="curriculum-lessons">`;
            
            sec.lessons.forEach((l, li) => {
                let iconClass = 'fa-lock';
                let iconColor = 'var(--text3)';
                if (l.status === 'done') { iconClass = 'fa-check'; iconColor = 'var(--teal)'; }
                else if (l.status === 'play') { iconClass = 'fa-play'; iconColor = 'var(--purple)'; }
                
                const clickAction = l.status === 'lock' 
                    ? `showToast('fa-lock','Complete previous lessons to unlock')` 
                    : `openLesson(${course.id}, ${si}, ${li})`;

                html += `<div class="curriculum-lesson-item" style="display: flex; align-items: center; padding: 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s; margin-bottom: 4px;" 
                             onmouseover="this.style.background='var(--white05)'" 
                             onmouseout="this.style.background='transparent'"
                             onclick="${clickAction}">
                            <i class="fa-solid ${iconClass}" style="color:${iconColor}; margin-right: 12px; width: 16px; text-align: center; ${l.status === 'play' ? 'font-size: 10px;' : l.status === 'lock' ? 'font-size: 12px;' : ''}"></i>
                            <span class="lesson-name" style="flex: 1; color: var(--text2); font-size: 14px;">${l.name}</span>
                            <span class="lesson-dur" style="color: var(--text3); font-size: 12px; margin-left: 10px;">${l.dur}</span>
                         </div>`;
            });
            html += `</div></div>`;
        });
        curriculumContainer.innerHTML = html;
    }
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
window.addEventListener('load',async()=>{
  await loadCourses();       // ← fetch real courses on first load
  rebuildDashCurriculum();   // populate dashboard curriculum from live data
  if (document.getElementById('page-mycourses')?.classList.contains('active') && typeof buildMyCourses==='function') {
    buildMyCourses(mcCurrentFilter, '');
    if(typeof animateMCCounters==='function') setTimeout(animateMCCounters, 200);
  }
  updateDashTimeline();
  animateBars();
  // Stat cards have animate-up with delays up to 0.32s + 0.5s duration = ~850ms
  // Start counters AFTER the cards have faded in so the animation is visible
  setTimeout(animateCounters, 10);
});