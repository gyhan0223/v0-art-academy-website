/** Self-contained so the standalone preview can use the same function. */
export function initGrade11WinterTime(root: Element | null) {
  if (!root) return () => {};

  const daysInput = root.querySelector<HTMLInputElement>("#g11-preparation-days");
  const hoursInput = root.querySelector<HTMLInputElement>("#g11-hours-per-day");
  if (!daysInput || !hoursInput) return () => {};

  const readValue = (input: HTMLInputElement, fallback: number, lower: number, upper: number) => {
    const rawMin = Number(input.min);
    const rawMax = Number(input.max);
    const min = input.min !== "" && Number.isFinite(rawMin) ? rawMin : lower;
    const max = input.max !== "" && Number.isFinite(rawMax) && rawMax >= min ? rawMax : Math.max(min, upper);
    const rawValue = Number(input.value);
    const value = input.value !== "" && Number.isFinite(rawValue) ? rawValue : fallback;
    const clamped = Math.min(max, Math.max(min, Math.round(value)));
    input.value = String(clamped);
    return clamped;
  };

  const updateValues = (selector: string, value: string) => {
    for (const element of Array.from(root.querySelectorAll<HTMLElement>(selector))) {
      if (element.tagName === "OUTPUT") (element as HTMLOutputElement).value = value;
      else element.textContent = value;
    }
  };

  const update = () => {
    const days = readValue(daysInput, 40, 14, 60);
    const hours = readValue(hoursInput, 6, 2, 8);
    updateValues("[data-time-days-value]", String(days));
    updateValues("[data-time-hours-value]", String(hours));
    updateValues("[data-time-total]", String(days * hours));
    updateValues("[data-time-caption]", `${days}일 동안, 하루 ${hours}시간씩 준비한다면.`);
    for (const day of Array.from(root.querySelectorAll<HTMLElement>("[data-time-day]"))) {
      const number = Number(day.dataset.timeDay);
      day.hidden = !Number.isFinite(number) || number > days;
    }
  };

  daysInput.addEventListener("input", update);
  hoursInput.addEventListener("input", update);
  update();

  return () => {
    daysInput.removeEventListener("input", update);
    hoursInput.removeEventListener("input", update);
  };
}
