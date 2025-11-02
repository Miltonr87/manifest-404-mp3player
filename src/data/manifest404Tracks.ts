export interface Track {
    id: number;
    title: string;
    artist: string;
    duration: number;
    filename: string;
    artwork?: string;
}

const PREFIX = "https://mwifzxkvrxvfneypyjla.supabase.co/storage/v1/object/public/manifest404/";

export const firewallTracksInit: Track[] = [
    {
        id: 1,
        title: 'Algorithmic Tyranny',
        artist: 'Break The Firewall',
        duration: 0,
        filename: `https://mwifzxkvrxvfneypyjla.supabase.co/storage/v1/object/public/manifest404/1_Algorithmic_Tyranny.mp3`,
    },
    {
        id: 2,
        title: 'Code Revolution',
        artist: 'Break The Firewall',
        duration: 0,
        filename: `${PREFIX}2_Code_Revolution.mp3`,
    },
    {
        id: 3,
        title: 'Pixelated Love',
        artist: 'Break The Firewall',
        duration: 0,
        filename: `${PREFIX}3_Pixelated_Love.mp3`,
    },
    {
        id: 4,
        title: 'Synthetic Addiction',
        artist: 'Break The Firewall',
        duration: 0,
        filename: `${PREFIX}4_Synthetic_Addiction.mp3`,
    },
    {
        id: 5,
        title: 'Break The Firewall',
        artist: 'Break The Firewall',
        duration: 0,
        filename: `${PREFIX}5_Break_the_Firewall.mp3`,
    },
];

export const saintsTracksInit: Track[] = [
    {
        id: 1,
        title: '404 Salvation Road',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}1_Salvation_Road.mp3`,
    },
    {
        id: 2,
        title: 'Clean Code, Dirty World',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}2_Clean_Code.mp3`,
    },
    {
        id: 3,
        title: 'Crush On Dopamine',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}3_Crush_on_Dopamine.mp3`,
    },
    {
        id: 4,
        title: 'The Great Reset',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}4_The_Great_Reset.mp3`,
    },
    {
        id: 5,
        title: 'Silicon Saints',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}5_SiliconSaints.mp3`,
    },
    {
        id: 6,
        title: 'Digital Harvest',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}6_Digital_Harvest.mp3`,
    },
    {
        id: 7,
        title: 'Angels In The Stream',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}7_Angels_Stream.mp3`,
    },
    {
        id: 8,
        title: 'Church Of The Machine',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}8_Church_the_Machine.mp3`,
    },
    {
        id: 9,
        title: 'Ghost In My Feed',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}9_Ghost_in_My_Feed.mp3`,
    },
    {
        id: 10,
        title: 'Soft Reboot',
        artist: 'Silicon Saints',
        duration: 0,
        filename: `${PREFIX}10_Soft_Reboot.mp3`,
    },
];
