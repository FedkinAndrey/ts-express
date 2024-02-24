// MONGO validation

// import {
//     cleanEnv, port, str,
// } from 'envalid';
//
// export function validateEnv() {
//     cleanEnv(process.env, {
//         MONGO_PASSWORD: str(),
//         MONGO_PATH: str(),
//         MONGO_USER: str(),
//         PORT: port(),
//     });
// }

// POSTGRESQL validation

import {
    cleanEnv, port, str,
} from 'envalid';

export function validateEnv() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        POSTGRES_HOST: str(),
        POSTGRES_PORT: port(),
        POSTGRES_USER: str(),
        POSTGRES_PASSWORD: str(),
        POSTGRES_DB: str(),
        PORT: port(),
    });
}