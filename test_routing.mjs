// Test the EXACT routing logic from index.html against real device user-agents.
const IOS_URL = "https://apps.apple.com/in/app/spinny-circle/id6755675833";
const PLAY_URL = "https://play.google.com/store/apps/details?id=com.spinny.circle.prod";

function route(ua, maxTouchPoints = 0) {
  const isAndroid = /android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1);
  return isAndroid ? PLAY_URL : (isIOS ? IOS_URL : null); // null => desktop landing
}

const cases = [
  // [label, userAgent, maxTouchPoints, expected]
  ["iPhone Safari (iOS 17)", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1", 5, IOS_URL],
  ["iPhone Chrome", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0 Mobile/15E148 Safari/604.1", 5, IOS_URL],
  ["iPad (old UA)", "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1", 5, IOS_URL],
  ["iPadOS 13+ (reports as Mac + touch)", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15", 5, IOS_URL],
  ["Android Chrome (Pixel)", "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36", 5, PLAY_URL],
  ["Samsung Galaxy Chrome", "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36", 5, PLAY_URL],
  ["Android Samsung Internet", "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36", 5, PLAY_URL],
  ["MIUI/Xiaomi Android", "Mozilla/5.0 (Linux; U; Android 13; en-in; 2201116SG Build/TKQ1) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0 Mobile Safari/537.36 XiaoMi/MiuiBrowser/17.0", 5, PLAY_URL],
  ["Desktop Chrome (Windows)", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", 0, null],
  ["Desktop Safari (Mac, no touch)", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15", 0, null],
  ["Desktop Firefox (Linux)", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0", 0, null],
];

let pass = 0;
for (const [label, ua, mtp, expected] of cases) {
  const got = route(ua, mtp);
  const ok = got === expected;
  if (ok) pass++;
  const name = expected === IOS_URL ? "App Store" : expected === PLAY_URL ? "Play Store" : "Desktop landing";
  const gotName = got === IOS_URL ? "App Store" : got === PLAY_URL ? "Play Store" : "Desktop landing";
  console.log(`${ok ? "PASS" : "FAIL"}  ${label.padEnd(38)} -> ${gotName}${ok ? "" : `  (expected ${name})`}`);
}
console.log(`\n${pass}/${cases.length} passed`);
process.exit(pass === cases.length ? 0 : 1);
