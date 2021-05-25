import express from 'express';
import { AuthFailedError } from '../error/auth-failed-error';

export const responseBuilder = (err: Error, res: express.Response) => {
    if(err instanceof AuthFailedError) {
        res.set('WWW-Authenticate', 'Basic realm="tech-test-3"')
        res.status(401).send('Authentication required')    
    } else {
        res.status(500).send('Internal server error');
    }
}