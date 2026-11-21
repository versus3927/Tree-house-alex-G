export type Mode = "pine";

export interface SceneTheme {
  sky: [string, string, string];
  sun: { color: string; x: number; y: number; opacity: number };
  moon: { x: number; y: number; opacity: number };
  stars: number;
  fireflies: number;
  cloud: { color: string; opacity: number };
  hillFar: string;
  pine: string;
  hillNear: string;
  ground: string;
  grass: string;
  trunk: string;
  trunkDark: string;
  wood: string;
  woodDark: string;
  roof: string;
  roofDark: string;
  door: string;
  leaves: [string, string, string];
  leafDark: string;
  glassOff: string;
  glassOn: string;
  glow: number;
  flag: string;
  lights: number;
}

export const SCENE: SceneTheme = {
  sky: ["#000000", "#010402", "#020a05"],
  sun: { color: "#ffd9a0", x: 585, y: 560, opacity: 0 },
  moon: { x: 625, y: 105, opacity: 1 },
  stars: 1,
  fireflies: 0.9,
  cloud: { color: "#071c0d", opacity: 0.5 },
  hillFar: "#051409",
  pine: "#041208",
  hillNear: "#081f0e",
  ground: "#092410",
  grass: "#05170a",
  trunk: "#121b14",
  trunkDark: "#0b120c",
  wood: "#1c2e22",
  woodDark: "#101c14",
  roof: "#1c211e",
  roofDark: "#101412",
  door: "#121714",
  leaves: ["#0b1f11", "#102917", "#07140a"],
  leafDark: "#040d06",
  glassOff: "#0b1c11",
  glassOn: "#ffeda8",
  glow: 1,
  flag: "#a8e8b6",
  lights: 1,
};

export const LADDER_NOTES = [60, 62, 64, 67, 69, 72, 74, 76];
export const YT_ID = "I_5lEJjGgto"; // Treehouse
export const YT_WATCH = `https://www.youtube.com/watch?v=${YT_ID}`;

/* Only official / Alex G Topic / Domino uploads */
export const SONGS = [
  { id: "I_5lEJjGgto",  title: "Treehouse",     album: "HIGH / Alex G Topic"        },
  { id: "PElHOpvqRK4",  title: "Blessing",      album: "God Save the Animals"      },
  { id: "JFaMCIVHz2I",  title: "Runner",        album: "God Save the Animals"      },
  { id: "aoR7LrNjpcQ",  title: "Cross the Sea", album: "God Save the Animals"      },
  { id: "louOvBOFPnQ",  title: "Southern Sky",  album: "House of Sugar"            },
  { id: "hQPYS4Bnv30",  title: "Hope",          album: "House of Sugar"            },
  { id: "HcO-NPtj5BI",  title: "Gretel",        album: "House of Sugar"            },
  { id: "lHOXaJlw6QU",  title: "Kicker",        album: "Beach Music"               },
  { id: "sgS49i-ddOo",  title: "Bug",           album: "Beach Music"               },
  { id: "-vxOzwDEXv0",  title: "Proud",         album: "Rocket"                    },
  { id: "nPuxLpVus-k",  title: "Bobby",         album: "Rocket"                    },
  { id: "IF48Wmz6Buk",  title: "Brick",         album: "Rocket"                    },
  { id: "Gp7yEzcxBNk",  title: "Harvey",        album: "DSU"                       },
  { id: "xKpvQRgvVJY",  title: "Forgive",       album: "God Save the Animals / Topic" },
  { id: "M1gHw1gV7-k",  title: "S.D.O.S",       album: "God Save the Animals / Topic" },
];

export const GALLERY = [
  { src: "/images/gallery/treehouse-night.jpg", alt: "A treehouse glowing at night among lush trees", caption: "Do Not Enter's written on the doorway" },
  { src: "/images/gallery/treehouse-day.jpg", alt: "A wooden treehouse in sunlit trees", caption: "The kind of place Alex wrote about at 18" },
  { src: "/images/gallery/bedroom-recording.jpg", alt: "Bedroom setup for recording", caption: "Bedroom recordings. Where the intimacy starts." },
  { src: "/images/gallery/guitar-close.jpg", alt: "Close-up of acoustic guitar strings in warm light", caption: "The guitar on Treehouse sounds like it's whispering to itself" },
  { src: "/images/gallery/philly-night.jpg", alt: "Philadelphia skyline at night", caption: "Philly at night. Where Alex G grew up and still lives." },
  { src: "/images/gallery/vinyl-turntable.jpg", alt: "Vinyl turntable spinning in warm light", caption: "Trick and Rules on vinyl. Where the early magic lives." },
  { src: "/images/gallery/two-treehouses.jpg", alt: "Rustic treehouses connected by a bridge in a forest", caption: "Two members. No vacancy." },
  { src: "/images/gallery/room-guitars.jpg", alt: "Bedroom with guitars, records, and amplifier", caption: "Every Alex G album started in a room like this" },
  { src: "/images/gallery/cassette.jpg", alt: "Cassette tape on a dark wooden surface", caption: "Before Domino, before Spotify. Bandcamp uploads and tape hiss." },
  { src: "/images/gallery/records-store.jpg", alt: "Vinyl records in a music store", caption: "DSU, Rocket, House of Sugar. Filed under life-changing." },
  { src: "/images/gallery/tree-canopy.jpg", alt: "Looking up through a green tree canopy", caption: "The view from inside the treehouse, looking up" },
  { src: "/images/gallery/fog-tree.jpg", alt: "A single tree in fog at night", caption: "I don't think I'm ever gonna let you leave" },
];

export const QUOTES = [
  { text: "Do Not Enter's written on the doorway. Why can't everyone just go away? Except you. You can stay.", note: "The opening line. The whole world in three sentences." },
  { text: "I don't think I'm ever gonna let you leave.", note: "The last thing you hear. And somehow it's not a threat." },
];

export const DISCOGRAPHY = [
  { name: "Race", year: "2011" },
  { name: "Rules", year: "2012" },
  { name: "Trick", year: "2012" },
  { name: "DSU", year: "2014" },
  { name: "Beach Music", year: "2015" },
  { name: "Rocket", year: "2017" },
  { name: "House of Sugar", year: "2019" },
  { name: "God Save the Animals", year: "2022" },
];
