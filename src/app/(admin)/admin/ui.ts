/** Shared Tailwind class strings for the admin area. */
export const ui = {
  shell: "mx-auto max-w-4xl px-5 pb-12 pt-6",
  nav: "mb-6 flex flex-wrap gap-x-5 gap-y-3 border-b border-neutral-200 pb-4 text-[0.9375rem]",
  navLink: "text-primary hover:underline",
  h1: "mb-4 text-2xl font-bold text-neutral-900",
  h2: "mt-7 mb-3 text-lg font-semibold text-neutral-900",
  table: "w-full border-collapse text-[0.9375rem]",
  th: "border-b border-neutral-200 py-2 pr-3 text-left align-top",
  td: "border-b border-neutral-100 py-2 pr-3 text-left align-top",
  actions: "my-4 flex flex-wrap gap-x-4 gap-y-2",
  button:
    "inline-block cursor-pointer rounded border-0 bg-neutral-900 px-3 py-1.5 text-sm text-white no-underline disabled:opacity-50",
  buttonSecondary:
    "inline-block cursor-pointer rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 no-underline disabled:opacity-50",
  form: "flex max-w-md flex-col gap-3",
  label: "flex flex-col gap-1 text-sm text-neutral-800",
  input: "rounded border border-neutral-300 p-2 font-inherit",
  textarea: "rounded border border-neutral-300 p-2 font-inherit",
  error: "text-sm text-red-700",
  hint: "text-[0.8125rem] text-neutral-600",
  suggestions: "m-0 max-h-64 list-none overflow-auto rounded border border-neutral-300 p-0",
  suggestionButton:
    "block w-full cursor-pointer border-0 border-b border-neutral-100 bg-white p-2 text-left text-sm font-inherit hover:bg-neutral-100 focus-visible:bg-neutral-100",
  checkboxList:
    "m-0 max-h-48 list-none overflow-auto rounded border border-neutral-200 p-0",
  checkboxItem: "border-b border-neutral-100 px-2 py-1.5",
  checkboxLabel: "flex items-center gap-2 text-sm",
} as const
