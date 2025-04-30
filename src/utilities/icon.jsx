const svgsByName = {
  back: <path d="M33 50 l25 25 l4 -4 l-21 -21 l21 -21 l-4 -4 l-25 25" />,
  blank: <></>,
  caretDown: <path d="M50 70 l25 -25 l-5 -5 l-21 21 l-21 -21 l-5 5" />,
  caretUp: <path d="M50 30 l25 25 l-5 5 l-21 -21 l-21 21 l-5 -5" />,
  children: <path d="M10 25 h80 v6 h-50 l5 10 h45 v6 h-42 l5 10 h37 v6 h-40.8 l-16 -32 h-23.2 v-6" />,
  cross: <path d="M55 50 l16 -16 l-5 -5 l-16 16 l-16 -16 l-5 5 l16 16 l-16 16 l5 5 l16 -16 l16 16 l5 -5 l-16 -16" />,
  flat: <path d="M50 53.5 h25 v-7 h-52 v7" />,
  menu: <path d="M25 31 h50 v6 h-50 v-6 M25 47 h50 v6 h-50 v-6 M25 63 h50 v6 h-50 v-6" />,
  next: <path d="M70 20 v60 h15 v-60 M15 20 L15,80 L60,50" />,
  pause: <path d="M25 20 v60 h15 v-60 M75 20 v60 h-15 v-60" />,
  play: <path d="M20 15 L20 80 L80 50" />,
  plus: <path d="M53 53 v14 h-6 v-14 h-14 v-6 h14 v-14 h6 v14 h14 v6 h-14" />,
  previous: <path d='M15 20 v60 h15 v-60 M85 20 L85 80 L40 50' />,
  random: (
    <g>
      <path d="M13 77 l60 -40 l4 6 l12 -21 l-24 3 l4 6 l-60 40" />
      <path d="M14 23 l60 40 l4 -6 l12 21 l-24 -3 l4 -6 l-60 -40" />
    </g>
  ),
  revert: (
    <g transform="translate(50 50) rotate(-135 0 0)">
      <path d="M25 0 A25 25 0 1 1 0 -25 v6 A19 19 0 1 0 19 0 h-10 l13 -13 l13 13 h10" />
    </g>
  ),
  search: (
    <path d='M 5 40 a 35 35 0 0 1 70 0 h-8 a 27 27 0 0 0 -54 0 a 27 27 0 0 0 54 0 h8 a 35 35 0 0 1 -70 0
      M 62 62 l 2.8 -.8 l 28 28 l -5.6 5.6 l -28 -28' />
  ),
  up: <path d="M50 25 l25 25 l-5 5 l-21 -21 l-21 21 l-5 -5 M52 27 v50 h-6 v-50" />,
  upDown: (
    <g>
      <path d="M50 90 l25 -25 l-5 -5 l-21 21" />
      <path d="M50 90 l-25 -25 l5 -5 l21 21" />
      <path d="M50 10 l25 25 l-5 5 l-21 -21" />
      <path d="M50 10 l-25 25 l5 5 l21 -21" />
      <path d="M46.5 20 h7 v60 h-7" />
    </g>
  ),
};

function getIconSvg(name) {
  return (
    <svg id={name} viewBox="0 0 100 100">
      { svgsByName[name] }
    </svg>
  );
}

export function getIconSvgs(names) {
  const exportNames = names ?? Object.keys(svgsByName);

  return (
    <svg>
      <defs>
        { exportNames.map((name) => getIconSvg(name)) }
      </defs>
    </svg>
  );
}

export default function Icon({ name, className }) {
  return (
    <svg viewBox='0 0 1 1' className={className} fill='currentColor'>
      <use href={`#${name}`} />
    </svg>
  );
}
