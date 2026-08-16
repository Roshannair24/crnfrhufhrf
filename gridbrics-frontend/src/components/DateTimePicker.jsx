import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * DateTimePicker
 * A self-contained React + Tailwind CSS date & time picker.
 * No external date library required (uses native Date).
 *
 * Props:
 *  - value:     Date | null            currently selected datetime (controlled)
 *  - onChange:  (date: Date) => void   called whenever the user confirms a change
 *  - minDate:   Date                   optional lower bound (dates before are disabled)
 *  - maxDate:   Date                   optional upper bound (dates after are disabled)
 *  - placeholder: string               shown when value is null
 *  - className: string                 extra classes for the trigger input wrapper
 *
 * Usage:
 *  const [dt, setDt] = useState(null);
 *  <DateTimePicker value={dt} onChange={setDt} />
 */

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function startOfDay(d) {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function clampDate(d, min, max) {
  if (min && d < startOfDay(min)) return false;
  if (max && d > startOfDay(max)) return false;
  return true;
}

function formatDateTime(d) {
  if (!d) return "";
  const datePart = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

function buildCalendarGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      outside: true,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), outside: false });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, outside: true });
    if (cells.length >= 42) break;
  }
  return cells;
}

export default function DateTimePicker({
  value = null,
  onChange = () => {},
  minDate,
  maxDate,
  placeholder = "Select date & time",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const [draft, setDraft] = useState(value || new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openPicker() {
    const base = value || new Date();
    setDraft(base);
    setViewDate(base);
    setOpen(true);
  }

  const cells = useMemo(() => buildCalendarGrid(viewDate), [viewDate]);

  const hour12 = draft.getHours() % 12 === 0 ? 12 : draft.getHours() % 12;
  const isPM = draft.getHours() >= 12;

  function selectDay(date) {
    if (!clampDate(date, minDate, maxDate)) return;
    const next = new Date(draft);
    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setDraft(next);
  }

  function updateHour(newHour12) {
    const next = new Date(draft);
    const pm = next.getHours() >= 12;
    let h = newHour12 % 12;
    if (pm) h += 12;
    next.setHours(h);
    setDraft(next);
  }

  function updateMinute(minute) {
    const next = new Date(draft);
    next.setMinutes(minute);
    setDraft(next);
  }

  function togglePeriod(period) {
    const next = new Date(draft);
    let h = next.getHours() % 12;
    if (period === "PM") h += 12;
    next.setHours(h);
    setDraft(next);
  }

  function goToMonth(offset) {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  }

  function applyNow() {
    setDraft(new Date());
    setViewDate(new Date());
  }

  function confirm() {
    onChange(draft);
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setOpen(false);
  }

  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={`relative block w-full text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-left text-sm text-slate-700 shadow-sm transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value ? formatDateTime(value) : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-80 origin-top-left rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          {/* Month navigation */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-slate-700">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday header */}
          <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-slate-400">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">{w}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
            {cells.map(({ date, outside }, i) => {
              const disabled = !clampDate(date, minDate, maxDate);
              const selected = isSameDay(date, draft);
              const today = isSameDay(date, new Date());
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(date)}
                  className={[
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full transition",
                    outside ? "text-slate-300" : "text-slate-700",
                    disabled ? "cursor-not-allowed opacity-40" : "hover:bg-indigo-50",
                    selected ? "bg-indigo-600 text-white hover:bg-indigo-600" : "",
                    !selected && today ? "ring-1 ring-inset ring-indigo-400" : "",
                  ].join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Time controls */}
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
              </svg>
              <select
                value={hour12}
                onChange={(e) => updateHour(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                ))}
              </select>
              <span className="text-slate-400">:</span>
              <select
                value={draft.getMinutes()}
                onChange={(e) => updateMinute(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {minuteOptions.map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
              <div className="ml-1 flex overflow-hidden rounded-lg border border-slate-200">
                {["AM", "PM"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePeriod(p)}
                    className={[
                      "px-2 py-1 text-xs font-medium transition",
                      (p === "PM") === isPM
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={applyNow}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Now
            </button>
          </div>

          {/* Footer actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={clear}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Clear
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

