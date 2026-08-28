// Fill these in before sending. Everything on the page reads from here.
export const invite = {
  her: "Saray",
  him: "Jose",
  date: "2026-08-28",
  time: "20:00",
  pickupTime: "19:30",
  city: "",
  restaurant: "Spezia",
  address: "",
  wear: "Whatever you feel best in.",
  // Swap this for one small memory only the two of you would understand. One is enough.
  note: "I know we see each other every day. I still want a whole evening where the only plan is you.",
  durationMinutes: 150,
};

export type Invite = typeof invite;

export const when = new Date(`${invite.date}T${invite.time}`);
export const pickup = new Date(`${invite.date}T${invite.pickupTime}`);

export const longDate = when.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export function relativeDay(d: Date, now = new Date()) {
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(d) - day(now)) / 86_400_000);
  if (diff === 0) return "Tonight";
  if (diff === 1) return "Tomorrow night";
  return `On ${d.toLocaleDateString("en-US", { weekday: "long" })} night`;
}

export function clock(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function stamp(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

export const calendarUrl = (() => {
  const end = new Date(when.getTime() + invite.durationMinutes * 60_000);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `Dinner with ${invite.him}`,
    dates: `${stamp(when)}/${stamp(end)}`,
    details: `${invite.restaurant}. We leave home at ${clock(pickup)}.`,
    location: [invite.restaurant, invite.address].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
})();

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  [invite.restaurant, invite.address].filter(Boolean).join(", "),
)}`;

