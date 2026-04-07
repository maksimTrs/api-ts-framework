// Environment configuration — single source of truth for base URLs and credentials

export const env = {
    BASE_URL: process.env.BASE_URL ?? 'https://www.practice-react.sdetunicorns.com/api/test',
    EMAIL: process.env.EMAIL ?? 'mod@mail.com',
    PASSWORD: process.env.PASSWORD ?? 'Modpass123!',
};
