import * as mysql from 'mysql2/promise';
import {dbConfig} from '../config/dbConfig';


export const pool = mysql.createPool(dbConfig);
