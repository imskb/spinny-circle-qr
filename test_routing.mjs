// Test the EXACT routing logic from index.html against real device user-agents.
const IOS_URL = "https://apps.apple.com/in/app/spinny-circle/id6755675833";
const PLAY_URL = "https://play.google.com/store/apps/details?id=com.spinny.circle.prod";

function route(ua, touch = 0, uadPlatformRaw = "") {
  const uadPlatform = uadPlatformRaw.toLowerCase();
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && touch > 1);
  const isAndroid = /android/i.test(ua) || uadPlatform === "android";
  const isKnownDesktop = /Windows|Win64|Macintosh|CrOS/i.test(ua) ||
    ["windows", "macos", "chromeos", "chrome os"].indexOf(uadPlatform) !== -1;
  const likelyAndroidTablet = !isIOS && !isAndroid && !isKnownDesktop && touch > 0;
  return isIOS ? IOS_URL : ((isAndroid || likelyAndroidTablet) ? PLAY_URL : null);
}

const cases = [
  // [label, ua, touch, uadPlatform, expected]
  ["iPhone Safari (iOS 17)", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1", 5, "", IOS_URL],
  ["iPhone Chrome", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0 Mobile/15E148 Safari/604.1", 5, "", IOS_URL],
  ["iPad (old UA)", "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1", 5, "", IOS_URL],
  ["iPadOS 13+ (reports as Mac + touch)", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15", 5, "", IOS_URL],
  ["Android Chrome (Pixel phone)", "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36", 5, "Android", PLAY_URL],
  ["Samsung Galaxy phone", "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36", 5, "Android", PLAY_URL],
  ["Xiaomi MIUI phone", "Mozilla/5.0 (Linux; U; Android 13; en-in; 2201116SG Build/TKQ1) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0 Mobile Safari/537.36 XiaoMi/MiuiBrowser/17.0", 5, "", PLAY_URL],
  // --- TABLET cases (the reported bug) ---
  ["Android TABLET (UA still has Android, no Mobile)", "Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", 5, "Android", PLAY_URL],
  ["Android TABLET desktop-mode (no 'android', Client Hints saves it)", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", 5, "Android", PLAY_URL],
  ["Android TABLET desktop-mode (no Client Hints -> touch heuristic)", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", 5, "", PLAY_URL],
  ["Amazon Fire tablet (Silk)", "Mozilla/5.0 (Linux; Android 9; KFMAWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/119.0 like Chrome/119.0 Safari/537.36", 5, "", PLAY_URL],
  // --- Desktops must NOT redirect ---
  ["Desktop Chrome (Windows)", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", 0, "Windows", null],
  ["Windows touch laptop (Surface)", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", 10, "Windows", null],
  ["Desktop Safari (Mac, no touch)", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15", 0, "", null],
  ["Desktop Firefox (Linux, no touch)", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0", 0, "", null],
  ["ChromeOS", "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", 0, "Chrome OS", null],
];

const name = (u) => u === IOS_URL ? "App Store" : u === PLAY_URL ? "Play Store" : "Desktop landing";
let pass = 0;
for (const [label, ua, touch, uad, expected] of cases) {
  const got = route(ua, touch, uad);
  const ok = got === expected;
  if (ok) pass++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label.padEnd(52)} -> ${name(got)}${ok ? "" : `  (expected ${name(expected)})`}`);
}
console.log(`\n${pass}/${cases.length} passed`);
process.exit(pass === cases.length ? 0 : 1);
